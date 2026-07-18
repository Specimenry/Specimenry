# Soft-launch smoke checklist

Run once after deploying to [specimenry.online](https://specimenry.online/) (or locally).

## Desktop (Chrome or Edge)
1. Open About / welcome once — confirms local-first + backup risk line.
2. Add a specimen in **Simple** mode.
3. **Database → Backup & Restore → Download backup** — toast “Backup OK”; file in Downloads.
4. Confirm Backup center shows **Last backup OK**.
5. About shows version stamp (`Specimenry v…`).
6. On phone: Add to Home Screen works (PWA manifest).
5. Mark one specimen sold/traded — uses modal (no browser `prompt`).

## Phone (Safari iOS or Chrome Android)
1. Add a specimen outdoors-style (Simple + photo if possible).
2. Download backup — on iOS check **Files → Downloads** (or share sheet).
3. Optional: restore in a private tab; expect **Restore verified OK**.

## Move device
Follow **Move to a new phone (3 steps)** inside Backup & Restore.

## Not required for beta
- Pro / Lemon Squeezy
- Splitting `app.js`
- Google Drive / P2P (optional extras)

---

## Pre-Reddit launch path

### 1. Deploy latest local build
Push/deploy this workspace to GitHub Pages so [specimenry.online](https://specimenry.online/) matches what you tested locally (empty state, Sold→Traded, Sync Center fixes, backup toast hints, etc.).

Quick check after deploy: open Sync Center help — Credentials text should be bold HTML, not `**Credentials**`.

### 2. Live smoke (you run this)
- Desktop: steps above.
- Phone: Simple add + backup download location.
- Move device: Backup → Restore in private/incognito.

### 3. Screenshots (3–5)
1. Empty / first-specimen state or Simple add form  
2. Collection grid with a few real specimens  
3. Backup & Restore center  
4. Optional: label print or dashboard chart  
5. Optional: mobile Simple mode

### 4. Post when smoke is green
Use the pitch in chat / keep tone: local-first, free, backup warning, early beta.
