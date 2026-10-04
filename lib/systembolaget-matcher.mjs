import fs from 'node:fs';
import path from 'node:path';
import { OUTPUT_DIR } from './config.mjs';

const COUNTRY_TRANSLATIONS = {
  sweden: 'Sverige',
  'united states': 'USA',
  usa: 'USA',
  belgium: 'Belgien',
  germany: 'Tyskland',
  'united kingdom': 'Storbritannien',
  england: 'England',
  scotland: 'Skottland',
  denmark: 'Danmark',
  norway: 'Norge',
  finland: 'Finland',
  netherlands: 'Nederländerna',
  france: 'Frankrike',
  italy: 'Italien',
  spain: 'Spanien',
  ireland: 'Irland',
  canada: 'Kanada',
  australia: 'Australien',
  'new zealand': 'Nya Zeeland',
};

/**
 * Extracts unique words from text, stripping common brewery and style stop-words.
 */
export function getUniqueWords(text) {
  if (!text) return new Set();
  const lower = String(text).toLowerCase();
  const cleaned = lower.replace(
    /\b(brewing|company|co|bryggeri|ab|beer|brewery|ale|brygga|bryggare|organic|eko|ekologisk|imperial|double|ipa|stout|sour|craft)\b/g,
    ' '
  );
  const words = cleaned.match(/[a-z0-9åäö]{2,}/g) || [];
  return new Set(words);
}

/**
 * Removes non-alphanumeric characters for fuzzy fallback matching.
 */
export function cleanAlphaNumeric(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9åäö]/g, '');
}

/**
 * Translates English country names to Swedish.
 */
export function getSwedishCountryName(englishCountry) {
  if (!englishCountry) return '';
  const clean = String(englishCountry).trim().toLowerCase();
  return COUNTRY_TRANSLATIONS[clean] || String(englishCountry).trim();
}

/**
 * Runs the matching engine between Untappd checkins and Systembolaget catalog.
 * @param {object} options
 * @param {string} [options.username] - untappd username
 * @param {function} [options.logger] - log callback
 */
export async function matchSystembolaget({ username, logger = console.log } = {}) {
  let sbFilePath = path.join(OUTPUT_DIR, 'systembolaget_products.json');
  if (!fs.existsSync(sbFilePath)) {
    const legacyPath = path.join(OUTPUT_DIR, 'systembolaget_produkter.json');
    if (fs.existsSync(legacyPath)) {
      sbFilePath = legacyPath;
    } else {
      throw new Error(`Systembolaget catalog not found. Please click "Update Catalog" first.`);
    }
  }

  const sbOldFilePath = path.join(OUTPUT_DIR, 'systembolaget_previous_catalog.json');
  const legacyOldPath = path.join(OUTPUT_DIR, 'systembolaget_förra_körningen.json');
  const exportFilePath = path.join(OUTPUT_DIR, 'matched_beers.json');
  const legacyExportPath = path.join(OUTPUT_DIR, 'mina_omkodade_ol.json');

  logger('Reading Systembolaget catalog...');
  const sbRaw = fs.readFileSync(sbFilePath, 'utf8');
  const sbProducts = JSON.parse(sbRaw);

  const oldProductNumbers = new Set();
  const historyPath = fs.existsSync(sbOldFilePath) ? sbOldFilePath : legacyOldPath;
  if (fs.existsSync(historyPath)) {
    try {
      const oldRaw = fs.readFileSync(historyPath, 'utf8');
      const oldProducts = JSON.parse(oldRaw);
      for (const p of oldProducts) {
        if (p.categoryLevel1 === 'Öl' && p.productNumber) {
          oldProductNumbers.add(String(p.productNumber));
        }
      }
    } catch {
      // Non-fatal
    }
  }

  const sbList = [];
  let newBeerCount = 0;
  let totalSbBeerCount = 0;

  for (const p of sbProducts) {
    if (p.categoryLevel1 === 'Öl') {
      totalSbBeerCount++;
      const nr = p.productNumber ? String(p.productNumber) : '';
      if (nr && !oldProductNumbers.has(nr) && oldProductNumbers.size > 0) {
        newBeerCount++;
      }

      const nameBold = p.productNameBold || '';
      const nameThin = p.productNameThin || '';
      const producer = p.producerName || '';

      const words = getUniqueWords(`${producer} ${nameBold} ${nameThin}`);
      const cleanString = cleanAlphaNumeric(`${producer}${nameBold}`);

      if (words.size > 0) {
        sbList.push({
          words,
          cleanString,
          productNumber: nr,
          price: parseFloat(p.price || 10.0),
          volume: parseFloat(p.volume || 330),
          assortment: p.assortment || '',
          assortmentText: p.assortmentText || '',
          country: p.country || '',
        });
      }
    }
  }

  logger(`Found ${totalSbBeerCount} beers in Systembolaget catalog.`);
  if (oldProductNumbers.size > 0) {
    logger(`Detected ${newBeerCount} brand new beers since last sync.`);
  }
  logger(`Indexed ${sbList.length} unique beer entries for fuzzy matching.`);

  // Find checkins file
  let checkinsFile = path.join(OUTPUT_DIR, `${username}_checkins.json`);
  if (!fs.existsSync(checkinsFile)) {
    const fallbackFile = path.join(OUTPUT_DIR, 'dina_untappd_checkins.json');
    if (fs.existsSync(fallbackFile)) {
      checkinsFile = fallbackFile;
    } else {
      const files = fs.readdirSync(OUTPUT_DIR);
      const match = files.find((f) => f.endsWith('_checkins.json') && !f.startsWith('.'));
      if (match) {
        checkinsFile = path.join(OUTPUT_DIR, match);
      } else {
        throw new Error(`No Untappd checkins file found in ${OUTPUT_DIR}. Please run a scrape first.`);
      }
    }
  }

  logger(`Reading Untappd checkins from: ${path.basename(checkinsFile)}...`);
  const untappdData = JSON.parse(fs.readFileSync(checkinsFile, 'utf8'));
  const checkinsList = Array.isArray(untappdData) ? untappdData : untappdData.checkins || [];

  logger(`Untappd file contains ${checkinsList.length} checkins.`);

  const matchedBeers = [];
  let matchedCount = 0;

  for (const item of checkinsList) {
    const beerInfo = item.beer || {};
    const breweryInfo = item.brewery || {};
    const purchasedInfo = item.purchased_at || {};

    const untappdBeerName = beerInfo.name || 'Unknown Beer';
    const untappdProducerRaw = (breweryInfo.name || '').trim().split(' - ')[0];

    const untappdCountryEnglish = breweryInfo.country || '';
    let selectedCountry = getSwedishCountryName(untappdCountryEnglish);

    const untappdWords = getUniqueWords(`${untappdProducerRaw} ${untappdBeerName}`);
    const untappdClean = cleanAlphaNumeric(`${untappdProducerRaw}${untappdBeerName}`);

    let sbProductNumber = '';
    let sbPrice = 25.0;
    let sbVolume = 330;
    let sbAssortment = '';
    let sbAssortmentText = '';
    let matchType = 'none';

    if (untappdWords.size > 0) {
      let bestMatch = null;
      let highestPriority = 0;

      for (const sbBeer of sbList) {
        let commonCount = 0;
        for (const w of untappdWords) {
          if (sbBeer.words.has(w)) commonCount++;
        }

        if (commonCount > highestPriority) {
          if (commonCount >= Math.max(2, Math.floor(untappdWords.size * 0.5))) {
            highestPriority = commonCount;
            bestMatch = sbBeer;
          }
        }
      }

      if (!bestMatch) {
        for (const sbBeer of sbList) {
          if (
            (untappdClean && sbBeer.cleanString.includes(untappdClean)) ||
            (sbBeer.cleanString && untappdClean.includes(sbBeer.cleanString))
          ) {
            bestMatch = sbBeer;
            break;
          }
        }
      }

      if (bestMatch) {
        sbProductNumber = bestMatch.productNumber;
        sbPrice = bestMatch.price;
        sbVolume = bestMatch.volume;
        sbAssortment = bestMatch.assortment;
        sbAssortmentText = bestMatch.assortmentText;
        if (bestMatch.country) {
          selectedCountry = bestMatch.country;
        }
        matchType = 'exact';
        matchedCount++;
      }
    }

    const personalRating = item.rating || 0;
    let timestampMs = Date.now();
    try {
      if (item.created_at) {
        timestampMs = new Date(item.created_at).getTime();
      }
    } catch {
      // fallback
    }

    const beerUrl = beerInfo.url || '';
    const productId = beerUrl ? beerUrl.split('/').filter(Boolean).pop() : '';

    const newBeer = {
      productId,
      productNameBold: untappdBeerName,
      productNameThin: '',
      producerName: untappdProducerRaw,
      price: sbPrice,
      volume: sbVolume,
      imageUrl: beerInfo.label_url || '',
      storeName: purchasedInfo.name || '',
      dateAdded: timestampMs,
      untappdGlobalRating: beerInfo.global_rating ?? null,
      untappdRating: personalRating,
      assortment: sbAssortment,
      availableAtStores: [],
      alcoholPercentage: beerInfo.abv || 0.0,
      categoryLevel3: beerInfo.style || '',
      productNumber: sbProductNumber,
      productLaunchDate: null,
      isTasted: true,
      assortmentText: sbAssortmentText,
      untappdUrl: beerUrl,
      matchedUntappdStyle: beerInfo.style || '',
      packaging: item.serving_type || '',
      isRegionalRestricted: false,
      isOnlineUnavailable: false,
      isRestocking: false,
      matchScore: matchType === 'exact' ? 100 : 47,
      matchType,
      isTastedOnly: true,
      tastedRating: personalRating,
      tastedAt: timestampMs,
      tastedStateAt: timestampMs,
      country: selectedCountry,
    };

    matchedBeers.push(newBeer);
  }

  // Backup current catalog to previous
  try {
    fs.copyFileSync(sbFilePath, sbOldFilePath);
  } catch {}

  const exportPayload = {
    format: 'untappdbolaget-backup',
    formatVersion: 1,
    exportedAt: new Date().toISOString(),
    appVersion: '1.14.1327',
    shoppingList: {
      version: 2,
      items: matchedBeers,
      splitMode: 'none',
      hideBought: false,
      showBoughtOnly: null,
      showTastedOnly: true,
      showRestockOnly: null,
    },
    account: {
      version: 1,
      manualStyles: [],
      styleOrder: [],
      styleRankTies: [],
      scoringPreferences: {
        priceImportance: 'medium',
        abvImportance: 'medium',
        styleNormalization: 'medium',
        seasonWeatherImportance: 'none',
      },
      selectedStores: [],
      themeOverride: 'double-ipa',
      colorScheme: 'auto',
      language: 'auto',
      untappdUsername: username || 'untappd_user',
      untappdRssUrl: '',
      guestMode: false,
      hideListedInPopup: false,
      popupQualification: {
        windowDays: null,
        priceMin: null,
        priceMax: null,
        minTier: null,
        topStylesOnly: null,
      },
      filters: {
        showFS: null,
        showBS: null,
        showSOON: null,
        showRestock: null,
        showNew: null,
        showRecent: false,
        showSeasonal: false,
        showLimited: null,
        showFlerpack: null,
        showPopular: null,
        categories: [],
        storeFilter: [],
        priceMin: 0,
        priceMax: 9999,
        abvMin: 0.0,
        abvMax: 50,
        untappdRatingMin: 0,
        untappdRatingMax: 5.0,
        volumeMin: 0,
        volumeMax: 9999,
        matchScoreMin: 0,
        tasteTiers: [],
        countries: [],
        searchQuery: '',
        showTasted: true,
        showListed: null,
        showBought: null,
        showReported: null,
        sortBy: 'matchScore',
        secondarySortBy: 'untappdRating',
        sortDirection: 'desc',
        secondarySortDirection: 'desc',
        showTop3: false,
      },
      listFilters: {},
      viewMode: 'cards',
      reportedPids: [],
      butlerRejections: { productIds: [], styleVerdicts: [], styleKeys: [] },
      dismissedPopupIds: [],
    },
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  fs.writeFileSync(exportFilePath, jsonStr, 'utf8');
  // Also write legacy filename for seamless Untappdbolaget compatibility
  fs.writeFileSync(legacyExportPath, jsonStr, 'utf8');

  logger(
    `Done! Matched ${matchedCount} out of ${checkinsList.length} checkins to Systembolaget article numbers.`
  );
  logger(`Saved export file to ${path.basename(exportFilePath)}.`);

  return {
    totalCheckins: checkinsList.length,
    matchedCount,
    matchRate: checkinsList.length > 0 ? Math.round((matchedCount / checkinsList.length) * 100) : 0,
    newBeersInCatalog: newBeerCount,
    exportFile: exportFilePath,
  };
}
