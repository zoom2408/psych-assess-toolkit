# ADHD Self-Screener (ASRS v1.1 · WHO)

A free, private, browser-based ADHD screening tool built around the real, unmodified **Adult ADHD Self-Report Scale (ASRS v1.1)** — the 18-item checklist developed by the World Health Organization together with Harvard Medical School and NYU (Kessler et al., 2005). Part A (6 items) is the validated screener; Part B (12 items) adds descriptive detail. Followed by extra, non-validated context questions on school, work, home life, other overlapping factors, and childhood history, modeled on the ASRS's own official "Symptoms / Impairments / History" instructions.

**This is a screening tool, not a diagnostic instrument, and it cannot tell you whether you have ADHD.** Only a qualified clinician can diagnose ADHD through a full evaluation. The app is built to say this loudly and repeatedly — on the welcome screen, before the checklist starts (with a required acknowledgement), and throughout the results.

## What's different about this app vs. the rest of the project

Every other assessment in this project uses originally-written items and a Quick/Full length split. This one doesn't, on purpose:

- **The ASRS v1.1 must be used whole and unmodified** to remain a validated instrument — no Quick version, no reworded items, no re-weighted scoring.
- **Scoring follows the WHO shaded-box key exactly**, not the oversimplified "4 items need Often+, 2 need Very-Often-only" version that circulates online. See the header comment in `js/data-asrs.js` for the verified per-item thresholds.
- **There is no invented "ADHD severity level."** The instrument only supports a positive/negative Part A screen and descriptive symptom-domain counts — the results screen explains explicitly why it stops there instead of manufacturing a mild/moderate/severe label.
- **The context module (school/work/home/other factors/history) is never blended into the ASRS score.** It's a separate, descriptive, unvalidated set of follow-up questions — same principle as how PHQ-9's impairment follow-up is kept out of its 0–27 total in `wellbeing-checkin`.
- **Age gate with an honest caveat:** the ASRS v1.1 was validated on adults (18+). Users can still select 13–17, but the report clearly labels their result as exploratory only and points to age-appropriate, clinician-administered tools (Vanderbilt, SNAP-IV, Conners) instead.

## Run it locally

Just open `index.html` in any modern browser. No install, no build step, no server — everything runs client-side and no data ever leaves your device (answers are stored only in your own browser's localStorage).

## Deploy free on GitHub Pages

1. Create a new GitHub repository (e.g. `adhd-screener`).
2. Upload the contents of this folder (`index.html`, `css/`, `js/`, `README.md`) to the repository root.
3. In the repo: **Settings → Pages → Source**: select branch `main`, folder `/ (root)`, and save.
4. Wait a minute, then visit `https://<your-username>.github.io/adhd-screener/`.

## Attribution & permissions

ASRS v1.1 items © World Health Organization 2003, based on the Composite International Diagnostic Interview © 2001 WHO, used with permission. Free to use for clinical/educational purposes; requests to reproduce or translate for sale should go to Professor Ronald Kessler, Department of Health Care Policy, Harvard Medical School. Reference: Kessler RC, et al. "The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population." *Psychological Medicine*. 2005;35(2):245-256.

## Project notes

Architecture, data conventions, scoring math, and known export pitfalls are documented in the shared `ASSESSMENT-APP-DESIGN.md` at the project root — read it before making changes, especially before touching anything inside `#results-report` (PDF export has non-obvious constraints) or the scoring thresholds in `js/data-asrs.js` (getting these wrong silently breaks the validated instrument).
