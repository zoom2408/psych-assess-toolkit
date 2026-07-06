/* =========================================================================
   MAIN APP CONTROLLER — ADHD Self-Screener (ASRS v1.1 · WHO)
   Same architecture as the other apps in this project (see
   ASSESSMENT-APP-DESIGN.md): screen state machine, autosave to
   localStorage with resume, html2canvas/jsPDF export with the onclone
   fade-fix, bilingual EN/VI via shared/i18n.js.

   Key difference from the other apps: the ASRS v1.1 is a validated
   instrument used WHOLE (no Quick/Full split — see scoring.js header),
   and there is a mandatory acknowledgement screen before the instrument
   starts, plus repeated "screener ≠ diagnosis" framing throughout,
   because that framing is the single most important thing this app needs
   to get right.
========================================================================= */

const STORAGE_KEY = "adhdScreener.v1";

const UI = {
  title: { en: "ADHD Self-Screener", vi: "Công Cụ Tự Sàng Lọc ADHD" },
  subtitle: { en: "ASRS v1.1 · World Health Organization", vi: "ASRS v1.1 · Tổ Chức Y Tế Thế Giới" },
  badge: { en: "WHO Adult ADHD Self-Report Scale v1.1 + context questions", vi: "Thang Tự Đánh Giá ADHD Người Lớn của WHO v1.1 + câu hỏi bối cảnh" },
  intro: {
    en: "A free, validated 18-item ADHD symptom checklist developed with the World Health Organization, followed by extra questions about how attention shows up at school, work, home, and in your history — so you have a fuller, more useful picture to bring to a clinician.",
    vi: "Một bảng kiểm 18 mục về triệu chứng ADHD miễn phí, đã được kiểm định, được xây dựng cùng Tổ Chức Y Tế Thế Giới, kèm theo các câu hỏi bổ sung về cách sự chú ý biểu hiện ở trường học, công việc, gia đình, và trong lịch sử của bạn — để bạn có một bức tranh đầy đủ và hữu ích hơn khi mang đến gặp chuyên gia.",
  },
  bigDisclaimer: {
    en: "⚠️ This is a screening tool, not a diagnostic test. It cannot tell you whether you have ADHD. Only a qualified clinician can diagnose ADHD, through a full evaluation.",
    vi: "⚠️ Đây là công cụ sàng lọc, không phải bài kiểm tra chẩn đoán. Nó không thể cho bạn biết liệu bạn có mắc ADHD hay không. Chỉ một chuyên gia có trình độ mới có thể chẩn đoán ADHD, thông qua một buổi đánh giá toàn diện.",
  },
  feat1: { en: "✅ The real, unmodified WHO ASRS v1.1 checklist (18 items)", vi: "✅ Bảng kiểm ASRS v1.1 nguyên bản, không chỉnh sửa của WHO (18 mục)" },
  feat2: { en: "🎓 Extra context on school, work, home, and childhood history", vi: "🎓 Bối cảnh bổ sung về trường học, công việc, gia đình, và lịch sử thời thơ ấu" },
  feat3: { en: "💾 Auto-saves your progress — leave anytime, resume later", vi: "💾 Tự động lưu tiến trình — rời đi bất cứ lúc nào, tiếp tục sau" },
  feat4: { en: "📄 Download a report you can bring to a clinician (PDF/PNG)", vi: "📄 Tải báo cáo có thể mang đến gặp chuyên gia (PDF/PNG)" },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  welcomeBack: { en: "Welcome back", vi: "Chào mừng trở lại" },
  savedSession: { en: (n) => `We found a saved session with ${n} answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n} câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },

  ageQuestion: { en: "Which age range are you in?", vi: "Bạn thuộc độ tuổi nào?" },
  ageSub: { en: "This tailors the wording of the follow-up questions. The ASRS v1.1 checklist itself is validated for adults (18+) — see the note if you're younger.", vi: "Điều này giúp điều chỉnh cách diễn đạt của các câu hỏi tiếp theo. Bản thân bảng kiểm ASRS v1.1 được kiểm định cho người lớn (18 tuổi trở lên) — xem lưu ý nếu bạn nhỏ tuổi hơn." },
  ageTeenLabel: { en: "13–17", vi: "13–17" },
  ageTeenRange: { en: "Teen", vi: "Thiếu Niên" },
  ageTeenBlurb: { en: "⚠️ Not the validated age group for this instrument — results will be labeled exploratory only.", vi: "⚠️ Không phải nhóm tuổi được kiểm định cho công cụ này — kết quả sẽ chỉ được gắn nhãn mang tính khám phá." },
  ageYoungLabel: { en: "18–25", vi: "18–25" },
  ageYoungRange: { en: "Young Adult", vi: "Thanh Niên" },
  ageYoungBlurb: { en: "University, early career, or first steps into independent life.", vi: "Đại học, giai đoạn đầu sự nghiệp, hoặc những bước đầu tự lập." },
  ageAdultLabel: { en: "26+", vi: "26+" },
  ageAdultRange: { en: "Adult", vi: "Người Lớn" },
  ageAdultBlurb: { en: "Established career, family, or independent living.", vi: "Sự nghiệp ổn định, gia đình, hoặc cuộc sống tự lập." },

  disclaimerTitle: { en: "Before you start", vi: "Trước khi bắt đầu" },
  disclaimerBody1: {
    en: "The next section is the actual ASRS v1.1 checklist, reproduced with permission from the World Health Organization. Answer honestly based on the past 6 months — there are no right or wrong answers.",
    vi: "Phần tiếp theo là bảng kiểm ASRS v1.1 thực sự, được sao chép với sự cho phép của Tổ Chức Y Tế Thế Giới. Hãy trả lời trung thực dựa trên 6 tháng vừa qua — không có câu trả lời đúng hay sai.",
  },
  disclaimerBody2: {
    en: "A positive screen means your answers resemble a pattern common among adults later diagnosed with ADHD — it does not mean you have ADHD. A negative screen doesn't fully rule it out either. Either way, this tool cannot replace an evaluation by a doctor, psychiatrist, or psychologist.",
    vi: "Kết quả sàng lọc dương tính có nghĩa là câu trả lời của bạn giống với một mẫu hình phổ biến ở những người lớn sau đó được chẩn đoán ADHD — không có nghĩa là bạn chắc chắn mắc ADHD. Kết quả âm tính cũng không loại trừ hoàn toàn khả năng đó. Dù kết quả thế nào, công cụ này không thể thay thế một buổi đánh giá bởi bác sĩ, bác sĩ tâm thần, hoặc nhà tâm lý học.",
  },
  disclaimerAckLabel: { en: "I understand this is a screening tool, not a diagnosis.", vi: "Tôi hiểu đây là công cụ sàng lọc, không phải chẩn đoán." },
  continueBtn: { en: "Continue", vi: "Tiếp Tục" },
  back: { en: "Back", vi: "Quay Lại" },

  underageBanner: {
    en: "⚠️ You selected an age under 18. The ASRS v1.1 is validated for adults only — everything below is exploratory, not a validated screening result. Please see the guidance in your results for age-appropriate tools.",
    vi: "⚠️ Bạn đã chọn độ tuổi dưới 18. ASRS v1.1 chỉ được kiểm định cho người lớn — mọi thứ dưới đây chỉ mang tính khám phá, không phải kết quả sàng lọc đã được kiểm định. Vui lòng xem hướng dẫn trong kết quả của bạn để biết công cụ phù hợp với độ tuổi.",
  },

  sectionOf: { en: (i, n) => `Section ${i} of ${n}`, vi: (i, n) => `Phần ${i} / ${n}` },
  questionsCount: { en: (n) => `${n} questions`, vi: (n) => `${n} câu hỏi` },
  beginSection: { en: (label) => `Begin: ${label}`, vi: (label) => `Bắt Đầu: ${label}` },
  percentComplete: { en: (pct, label) => `${pct}% complete · ${label}`, vi: (pct, label) => `${pct}% hoàn thành · ${label}` },
  questionOf: { en: (i, n) => `Question ${i} of ${n}`, vi: (i, n) => `Câu hỏi ${i} / ${n}` },
  next: { en: "Next", vi: "Tiếp Theo" },
  asrsStemLabel: { en: "Over the past 6 months:", vi: "Trong 6 tháng vừa qua:" },
  partALabel: { en: "Part A", vi: "Phần A" },
  partBLabel: { en: "Part B", vi: "Phần B" },

  yourReport: { en: "Your ADHD Screening Report", vi: "Báo Cáo Sàng Lọc ADHD Của Bạn" },
  screenerNotDx: { en: "Screener ≠ Diagnosis", vi: "Sàng Lọc ≠ Chẩn Đoán" },
  hPartA: { en: "📋 Part A Screening Result (the validated part)", vi: "📋 Kết Quả Sàng Lọc Phần A (phần đã được kiểm định)" },
  hitsOf6: { en: (n) => `${n} of 6 flagged responses`, vi: (n) => `${n} trên 6 câu trả lời được đánh dấu` },
  hNoLevel: { en: "🚫 Why there's no \"ADHD level\" here", vi: "🚫 Vì sao không có \"mức độ ADHD\" ở đây" },
  hPattern: { en: "🧭 Descriptive Symptom Pattern (Part A + B, informational only)", vi: "🧭 Mẫu Hình Triệu Chứng Mô Tả (Phần A + B, chỉ mang tính thông tin)" },
  inattentionLabel: { en: "Inattention", vi: "Mất Chú Ý" },
  hyperactivityLabel: { en: "Hyperactivity-Impulsivity", vi: "Tăng Động-Bốc Đồng" },
  outOf9: { en: (n) => `${n} / 9`, vi: (n) => `${n} / 9` },
  hContext: { en: "🗺️ Where It Shows Up (school, work, home & other factors)", vi: "🗺️ Nơi Nó Biểu Hiện (trường học, công việc, gia đình & các yếu tố khác)" },
  contextIntroText: { en: "These are NOT part of the ASRS score. They're plain self-reported impact ratings, meant to give whoever evaluates you a fuller picture of where this affects your life.", vi: "Những điều này KHÔNG phải là một phần của điểm số ASRS. Đây là các đánh giá mức độ ảnh hưởng tự báo cáo đơn giản, nhằm giúp người đánh giá bạn có bức tranh đầy đủ hơn về việc nó ảnh hưởng đến cuộc sống của bạn ở đâu.",
  },
  domainNotable: { en: "Notable impact", vi: "Ảnh hưởng đáng chú ý" },
  domainQuiet: { en: "Little to no impact reported", vi: "Ít hoặc không có ảnh hưởng được báo cáo" },
  hHistory: { en: "🕰️ Childhood History", vi: "🕰️ Lịch Sử Thời Thơ Ấu" },
  hNextSteps: { en: "📋 Suggested Next Steps", vi: "📋 Các Bước Tiếp Theo Được Đề Xuất" },
  nsBring: { en: "Bring (or export) this report to a doctor, psychiatrist, or psychologist — the marked answers and domain impact ratings give them a head start.", vi: "Mang (hoặc xuất) báo cáo này đến gặp bác sĩ, bác sĩ tâm thần, hoặc nhà tâm lý học — các câu trả lời đã đánh dấu và mức độ ảnh hưởng theo từng lĩnh vực sẽ giúp họ có điểm khởi đầu." },
  nsExamples: { en: "Write down 2-3 concrete recent examples for your highest-impact domain — specific moments are more useful to a clinician than a general feeling.", vi: "Ghi lại 2-3 ví dụ cụ thể gần đây cho lĩnh vực có ảnh hưởng cao nhất của bạn — những khoảnh khắc cụ thể hữu ích hơn cho chuyên gia so với một cảm giác chung chung." },
  nsOther: { en: "If you flagged anxiety, low mood, sleep problems, substance use, or a medical condition, mention those too — a good evaluation rules these in or out rather than assuming ADHD explains everything.", vi: "Nếu bạn đã đánh dấu lo âu, tâm trạng thấp, vấn đề giấc ngủ, sử dụng chất kích thích, hoặc một tình trạng y tế, hãy đề cập cả những điều đó — một buổi đánh giá tốt sẽ xác nhận hoặc loại trừ các yếu tố này thay vì mặc định rằng ADHD giải thích cho tất cả." },
  nsUnderage: { en: "Since you're under 18, start with a pediatrician, school counselor/psychologist, or a child & adolescent psychiatrist — they'll likely also want input from a parent and teacher using age-appropriate tools.", vi: "Vì bạn dưới 18 tuổi, hãy bắt đầu với bác sĩ nhi khoa, chuyên viên tư vấn/tâm lý học đường, hoặc bác sĩ tâm thần trẻ em & vị thành niên — họ có thể sẽ muốn thêm thông tin từ phụ huynh và giáo viên bằng các công cụ phù hợp với độ tuổi." },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Screener", vi: "🔁 Làm Lại Bài Sàng Lọc" },
  retakeNote: { en: "Your results are saved automatically in this browser only — nothing is sent anywhere. Retaking clears your saved answers. If the PDF ever looks off, the PNG is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn chỉ được tự động lưu trong trình duyệt này — không có gì được gửi đi đâu cả. Làm lại sẽ xóa các câu trả lời đã lưu. Nếu PDF có vấn đề hiển thị, PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new screening. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một bài sàng lọc hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
  whoCitation: { en: "ASRS v1.1 items © World Health Organization 2003. Based on the Composite International Diagnostic Interview © 2001 WHO. Used with permission. Reference: Kessler et al., Psychol Med. 2005;35(2):245-256.", vi: "Các mục của ASRS v1.1 © Tổ Chức Y Tế Thế Giới 2003. Dựa trên Phỏng Vấn Chẩn Đoán Quốc Tế Tổng Hợp © 2001 WHO. Được sử dụng với sự cho phép. Tài liệu tham khảo: Kessler et al., Psychol Med. 2005;35(2):245-256." },
};

/* ---------------------------------------------------------------------
   Sections: ASRS (validated, whole) + context domains (unvalidated,
   descriptive) + history (single item). Built once ageGroup is known so
   context item wording can adapt.
--------------------------------------------------------------------- */
function buildSections(ageGroup) {
  const asrsSection = {
    key: "asrs",
    kind: "asrs",
    label: { en: "ASRS v1.1 Symptom Checklist", vi: "Bảng Kiểm ASRS v1.1" },
    icon: "📋",
    intro: ASRS_STEM,
    questions: ASRS_QUESTIONS,
  };
  const contextSections = CONTEXT_DOMAINS.map((domain) => ({
    key: domain.key,
    kind: "context",
    label: domain.label,
    icon: domain.icon,
    intro: domain.intro,
    questions: domain.items.map((item) => ({ ...item, text: ageVariantText(item, ageGroup) })),
  }));
  const historySection = {
    key: "history",
    kind: "context",
    label: { en: "Childhood History", vi: "Lịch Sử Thời Thơ Ấu" },
    icon: "🕰️",
    intro: { en: "Last one — a question about your history, since ADHD is defined as a developmental (childhood-onset) condition.", vi: "Câu cuối cùng — một câu hỏi về lịch sử của bạn, vì ADHD được định nghĩa là một tình trạng phát triển (khởi phát từ thời thơ ấu)." },
    questions: [CONTEXT_HISTORY_ITEM],
  };
  return [asrsSection, ...contextSections, historySection];
}

const DEFAULT_STATE = () => ({
  ageGroup: null, // "teen" | "youngAdult" | "adult"
  screen: "welcome", // welcome | ageSelect | disclaimer | section-intro | question | results
  disclaimerAck: false,
  sectionIndex: 0,
  questionIndex: 0,
  answers: { asrs: {}, context: {} },
  completedAt: null,
});

let state = DEFAULT_STATE();
const appEl = document.getElementById("app");

function currentSections() {
  return buildSections(state.ageGroup || "adult");
}

// ---------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}
function clearState() { localStorage.removeItem(STORAGE_KEY); }
function answeredCountOf(saved) {
  const a = saved.answers || {};
  return Object.keys(a.asrs || {}).length + Object.keys(a.context || {}).length;
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
  document.getElementById("resumeBtn").onclick = () => { state = saved; render(); };
  document.getElementById("restartBtn").onclick = () => { clearState(); state = DEFAULT_STATE(); render(); };
}

// ---------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------
function render() {
  saveState();
  window.scrollTo(0, 0);
  if (state.screen === "welcome") return renderWelcome();
  if (state.screen === "ageSelect") return renderAgeSelect();
  if (state.screen === "disclaimer") return renderDisclaimer();
  if (state.screen === "section-intro") return renderSectionIntro();
  if (state.screen === "question") return renderQuestion();
  if (state.screen === "results") return renderResults();
}

function renderWelcome() {
  appEl.innerHTML = `
    <div class="card center-card">
      <div class="badge">${L(UI.badge)}</div>
      <h1>${L(UI.title)}</h1>
      <p class="muted small" style="margin-top:-8px">${L(UI.subtitle)}</p>
      <p>${L(UI.intro)}</p>
      <div class="disclaimer-box">${L(UI.bigDisclaimer)}</div>
      <ul class="feature-list">
        <li>${L(UI.feat1)}</li>
        <li>${L(UI.feat2)}</li>
        <li>${L(UI.feat3)}</li>
        <li>${L(UI.feat4)}</li>
      </ul>
      <button class="btn btn-primary btn-lg" id="startBtn">${L(UI.getStarted)}</button>
    </div>`;
  document.getElementById("startBtn").onclick = () => { state.screen = "ageSelect"; render(); };
}

function renderAgeSelect() {
  const AGES = [
    { key: "teen", label: UI.ageTeenLabel, range: UI.ageTeenRange, blurb: UI.ageTeenBlurb },
    { key: "youngAdult", label: UI.ageYoungLabel, range: UI.ageYoungRange, blurb: UI.ageYoungBlurb },
    { key: "adult", label: UI.ageAdultLabel, range: UI.ageAdultRange, blurb: UI.ageAdultBlurb },
  ];
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.ageQuestion)}</h1>
      <p>${L(UI.ageSub)}</p>
      <div class="age-grid">
        ${AGES.map((a) => `
          <button class="age-card" data-key="${a.key}">
            <span class="age-label">${L(a.range)}</span>
            <span class="age-range">${L(a.label)}</span>
            <span class="age-blurb">${L(a.blurb)}</span>
          </button>`).join("")}
      </div>
    </div>`;
  document.querySelectorAll(".age-card").forEach((btn) => {
    btn.onclick = () => { state.ageGroup = btn.dataset.key; state.screen = "disclaimer"; render(); };
  });
}

function renderDisclaimer() {
  appEl.innerHTML = `
    <div class="card center-card">
      <h1>${L(UI.disclaimerTitle)}</h1>
      ${state.ageGroup === "teen" ? `<div class="disclaimer-box">${L(UI.underageBanner)}</div>` : ""}
      <p>${L(UI.disclaimerBody1)}</p>
      <p>${L(UI.disclaimerBody2)}</p>
      <label class="ack-row">
        <input type="checkbox" id="ackBox" ${state.disclaimerAck ? "checked" : ""} />
        <span>${L(UI.disclaimerAckLabel)}</span>
      </label>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backBtn">${L(UI.back)}</button>
        <button class="btn btn-primary" id="continueBtn" ${state.disclaimerAck ? "" : "disabled"}>${L(UI.continueBtn)}</button>
      </div>
    </div>`;
  document.getElementById("ackBox").onchange = (e) => {
    state.disclaimerAck = e.target.checked;
    document.getElementById("continueBtn").disabled = !state.disclaimerAck;
    saveState();
  };
  document.getElementById("backBtn").onclick = () => { state.screen = "ageSelect"; render(); };
  document.getElementById("continueBtn").onclick = () => {
    if (!state.disclaimerAck) return;
    state.screen = "section-intro";
    state.sectionIndex = 0;
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
      <h1>${section.icon} ${label}</h1>
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
  const sections = currentSections();
  const total = sections.reduce((sum, s) => sum + s.questions.length, 0);
  let before = 0;
  for (let i = 0; i < state.sectionIndex; i++) before += sections[i].questions.length;
  return Math.round(((before + state.questionIndex) / total) * 100);
}

function answerBucket(section) {
  return section.kind === "asrs" ? state.answers.asrs : state.answers.context;
}

function optionsFor(section, q) {
  if (section.kind === "asrs") {
    return L(ASRS_SCALE_LABELS).map((text, i) => ({ value: i, text }));
  }
  if (q.type === "ynu") {
    // CONTEXT_YNU_LABELS order is [No, Unsure, Yes] -> map to string values
    return [
      { value: "no", text: L(CONTEXT_YNU_LABELS)[0] },
      { value: "unsure", text: L(CONTEXT_YNU_LABELS)[1] },
      { value: "yes", text: L(CONTEXT_YNU_LABELS)[2] },
    ];
  }
  return L(CONTEXT_IMPACT_LABELS).map((text, i) => ({ value: i, text }));
}

function renderQuestion() {
  const sections = currentSections();
  const section = sections[state.sectionIndex];
  const q = section.questions[state.questionIndex];
  const bucket = answerBucket(section);
  const currentAnswer = bucket[q.id];
  const pct = overallProgress();
  const label = L(section.label);
  const options = optionsFor(section, q);
  const partTag = section.kind === "asrs" ? (q.part === "A" ? L(UI.partALabel) : L(UI.partBLabel)) : "";

  appEl.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${L(UI.percentComplete)(pct, label)}</div>
    </div>
    <div class="card question-card">
      <div class="q-count">${section.icon} ${label} ${partTag ? `· ${partTag}` : ""} — ${L(UI.questionOf)(state.questionIndex + 1, section.questions.length)}</div>
      ${section.kind === "asrs" ? `<p class="muted small">${L(UI.asrsStemLabel)}</p>` : ""}
      <h2 class="q-text">${L(q.text)}</h2>
      ${q.note ? `<p class="muted small">${L(q.note)}</p>` : ""}
      <div class="likert" id="likertRow">
        ${options.map((opt) => `
          <button class="likert-btn ${currentAnswer === opt.value ? "selected" : ""}" data-val="${opt.value}">
            <span class="likert-dot"></span>
            <span class="likert-text">${opt.text}</span>
          </button>`).join("")}
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" id="backBtn" ${state.sectionIndex === 0 && state.questionIndex === 0 ? "disabled" : ""}>${L(UI.back)}</button>
        <button class="btn btn-primary" id="nextBtn" ${currentAnswer !== undefined ? "" : "disabled"}>${L(UI.next)}</button>
      </div>
    </div>`;

  document.querySelectorAll(".likert-btn").forEach((btn) => {
    btn.onclick = () => {
      const raw = btn.dataset.val;
      const val = /^\d+$/.test(raw) ? Number(raw) : raw;
      bucket[q.id] = val;
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
function bandLabel(avg) {
  if (avg === null) return "";
  const labels = L(CONTEXT_IMPACT_LABELS);
  const idx = Math.min(3, Math.max(0, Math.round(avg)));
  return labels[idx];
}

function renderResults() {
  const asrs = scoreASRS(state.answers.asrs);
  const context = scoreContext(state.answers.context, state.ageGroup);
  const report = buildADHDReport(asrs, context, state.ageGroup);

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      ${report.underage ? `<div class="card center-card"><div class="disclaimer-box">${L(UI.underageBanner)}</div></div>` : ""}

      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)}</div>
        <h1>${report.headline}</h1>
        <p><span class="level-pill ${asrs.screenProfile.pill}">${L(asrs.screenProfile.name)}</span></p>
        <div class="disclaimer-box">${L(UI.bigDisclaimer)}</div>
      </div>

      <div class="card">
        <h2>${L(UI.hPartA)}</h2>
        <p><strong>${L(UI.hitsOf6)(asrs.partAHits)}</strong> — ${asrs.partAHits >= 4 ? L(UI.screenerNotDx) : ""}</p>
        <p>${L(asrs.screenProfile.summary)}</p>
        <p class="muted">${L(asrs.screenProfile.guidance)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hNoLevel)}</h2>
        <p>${L(_RT.noSeverityLevel)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hPattern)}</h2>
        <p class="muted">${L(asrs.presentationProfile.text)}</p>
        <div class="bar-row single">
          <div class="bar-labels"><span>${L(UI.inattentionLabel)}</span></div>
          <div class="bar-track"><div class="bar-fill asrs" style="width:${(asrs.inCount / 9) * 100}%"></div></div>
          <div class="bar-values"><span>${L(UI.outOf9)(asrs.inCount)}</span></div>
        </div>
        <div class="bar-row single">
          <div class="bar-labels"><span>${L(UI.hyperactivityLabel)}</span></div>
          <div class="bar-track"><div class="bar-fill asrs2" style="width:${(asrs.hiCount / 9) * 100}%"></div></div>
          <div class="bar-values"><span>${L(UI.outOf9)(asrs.hiCount)}</span></div>
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.hContext)}</h2>
        <p class="muted">${L(UI.contextIntroText)}</p>
        <div class="theme-cards">
          ${context.domains.map((d) => `
            <div class="theme-card">
              <h4>${d.icon} ${L(d.label)}</h4>
              <p>${d.avg === null ? "" : `<strong>${bandLabel(d.avg)}</strong> — ${d.notable ? L(UI.domainNotable) : L(UI.domainQuiet)}`}</p>
              ${d.flags && d.flags.length ? d.flags.map((f) => `<p class="muted small">${L(CONTEXT_DOMAINS.find(cd=>cd.key===d.key).items.find(i=>i.id===f.id).text)}: <strong>${L(CONTEXT_YNU_LABELS)[["no","unsure","yes"].indexOf(f.value)] || ""}</strong></p>`).join("") : ""}
            </div>`).join("")}
        </div>
      </div>

      <div class="card">
        <h2>${L(UI.hHistory)}</h2>
        <p>${report.historyNote}</p>
      </div>

      <div class="card">
        <h2>${L(UI.hNextSteps)}</h2>
        <ol class="action-list">
          <li>${L(UI.nsBring)}</li>
          <li>${L(UI.nsExamples)}</li>
          <li>${L(UI.nsOther)}</li>
          ${report.underage ? `<li>${L(UI.nsUnderage)}</li>` : ""}
        </ol>
        <div class="support-note">
          <strong>${L(_RT.neverADiagnosis)}</strong>
        </div>
      </div>

      <p class="muted small citation">${L(UI.whoCitation)}</p>
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
// PDF / PNG export (jsPDF + html2canvas) — same hard-won rules as the
// rest of the project (design doc §7): no foreignObjectRendering, force
// cards out of their fadeIn animation in onclone, literal hex gradients
// only inside #results-report.
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
    downloadCanvas(canvas, "adhd-screener-report.png");
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

    pdf.save("adhd-screener-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
