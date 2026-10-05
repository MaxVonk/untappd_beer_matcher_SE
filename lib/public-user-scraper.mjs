import fs from 'node:fs';
import path from 'node:path';
import { OUTPUT_DIR } from './config.mjs';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Scrapes public check-ins from untappd.com/user/<username> without requiring a session cookie.
 * @param {string} username - Untappd username
 * @param {object} [options]
 * @param {function} [options.logger] - logging callback
 */
export async function scrapePublicProfile(username, { logger = console.log } = {}) {
  const cleanUser = String(username || '').trim();
  if (!cleanUser) {
    throw new Error('Please provide an Untappd username.');
  }

  logger(`[Public Scraper] Fetching public profile for @${cleanUser}...`);
  const profileUrl = `https://untappd.com/user/${encodeURIComponent(cleanUser)}`;

  const res = await fetch(profileUrl, {
    headers: BROWSER_HEADERS,
  });

  if (res.status === 404) {
    throw new Error(`Untappd user "@${cleanUser}" not found.`);
  }

  const html = await res.text();

  if (html.includes('set their account to be private')) {
    throw new Error(
      `@${cleanUser}'s Untappd profile is set to Private. To use Quick Sync, please set your profile to public in Untappd Settings → Privacy, or provide your session cookie for authenticated access.`
    );
  }

  if (html.includes('Just a moment') || html.includes('cf_chl_opt') || res.status === 403) {
    throw new Error('Untappd is currently protected by Cloudflare bot challenge. Please try again in a few moments or use a session cookie.');
  }

  if (!res.ok) {
    throw new Error(`Untappd returned HTTP ${res.status}`);
  }

  // Parse Profile Stats
  const totalMatch =
    html.match(/>([\d,]+)\s*<\/span>\s*<span[^>]*>\s*Total/i) ||
    html.match(/class="stat"[^>]*>[\s\S]*?([\d,]+)[\s\S]*?Total/i);
  const uniqueMatch =
    html.match(/>([\d,]+)\s*<\/span>\s*<span[^>]*>\s*Unique/i) ||
    html.match(/class="stat"[^>]*>[\s\S]*?([\d,]+)[\s\S]*?Unique/i);
  const badgesMatch =
    html.match(/>([\d,]+)\s*<\/span>\s*<span[^>]*>\s*Badges/i) ||
    html.match(/class="stat"[^>]*>[\s\S]*?([\d,]+)[\s\S]*?Badges/i);
  const avatarMatch =
    html.match(/class="user-avatar"[^>]*>\s*<img[^>]*src="([^"]+)"/) ||
    html.match(/class="avatar-holder"[\s\S]*?<img[^>]*src="([^"]+)"/);

  const totalCheckins = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : 0;
  const uniqueBeers = uniqueMatch ? parseInt(uniqueMatch[1].replace(/,/g, ''), 10) : 0;
  const totalBadges = badgesMatch ? parseInt(badgesMatch[1].replace(/,/g, ''), 10) : 0;
  const avatarUrl = avatarMatch ? avatarMatch[1] : '';

  logger(
    `[Public Scraper] Found profile: ${totalCheckins} total check-ins, ${uniqueBeers} unique beers, ${totalBadges} badges.`
  );

  // Parse Checkin Blocks
  const blocks = html.split(/<div class="checkin"/);
  const parsedCheckins = [];

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];

    // Beer name and URL
    const beerMatch = block.match(/<a[^>]*href="(\/b\/[^"]+)"[^>]*>([^<]+)<\/a>/);
    if (!beerMatch) continue;
    const beerUrl = `https://untappd.com${beerMatch[1]}`;
    const beerName = beerMatch[2].trim();

    // Brewery name and URL
    const breweryMatch = block.match(/by\s*<a\s[^>]*href="(\/(?!b\/|user\/|v\/)[^"]+)"[^>]*>([^<]+)<\/a>/i);
    const breweryName = breweryMatch ? breweryMatch[2].trim() : 'Unknown Brewery';
    const breweryUrl = breweryMatch ? `https://untappd.com${breweryMatch[1]}` : null;

    // Checkin ID & URL
    const checkinLinkMatch = block.match(/href="(\/user\/[^/]+\/checkin\/(\d+))"/);
    const checkinId = checkinLinkMatch ? parseInt(checkinLinkMatch[2], 10) : Date.now() + i;
    const checkinUrl = checkinLinkMatch
      ? `https://untappd.com${checkinLinkMatch[1]}`
      : `https://untappd.com/user/${cleanUser}/checkin/${checkinId}`;

    // Time
    const timeMatch = block.match(/class="time[^"]*"[^>]*>([^<]+)<\/a>/);
    let createdAt = new Date().toISOString();
    if (timeMatch) {
      const parsedDate = new Date(timeMatch[1].trim());
      if (!isNaN(parsedDate.getTime())) {
        createdAt = parsedDate.toISOString();
      }
    }

    // Rating
    const ratingMatch = block.match(/data-rating="([\d.]+)"/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

    // Label image
    const labelMatch = block.match(/class="label"[^>]*>\s*<img[^>]*src="([^"]+)"/);
    const labelUrl = labelMatch ? labelMatch[1] : null;

    // Comment
    const commentMatch = block.match(/<p class="comment-text">([^<]+)<\/p>/);
    const comment = commentMatch ? commentMatch[1].trim() : null;

    parsedCheckins.push({
      checkin_id: checkinId,
      checkin_url: checkinUrl,
      created_at: createdAt,
      beer: {
        name: beerName,
        url: beerUrl,
        label_url: labelUrl,
      },
      brewery: {
        name: breweryName,
        url: breweryUrl,
      },
      rating: rating,
      comment: comment,
    });
  }

  logger(`[Public Scraper] Extracted ${parsedCheckins.length} recent check-ins from public feed.`);

  // Load existing check-ins if available to merge
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const checkinsPath = path.join(OUTPUT_DIR, `${cleanUser}_checkins.json`);
  let existingCheckins = [];
  if (fs.existsSync(checkinsPath)) {
    try {
      const raw = fs.readFileSync(checkinsPath, 'utf8');
      const parsed = JSON.parse(raw);
      existingCheckins = Array.isArray(parsed) ? parsed : parsed.checkins || [];
    } catch {}
  }

  // Merge check-ins deduplicating by checkin_id or (beerName + breweryName + created_at)
  const existingMap = new Map();
  for (const c of existingCheckins) {
    const key = c.checkin_id ? String(c.checkin_id) : `${c.beer?.name}|${c.brewery?.name}`;
    existingMap.set(key, c);
  }

  let newItemsCount = 0;
  for (const c of parsedCheckins) {
    const key = c.checkin_id ? String(c.checkin_id) : `${c.beer?.name}|${c.brewery?.name}`;
    if (!existingMap.has(key)) {
      newItemsCount++;
    }
    existingMap.set(key, c);
  }

  const mergedCheckins = Array.from(existingMap.values());
  // Sort newest first
  mergedCheckins.sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });

  const payload = {
    meta: {
      user: cleanUser,
      mode: 'public_quick_sync',
      total_checkins: totalCheckins,
      unique_beers: uniqueBeers,
      badges: totalBadges,
      avatar_url: avatarUrl,
      scraped_at: new Date().toISOString(),
      recent_fetched: parsedCheckins.length,
      total_saved: mergedCheckins.length,
    },
    checkins: mergedCheckins,
  };

  fs.writeFileSync(checkinsPath, JSON.stringify(payload, null, 2), 'utf8');
  logger(`[Public Scraper] Saved ${mergedCheckins.length} check-ins to ${path.basename(checkinsPath)}.`);

  return {
    ok: true,
    user: cleanUser,
    recentCount: parsedCheckins.length,
    totalSaved: mergedCheckins.length,
    newItemsCount,
    stats: {
      total: totalCheckins,
      unique: uniqueBeers,
      badges: totalBadges,
      avatarUrl,
    },
  };
}
