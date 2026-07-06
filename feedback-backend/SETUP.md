# Live Feedback Collection — Setup Guide (GitHub Pages + Google Sheets)

Your assessments are static sites, so feedback is collected in a **private Google
Sheet** via a tiny Google Apps Script backend. Visitors can only *submit*
feedback; only you (logged into your Google account) can *see* the results —
live, as a spreadsheet.

**Do NOT upload this `feedback-backend` folder to a public GitHub repo after you
put your real secret token in `Code.gs`.** (The version here has a placeholder,
so it's safe — but the deployed copy with your secret lives only in Google.)

## Part 1 — Create the backend (~5 minutes, once)

1. Go to https://sheets.google.com and create a new blank spreadsheet.
   Name it e.g. **Assessment Feedback**. This sheet is private to your account.
2. In the sheet: **Extensions → Apps Script**.
3. Delete the placeholder code and paste the full contents of `Code.gs`
   (from this folder).
4. In the pasted code, change `SECRET_TOKEN` to your own long random string.
5. Click **Deploy → New deployment**:
   - Type (gear icon): **Web app**
   - Description: `feedback collector`
   - Execute as: **Me**
   - Who has access: **Anyone**  ← required so visitors' browsers can POST;
     it does NOT expose your sheet — the script only appends rows.
6. Click **Deploy**, authorize when asked, and copy the **Web app URL**
   (looks like `https://script.google.com/macros/s/AKfycb…/exec`).

## Part 2 — Point the assessments at it

In BOTH files:

- `career-personality-assessment/index.html`
- `stress-assessment/index.html`

find `window.FEEDBACK_CONFIG` near the bottom and paste the URL:

```js
endpoint: "https://script.google.com/macros/s/AKfycb.../exec",
```

Both apps can share one endpoint — the "App" column tells them apart.

## Part 3 — Publish on GitHub Pages

1. Create a GitHub repo and push this whole project folder
   (you can keep the repo public or private — Pages works with both;
   private repos need a paid plan for Pages, public is free).
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** →
   Branch: `main`, folder `/ (root)` → Save.
3. Your tests go live at:
   - `https://<username>.github.io/<repo>/career-personality-assessment/`
   - `https://<username>.github.io/<repo>/stress-assessment/`

## How you read the results (only you)

- **Live:** just open your Google Sheet — new rows appear the moment someone
  submits. Sharing is off by default, so no one else can open it.
- **CSV download:** open
  `https://script.google.com/macros/s/DEPLOYMENT_ID/exec?token=YOUR_SECRET`
  Keep that token private; without it, the URL reveals nothing.
- **Excel:** in the Sheet, File → Download → Microsoft Excel (.xlsx).

## Notes

- If a visitor is offline or the request fails, their feedback is stored in
  their browser and automatically retried on their next visit/submission —
  nothing is lost.
- The old local options (Connect live CSV / Download CSV / Download Excel in
  the form footer) still work; they now only reflect responses submitted from
  that same browser — useful for local testing.
- To update the script later: edit in Apps Script, then
  **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**
  (the URL stays the same).
- Privacy: you're collecting feedback text + optional emails. Keep the sheet
  private and mention feedback collection in your site if you share it widely.
