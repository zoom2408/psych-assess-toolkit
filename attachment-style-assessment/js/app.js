/* =========================================================================
   MAIN APP CONTROLLER — Attachment Style Assessment (ECR-R inspired)
   Same architecture as the other assessments in this project (design doc):
   screen state machine, autosave to localStorage with resume, scoring on
   the results screen, html2canvas/jsPDF export with the onclone fade-fix.

   Simplest flow variant (design doc §5/§9): welcome -> version (Quick/Full)
   -> section-intro (Anxiety) -> question (Anxiety items) -> section-intro
   (Avoidance) -> question (Avoidance items) -> results. There's only one
   instrument (no age/demographic gating), but items are split into two
   labeled sections with a short intro screen between them, mirroring the
   iq-test per-domain section-intro pattern.

   Likert response buttons reuse the 7-point .likert-btn component pattern
   from stress-assessment (not the IQ app's A-D multiple-choice buttons).

   Bilingual (EN/VI) via ../shared/i18n.js — same shared language toggle
   and localStorage key as every other app on the hub.
========================================================================= */

const STORAGE_KEY = "attachmentStyle.v1";

const UI = {
  versionQuick: { en: "Quick", vi: "Nhanh" },
  versionFull: { en: "Full", vi: "Đầy Đủ" },
  quickBlurb: { en: "12 statements per dimension — a fast snapshot of your attachment pattern.", vi: "12 câu mỗi khía cạnh — bức tranh nhanh về mô hình gắn bó của bạn." },
  fullBlurb: { en: "18 statements per dimension — the most reliable picture of your attachment pattern.", vi: "18 câu mỗi khía cạnh — bức tranh đáng tin cậy nhất về mô hình gắn bó của bạn." },
  timeQuick: { en: "6–8 minutes", vi: "6–8 phút" },
  timeFull: { en: "10–14 minutes", vi: "10–14 phút" },
  welcomeBack: { en: "Welcome back 💞", vi: "Chào mừng trở lại 💞" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  badge: { en: "Anxiety · Avoidance · Attachment Style", vi: "Lo Âu · Né Tránh · Kiểu Gắn Bó" },
  title: { en: "Attachment Style Assessment", vi: "Đánh Giá Kiểu Gắn Bó" },
  intro: {
    en: "Explore your adult attachment pattern across two well-studied dimensions — Anxiety (fear of rejection/abandonment) and Avoidance (discomfort with closeness/dependence) — inspired by the ECR-R research instrument. Your report shows both dimension scores and an overall pattern: Secure, Anxious-Preoccupied, Dismissive-Avoidant, or Fearful-Avoidant.",
    vi: "Khám phá mô hình gắn bó ở người trưởng thành của bạn qua hai khía cạnh đã được nghiên cứu kỹ — Lo Âu (sợ bị từ chối/bỏ rơi) và Né Tránh (không thoải mái với sự gần gũi/phụ thuộc) — lấy cảm hứng từ công cụ nghiên cứu ECR-R. Báo cáo của bạn sẽ cho thấy điểm số của cả hai khía cạnh và một mô hình tổng thể: An Toàn, Lo Âu-Bận Tâm, Né Tránh-Xa Cách, hoặc Lo Âu-Né Tránh.",
  },
  feat1: { en: "✅ Choose a Quick (~7 min) or Full (~12 min) version", vi: "✅ Chọn phiên bản Nhanh (~7 phút) hoặc Đầy Đủ (~12 phút)" },
  feat2: { en: "💭 Two dimensions: Anxiety and Avoidance, each with its own score", vi: "💭 Hai khía cạnh: Lo Âu và Né Tránh, mỗi khía cạnh có điểm số riêng" },
  feat3: { en: "🧭 An overall pattern with strengths and growth tips, not just a label", vi: "🧭 Một mô hình tổng thể kèm điểm mạnh và gợi ý phát triển, không chỉ là một nhãn dán" },
  feat4: { en: "📄 Full report, PDF/PNG export", vi: "📄 Báo cáo đầy đủ, xuất PDF/PNG" },
  disclaimer: {
    en: "This is an educational self-reflection tool with originally-written items inspired by (not a reproduction of) the ECR-R research instrument. It is NOT a clinical or diagnostic assessment of attachment. If attachment patterns are affecting your relationships or mental health, please talk to a licensed therapist or counselor.",
    vi: "Đây là công cụ tự chiêm nghiệm mang tính giáo dục với các câu hỏi được viết mới, lấy cảm hứng từ (không sao chép) công cụ nghiên cứu ECR-R. Đây KHÔNG phải là đánh giá lâm sàng hay chẩn đoán về sự gắn bó. Nếu các mô hình gắn bó đang ảnh hưởng đến các mối quan hệ hoặc sức khỏe tâm thần của bạn, vui lòng trò chuyện với một nhà trị liệu hoặc chuyên gia tư vấn có chứng chỉ hành nghề.",
  },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  versionQuestion: { en: "Quick or Full version?", vi: "Phiên bản Nhanh hay Đầy Đủ?" },
  versionSub: { en: "Both cover the same two dimensions and produce the same report — the Full version asks more statements per dimension for a more reliable picture.", vi: "Cả hai đều bao quát cùng hai khía cạnh và tạo cùng một báo cáo — phiên bản Đầy Đủ hỏi nhiều câu hơn mỗi khía cạnh để có bức tranh đáng tin cậy hơn." },
  versionSuffix: { en: (label) => `${label} Version`, vi: (label) => `Phiên Bản ${label}` },
  itemCountSuffix: { en: (n, t) => `${n} statements · ~${t}`, vi: (n, t) => `${n} câu · ~${t}` },
  back: { en: "Back", vi: "Quay Lại" },
  relContextQuestion: { en: "Which best describes you right now?", vi: "Điều nào mô tả đúng nhất về bạn lúc này?" },
  relContextSub: {
    en: "The statements ahead say \"partner\" — this just tells us how to help you interpret them. It doesn't change how anything is scored.",
    vi: "Các câu phía sau sẽ nhắc đến \"người ấy\" — lựa chọn này chỉ giúp chúng tôi hướng dẫn bạn cách diễn giải câu hỏi. Nó không thay đổi cách chấm điểm.",
  },
  relPartnered: {
    key: "partnered",
    label: { en: "Currently in a relationship", vi: "Hiện đang trong một mối quan hệ" },
    blurb: { en: "Answer with your current partner in mind.", vi: "Trả lời với người ấy hiện tại trong tâm trí." },
  },
  relSingleHistory: {
    key: "single",
    label: { en: "Single, with past relationship(s)", vi: "Độc thân, đã từng có mối quan hệ" },
    blurb: { en: "Answer based on your most recent relationship, or your general pattern across past ones.", vi: "Trả lời dựa trên mối quan hệ gần đây nhất, hoặc mô hình chung của bạn qua các mối quan hệ trước đây." },
  },
  relNever: {
    key: "never",
    label: { en: "Never been in a relationship", vi: "Chưa từng có mối quan hệ nào" },
    blurb: { en: "Answer with how you'd expect yourself to feel — close friendships or family bonds are fine to draw on too.", vi: "Trả lời theo cách bạn nghĩ mình sẽ cảm thấy — bạn cũng có thể dựa vào tình bạn thân thiết hoặc mối quan hệ gia đình." },
  },
  sectionContextNote: {
    partnered: { en: "Think of your current partner as you answer.", vi: "Hãy nghĩ đến người ấy hiện tại khi trả lời." },
    single: { en: "Think of your most recent relationship, or your general pattern across past ones, as you answer.", vi: "Hãy nghĩ đến mối quan hệ gần đây nhất, hoặc mô hình chung của bạn, khi trả lời." },
    never: { en: "Answer with how you'd expect yourself to feel in a close relationship — close friendships or family bonds are fine to draw on too.", vi: "Hãy trả lời theo cách bạn nghĩ mình sẽ cảm thấy trong một mối quan hệ gần gũi — bạn cũng có thể dựa vào tình bạn thân thiết hoặc gia đình." },
  },
  neverPartneredCaveat: {
    en: "You told us you haven't been in a relationship yet, so these statements were answered as a projection rather than lived experience. This instrument (and the ECR-R it's inspired by) is normed on people with actual romantic-relationship experience, so treat this score as a rougher approximation of your likely pattern — not a firm read.",
    vi: "Bạn cho biết mình chưa từng có mối quan hệ nào, nên các câu trả lời này mang tính dự đoán hơn là trải nghiệm thực tế. Công cụ này (và ECR-R mà nó lấy cảm hứng) được chuẩn hóa trên những người đã có trải nghiệm mối quan hệ tình cảm thực sự, vì vậy hãy xem điểm số này là một ước lượng gần đúng hơn về mô hình có khả năng của bạn — không phải một kết quả chắc chắn.",
  },
  sectionOf: { en: (i, n) => `Section ${i} of ${n}`, vi: (i, n) => `Phần ${i} / ${n}` },
  sectionCovers: { en: (n) => `${n} statements. Answer honestly based on how you generally feel in close relationships, not just your current one.`, vi: (n) => `${n} câu. Hãy trả lời trung thực dựa trên cảm nhận chung của bạn trong các mối quan hệ thân thiết, không chỉ mối quan hệ hiện tại.` },
  beginSection: { en: (label) => `Begin ${label}`, vi: (label) => `Bắt Đầu ${label}` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Statement ${i} of ${n}`, vi: (i, n) => `Câu ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  yourReport: { en: (ver) => `Your Attachment Profile · ${ver} Version`, vi: (ver) => `Hồ Sơ Gắn Bó Của Bạn · Phiên Bản ${ver}` },
  hOverall: { en: "🧭 Your Overall Pattern", vi: "🧭 Mô Hình Tổng Thể Của Bạn" },
  hDims: { en: "📊 Your Two Dimensions", vi: "📊 Hai Khía Cạnh Của Bạn" },
  dimsSub: { en: "Each score is your average response on that dimension's items (1.0–7.0 scale; 4.0 is the midpoint used to sort patterns below).", vi: "Mỗi điểm số là mức trung bình các câu trả lời của bạn trên khía cạnh đó (thang 1,0–7,0; 4,0 là điểm giữa dùng để phân loại mô hình bên dưới)." },
  hStrengths: { en: "🌱 Relationship Strengths", vi: "🌱 Điểm Mạnh Trong Mối Quan Hệ" },
  hTips: { en: "💡 Growth Tips", vi: "💡 Gợi Ý Phát Triển" },
  hAnxietyResources: { en: "🧘 Managing the Anxiety", vi: "🧘 Quản Lý Sự Lo Âu" },
  hTechniques: { en: "Techniques to try today", vi: "Kỹ thuật để thử ngay hôm nay" },
  hFrontlineTherapy: { en: "Approaches worth exploring", vi: "Các phương pháp đáng khám phá" },
  hDeeperWork: { en: "If it traces back further", vi: "Nếu nó bắt nguồn từ trước đó" },
  hCutoff: { en: "ℹ️ How This Categorization Works", vi: "ℹ️ Cách Phân Loại Này Hoạt Động" },
  bigDisclaimer: {
    en: "Remember: this is a self-administered educational reflection tool, not a clinical or diagnostic assessment of attachment. Attachment patterns are shaped by experience and can shift over time, especially with secure relationships or professional support. If attachment concerns are affecting your relationships or mental health, please see a licensed therapist.",
    vi: "Xin nhớ: đây là công cụ tự chiêm nghiệm mang tính giáo dục, không phải đánh giá lâm sàng hay chẩn đoán về sự gắn bó. Mô hình gắn bó được hình thành bởi trải nghiệm và có thể thay đổi theo thời gian, đặc biệt khi có các mối quan hệ an toàn hoặc sự hỗ trợ chuyên môn. Nếu những lo ngại về sự gắn bó đang ảnh hưởng đến các mối quan hệ hoặc sức khỏe tâm thần của bạn, vui lòng gặp một nhà trị liệu có chứng chỉ hành nghề.",
  },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Assessment", vi: "🔁 Làm Lại Đánh Giá" },
  retakeNote: { en: "Your results are saved automatically in this browser. Retaking clears your saved answers and starts fresh. If the PDF ever looks off, the PNG is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn được tự động lưu trong trình duyệt này. Làm lại sẽ xóa các câu trả lời đã lưu và bắt đầu lại từ đầu. Nếu PDF có vấn đề hiển thị, PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new assessment. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một đánh giá hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
};

/* Section metadata for the two labeled sections (Anxiety, then Avoidance). */
const SECTION_META = {
  anxiety: {
    key: "anxiety",
    label: { en: "Anxiety", vi: "Lo Âu Gắn Bó" },
    emoji: "💭",
    blurb: {
      en: "These statements ask about worry, reassurance-seeking, and fear of losing your partner's love.",
      vi: "Những câu này hỏi về sự lo lắng, việc tìm kiếm sự trấn an, và nỗi sợ mất đi tình yêu của người ấy.",
    },
  },
  avoidance: {
    key: "avoidance",
    label: { en: "Avoidance", vi: "Né Tránh Gắn Bó" },
    emoji: "🚪",
    blurb: {
      en: "These statements ask about comfort with closeness, depending on a partner, and emotional openness.",
      vi: "Những câu này hỏi về sự thoải mái với gần gũi, việc dựa vào người ấy, và sự cởi mở cảm xúc.",
    },
  },
};

function _sectionsFrom(bank) {
  return ["anxiety", "avoidance"].map((key) => ({
    key,
    label: SECTION_META[key].label,
    emoji: SECTION_META[key].emoji,
    blurb: SECTION_META[key].blurb,
    questions: bank.filter((q) => q.subscale === key),
  }));
}
const SECTIONS_FULL = _sectionsFrom(ECRR_QUESTIONS);
const SECTIONS_CORE = _sectionsFrom(ECRR_QUESTIONS_CORE);

const VERSIONS = {
  quick: {
    key: "quick",
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

// Relationship-context options shown after version select, before items.
// Doesn't affect scoring — only which instructional framing is shown on the
// section-intro screens and, for "never", a caveat added to the report.
const REL_CONTEXTS = [UI.relPartnered, UI.relSingleHistory, UI.relNever];

const DEFAULT_STATE = () => ({
  version: null, // "quick" | "full"
  relContext: null, // "partnered" | "single" | "never"
  screen: "welcome", // welcome | version | relationship-context | section-intro | question | results
  sectionIndex: 0,
  questionIndex: 0,
  answers: { ecrr: {} }, // { itemId: 1-7 }
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
  return Object.keys((saved.answers || {}).ecrr || {}).length;
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
  if (state.screen === "relationship-context") return renderRelationshipContext();
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
      state.screen = "relationship-context";
      render();
    };
  });
  document.getElementById("backToWelcomeBtn").onclick = () => {
    state.screen = "welcome";
    render();
  };
}

function renderRelationshipContext() {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.relContextQuestion)}</h1>
      <p>${L(UI.relContextSub)}</p>
      <div class="age-grid">
        ${REL_CONTEXTS.map(
          (opt) => `
          <button class="age-card" data-key="${opt.key}">
            <span class="age-label">${L(opt.label)}</span>
            <span class="age-blurb">${L(opt.blurb)}</span>
          </button>`
        ).join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backToVersionBtn">${L(UI.back)}</button>
      </div>
    </div>`;
  document.querySelectorAll(".age-card").forEach((btn) => {
    btn.onclick = () => {
      state.relContext = btn.dataset.key;
      state.screen = "section-intro";
      state.sectionIndex = 0;
      render();
    };
  });
  document.getElementById("backToVersionBtn").onclick = () => {
    state.screen = "version";
    render();
  };
}

function renderSectionIntro() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const label = L(section.label);
  const contextNote = UI.sectionContextNote[state.relContext || "partnered"];
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.sectionOf)(state.sectionIndex + 1, sections.length)}</div>
      <h1>${section.emoji} ${label}</h1>
      <p>${L(section.blurb)}</p>
      <p class="muted small"><em>${L(contextNote)}</em></p>
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
  const currentAnswer = state.answers.ecrr[q.id]; // 1-7 or undefined
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
      <div class="likert" id="likertRow">
        ${ECRR_LIKERT_LABELS
          .map(
            (label, i) => `
          <button class="likert-btn ${currentAnswer === i + 1 ? "selected" : ""}" data-val="${i + 1}">
            <span class="likert-dot"></span>
            <span class="likert-text">${L(label)}</span>
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
      state.answers.ecrr[q.id] = Number(btn.dataset.val);
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
// Anxiety resources card — only rendered when report.anxietyResources is
// non-null (Anxiety dimension High; see buildReport() in scoring.js).
// Two tiers: front-line techniques/therapy, then a "deeper work" tier for
// family-of-origin/trauma-rooted patterns (design doc: see scoring.js
// ANXIETY_RESOURCES doc comment for the reasoning behind the split).
// ---------------------------------------------------------------------
function renderAnxietyResources(res) {
  const techniqueItems = res.techniques.map((t) => `<li>${L(t)}</li>`).join("");

  const modalityCard = (m) => `
    <div class="quadrant-callout">
      <h4>${L(m.name)}</h4>
      <p>${L(m.whatItIs)}</p>
      <p class="muted small"><em>${L(m.whyItFits)}</em></p>
    </div>`;

  const frontlineItems = res.frontlineTherapy.map(modalityCard).join("");
  const deeperItems = res.deeperWorkTherapy.items.map(modalityCard).join("");

  return `
      <div class="card">
        <h2>${L(UI.hAnxietyResources)}</h2>
        <p class="muted">${L(res.intro)}</p>

        <h3>${L(UI.hTechniques)}</h3>
        <ol class="action-list">${techniqueItems}</ol>

        <h3>${L(UI.hFrontlineTherapy)}</h3>
        ${frontlineItems}

        <h3>${L(UI.hDeeperWork)}</h3>
        <p class="muted small">${L(res.deeperWorkTherapy.intro)}</p>
        ${deeperItems}

        <p class="muted small" style="margin-top:14px;">${L(res.disclaimer)}</p>
      </div>`;
}

// ---------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------
function renderResults() {
  const sections = currentSections();
  // IMPORTANT: pass the actual question array answered (Quick vs Full).
  const allQuestions = sections.flatMap((s) => s.questions);
  const result = scoreAttachment(state.answers.ecrr, allQuestions);
  const report = buildReport(result);
  const versionLabel = L(VERSIONS[state.version || "full"].label);

  const dimBars = report.dims
    .map(
      (d) => `
    <div class="bar-row single">
      <div class="bar-labels"><span>${d.emoji} ${L(d.name)} — ${L(d.label)}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(d.pct, 3)}%"></div></div>
      <div class="bar-values"><span>${d.display} / 7</span></div>
    </div>
    <p class="muted small">${L(d.blurb)}</p>`
    )
    .join("");

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)(versionLabel)}</div>
        <h1>${report.headline}</h1>
        <p><span class="level-pill moderate">${L(report.profile.formula)}</span></p>
        <p>${L(report.profile.oneLiner)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hOverall)}</h2>
        <p>${L(report.profile.description)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hDims)}</h2>
        <p class="muted">${L(UI.dimsSub)}</p>
        ${dimBars}
      </div>

      <div class="card">
        <h2>${L(UI.hStrengths)}</h2>
        <ul class="feature-list">${report.strengths.map((s) => `<li>${L(s)}</li>`).join("")}</ul>
      </div>

      <div class="card">
        <h2>${L(UI.hTips)}</h2>
        <ol class="action-list">${report.tips.map((t) => `<li>${L(t)}</li>`).join("")}</ol>
      </div>

      ${report.anxietyResources ? renderAnxietyResources(report.anxietyResources) : ""}

      <div class="card">
        <h2>${L(UI.hCutoff)}</h2>
        <div class="quadrant-callout">
          <p>${report.cutoffNote}</p>
        </div>
        ${state.relContext === "never" ? `<div class="quadrant-callout"><p>${L(UI.neverPartneredCaveat)}</p></div>` : ""}
      </div>

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
    downloadCanvas(canvas, "attachment-style-report.png");
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

    pdf.save("attachment-style-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
