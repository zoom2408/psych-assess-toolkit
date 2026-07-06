/* =========================================================================
   MAIN APP CONTROLLER — Cognitive Abilities Challenge
   Same architecture as the other assessments in this project (design doc):
   screen state machine, autosave to localStorage with resume, scoring on
   the results screen, html2canvas/jsPDF export with the onclone fade-fix.

   Differences from the Likert apps:
   - Multiple-choice items with ONE correct answer (options A–D); the
     stored answer is the option INDEX (0–3), not a 1–5 rating.
   - Two demographic screens (age group, education level) whose values
     adjust the interpretation of the composite score (see data-profiles).
   - Results include a review of missed questions with explanations.

   Bilingual (EN/VI) via ../shared/i18n.js — same shared language toggle
   and localStorage key as every other app on the hub.
========================================================================= */

const STORAGE_KEY = "iqAssessment.v1";

const UI = {
  versionQuick: { en: "Quick", vi: "Nhanh" },
  versionFull: { en: "Full", vi: "Đầy Đủ" },
  quickBlurb: { en: "4 questions per domain — a fast snapshot of your cognitive profile.", vi: "4 câu hỏi mỗi lĩnh vực — bức tranh nhanh về hồ sơ nhận thức của bạn." },
  fullBlurb: { en: "8 questions per domain — the most reliable picture across all five abilities.", vi: "8 câu hỏi mỗi lĩnh vực — bức tranh đáng tin cậy nhất trên cả năm năng lực." },
  timeQuick: { en: "10–12 minutes", vi: "10–12 phút" },
  timeFull: { en: "20–30 minutes", vi: "20–30 phút" },
  welcomeBack: { en: "Welcome back 🧠", vi: "Chào mừng trở lại 🧠" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  badge: { en: "Verbal · Numerical · Logical · Spatial · Memory", vi: "Ngôn Ngữ · Số Học · Logic · Không Gian · Trí Nhớ" },
  title: { en: "Cognitive Abilities Challenge", vi: "Thử Thách Năng Lực Nhận Thức" },
  intro: { en: "An IQ-style challenge across the five classic cognitive domains, with right/wrong questions from easy to hard. Your report shows a domain-by-domain profile, an overall band interpreted for your age and education, and explanations for every question you missed.", vi: "Một thử thách kiểu trắc nghiệm IQ trên năm lĩnh vực nhận thức kinh điển, với các câu hỏi đúng/sai từ dễ đến khó. Báo cáo của bạn gồm hồ sơ theo từng lĩnh vực, xếp hạng tổng thể được diễn giải theo độ tuổi và học vấn của bạn, và lời giải cho mọi câu bạn làm sai." },
  feat1: { en: "✅ Choose a Quick (~10 min) or Full (~25 min) version", vi: "✅ Chọn phiên bản Nhanh (~10 phút) hoặc Đầy Đủ (~25 phút)" },
  feat2: { en: "🎯 Real right/wrong questions, easy → hard, untimed", vi: "🎯 Câu hỏi đúng/sai thực sự, từ dễ → khó, không tính giờ" },
  feat3: { en: "👤 Interpretation adjusted for your age and education", vi: "👤 Diễn giải được điều chỉnh theo độ tuổi và học vấn của bạn" },
  feat4: { en: "📄 Full report with answer explanations, PDF/PNG export", vi: "📄 Báo cáo đầy đủ kèm giải thích đáp án, xuất PDF/PNG" },
  disclaimer: { en: "This is a self-administered practice challenge with originally-written items. It is NOT a real IQ test: genuine IQ scores require standardized, timed, professionally administered instruments (e.g. WAIS, Stanford-Binet) with representative norming samples. Treat results as a fun, indicative profile only.", vi: "Đây là một thử thách tự thực hiện với các câu hỏi được viết mới. Đây KHÔNG phải bài kiểm tra IQ thực thụ: điểm IQ thực sự đòi hỏi công cụ chuẩn hóa, tính giờ, do chuyên gia thực hiện (như WAIS, Stanford-Binet) với mẫu chuẩn hóa đại diện. Hãy xem kết quả chỉ mang tính tham khảo và giải trí." },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  ageQuestion: { en: "What is your age group?", vi: "Nhóm tuổi của bạn?" },
  ageSub: { en: "Used only to interpret your score — reasoning ability naturally varies across life stages.", vi: "Chỉ dùng để diễn giải điểm số — năng lực suy luận thay đổi tự nhiên theo các giai đoạn cuộc đời." },
  eduQuestion: { en: "What is your highest education level?", vi: "Trình độ học vấn cao nhất của bạn?" },
  eduSub: { en: "Used only to interpret your score — formal schooling trains test-style material, so the same raw score can mean different things.", vi: "Chỉ dùng để diễn giải điểm số — giáo dục chính quy rèn luyện dạng bài kiểm tra, nên cùng một điểm thô có thể mang ý nghĩa khác nhau." },
  versionQuestion: { en: "Quick or Full version?", vi: "Phiên bản Nhanh hay Đầy Đủ?" },
  versionSub: { en: "Both cover all five domains and produce the same report — the Full version asks more questions per domain for a more reliable picture.", vi: "Cả hai đều bao quát năm lĩnh vực và tạo cùng một báo cáo — phiên bản Đầy Đủ hỏi nhiều câu hơn mỗi lĩnh vực để có bức tranh đáng tin cậy hơn." },
  versionSuffix: { en: (label) => `${label} Version`, vi: (label) => `Phiên Bản ${label}` },
  itemCountSuffix: { en: (n, t) => `${n} questions · ~${t}`, vi: (n, t) => `${n} câu hỏi · ~${t}` },
  back: { en: "Back", vi: "Quay Lại" },
  sectionOf: { en: (i, n) => `Domain ${i} of ${n}`, vi: (i, n) => `Lĩnh vực ${i} / ${n}` },
  sectionCovers: { en: (n) => `${n} questions, easy → hard. Answers can't be checked mid-test — pick your best answer and move on.`, vi: (n) => `${n} câu hỏi, từ dễ → khó. Không thể xem đáp án giữa bài — hãy chọn phương án tốt nhất và đi tiếp.` },
  beginSection: { en: (label) => `Begin ${label}`, vi: (label) => `Bắt Đầu ${label}` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Question ${i} of ${n}`, vi: (i, n) => `Câu hỏi ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  yourReport: { en: (ver) => `Your Cognitive Profile · ${ver} Version`, vi: (ver) => `Hồ Sơ Nhận Thức Của Bạn · Phiên Bản ${ver}` },
  hOverall: { en: "🏅 Overall Result", vi: "🏅 Kết Quả Tổng Thể" },
  indicativePrefix: { en: "On formal tests this band is", vi: "Trên các bài kiểm tra chính thức, mức này" },
  hDomains: { en: "📊 Your Five Cognitive Domains", vi: "📊 Năm Lĩnh Vực Nhận Thức Của Bạn" },
  domainsSub: { en: "Each score is the percent of that domain's difficulty-weighted points you earned.", vi: "Mỗi điểm số là phần trăm số điểm có trọng số độ khó của lĩnh vực đó mà bạn đạt được." },
  hContext: { en: "👤 Your Context", vi: "👤 Bối Cảnh Của Bạn" },
  hTips: { en: "💡 What To Do With This", vi: "💡 Nên Làm Gì Với Kết Quả Này" },
  hReview: { en: (n) => `🔍 Review: ${n} Missed Question${n === 1 ? "" : "s"}`, vi: (n) => `🔍 Xem Lại: ${n} Câu Làm Sai` },
  reviewSub: { en: "The fastest way to get smarter at these: understand why the right answer is right.", vi: "Cách nhanh nhất để giỏi hơn với dạng bài này: hiểu vì sao đáp án đúng là đúng." },
  yourAnswer: { en: "Your answer", vi: "Bạn chọn" },
  correctAnswer: { en: "Correct answer", vi: "Đáp án đúng" },
  noAnswer: { en: "(no answer)", vi: "(chưa trả lời)" },
  bigDisclaimer: { en: "Remember: this is an untimed, self-administered browser challenge — not a clinical IQ measurement. Scores move with sleep, stress, language, and familiarity with test formats. If you need a real cognitive assessment (for school, work, or health reasons), see a licensed psychologist.", vi: "Xin nhớ: đây là thử thách trên trình duyệt, không tính giờ, tự thực hiện — không phải phép đo IQ lâm sàng. Điểm số thay đổi theo giấc ngủ, căng thẳng, ngôn ngữ, và mức độ quen thuộc với dạng bài. Nếu bạn cần đánh giá nhận thức thực thụ (cho học tập, công việc, hoặc lý do sức khỏe), hãy gặp nhà tâm lý học có chứng chỉ hành nghề." },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Challenge", vi: "🔁 Làm Lại Thử Thách" },
  retakeNote: { en: "Your results are saved automatically in this browser. Retaking clears your saved answers and starts fresh. If the PDF ever looks off, the PNG is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn được tự động lưu trong trình duyệt này. Làm lại sẽ xóa các câu trả lời đã lưu và bắt đầu lại từ đầu. Nếu PDF có vấn đề hiển thị, PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new challenge. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một thử thách hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
};

/* Sections = the 5 domains, in canonical order. */
function _sectionsFrom(bank) {
  return IQ_DOMAIN_ORDER.map((d) => ({
    key: d,
    label: IQ_DOMAINS[d].name,
    emoji: IQ_DOMAINS[d].emoji,
    blurb: IQ_DOMAINS[d].desc,
    questions: bank.filter((q) => q.domain === d),
  }));
}
const SECTIONS_FULL = _sectionsFrom(IQ_QUESTIONS);
const SECTIONS_CORE = _sectionsFrom(IQ_QUESTIONS_CORE);

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
  ageGroup: null, // AGE_GROUPS key
  education: null, // EDU_LEVELS key
  version: null, // "concise" | "full"
  screen: "welcome", // welcome | age | education | version | section-intro | question | results
  sectionIndex: 0,
  questionIndex: 0,
  answers: { iq: {} }, // { itemId: optionIndex }
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
  return Object.keys((saved.answers || {}).iq || {}).length;
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
  if (state.screen === "age") return renderAgeSelect();
  if (state.screen === "education") return renderEduSelect();
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
    state.screen = "age";
    render();
  };
}

function _renderChoiceScreen({ title, sub, choices, backScreen, onPick }) {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${title}</h1>
      <p>${sub}</p>
      <div class="age-grid">
        ${choices
          .map(
            (c) => `
          <button class="age-card" data-key="${c.key}">
            <span class="age-label">${L(c.label)}</span>
            <span class="age-blurb">${L(c.blurb)}</span>
          </button>`
          )
          .join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="choiceBackBtn">${L(UI.back)}</button>
      </div>
    </div>`;
  document.querySelectorAll(".age-card").forEach((btn) => {
    btn.onclick = () => onPick(btn.dataset.key);
  });
  document.getElementById("choiceBackBtn").onclick = () => {
    state.screen = backScreen;
    render();
  };
}

function renderAgeSelect() {
  _renderChoiceScreen({
    title: L(UI.ageQuestion),
    sub: L(UI.ageSub),
    choices: AGE_GROUPS,
    backScreen: "welcome",
    onPick: (key) => {
      state.ageGroup = key;
      state.screen = "education";
      render();
    },
  });
}

function renderEduSelect() {
  _renderChoiceScreen({
    title: L(UI.eduQuestion),
    sub: L(UI.eduSub),
    choices: EDU_LEVELS,
    backScreen: "age",
    onPick: (key) => {
      state.education = key;
      state.screen = "version";
      render();
    },
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
        <button class="btn btn-ghost" id="backToEduBtn">${L(UI.back)}</button>
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
  document.getElementById("backToEduBtn").onclick = () => {
    state.screen = "education";
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

const OPTION_LETTERS = ["A", "B", "C", "D"];

function renderQuestion() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const q = section.questions[state.questionIndex];
  const currentAnswer = state.answers.iq[q.id]; // option index or undefined
  const pct = overallProgress();
  const label = L(section.label);

  appEl.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${L(UI.percentComplete)(pct, label)}</div>
    </div>
    <div class="card question-card">
      <div class="q-count">${L(UI.questionOf)(state.questionIndex + 1, section.questions.length)}</div>
      <h2 class="q-text">${L(q.text)}</h2>
      <div class="likert" id="optionsRow">
        ${q.options
          .map(
            (opt, i) => `
          <button class="likert-btn ${currentAnswer === i ? "selected" : ""}" data-val="${i}">
            <span class="likert-dot"></span>
            <span class="likert-text"><strong>${OPTION_LETTERS[i]}.</strong> ${L(opt)}</span>
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
      state.answers.iq[q.id] = Number(btn.dataset.val);
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
    if (window.trackAssessmentEvent) window.trackAssessmentEvent("assessment_completed", "iq-test");
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
  const result = scoreIQ(state.answers.iq, allQuestions);
  const adjustment = adjustComposite(result.rawComposite, state.ageGroup, state.education);
  const report = buildIQReport(result, adjustment);
  const versionLabel = L(VERSIONS[state.version || "full"].label);

  const gaugeClass = adjustment.adjusted >= 70 ? "low" : adjustment.adjusted >= 45 ? "moderate" : "high";

  const domainBars = result.ranked
    .map(
      (d) => `
    <div class="bar-row single">
      <div class="bar-labels"><span>${d.profile.emoji} ${L(d.profile.name)}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(d.score, 3)}%"></div></div>
      <div class="bar-values"><span>${d.score}%</span></div>
    </div>`
    )
    .join("");

  const reviewCards = result.missed
    .map((q) => {
      const userIdx = state.answers.iq[q.id];
      const userAns = userIdx === undefined ? L(UI.noAnswer) : `${OPTION_LETTERS[userIdx]}. ${L(q.options[userIdx])}`;
      return `
      <div class="quadrant-callout">
        <h4>${L(IQ_DOMAINS[q.domain].name)} — ${L(q.text)}</h4>
        <p><strong>${L(UI.yourAnswer)}:</strong> ${userAns} · <strong>${L(UI.correctAnswer)}:</strong> ${OPTION_LETTERS[q.answer]}. ${L(q.options[q.answer])}</p>
        <p><em>${L(q.explain)}</em></p>
      </div>`;
    })
    .join("");

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)(versionLabel)}</div>
        <h1>${report.headline}</h1>
        <p><span class="level-pill ${gaugeClass}">${L(report.band.name)} · ${adjustment.adjusted}/100</span></p>
        <p>${L(report.band.summary)}</p>
        <p class="muted small">${L(UI.indicativePrefix)} ${L(report.band.indicative)}.</p>
      </div>

      <div class="card">
        <h2>${L(UI.hOverall)}</h2>
        <div class="gauge-track"><div class="gauge-fill ${gaugeClass}" style="width:${Math.max(adjustment.adjusted, 3)}%"></div></div>
        <p class="muted">${report.adjNote}</p>
        <p>${report.strongLine} ${report.weakLine}</p>
        ${report.perfect ? `<p><strong>${report.perfect}</strong></p>` : ""}
      </div>

      <div class="card">
        <h2>${L(UI.hDomains)}</h2>
        <p class="muted">${L(UI.domainsSub)}</p>
        ${domainBars}
      </div>

      <div class="card">
        <h2>${L(UI.hContext)}</h2>
        <div class="quadrant-callout">
          <h4>${L(adjustment.age.label)}</h4>
          <p>${L(adjustment.age.blurb)}</p>
        </div>
        <div class="quadrant-callout">
          <h4>${L(adjustment.edu.label)}</h4>
          <p>${L(adjustment.edu.blurb)}</p>
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.hTips)}</h2>
        <ol class="action-list">${report.tips.map((t) => `<li>${t}</li>`).join("")}</ol>
      </div>

      ${result.missed.length
        ? `<div class="card">
        <h2>${L(UI.hReview)(result.missed.length)}</h2>
        <p class="muted">${L(UI.reviewSub)}</p>
        ${reviewCards}
      </div>`
        : ""}

      <div class="card">
        <div class="support-note"><strong>${L(UI.bigDisclaimer)}</strong></div>
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
// PDF / PNG export — design-doc §7 rules: no foreignObjectRendering;
// onclone forces .card fully visible; literal hex gradients only inside
// #results-report.
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
    downloadCanvas(canvas, "cognitive-abilities-report.png");
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

    pdf.save("cognitive-abilities-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
