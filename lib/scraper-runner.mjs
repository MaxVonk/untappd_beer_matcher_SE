import { spawn } from 'node:child_process';
import path from 'node:path';

let activeChildProcess = null;
let currentRunType = null;

export function isScraperRunning() {
  return Boolean(activeChildProcess && !activeChildProcess.killed);
}

export function getCurrentRunType() {
  return currentRunType;
}

/**
 * Starts a scrape run by spawning scrape.mjs as a child process.
 * @param {object} options
 * @param {'incremental'|'full'|'stats'} [options.mode='incremental']
 * @param {boolean} [options.includeFlavors=false]
 * @param {function} [options.onLog] - callback for log lines
 * @param {function} [options.onExit] - callback on process termination
 */
export function startScraper({
  mode = 'incremental',
  includeFlavors = false,
  onLog = console.log,
  onProgress = () => {},
  onExit = () => {},
} = {}) {
  if (isScraperRunning()) {
    throw new Error('A scrape is already in progress.');
  }

  const args = ['scrape.mjs'];
  if (mode === 'full') {
    args.push('--full');
  } else if (mode === 'stats') {
    args.push('--stats');
  }

  if (includeFlavors && mode !== 'stats') {
    args.push('--include-flavors');
  }

  onLog(`[System] Starting ${mode} scrape (node ${args.join(' ')})...`);
  currentRunType = mode;

  const child = spawn(process.execPath, args, {
    cwd: process.cwd(),
    env: { ...process.env },
    shell: false,
  });

  activeChildProcess = child;

  let existingCount = 0;
  let currentScrapedCount = 0;
  let totalPhase2Beers = 0;

  const parseLineForProgress = (cleanLine) => {
    // 1. Loaded existing checkins: "Loaded 123 existing checkins"
    const loadedMatch = cleanLine.match(/Loaded\s+([\d,]+)\s+existing\s+checkins/i);
    if (loadedMatch) {
      existingCount = parseInt(loadedMatch[1].replace(/,/g, ''), 10);
      currentScrapedCount = existingCount;
      onProgress({
        count: currentScrapedCount,
        phase: 'checkins',
        statusText: `Loaded ${currentScrapedCount} existing check-ins`,
      });
      return;
    }

    // 2. Incremental or Full page checkins:
    // e.g. "   → 25 on page | 25 new | 50 total new"
    // e.g. "   → 25 on page | 25 new | 50 total"
    const pageMatch = cleanLine.match(/(\d+)\s+on\s+page\s*\|\s*(\d+)\s+new\s*\|\s*([\d,]+)\s+total(?:\s+new)?/i);
    if (pageMatch) {
      const isTotalNew = cleanLine.toLowerCase().includes('total new');
      const parsedNum = parseInt(pageMatch[3].replace(/,/g, ''), 10);
      if (isTotalNew) {
        currentScrapedCount = existingCount + parsedNum;
        onProgress({
          count: currentScrapedCount,
          newCount: parsedNum,
          phase: 'checkins',
          statusText: `Scraped ${currentScrapedCount} check-ins (+${parsedNum} new)`,
        });
      } else {
        currentScrapedCount = parsedNum;
        onProgress({
          count: currentScrapedCount,
          phase: 'checkins',
          statusText: `Scraped ${currentScrapedCount} check-ins`,
        });
      }
      return;
    }

    // 3. Summary line in phase 1:
    const summaryMatch = cleanLine.match(/Summary:\s*(\d+)\s+new\s+checkins.*Total Checkins:\s*(\d+)/i);
    if (summaryMatch) {
      const count = parseInt(summaryMatch[2], 10);
      currentScrapedCount = Math.max(currentScrapedCount, count);
      onProgress({
        count: currentScrapedCount,
        phase: 'checkins',
        statusText: `Scraped ${currentScrapedCount} check-ins`,
      });
      return;
    }

    // 4. Batch flush:
    const flushMatch = cleanLine.match(/flushing\s+([\d,]+)\s+checkins/i);
    if (flushMatch) {
      const count = parseInt(flushMatch[1].replace(/,/g, ''), 10);
      currentScrapedCount = Math.max(currentScrapedCount, count);
      onProgress({
        count: currentScrapedCount,
        phase: 'checkins',
        statusText: `Saved batch of ${currentScrapedCount} check-ins`,
      });
      return;
    }

    // 5. Phase 2 start: "Phase 2: Fetching 45 new beer(s)"
    const phase2StartMatch = cleanLine.match(/Phase\s*2:\s*Fetching\s+([\d,]+)\s+new\s+beer/i);
    if (phase2StartMatch) {
      totalPhase2Beers = parseInt(phase2StartMatch[1].replace(/,/g, ''), 10);
      onProgress({
        count: 0,
        total: totalPhase2Beers,
        phase: 'details',
        statusText: `Fetching details for ${totalPhase2Beers} new beers...`,
      });
      return;
    }

    // 6. Phase 2 pool item: "Beer 12/45."
    const beerPoolMatch = cleanLine.match(/Beer\s+([\d,]+)\/([\d,]+)/i);
    if (beerPoolMatch) {
      const current = parseInt(beerPoolMatch[1].replace(/,/g, ''), 10);
      const total = parseInt(beerPoolMatch[2].replace(/,/g, ''), 10);
      onProgress({
        count: current,
        total,
        phase: 'details',
        statusText: `Fetching beer details ${current}/${total}`,
      });
      return;
    }

    // 7. Beer pool done: "45 beers fetched, 0 errors"
    const beersDoneMatch = cleanLine.match(/([\d,]+)\s+beers\s+fetched/i);
    if (beersDoneMatch) {
      const done = parseInt(beersDoneMatch[1].replace(/,/g, ''), 10);
      onProgress({
        count: done,
        total: totalPhase2Beers || done,
        phase: 'details_done',
        statusText: `Fetched ${done} beer details`,
      });
      return;
    }
  };

  const processOutput = (data) => {
    const text = data.toString('utf8');
    const lines = text.split(/[\r\n]+/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      onLog(line);
      const cleanLine = line.replace(/\u001b\[[0-9;]*m/g, '').trim();
      parseLineForProgress(cleanLine);
    }
  };

  child.stdout.on('data', processOutput);
  child.stderr.on('data', processOutput);

  child.on('close', (code) => {
    activeChildProcess = null;
    currentRunType = null;
    if (code === 0 && currentScrapedCount > 0) {
      onProgress({
        count: currentScrapedCount,
        phase: 'complete',
        statusText: `Scraping complete (${currentScrapedCount} check-ins)`,
      });
    }
    onLog(`[System] Scraper process finished with code ${code}.`);
    onExit(code);
  });

  child.on('error', (err) => {
    activeChildProcess = null;
    currentRunType = null;
    onLog(`[System] Scraper error: ${err.message}`);
    onExit(-1, err);
  });

  return child;
}

export function stopScraper() {
  if (activeChildProcess && !activeChildProcess.killed) {
    activeChildProcess.kill('SIGINT');
    activeChildProcess = null;
    currentRunType = null;
    return true;
  }
  return false;
}
