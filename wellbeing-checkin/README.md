# Wellbeing & Mood Check-In (PHQ-9 + GAD-7)

A free, private, browser-based check-in using the two most widely used mental-health screeners in the world, **verbatim and unmodified**:

| Scale | Measures | Items | Range | Cutoffs |
|---|---|---|---|---|
| PHQ-9 | Depression symptoms (past 2 weeks) | 9 + impairment follow-up | 0–27 | 5 / 10 / 15 / 20 |
| GAD-7 | Anxiety symptoms (past 2 weeks) | 7 | 0–21 | 5 / 10 / 15 |

Both instruments were developed by Spitzer, Williams, Kroenke and colleagues (educational grant from Pfizer Inc.) and are **public domain** — no permission required to reproduce, translate, display or distribute. English wording is verbatim; Vietnamese follows the standard translation as closely as possible.

## Design decisions that must be preserved

- **No Quick/Full split.** Validated instruments are used whole; the published cutoffs only work on the full raw totals. Do not subset, reweight, or normalize.
- **Item-9 handling** (`ph09`, thoughts of self-harm): any non-zero answer immediately shows a gentle, non-blocking support card (shown once per session — `state.supportShown`), and support resources are pinned to the top of the report. Do not remove item 9, gate results behind it, or weaken this handling.
- **Crisis wording** avoids categorical promises about what helplines or services will do, and directs to local emergency numbers and findahelpline.com (country directory). Update numbers only from primary sources.
- **Impairment follow-up** is the standard PHQ question; it is reported but never added to the 0–27 total.
- Scores are **screening results, not diagnoses** — the report says so repeatedly, and guidance at moderate+ bands points to professional care.

## Run it locally

Open `index.html` in a modern browser — no install, no server. All answers stay in localStorage on the device; nothing is ever transmitted. The page loads `../shared/i18n.js`, so serve or upload the whole project folder with structure intact.

## Deploy free on GitHub Pages

1. Push the whole Psychology Assessments project to a GitHub repository.
2. **Settings → Pages → Source**: branch `main`, folder `/ (root)`, save.
3. Visit `https://<your-username>.github.io/<repo>/wellbeing-checkin/`.

## Project notes

Architecture and PDF-export pitfalls: `ASSESSMENT-APP-DESIGN.md` at the project root. Re-taking every 2 weeks (the recall window of both scales) is the intended usage rhythm.
