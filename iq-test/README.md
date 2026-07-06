# Cognitive Abilities Challenge

A free, private, browser-based IQ-style challenge covering the five classic cognitive domains measured by mainstream ability batteries:

| Domain | What it measures |
|---|---|
| 📖 Verbal Reasoning | Word meanings, analogies, verbal logic |
| 🔢 Numerical Reasoning | Number series, quantities, word problems |
| 🧩 Logical Reasoning | Patterns, syllogisms, matrix-style rules |
| 📐 Spatial Reasoning | Mental rotation, folding, 3-D visualization |
| 🧠 Working Memory & Attention | Holding and manipulating information mentally |

Two versions: **Quick** (20 items, ~10 min) and **Full** (40 items, ~25 min). Items are right/wrong multiple choice, difficulty-weighted (easy/medium/hard). The report gives a domain-by-domain profile, an overall band with an indicative range, tips per domain, and worked explanations for every missed question. Bilingual (EN/VI via the hub's shared language toggle); progress auto-saves; PDF/PNG export.

## Age & education factors

Before the test, users pick an age group (13–17 / 18–29 / 30–49 / 50–64 / 65+) and education level (below high school / high school / bachelor / postgraduate). These apply small, transparent **interpretation offsets** to the composite (age: fluid abilities peak in early adulthood; education: schooling trains test-style material). The offsets are deliberately conservative, shown openly in the report, and labeled for what they are: **heuristics, not psychometric norms**.

## What this is NOT

This is not a real IQ test. Genuine IQ scores require standardized, timed, professionally administered instruments (WAIS, Stanford-Binet, Raven's) with representative norming samples. The report says this prominently, avoids issuing a fake single "IQ number," and directs anyone needing a genuine assessment to a licensed psychologist. Items are originally written.

## Run it locally

Open `index.html` in any modern browser — no install, no server, no data leaves the device. The page loads `../shared/i18n.js` from the project root, so serve or upload the **whole project folder**, keeping the structure intact.

## Deploy free on GitHub Pages

1. Push the whole Psychology Assessments project (hub `index.html`, `shared/`, and the assessment folders) to a GitHub repository.
2. **Settings → Pages → Source**: branch `main`, folder `/ (root)`, save.
3. Visit `https://<your-username>.github.io/<repo>/iq-test/`.

## Project notes

Architecture, conventions, and PDF-export pitfalls: see `ASSESSMENT-APP-DESIGN.md` at the project root.

Balance rules for this app: every domain has exactly 8 items (2 easy / 3 medium / 3 hard) in the Full bank and 4 (1/2/1) in the Quick subset (ids ending 01/03/05/07). Keep both the counts and the difficulty mix even across domains when editing — scoring weights correct answers by difficulty (1/2/3).
