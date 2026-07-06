/* =========================================================================
   MAIN APP CONTROLLER — Character Strengths Profile
   Same architecture as the other assessments in this project (design doc):
   screen state machine, autosave to localStorage with resume, scoring on
   the results screen, html2canvas/jsPDF export with the onclone fade-fix.

   Sections = the 6 VIA virtue domains (uneven item counts by design:
   virtues contain 3–5 strengths each; balance is per-STRENGTH, 4 items
   full / 2 quick — see data-strengths.js).

   Bilingual (EN/VI): UI chrome strings live in UI (below), resolved with
   L() from ../shared/i18n.js.
========================================================================= */

const STORAGE_KEY = "strengthsAssessment.v1";

const UI = {
  scaleLikeMe: { en: ["Very unlike me", "Unlike me", "Neutral", "Like me", "Very like me"], vi: ["Rất không giống tôi", "Không giống tôi", "Trung lập", "Giống tôi", "Rất giống tôi"] },
  versionQuick: { en: "Quick", vi: "Nhanh" },
  versionFull: { en: "Full", vi: "Đầy Đủ" },
  quickBlurb: { en: "2 questions per strength — a solid first look at your top strengths.", vi: "2 câu hỏi mỗi thế mạnh — cái nhìn đầu tiên vững chắc về các thế mạnh hàng đầu của bạn." },
  fullBlurb: { en: "4 questions per strength — the most reliable ranking of all 24.", vi: "4 câu hỏi mỗi thế mạnh — bảng xếp hạng đáng tin cậy nhất của cả 24 thế mạnh." },
  timeQuick: { en: "10 minutes", vi: "10 phút" },
  timeFull: { en: "18–22 minutes", vi: "18–22 phút" },
  welcomeBack: { en: "Welcome back 🌟", vi: "Chào mừng trở lại 🌟" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  badge: { en: "24 Character Strengths · 6 Virtues · VIA-classification-inspired", vi: "24 Thế Mạnh Tính Cách · 6 Nhóm Phẩm Chất · Lấy cảm hứng từ phân loại VIA" },
  title: { en: "Character Strengths Profile", vi: "Hồ Sơ Thế Mạnh Tính Cách" },
  intro: { en: "Discover your signature strengths — the character traits that come most naturally to you and energize you when you use them. Based on the 24-strengths classification from positive-psychology research (Peterson & Seligman), with a personal report and a use-your-strengths action plan.", vi: "Khám phá các thế mạnh đặc trưng của bạn — những phẩm chất tính cách tự nhiên nhất và tiếp thêm năng lượng cho bạn khi sử dụng chúng. Dựa trên hệ thống phân loại 24 thế mạnh từ nghiên cứu tâm lý học tích cực (Peterson & Seligman), kèm báo cáo cá nhân và kế hoạch hành động phát huy thế mạnh." },
  feat1: { en: "✅ Choose a Quick (~10 min) or Full (~20 min) version", vi: "✅ Chọn phiên bản Nhanh (~10 phút) hoặc Đầy Đủ (~20 phút)" },
  feat2: { en: "💾 Auto-saves your progress — leave anytime, resume later", vi: "💾 Tự động lưu tiến trình — rời đi bất cứ lúc nào, tiếp tục sau" },
  feat3: { en: "📄 Download your full report as a PDF or PNG", vi: "📄 Tải báo cáo đầy đủ dưới dạng PDF hoặc PNG" },
  feat4: { en: "🌟 Focuses on what's BEST in you — not what's wrong", vi: "🌟 Tập trung vào điều TỐT NHẤT ở bạn — không phải điều chưa ổn" },
  disclaimer: { en: "A self-reflection tool with originally-written items inspired by the published VIA classification of character strengths. It is not the proprietary VIA-IS or CliftonStrengths instrument, and not a clinical tool.", vi: "Một công cụ tự chiêm nghiệm với các câu hỏi được viết mới, lấy cảm hứng từ hệ thống phân loại thế mạnh tính cách VIA đã công bố. Đây không phải là bài trắc nghiệm VIA-IS hay CliftonStrengths chính thức, và không phải công cụ lâm sàng." },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  versionQuestion: { en: "Quick or Full version?", vi: "Phiên bản Nhanh hay Đầy Đủ?" },
  versionSub: { en: "Both rank all 24 strengths and produce the same report — the Full version just asks more questions per strength for a more reliable ranking.", vi: "Cả hai đều xếp hạng đủ 24 thế mạnh và tạo cùng một báo cáo — phiên bản Đầy Đủ chỉ hỏi nhiều câu hơn mỗi thế mạnh để bảng xếp hạng đáng tin cậy hơn." },
  versionSuffix: { en: (label) => `${label} Version`, vi: (label) => `Phiên Bản ${label}` },
  itemCountSuffix: { en: (n, t) => `${n} questions · ~${t}`, vi: (n, t) => `${n} câu hỏi · ~${t}` },
  back: { en: "Back", vi: "Quay Lại" },
  sectionOf: { en: (i, n) => `Virtue ${i} of ${n}`, vi: (i, n) => `Nhóm phẩm chất ${i} / ${n}` },
  sectionCovers: { en: (n) => `${n} statements · rate how much each is like you on a 1–5 scale.`, vi: (n) => `${n} nhận định · đánh giá mức độ giống bạn theo thang 1–5.` },
  beginSection: { en: (label) => `Begin ${label}`, vi: (label) => `Bắt Đầu ${label}` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Statement ${i} of ${n}`, vi: (i, n) => `Nhận định ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  yourReport: { en: (ver) => `Your Strengths Report · ${ver} Version`, vi: (ver) => `Báo Cáo Thế Mạnh Của Bạn · Phiên Bản ${ver}` },
  hSignature: { en: "🌟 Your Signature Strengths", vi: "🌟 Thế Mạnh Đặc Trưng Của Bạn" },
  signatureSub: { en: "Your top five — the strengths that feel most essential to who you are. Using these more, in new ways, is the single best-evidenced wellbeing move in the strengths literature.", vi: "Năm thế mạnh hàng đầu — những thế mạnh gắn liền nhất với con người bạn. Sử dụng chúng nhiều hơn, theo những cách mới, là bước cải thiện hạnh phúc có nhiều bằng chứng nhất trong nghiên cứu về thế mạnh." },
  rankPrefix: { en: (i) => `#${i}`, vi: (i) => `#${i}` },
  balanceNote: { en: "Balance note", vi: "Lưu ý cân bằng" },
  hVirtues: { en: "⚖️ Your Six Virtue Domains", vi: "⚖️ Sáu Nhóm Phẩm Chất Của Bạn" },
  hAll: { en: "📊 All 24 Strengths, Ranked", vi: "📊 Bảng Xếp Hạng Đủ 24 Thế Mạnh" },
  allSub: { en: "Scores are relative to your own answers (0–100 per strength), not compared to other people.", vi: "Điểm số phản ánh tương quan giữa các câu trả lời của chính bạn (0–100 mỗi thế mạnh), không phải so sánh với người khác." },
  hLesser: { en: "🌱 Your Quieter Strengths", vi: "🌱 Những Thế Mạnh Trầm Lặng Hơn" },
  hAction: { en: "📋 Your Strengths Action Plan", vi: "📋 Kế Hoạch Hành Động Phát Huy Thế Mạnh" },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Assessment", vi: "🔁 Làm Lại Bài Đánh Giá" },
  retakeNote: { en: "Your results are saved automatically in this browser. Retaking clears your saved answers and starts fresh. If the PDF ever looks off, the PNG is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn được tự động lưu trong trình duyệt này. Làm lại sẽ xóa các câu trả lời đã lưu và bắt đầu lại từ đầu. Nếu PDF có vấn đề hiển thị, PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new assessment. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một bài đánh giá hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
  careerCrossLink: { en: "Curious how these strengths map to careers? Try the <a href='../career-personality-assessment/index.html'>Career &amp; Personality Insights</a> assessment on this hub.", vi: "Muốn biết những thế mạnh này liên hệ thế nào với nghề nghiệp? Hãy thử bài đánh giá <a href='../career-personality-assessment/index.html'>Định Hướng Nghề Nghiệp &amp; Tính Cách</a> trên trang chủ." },
};

/* Sections = virtue domains. Question lists derive from the flat bank. */
function _sectionsFrom(bank) {
  return VIRTUES.map((v) => ({
    key: v.key,
    label: v.name,
    emoji: v.emoji,
    blurb: v.blurb,
    questions: bank.filter((q) => STRENGTH_PROFILES[q.strength].virtue === v.key),
  }));
}
const SECTIONS_FULL = _sectionsFrom(STRENGTHS_QUESTIONS);
const SECTIONS_CORE = _sectionsFrom(STRENGTHS_QUESTIONS_CORE);

const VERSIONS = {
  concise: {
    key: "concise",
    label: UI.versionQuick,
    sections: SECTIONS_CORE,
    itemCount: SECTIONS_CORE.reduce((s, sec) => s + sec.questions.length, 0),
    timeEstimate: UI.timeQuick,
    blurb: UI.quickBlurb,
  },
  full: {
    key: "full",
    label: UI.versionFull,
    sections: SECTIONS_FULL,
    itemCount: SECTIONS_FULL.reduce((s, sec) => s + sec.questions.length, 0),
    timeEstimate: UI.timeFull,
    blurb: UI.fullBlurb,
  },
};

function currentSections() {
  return VERSIONS[state.version || "full"].sections;
}

const DEFAULT_STATE = () => ({
  version: null, // "concise" | "full"
  screen: "welcome", // welcome | version | section-intro | question | results
  sectionIndex: 0,
  questionIndex: 0,
  answers: { strengths: {} }, // single namespace — all 96 ids are unique
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
  return Object.keys((saved.answers || {}).strengths || {}).length;
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
  if (state.screen === "version") return renderVersionSelect();
  if (state.screen === "section-intro") return renderSectionIntro();
  if (state.screen === "question") return renderQuestion();
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
    state.screen = "version";
    render();
  };
}

function renderVersionSelect() {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.versionQuestion)}</h1>
      <p>${L(UI.versionSub)}</p>
      <div class="age-grid">
        ${Object.values(VERSIONS)
          .map(
            (v) => `
          <button class="age-card" data-key="${v.key}">
            <span class="age-label">${L(UI.versionSuffix)(L(v.label))}</span>
            <span class="age-range">${L(UI.itemCountSuffix)(v.itemCount, L(v.timeEstimate))}</span>
            <span class="age-blurb">${L(v.blurb)}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backToWelcomeBtn">${L(UI.back)}</button>
      </div>
    </div>`;
  document.querySelectorAll(".age-card").forEach((btn) => {
    btn.onclick = () => {
      state.version = btn.dataset.key;
      state.screen = "section-intro";
      state.sectionIndex = 0;
      render();
    };
  });
  document.getElementById("backToWelcomeBtn").onclick = () => {
    state.screen = "welcome";
    render();
  };
}

function renderSectionIntro() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const label = L(section.label);
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.sectionOf)(state.sectionIndex + 1, sections.length)}</div>
      <h1>${section.emoji} ${label}</h1>
      <p>${L(section.blurb)}</p>
      <p class="muted">${L(UI.sectionCovers)(section.questions.length)}</p>
      <button class="btn btn-primary btn-lg" id="beginSectionBtn">${L(UI.beginSection)(label)}</button>
    </div>`;
  document.getElementById("beginSectionBtn").onclick = () => {
    state.screen = "question";
    state.questionIndex = 0;
    render();
  };
}

function overallProgress() {
  const sections = currentSections();
  const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
  let answeredBefore = 0;
  for (let i = 0; i < state.sectionIndex; i++) answeredBefore += sections[i].questions.length;
  return Math.round(((answeredBefore + state.questionIndex) / totalQuestions) * 100);
}

function renderQuestion() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const q = section.questions[state.questionIndex];
  const currentAnswer = state.answers.strengths[q.id];
  const pct = overallProgress();
  const label = L(section.label);
  const scaleLabels = L(UI.scaleLikeMe);

  appEl.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${L(UI.percentComplete)(pct, label)}</div>
    </div>
    <div class="card question-card">
      <div class="q-count">${L(UI.questionOf)(state.questionIndex + 1, section.questions.length)}</div>
      <h2 class="q-text">${L(q.text)}</h2>
      <div class="likert" id="likertRow">
        ${scaleLabels
          .map(
            (lab, i) => `
          <button class="likert-btn ${currentAnswer === i + 1 ? "selected" : ""}" data-val="${i + 1}">
            <span class="likert-dot"></span>
            <span class="likert-text">${lab}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backBtn" ${state.sectionIndex === 0 && state.questionIndex === 0 ? "disabled" : ""}>${L(UI.back)}</button>
        <button class="btn btn-primary" id="nextBtn" ${currentAnswer ? "" : "disabled"}>${L(UI.next)}</button>
      </div>
    </div>`;

  document.querySelectorAll(".likert-btn").forEach((btn) => {
    btn.onclick = () => {
      state.answers.strengths[q.id] = Number(btn.dataset.val);
      saveState();
      goNext();
    };
  });
  document.getElementById("backBtn").onclick = goBack;
  document.getElementById("nextBtn").onclick = goNext;
}

function goNext() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  if (state.questionIndex < section.questions.length - 1) {
    state.questionIndex += 1;
    render();
  } else if (state.sectionIndex < sections.length - 1) {
    state.sectionIndex += 1;
    state.questionIndex = 0;
    state.screen = "section-intro";
    render();
  } else {
    state.completedAt = new Date().toISOString();
    state.screen = "results";
    render();
  }
}

function goBack() {
  const sections = currentSections();
  if (state.questionIndex > 0) {
    state.questionIndex -= 1;
    render();
  } else if (state.sectionIndex > 0) {
    state.sectionIndex -= 1;
    state.questionIndex = sections[state.sectionIndex].questions.length - 1;
    render();
  }
}

// ---------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------
function renderResults() {
  const sections = currentSections();
  // IMPORTANT: pass the actual question array answered (Quick vs Full).
  const allQuestions = sections.flatMap((s) => s.questions);
  const result = scoreStrengths(state.answers.strengths, allQuestions);
  const report = buildStrengthsReport(result);
  const versionLabel = L(VERSIONS[state.version || "full"].label);

  const signatureCards = result.signature
    .map(
      (s, i) => `
    <div class="theme-card">
      <h4>${L(UI.rankPrefix)(i + 1)} ${L(s.profile.name)} · ${s.score}% <span class="src">— ${VIRTUES.find((v) => v.key === s.virtue).emoji} ${L(VIRTUES.find((v) => v.key === s.virtue).name)}</span></h4>
      <p><em>${L(s.profile.nickname)}</em> — ${L(s.profile.summary)}</p>
      <p><strong>${L(UI.balanceNote)}:</strong> ${L(s.profile.overuse)}</p>
    </div>`
    )
    .join("");

  const virtueBars = result.virtueScores
    .map(
      (v) => `
    <div class="bar-row single">
      <div class="bar-labels"><span>${v.virtue.emoji} ${L(v.virtue.name)}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${v.score}%"></div></div>
      <div class="bar-values"><span>${v.score}%</span></div>
    </div>`
    )
    .join("");

  const allBars = result.ranked
    .map(
      (s, i) => `
    <div class="bar-row single">
      <div class="bar-labels"><span>${i + 1}. ${L(s.profile.name)}</span></div>
      <div class="bar-track"><div class="bar-fill ${i < 5 ? "" : "riasec"}" style="width:${Math.max(s.score, 3)}%"></div></div>
      <div class="bar-values"><span>${s.score}%</span></div>
    </div>`
    )
    .join("");

  const lesserList = result.lesser
    .map((s) => `<li><strong>${L(s.profile.name)}</strong> (${s.score}%) — ${L(s.profile.nickname)}</li>`)
    .join("");

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)(versionLabel)}</div>
        <h1>${report.headline}</h1>
        <p>${report.shape}</p>
        <p>${report.virtueLine}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hSignature)}</h2>
        <p class="muted">${L(UI.signatureSub)}</p>
        <div class="theme-cards">${signatureCards}</div>
      </div>

      <div class="card">
        <h2>${L(UI.hVirtues)}</h2>
        ${virtueBars}
      </div>

      <div class="card">
        <h2>${L(UI.hAll)}</h2>
        <p class="muted">${L(UI.allSub)}</p>
        ${allBars}
      </div>

      <div class="card">
        <h2>${L(UI.hLesser)}</h2>
        <p>${report.lesserNote}</p>
        <ul>${lesserList}</ul>
      </div>

      <div class="card">
        <h2>${L(UI.hAction)}</h2>
        <p>${report.actionIntro}</p>
        <ol class="action-list">${report.actionPlan.map((a) => `<li>${a}</li>`).join("")}</ol>
        <p class="muted small">${L(UI.careerCrossLink)}</p>
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
// PDF / PNG export — carries the two hard-won rules from the design doc §7:
// 1. No `foreignObjectRendering` (silent blank canvas in some browsers).
// 2. `onclone` forces every .card fully visible (fadeIn mid-animation
//    snapshot otherwise washes out the export).
// Gradients inside #results-report use literal hex, never var(--...).
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
    downloadCanvas(canvas, "character-strengths-report.png");
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

    pdf.save("character-strengths-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
