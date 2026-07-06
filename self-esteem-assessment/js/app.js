/* =========================================================================
   MAIN APP CONTROLLER — Self-Esteem Check-In (Rosenberg Self-Esteem Scale)
   Same architecture as the other assessments in this project (see
   ASSESSMENT-APP-DESIGN.md §9): screen state machine, autosave to
   localStorage with resume, scoring on the results screen, html2canvas /
   jsPDF export with the onclone fade-fix. Simpler than the multi-scale
   apps since RSES is a single 10-item scale — no age/context/version
   selection needed, just welcome → question loop → results.
========================================================================= */

const STORAGE_KEY = "selfEsteemAssessment.v1";

const UI = {
  scaleAgree4: {
    en: ["Strongly Disagree", "Disagree", "Agree", "Strongly Agree"],
    vi: ["Rất Không Đồng Ý", "Không Đồng Ý", "Đồng Ý", "Rất Đồng Ý"],
  },
  welcomeBack: { en: "Welcome back 🌻", vi: "Chào mừng trở lại 🌻" },
  savedSession: { en: (n) => `We found a saved session with ${n} of 10 answers already recorded.`, vi: (n) => `Chúng tôi tìm thấy một phiên đã lưu với ${n}/10 câu trả lời được ghi lại.` },
  resume: { en: "Resume where I left off", vi: "Tiếp tục từ chỗ đã dừng" },
  startOver: { en: "Start over", vi: "Bắt đầu lại" },
  badge: { en: "Rosenberg Self-Esteem Scale (RSES) · Public Domain", vi: "Thang Đo Lòng Tự Trọng Rosenberg (RSES) · Công Cụ Công Khai" },
  title: { en: "Self-Esteem Check-In", vi: "Kiểm Tra Lòng Tự Trọng" },
  intro: { en: "A quick, well-established 10-item check on how you currently feel about your own worth — developed by sociologist Morris Rosenberg (1965) and used in psychological research for decades.", vi: "Một bài kiểm tra ngắn gồm 10 câu hỏi đã được kiểm chứng, đánh giá cảm nhận hiện tại của bạn về giá trị bản thân — được phát triển bởi nhà xã hội học Morris Rosenberg (1965) và được sử dụng trong nghiên cứu tâm lý học suốt nhiều thập kỷ." },
  feat1: { en: "⏱️ Just 10 questions — about 2 minutes", vi: "⏱️ Chỉ 10 câu hỏi — khoảng 2 phút" },
  feat2: { en: "💾 Auto-saves your progress — leave anytime, resume later", vi: "💾 Tự động lưu tiến trình — rời đi bất cứ lúc nào, tiếp tục sau" },
  feat3: { en: "📄 Download your report as a PDF or PNG", vi: "📄 Tải báo cáo dưới dạng PDF hoặc PNG" },
  feat4: { en: "🔁 Retake anytime — useful to track how things shift over time", vi: "🔁 Làm lại bất cứ lúc nào — hữu ích để theo dõi thay đổi theo thời gian" },
  disclaimer: { en: "This is a self-reflection tool based on a well-known research instrument. It is not a diagnostic or clinical measure of self-worth.", vi: "Đây là công cụ tự chiêm nghiệm dựa trên một công cụ nghiên cứu nổi tiếng. Đây không phải là thước đo chẩn đoán hay lâm sàng về giá trị bản thân." },
  getStarted: { en: "Get Started", vi: "Bắt Đầu" },
  back: { en: "Back", vi: "Quay Lại" },
  questionOf: { en: (i, n) => `Question ${i} of ${n}`, vi: (i, n) => `Câu hỏi ${i} / ${n}` },
  percentComplete: { en: (pct) => `${pct}% complete`, vi: (pct) => `${pct}% hoàn thành` },
  next: { en: "Next", vi: "Tiếp Theo" },
  instructions: { en: "Rate how much you agree with each statement, based on how you generally feel about yourself.", vi: "Đánh giá mức độ đồng ý của bạn với mỗi câu, dựa trên cảm nhận chung của bạn về bản thân." },
  yourReport: { en: "Your Self-Esteem Report", vi: "Báo Cáo Lòng Tự Trọng Của Bạn" },
  scoreLabel: { en: (raw, max) => `${raw} / ${max}`, vi: (raw, max) => `${raw} / ${max}` },
  gaugeLow: { en: "0 · Lower", vi: "0 · Thấp" },
  gaugeMod: { en: "15–25 · Typical", vi: "15–25 · Bình Thường" },
  gaugeHigh: { en: "30 · High", vi: "30 · Cao" },
  whatItMeansH: { en: "What This Means", vi: "Điều Này Có Nghĩa Là Gì" },
  tipsH: { en: "📋 A Few Things Worth Trying", vi: "📋 Vài Điều Đáng Thử" },
  itemBreakdownH: { en: "Your Answers", vi: "Câu Trả Lời Của Bạn" },
  supportNote: { en: "A note on getting help: this is a brief self-report snapshot, not a diagnosis. If low self-worth is persistent, distressing, or tangled up with low mood, talking to a therapist or counselor is a genuinely effective next step.", vi: "Một lưu ý về việc tìm kiếm sự giúp đỡ: đây chỉ là một bức tranh tự đánh giá ngắn gọn, không phải là chẩn đoán. Nếu cảm giác thiếu giá trị bản thân kéo dài, gây khó chịu, hoặc đi kèm tâm trạng suy giảm, việc trò chuyện với chuyên gia trị liệu hoặc tư vấn tâm lý là một bước đi thực sự hiệu quả." },
  downloadPdf: { en: "⬇ Download PDF", vi: "⬇ Tải PDF" },
  downloadPng: { en: "🖼️ Download PNG", vi: "🖼️ Tải PNG" },
  retake: { en: "🔁 Retake Check-In", vi: "🔁 Làm Lại Bài Kiểm Tra" },
  retakeNote: { en: "Your results are saved automatically in this browser. Retaking clears your saved answers and starts fresh — useful for tracking how your self-esteem shifts over weeks or months. If the PDF ever looks off, the PNG is a simpler, more reliable download of the same report.", vi: "Kết quả của bạn được tự động lưu trong trình duyệt này. Làm lại sẽ xóa các câu trả lời đã lưu và bắt đầu lại từ đầu — hữu ích để theo dõi lòng tự trọng của bạn thay đổi ra sao qua nhiều tuần hoặc tháng. Nếu PDF có vấn đề hiển thị, PNG là bản tải đơn giản và đáng tin cậy hơn của cùng báo cáo." },
  retakeConfirm: { en: "This will clear your saved answers and start a brand new check-in. Continue?", vi: "Thao tác này sẽ xóa các câu trả lời đã lưu và bắt đầu một bài kiểm tra hoàn toàn mới. Tiếp tục?" },
  generatingImage: { en: "Generating image…", vi: "Đang tạo hình ảnh…" },
  generatingPdf: { en: "Generating PDF…", vi: "Đang tạo PDF…" },
  imageError: { en: "Something went wrong generating the image. Please try again, or use your browser's screenshot tool.", vi: "Đã xảy ra lỗi khi tạo hình ảnh. Vui lòng thử lại, hoặc dùng công cụ chụp màn hình của trình duyệt." },
  pdfError: { en: "Something went wrong generating the PDF. You can also use your browser's Print > Save as PDF option.", vi: "Đã xảy ra lỗi khi tạo PDF. Bạn cũng có thể dùng tùy chọn In > Lưu dưới dạng PDF của trình duyệt." },
};

const DEFAULT_STATE = () => ({
  screen: "welcome", // welcome | question | results
  questionIndex: 0,
  answers: {},
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
  return Object.keys(saved.answers || {}).length;
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
    state.screen = "question";
    state.questionIndex = 0;
    render();
  };
}

function overallProgress() {
  return Math.round((state.questionIndex / RSES_QUESTIONS.length) * 100);
}

function renderQuestion() {
  const q = RSES_QUESTIONS[state.questionIndex];
  const currentAnswer = state.answers[q.id];
  const pct = overallProgress();
  const scaleLabels = L(UI.scaleAgree4);

  appEl.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-label">${L(UI.percentComplete)(pct)}</div>
    </div>
    <div class="card question-card">
      <div class="q-count">${L(UI.questionOf)(state.questionIndex + 1, RSES_QUESTIONS.length)}</div>
      <h2 class="q-text">${L(q.text)}</h2>
      ${state.questionIndex === 0 ? `<p class="muted small">${L(UI.instructions)}</p>` : ""}
      <div class="likert likert-4" id="likertRow">
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
        <button class="btn btn-ghost" id="backBtn" ${state.questionIndex === 0 ? "disabled" : ""}>${L(UI.back)}</button>
        <button class="btn btn-primary" id="nextBtn" ${currentAnswer ? "" : "disabled"}>${L(UI.next)}</button>
      </div>
    </div>`;

  document.querySelectorAll(".likert-btn").forEach((btn) => {
    btn.onclick = () => {
      const val = Number(btn.dataset.val);
      state.answers[q.id] = val;
      saveState();
      goNext();
    };
  });
  document.getElementById("backBtn").onclick = goBack;
  document.getElementById("nextBtn").onclick = goNext;
}

function goNext() {
  if (state.questionIndex < RSES_QUESTIONS.length - 1) {
    state.questionIndex += 1;
    render();
  } else {
    state.completedAt = new Date().toISOString();
    state.screen = "results";
    render();
  }
}

function goBack() {
  if (state.questionIndex > 0) {
    state.questionIndex -= 1;
    render();
  }
}

// ---------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------
function renderResults() {
  const result = scoreRSES(state.answers, RSES_QUESTIONS);
  const scaleLabels = L(UI.scaleAgree4);

  appEl.innerHTML = `
    <div id="results-report" class="results-wrap">
      <div class="card center-card no-print-margin">
        <div class="badge">${L(UI.yourReport)}</div>
        <h1>${L(result.profile.name)}</h1>
        <p><span class="level-pill ${result.level}">${L(result.profile.name)} · ${L(UI.scoreLabel)(result.raw, result.maxRaw)}</span></p>
        <p>${L(result.profile.summary)}</p>
      </div>

      <div class="card">
        <div class="gauge-track"><div class="gauge-fill ${result.level}" style="width:${Math.max(result.pct, 3)}%"></div></div>
        <div class="gauge-scale"><span>${L(UI.gaugeLow)}</span><span>${L(UI.gaugeMod)}</span><span>${L(UI.gaugeHigh)}</span></div>
        <h3>${L(UI.whatItMeansH)}</h3>
        <p class="muted">${L(result.profile.whatItMeans)}</p>
      </div>

      <div class="card">
        <h2>${L(UI.tipsH)}</h2>
        <ul>
          ${L(result.profile.tips).map((t) => `<li>${t}</li>`).join("")}
        </ul>
        <div class="support-note">
          <strong>${L(UI.supportNote)}</strong>
        </div>
      </div>

      <div class="card">
        <h3>${L(UI.itemBreakdownH)}</h3>
        ${RSES_QUESTIONS.map((q, i) => {
          const ans = state.answers[q.id];
          const label = ans ? scaleLabels[ans - 1] : "—";
          return `
          <div class="bar-row single">
            <div class="bar-labels"><span>${i + 1}. ${L(q.text)}</span></div>
            <div class="bar-values"><span>${label}</span></div>
          </div>`;
        }).join("")}
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
// Same two hard-won rules carried over from the other apps in this
// project (design doc §7): no `foreignObjectRendering` (silently blanks
// the canvas in some browsers), and `onclone` must force every .card to
// its fully-visible state since html2canvas's clone restarts the fadeIn
// animation mid-fade. Every gradient inside #results-report uses literal
// hex values, never var(--...).
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
    downloadCanvas(canvas, "self-esteem-report.png");
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

    pdf.save("self-esteem-report.pdf");
  } catch (err) {
    console.error(err);
    alert(L(UI.pdfError));
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);
