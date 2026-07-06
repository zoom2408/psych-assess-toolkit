# Stress & Resilience Check-In

A free, private, browser-based stress assessment combining four established research models in one flow:

| Section | Model | What it measures |
|---|---|---|
| Perceived Stress | PSS-inspired (Cohen) | How overloaded / uncontrollable life has felt this past month (original items) |
| Appraisal & Coping | Transactional Model (Lazarus & Folkman) | Challenge-vs-threat appraisal + problem-focused, emotion-focused, and avoidant coping |
| Demands, Control & Support | Job Demand-Control-Support (Karasek & Theorell) | The structural source of your stress + strain quadrant + iso-strain risk |
| Wellbeing Buffers | PERMA (Seligman) | Five pillars of wellbeing that protect you under load |

Two versions: **Quick** (33 items, ~8 min) and **Full** (100 items, ~20–25 min). Advice is tailored to your main demand context: work, study, or life/caregiving. Progress auto-saves in your browser; the report downloads as PDF or PNG.

**This is a self-reflection and educational tool, not a clinical or diagnostic instrument.** If stress is persistently affecting your health, sleep, mood, or relationships, please talk to a doctor or mental-health professional.

## Run it locally

Just open `index.html` in any modern browser. No install, no build step, no server — everything runs client-side and no data ever leaves your device (answers are stored only in your own browser's localStorage).

## Deploy free on GitHub Pages

1. Create a new GitHub repository (e.g. `stress-check-in`).
2. Upload the contents of this folder (`index.html`, `css/`, `js/`, `README.md`) to the repository root.
3. In the repo: **Settings → Pages → Source**: select branch `main`, folder `/ (root)`, and save.
4. Wait a minute, then visit `https://<your-username>.github.io/stress-check-in/`.

Any update pushed to `main` redeploys automatically.

## Project notes

Architecture, data conventions, scoring math, and known export pitfalls are documented in the shared `ASSESSMENT-APP-DESIGN.md` at the project root — read it before making changes, especially before touching anything inside `#results-report` (PDF export has non-obvious constraints).
