# What Specimenry stores where

Specimenry is **local-first**. Your collection lives on the device you open the app on. Production: [https://specimenry.online/](https://specimenry.online/).

Nothing is uploaded unless **you** start an optional sync (Google Drive or P2P).

## IndexedDB (`FossilArchiveDB`)

Primary vault for the collection:

- Specimen records (taxonomy, locality, notes, prices, prep log, tags, …)
- Embedded media (photos/videos as blobs / data URLs)
- Provenance documents attached to specimens (PDFs / scans)
- **Field diary trips** (object store `trips`: date, locality, GPS, photos, linked specimen IDs)
- Optional Whisper / transformers model cache (browser cache + IndexedDB via `@xenova/transformers`)

**Privacy:** Stays in this browser profile. Clearing site data deletes it unless you have a JSON backup.

### Shareable catalog export

Database → **Export Shareable Catalog** builds a standalone HTML file for collectors or museums. It **excludes** prices, storage drawer mapping, provenance scans, change logs, and personal contacts.

**Copy share link** encodes a *metadata-only* (no photos) catalog into the page URL hash (`#catalog=…`). Anyone opening that link on specimenry.online gets a read-only viewer — no upload, no account. Large collections with many fields may exceed browser URL limits; then use **Download HTML** (or host the file on Pages/Drive).

Best options ranked:
1. **Hash link** (built-in) — instant share, no server, limited size
2. **HTML file** hosted by you (GitHub Pages, Drive public link, museum site)
3. Future: optional publish to a gist / static folder you control, if you want short permanent URLs with photos

## localStorage (preferences & UI state)

Small keys only — not your specimen images:

| Key | Purpose |
|-----|---------|
| `specimenry_filter_state` | Last search + filter dropdowns |
| `last_backup` / `last_backup_meta` | Timestamp + fingerprint after a successful export/restore (“last backup OK”) |
| `specimens_added_since_backup` | Counter for backup reminder (also after **10** new specimens, not only 7 days) |
| `backup_banner_dismissed_time` | Temporary dismiss of the backup banner |
| `current_view` / `fossil_layout_view` | Archive view & grid/list layout |
| `pref_editor_mode` | Simple vs Advanced editor |
| `pref_dictation_lang` | Dictation language |
| `whisper_model_ready` | Flag that the speech model is cached |
| Profile toggles (`settings-*` / `pref-*`) | Museum / shop / storage UI |
| Draft carts / dream lists (if used) | Lightweight draft state |
| Cloud / P2P tokens or peer codes | Only if you connected sync |

**Privacy:** Still on-device. Do not put secrets you would not leave in a shared browser.

## Optional cloud / P2P (explicit only)

| Channel | What leaves the device |
|---------|------------------------|
| **JSON Export / Import** | Full backup (`specimenry-backup` v2): specimens **and** field diary trips — you control where the file goes |
| **Google Drive sync** | Collection snapshot to *your* Drive when you connect and sync |
| **WebRTC P2P sync** | Direct device-to-device transfer when you share a code / QR |

Dictation downloads the Whisper model from a CDN **once** (≈75 MB), then runs on-device. Speech audio is not sent to a transcription server.

## Field checklist

1. Export a JSON backup regularly.
2. For offline dictation: open Settings → download the speech model once while online; wait until the badge says **ready offline**.
3. Treat Drive / P2P as optional mirrors, not the source of truth.
