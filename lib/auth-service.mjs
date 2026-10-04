import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ENV_PATH = path.resolve('.env');
const ENV_EXAMPLE_PATH = path.resolve('.env.example');

/**
 * Searches common locations for Chrome / Edge / Brave / Chromium.
 */
export function findSystemBrowserPath() {
  const platform = process.platform;
  const candidates = [];

  if (platform === 'win32') {
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
    const localAppData = process.env['LOCALAPPDATA'] || '';

    candidates.push(
      path.join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(programFiles, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
      path.join(localAppData, 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe')
    );
  } else if (platform === 'darwin') {
    candidates.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    );
  } else {
    // Linux
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge',
      '/usr/bin/brave-browser'
    );
  }

  for (const p of candidates) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  return null;
}

/**
 * Updates or creates .env with given key-value pairs.
 */
export function updateEnvVariables(entries) {
  let content = '';
  if (fs.existsSync(ENV_PATH)) {
    content = fs.readFileSync(ENV_PATH, 'utf8');
  } else if (fs.existsSync(ENV_EXAMPLE_PATH)) {
    content = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf8');
  }

  for (const [key, value] of Object.entries(entries)) {
    if (value === undefined || value === null) continue;
    const escaped = String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const line = `${key}="${escaped}"`;

    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      content = `${content.trim()}\n${line}\n`;
    }
  }

  fs.writeFileSync(ENV_PATH, content.trim() + '\n', 'utf8');
}

/**
 * Reads current .env status.
 */
export function getEnvStatus() {
  let cookie = '';
  let user = '';
  let mapbox = '';

  if (fs.existsSync(ENV_PATH)) {
    const raw = fs.readFileSync(ENV_PATH, 'utf8');
    const cookieMatch = raw.match(/^UNTAPPD_COOKIE=["']?(.*?)["']?$/m);
    const userMatch = raw.match(/^UNTAPPD_USER=["']?(.*?)["']?$/m);
    const mapboxMatch = raw.match(/^MAPBOX_KEY=["']?(.*?)["']?$/m);

    if (cookieMatch) cookie = cookieMatch[1];
    if (userMatch) user = userMatch[1];
    if (mapboxMatch) mapbox = mapboxMatch[1];
  }

  const hasCookie = Boolean(
    cookie &&
      cookie.length > 20 &&
      (cookie.includes('untappd') || cookie.includes('cf_clearance') || cookie.includes('ut_d_l'))
  );

  return {
    configured: Boolean(user && hasCookie),
    username: user || '',
    cookie: cookie || '',
    hasCookie,
    cookiePreview: cookie ? cookie.slice(0, 30) + '...' : null,
    hasMapbox: Boolean(mapbox),
  };
}

let activeLoginBrowser = null;
let activeTempDir = null;

/**
 * Launches an interactive browser for the user to log in to Untappd.
 * Captures session cookies once the user logs in, updates .env, and closes the browser.
 */
export async function startGuidedLogin({ logger = console.log, onComplete, onError } = {}) {
  try {
    if (activeLoginBrowser) {
      try {
        await activeLoginBrowser.close();
      } catch {}
      activeLoginBrowser = null;
    }
    if (activeTempDir) {
      try {
        fs.rmSync(activeTempDir, { recursive: true, force: true });
      } catch {}
      activeTempDir = null;
    }

    const browserPath = findSystemBrowserPath();
    if (!browserPath) {
      throw new Error(
        'Could not find Google Chrome or Microsoft Edge installed on your system. Please enter your cookie manually.'
      );
    }

    logger(`Launching browser (${path.basename(browserPath)})...`);
    activeTempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'untappd-login-'));

    // Pre-create Default/Preferences to suppress Edge's sync confirmation wizard and first run prompts
    const defaultDir = path.join(activeTempDir, 'Default');
    fs.mkdirSync(defaultDir, { recursive: true });
    try {
      fs.writeFileSync(
        path.join(defaultDir, 'Preferences'),
        JSON.stringify({
          sync: { has_setup_completed: true, suppressed: true },
          fre: { has_user_seen_fre: true },
          signin: { allowed: false },
        })
      );
    } catch {}

    const browser = await puppeteer.launch({
      executablePath: browserPath,
      headless: false,
      userDataDir: activeTempDir,
      defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        '--start-maximized',
        '--new-window',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-fre',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=msEdgeSyncConfirmationDialog,msEdgeSync,msSync,Translate,AcceptCHFrame,MediaRouter,OptimizationHints',
        'https://untappd.com/login',
      ],
    });

    activeLoginBrowser = browser;

    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    try {
      await page.bringToFront();
    } catch {}

    // Set user agent so Cloudflare doesn't flag automated browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
    );

    if (!page.url().includes('untappd.com')) {
      logger('Navigating to Untappd login page...');
      try {
        await page.goto('https://untappd.com/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
      } catch {}
    }
    try {
      await page.bringToFront();
    } catch {}
    logger('Please log into your Untappd account in the opened browser window...');

  let checkInterval = null;
  let isDone = false;

  const cleanup = async () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    if (activeLoginBrowser === browser) {
      activeLoginBrowser = null;
    }
    try {
      if (browser.isConnected()) {
        await browser.close();
      }
    } catch {}
    if (activeTempDir) {
      try {
        fs.rmSync(activeTempDir, { recursive: true, force: true });
      } catch {}
      activeTempDir = null;
    }
  };

  browser.on('disconnected', () => {
    if (!isDone) {
      if (checkInterval) clearInterval(checkInterval);
      activeLoginBrowser = null;
      logger('Login browser window was closed.');
      if (onError) onError(new Error('Browser window was closed before login was completed.'));
      if (activeTempDir) {
        try {
          fs.rmSync(activeTempDir, { recursive: true, force: true });
        } catch {}
        activeTempDir = null;
      }
    }
  });

  checkInterval = setInterval(async () => {
    if (isDone) return;
    try {
      const cdp = await page.createCDPSession();
      const { cookies } = await cdp.send('Network.getAllCookies');

      const untappdCookies = cookies.filter(
        (c) => c.domain.includes('untappd.com') || c.domain.includes('.untappd.com')
      );

      const hasSession = untappdCookies.some(
        (c) =>
          c.name === 'untappd_user_v3_e' ||
          c.name === 'untappd_session_t' ||
          c.name === 'ut_d_l'
      );
      const currentUrl = page.url();

      // Check if logged in (URL is no longer /login or has session cookie)
      if (hasSession && (!currentUrl.includes('/login') || untappdCookies.some((c) => c.name === 'untappd_user_v3_e'))) {
        isDone = true;
        clearInterval(checkInterval);

        logger('Authentication detected! Extracting session credentials...');

        let detectedUser = null;
        try {
          detectedUser = await page.evaluate(() => {
            const userLink = document.querySelector('a[href^="/user/"]');
            if (userLink) {
              const href = userLink.getAttribute('href');
              const parts = href.split('/').filter(Boolean);
              if (parts[1]) return parts[1];
            }
            const profileText = document.querySelector('.user-profile, .username, .name');
            if (profileText && profileText.textContent) {
              return profileText.textContent.trim();
            }
            return null;
          });
        } catch {}

        const cookieHeader = untappdCookies
          .map((c) => `${c.name}=${c.value}`)
          .join('; ');

        // If username not in DOM yet, query untappd.com/home
        if (!detectedUser) {
          try {
            await page.goto('https://untappd.com/home', { waitUntil: 'domcontentloaded', timeout: 5000 });
            detectedUser = await page.evaluate(() => {
              const el = document.querySelector('a[href^="/user/"]');
              return el ? el.getAttribute('href').split('/')[2] : null;
            });
          } catch {}
        }

        const envUpdates = {
          UNTAPPD_COOKIE: cookieHeader,
        };
        if (detectedUser) {
          envUpdates.UNTAPPD_USER = detectedUser;
        }

        updateEnvVariables(envUpdates);
        logger(`Successfully connected! Untappd username: "${detectedUser || 'detected'}".`);

        await cleanup();
        if (onComplete) onComplete({ username: detectedUser, cookieHeader });
      }
    } catch (err) {
      // Ignore transient inspection errors during navigation
    }
  }, 1500);
  } catch (err) {
    if (onError) onError(err);
    throw err;
  }
}

export function cancelGuidedLogin() {
  if (activeLoginBrowser) {
    try {
      activeLoginBrowser.close();
    } catch {}
    activeLoginBrowser = null;
  }
  if (activeTempDir) {
    try {
      fs.rmSync(activeTempDir, { recursive: true, force: true });
    } catch {}
    activeTempDir = null;
  }
  return true;
}

/**
 * Validates whether the given cookie & username can successfully query Untappd.
 */
export async function verifyUntappdCredentials(cookie, username) {
  if (!cookie || !username) {
    return { ok: false, message: 'Both username and cookie are required.' };
  }

  try {
    const res = await fetch(`https://untappd.com/user/${username}`, {
      headers: {
        Cookie: cookie,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    });

    if (res.status === 200) {
      return { ok: true, message: `Successfully verified connection to @${username}!` };
    } else if (res.status === 403) {
      return { ok: false, message: 'Cloudflare blocked the request (HTTP 403). The cookie may have expired.' };
    } else if (res.status === 404) {
      return { ok: false, message: `User @${username} not found on Untappd.` };
    } else {
      return { ok: false, message: `Untappd returned HTTP ${res.status}.` };
    }
  } catch (err) {
    return { ok: false, message: `Connection failed: ${err.message}` };
  }
}
