# Specimenry

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/specimenry)

Local-first personal database for **fossils and minerals** — catalog, field notes, labels, and collection history in one place.

**Live:** [https://specimenry.online/](https://specimenry.online/) (GitHub Pages)

No accounts and no mandatory server. Specimens, photos, and field diary trips stay in your browser via **IndexedDB**. Optional sync (Google Drive / P2P) is available; a JSON backup remains the safest portable copy.

## Features

### Core
- **Local-first privacy** — data stays on this device. See [docs/STORAGE.md](docs/STORAGE.md) for IndexedDB vs localStorage vs optional sync.
- **Fossils & minerals** — taxonomy/geology for fossils; formula, hardness, crystal system, and care alerts for minerals.
- **Archive views** — Collection, Wishlist, For Sale, Sold, Traded, Dream Collection, and Draft Carts (each with a clear empty state).
- **Simple vs Advanced** — field logging with name, photo, place, notes (category optional in Simple); full curation in Advanced.
- **Field / Outdoor mode** — Settings toggle: high contrast, larger text, and bigger tap targets for sunlight and gloves (persists on this device).
- **PWA-ready** — install / Add to Home Screen via `manifest.webmanifest`.

### Field & workflow
- **Offline dictation** — on-device Whisper (~75 MB first download); badge shows when ready offline.
- **Field diary** — trip logs (date, locality, GPS, photos) with specimen linking.
- **Persisted filters** — last search/filter state restored per device.
- **Bulk edit** — mass-change country, formation, status, tags; link selected specimens to a trip.
- **Change log** — local per-specimen history (what/when; optional curator name in Settings).

### Curation & sharing
- **Drawer labels + QR** — print drawer labels; QR filters back to that drawer.
- **Shareable catalog** — privacy-safe HTML export and optional share link (metadata; no private prices/docs).
- **Dashboard** — charts, map, stratigraphy, portfolio, and more.
- **Import / export** — full JSON backup (specimens + trips); CSV import for spreadsheets.
- **HEIC support** — iPhone photos converted client-side (best over `https://` or localhost).

### Mobile
- Bottom-sheet menu and filters, compact Archive View tabs + More, sticky Add FAB, and glove-friendly controls in Outdoor mode.

## Getting started

1. Open [specimenry.online](https://specimenry.online/), **or** clone this repo and serve it locally (recommended):

   ```bash
   npx serve .
   # or: python -m http.server
   ```

2. Prefer **HTTPS or localhost** over opening `index.html` via `file://` (mic, HEIC, and some APIs work more reliably).

3. Tap **Add** — on a phone, Simple mode is the default for new specimens.

4. After a few entries: **Database → Backup & Restore** and download a JSON file.

### Backing up

Clearing site data **can delete your collection**.

> Your data lives in this browser — export backups regularly.

- **Database → Backup & Restore** downloads a dated `.json` (specimens with photos + field diary trips).
- Restore from the same panel.
- Optional Drive / P2P sync is separate; keep a JSON file as your portable copy.

### CSV import

Export a spreadsheet as CSV and use **Import CSV**. Columns such as `specimen`, `category`, `period`, and `price` are mapped automatically when possible.

### Profiles (Settings)

Enable only what you need:

- Museum archival fields  
- Commercial shop / ledger tools  
- Physical storage mapping  
- **Field / Outdoor mode**

## Tests

Open [`tests/index.html`](tests/index.html) (or `/tests/` when served). Covers formula parsing, provenance matching, and backup serialize/parse — no build step.

Pre-release checklist: [docs/SMOKE.md](docs/SMOKE.md).

## Stack

| Piece | Role |
|---|---|
| HTML / CSS / vanilla JS | No bundler — works on GitHub Pages |
| `js/lib/*` | DB, mineral care, provenance, filters, trips, errors, share catalog |
| IndexedDB | Primary specimen + trip storage |
| Chart.js, Leaflet, PeerJS, PapaParse | Dashboard, maps, P2P, CSV (CDN) |

**Version:** v0.9.0 (2026-07-18) — also shown under About & Privacy in the app.

## Support

Optional tips: [ko-fi.com/specimenry](https://ko-fi.com/specimenry). Core catalog features stay free.
