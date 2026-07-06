/* =========================================================================
   MAIN APP CONTROLLER
   Handles navigation between screens, question rendering, autosave to
   localStorage (so a user can leave mid-test and resume later on the
   same device/browser), scoring, and results rendering + PDF export.

   Bilingual (EN/VI): UI chrome strings live in UI (below), resolved with
   L() from shared/i18n.js. Question/profile content comes pre-resolved
   via L() from the { en, vi } objects defined in the data-*.js files.
========================================================================= */

const STORAGE_KEY = "psychAssessment.v1";

const UI = {
  scaleAgree: { en: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"], vi: ["Rất Không Đồng Ý", "Không Đồng Ý", "Trung Lập", "Đồng Ý", "Rất Đồng Ý"] },
  scaleLike: { en: ["Strongly Dislike", "Dislike", "Neutral", "Like", "Strongly Like"], vi: ["Rất Không Thích", "Không Thích", "Trung Lập", "Thích", "Rất Thích"] },
  secMbti: { en: "Personality (MBTI-style)", vi: "Tính Cách (Kiểu MBTI)" },
  secDisc: { en: "Behavioral Style (DISC)", vi: "Phong Cách Hành Vi (DISC)" },
  secRiasec: { en: "Career Interests (RIASEC)", vi: "Sở Thích Nghề Nghiệp (RIASEC)" },
  badgeModels: { en: "MBTI • DISC • RIASEC", vi: "MBTI • DISC • RIASEC" },
  title: { en: "Career & Personality Insights", vi: "Khám Phá Sự Nghiệp & Tính Cách" },
  intro: { en: "One combined assessment covering your personality type, behavioral style, and career interests — with a detailed report on your strengths, growth areas, and best-fit career paths.", vi: "Một bài đánh giá tổng hợp về kiểu tính cách, phong cách hành vi, và sở thích nghề nghiệp của bạn — kèm báo cáo chi tiết về thế mạnh, điểm cần phát triển, và những hướng nghề nghiệp phù hợp nhất." },
  feat1: { en: "✅ Choose a Quick (~10 min) or Full (~25-30 min) version", vi: "✅ Chọn phiên bản Nhanh (~10 phút) hoặc Đầy Đủ (~25-30 phút)" },
  feat2: { en: "💾 Auto-saves your progress — leave anytime, resume later", vi: "💾 Tự động lưu tiến trình — rời đi bất cứ lúc nào, tiếp tục sau" },
  feat3: { en: "📄 Download your full report as a PDF", vi: "📄 Tải báo cáo đầy đủ dưới dạng PDF" },
  feat4: { en: "🔁 Retake as many times as you like", vi: "🔁 Làm lại bao nhiêu lần tùy thích" },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  welcomeBack: { en: "Welcome back 👋", vi: "Chào mừng trở lại 👋" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  ageQuestion: { en: "Which age group fits you best?", vi: "Nhóm tuổi nào phù hợp nhất với bạn?" },
  ageSub: { en: "This helps us tailor career examples and language to your stage of life.", vi: "Điều này giúp chúng tôi điều chỉnh ví dụ nghề nghiệp và ngôn từ phù hợp với giai đoạn cuộc sống của bạn." },
  ageTeenLabel: { en: "Teen", vi: "Thiếu Niên" },
  ageTeenRange: { en: "13–17 years old", vi: "13–17 tuổi" },
  ageTeenBlurb: { en: "Discover your strengths and explore future school & career directions.", vi: "Khám phá thế mạnh của bạn và tìm hiểu các hướng đi học tập & nghề nghiệp tương lai." },
  ageYoungAdultLabel: { en: "Young Adult", vi: "Người Trẻ Trưởng Thành" },
  ageYoungAdultRange: { en: "18–25 years old", vi: "18–25 tuổi" },
  ageYoungAdultBlurb: { en: "Get clarity on majors, entry-level roles, and how you naturally work.", vi: "Có cái nhìn rõ ràng về ngành học, vị trí công việc khởi điểm, và cách bạn làm việc tự nhiên nhất." },
  ageAdultLabel: { en: "Adult", vi: "Người Trưởng Thành" },
  ageAdultRange: { en: "26+ years old", vi: "26+ tuổi" },
  ageAdultBlurb: { en: "Understand your workplace style and explore career growth or pivots.", vi: "Hiểu phong cách làm việc của bạn và khám phá hướng phát triển hoặc chuyển đổi sự nghiệp." },
  versionQuestion: { en: "Quick or Full version?", vi: "Phiên bản Nhanh hay Đầy Đủ?" },
  versionSub: { en: "Both cover MBTI, DISC, and RIASEC and produce a full report — the Full version just asks more questions per scale for extra precision.", vi: "Cả hai đều bao quát MBTI, DISC, và RIASEC và tạo ra báo cáo đầy đủ — phiên bản Đầy Đủ chỉ hỏi nhiều câu hơn mỗi thang đo để có độ chính xác cao hơn." },
  versionQuick: { en: "Quick", vi: "Nhanh" },
  versionFull: { en: "Full", vi: "Đầy Đủ" },
  quickBlurb: { en: "A shorter, still-balanced version covering every scale — great if you're short on time.", vi: "Phiên bản ngắn hơn nhưng vẫn cân bằng, bao quát mọi thang đo — phù hợp khi bạn có ít thời gian." },
  fullBlurb: { en: "The complete item bank for the most accurate, detailed results.", vi: "Bộ câu hỏi đầy đủ để có kết quả chi tiết và chính xác nhất." },
  timeQuick: { en: "10 minutes", vi: "10 phút" },
  timeFull: { en: "25–30 minutes", vi: "25–30 phút" },
  versionSuffix: { en: (label) => `${label} Version`, vi: (label) => `Phiên Bản ${label}` },
  itemCountSuffix: { en: (n, t) => `${n} questions · ~${t}`, vi: (n, t) => `${n} câu hỏi · ~${t}` },
  back: { en: "Back", vi: "Quay Lại" },
  sectionOf: { en: (i, n) => `Section ${i} of ${n}`, vi: (i, n) => `Phần ${i} / ${n}` },
  questionsScale: { en: (n) => `${n} questions · rate each on a 1–5 scale.`, vi: (n) => `${n} câu hỏi · đánh giá mỗi câu theo thang điểm 1–5.` },
  beginSection: { en: (label) => `Begin ${label}`, vi: (label) => `Bắt Đầu ${label}` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Question ${i} of ${n}`, vi: (i, n) => `Câu hỏi ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  introMbti: { en: "This section explores how you naturally think, decide, and recharge — the foundation of your personality type.", vi: "Phần này khám phá cách bạn tự nhiên suy nghĩ, ra quyết định, và nạp lại năng lượng — nền tảng của kiểu tính cách của bạn." },
  introDisc: { en: "This section looks at your behavioral style: how you tend to act under pressure, communicate, and work with others.", vi: "Phần này xem xét phong cách hành vi của bạn: cách bạn thường hành động dưới áp lực, giao tiếp, và làm việc với người khác." },
  introRiasec: { en: "This section maps your career interests — the types of activities and work environments you find most engaging.", vi: "Phần này xác định sở thích nghề nghiệp của bạn — những loại hoạt động và môi trường làm việc mà bạn thấy hứng thú nhất." },
  yourReport: { en: (age, ver) => `Your Full Report · ${age} · ${ver} Version`, vi: (age, ver) => `Báo Cáo Đầy Đủ Của Bạn · ${age} · Phiên Bản ${ver}` },
  mbtiBreakdown: { en: "🧠 Detailed MBTI Breakdown", vi: "🧠 Phân Tích Chi Tiết MBTI" },
  cognitiveStack: { en: "Cognitive Function Stack", vi: "Chuỗi Chức Năng Nhận Thức" },
  discBehavioral: { en: "⚙️ DISC Behavioral Style", vi: "⚙️ Phong Cách Hành Vi DISC" },
  primaryStyle: { en: "Primary style:", vi: "Phong cách chính:" },
  secondaryStyle: { en: "Secondary:", vi: "Phụ:" },
  riasecCareer: { en: (code) => `🧭 RIASEC Career Interests — Holland Code: ${code}`, vi: (code) => `🧭 Sở Thích Nghề Nghiệp RIASEC — Mã Holland: ${code}` },
  strengths: { en: "💪 Strengths", vi: "💪 Điểm Mạnh" },
  growthAreas: { en: "🌱 Growth Areas", vi: "🌱 Điểm Cần Phát Triển" },
  careerMatches: { en: "🎯 Career & Path Matches", vi: "🎯 Nghề Nghiệp & Hướng Đi Phù Hợp" },
  actionPlan: { en: "📋 Suggested Action Plan", vi: "📋 Kế Hoạch Hành Động Đề Xuất" },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Assessment", vi: "🔁 Làm Lại Bài Đánh Giá" },
  retakeNote: { en: "Your results are also saved automatically in this browser. Retaking clears your saved answers and starts fresh. If the PDF ever looks off, the PNG image is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn cũng được tự động lưu trong trình duyệt này. Làm lại sẽ xóa các câu trả lời đã lưu và bắt đầu lại từ đầu. Nếu PDF có vấn đề hiển thị, hình ảnh PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new assessment. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một bài đánh giá hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
};

const DICH_LABELS = {
  EI: [{ en: "Extraversion (E)", vi: "Hướng Ngoại (E)" }, { en: "Introversion (I)", vi: "Hướng Nội (I)" }],
  SN: [{ en: "Sensing (S)", vi: "Giác Quan (S)" }, { en: "Intuition (N)", vi: "Trực Giác (N)" }],
  TF: [{ en: "Thinking (T)", vi: "Lý Trí (T)" }, { en: "Feeling (F)", vi: "Cảm Xúc (F)" }],
  JP: [{ en: "Judging (J)", vi: "Nguyên Tắc (J)" }, { en: "Perceiving (P)", vi: "Linh Hoạt (P)" }],
};

// Full-length sections (~160 items total, ~25-30 minutes)
const SECTIONS_FULL = [
  { key: "mbti", label: UI.secMbti, questions: MBTI_QUESTIONS, scaleLabels: UI.scaleAgree },
  { key: "disc", label: UI.secDisc, questions: DISC_QUESTIONS, scaleLabels: UI.scaleAgree },
  { key: "riasec", label: UI.secRiasec, questions: RIASEC_QUESTIONS, scaleLabels: UI.scaleLike },
];

// Concise sections (~88 items total, ~12-15 minutes) — a representative
// subset of the full item bank, evenly covering every pole/scale.
const SECTIONS_CORE = [
  { key: "mbti", label: UI.secMbti, questions: MBTI_QUESTIONS_CORE, scaleLabels: UI.scaleAgree },
  { key: "disc", label: UI.secDisc, questions: DISC_QUESTIONS_CORE, scaleLabels: UI.scaleAgree },
  { key: "riasec", label: UI.secRiasec, questions: RIASEC_QUESTIONS_CORE, scaleLabels: UI.scaleLike },
];

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

const AGE_GROUPS = [
  { key: "teen", label: UI.ageTeenLabel, range: UI.ageTeenRange, blurb: UI.ageTeenBlurb },
  { key: "youngAdult", label: UI.ageYoungAdultLabel, range: UI.ageYoungAdultRange, blurb: UI.ageYoungAdultBlurb },
  { key: "adult", label: UI.ageAdultLabel, range: UI.ageAdultRange, blurb: UI.ageAdultBlurb },
];

let state = {
  ageGroup: null,
  version: null, // "concise" | "full"
  screen: "welcome", // welcome | age | version | section-intro | question | results
  sectionIndex: 0,
  questionIndex: 0,
  answers: { mbti: {}, disc: {}, riasec: {} },
  completedAt: null,
};

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
function hasInProgressSession(saved) {
  if (!saved) return false;
  const answeredCount =
    Object.keys(saved.answers.mbti || {}).length +
    Object.keys(saved.answers.disc || {}).length +
    Object.keys(saved.answers.riasec || {}).length;
  return saved.screen !== "welcome" && answeredCount > 0 && saved.screen !== "results-done-fresh";
}

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
function init() {
  const saved = loadState();
  if (saved && hasInProgressSession(saved)) {
    renderResumePrompt(saved);
  } else {
    state = { ageGroup: null, version: null, screen: "welcome", sectionIndex: 0, questionIndex: 0, answers: { mbti: {}, disc: {}, riasec: {} }, completedAt: null };
    render();
  }
}

function renderResumePrompt(saved) {
  const answeredCount =
    Object.keys(saved.answers.mbti || {}).length +
    Object.keys(saved.answers.disc || {}).length +
    Object.keys(saved.answers.riasec || {}).length;
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.welcomeBack)}</h1>
      <p>${L(UI.savedSession)(answeredCount)}</p>
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
    state = { ageGroup: null, version: null, screen: "welcome", sectionIndex: 0, questionIndex: 0, answers: { mbti: {}, disc: {}, riasec: {} }, completedAt: null };
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
  if (state.screen === "age") return renderAgeSelect();
  if (state.screen === "version") return renderVersionSelect();
  if (state.screen === "section-intro") return renderSectionIntro();
  if (state.screen === "question") return renderQuestion();
  if (state.screen === "results") return renderResults();
}

function renderWelcome() {
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.badgeModels)}</div>
      <h1>${L(UI.title)}</h1>
      <p>${L(UI.intro)}</p>
      <ul class="feature-list">
        <li>${L(UI.feat1)}</li>
        <li>${L(UI.feat2)}</li>
        <li>${L(UI.feat3)}</li>
        <li>${L(UI.feat4)}</li>
      </ul>
      <button class="btn btn-primary btn-lg" id="startBtn">${L(UI.getStarted)}</button>
    </div>`;
  document.getElementById("startBtn").onclick = () => {
    state.screen = "age";
    render();
  };
}

function renderAgeSelect() {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.ageQuestion)}</h1>
      <p>${L(UI.ageSub)}</p>
      <div class="age-grid">
        ${AGE_GROUPS.map(
          (g) => `
          <button class="age-card" data-key="${g.key}">
            <span class="age-label">${L(g.label)}</span>
            <span class="age-range">${L(g.range)}</span>
            <span class="age-blurb">${L(g.blurb)}</span>
          </button>`
        ).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".age-card").forEach((btn) => {
    btn.onclick = () => {
      state.ageGroup = btn.dataset.key;
      state.screen = "version";
      render();
    };
  });
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
        <button class="btn btn-ghost" id="backToAgeBtn">${L(UI.back)}</button>
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
  document.getElementById("backToAgeBtn").onclick = () => {
    state.screen = "age";
    render();
  };
}

function renderSectionIntro() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const intros = {
    mbti: L(UI.introMbti),
    disc: L(UI.introDisc),
    riasec: L(UI.introRiasec),
  };
  const label = L(section.label);
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.sectionOf)(state.sectionIndex + 1, sections.length)}</div>
      <h1>${label}</h1>
      <p>${intros[section.key]}</p>
      <p class="muted">${L(UI.questionsScale)(section.questions.length)}</p>
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
  const answeredInSection = state.questionIndex;
  return Math.round(((answeredBefore + answeredInSection) / totalQuestions) * 100);
}

function renderQuestion() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const q = section.questions[state.questionIndex];
  const currentAnswer = state.answers[section.key][q.id];
  const pct = overallProgress();
  const label = L(section.label);
  const scaleLabels = L(section.scaleLabels);

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
            (label, i) => `
          <button class="likert-btn ${currentAnswer === i + 1 ? "selected" : ""}" data-val="${i + 1}">
            <span class="likert-dot"></span>
            <span class="likert-text">${label}</span>
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
      const val = Number(btn.dataset.val);
      state.answers[section.key][q.id] = val;
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
    if (window.trackAssessmentEvent) window.trackAssessmentEvent("assessment_completed", "career-personality-assessment");
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
  const mbti = scoreMBTI(state.answers.mbti, sections.find((s) => s.key === "mbti").questions);
  const disc = scoreDISC(state.answers.disc, sections.find((s) => s.key === "disc").questions);
  const riasec = scoreRIASEC(state.answers.riasec, sections.find((s) => s.key === "riasec").questions);
  const report = buildCombinedReport(state.ageGroup, mbti, disc, riasec);
  const ageLabel = L(AGE_GROUPS.find((g) => g.key === state.ageGroup).label);
  const versionLabel = L(VERSIONS[state.version || "full"].label);

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)(ageLabel, versionLabel)}</div>
        <h1>${mbti.type} — ${mbti.profile ? L(mbti.profile.nickname) : ""}</h1>
        <p>${mbti.profile ? L(mbti.profile.summary) : ""}</p>
      </div>

      <div class="card">
        <h2>${L(UI.mbtiBreakdown)}</h2>
        <p class="muted">${mbti.profile ? L(mbti.profile.dayToDay) : ""}</p>
        ${Object.keys(mbti.dichotomies)
          .map((d) => {
            const dd = mbti.dichotomies[d];
            const [labelAObj, labelBObj] = DICH_LABELS[d];
            const labelA = L(labelAObj);
            const labelB = L(labelBObj);
            const poleA = labelAObj.en.match(/\(([^)]+)\)/)[1];
            const poleB = labelBObj.en.match(/\(([^)]+)\)/)[1];
            const pctA = dd[poleA];
            const pctB = dd[poleB];
            const aWins = pctA >= pctB;
            return `
            <div class="bar-row dichotomy">
              <div class="bar-labels">
                <span class="pole-a ${aWins ? "dominant" : ""}">${labelA}${aWins ? " ✓" : ""}</span>
                <span class="pole-b ${!aWins ? "dominant" : ""}">${labelB}${!aWins ? " ✓" : ""}</span>
              </div>
              <div class="bar-track split">
                <div class="bar-seg seg-a" style="width:${pctA}%"></div>
                <div class="bar-seg seg-b" style="width:${pctB}%"></div>
              </div>
              <div class="bar-values">
                <span class="pole-a ${aWins ? "dominant" : ""}">${pctA}%</span>
                <span class="pole-b ${!aWins ? "dominant" : ""}">${pctB}%</span>
              </div>
            </div>`;
          })
          .join("")}
        <h3>${L(UI.cognitiveStack)}</h3>
        <ol class="fn-stack">${mbti.profile ? mbti.profile.functions.map((f) => `<li>${f}</li>`).join("") : ""}</ol>
      </div>

      <div class="card">
        <h2>${L(UI.discBehavioral)}</h2>
        <p><strong>${L(UI.primaryStyle)}</strong> ${L(disc.primaryProfile.name)} &nbsp;|&nbsp; <strong>${L(UI.secondaryStyle)}</strong> ${L(disc.secondaryProfile.name)}</p>
        <p class="muted">${L(disc.primaryProfile.summary)}</p>
        ${Object.keys(disc.scores)
          .map(
            (scale) => `
          <div class="bar-row single">
            <div class="bar-labels"><span>${L(DISC_STYLES[scale].name)} (${scale})</span></div>
            <div class="bar-track"><div class="bar-fill" style="width:${disc.scores[scale]}%"></div></div>
            <div class="bar-values"><span>${disc.scores[scale]}%</span></div>
          </div>`
          )
          .join("")}
      </div>

      <div class="card">
        <h2>${L(UI.riasecCareer)(riasec.hollandCode)}</h2>
        ${Object.keys(riasec.scores)
          .map(
            (scale) => `
          <div class="bar-row single">
            <div class="bar-labels"><span>${L(RIASEC_THEMES[scale].name)} (${scale})</span></div>
            <div class="bar-track"><div class="bar-fill riasec" style="width:${riasec.scores[scale]}%"></div></div>
            <div class="bar-values"><span>${riasec.scores[scale]}%</span></div>
          </div>`
          )
          .join("")}
        <div class="theme-cards">
          ${riasec.topThemes
            .map(
              (t) => `
            <div class="theme-card">
              <h4>${L(t.name)} — ${L(t.nickname)}</h4>
              <p>${L(t.description)}</p>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="card two-col">
        <div>
          <h2>${L(UI.strengths)}</h2>
          <ul>${report.strengths.map((s) => `<li>${L(s.text)} <span class="src">— ${L(s.source)}</span></li>`).join("")}</ul>
        </div>
        <div>
          <h2>${L(UI.growthAreas)}</h2>
          <ul>${report.growthAreas.map((g) => `<li>${L(g.text)} <span class="src">— ${L(g.source)}</span></li>`).join("")}</ul>
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.careerMatches)}</h2>
        <div class="career-grid">
          ${report.careers.map((c) => `<div class="career-chip"><strong>${L(c.career)}</strong><span>${L(c.theme)}</span></div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.actionPlan)}</h2>
        <ol class="action-list">${report.actionPlan.map((a) => `<li>${L(a)}</li>`).join("")}</ol>
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
      state = { ageGroup: null, version: null, screen: "welcome", sectionIndex: 0, questionIndex: 0, answers: { mbti: {}, disc: {}, riasec: {} }, completedAt: null };
      render();
    }
  };
}

// ---------------------------------------------------------------------
// PDF / PNG export (jsPDF + html2canvas, loaded via CDN in index.html)
// ---------------------------------------------------------------------
// Renders #results-report to a canvas. NOTE: we deliberately do NOT use
// html2canvas's `foreignObjectRendering` option — it deferred rendering to
// an SVG <foreignObject> and, in testing, produced a silently blank canvas
// in some browsers (no error thrown, just an empty capture). The default
// renderer is more reliable. The earlier "colors render as white" issue was
// fixed at the source: every gradient inside the report now uses literal
// hex colors instead of CSS var(), since var()-in-gradient is a documented
// trigger for html2canvas's color bug.
//
// A second, separate bug: every `.card` uses a `fadeIn` CSS animation
// (opacity 0 -> 1). html2canvas builds its own offscreen clone of the DOM
// and renders THAT — which restarts the animation from its 0% keyframe —
// and snapshots it before the 0.35s fade finishes, baking in a washed-out,
// partially-transparent frame. `onclone` runs on that clone right before
// it's captured, so we use it to force every card to its fully-visible,
// no-animation end state.
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
    downloadCanvas(canvas, "career-personality-report.png");
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

    pdf.save("career-personality-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
