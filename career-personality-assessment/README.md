# Career & Personality Insights

A combined MBTI-style, DISC, and RIASEC (Holland Code) assessment, built as a single static website. It scores personality type, behavioral style, and career interests, then generates one combined report with a detailed MBTI breakdown, strengths/growth areas, career matches, and an action plan.

- Pure HTML/CSS/JavaScript — no build step, no backend, no database.
- Progress auto-saves to the browser's `localStorage`, so a user can leave mid-test and resume later on the same device/browser.
- Results can be exported as a PDF from the results page.
- Free to host on GitHub Pages.

### Quick vs. Full version

After picking an age group, users choose one of two lengths:

| Version | Items | Estimated time |
|---|---|---|
| Quick (concise) | 50 (24 MBTI + 8 DISC + 18 RIASEC) | ~10 minutes |
| Full | 160 (72 MBTI + 28 DISC + 60 RIASEC) | ~25–30 minutes |

The Quick version is an evenly-balanced subset of the Full item bank (every pole/scale is still represented), not a separate simplified test — so the report format is identical either way, just with slightly less precision. Both versions run through the same scoring engine and produce the same report sections.

## Folder structure

```
psych-assessment/
├── index.html          # page shell, loads all scripts
├── css/
│   └── style.css       # all styling
├── js/
│   ├── data-mbti.js     # MBTI-style question bank + 16 type profiles
│   ├── data-disc.js     # DISC question bank + 4 style profiles
│   ├── data-riasec.js   # RIASEC question bank + 6 theme profiles/careers
│   ├── scoring.js        # scoring + combined report logic
│   └── app.js            # navigation, state, save/resume, PDF export
└── README.md
```

## 1. Try it locally first

You don't need any server for the basic app, but browsers restrict some features (like loading local files) when you just double-click `index.html`. It's safer to serve it locally:

**Option A — Python (already installed on most Macs):**
```bash
cd psych-assessment
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option B — Node.js:**
```bash
cd psych-assessment
npx serve .
```

Click through the whole flow once (age select → MBTI → DISC → RIASEC → results) and try the **Download PDF** button before publishing.

## 2. Put it on GitHub

If you don't already have a GitHub account, create one free at [github.com/join](https://github.com/join).

### Create the repository
1. Go to [github.com/new](https://github.com/new).
2. Name it something like `career-personality-assessment`.
3. Leave it **Public** (required for free GitHub Pages) and don't initialize with a README (you already have one).
4. Click **Create repository**.

### Push your files
From inside the `psych-assessment` folder, run:

```bash
git init
git add .
git commit -m "Initial commit: career & personality assessment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/career-personality-assessment.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username, and the repo name if you chose a different one.

## 3. Turn on GitHub Pages

1. In your new repo on GitHub, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, then click **Save**.
5. Wait about a minute, then refresh the page — GitHub will show a green banner with your live URL, something like:
   ```
   https://YOUR-USERNAME.github.io/career-personality-assessment/
   ```

That link is now live and shareable. Anyone who opens it can take the assessment; their answers and results stay in **their own browser's local storage** only — nothing is sent to a server or shared with anyone else.

## 4. Updating content later

Whenever you want to tweak questions, career lists, or styling:
1. Edit the relevant file(s) in `js/` or `css/`.
2. Test locally again (`python3 -m http.server 8000`).
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update: describe your change"
   git push
   ```
4. GitHub Pages automatically redeploys within a minute or two.

## Notes on data & privacy

- All answers and results are stored only in the user's browser (`localStorage`), under the key `psychAssessment.v1`. Nothing is transmitted anywhere.
- Clicking **Retake Assessment** clears that saved data and starts fresh.
- If a user switches browsers or devices, their in-progress session won't follow them — it's local to that browser only.
- The PDF export runs entirely in the browser (via `html2canvas` + `jsPDF`, loaded from a CDN) — no server processing involved.

## Content note

The MBTI, DISC, and RIASEC/Holland Code frameworks referenced here are well-established, publicly documented psychological models. All assessment items, type/style/theme descriptions, and career mappings in this project are originally written for this tool — they are not reproductions of any publisher's proprietary test content. This tool is intended for self-reflection and educational exploration, not as a clinical or diagnostic instrument.
