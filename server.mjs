import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getEnvStatus, updateEnvVariables, verifyUntappdCredentials } from './lib/auth-service.mjs';
import { scrapePublicProfile } from './lib/public-user-scraper.mjs';
import { isScraperRunning, getCurrentRunType, startScraper, stopScraper } from './lib/scraper-runner.mjs';
import { matchSystembolaget } from './lib/systembolaget-matcher.mjs';
import { syncSystembolagetCatalog } from './lib/systembolaget-sync.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.resolve('./output');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sseClients = new Set();
let isPipelineRunning = false;

function broadcastEvent(type, data) {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

function broadcastLog(text, level = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${text}`);
  broadcastEvent('log', { timestamp, text, level });
}

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.add(res);
  res.write(`event: connected\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

function getStats() {
  const env = getEnvStatus();

  // Checkins file
  let checkinsCount = 0;
  let checkinsModified = null;
  let checkinsFileName = null;

  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    const targetFile =
      (env.username && files.find((f) => f === `${env.username}_checkins.json`)) ||
      files.find((f) => f === 'dina_untappd_checkins.json') ||
      files.find((f) => f.endsWith('_checkins.json') && !f.startsWith('.'));

    if (targetFile) {
      checkinsFileName = targetFile;
      const fullPath = path.join(OUTPUT_DIR, targetFile);
      const stat = fs.statSync(fullPath);
      checkinsModified = stat.mtime;
      try {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const parsed = JSON.parse(raw);
        checkinsCount = Array.isArray(parsed) ? parsed.length : parsed.checkins?.length || 0;
      } catch {}
    }
  }

  // Systembolaget catalog file
  let sbCatalogExists = false;
  let sbCatalogModified = null;
  let sbCatalogSizeMb = 0;
  const sbPath = fs.existsSync(path.join(OUTPUT_DIR, 'systembolaget_products.json'))
    ? path.join(OUTPUT_DIR, 'systembolaget_products.json')
    : path.join(OUTPUT_DIR, 'systembolaget_produkter.json');

  if (fs.existsSync(sbPath)) {
    sbCatalogExists = true;
    const stat = fs.statSync(sbPath);
    sbCatalogModified = stat.mtime;
    sbCatalogSizeMb = Math.round((stat.size / (1024 * 1024)) * 10) / 10;
  }

  // Export file
  let exportExists = false;
  let exportModified = null;
  let exportItemsCount = 0;
  const exportPath = fs.existsSync(path.join(OUTPUT_DIR, 'matched_beers.json'))
    ? path.join(OUTPUT_DIR, 'matched_beers.json')
    : path.join(OUTPUT_DIR, 'mina_omkodade_ol.json');

  if (fs.existsSync(exportPath)) {
    exportExists = true;
    const stat = fs.statSync(exportPath);
    exportModified = stat.mtime;
    try {
      const raw = fs.readFileSync(exportPath, 'utf8');
      const parsed = JSON.parse(raw);
      exportItemsCount = parsed.shoppingList?.items?.length || 0;
    } catch {}
  }

  return {
    untappd: env,
    scraper: {
      running: isScraperRunning(),
      mode: getCurrentRunType(),
    },
    checkins: {
      exists: Boolean(checkinsFileName),
      fileName: checkinsFileName,
      count: checkinsCount,
      modified: checkinsModified,
    },
    systembolaget: {
      exists: sbCatalogExists,
      modified: sbCatalogModified,
      sizeMb: sbCatalogSizeMb,
    },
    export: {
      exists: exportExists,
      modified: exportModified,
      itemsCount: exportItemsCount,
    },
    pipeline: {
      running: isPipelineRunning,
    },
  };
}

app.get('/api/status', (req, res) => {
  res.json(getStats());
});

// Authentication endpoints
app.post('/api/auth/quick-connect', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ ok: false, error: 'Please enter an Untappd username.' });
    }
    const cleanUser = username.trim();
    broadcastLog(`⚡ Connecting via Quick Sync for @${cleanUser}...`, 'info');

    // Fetch public profile and recent check-ins
    const scrapeResult = await scrapePublicProfile(cleanUser, {
      logger: (msg) => broadcastLog(msg, 'info'),
    });

    // Save username in .env
    updateEnvVariables({
      UNTAPPD_USER: cleanUser,
    });
    process.env.UNTAPPD_USER = cleanUser;

    broadcastLog(`✅ Connected @${cleanUser} in Quick Sync mode! Found ${scrapeResult.recentCount} recent check-ins.`, 'success');

    // Automatically match against Systembolaget if catalog exists
    const sbPath = fs.existsSync(path.join(OUTPUT_DIR, 'systembolaget_products.json'))
      ? path.join(OUTPUT_DIR, 'systembolaget_products.json')
      : path.join(OUTPUT_DIR, 'systembolaget_produkter.json');

    if (fs.existsSync(sbPath)) {
      try {
        broadcastLog('🎯 Matching recent check-ins with Systembolaget...', 'info');
        const matchResult = await matchSystembolaget({
          username: cleanUser,
          logger: (msg) => broadcastLog(msg, 'info'),
        });
        broadcastLog(`🎉 Matched ${matchResult.matchedCount} of ${matchResult.totalCheckins} check-ins to Systembolaget!`, 'success');
        broadcastEvent('pipeline_complete', { matchResult, stats: getStats() });
      } catch (err) {
        broadcastLog(`Matching note: ${err.message}`, 'warn');
      }
    }

    const stats = getStats();
    broadcastEvent('status', stats);
    res.json({ ok: true, scrapeResult, stats });
  } catch (err) {
    broadcastLog(`Quick Connect failed: ${err.message}`, 'error');
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/auth/save-manual', (req, res) => {
  try {
    const { username, cookie, mapboxKey } = req.body;
    updateEnvVariables({
      UNTAPPD_USER: username,
      UNTAPPD_COOKIE: cookie,
      MAPBOX_KEY: mapboxKey,
    });
    process.env.UNTAPPD_USER = username;
    process.env.UNTAPPD_COOKIE = cookie;
    broadcastLog('Updated credentials manually.', 'success');
    broadcastEvent('status', getStats());
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const env = getEnvStatus();
    const username = req.body.username || env.username;
    const cookie = req.body.cookie !== undefined ? req.body.cookie : env.cookie;
    const result = await verifyUntappdCredentials(cookie, username);
    if (result.ok) {
      broadcastLog(`✅ ${result.message}`, 'success');
    } else {
      broadcastLog(`❌ ${result.message}`, 'error');
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  updateEnvVariables({
    UNTAPPD_USER: '',
    UNTAPPD_COOKIE: '',
  });
  process.env.UNTAPPD_USER = '';
  process.env.UNTAPPD_COOKIE = '';
  broadcastLog('Disconnected Untappd account.', 'info');
  const stats = getStats();
  broadcastEvent('status', stats);
  res.json({ ok: true, status: stats });
});

// 1-Click Automated Pipeline: Scrape and automatically match with Systembolaget
app.post('/api/pipeline/start', async (req, res) => {
  if (isScraperRunning() || isPipelineRunning) {
    return res.status(400).json({ ok: false, error: 'A sync or matching task is already in progress.' });
  }

  isPipelineRunning = true;
  broadcastEvent('status', getStats());
  res.json({ ok: true, message: '1-Click Pipeline started' });

  try {
    const env = getEnvStatus();
    broadcastLog('🚀 Starting 1-Click Sync & Match pipeline...', 'info');

    // 1. Ensure Systembolaget catalog exists
    const sbPath = fs.existsSync(path.join(OUTPUT_DIR, 'systembolaget_products.json'))
      ? path.join(OUTPUT_DIR, 'systembolaget_products.json')
      : path.join(OUTPUT_DIR, 'systembolaget_produkter.json');

    if (!fs.existsSync(sbPath)) {
      broadcastLog('Systembolaget catalog missing. Downloading catalog from API (~100 MB)...', 'info');
      await syncSystembolagetCatalog({ logger: (msg) => broadcastLog(msg, 'info') });
    }

    // 2. Scrape Untappd check-ins
    if (env.hasCookie) {
      broadcastLog(`⚡ Scraping Untappd check-ins (Full mode: ${req.body.mode || 'incremental'})...`, 'info');
      await new Promise((resolve, reject) => {
        startScraper({
          mode: req.body.mode || 'incremental',
          includeFlavors: req.body.includeFlavors || false,
          onLog: (line) => broadcastLog(line, 'info'),
          onExit: (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Scraper finished with code ${code}`));
          },
        });
      });
    } else {
      broadcastLog(`⚡ Scraping recent Untappd check-ins (Quick mode for public profile @${env.username})...`, 'info');
      await scrapePublicProfile(env.username, {
        logger: (line) => broadcastLog(line, 'info'),
      });
    }

    // 3. Automatically run matching immediately
    broadcastLog('🎯 Automatically matching beers with Systembolaget catalog...', 'info');
    const matchResult = await matchSystembolaget({
      username: env.username,
      logger: (msg) => broadcastLog(msg, 'info'),
    });

    broadcastLog(
      `🎉 All done! Matched ${matchResult.matchedCount} of ${matchResult.totalCheckins} check-ins to Systembolaget.`,
      'success'
    );
    broadcastEvent('pipeline_complete', { matchResult, stats: getStats() });
  } catch (err) {
    broadcastLog(`Pipeline failed: ${err.message}`, 'error');
  } finally {
    isPipelineRunning = false;
    broadcastEvent('status', getStats());
  }
});

// Scraper endpoints
app.post('/api/scrape/start', async (req, res) => {
  try {
    const { mode = 'incremental', includeFlavors = false } = req.body;
    const env = getEnvStatus();

    if (mode === 'quick' || !env.hasCookie) {
      broadcastLog(`[System] Starting Quick public scrape for @${env.username}...`, 'info');
      scrapePublicProfile(env.username, {
        logger: (line) => broadcastLog(line, 'info'),
      })
        .then((result) => {
          broadcastLog(`Quick scrape completed! Fetched ${result.recentCount} check-ins.`, 'success');
          broadcastEvent('status', getStats());
        })
        .catch((err) => {
          broadcastLog(`Quick scrape error: ${err.message}`, 'error');
        });
      return res.json({ ok: true, message: 'Quick scrape started' });
    }

    startScraper({
      mode,
      includeFlavors,
      onLog: (line) => broadcastLog(line, 'info'),
      onExit: (code) => {
        broadcastLog(`Scrape finished with status code ${code}.`, code === 0 ? 'success' : 'warn');
        broadcastEvent('status', getStats());
      },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/scrape/stop', (req, res) => {
  const stopped = stopScraper();
  broadcastLog('Requested scraper stop.', 'warn');
  broadcastEvent('status', getStats());
  res.json({ ok: true, stopped });
});

// Systembolaget endpoints
app.post('/api/systembolaget/sync', async (req, res) => {
  try {
    broadcastLog('Starting Systembolaget catalog sync...', 'info');
    res.json({ ok: true, message: 'Sync started' });

    syncSystembolagetCatalog({
      logger: (msg) => broadcastLog(msg, 'info'),
    })
      .then((result) => {
        broadcastLog(`Systembolaget sync complete! Total beers: ${result.totalBeers}`, 'success');
        broadcastEvent('status', getStats());
      })
      .catch((err) => {
        broadcastLog(`Systembolaget sync failed: ${err.message}`, 'error');
        broadcastEvent('status', getStats());
      });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/systembolaget/match', async (req, res) => {
  try {
    broadcastLog('Starting beer matching engine...', 'info');
    const env = getEnvStatus();

    const result = await matchSystembolaget({
      username: env.username,
      logger: (msg) => broadcastLog(msg, 'info'),
    });

    broadcastLog(
      `🎉 Matching complete! Matched ${result.matchedCount}/${result.totalCheckins} checkins (${result.matchRate}% match rate).`,
      'success'
    );
    broadcastEvent('status', getStats());
    res.json({ ok: true, result });
  } catch (err) {
    broadcastLog(`Matching error: ${err.message}`, 'error');
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Beers API for findings explorer
app.get('/api/beers', (req, res) => {
  const exportPath = fs.existsSync(path.join(OUTPUT_DIR, 'matched_beers.json'))
    ? path.join(OUTPUT_DIR, 'matched_beers.json')
    : path.join(OUTPUT_DIR, 'mina_omkodade_ol.json');

  if (!fs.existsSync(exportPath)) {
    return res.json({ ok: false, total: 0, matched: 0, beers: [] });
  }

  try {
    const raw = fs.readFileSync(exportPath, 'utf8');
    const parsed = JSON.parse(raw);
    const items = parsed.shoppingList?.items || [];

    const beerMap = new Map();
    for (const item of items) {
      const key = item.productId || `${item.productNameBold}___${item.producerName}`;
      if (!beerMap.has(key)) {
        beerMap.set(key, {
          id: item.productId,
          name: item.productNameBold,
          producer: item.producerName,
          price: item.price,
          volume: item.volume,
          imageUrl: item.imageUrl,
          style: item.categoryLevel3,
          abv: item.alcoholPercentage,
          productNumber: item.productNumber,
          sbUrl: item.productNumber ? `https://www.systembolaget.se/sok/?q=${item.productNumber}` : null,
          untappdUrl: item.untappdUrl,
          assortment: item.assortment,
          assortmentText: item.assortmentText,
          country: item.country,
          rating: item.untappdRating || item.tastedRating || 0,
          globalRating: item.untappdGlobalRating ? Math.round(item.untappdGlobalRating * 100) / 100 : null,
          isMatched: Boolean(item.productNumber && item.matchType === 'exact'),
          matchScore: item.matchScore,
          matchType: item.matchType,
          tastedAt: item.tastedAt,
          checkinCount: 1,
        });
      } else {
        const existing = beerMap.get(key);
        existing.checkinCount += 1;
        const currentRating = item.untappdRating || item.tastedRating || 0;
        if (currentRating > existing.rating) {
          existing.rating = currentRating;
        }
      }
    }

    const beers = Array.from(beerMap.values());
    res.json({
      ok: true,
      total: beers.length,
      matched: beers.filter((b) => b.isMatched).length,
      beers,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, beers: [] });
  }
});

// Download endpoints
app.get('/api/download/export', (req, res) => {
  const exportPath = fs.existsSync(path.join(OUTPUT_DIR, 'matched_beers.json'))
    ? path.join(OUTPUT_DIR, 'matched_beers.json')
    : path.join(OUTPUT_DIR, 'mina_omkodade_ol.json');

  if (!fs.existsSync(exportPath)) {
    return res.status(404).send('Export file not found. Please run matching first.');
  }
  res.download(exportPath, 'matched_beers.json');
});

app.get('/api/download/checkins', (req, res) => {
  const env = getEnvStatus();
  let checkinsFile = path.join(OUTPUT_DIR, `${env.username}_checkins.json`);
  if (!fs.existsSync(checkinsFile)) {
    checkinsFile = path.join(OUTPUT_DIR, 'dina_untappd_checkins.json');
  }
  if (!fs.existsSync(checkinsFile)) {
    return res.status(404).send('Checkins file not found.');
  }
  res.download(checkinsFile, path.basename(checkinsFile));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🍺 Untappd & Systembolaget Hub running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
