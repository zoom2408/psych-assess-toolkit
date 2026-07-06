/* =========================================================================
   MAIN APP CONTROLLER — Stress & Resilience Check-In
   Same architecture as career-personality-assessment (see project design
   doc): screen state machine, autosave to localStorage with resume,
   scoring on the results screen, html2canvas/jsPDF export with the
   onclone fade-fix. The state machine is framework-agnostic — it just
   reads whatever SECTIONS/VERSIONS define.

   Bilingual (EN/VI): UI chrome strings live in UI (below), resolved with
   L() from lang.js. Question/profile content comes pre-resolved via L()
   from the { en, vi } objects defined in the data-*.js files.
========================================================================= */

const STORAGE_KEY = "stressAssessment.v1";

const UI = {
  scaleAgree: { en: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"], vi: ["Rất Không Đồng Ý", "Không Đồng Ý", "Trung Lập", "Đồng Ý", "Rất Đồng Ý"] },
  scaleFreq: { en: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], vi: ["Không Bao Giờ", "Hầu Như Không", "Thỉnh Thoảng", "Khá Thường Xuyên", "Rất Thường Xuyên"] },
  secPss: { en: "Perceived Stress", vi: "Căng Thẳng Cảm Nhận" },
  secCoping: { en: "Appraisal & Coping Style", vi: "Đánh Giá & Phong Cách Ứng Phó" },
  secDcs: { en: "Demands, Control & Support", vi: "Đòi Hỏi, Kiểm Soát & Hỗ Trợ" },
  secPerma: { en: "Wellbeing Buffers (PERMA)", vi: "Vùng Đệm Hạnh Phúc (PERMA)" },
  versionQuick: { en: "Quick", vi: "Nhanh" },
  versionFull: { en: "Full", vi: "Đầy Đủ" },
  quickBlurb: { en: "A shorter, still-balanced version covering every scale — great for a regular check-in.", vi: "Phiên bản ngắn hơn nhưng vẫn cân bằng, bao quát mọi thang đo — phù hợp để kiểm tra định kỳ." },
  fullBlurb: { en: "The complete item bank for the most accurate, detailed picture.", vi: "Bộ câu hỏi đầy đủ để có bức tranh chi tiết và chính xác nhất." },
  timeQuick: { en: "8 minutes", vi: "8 phút" },
  timeFull: { en: "20–25 minutes", vi: "20–25 phút" },
  ctxWorkLabel: { en: "Work & Career", vi: "Công Việc & Sự Nghiệp" },
  ctxWorkRange: { en: "Job, business, or professional life", vi: "Công việc, kinh doanh, hoặc đời sống nghề nghiệp" },
  ctxWorkBlurb: { en: "Your main daily demands come from paid work — advice will target workload, autonomy, and workplace support.", vi: "Đòi hỏi hằng ngày chính của bạn đến từ công việc — lời khuyên sẽ tập trung vào khối lượng công việc, quyền tự chủ, và hỗ trợ tại nơi làm việc." },
  ctxStudyLabel: { en: "Study & School", vi: "Học Tập & Trường Học" },
  ctxStudyRange: { en: "University, school, or training", vi: "Đại học, trường học, hoặc khóa đào tạo" },
  ctxStudyBlurb: { en: "Your main daily demands come from studying — advice will target coursework, deadlines, and academic support.", vi: "Đòi hỏi hằng ngày chính của bạn đến từ việc học — lời khuyên sẽ tập trung vào bài vở, thời hạn, và hỗ trợ học tập." },
  ctxLifeLabel: { en: "Life & Caregiving", vi: "Cuộc Sống & Chăm Sóc Gia Đình" },
  ctxLifeRange: { en: "Home, family, health, or caregiving", vi: "Gia đình, sức khỏe, hoặc việc chăm sóc người thân" },
  ctxLifeBlurb: { en: "Your main daily demands come from home and life responsibilities — advice will target routines, load-sharing, and support.", vi: "Đòi hỏi hằng ngày chính của bạn đến từ trách nhiệm gia đình và cuộc sống — lời khuyên sẽ tập trung vào thói quen, chia sẻ gánh nặng, và hỗ trợ." },
  welcomeBack: { en: "Welcome back 🌿", vi: "Chào mừng trở lại 🌿" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  badgeModels: { en: "Perceived Stress · Coping · Demand-Control-Support · PERMA", vi: "Căng Thẳng Cảm Nhận · Ứng Phó · Đòi Hỏi-Kiểm Soát-Hỗ Trợ · PERMA" },
  title: { en: "Stress & Resilience Check-In", vi: "Kiểm Tra Căng Thẳng & Sức Bền" },
  intro: { en: "One combined assessment of how stressed you feel, how you cope, where your stress structurally comes from, and which wellbeing buffers protect you — with a personal report and action plan.", vi: "Một bài đánh giá tổng hợp về mức độ căng thẳng bạn cảm nhận, cách bạn ứng phó, nguồn gốc cấu trúc của căng thẳng, và những vùng đệm hạnh phúc nào đang bảo vệ bạn — kèm báo cáo cá nhân và kế hoạch hành động." },
  feat1: { en: "✅ Choose a Quick (~8 min) or Full (~20-25 min) version", vi: "✅ Chọn phiên bản Nhanh (~8 phút) hoặc Đầy Đủ (~20-25 phút)" },
  feat2: { en: "💾 Auto-saves your progress — leave anytime, resume later", vi: "💾 Tự động lưu tiến trình — rời đi bất cứ lúc nào, tiếp tục sau" },
  feat3: { en: "📄 Download your full report as a PDF or PNG", vi: "📄 Tải báo cáo đầy đủ dưới dạng PDF hoặc PNG" },
  feat4: { en: "🔁 Retake anytime — useful as a monthly check-in", vi: "🔁 Làm lại bất cứ lúc nào — hữu ích như một lần kiểm tra hằng tháng" },
  disclaimer: { en: "This is a self-reflection tool grounded in established stress-research models (Lazarus & Folkman, Karasek & Theorell, Cohen, Seligman). It is not a medical or diagnostic instrument.", vi: "Đây là công cụ tự chiêm nghiệm dựa trên các mô hình nghiên cứu căng thẳng đã được thiết lập (Lazarus & Folkman, Karasek & Theorell, Cohen, Seligman). Đây không phải là công cụ y tế hay chẩn đoán." },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  ctxQuestion: { en: "Where do most of your daily demands come from?", vi: "Phần lớn đòi hỏi hằng ngày của bạn đến từ đâu?" },
  ctxSub: { en: "The questions work for any life situation — this just tailors the advice in your report to your main source of demands.", vi: "Các câu hỏi phù hợp với mọi hoàn cảnh sống — điều này chỉ giúp điều chỉnh lời khuyên trong báo cáo theo nguồn đòi hỏi chính của bạn." },
  versionQuestion: { en: "Quick or Full version?", vi: "Phiên bản Nhanh hay Đầy Đủ?" },
  versionSub: { en: "Both cover all four models and produce a full report — the Full version just asks more questions per scale for extra precision.", vi: "Cả hai đều bao quát bốn mô hình và tạo ra báo cáo đầy đủ — phiên bản Đầy Đủ chỉ hỏi nhiều câu hơn mỗi thang đo để có độ chính xác cao hơn." },
  versionSuffix: { en: (label) => `${label} Version`, vi: (label) => `Phiên Bản ${label}` },
  itemCountSuffix: { en: (n, t) => `${n} questions · ~${t}`, vi: (n, t) => `${n} câu hỏi · ~${t}` },
  back: { en: "Back", vi: "Quay Lại" },
  sectionOf: { en: (i, n) => `Section ${i} of ${n}`, vi: (i, n) => `Phần ${i} / ${n}` },
  questionsScale: { en: (n) => `${n} questions · rate each on a 1–5 scale.`, vi: (n) => `${n} câu hỏi · đánh giá mỗi câu theo thang điểm 1–5.` },
  beginSection: { en: (label) => `Begin ${label}`, vi: (label) => `Bắt Đầu ${label}` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Question ${i} of ${n}`, vi: (i, n) => `Câu hỏi ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  yourReport: { en: (ctx, ver) => `Your Stress Report · ${ctx} · ${ver} Version`, vi: (ctx, ver) => `Báo Cáo Căng Thẳng Của Bạn · ${ctx} · Phiên Bản ${ver}` },
  hPss: { en: "🌡️ Perceived Stress (past month)", vi: "🌡️ Căng Thẳng Cảm Nhận (tháng vừa qua)" },
  gaugeLow: { en: "0 · Low", vi: "0 · Thấp" },
  gaugeMod: { en: "50 · Moderate", vi: "50 · Vừa Phải" },
  gaugeHigh: { en: "100 · High", vi: "100 · Cao" },
  hCoping: { en: "🧭 How You Appraise & Cope", vi: "🧭 Cách Bạn Đánh Giá & Ứng Phó" },
  srcTransactional: { en: "— Transactional Model (Lazarus & Folkman)", vi: "— Mô Hình Giao Dịch (Lazarus & Folkman)" },
  primaryCopingLabel: { en: "Primary coping style:", vi: "Phong cách ứng phó chính:" },
  worthKnowing: { en: "Worth knowing about your style", vi: "Điều đáng biết về phong cách của bạn" },
  hDcs: { en: "🏗️ Where Your Stress Comes From", vi: "🏗️ Nguồn Gốc Căng Thẳng Của Bạn" },
  srcDcsModel: { en: "— Demand-Control-Support (Karasek & Theorell)", vi: "— Đòi Hỏi-Kiểm Soát-Hỗ Trợ (Karasek & Theorell)" },
  isoStrainSuffix: { en: " + Low Support (iso-strain)", vi: " + Hỗ Trợ Thấp (cô lập căng thẳng)" },
  patternSuffix: { en: (name, formula) => `${name} pattern — ${formula}`, vi: (name, formula) => `Mô hình ${name} — ${formula}` },
  hPerma: { en: "🛡️ Your Wellbeing Buffers", vi: "🛡️ Vùng Đệm Hạnh Phúc Của Bạn" },
  srcPermaModel: { en: "— PERMA (Seligman)", vi: "— PERMA (Seligman)" },
  overallBuffer: { en: (n) => `Overall buffer strength: ${n}%. Strong pillars protect you under load; thin ones are where resilience is cheapest to rebuild.`, vi: (n) => `Sức mạnh vùng đệm tổng thể: ${n}%. Các trụ cột mạnh bảo vệ bạn dưới áp lực; những trụ cột yếu là nơi dễ xây dựng lại sức bền nhất.` },
  rebuild: { en: (name, score) => `Rebuild: ${name} (${score}%)`, vi: (name, score) => `Xây dựng lại: ${name} (${score}%)` },
  protecting: { en: "💪 What's Protecting You", vi: "💪 Điều Đang Bảo Vệ Bạn" },
  needsAttention: { en: "⚠️ What Needs Attention", vi: "⚠️ Điều Cần Chú Ý" },
  nothingFlagged: { en: "Nothing flagged — your profile looks well-balanced across all four models.", vi: "Không có gì đáng lo — hồ sơ của bạn có vẻ cân bằng tốt trên cả bốn mô hình." },
  actionPlan: { en: "📋 Your Action Plan", vi: "📋 Kế Hoạch Hành Động Của Bạn" },
  supportNote: { en: "A note on getting help: this tool reflects how things feel — it can't diagnose anything. If stress is persistently affecting your sleep, health, mood, or relationships, or ever feels unmanageable, talking to a doctor or mental-health professional is a practical and effective next step, not a last resort.", vi: "Một lưu ý về việc tìm kiếm sự giúp đỡ: công cụ này phản ánh cảm nhận của bạn — nó không thể chẩn đoán bất cứ điều gì. Nếu căng thẳng đang ảnh hưởng dai dẳng đến giấc ngủ, sức khỏe, tâm trạng, hoặc các mối quan hệ của bạn, hoặc cảm thấy không thể kiểm soát được, việc trò chuyện với bác sĩ hoặc chuyên gia sức khỏe tâm thần là một bước đi thiết thực và hiệu quả — không phải là lựa chọn cuối cùng." },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Check-In", vi: "🔁 Làm Lại Bài Kiểm Tra" },
  retakeNote: { en: "Your results are saved automatically in this browser. Retaking clears your saved answers and starts fresh — a monthly retake is a good way to track how changes are working. If the PDF ever looks off, the PNG is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn được tự động lưu trong trình duyệt này. Làm lại sẽ xóa các câu trả lời đã lưu và bắt đầu lại từ đầu — làm lại hằng tháng là cách tốt để theo dõi hiệu quả của những thay đổi. Nếu PDF có vấn đề hiển thị, PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new check-in. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một bài kiểm tra hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
  appraisalChallenge: { en: "You tend to appraise demanding situations as <strong>challenges</strong> — an asset under pressure.", vi: "Bạn có xu hướng nhìn nhận các tình huống đòi hỏi như <strong>thử thách</strong> — một lợi thế khi chịu áp lực." },
  appraisalBalanced: { en: "Your appraisal of demanding situations is <strong>balanced</strong> — sometimes challenge, sometimes threat, depending on the situation.", vi: "Cách bạn đánh giá các tình huống đòi hỏi khá <strong>cân bằng</strong> — đôi khi là thử thách, đôi khi là mối đe dọa, tùy tình huống." },
  appraisalThreat: { en: "Demanding situations currently tend to register as <strong>threats</strong> — this amplifies stress, and it's trainable (see your action plan).", vi: "Các tình huống đòi hỏi hiện có xu hướng được cảm nhận như <strong>mối đe dọa</strong> — điều này khuếch đại căng thẳng, và đây là điều có thể rèn luyện được (xem kế hoạch hành động của bạn)." },
  introPss: { en: "First, a snapshot of how stressed life has actually felt over the past month — how often things felt overloaded, unpredictable, or out of your control. Answer with how OFTEN each has been true.", vi: "Trước tiên, một bức tranh tổng quan về mức độ căng thẳng thực sự trong tháng vừa qua — tần suất mọi thứ cảm thấy quá tải, khó đoán, hoặc ngoài tầm kiểm soát. Hãy trả lời theo mức độ THƯỜNG XUYÊN mà mỗi điều đúng với bạn." },
  introCoping: { en: "Stress lives in the transaction between events and you (Lazarus & Folkman). This section looks at how you appraise demanding situations and which coping strategies you reach for.", vi: "Căng thẳng tồn tại trong sự tương tác giữa sự kiện và bạn (Lazarus & Folkman). Phần này xem xét cách bạn đánh giá các tình huống đòi hỏi và những chiến lược ứng phó bạn thường dùng." },
  introDcs: { en: "Now the structure of your stress (Karasek & Theorell): how heavy your daily demands are, how much say you have over them, and how supported you are while carrying them.", vi: "Tiếp theo là cấu trúc căng thẳng của bạn (Karasek & Theorell): đòi hỏi hằng ngày của bạn nặng đến đâu, bạn có bao nhiêu tiếng nói đối với chúng, và bạn được hỗ trợ ra sao khi gánh vác chúng." },
  introPerma: { en: "Finally, your buffers (Seligman's PERMA): the five pillars of wellbeing — positive emotion, engagement, relationships, meaning, and accomplishment — that protect you under load.", vi: "Cuối cùng là các vùng đệm của bạn (PERMA của Seligman): năm trụ cột hạnh phúc — cảm xúc tích cực, sự gắn kết, các mối quan hệ, ý nghĩa, và thành tựu — bảo vệ bạn dưới áp lực." },
};

const SCALE_DISPLAY = {
  coping: {
    PF: { en: "Problem-Focused (PF)", vi: "Tập Trung Vào Vấn Đề (PF)" },
    EF: { en: "Emotion-Focused (EF)", vi: "Tập Trung Vào Cảm Xúc (EF)" },
    AV: { en: "Avoidant (AV)", vi: "Né Tránh (AV)" },
    AP: { en: "Challenge Appraisal (AP)", vi: "Đánh Giá Thử Thách (AP)" },
  },
  dcs: {
    DE: { en: "Demands", vi: "Đòi Hỏi" },
    CO: { en: "Control", vi: "Kiểm Soát" },
    SU: { en: "Support", vi: "Hỗ Trợ" },
  },
};

// Full-length sections (100 items total, ~20-25 minutes)
const SECTIONS_FULL = [
  { key: "pss", label: UI.secPss, questions: PSS_QUESTIONS, scaleLabels: UI.scaleFreq },
  { key: "coping", label: UI.secCoping, questions: COPING_QUESTIONS, scaleLabels: UI.scaleAgree },
  { key: "dcs", label: UI.secDcs, questions: DCS_QUESTIONS, scaleLabels: UI.scaleAgree },
  { key: "perma", label: UI.secPerma, questions: PERMA_QUESTIONS, scaleLabels: UI.scaleAgree },
];

// Quick sections (33 items total, ~8 minutes) — balanced core subsets.
const SECTIONS_CORE = [
  { key: "pss", label: UI.secPss, questions: PSS_QUESTIONS_CORE, scaleLabels: UI.scaleFreq },
  { key: "coping", label: UI.secCoping, questions: COPING_QUESTIONS_CORE, scaleLabels: UI.scaleAgree },
  { key: "dcs", label: UI.secDcs, questions: DCS_QUESTIONS_CORE, scaleLabels: UI.scaleAgree },
  { key: "perma", label: UI.secPerma, questions: PERMA_QUESTIONS_CORE, scaleLabels: UI.scaleAgree },
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

const CONTEXTS = [
  { key: "work", label: UI.ctxWorkLabel, range: UI.ctxWorkRange, blurb: UI.ctxWorkBlurb },
  { key: "study", label: UI.ctxStudyLabel, range: UI.ctxStudyRange, blurb: UI.ctxStudyBlurb },
  { key: "life", label: UI.ctxLifeLabel, range: UI.ctxLifeRange, blurb: UI.ctxLifeBlurb },
];

const DEFAULT_STATE = () => ({
  context: null, // "work" | "study" | "life"
  version: null, // "concise" | "full"
  screen: "welcome", // welcome | context | version | section-intro | question | results
  sectionIndex: 0,
  questionIndex: 0,
  answers: { pss: {}, coping: {}, dcs: {}, perma: {} },
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
  return ["pss", "coping", "dcs", "perma"].reduce((n, k) => n + Object.keys(a[k] || {}).length, 0);
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
  if (state.screen === "context") return renderContextSelect();
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
      <p class="muted small">${L(UI.disclaimer)}</p>
      <button class="btn btn-primary btn-lg" id="startBtn">${L(UI.getStarted)}</button>
    </div>`;
  document.getElementById("startBtn").onclick = () => {
    state.screen = "context";
    render();
  };
}

function renderContextSelect() {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.ctxQuestion)}</h1>
      <p>${L(UI.ctxSub)}</p>
      <div class="age-grid">
        ${CONTEXTS.map(
          (c) => `
          <button class="age-card" data-key="${c.key}">
            <span class="age-label">${L(c.label)}</span>
            <span class="age-range">${L(c.range)}</span>
            <span class="age-blurb">${L(c.blurb)}</span>
          </button>`
        ).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".age-card").forEach((btn) => {
    btn.onclick = () => {
      state.context = btn.dataset.key;
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
        <button class="btn btn-ghost" id="backToContextBtn">${L(UI.back)}</button>
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
  document.getElementById("backToContextBtn").onclick = () => {
    state.screen = "context";
    render();
  };
}

function renderSectionIntro() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const intros = {
    pss: L(UI.introPss),
    coping: L(UI.introCoping),
    dcs: L(UI.introDcs),
    perma: L(UI.introPerma),
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
    if (window.trackAssessmentEvent) window.trackAssessmentEvent("assessment_completed", "stress-assessment");
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
  // IMPORTANT: pass the actual question arrays answered (Quick vs Full).
  const pss = scorePSS(state.answers.pss, sections.find((s) => s.key === "pss").questions);
  const coping = scoreCoping(state.answers.coping, sections.find((s) => s.key === "coping").questions);
  const dcs = scoreDCS(state.answers.dcs, sections.find((s) => s.key === "dcs").questions);
  const perma = scorePERMA(state.answers.perma, sections.find((s) => s.key === "perma").questions);
  const report = buildStressReport(state.context, pss, coping, dcs, perma);
  const contextLabel = L(CONTEXTS.find((c) => c.key === state.context).label);
  const versionLabel = L(VERSIONS[state.version || "full"].label);

  const appraisalLine = {
    challenge: L(UI.appraisalChallenge),
    balanced: L(UI.appraisalBalanced),
    threat: L(UI.appraisalThreat),
  }[coping.appraisal];

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)(contextLabel, versionLabel)}</div>
        <h1>${report.headline}</h1>
        <p><span class="level-pill ${pss.level}">${L(pss.profile.name)} · ${pss.score}/100</span></p>
        <p>${L(pss.profile.summary)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hPss)}</h2>
        <div class="gauge-track"><div class="gauge-fill ${pss.level}" style="width:${Math.max(pss.score, 3)}%"></div></div>
        <div class="gauge-scale"><span>${L(UI.gaugeLow)}</span><span>${L(UI.gaugeMod)}</span><span>${L(UI.gaugeHigh)}</span></div>
        <p class="muted">${L(pss.profile.whatItMeans)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hCoping)} <span class="src">${L(UI.srcTransactional)}</span></h2>
        <p>${appraisalLine}</p>
        <p><strong>${L(UI.primaryCopingLabel)}</strong> ${L(coping.primaryProfile.name)} — <em>${L(coping.primaryProfile.nickname)}</em></p>
        <p class="muted">${L(coping.primaryProfile.summary)}</p>
        ${["PF", "EF", "AV", "AP"]
          .map(
            (scale) => `
          <div class="bar-row single">
            <div class="bar-labels"><span>${L(SCALE_DISPLAY.coping[scale])}</span></div>
            <div class="bar-track"><div class="bar-fill coping" style="width:${coping.scores[scale]}%"></div></div>
            <div class="bar-values"><span>${coping.scores[scale]}%</span></div>
          </div>`
          )
          .join("")}
        <h3>${L(UI.worthKnowing)}</h3>
        <ul>
          ${L(coping.primaryProfile.strengths).map((s) => `<li>${s}</li>`).join("")}
          ${L(coping.primaryProfile.watchOuts).map((w) => `<li>${w}</li>`).join("")}
        </ul>
      </div>

      <div class="card">
        <h2>${L(UI.hDcs)} <span class="src">${L(UI.srcDcsModel)}</span></h2>
        ${["DE", "CO", "SU"]
          .map(
            (scale) => `
          <div class="bar-row single">
            <div class="bar-labels"><span>${L(SCALE_DISPLAY.dcs[scale])}</span></div>
            <div class="bar-track"><div class="bar-fill dcs" style="width:${dcs.scores[scale]}%"></div></div>
            <div class="bar-values"><span>${dcs.scores[scale]}%</span></div>
          </div>`
          )
          .join("")}
        <div class="quadrant-callout">
          <h4>${L(UI.patternSuffix)(L(dcs.quadrantProfile.name), L(dcs.quadrantProfile.formula))}${dcs.isoStrain ? L(UI.isoStrainSuffix) : ""}</h4>
          <p>${L(dcs.quadrantProfile.summary)}</p>
          <p><em>${L(dcs.quadrantProfile.riskNote)}</em></p>
        </div>
        <div class="quadrant-callout">
          <h4>${L(dcs.supportNote.name)}</h4>
          <p>${L(dcs.supportNote.text)}</p>
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.hPerma)} <span class="src">${L(UI.srcPermaModel)}</span></h2>
        <p class="muted">${L(UI.overallBuffer)(perma.overall)}</p>
        ${perma.ranked
          .map(
            (p) => `
          <div class="bar-row single">
            <div class="bar-labels"><span>${p.profile.letter} — ${L(p.profile.name)}</span></div>
            <div class="bar-track"><div class="bar-fill perma" style="width:${p.score}%"></div></div>
            <div class="bar-values"><span>${p.score}%</span></div>
          </div>`
          )
          .join("")}
        <div class="theme-cards">
          ${perma.weakest
            .map(
              (p) => `
            <div class="theme-card">
              <h4>${L(UI.rebuild)(L(p.profile.name), p.score)}</h4>
              <p>${L(p.profile.boosters)[0]}</p>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <div class="card two-col">
        <div>
          <h2>${L(UI.protecting)}</h2>
          <ul>${report.strengths.map((s) => `<li>${s.text} <span class="src">— ${s.source}</span></li>`).join("")}</ul>
        </div>
        <div>
          <h2>${L(UI.needsAttention)}</h2>
          <ul>${report.riskAreas.length ? report.riskAreas.map((g) => `<li>${g.text} <span class="src">— ${g.source}</span></li>`).join("") : `<li>${L(UI.nothingFlagged)}</li>`}</ul>
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.actionPlan)}</h2>
        <ol class="action-list">${report.actionPlan.map((a) => `<li>${a}</li>`).join("")}</ol>
        <div class="support-note">
          <strong>${L(UI.supportNote)}</strong>
        </div>
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
// PDF / PNG export (jsPDF + html2canvas, loaded via CDN in index.html)
// ---------------------------------------------------------------------
// Two hard-won rules carried over from the career app (design doc §7):
// 1. No `foreignObjectRendering` — it silently produces a blank canvas
//    in some browsers.
// 2. `onclone` must force every .card to its fully-visible state,
//    because html2canvas's DOM clone restarts the fadeIn animation and
//    snapshots it mid-fade (washed-out export).
// Also: every gradient inside #results-report uses literal hex values,
// never var(--...), because var()-in-gradient breaks html2canvas colors.
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
    downloadCanvas(canvas, "stress-resilience-report.png");
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

    pdf.save("stress-resilience-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
