import fs from 'node:fs';
import path from 'node:path';
import { OUTPUT_DIR } from './config.mjs';

const SB_API_URL = 'https://susbolaget.emrik.org/v1/products';

/**
 * Downloads the latest Systembolaget products catalog from the community API.
 * @param {object} options
 * @param {function} [options.logger] - log callback
 */
export async function syncSystembolagetCatalog({ logger = console.log } = {}) {
  const sbFilePath = path.join(OUTPUT_DIR, 'systembolaget_products.json');
  const legacyFilePath = path.join(OUTPUT_DIR, 'systembolaget_produkter.json');
  const sbOldFilePath = path.join(OUTPUT_DIR, 'systembolaget_previous_catalog.json');
  const legacyOldFilePath = path.join(OUTPUT_DIR, 'systembolaget_förra_körningen.json');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Backup previous file if exists
  const existingPath = fs.existsSync(sbFilePath) ? sbFilePath : (fs.existsSync(legacyFilePath) ? legacyFilePath : null);
  if (existingPath) {
    try {
      fs.copyFileSync(existingPath, sbOldFilePath);
      fs.copyFileSync(existingPath, legacyOldFilePath);
      logger('Backed up previous catalog file.');
    } catch {}
  }

  logger(`Downloading latest catalog from ${SB_API_URL}... (approx. 100MB)`);
  const response = await fetch(SB_API_URL, {
    headers: {
      'User-Agent': 'UntappdScraperXL/0.9.7',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download Systembolaget catalog: HTTP ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected format received from Systembolaget API (expected JSON array).');
  }

  logger(`Received ${data.length} total items. Saving catalog...`);
  const jsonContent = JSON.stringify(data);
  fs.writeFileSync(sbFilePath, jsonContent, 'utf8');
  fs.writeFileSync(legacyFilePath, jsonContent, 'utf8');

  const beerCount = data.filter((item) => item.categoryLevel1 === 'Öl').length;
  logger(`Catalog updated successfully! Total beers in catalog: ${beerCount}.`);

  return {
    totalItems: data.length,
    totalBeers: beerCount,
    savedPath: sbFilePath,
  };
}
