# Attachment Style Assessment

A free, private, browser-based self-reflection tool exploring your adult attachment pattern across the two dimensions most consistently identified in attachment research:

| Dimension | What it measures |
|---|---|
| 💭 Anxiety | Worry about rejection or abandonment, and how much reassurance you need that you're loved |
| 🚪 Avoidance | Comfort (or discomfort) with emotional closeness, depending on a partner, and opening up |

Your two dimension scores (1.0–7.0 each) are combined into one of four everyday attachment patterns: **Secure**, **Anxious-Preoccupied**, **Dismissive-Avoidant**, or **Fearful-Avoidant**. The report gives you both a dimension-by-dimension breakdown and an overall pattern write-up with relationship strengths and growth tips. Bilingual (EN/VI via the hub's shared language toggle); progress auto-saves; PDF/PNG export.

## Quick vs. Full

Two versions: **Quick** (24 statements — 12 per dimension, ~6–8 min) and **Full** (36 statements — 18 per dimension, ~10–14 min). Both cover the exact same two dimensions and produce the same report shape; Full simply asks more statements per dimension for a more reliable picture. Items are answered on a 7-point Likert scale (Disagree strongly → Agree strongly), with some items reverse-scored.

## Where these items come from

Items are **originally written**, inspired by the construct structure of the Experiences in Close Relationships–Revised (ECR-R; Fraley, Waller & Brennan, 2000) — a widely used research self-report measure of adult attachment. This app does **not** reproduce ECR-R's copyrighted item wording; it uses new statements covering the same well-replicated Anxiety/Avoidance dimensions.

The Secure / Anxious-Preoccupied / Dismissive-Avoidant / Fearful-Avoidant categorization uses the scale midpoint (4.0 on the 1–7 scale) as a simple, transparent cutoff on each dimension. This is an **educational heuristic, not a clinical or psychometrically normed cutoff** — real attachment shows up on a continuum, and the same person can look somewhat different across relationships or life stages.

## What this is NOT

This is not a clinical or diagnostic instrument. It cannot diagnose an attachment disorder, and it isn't a substitute for a licensed mental health professional's assessment. If attachment patterns are affecting your relationships or wellbeing, please talk to a licensed therapist or counselor — many are trained in attachment-focused approaches that can help these patterns shift over time.

## Run it locally

Open `index.html` in any modern browser — no install, no server, no data leaves the device. The page loads `../shared/i18n.js` from the project root, so serve or upload the **whole project folder**, keeping the structure intact.

## Deploy free on GitHub Pages

1. Push the whole Psychology Assessments project (hub `index.html`, `shared/`, and the assessment folders) to a GitHub repository.
2. **Settings → Pages → Source**: branch `main`, folder `/ (root)`, save.
3. Visit `https://<your-username>.github.io/<repo>/attachment-style-assessment/`.

## Project notes

Architecture, conventions, and PDF-export pitfalls: see `ASSESSMENT-APP-DESIGN.md` at the project root.

Balance rule for this app: each dimension has exactly 18 items in the Full bank and a curated 12-item `core: true` subset for Quick. Keep both subscales' item counts equal when editing — the mean-based scoring assumes a comparable number of items per dimension, though the formula itself works with any non-zero count per subscale.
