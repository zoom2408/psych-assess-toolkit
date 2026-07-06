/**
 * Feedback collector for Psychology Assessments (Google Apps Script).
 *
 * - doPost(e): receives feedback submissions from the assessment pages and
 *   appends them as rows to the Google Sheet this script is bound to.
 *   The write endpoint is public (anyone can SUBMIT feedback), but nobody
 *   can READ the sheet except you — the sheet stays private to your account.
 * - doGet(e):  lets ONLY you download all responses as CSV, protected by a
 *   secret token that never appears in your public GitHub repo.
 *
 * Setup instructions: see SETUP.md in this folder.
 */

// Change this to your own random secret before deploying.
// It protects the CSV download link (doGet). Keep it out of GitHub!
var SECRET_TOKEN = "CHANGE-ME-to-a-long-random-string";

var SHEET_NAME = "Feedback";

var HEADERS = [
  "Timestamp",
  "App",
  "Test Version",
  "Audience / Context",
  "Satisfaction (1-5)",
  "What they liked",
  "What they expect more",
  "Email (optional)",
  "Received At (server)",
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // avoid interleaved writes on simultaneous submissions
  try {
    var data = JSON.parse(e.postData.contents);

    // Basic sanity checks / spam guard.
    var satisfaction = Number(data.satisfaction);
    if (!(satisfaction >= 1 && satisfaction <= 5)) {
      return json_({ ok: false, error: "invalid satisfaction" });
    }

    var clip = function (v, max) {
      return String(v == null ? "" : v).slice(0, max || 2000);
    };

    getSheet_().appendRow([
      clip(data.timestamp, 30),
      clip(data.app, 100),
      clip(data.version, 30),
      clip(data.audience, 50),
      satisfaction,
      clip(data.liked),
      clip(data.expectMore),
      clip(data.email, 200),
      new Date(),
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * CSV export for the owner only:
 *   https://script.google.com/macros/s/DEPLOYMENT_ID/exec?token=YOUR_SECRET
 * (Easier: just open the Google Sheet — it's already private to you.)
 */
function doGet(e) {
  var token = e && e.parameter && e.parameter.token;
  if (token !== SECRET_TOKEN) {
    return ContentService.createTextOutput("Feedback collector is running.")
      .setMimeType(ContentService.MimeType.TEXT);
  }

  var values = getSheet_().getDataRange().getValues();
  var csv = values
    .map(function (row) {
      return row
        .map(function (cell) {
          var v = String(cell);
          if (/[",\n\r]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
          return v;
        })
        .join(",");
    })
    .join("\r\n");

  return ContentService.createTextOutput("\uFEFF" + csv)
    .setMimeType(ContentService.MimeType.CSV)
    .downloadAsFile("assessment-feedback.csv");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
