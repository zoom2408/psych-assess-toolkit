# Character Strengths Profile

A free, private, browser-based assessment of all 24 character strengths from the VIA classification (Peterson & Seligman's positive-psychology taxonomy), grouped under 6 virtue domains:

| Virtue | Strengths |
|---|---|
| 🦉 Wisdom & Knowledge | Creativity · Curiosity · Judgment · Love of Learning · Perspective |
| 🦁 Courage | Bravery · Honesty · Perseverance · Zest |
| 🤝 Humanity | Love · Kindness · Social Intelligence |
| ⚖️ Justice | Teamwork · Fairness · Leadership |
| 🧘 Temperance | Forgiveness · Humility · Prudence · Self-Regulation |
| ✨ Transcendence | Appreciation of Beauty · Gratitude · Hope · Humor · Spirituality |

Two versions: **Quick** (48 items, ~10 min, 2 per strength) and **Full** (96 items, ~18–22 min, 4 per strength). The report identifies your top-5 **signature strengths** (with an overuse/balance note for each), ranks all 24, charts your six virtue domains, reframes lesser strengths as "low-fuel, not flaws," and builds a use-your-strengths action plan — the best-evidenced intervention in the strengths literature. Bilingual (EN/VI); progress auto-saves in your browser; the report downloads as PDF or PNG.

**Items are originally written**, inspired by the published VIA classification. This is NOT the proprietary VIA-IS or CliftonStrengths instrument, and not a clinical or diagnostic tool.

## Run it locally

Just open `index.html` in any modern browser — no install, no build step, no server. All answers stay in your own browser's localStorage; no data ever leaves your device.

Note: the page loads `../shared/i18n.js` from the project root, so serve or upload the **whole project folder** (or at minimum `strengths-assessment/` + `shared/`), keeping the folder structure intact.

## Deploy free on GitHub Pages

1. Push the whole Psychology Assessments project (hub `index.html`, `shared/`, and the assessment folders) to a GitHub repository.
2. In the repo: **Settings → Pages → Source**: branch `main`, folder `/ (root)`, save.
3. Visit `https://<your-username>.github.io/<repo>/strengths-assessment/`.

## Project notes

Architecture, data conventions, scoring math, and known PDF-export pitfalls are documented in the shared `ASSESSMENT-APP-DESIGN.md` at the project root — read it before making changes, especially before touching anything inside `#results-report`.

Per-strength balance rule: every strength has exactly 4 items in the Full bank and exactly 2 (`core: true`) in the Quick subset. Keep these counts even if you edit items — uneven counts bias the ranking.
