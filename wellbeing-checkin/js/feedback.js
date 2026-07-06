/* =========================================================================
   Feedback module (shared across all assessments in this project)
   -------------------------------------------------------------------------
   - Shows a floating action button (FAB) at the bottom-right corner once the
     user reaches the results screen.
   - Opens a feedback form: satisfaction (1-5 stars), what they liked, and
     what they expect more, plus an optional email.
   - Every submission is stored persistently (localStorage) and can be:
       1. Written LIVE to a CSV file on disk ("Connect live CSV" — uses the
          File System Access API; Chrome / Edge). The file is rewritten with
          ALL collected responses on every new submission.
       2. Downloaded on demand as CSV (Excel-compatible, UTF-8 BOM) or as a
          real Excel .xlsx workbook (SheetJS, if loaded).
   - Configure per app via window.FEEDBACK_CONFIG = { appId, appName }.
   ========================================================================= */

(function () {
  "use strict";

  var CONFIG = window.FEEDBACK_CONFIG || {};
  var APP_ID = CONFIG.appId || "assessment";
  var APP_NAME = CONFIG.appName || document.title || "Assessment";
  // Google Apps Script Web App URL. When set, every submission is also sent
  // to your private Google Sheet (see feedback-backend/SETUP.md).
  var ENDPOINT = CONFIG.endpoint || "";

  var STORE_KEY = "feedback_entries_" + APP_ID;
  var IDB_NAME = "feedback-live-file";
  var IDB_STORE = "handles";

  // Bilingual UI strings for the feedback widget. Falls back to plain
  // English if lang.js (getLang) isn't loaded for some reason.
  function fbLang() {
    try { return typeof getLang === "function" ? getLang() : "en"; } catch (e) { return "en"; }
  }
  var FB = {
    fabLabel: { en: "Feedback", vi: "Góp ý" },
    fabAria: { en: "Give feedback", vi: "Gửi góp ý" },
    title: { en: "How was your experience?", vi: "Trải nghiệm của bạn thế nào?" },
    sub: { en: "Your feedback helps us improve this assessment.", vi: "Góp ý của bạn giúp chúng tôi cải thiện bài đánh giá này." },
    satisfactionLabel: { en: "How satisfied are you with this test?", vi: "Bạn hài lòng với bài kiểm tra này ở mức nào?" },
    likedLabel: { en: "What did you like about the test?", vi: "Bạn thích điều gì ở bài kiểm tra này?" },
    likedPlaceholder: { en: "e.g. clear questions, useful report…", vi: "vd: câu hỏi rõ ràng, báo cáo hữu ích…" },
    expectLabel: { en: "What do you expect more? Anything to improve?", vi: "Bạn mong muốn thêm điều gì? Có gì cần cải thiện không?" },
    expectPlaceholder: { en: "e.g. more career suggestions, shorter version, other languages…", vi: "vd: thêm gợi ý nghề nghiệp, phiên bản ngắn hơn, thêm ngôn ngữ khác…" },
    emailLabel: { en: "Email (optional — if you'd like a follow-up)", vi: "Email (không bắt buộc — nếu bạn muốn được liên hệ lại)" },
    submit: { en: "Send feedback", vi: "Gửi góp ý" },
    downloadCsv: { en: "Download CSV", vi: "Tải CSV" },
    downloadXlsx: { en: "Download Excel", vi: "Tải Excel" },
    connectLive: { en: "Connect live CSV", vi: "Kết nối CSV trực tiếp" },
    liveConnected: { en: "Live CSV connected", vi: "Đã kết nối CSV trực tiếp" },
    liveNotConnected: { en: "Live CSV not connected", vi: "Chưa kết nối CSV trực tiếp" },
    liveConnectedMsg: { en: "Live CSV connected — every new response is saved to it automatically.", vi: "Đã kết nối CSV trực tiếp — mọi phản hồi mới sẽ tự động được lưu vào đó." },
    liveErrorPrefix: { en: "Could not connect the file: ", vi: "Không thể kết nối tệp: " },
    liveWriteError: { en: "Saved locally, but the live CSV could not be updated.", vi: "Đã lưu cục bộ, nhưng không thể cập nhật CSV trực tiếp." },
    thanksTitle: { en: "Thank you!", vi: "Cảm ơn bạn!" },
    thanksBody: { en: "Your feedback has been recorded.", vi: "Góp ý của bạn đã được ghi nhận." },
    close: { en: "Close", vi: "Đóng" },
    ratingRequired: { en: "Please choose a satisfaction rating (1–5 stars).", vi: "Vui lòng chọn mức độ hài lòng (1–5 sao)." },
    responsesCollected: { en: function (n) { return n + " response" + (n === 1 ? "" : "s") + " collected"; }, vi: function (n) { return "đã thu thập " + n + " phản hồi"; } },
    starCaptions: {
      en: ["", "Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"],
      vi: ["", "Rất không hài lòng", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"],
    },
  };
  function fb(key) { return FB[key][fbLang()]; }

  var CSV_HEADERS = [
    "Timestamp",
    "App",
    "Test Version",
    "Audience / Context",
    "Satisfaction (1-5)",
    "What they liked",
    "What they expect more",
    "Email (optional)",
  ];

  /* ---------------- storage ---------------- */

  function loadEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries));
  }

  /* ---------------- app state helpers ---------------- */

  function appState() {
    try {
      // `state` is the top-level state object declared in app.js
      return typeof state !== "undefined" ? state : null;
    } catch (e) {
      return null;
    }
  }

  function stateMeta() {
    var s = appState() || {};
    return {
      version: s.version || "",
      audience: s.ageGroup || s.context || "",
    };
  }

  function onResultsScreen() {
    var s = appState();
    return !!(s && s.screen === "results");
  }

  /* ---------------- CSV helpers ---------------- */

  function csvEscape(value) {
    var v = value == null ? "" : String(value);
    if (/[",\n\r]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
    return v;
  }

  function entriesToRows(entries) {
    return entries.map(function (e) {
      return [
        e.timestamp,
        e.app,
        e.version,
        e.audience,
        e.satisfaction,
        e.liked,
        e.expectMore,
        e.email,
      ];
    });
  }

  function buildCsv(entries) {
    var lines = [CSV_HEADERS.map(csvEscape).join(",")];
    entriesToRows(entries).forEach(function (row) {
      lines.push(row.map(csvEscape).join(","));
    });
    return "\uFEFF" + lines.join("\r\n") + "\r\n"; // BOM so Excel reads UTF-8
  }

  function downloadBlob(blob, filename) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  }

  function downloadCsv() {
    downloadBlob(
      new Blob([buildCsv(loadEntries())], { type: "text/csv;charset=utf-8" }),
      APP_ID + "-feedback.csv"
    );
  }

  function downloadXlsx() {
    if (typeof XLSX === "undefined") {
      downloadCsv(); // graceful fallback
      return;
    }
    var data = [CSV_HEADERS].concat(entriesToRows(loadEntries()));
    var ws = XLSX.utils.aoa_to_sheet(data);
    ws["!cols"] = [
      { wch: 20 }, { wch: 28 }, { wch: 12 }, { wch: 16 },
      { wch: 16 }, { wch: 40 }, { wch: 40 }, { wch: 24 },
    ];
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Feedback");
    XLSX.writeFile(wb, APP_ID + "-feedback.xlsx");
  }

  /* ---------------- remote collection (Google Sheets) ------------------ */
  /* Entries are marked synced:false until the Apps Script endpoint accepts
     them, so nothing is lost if the visitor is offline or the request fails
     — unsynced entries are retried on the next page load / submission.     */

  var syncing = false;

  function sendRemote(entry) {
    // "text/plain" keeps this a CORS simple request (no preflight), which is
    // required because Apps Script web apps don't answer OPTIONS requests.
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(entry),
    }).then(function (res) {
      return res.ok;
    });
  }

  function syncPending() {
    if (!ENDPOINT || syncing || !navigator.onLine) return Promise.resolve();
    var entries = loadEntries();
    var pending = entries.filter(function (e) { return !e.synced; });
    if (!pending.length) return Promise.resolve();
    syncing = true;

    var chain = Promise.resolve(true);
    pending.forEach(function (entry) {
      chain = chain.then(function (prevOk) {
        if (!prevOk) return false; // stop after first failure
        return sendRemote(entry)
          .then(function (ok) {
            if (ok) {
              entry.synced = true;
              saveEntries(entries);
            }
            return ok;
          })
          .catch(function () { return false; });
      });
    });

    return chain.then(function (ok) {
      syncing = false;
      return ok;
    });
  }

  /* ---------------- live CSV file (File System Access API) ------------- */

  var liveSupported = "showSaveFilePicker" in window;
  var liveHandle = null;

  function idbOpen() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = function () {
        req.result.createObjectStore(IDB_STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbSet(key, value) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readwrite");
        tx.objectStore(IDB_STORE).put(value, key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function idbGet(key) {
    return idbOpen().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(IDB_STORE, "readonly");
        var req = tx.objectStore(IDB_STORE).get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  function restoreLiveHandle() {
    if (!liveSupported) return;
    idbGet(APP_ID)
      .then(function (handle) {
        if (handle) {
          liveHandle = handle;
          updateLiveStatus();
        }
      })
      .catch(function () { /* ignore */ });
  }

  function ensurePermission(handle) {
    var opts = { mode: "readwrite" };
    return handle.queryPermission(opts).then(function (p) {
      if (p === "granted") return true;
      return handle.requestPermission(opts).then(function (p2) {
        return p2 === "granted";
      });
    });
  }

  function connectLiveFile() {
    if (!liveSupported) return;
    window
      .showSaveFilePicker({
        suggestedName: APP_ID + "-feedback.csv",
        types: [{ description: "CSV file", accept: { "text/csv": [".csv"] } }],
      })
      .then(function (handle) {
        liveHandle = handle;
        return idbSet(APP_ID, handle).catch(function () { /* ignore */ });
      })
      .then(function () {
        return writeLiveFile();
      })
      .then(function () {
        updateLiveStatus();
        flashStatus(fb("liveConnectedMsg"));
      })
      .catch(function (err) {
        if (err && err.name !== "AbortError") {
          flashStatus(fb("liveErrorPrefix") + err.message, true);
        }
      });
  }

  function writeLiveFile() {
    if (!liveHandle) return Promise.resolve(false);
    return ensurePermission(liveHandle)
      .then(function (ok) {
        if (!ok) return false;
        return liveHandle
          .createWritable()
          .then(function (writable) {
            return writable
              .write(buildCsv(loadEntries()))
              .then(function () { return writable.close(); });
          })
          .then(function () { return true; });
      })
      .catch(function () { return false; });
  }

  /* ---------------- UI ---------------- */

  var els = {};
  var currentRating = 0;

  function buildUI() {
    var root = document.createElement("div");
    root.id = "feedback-root";
    root.className = "no-print";
    root.innerHTML =
      '<button id="feedback-fab" type="button" aria-label="' + fb("fabAria") + '" title="' + fb("fabAria") + '">' +
      '  <span class="fab-icon">💬</span><span class="fab-label">' + fb("fabLabel") + '</span>' +
      "</button>" +
      '<div id="feedback-overlay" hidden>' +
      '  <div id="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">' +
      '    <button type="button" class="fb-close" aria-label="' + fb("close") + '">&times;</button>' +
      '    <div class="fb-body">' +
      '      <h2 id="feedback-title">' + fb("title") + '</h2>' +
      '      <p class="fb-sub">' + fb("sub") + '</p>' +
      '      <div class="fb-field">' +
      '        <label>' + fb("satisfactionLabel") + ' <span class="fb-req">*</span></label>' +
      '        <div class="fb-stars" role="radiogroup" aria-label="' + fb("satisfactionLabel") + '">' +
      [1, 2, 3, 4, 5]
        .map(function (n) {
          return (
            '<button type="button" class="fb-star" data-value="' + n +
            '" role="radio" aria-checked="false" aria-label="' + n + '">★</button>'
          );
        })
        .join("") +
      "        </div>" +
      '        <div class="fb-star-caption" aria-live="polite"></div>' +
      "      </div>" +
      '      <div class="fb-field">' +
      '        <label for="fb-liked">' + fb("likedLabel") + '</label>' +
      '        <textarea id="fb-liked" rows="2" placeholder="' + fb("likedPlaceholder") + '"></textarea>' +
      "      </div>" +
      '      <div class="fb-field">' +
      '        <label for="fb-expect">' + fb("expectLabel") + '</label>' +
      '        <textarea id="fb-expect" rows="3" placeholder="' + fb("expectPlaceholder") + '"></textarea>' +
      "      </div>" +
      '      <div class="fb-field">' +
      '        <label for="fb-email">' + fb("emailLabel") + '</label>' +
      '        <input id="fb-email" type="email" placeholder="you@example.com" />' +
      "      </div>" +
      '      <div class="fb-error" hidden></div>' +
      '      <button type="button" class="fb-submit">' + fb("submit") + '</button>' +
      '      <div class="fb-admin">' +
      '        <span class="fb-count"></span>' +
      '        <a href="#" class="fb-dl-csv">' + fb("downloadCsv") + '</a>' +
      '        <a href="#" class="fb-dl-xlsx">' + fb("downloadXlsx") + '</a>' +
      (liveSupported
        ? '        <a href="#" class="fb-live">' + fb("connectLive") + '</a><span class="fb-live-dot" title="' + fb("liveNotConnected") + '"></span>'
        : "") +
      "      </div>" +
      '      <div class="fb-status" aria-live="polite"></div>' +
      "    </div>" +
      '    <div class="fb-thanks" hidden>' +
      '      <div class="fb-thanks-icon">🎉</div>' +
      "      <h2>" + fb("thanksTitle") + "</h2>" +
      '      <p>' + fb("thanksBody") + '</p>' +
      '      <button type="button" class="fb-done">' + fb("close") + '</button>' +
      "    </div>" +
      "  </div>" +
      "</div>";
    document.body.appendChild(root);

    els.fab = root.querySelector("#feedback-fab");
    els.overlay = root.querySelector("#feedback-overlay");
    els.modal = root.querySelector("#feedback-modal");
    els.body = root.querySelector(".fb-body");
    els.thanks = root.querySelector(".fb-thanks");
    els.stars = Array.prototype.slice.call(root.querySelectorAll(".fb-star"));
    els.starCaption = root.querySelector(".fb-star-caption");
    els.liked = root.querySelector("#fb-liked");
    els.expect = root.querySelector("#fb-expect");
    els.email = root.querySelector("#fb-email");
    els.error = root.querySelector(".fb-error");
    els.count = root.querySelector(".fb-count");
    els.status = root.querySelector(".fb-status");
    els.liveDot = root.querySelector(".fb-live-dot");

    els.fab.addEventListener("click", openModal);
    root.querySelector(".fb-close").addEventListener("click", closeModal);
    root.querySelector(".fb-done").addEventListener("click", closeModal);
    els.overlay.addEventListener("click", function (e) {
      if (e.target === els.overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !els.overlay.hidden) closeModal();
    });

    var captions = fb("starCaptions");
    els.stars.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentRating = Number(btn.dataset.value);
        els.stars.forEach(function (b) {
          var on = Number(b.dataset.value) <= currentRating;
          b.classList.toggle("on", on);
          b.setAttribute("aria-checked", String(Number(b.dataset.value) === currentRating));
        });
        els.starCaption.textContent = captions[currentRating];
        els.error.hidden = true;
      });
    });

    root.querySelector(".fb-submit").addEventListener("click", submitFeedback);
    root.querySelector(".fb-dl-csv").addEventListener("click", function (e) {
      e.preventDefault();
      downloadCsv();
    });
    root.querySelector(".fb-dl-xlsx").addEventListener("click", function (e) {
      e.preventDefault();
      downloadXlsx();
    });
    var liveLink = root.querySelector(".fb-live");
    if (liveLink) {
      liveLink.addEventListener("click", function (e) {
        e.preventDefault();
        connectLiveFile();
      });
    }
  }

  function openModal() {
    els.body.hidden = false;
    els.thanks.hidden = true;
    els.error.hidden = true;
    updateCount();
    updateLiveStatus();
    els.overlay.hidden = false;
    document.body.classList.add("fb-open");
  }

  function closeModal() {
    els.overlay.hidden = true;
    document.body.classList.remove("fb-open");
  }

  function updateCount() {
    var n = loadEntries().length;
    els.count.textContent = fb("responsesCollected")(n);
  }

  function updateLiveStatus() {
    if (els.liveDot) {
      els.liveDot.classList.toggle("connected", !!liveHandle);
      els.liveDot.title = liveHandle ? fb("liveConnected") : fb("liveNotConnected");
    }
  }

  function flashStatus(msg, isError) {
    els.status.textContent = msg;
    els.status.classList.toggle("error", !!isError);
    setTimeout(function () {
      if (els.status.textContent === msg) els.status.textContent = "";
    }, 6000);
  }

  function submitFeedback() {
    if (!currentRating) {
      els.error.textContent = fb("ratingRequired");
      els.error.hidden = false;
      return;
    }
    var meta = stateMeta();
    var entry = {
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      app: APP_NAME,
      version: meta.version,
      audience: meta.audience,
      satisfaction: currentRating,
      liked: els.liked.value.trim(),
      expectMore: els.expect.value.trim(),
      email: els.email.value.trim(),
      synced: false,
    };
    var entries = loadEntries();
    entries.push(entry);
    saveEntries(entries);

    // Send to the private Google Sheet (if an endpoint is configured).
    syncPending();

    // Live-write all collected responses to the connected CSV file (if any).
    writeLiveFile().then(function (written) {
      if (liveHandle && !written) {
        flashStatus(fb("liveWriteError"), true);
      }
    });

    // Reset form & show thanks.
    currentRating = 0;
    els.stars.forEach(function (b) {
      b.classList.remove("on");
      b.setAttribute("aria-checked", "false");
    });
    els.starCaption.textContent = "";
    els.liked.value = "";
    els.expect.value = "";
    els.email.value = "";
    els.body.hidden = true;
    els.thanks.hidden = false;
    els.fab.classList.add("submitted");
  }

  /* ---------------- FAB visibility (results screen only) ---------------- */

  function updateFabVisibility() {
    if (!els.fab) return;
    els.fab.classList.toggle("visible", onResultsScreen());
  }

  function watchApp() {
    var appEl = document.getElementById("app");
    if (!appEl) return;
    var observer = new MutationObserver(updateFabVisibility);
    observer.observe(appEl, { childList: true, subtree: false });
    updateFabVisibility();
  }

  /* ---------------- init ---------------- */

  function init() {
    buildUI();
    watchApp();
    restoreLiveHandle();
    // Retry any submissions that couldn't reach the Google Sheet earlier.
    syncPending();
    window.addEventListener("online", syncPending);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
