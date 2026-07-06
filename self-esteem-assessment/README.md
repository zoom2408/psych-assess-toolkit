# Self-Esteem Check-In

A quick, self-contained web app built on the **Rosenberg Self-Esteem Scale (RSES)** — Morris Rosenberg, 1965, public domain. 10 items, ~2 minutes, no backend or build step required.

## What it is

- The 10 original RSES items, verbatim (5 positively worded, 5 reverse-scored), on Rosenberg's standard 4-point agreement scale (Strongly Disagree → Strongly Agree).
- Raw score 0–30. Bands: **0–14** lower self-esteem, **15–25** typical/healthy range, **26–30** high self-esteem (standard RSES convention).
- Auto-saves progress to `localStorage`; resume or start over on return.
- Results screen: overall score + band, gauge, "what this means," tailored tips, a read-back of your 10 answers, PDF/PNG export, and retake.
- Bilingual (EN/VI) via `../shared/i18n.js`, matching the rest of this project.
- Feedback FAB (`js/feedback.js`) on the results screen, same as every other assessment in this project.

## File structure

```
self-esteem-assessment/
├── index.html          # page shell; loads scripts in dependency order
├── css/style.css        # warm amber/coral "confidence" theme
├── js/
│   ├── data-rses.js      # RSES_QUESTIONS (10 items), RSES_LEVELS (3 bands)
│   ├── scoring.js         # scoreRSES() — pure function, no DOM/state deps
│   ├── app.js             # state machine, rendering, localStorage, PDF/PNG export
│   └── feedback.js        # shared feedback FAB module (identical across apps)
└── README.md
```

## Deploying via GitHub Pages

1. Push this folder (and the project's `shared/` folder one level up) to a GitHub repo.
2. In repo Settings → Pages, set the source to the branch/folder containing `index.html`.
3. The app is fully static — no server, database, or build step needed.

## Notes for maintainers

- This instrument is genuinely public domain, so the item text is the original published wording (unlike, e.g., the PSS-inspired items in `stress-assessment`, which are paraphrased because the PSS itself is copyrighted).
- RSES uses its own native 4-point scale, not the 5-point Likert used elsewhere in this project — that's intentional fidelity to the original instrument, not an inconsistency.
- If you ever add a "Quick vs Full" version here: don't — 10 items *is* the quick version. There's no shorter validated subset of RSES worth maintaining.
- See the project-level `ASSESSMENT-APP-DESIGN.md` (one level up) for the shared architecture, PDF export gotchas, and localStorage conventions this app follows.
