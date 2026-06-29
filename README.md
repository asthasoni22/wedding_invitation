# Astha & Neel — Wedding Invitation Website

An elegant, single-page wedding invitation built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step.

---

## Quick Start (local preview)

Open `index.html` directly in any modern browser — no server needed.

For live-reload during editing, use VS Code's **Live Server** extension or run:

```bash
npx serve .
```

---

## Customizing Your Details

Search for the comment tags below in `index.html` and `script.js` to find every placeholder:

| Tag | What to replace |
|-----|----------------|
| `[WEDDING_DATE_PLACEHOLDER]` | Date shown in the curtain, hero, details card, and footer |
| `[WEDDING_TIME_PLACEHOLDER]` | Ceremony start time in the details card |
| `[VENUE_NAME_PLACEHOLDER]` | Name of the main venue (Details section) |
| `[VENUE_ADDRESS_PLACEHOLDER]` | Full address of the main venue |
| `[GOOGLE_MAPS_LINK_PLACEHOLDER]` | The `href` on the Details "Get Directions" button |
| `[GANESH_POOJA_VENUE_PLACEHOLDER]` | Name & address of Ganesh Pooja location |
| `[GRAH_SHANTI_VENUE_PLACEHOLDER]` | Name & address of Grah Shanti location |
| `[GARBA_VENUE_PLACEHOLDER]` | Name & address of Garba venue |
| `[WEDDING_VENUE_PLACEHOLDER]` | Name & address of Wedding Ceremony venue |
| `[GOOGLE_MAPS_GANESH_POOJA]` | Google Maps link for Ganesh Pooja venue |
| `[GOOGLE_MAPS_GRAH_SHANTI]` | Google Maps link for Grah Shanti venue |
| `[GOOGLE_MAPS_GARBA]` | Google Maps link for Garba venue |
| `[GOOGLE_MAPS_WEDDING]` | Google Maps link for Wedding Ceremony venue |
| `[CUSTOMIZE THIS TEXT]` | The love-story paragraph in the Story section |

In `script.js`, also update:

```js
// Line ~20
const WEDDING_DATE = new Date('2027-01-10T17:00:00');
//                              ↑ counts down to the Wedding Ceremony (Day Two, 5:00 PM)
```

### Replacing gallery photos

In `index.html`, find the `<!-- NOTE: Replace the picsum.photos URLs -->` comment and swap each `<img src="...">` with your own photos. Recommended size: **1200 × 800 px**, landscape.

---

## Google Sheets RSVP Setup

RSVPs are sent to a Google Sheet via a Google Apps Script Web App. Follow these steps:

### Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **"Astha & Neel RSVPs"**.
3. In row 1, add these column headers (exact spelling matters):
   ```
   Timestamp | Name | Attending | Guests | Message
   ```

### Step 2 — Create the Apps Script

1. In the spreadsheet, go to **Extensions → Apps Script**.
2. Delete any placeholder code and paste the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data;

  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(data.timestamp || new Date()),
    data.name      || '',
    data.attending || '',
    data.guests    || '',
    data.message   || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (name it anything, e.g. "RSVP Handler").

### Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**.
2. Under **Select type**, choose **Web app**.
3. Set:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy** and authorize when prompted.
5. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Step 4 — Paste the URL

In `script.js`, replace the placeholder on line ~14:

```js
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID_HERE/exec';
```

> **Note:** Because of browser security (CORS), the fetch uses `mode: 'no-cors'`. This means the website cannot read the response — but the data still reaches your sheet. The website shows a success message optimistically. If you need confirmed delivery, check your spreadsheet after a test RSVP.

### Testing

1. Fill out the RSVP form and click **Send RSVP**.
2. Open your Google Sheet — a new row should appear within a few seconds.

---

## Deploying to Vercel

Vercel hosts static sites for free and gives you a shareable URL.

### Option A — Vercel CLI (fastest)

```bash
# Install Vercel CLI (once)
npm install -g vercel

# From inside the wedding-invite folder:
vercel

# Follow the prompts — accept defaults.
# Your site will be live at a URL like: https://wedding-invite-xyz.vercel.app
```

### Option B — Vercel Dashboard (no CLI)

1. Push your files to a GitHub repository (make sure the repo is named something like `wedding-invite`).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project** and import your repository.
4. Leave all settings as default (Vercel auto-detects static sites).
5. Click **Deploy**.
6. Your site goes live at a `.vercel.app` URL. You can add a custom domain in the project settings.

### Custom domain

If you own a domain (e.g. `asthaandneel.com`), add it in **Vercel → Project → Settings → Domains**.

---

## File Structure

```
/wedding-invite
├── index.html   ← main page (all sections)
├── style.css    ← all styles + animations
├── script.js    ← curtain, countdown, carousel, RSVP
├── vercel.json  ← Vercel deployment config
└── README.md    ← this file
```

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires ES5+ and the Fetch API.

---

*Made with love for Astha & Neel* 💍
