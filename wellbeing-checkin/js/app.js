/* =========================================================================
   MAIN APP CONTROLLER — Wellbeing & Mood Check-In (PHQ-9 + GAD-7)
   Same architecture as the other assessments (design doc), with three
   deliberate differences:
   1. NO Quick/Full split — validated instruments are used whole
      (9 + 7 items + 1 impairment follow-up).
   2. ITEM-9 HANDLING: a non-zero answer on ph09 immediately shows a
      gentle, non-blocking support card (screen "support") before the
      test continues, and support resources are pinned to the TOP of the
      report. The card never re-triggers when navigating back/forward
      (state.supportShown), so it informs without nagging.
   3. Crisis wording avoids categorical promises about what any helpline
      or service will do, and never gates or withholds results.

   Bilingual via ../shared/i18n.js (shared hub language toggle).
========================================================================= */

const STORAGE_KEY = "wellbeingCheckin.v1";

const UI = {
  scaleFreq: { en: ["Not at all", "Several days", "More than half the days", "Nearly every day"], vi: ["Hoàn toàn không", "Vài ngày", "Hơn nửa số ngày", "Gần như mỗi ngày"] },
  secPhq: { en: "Mood (PHQ-9)", vi: "Tâm Trạng (PHQ-9)" },
  secGad: { en: "Worry & Anxiety (GAD-7)", vi: "Lo Lắng & Lo Âu (GAD-7)" },
  welcomeBack: { en: "Welcome back 💜", vi: "Chào mừng trở lại 💜" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  badge: { en: "PHQ-9 · GAD-7 · The standard screeners used worldwide", vi: "PHQ-9 · GAD-7 · Bộ sàng lọc tiêu chuẩn được dùng trên toàn thế giới" },
  title: { en: "Wellbeing & Mood Check-In", vi: "Kiểm Tra Tâm Trạng & Sức Khỏe Tinh Thần" },
  intro: { en: "The two most widely used mental-health screeners in the world, exactly as used in clinics: the PHQ-9 (mood) and GAD-7 (worry & anxiety). 17 questions, about 3–5 minutes, scored with the standard clinical cutoffs and clear guidance on what your scores usually mean.", vi: "Hai bộ câu hỏi sàng lọc sức khỏe tâm thần được sử dụng rộng rãi nhất thế giới, đúng như trong phòng khám: PHQ-9 (tâm trạng) và GAD-7 (lo lắng & lo âu). 17 câu hỏi, khoảng 3–5 phút, chấm theo ngưỡng lâm sàng tiêu chuẩn kèm hướng dẫn rõ ràng về ý nghĩa thường gặp của điểm số." },
  feat1: { en: "✅ The full, unmodified PHQ-9 and GAD-7 (public domain)", vi: "✅ Bộ PHQ-9 và GAD-7 đầy đủ, nguyên bản (thuộc phạm vi công cộng)" },
  feat2: { en: "🔒 Completely private — answers never leave your device", vi: "🔒 Hoàn toàn riêng tư — câu trả lời không bao giờ rời khỏi thiết bị của bạn" },
  feat3: { en: "📊 Standard clinical cutoffs, plainly explained", vi: "📊 Ngưỡng lâm sàng tiêu chuẩn, được giải thích dễ hiểu" },
  feat4: { en: "🔁 Designed for re-taking — track your two-week trend", vi: "🔁 Thiết kế để làm lại — theo dõi xu hướng hai tuần của bạn" },
  disclaimer: { en: "These are screening questionnaires, not a diagnosis. Only a qualified clinician can diagnose depression or an anxiety disorder, and scores can be elevated for many reasons (grief, illness, stress, poor sleep). Whatever your score, if you are struggling, you deserve support.", vi: "Đây là bộ câu hỏi sàng lọc, không phải chẩn đoán. Chỉ bác sĩ lâm sàng có chuyên môn mới có thể chẩn đoán trầm cảm hoặc rối loạn lo âu, và điểm số có thể tăng vì nhiều lý do (mất mát, bệnh tật, căng thẳng, thiếu ngủ). Dù điểm số thế nào, nếu bạn đang gặp khó khăn, bạn xứng đáng được hỗ trợ." },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  back: { en: "Back", vi: "Quay Lại" },
  sectionOf: { en: (i, n) => `Section ${i} of ${n}`, vi: (i, n) => `Phần ${i} / ${n}` },
  beginSection: { en: (label) => `Begin ${label}`, vi: (label) => `Bắt Đầu ${label}` },
  introPhq: { en: "Nine questions about mood, energy, sleep, and related experiences over the last two weeks. Answer with how OFTEN each has bothered you. There are no right answers — just honest ones.", vi: "Chín câu hỏi về tâm trạng, năng lượng, giấc ngủ, và các trải nghiệm liên quan trong hai tuần qua. Hãy trả lời theo mức độ THƯỜNG XUYÊN mỗi vấn đề làm phiền bạn. Không có câu trả lời đúng — chỉ có câu trả lời thành thật." },
  introGad: { en: "Seven questions about worry and anxiety over the last two weeks, answered the same way.", vi: "Bảy câu hỏi về sự lo lắng và lo âu trong hai tuần qua, trả lời theo cùng cách." },
  questionsCount: { en: (n) => `${n} questions · same 4-point frequency scale.`, vi: (n) => `${n} câu hỏi · cùng thang tần suất 4 mức.` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Question ${i} of ${n}`, vi: (i, n) => `Câu hỏi ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  impairTitle: { en: "One last question", vi: "Một câu hỏi cuối" },
  yourReport: { en: "Your Check-In Results", vi: "Kết Quả Kiểm Tra Của Bạn" },
  hPhq: { en: "🌗 Mood — PHQ-9", vi: "🌗 Tâm Trạng — PHQ-9" },
  hGad: { en: "🌀 Worry & Anxiety — GAD-7", vi: "🌀 Lo Lắng & Lo Âu — GAD-7" },
  scoreOf: { en: (t, m) => `Score: ${t} / ${m}`, vi: (t, m) => `Điểm: ${t} / ${m}` },
  bandRanges: {
    phq: { en: "0–4 minimal · 5–9 mild · 10–14 moderate · 15–19 moderately severe · 20–27 severe", vi: "0–4 tối thiểu · 5–9 nhẹ · 10–14 vừa · 15–19 khá nặng · 20–27 nặng" },
    gad: { en: "0–4 minimal · 5–9 mild · 10–14 moderate · 15–21 severe", vi: "0–4 tối thiểu · 5–9 nhẹ · 10–14 vừa · 15–21 nặng" },
  },
  hImpair: { en: "🏠 Impact on daily life", vi: "🏠 Ảnh Hưởng Đến Cuộc Sống Hằng Ngày" },
  impairLine: { en: (opt) => `You said these problems have made daily life <strong>${opt}</strong>.`, vi: (opt) => `Bạn cho biết những vấn đề này khiến cuộc sống hằng ngày <strong>${opt}</strong>.` },
  impairNote: { en: "Clinicians weigh this answer heavily: symptoms that interfere with work, home, or relationships deserve attention even when scores are modest.", vi: "Các bác sĩ lâm sàng rất coi trọng câu trả lời này: những triệu chứng gây cản trở công việc, gia đình, hoặc các mối quan hệ đều đáng được quan tâm ngay cả khi điểm số không cao." },
  hGuidance: { en: "🧭 What these results usually mean", vi: "🧭 Những Kết Quả Này Thường Có Ý Nghĩa Gì" },
  trendNote: { en: "One snapshot matters less than the trend. Consider re-taking this check-in every 2 weeks — the same interval the questions cover — and watching the direction of your scores.", vi: "Một lần đo đơn lẻ ít quan trọng hơn xu hướng. Hãy cân nhắc làm lại bài kiểm tra này mỗi 2 tuần — đúng khoảng thời gian các câu hỏi đề cập — và quan sát chiều hướng điểm số của bạn." },
  supportFooter: { en: "If you are struggling — whatever your scores — support helplines are listed at findahelpline.com, and a doctor or counselor is a practical first step. In immediate danger, contact your local emergency number.", vi: "Nếu bạn đang gặp khó khăn — dù điểm số thế nào — các đường dây hỗ trợ được liệt kê tại findahelpline.com, và bác sĩ hoặc chuyên viên tư vấn là bước đầu thiết thực. Trong tình huống nguy hiểm tức thời, hãy gọi số khẩn cấp địa phương." },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Check-In", vi: "🔁 Làm Lại Bài Kiểm Tra" },
  retakeNote: { en: "Your results are saved automatically in this browser and never sent anywhere. Retaking clears saved answers — a re-check every 2 weeks is the intended rhythm. If the PDF looks off, the PNG is a simpler, more reliable download.", vi: "Kết quả của bạn được tự động lưu trong trình duyệt này và không bao giờ được gửi đi đâu. Làm lại sẽ xóa các câu trả lời đã lưu — kiểm tra lại mỗi 2 tuần là nhịp độ được khuyến nghị. Nếu PDF hiển thị có vấn đề, PNG là bản tải đơn giản và đáng tin cậy hơn." },
  retakeConfirm: { en: "This will clear your saved answers and start a new check-in. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu bài kiểm tra mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
};

const SECTIONS = [
  { key: "phq", label: UI.secPhq, stem: PHQ_STEM, intro: UI.introPhq, questions: PHQ_QUESTIONS },
  { key: "gad", label: UI.secGad, stem: GAD_STEM, intro: UI.introGad, questions: GAD_QUESTIONS },
];

const DEFAULT_STATE = () => ({
  screen: "welcome", // welcome | section-intro | question | support | impairment | results
  sectionIndex: 0,
  questionIndex: 0,
  answers: { phq: {}, gad: {} }, // values 0–3
  impairment: null, // 0–3 or null
  supportShown: false, // item-9 support card shown once, never re-triggered
  completedAt: null,
});

let state = DEFAULT_STATE();

const appEl = document.getElementById("app");

// ---------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
function answeredCountOf(saved) {
  const a = saved.answers || {};
  return Object.keys(a.phq || {}).length + Object.keys(a.gad || {}).length;
}
function hasInProgressSession(saved) {
  if (!saved) return false;
  return saved.screen !== "welcome" && answeredCountOf(saved) > 0;
}

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
function init() {
  const saved = loadState();
  if (saved && hasInProgressSession(saved)) {
    renderResumePrompt(saved);
  } else {
    state = DEFAULT_STATE();
    render();
  }
}

function renderResumePrompt(saved) {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.welcomeBack)}</h1>
      <p>${L(UI.savedSession)(answeredCountOf(saved))}</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="resumeBtn">${L(UI.resume)}</button>
        <button class="btn btn-ghost" id="restartBtn">${L(UI.startOver)}</button>
      </div>
    </div>`;
  document.getElementById("resumeBtn").onclick = () => {
    state = saved;
    // Never resume INTO the support interstitial.
    if (state.screen === "support") state.screen = "question";
    render();
  };
  document.getElementById("restartBtn").onclick = () => {
    clearState();
    state = DEFAULT_STATE();
    render();
  };
}

// ---------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------
function render() {
  saveState();
  window.scrollTo(0, 0);
  if (state.screen === "welcome") return renderWelcome();
  if (state.screen === "section-intro") return renderSectionIntro();
  if (state.screen === "question") return renderQuestion();
  if (state.screen === "support") return renderSupportCard();
  if (state.screen === "impairment") return renderImpairment();
  if (state.screen === "results") return renderResults();
}

function renderWelcome() {
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.badge)}</div>
      <h1>${L(UI.title)}</h1>
      <p>${L(UI.intro)}</p>
      <ul class="feature-list">
        <li>${L(UI.feat1)}</li>
        <li>${L(UI.feat2)}</li>
        <li>${L(UI.feat3)}</li>
        <li>${L(UI.feat4)}</li>
      </ul>
      <p class="muted small">${L(UI.disclaimer)}</p>
      <button class="btn btn-primary btn-lg" id="startBtn">${L(UI.getStarted)}</button>
    </div>`;
  document.getElementById("startBtn").onclick = () => {
    state.screen = "section-intro";
    state.sectionIndex = 0;
    render();
  };
}

function renderSectionIntro() {
  const section = SECTIONS[state.sectionIndex];
  const label = L(section.label);
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.sectionOf)(state.sectionIndex + 1, SECTIONS.length)}</div>
      <h1>${label}</h1>
      <p>${L(section.intro)}</p>
      <p class="muted">${L(UI.questionsCount)(section.questions.length)}</p>
      <button class="btn btn-primary btn-lg" id="beginSectionBtn">${L(UI.beginSection)(label)}</button>
    </div>`;
  document.getElementById("beginSectionBtn").onclick = () => {
    state.screen = "question";
    state.questionIndex = 0;
    render();
  };
}

function overallProgress() {
  const totalQuestions = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0) + 1; // + impairment
  let answeredBefore = 0;
  for (let i = 0; i < state.sectionIndex; i++) answeredBefore += SECTIONS[i].questions.length;
  const current = state.screen === "impairment" ? totalQuestions - 1 : answeredBefore + state.questionIndex;
  return Math.round((current / totalQuestions) * 100);
}

function renderQuestion() {
  const section = SECTIONS[state.sectionIndex];
  const q = section.questions[state.questionIndex];
  const currentAnswer = state.answers[section.key][q.id]; // 0–3 or undefined
  const pct = overallProgress();
  const label = L(section.label);
  const scaleLabels = L(UI.scaleFreq);

  appEl.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${L(UI.percentComplete)(pct, label)}</div>
    </div>
    <div class="card question-card">
      <div class="q-count">${L(UI.questionOf)(state.questionIndex + 1, section.questions.length)}</div>
      <p class="muted small">${L(section.stem)}</p>
      <h2 class="q-text">${L(q.text)}</h2>
      <div class="likert" id="likertRow">
        ${scaleLabels
          .map(
            (lab, i) => `
          <button class="likert-btn ${currentAnswer === i ? "selected" : ""}" data-val="${i}">
            <span class="likert-dot"></span>
            <span class="likert-text">${lab}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backBtn" ${state.sectionIndex === 0 && state.questionIndex === 0 ? "disabled" : ""}>${L(UI.back)}</button>
        <button class="btn btn-primary" id="nextBtn" ${currentAnswer !== undefined ? "" : "disabled"}>${L(UI.next)}</button>
      </div>
    </div>`;

  document.querySelectorAll(".likert-btn").forEach((btn) => {
    btn.onclick = () => {
      const val = Number(btn.dataset.val);
      state.answers[section.key][q.id] = val;
      saveState();
      // ITEM-9 HANDLING: gentle support card on any non-zero answer, once.
      if (q.sensitive && val > 0 && !state.supportShown) {
        state.supportShown = true;
        state.screen = "support";
        render();
        return;
      }
      goNext();
    };
  });
  document.getElementById("backBtn").onclick = goBack;
  document.getElementById("nextBtn").onclick = goNext;
}

/* Gentle, non-blocking support interstitial after item 9 (shown once). */
function renderSupportCard() {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>💜 ${L(SUPPORT_RESOURCES.title)}</h1>
      <p>${L(SUPPORT_RESOURCES.lead)}</p>
      <ul class="feature-list" style="text-align:left">
        ${L(SUPPORT_RESOURCES.items).map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <button class="btn btn-primary btn-lg" id="supportContinueBtn">${L(SUPPORT_RESOURCES.continueBtn)}</button>
    </div>`;
  document.getElementById("supportContinueBtn").onclick = () => {
    state.screen = "question";
    goNext();
  };
}

function renderImpairment() {
  const pct = overallProgress();
  const options = L(PHQ_IMPAIRMENT.options);
  appEl.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${L(UI.percentComplete)(pct, L(UI.impairTitle))}</div>
    </div>
    <div class="card question-card">
      <div class="q-count">${L(UI.impairTitle)}</div>
      <h2 class="q-text">${L(PHQ_IMPAIRMENT.text)}</h2>
      <div class="likert" id="likertRow">
        ${options
          .map(
            (lab, i) => `
          <button class="likert-btn ${state.impairment === i ? "selected" : ""}" data-val="${i}">
            <span class="likert-dot"></span>
            <span class="likert-text">${lab}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backBtn">${L(UI.back)}</button>
      </div>
    </div>`;
  document.querySelectorAll(".likert-btn").forEach((btn) => {
    btn.onclick = () => {
      state.impairment = Number(btn.dataset.val);
      state.completedAt = new Date().toISOString();
      state.screen = "results";
      render();
    };
  });
  document.getElementById("backBtn").onclick = () => {
    state.screen = "question";
    state.sectionIndex = SECTIONS.length - 1;
    state.questionIndex = SECTIONS[state.sectionIndex].questions.length - 1;
    render();
  };
}

function goNext() {
  const section = SECTIONS[state.sectionIndex];
  if (state.questionIndex < section.questions.length - 1) {
    state.questionIndex += 1;
    render();
  } else if (state.sectionIndex < SECTIONS.length - 1) {
    state.sectionIndex += 1;
    state.questionIndex = 0;
    state.screen = "section-intro";
    render();
  } else {
    state.screen = "impairment";
    render();
  }
}

function goBack() {
  if (state.questionIndex > 0) {
    state.questionIndex -= 1;
    render();
  } else if (state.sectionIndex > 0) {
    state.sectionIndex -= 1;
    state.questionIndex = SECTIONS[state.sectionIndex].questions.length - 1;
    render();
  }
}

// ---------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------
function _scaleCard(heading, result, rangeText) {
  return `
    <div class="card">
      <h2>${heading}</h2>
      <p><span class="level-pill ${result.band.pill}">${L(result.band.name)} · ${L(UI.scoreOf)(result.total, result.max)}</span></p>
      <div class="gauge-track"><div class="gauge-fill ${result.band.pill}" style="width:${Math.max(Math.round((result.total / result.max) * 100), 3)}%"></div></div>
      <p class="muted small">${rangeText}</p>
      <p>${L(result.band.summary)}</p>
    </div>`;
}

function renderResults() {
  const phq = scorePHQ(state.answers.phq);
  const gad = scoreGAD(state.answers.gad);
  const impair = impairmentLevel(state.impairment);
  const impairOptions = L(PHQ_IMPAIRMENT.options);

  // Support resources pinned to the TOP whenever item 9 was non-zero.
  const supportBanner = phq.item9Flag
    ? `
      <div class="card">
        <h2>💜 ${L(SUPPORT_RESOURCES.title)}</h2>
        <p>${L(SUPPORT_RESOURCES.lead)}</p>
        <ul>${L(SUPPORT_RESOURCES.items).map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>`
    : "";

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)}</div>
        <h1>${L(UI.title)}</h1>
      </div>

      ${supportBanner}

      ${_scaleCard(L(UI.hPhq), phq, L(UI.bandRanges.phq))}
      ${_scaleCard(L(UI.hGad), gad, L(UI.bandRanges.gad))}

      ${impair !== null
        ? `<div class="card">
        <h2>${L(UI.hImpair)}</h2>
        <p>${L(UI.impairLine)(`${impairOptions[impair]}`.toLowerCase())}</p>
        <p class="muted">${L(UI.impairNote)}</p>
      </div>`
        : ""}

      <div class="card">
        <h2>${L(UI.hGuidance)}</h2>
        <div class="quadrant-callout">
          <h4>${L(UI.hPhq)}</h4>
          <p>${L(phq.band.guidance)}</p>
        </div>
        <div class="quadrant-callout">
          <h4>${L(UI.hGad)}</h4>
          <p>${L(gad.band.guidance)}</p>
        </div>
        <p class="muted">${L(UI.trendNote)}</p>
        <div class="support-note"><strong>${L(UI.supportFooter)}</strong></div>
        <p class="muted small">${L(UI.disclaimer)}</p>
      </div>
    </div>

    <div class="card center-card no-print">
      <div class="btn-row">
        <button class="btn btn-primary" id="downloadPdfBtn">${L(UI.downloadPdf)}</button>
        <button class="btn btn-ghost" id="downloadPngBtn">${L(UI.downloadPng)}</button>
        <button class="btn btn-ghost" id="retakeBtn">${L(UI.retake)}</button>
      </div>
      <p class="muted small">${L(UI.retakeNote)}</p>
    </div>`;

  document.getElementById("downloadPdfBtn").onclick = exportPDF;
  document.getElementById("downloadPngBtn").onclick = exportPNG;
  document.getElementById("retakeBtn").onclick = () => {
    if (confirm(L(UI.retakeConfirm))) {
      clearState();
      state = DEFAULT_STATE();
      render();
    }
  };
}

// ---------------------------------------------------------------------
// PDF / PNG export — design-doc §7 rules (no foreignObjectRendering;
// onclone fade-fix; literal hex gradients only inside #results-report).
// ---------------------------------------------------------------------
async function captureReportCanvas(reportEl) {
  return html2canvas(reportEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (clonedDoc) => {
      clonedDoc.querySelectorAll(".card").forEach((el) => {
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    },
  });
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function exportPNG() {
  const btn = document.getElementById("downloadPngBtn");
  const originalText = btn.textContent;
  btn.textContent = L(UI.generatingImage);
  btn.disabled = true;
  try {
    const reportEl = document.getElementById("results-report");
    const canvas = await captureReportCanvas(reportEl);
    downloadCanvas(canvas, "wellbeing-checkin-report.png");
  } catch (err) {
    console.error(err);
    alert(L(UI.imageError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

async function exportPDF() {
  const btn = document.getElementById("downloadPdfBtn");
  const originalText = btn.textContent;
  btn.textContent = L(UI.generatingPdf);
  btn.disabled = true;
  try {
    const { jsPDF } = window.jspdf;
    const reportEl = document.getElementById("results-report");
    const canvas = await captureReportCanvas(reportEl);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("wellbeing-checkin-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
