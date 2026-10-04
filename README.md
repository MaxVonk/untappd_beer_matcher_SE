# 🍺 Untappd & Systembolaget Hub

A modern local web dashboard to scrape your **Untappd check-in history**, cross-reference your tasted beers against Sweden's **Systembolaget retail catalog**, and explore your findings with direct product links, prices, and Untappdbolaget export.

![Untappd & Systembolaget Hub](https://assets.untappd.com/site/assets/images/temp/badge-beer-default.png)

---

## 🌟 Key Features

* **🌐 Visual Web Dashboard**: Clean local UI running at `http://localhost:3000`. No need to run manual batch scripts or edit `.env` files by hand.
* **⚡ 1-Click Automated Sync**: Single button to scrape new Untappd check-ins and immediately auto-match against the Systembolaget catalog.
* **🎯 100% Native Matching Engine**: Re-engineered in native Node.js—**no Python installation required**, no broken subprocesses or path issues.
* **🏬 Direct Systembolaget Sync**: Automatically downloads the latest ~100MB Systembolaget catalog from the public API with one click.
* **🔍 Beer Findings Explorer**:
  * Real-time search by beer name, brewery, style, or article number.
  * Direct links to view and buy each beer on **Systembolaget** (`systembolaget.se`).
  * Live pricing in SEK, ABV %, volume, and assortment badges (*Fast sortiment*, *Tillfälligt sortiment*, *Lokalt & Småskaligt*).
  * Filter and sort by highest personal rating, lowest price, global Untappd rating, or date tasted.
* **🌍 Bilingual UI**: Switch between **English (EN)** and **Swedish (SV)** seamlessly with one click.
* **📦 Untappdbolaget Export**: Generates a standard `untappdbolaget-backup` JSON file ready to import into Untappdbolaget.

---

## 🚀 Quick Start

### 1. Requirements
* [Node.js](https://nodejs.org/) v20 or newer.

### 2. Install & Start
```bash
npm install
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🍪 How to Capture Your Untappd Cookie

### Why is a cookie needed?
Untappd closed general public developer access to their official API years ago. To fetch your personal check-in history, ratings, and flavor profiles, the scraper queries Untappd's internal web feed (`untappd.com/profile/more_feed/...`). 

Untappd protects this endpoint with Cloudflare and authentication checks. Providing your browser session **Cookie** authenticates the scraper as you, allowing it to download your check-ins safely.

> [!NOTE]
> **Privacy & Security**: Your cookie is stored locally on your machine in `.env` and is **never** sent to any third party. It only talks directly to `untappd.com` and `localhost:3000`. A cookie typically remains valid for **several months** until you explicitly log out of Untappd in your browser.

---

### Step-by-Step Guide: Capturing the Cookie (10 Seconds)

You can grab the cookie header in **Chrome**, **Microsoft Edge**, **Brave**, or **Firefox** using standard browser Developer Tools:

```
[1. Open untappd.com] ──> [2. Press F12] ──> [3. Network Tab] ──> [4. Refresh (F5)] ──> [5. Click 'home'] ──> [6. Copy 'Cookie' header]
```

#### Detailed Steps:

1. **Log in to Untappd**:
   Open [untappd.com](https://untappd.com) in your regular browser (Chrome, Edge, Brave, etc.) and log into your account so you can see your activity feed.

2. **Open Developer Tools**:
   Press **<kbd>F12</kbd>** on your keyboard (or press **<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>** on Windows / **<kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>I</kbd>** on Mac). Alternatively, right-click anywhere on the page and select **Inspect** (*Undersök*).

3. **Switch to the "Network" Tab**:
   In the developer panel that opens (usually on the right or bottom of the screen), click the **Network** tab (*Nätverk*).
   * *Tip: If the list is empty, make sure the "All" filter is selected.*

4. **Refresh the Page**:
   Press **<kbd>F5</kbd>** (or <kbd>Ctrl</kbd>+<kbd>R</kbd>) to reload the page while the Network tab is open.

5. **Select a Request**:
   Scroll to the top of the Network requests list and click on the first entry named **`home`** (or any request to `untappd.com`).

6. **Copy the Cookie Value**:
   * A panel will open on the right showing details for that request.
   * Under the **Headers** (*Sidhuvuden*) tab, scroll down to the **Request Headers** (*Begärandehuvuden*) section.
   * Find the line that starts with **`Cookie:`** (or `cookie:`).
   * **Right-click** on the text next to `Cookie:` and select **Copy value** (*Kopiera värde*).
   *(Or click "Copy request headers" if your browser makes it easier).*

   ```http
   Cookie: _ALGOLIA=...; ut_d_l=...; untappd_user_v3_e=...; cf_clearance=...
   ```

7. **Save into the Hub**:
   * Open your Hub dashboard at **[http://localhost:3000](http://localhost:3000)**.
   * Enter your Untappd username (e.g. `your_username`).
   * Click **📋 Paste from Clipboard** (or press <kbd>Ctrl</kbd>+<kbd>V</kbd>) into the **Cookie Header String** box.
   * Click **Save Credentials**.

---

### Alternative Method: Using a Browser Extension

If you prefer not using DevTools, you can use any standard cookie exporter extension:

1. Install **Cookie-Editor** ([Chrome Web Store](https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) / [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/cookie-editor/ajfnejflagebdickaloijggkicndliki)).
2. Go to [untappd.com](https://untappd.com).
3. Click the **Cookie-Editor** icon in your browser toolbar.
4. Click **Export** ➔ **Header String**.
5. Go to the Hub at `http://localhost:3000`, click **📋 Paste from Clipboard**, and click **Save Credentials**.

---

### Common Cookie Troubleshooting

| Issue | Cause & Solution |
| :--- | :--- |
| **"Session expired – Untappd redirected to login"** | Your cookie has expired or you clicked "Log out" on untappd.com. Repeat the steps above to copy a fresh cookie. |
| **"Cookie value too short or missing required tokens"** | Ensure you copied the entire cookie string. Untappd requires at least `untappd_user_v3_e`, `ut_d_l`, or `cf_clearance`. |
| **HTTP 429 (Too Many Requests)** | Untappd rate-limited your IP temporarily. The scraper automatically pauses with exponential backoff and resumes safely. |

---

## 📖 Using the Dashboard

Once your account is connected:

1. **⚡ 1-Click Automated Sync**:
   * Click **"Sync & Match Now"** on the hero card.
   * The hub fetches your latest check-ins from Untappd and immediately matches them against the Systembolaget product database in one seamless step.
2. **🔍 Explore Findings**:
   * Click **"Browse Matched Beers"** (or switch to the **"🍺 Matched Beers"** tab at the top).
   * Search by beer name, brewery, or style.
   * View direct store links to buy each beer on `systembolaget.se`, along with prices, ABV, and ratings.
3. **Avancerade verktyg (Advanced Tools)**:
   * **Incremental (Default)**: Fetches only new check-ins added since your last sync. Very fast.
   * **Full Scrape**: Re-scrapes your entire check-in history from day one.
   * **Update Stats**: Updates global ratings and brewery details for already cached beers.
   * **Update Catalog**: Downloads a fresh ~100MB copy of Systembolaget's catalog.

---

## 📁 Generated Files (`/output`)

All scraped and matched files are stored locally in `output/`:

| File | Description |
| :--- | :--- |
| `matched_beers.json` | Final matched beers exported in Untappdbolaget backup JSON format |
| `systembolaget_products.json` | Systembolaget product catalog dump (~100 MB) |
| `<username>_checkins.json` | Complete structured Untappd check-in history for your profile |
| `output/db/` | Cached local database of beers, venues, and breweries |

---

## 🛠️ CLI Usage (Optional)

You can also run scrapers directly from your terminal if desired:

```bash
# Incremental scrape (new check-ins only)
npm run scrape

# Full historical scrape
npm run scrape:full

# Refresh ratings and beer stats
npm run scrape:stats
```

---

## 📄 License
MIT
