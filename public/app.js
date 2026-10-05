// ========================================================
// TRANSLATIONS (EN / SV)
// ========================================================
const TRANSLATIONS = {
  en: {
    appTitle: 'Untappd & Systembolaget Hub',
    appSubtitle: 'Scrape your Untappd check-ins and match with Swedish Systembolaget',
    tabDashboard: '⚙️ Dashboard',
    tabExplorer: '🍺 Matched Beers',
    cardUntappdTitle: 'Untappd Account',
    cardCatalogTitle: 'Systembolaget Catalog',
    cardCheckinsTitle: 'Untappd Check-ins',
    cardMatchedTitle: 'Matched Beers',
    clickToBrowse: 'Click to browse findings ➔',
    gateTitle: 'Connect Your Untappd Account',
    gateDesc: 'Choose how you would like to connect your Untappd account:',
    quickBadge: '⚡ Option 1 — Fastest (No Cookie Required)',
    quickTitle: 'Quick Sync with Username',
    quickDesc: 'Instant setup. Scrapes your recent check-ins from your public Untappd profile and matches with Systembolaget in seconds.',
    btnQuickConnect: 'Connect & Quick Sync',
    gateOr: '— OR —',
    fullBadge: '🍺 Option 2 — Full Lifetime History',
    fullTitle: 'Full Sync (All Past Beers + Flavors)',
    fullDesc: 'Paginates through your entire Untappd history (500+ beers). Requires your session cookie once.',
    btnShowCookie: '▼ Show Cookie Setup',
    btnHideCookie: '▲ Hide Cookie Setup',
    guideTitle: 'How to get your session cookie in 3 simple steps:',
    step1Title: 'Log in to Untappd',
    step1Desc: 'Open <a href="https://untappd.com" target="_blank" rel="noopener">untappd.com</a> in your regular browser (Chrome, Edge, Firefox, Safari) and make sure you are signed in.',
    step2Title: 'Open Developer Tools (F12)',
    step2Desc: 'Press <kbd>F12</kbd> (or right-click ➔ <em>Inspect</em>), switch to the <b>Network</b> tab, and refresh the page (<kbd>F5</kbd>).',
    step3Title: 'Copy the Cookie Header',
    step3Desc: 'Click the top request (e.g. <code>home</code>), scroll to <b>Request Headers</b>, right-click <code>Cookie:</code> and select <b>Copy value</b>.',
    guideTip: '<b>Alternative:</b> Use a browser extension like <a href="https://cookie-editor.com" target="_blank" rel="noopener">Cookie-Editor</a> to export the cookie in 1 click.',
    labelUsername: 'Untappd Username:',
    labelCookie: 'Cookie Header String:',
    btnPasteClipboard: '📋 Paste from Clipboard',
    btnSaveCreds: 'Save Full Credentials',
    btnTestConn: 'Test Connection',
    loginHintDefault: '🔒 Credentials and preferences are stored locally in your <code>.env</code> file on your computer and never shared.',
    heroBadge: '⚡ 1-Click Automated Sync',
    heroTitle: 'Sync & Match Untappd with Systembolaget',
    heroDesc: 'Scrapes your latest check-ins from Untappd and automatically matches them with Systembolaget\'s current catalog in one step.',
    btnOneClickSync: 'Sync & Match Now',
    btnStopScrape: 'Stop',
    btnBrowseMatched: 'Browse Matched Beers',
    pipelineReady: 'Ready to sync. Click "Sync & Match Now".',
    btnAdvancedTools: 'Advanced Tools & Individual Steps',
    advScraperTitle: 'Scraper Options',
    advScraperDesc: 'Run a full re-scrape or refresh cached statistics.',
    advSbTitle: 'Systembolaget & Export',
    advSbDesc: 'Manually refresh catalog or re-run matcher.',
    labelScrapeMode: 'Scrape Mode:',
    optQuick: '⚡ Quick Sync (Recent check-ins - No cookie required)',
    optIncremental: 'Incremental (New check-ins only - Fastest)',
    optFull: 'Full Scrape (Re-fetch all check-ins)',
    optStats: 'Update Stats (Refresh ratings & beer stats)',
    chkFlavors: 'Include flavor profiles (adds extra phase)',
    btnStartScrape: 'Run Scraper Only',
    btnDownloadCheckins: 'Download Check-ins JSON',
    btnUpdateCatalog: 'Update Catalog',
    btnMatchBeers: 'Match Beers Only',
    btnDownloadJson: 'Download JSON',
    matcherSummary: 'Matches beer names and breweries to Systembolaget article numbers, prices, and direct links.',
    statTotalTasted: 'Total Beers Tasted',
    statOnSb: 'Available on Systembolaget',
    statAvgRating: 'Avg Your Rating',
    searchPlaceholder: 'Search by beer name, brewery, style, or article number...',
    filterSbOnly: '🏬 On Systembolaget Only',
    filterAllBeers: '🍻 All Tasted Beers',
    filterAllSortiment: 'All Sortiment',
    sortRatingDesc: '⭐ Highest Rating First',
    sortPriceAsc: '💰 Lowest Price',
    sortPriceDesc: '💰 Highest Price',
    sortGlobalDesc: '🌍 Global Rating',
    sortNameAsc: '🔤 Name (A-Z)',
    sortDateDesc: '📅 Recently Tasted',
    btnBackDashboard: '➔ Back to Dashboard',
    emptyTitle: 'No beers found',
    emptyMsg: 'Try adjusting your search query or filters.',
    btnLoadMore: 'Load More Beers',
    btnViewOnSb: 'Visa på Systembolaget',
    notInSb: 'Not in SB catalog',
    articleNr: 'Article number',
    yourRating: 'Your Rating',
    noRating: 'No Rating',
    showingBeers: 'Showing {count} of {total} beers',
    btnLogout: '🚪 Log out',
  },
  sv: {
    appTitle: 'Untappd & Systembolaget Hub',
    appSubtitle: 'Skrapa dina incheckningar från Untappd och matcha mot Systembolaget',
    tabDashboard: '⚙️ Översikt',
    tabExplorer: '🍺 Matchade öl',
    cardUntappdTitle: 'Untappd-konto',
    cardCatalogTitle: 'Systembolagets sortiment',
    cardCheckinsTitle: 'Untappd-incheckningar',
    cardMatchedTitle: 'Matchade öl',
    clickToBrowse: 'Klicka för att bläddra ➔',
    gateTitle: 'Anslut ditt Untappd-konto',
    gateDesc: 'Välj hur du vill ansluta ditt Untappd-konto:',
    quickBadge: '⚡ Alternativ 1 — Snabbast (Ingen cookie krävs)',
    quickTitle: 'Snabbsynk med användarnamn',
    quickDesc: 'Direktstart. Skrapar dina senaste incheckningar från din öppna Untappd-profil och matchar mot Systembolaget på några sekunder.',
    btnQuickConnect: 'Anslut & snabbsynka',
    gateOr: '— ELLER —',
    fullBadge: '🍺 Alternativ 2 — Fullständig historik',
    fullTitle: 'Full synk (Alla tidigare öl + smakprofiler)',
    fullDesc: 'Hämtar hela ditt Untappd-arkiv (500+ öl). Kräver din session-cookie en gång.',
    btnShowCookie: '▼ Visa cookie-guide & formulär',
    btnHideCookie: '▲ Dölj cookie-formulär',
    guideTitle: 'Så hämtar du din session-cookie i 3 enkla steg:',
    step1Title: 'Logga in på Untappd',
    step1Desc: 'Öppna <a href="https://untappd.com" target="_blank" rel="noopener">untappd.com</a> i din vanliga webbläsare (Chrome, Edge, Firefox, Safari) och se till att du är inloggad.',
    step2Title: 'Öppna utvecklarverktygen (F12)',
    step2Desc: 'Tryck <kbd>F12</kbd> (eller högerklicka ➔ <em>Inspektera</em>), välj fliken <b>Nätverk</b> (Network) och ladda om sidan (<kbd>F5</kbd>).',
    step3Title: 'Kopiera Cookie-headern',
    step3Desc: 'Klicka på översta anropet (t.ex. <code>home</code>), scrolla till <b>Request Headers</b>, högerklicka på <code>Cookie:</code> och välj <b>Kopiera värde</b> (Copy value).',
    guideTip: '<b>Alternativ:</b> Använd ett webbläsartillägg som <a href="https://cookie-editor.com" target="_blank" rel="noopener">Cookie-Editor</a> för att kopiera kakan med 1 klick.',
    labelUsername: 'Untappd användarnamn:',
    labelCookie: 'Cookie-sträng:',
    btnPasteClipboard: '📋 Klistra in från urklipp',
    btnSaveCreds: 'Spara fullständiga uppgifter',
    btnTestConn: 'Testa anslutning',
    loginHintDefault: '🔒 Uppgifterna sparas lokalt i din <code>.env</code>-fil på datorn och delas aldrig externt.',
    heroBadge: '⚡ Automatisk 1-klicks-synk',
    heroTitle: 'Synka & matcha Untappd mot Systembolaget',
    heroDesc: 'Skrapar dina senaste incheckningar från Untappd och matchar dem automatiskt mot Systembolagets sortiment i ett enda steg.',
    btnOneClickSync: 'Synka & matcha nu',
    btnStopScrape: 'Stoppa',
    btnBrowseMatched: 'Bläddra bland matchade öl',
    pipelineReady: 'Redo att synka. Klicka "Synka & matcha nu".',
    btnAdvancedTools: 'Avancerade verktyg & enskilda steg',
    advScraperTitle: 'Skrapningsalternativ',
    advScraperDesc: 'Kör en full skrapning eller uppdatera cachad statistik.',
    advSbTitle: 'Systembolaget & Export',
    advSbDesc: 'Uppdatera sortiment manuellt eller kör endast matchning.',
    labelScrapeMode: 'Skrapningsläge:',
    optQuick: '⚡ Snabbsynk (Senaste incheckningar — Ingen cookie krävs)',
    optIncremental: 'Inkrementell (Endast nya - Snabbast)',
    optFull: 'Full skrapning (Hämta alla incheckningar)',
    optStats: 'Uppdatera statistik (Betyg & statistik)',
    chkFlavors: 'Inkludera smakprofiler (lägger till extra fas)',
    btnStartScrape: 'Kör endast skrapare',
    btnDownloadCheckins: 'Ladda ner incheckningar (JSON)',
    btnUpdateCatalog: 'Uppdatera sortiment',
    btnMatchBeers: 'Matcha endast öl',
    btnDownloadJson: 'Ladda ner JSON',
    matcherSummary: 'Matchar öl- och bryggerinamn mot Systembolagets artikelnummer, priser och direktlänkar.',
    statTotalTasted: 'Totalt provade öl',
    statOnSb: 'Finns på Systembolaget',
    statAvgRating: 'Ditt medelbetyg',
    searchPlaceholder: 'Sök på ölnamn, bryggeri, stil eller artikelnummer...',
    filterSbOnly: '🏬 Endast på Systembolaget',
    filterAllBeers: '🍻 Alla provade öl',
    filterAllSortiment: 'Alla sortiment',
    sortRatingDesc: '⭐ Högsta betyg först',
    sortPriceAsc: '💰 Lägsta pris',
    sortPriceDesc: '💰 Högsta pris',
    sortGlobalDesc: '🌍 Globalt betyg',
    sortNameAsc: '🔤 Namn (A-Ö)',
    sortDateDesc: '📅 Nyligen provade',
    btnBackDashboard: '➔ Tillbaka till översikt',
    emptyTitle: 'Inga öl hittades',
    emptyMsg: 'Prova att ändra din sökning eller filtren.',
    btnLoadMore: 'Ladda fler öl',
    btnViewOnSb: 'Visa på Systembolaget',
    notInSb: 'Ej i SB-sortiment',
    articleNr: 'Artikelnummer',
    yourRating: 'Ditt betyg',
    noRating: 'Inget betyg',
    showingBeers: 'Visar {count} av {total} öl',
    btnLogout: '🚪 Logga ut',
  },
};

let currentLang = localStorage.getItem('app_lang') || 'en';

function t(key, vars = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  let str = dict[key] || TRANSLATIONS.en[key] || key;
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

// State
let appStatus = null;
let allBeers = [];
let filteredBeers = [];
let displayedBeersCount = 30;
const BEERS_PER_PAGE = 30;

// Views & Navigation
const mainNavTabs = document.getElementById('mainNavTabs');
const tabDashboard = document.getElementById('tabDashboard');
const tabExplorer = document.getElementById('tabExplorer');
const viewLoginGate = document.getElementById('viewLoginGate');
const viewDashboard = document.getElementById('viewDashboard');
const viewExplorer = document.getElementById('viewExplorer');
const navBeerBadge = document.getElementById('navBeerBadge');
const btnLogout = document.getElementById('btnLogout');
const btnLangEn = document.getElementById('btnLangEn');
const btnLangSv = document.getElementById('btnLangSv');
const globalStatusBadge = document.getElementById('globalStatusBadge');
const globalStatusText = document.getElementById('globalStatusText');

// Login Gate Elements
const gateManualAuthArea = document.getElementById('gateManualAuthArea');
const gateInputUsername = document.getElementById('gateInputUsername');
const gateInputCookie = document.getElementById('gateInputCookie');
const btnGateQuickConnect = document.getElementById('btnGateQuickConnect');
const btnToggleFullSync = document.getElementById('btnToggleFullSync');
const btnToggleFullDetails = document.getElementById('btnToggleFullDetails');
const fullSyncDetailsArea = document.getElementById('fullSyncDetailsArea');
const txtToggleFull = document.getElementById('txtToggleFull');
const btnPasteClipboard = document.getElementById('btnPasteClipboard');
const btnGateSaveManual = document.getElementById('btnGateSaveManual');
const btnGateVerify = document.getElementById('btnGateVerify');
const gateLoginHint = document.getElementById('gateLoginHint');

// 1-Click Hero Sync Elements
const btnOneClickSync = document.getElementById('btnOneClickSync');
const btnStopPipeline = document.getElementById('btnStopPipeline');
const btnHeroBrowse = document.getElementById('btnHeroBrowse');
const pipelineLiveBanner = document.getElementById('pipelineLiveBanner');
const pipelineLiveText = document.getElementById('pipelineLiveText');

// Status Cards Elements
const valUntappdUser = document.getElementById('valUntappdUser');
const subUntappdStatus = document.getElementById('subUntappdStatus');
const valCatalog = document.getElementById('valCatalog');
const subCatalog = document.getElementById('subCatalog');
const valCheckins = document.getElementById('valCheckins');
const subCheckins = document.getElementById('subCheckins');
const valExport = document.getElementById('valExport');
const subExport = document.getElementById('subExport');
const cardExport = document.getElementById('cardExport');

// Advanced Tools Elements
const btnToggleAdvanced = document.getElementById('btnToggleAdvanced');
const advancedToolsArea = document.getElementById('advancedToolsArea');
const advancedArrow = document.getElementById('advancedArrow');
const scrapeMode = document.getElementById('scrapeMode');
const chkFlavors = document.getElementById('chkFlavors');
const btnManualScrape = document.getElementById('btnManualScrape');
const btnDownloadCheckins = document.getElementById('btnDownloadCheckins');
const btnSyncCatalog = document.getElementById('btnSyncCatalog');
const btnRunMatcher = document.getElementById('btnRunMatcher');
const btnDownloadExport = document.getElementById('btnDownloadExport');

// Explorer Elements
const expTotalCount = document.getElementById('expTotalCount');
const expMatchedCount = document.getElementById('expMatchedCount');
const expAvgRating = document.getElementById('expAvgRating');
const beerSearchInput = document.getElementById('beerSearchInput');
const btnClearSearch = document.getElementById('btnClearSearch');
const filterMatched = document.getElementById('filterMatched');
const filterSortiment = document.getElementById('filterSortiment');
const sortOrder = document.getElementById('sortOrder');
const resultsCountText = document.getElementById('resultsCountText');
const beersGrid = document.getElementById('beersGrid');
const beersEmptyState = document.getElementById('beersEmptyState');
const paginationArea = document.getElementById('paginationArea');
const btnLoadMore = document.getElementById('btnLoadMore');
const btnBackToDashboard = document.getElementById('btnBackToDashboard');

const toastContainer = document.getElementById('toastContainer');

// Apply language translations across DOM
function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });

  beerSearchInput.placeholder = t('searchPlaceholder');

  if (currentLang === 'en') {
    btnLangEn.classList.add('active');
    btnLangSv.classList.remove('active');
  } else {
    btnLangSv.classList.add('active');
    btnLangEn.classList.remove('active');
  }

  if (appStatus) updateUI(appStatus);
  if (filteredBeers.length > 0) renderBeersGrid();
}

btnLangEn.addEventListener('click', () => {
  if (currentLang !== 'en') {
    currentLang = 'en';
    localStorage.setItem('app_lang', 'en');
    applyLanguage();
    showToast('Language Changed', 'English is now selected.', 'info', 2000);
  }
});

btnLangSv.addEventListener('click', () => {
  if (currentLang !== 'sv') {
    currentLang = 'sv';
    localStorage.setItem('app_lang', 'sv');
    applyLanguage();
    showToast('Språk ändrat', 'Svenska är nu valt.', 'info', 2000);
  }
});

// Toast Notification Manager
function showToast(title, message, type = 'info', duration = 4500) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✅',
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
  };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || 'ℹ️'}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  const dismiss = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  };

  closeBtn.addEventListener('click', dismiss);
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}

// Navigation View Switcher
function switchView(target) {
  if (target === 'explorer') {
    viewDashboard.style.display = 'none';
    viewLoginGate.style.display = 'none';
    viewExplorer.style.display = 'block';
    tabDashboard.classList.remove('active');
    tabExplorer.classList.add('active');
    loadBeersList();
  } else {
    viewExplorer.style.display = 'none';
    if (appStatus && appStatus.untappd.configured) {
      viewDashboard.style.display = 'block';
      viewLoginGate.style.display = 'none';
    } else {
      viewLoginGate.style.display = 'block';
      viewDashboard.style.display = 'none';
    }
    tabExplorer.classList.remove('active');
    tabDashboard.classList.add('active');
  }
}

tabDashboard.addEventListener('click', () => switchView('dashboard'));
tabExplorer.addEventListener('click', () => switchView('explorer'));
btnHeroBrowse.addEventListener('click', () => switchView('explorer'));
btnBackToDashboard.addEventListener('click', () => switchView('dashboard'));
cardExport.addEventListener('click', () => switchView('explorer'));

// Fetch Server Status
async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    updateUI(data);
  } catch (err) {
    showToast('Connection Error', `Failed to contact local server: ${err.message}`, 'error');
  }
}

// Update UI
function updateUI(status) {
  appStatus = status;

  const isConnected = status.untappd.configured;

  // Header status pill & visibility gate
  const dot = globalStatusBadge.querySelector('.badge-dot');

  if (isConnected) {
    dot.className = 'badge-dot connected';
    const modeBadge = status.untappd.isQuickMode
      ? (currentLang === 'sv' ? ' (Snabbsynk)' : ' (Quick Sync)')
      : (currentLang === 'sv' ? ' (Full synk)' : ' (Full Sync)');
    globalStatusText.textContent = `${currentLang === 'sv' ? 'Ansluten' : 'Connected'}: @${status.untappd.username}${modeBadge}`;
    mainNavTabs.style.display = 'flex';
    btnLogout.style.display = 'inline-flex';

    viewLoginGate.style.display = 'none';
    if (viewExplorer.style.display !== 'block') {
      viewDashboard.style.display = 'block';
    }

    valUntappdUser.textContent = `@${status.untappd.username}`;
    valUntappdUser.style.color = 'var(--accent-dark)';
    if (status.untappd.isQuickMode) {
      subUntappdStatus.textContent = currentLang === 'sv' ? '⚡ Snabbsynk (Öppen profil)' : '⚡ Quick Sync (Public Profile)';
    } else {
      subUntappdStatus.textContent = currentLang === 'sv' ? '🍺 Full synk (Autentiserad)' : '🍺 Full Sync (Authenticated)';
    }
  } else {
    dot.className = 'badge-dot';
    globalStatusText.textContent = currentLang === 'sv' ? 'Untappd ej ansluten' : 'Untappd Disconnected';
    mainNavTabs.style.display = 'none';
    btnLogout.style.display = 'none';

    viewDashboard.style.display = 'none';
    viewExplorer.style.display = 'none';
    viewLoginGate.style.display = 'block';
    if (!gateInputUsername.value && status.untappd && status.untappd.username) {
      gateInputUsername.value = status.untappd.username;
    }
    tabDashboard.classList.add('active');
    tabExplorer.classList.remove('active');
  }

  // Systembolaget Catalog Card
  if (status.systembolaget.exists) {
    valCatalog.textContent = `${status.systembolaget.sizeMb} MB`;
    valCatalog.style.color = 'var(--text-main)';
    const dateStr = status.systembolaget.modified
      ? new Date(status.systembolaget.modified).toLocaleDateString()
      : 'Ready';
    subCatalog.textContent = `${currentLang === 'sv' ? 'Uppdaterad' : 'Updated'}: ${dateStr}`;
  } else {
    valCatalog.textContent = currentLang === 'sv' ? 'Saknas' : 'Missing';
    valCatalog.style.color = 'var(--danger)';
    subCatalog.textContent = currentLang === 'sv' ? 'Uppdateras vid synk' : 'Will sync automatically';
  }

  // Checkins Card
  valCheckins.textContent = status.checkins.count ? status.checkins.count.toLocaleString() : '0';
  if (status.checkins.exists) {
    const dateStr = status.checkins.modified
      ? new Date(status.checkins.modified).toLocaleDateString()
      : 'Ready';
    subCheckins.textContent = `${currentLang === 'sv' ? 'Uppdaterad' : 'Updated'}: ${dateStr}`;
    btnDownloadCheckins.style.display = 'inline-flex';
  } else {
    subCheckins.textContent = currentLang === 'sv' ? 'Inga incheckningar sparade' : 'No checkins saved yet';
    btnDownloadCheckins.style.display = 'none';
  }

  // Export Card
  const exportCount = status.export.itemsCount || 0;
  valExport.textContent = exportCount.toLocaleString();
  navBeerBadge.textContent = exportCount.toLocaleString();

  if (status.export.exists) {
    const dateStr = status.export.modified
      ? new Date(status.export.modified).toLocaleDateString()
      : 'Ready';
    subExport.textContent = `${currentLang === 'sv' ? 'Uppdaterad' : 'Updated'}: ${dateStr} • ${t('clickToBrowse')}`;
    btnDownloadExport.style.display = 'inline-flex';
  } else {
    subExport.textContent = currentLang === 'sv' ? 'Inte matchad ännu' : 'Not matched yet';
    btnDownloadExport.style.display = 'none';
  }

  // Running state (scraper or 1-click pipeline)
  const isRunning = status.scraper.running || (status.pipeline && status.pipeline.running);
  if (isRunning) {
    btnOneClickSync.style.display = 'none';
    btnStopPipeline.style.display = 'inline-flex';
    pipelineLiveBanner.className = 'inline-status-banner hero-progress-banner running';
  } else {
    btnOneClickSync.style.display = 'inline-flex';
    btnStopPipeline.style.display = 'none';
    pipelineLiveBanner.className = 'inline-status-banner hero-progress-banner';
    if (!pipelineLiveText.textContent.includes('finished') && !pipelineLiveText.textContent.includes('klar') && !pipelineLiveText.textContent.includes('...')) {
      pipelineLiveText.textContent = status.checkins.exists
        ? `${currentLang === 'sv' ? 'Redo att synka' : 'Ready to sync'}. (${status.checkins.count} ${currentLang === 'sv' ? 'incheckningar sparade' : 'check-ins saved'})`
        : t('pipelineReady');
    }
  }
}

// Server-Sent Events setup
function initSSE() {
  const eventSource = new EventSource('/api/events');

  eventSource.addEventListener('log', (event) => {
    try {
      const data = JSON.parse(event.data);
      const { text, level } = data;

      pipelineLiveText.textContent = text;

      if (level === 'error') {
        showToast(currentLang === 'sv' ? 'Fel' : 'Error', text, 'error', 6000);
      } else if (level === 'success') {
        showToast(currentLang === 'sv' ? 'Klart' : 'Success', text, 'success', 5000);
      } else if (level === 'warn') {
        showToast(currentLang === 'sv' ? 'Obs' : 'Notice', text, 'warn', 4000);
      }
    } catch {}
  });

  eventSource.addEventListener('pipeline_complete', (event) => {
    try {
      const data = JSON.parse(event.data);
      const { matchResult } = data;
      allBeers = []; // Reset cache to force fresh reload

      showToast(
        currentLang === 'sv' ? 'Synk & matchning klar!' : 'Sync & Matching Complete!',
        currentLang === 'sv'
          ? `Matchade ${matchResult.matchedCount} av ${matchResult.totalCheckins} öl! Klicka här för att visa träffarna.`
          : `Matched ${matchResult.matchedCount} of ${matchResult.totalCheckins} beers! Click here to view findings.`,
        'success',
        7000
      );
      pipelineLiveText.textContent = currentLang === 'sv'
        ? `Matchning klar! ${matchResult.matchedCount} öl matchade mot Systembolaget.`
        : `Matching complete! ${matchResult.matchedCount} beers matched to Systembolaget.`;
    } catch {}
  });

  eventSource.addEventListener('status', (event) => {
    try {
      const data = JSON.parse(event.data);
      updateUI(data);
    } catch {}
  });

  eventSource.addEventListener('guided_login_error', (event) => {
    try {
      const data = JSON.parse(event.data);
      showToast('Login Error', data.message || 'Login failed.', 'error');
    } catch {}
  });

  eventSource.onerror = () => {};
}

// ========================================================
// 1-CLICK AUTOMATED SYNC
// ========================================================
btnOneClickSync.addEventListener('click', async () => {
  pipelineLiveText.textContent = currentLang === 'sv' ? 'Startar automatisk synk & matchning...' : 'Starting automated sync & match...';
  pipelineLiveBanner.className = 'inline-status-banner hero-progress-banner running';
  btnOneClickSync.style.display = 'none';
  btnStopPipeline.style.display = 'inline-flex';

  showToast(
    currentLang === 'sv' ? 'Synk startad' : 'Sync Started',
    currentLang === 'sv' ? 'Skrapar nya incheckningar och matchar mot Systembolaget...' : 'Scraping new check-ins and auto-matching with Systembolaget...',
    'info',
    4000
  );

  try {
    const res = await fetch('/api/pipeline/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'incremental' }),
    });
    const data = await res.json();
    if (!data.ok) {
      showToast('Error', data.error, 'error');
      btnOneClickSync.style.display = 'inline-flex';
      btnStopPipeline.style.display = 'none';
      pipelineLiveBanner.className = 'inline-status-banner hero-progress-banner';
    }
  } catch (err) {
    showToast('Error', err.message, 'error');
    btnOneClickSync.style.display = 'inline-flex';
    btnStopPipeline.style.display = 'none';
    pipelineLiveBanner.className = 'inline-status-banner hero-progress-banner';
  }
});

btnStopPipeline.addEventListener('click', async () => {
  try {
    await fetch('/api/scrape/stop', { method: 'POST' });
    showToast(currentLang === 'sv' ? 'Stoppar' : 'Stopping', currentLang === 'sv' ? 'Synk stoppas...' : 'Stopping sync...', 'warn');
  } catch (err) {
    showToast('Error', err.message, 'error');
  }
});

// Logout
btnLogout.addEventListener('click', async () => {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await res.json();
    allBeers = [];
    showToast(currentLang === 'sv' ? 'Utloggad' : 'Logged Out', currentLang === 'sv' ? 'Untappd-kontot har kopplats från.' : 'Disconnected Untappd account.', 'info');
    if (data && data.status) {
      updateUI(data.status);
    } else {
      await fetchStatus();
    }
    switchView('dashboard');
  } catch (err) {
    showToast('Error', err.message, 'error');
  }
});

// Advanced Tools Toggle
btnToggleAdvanced.addEventListener('click', () => {
  const isHidden = advancedToolsArea.style.display === 'none';
  advancedToolsArea.style.display = isHidden ? 'grid' : 'none';
  advancedArrow.textContent = isHidden ? '▲' : '▼';
});

btnManualScrape.addEventListener('click', async () => {
  const mode = scrapeMode.value;
  const includeFlavors = chkFlavors.checked;

  try {
    const res = await fetch('/api/scrape/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, includeFlavors }),
    });
    const data = await res.json();
    if (!data.ok) {
      showToast('Scraper Error', data.error, 'error');
    } else {
      showToast(currentLang === 'sv' ? 'Skrapning startad' : 'Scraper Started', `${mode}...`, 'info');
    }
  } catch (err) {
    showToast('Request Failed', err.message, 'error');
  }
});

btnSyncCatalog.addEventListener('click', async () => {
  btnSyncCatalog.disabled = true;
  showToast(currentLang === 'sv' ? 'Uppdaterar sortiment' : 'Catalog Sync', currentLang === 'sv' ? 'Laddar ner sortiment...' : 'Downloading catalog...', 'info');

  try {
    await fetch('/api/systembolaget/sync', { method: 'POST' });
  } catch (err) {
    showToast('Sync Error', err.message, 'error');
  } finally {
    setTimeout(() => {
      btnSyncCatalog.disabled = false;
    }, 2000);
  }
});

btnRunMatcher.addEventListener('click', async () => {
  btnRunMatcher.disabled = true;
  showToast(currentLang === 'sv' ? 'Matchar' : 'Matching', currentLang === 'sv' ? 'Jämför öl mot sortimentet...' : 'Comparing beers with catalog...', 'info');

  try {
    const res = await fetch('/api/systembolaget/match', { method: 'POST' });
    const data = await res.json();
    if (!data.ok) {
      showToast('Matching Failed', data.error, 'error');
    } else {
      const { matchedCount, totalCheckins, matchRate } = data.result;
      showToast(
        currentLang === 'sv' ? 'Matchning klar!' : 'Matching Complete!',
        currentLang === 'sv'
          ? `Matchade ${matchedCount} av ${totalCheckins} incheckningar (${matchRate}%).`
          : `Matched ${matchedCount} / ${totalCheckins} checkins (${matchRate}% match rate).`,
        'success',
        6000
      );
      allBeers = [];
      fetchStatus();
    }
  } catch (err) {
    showToast('Matching Error', err.message, 'error');
  } finally {
    btnRunMatcher.disabled = false;
  }
});

// ========================================================
// LOGIN GATE ACTIONS
// ========================================================
if (btnGateQuickConnect) {
  btnGateQuickConnect.addEventListener('click', async () => {
    const username = gateInputUsername.value.trim();
    if (!username) {
      showToast(
        currentLang === 'sv' ? 'Användarnamn saknas' : 'Missing Username',
        currentLang === 'sv' ? 'Fyll i ditt Untappd användarnamn.' : 'Please enter your Untappd username.',
        'warn'
      );
      gateInputUsername.focus();
      return;
    }

    btnGateQuickConnect.disabled = true;
    showToast(
      currentLang === 'sv' ? 'Ansluter snabbsynk' : 'Connecting Quick Sync',
      currentLang === 'sv' ? `Hämtar profil och senaste öl för @${username}...` : `Fetching public profile & recent check-ins for @${username}...`,
      'info',
      8000
    );

    try {
      const res = await fetch('/api/auth/quick-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.ok) {
        showToast(
          currentLang === 'sv' ? 'Ansluten!' : 'Connected!',
          currentLang === 'sv'
            ? `@${username} ansluten i Snabbsynk-läge! Hämtade ${data.scrapeResult?.recentCount || 0} senaste öl.`
            : `Connected @${username} via Quick Sync! Fetched ${data.scrapeResult?.recentCount || 0} recent beers.`,
          'success',
          5000
        );
        fetchStatus();
      } else {
        showToast(
          currentLang === 'sv' ? 'Anslutningsfel' : 'Connection Error',
          data.error || 'Failed to connect.',
          'error',
          7000
        );
      }
    } catch (err) {
      showToast('Quick Connect Failed', err.message, 'error');
    } finally {
      btnGateQuickConnect.disabled = false;
    }
  });
}

if (btnToggleFullSync || btnToggleFullDetails) {
  const toggleHandler = () => {
    if (!fullSyncDetailsArea) return;
    const isHidden = fullSyncDetailsArea.style.display === 'none';
    fullSyncDetailsArea.style.display = isHidden ? 'block' : 'none';
    if (txtToggleFull) {
      txtToggleFull.textContent = isHidden ? t('btnHideCookie') : t('btnShowCookie');
    }
  };
  if (btnToggleFullSync) {
    btnToggleFullSync.addEventListener('click', (e) => {
      if (fullSyncDetailsArea && !fullSyncDetailsArea.contains(e.target)) {
        toggleHandler();
      }
    });
  }
  if (btnToggleFullDetails) {
    btnToggleFullDetails.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHandler();
    });
  }
}

if (btnPasteClipboard) {
  btnPasteClipboard.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        gateInputCookie.value = text.trim();
        showToast('Pasted', currentLang === 'sv' ? 'Klistrade in från urklipp!' : 'Pasted from clipboard!', 'info', 2000);
      }
    } catch {
      gateInputCookie.focus();
      showToast('Notice', currentLang === 'sv' ? 'Använd Ctrl+V för att klistra in.' : 'Please use Ctrl+V to paste.', 'warn');
    }
  });
}

btnGateSaveManual.addEventListener('click', async () => {
  const username = gateInputUsername.value.trim();
  const cookie = gateInputCookie.value.trim();

  if (!username) {
    showToast(currentLang === 'sv' ? 'Fält saknas' : 'Missing Field', currentLang === 'sv' ? 'Fyll i ditt Untappd användarnamn.' : 'Please enter your Untappd username.', 'warn');
    return;
  }
  if (!cookie) {
    showToast(currentLang === 'sv' ? 'Fält saknas' : 'Missing Field', currentLang === 'sv' ? 'Klistra in din cookie-sträng.' : 'Please paste your cookie string.', 'warn');
    return;
  }

  try {
    const res = await fetch('/api/auth/save-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, cookie }),
    });
    const data = await res.json();
    if (data.ok) {
      showToast(currentLang === 'sv' ? 'Sparat' : 'Saved', `${currentLang === 'sv' ? 'Uppgifter sparade för' : 'Credentials saved for'} @${username}!`, 'success');
      fetchStatus();
    } else {
      showToast('Save Error', data.error, 'error');
    }
  } catch (err) {
    showToast('Save Error', err.message, 'error');
  }
});

btnGateVerify.addEventListener('click', async () => {
  const username = gateInputUsername.value.trim();
  const cookie = gateInputCookie.value.trim();

  btnGateVerify.disabled = true;
  showToast(currentLang === 'sv' ? 'Testar anslutning' : 'Testing Connection', currentLang === 'sv' ? 'Pingar Untappd...' : 'Pinging Untappd...', 'info');

  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, cookie }),
    });
    const data = await res.json();
    if (data.ok) {
      showToast(currentLang === 'sv' ? 'Ansluten!' : 'Connection Active!', data.message, 'success', 5000);
      fetchStatus();
    } else {
      showToast(currentLang === 'sv' ? 'Anslutning misslyckades' : 'Connection Failed', data.message, 'error', 6000);
    }
  } catch (err) {
    showToast('Test Failed', err.message, 'error');
  } finally {
    btnGateVerify.disabled = false;
  }
});

// ========================================================
// BEERS EXPLORER LOGIC
// ========================================================
async function loadBeersList() {
  if (allBeers.length > 0) {
    applyBeerFilters();
    return;
  }

  beersGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">${currentLang === 'sv' ? 'Laddar öldatabas...' : 'Loading beer database...'}</div>`;

  try {
    const res = await fetch('/api/beers');
    const data = await res.json();

    if (!data.ok || !data.beers || data.beers.length === 0) {
      beersGrid.innerHTML = '';
      beersEmptyState.style.display = 'block';
      return;
    }

    allBeers = data.beers;
    navBeerBadge.textContent = data.matched.toLocaleString();

    // Summary stats
    expTotalCount.textContent = data.total.toLocaleString();
    expMatchedCount.textContent = data.matched.toLocaleString();

    const ratedBeers = allBeers.filter((b) => b.rating > 0);
    if (ratedBeers.length > 0) {
      const avg = ratedBeers.reduce((acc, b) => acc + b.rating, 0) / ratedBeers.length;
      expAvgRating.textContent = `⭐ ${avg.toFixed(2)}`;
    } else {
      expAvgRating.textContent = '-';
    }

    applyBeerFilters();
  } catch (err) {
    showToast('Load Error', `Failed to load beers: ${err.message}`, 'error');
  }
}

function applyBeerFilters() {
  const query = beerSearchInput.value.trim().toLowerCase();
  const matchFilter = filterMatched.value;
  const sortimentFilter = filterSortiment.value;
  const sort = sortOrder.value;

  btnClearSearch.style.display = query ? 'block' : 'none';

  filteredBeers = allBeers.filter((beer) => {
    if (matchFilter === 'matched' && !beer.isMatched) {
      return false;
    }

    if (sortimentFilter !== 'all') {
      if (!beer.assortmentText || !beer.assortmentText.toLowerCase().includes(sortimentFilter.toLowerCase())) {
        return false;
      }
    }

    if (query) {
      const name = (beer.name || '').toLowerCase();
      const producer = (beer.producer || '').toLowerCase();
      const style = (beer.style || '').toLowerCase();
      const nr = String(beer.productNumber || '');
      const match =
        name.includes(query) || producer.includes(query) || style.includes(query) || nr.includes(query);
      if (!match) return false;
    }

    return true;
  });

  // Sorting
  filteredBeers.sort((a, b) => {
    switch (sort) {
      case 'rating_desc':
        return (b.rating || 0) - (a.rating || 0) || (b.globalRating || 0) - (a.globalRating || 0);
      case 'price_asc':
        return (a.price || 9999) - (b.price || 9999);
      case 'price_desc':
        return (b.price || 0) - (a.price || 0);
      case 'global_desc':
        return (b.globalRating || 0) - (a.globalRating || 0);
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'date_desc':
        return (b.tastedAt || 0) - (a.tastedAt || 0);
      default:
        return 0;
    }
  });

  displayedBeersCount = BEERS_PER_PAGE;
  renderBeersGrid();
}

function renderBeersGrid() {
  beersGrid.innerHTML = '';

  const total = filteredBeers.length;
  resultsCountText.textContent = t('showingBeers', {
    count: Math.min(displayedBeersCount, total),
    total: total.toLocaleString(),
  });

  if (total === 0) {
    beersEmptyState.style.display = 'block';
    paginationArea.style.display = 'none';
    return;
  }

  beersEmptyState.style.display = 'none';
  const slice = filteredBeers.slice(0, displayedBeersCount);

  for (const beer of slice) {
    const card = document.createElement('div');
    card.className = 'beer-card';

    const personalRatingHtml =
      beer.rating > 0
        ? `<span class="rating-personal">⭐ ${beer.rating} <span style="font-weight: normal; font-size: 0.75rem; color: var(--text-dim);">${t('yourRating')}</span></span>`
        : `<span class="rating-personal" style="color: var(--text-dim);">${t('noRating')}</span>`;

    const globalRatingHtml = beer.globalRating
      ? `<span class="rating-global">🌍 ${beer.globalRating} <span style="font-size: 0.75rem;">Avg</span></span>`
      : '';

    const sortimentHtml = beer.assortmentText
      ? `<span class="metric-chip sortiment-chip">${beer.assortmentText}</span>`
      : '';

    const abvHtml = beer.abv ? `<span class="metric-chip">${beer.abv}% ABV</span>` : '';
    const volHtml = beer.volume ? `<span class="metric-chip">${beer.volume} ml</span>` : '';
    const priceHtml = beer.isMatched
      ? `<span class="metric-chip price-chip">${beer.price.toFixed(2)} kr</span>`
      : '';

    const sbButtonHtml = beer.isMatched
      ? `<a href="${beer.sbUrl}" target="_blank" rel="noopener noreferrer" class="btn-sb-link">
           <span>🛒</span> ${t('btnViewOnSb')}
         </a>`
      : `<span style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 6px;">${t('notInSb')}</span>`;

    const untappdButtonHtml = beer.untappdUrl
      ? `<a href="${beer.untappdUrl}" target="_blank" rel="noopener noreferrer" class="btn-untappd-link" title="Open on Untappd">
           <span>🍺</span> Untappd
         </a>`
      : '';

    const artNumberHtml = beer.productNumber
      ? `<div class="art-number-sub">${t('articleNr')}: <strong>${beer.productNumber}</strong></div>`
      : '';

    const imageHtml = beer.imageUrl
      ? `<img src="${beer.imageUrl}" alt="${beer.name}" class="beer-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><span class="beer-fallback-icon" style="display:none;">🍺</span>`
      : `<span class="beer-fallback-icon">🍺</span>`;

    card.innerHTML = `
      <div class="beer-card-top">
        <div class="beer-thumbnail-wrap">
          ${imageHtml}
        </div>
        <div class="beer-info-main">
          <div class="beer-producer">${beer.producer || 'Unknown Brewery'}</div>
          <div class="beer-name" title="${beer.name}">${beer.name}</div>
          <span class="beer-style-badge" title="${beer.style || ''}">${beer.style || 'Beer'}</span>
        </div>
      </div>

      <div class="beer-metrics-chips">
        ${priceHtml}
        ${abvHtml}
        ${volHtml}
        ${sortimentHtml}
      </div>

      <div class="beer-ratings-row">
        ${personalRatingHtml}
        ${globalRatingHtml}
      </div>

      <div class="beer-card-actions">
        ${sbButtonHtml}
        ${untappdButtonHtml}
      </div>
      ${artNumberHtml}
    `;

    beersGrid.appendChild(card);
  }

  // Pagination button
  if (displayedBeersCount < total) {
    paginationArea.style.display = 'flex';
  } else {
    paginationArea.style.display = 'none';
  }
}

btnLoadMore.addEventListener('click', () => {
  displayedBeersCount += BEERS_PER_PAGE;
  renderBeersGrid();
});

beerSearchInput.addEventListener('input', applyBeerFilters);
btnClearSearch.addEventListener('click', () => {
  beerSearchInput.value = '';
  applyBeerFilters();
});
filterMatched.addEventListener('change', applyBeerFilters);
filterSortiment.addEventListener('change', applyBeerFilters);
sortOrder.addEventListener('change', applyBeerFilters);

// Initial boot
applyLanguage();
fetchStatus();
initSSE();
