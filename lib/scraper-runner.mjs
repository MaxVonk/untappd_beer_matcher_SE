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

  const processOutput = (data) => {
    const text = data.toString('utf8');
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        onLog(line);
      }
    }
  };

  child.stdout.on('data', processOutput);
  child.stderr.on('data', processOutput);

  child.on('close', (code) => {
    activeChildProcess = null;
    currentRunType = null;
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
