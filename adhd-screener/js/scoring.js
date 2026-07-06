/* =========================================================================
   SCORING ENGINE — pure functions, no DOM/state dependencies.
   -------------------------------------------------------------------------
   Unlike the other assessments in this project, the ASRS v1.1 is a
   validated instrument and MUST be scored exactly as published — no
   Quick/Full split, no re-weighting, no folding in the context module.
   (Same rule already documented for PHQ-9 in wellbeing-checkin.)
========================================================================= */

/* answers: { [itemId]: 0|1|2|3|4 } where the index matches
   ASRS_SCALE_LABELS (0=Never … 4=Very Often). Missing answers are NOT
   defaulted to neutral like the other apps' Likert scales — an ASRS item
   left blank should block progression in the UI, never silently score. */
function _hitAsrsItem(question, rawValue) {
  if (typeof rawValue !== "number") return 0;
  return question.threshold === "sometimes" ? (rawValue >= 2 ? 1 : 0) : (rawValue >= 3 ? 1 : 0);
}

function scoreASRS(answers) {
  const perItem = ASRS_QUESTIONS.map((q) => ({
    id: q.id,
    part: q.part,
    domain: q.domain,
    hit: _hitAsrsItem(q, answers[q.id]),
  }));

  const partAHits = perItem.filter((r) => r.part === "A" && r.hit).length;
  const partAScreen = partAHits >= 4 ? "positive" : "negative";

  const totalHits = perItem.reduce((sum, r) => sum + r.hit, 0);
  const inCount = perItem.filter((r) => r.domain === "IN" && r.hit).length; // out of 9
  const hiCount = perItem.filter((r) => r.domain === "HI" && r.hit).length; // out of 9

  const presentation = asrsPresentationLabel(inCount, hiCount);

  return {
    partAHits,           // 0-6
    partAScreen,         // "positive" | "negative"
    screenProfile: ASRS_SCREEN_RESULT[partAScreen],
    totalHits,           // 0-18, descriptive only — no validated cutoff at this level
    inCount,             // 0-9
    hiCount,             // 0-9
    presentation,        // "combined" | "inattentive" | "hyperactive" | "belowPattern"
    presentationProfile: ASRS_PRESENTATION_COPY[presentation],
    perItem,
  };
}

/* ---------------------------------------------------------------------
   Context module — descriptive only. Returns per-domain average impact
   (0-3) and a plain "notable" flag (avg >= 1.5) used purely to decide
   which domains get surfaced first in the report; never a diagnostic
   threshold and never combined with the ASRS score.
--------------------------------------------------------------------- */
function scoreContext(contextAnswers, ageGroup) {
  const domains = CONTEXT_DOMAINS.map((domain) => {
    const impactItems = domain.items.filter((i) => i.type === "impact");
    const values = impactItems.map((i) => contextAnswers[i.id]).filter((v) => typeof v === "number");
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
    const flags = domain.items
      .filter((i) => i.type === "ynu")
      .map((i) => ({ id: i.id, value: contextAnswers[i.id] }));
    return {
      key: domain.key,
      label: domain.label,
      icon: domain.icon,
      avg,
      notable: avg !== null && avg >= 1.5,
      flags,
    };
  });

  const historyValue = contextAnswers[CONTEXT_HISTORY_ITEM.id];

  return { ageGroup, domains, historyValue };
}

/* ---------------------------------------------------------------------
   Combined report copy. Deliberately does NOT synthesize a single
   "ADHD level" — see data-asrs.js header for why that would misrepresent
   the instrument. Instead it explains, in plain language, what the
   screen does and doesn't tell you, and surfaces context findings
   side-by-side without merging them into the score.
--------------------------------------------------------------------- */
const _RT = {
  under18Caveat: {
    en: "Heads up: the ASRS v1.1 was developed and validated for adults (18+). You told us you're under 18, so treat everything below as informal and exploratory only — not even a screening result in the validated sense. If attention or behavior concerns are affecting school or home life, a pediatrician, school psychologist, or child & adolescent psychiatrist can use tools actually validated for your age (e.g. Vanderbilt, SNAP-IV, Conners scales, usually completed by a parent and teacher too).",
    vi: "Lưu ý: ASRS v1.1 được xây dựng và kiểm định cho người lớn (18 tuổi trở lên). Bạn cho biết mình dưới 18 tuổi, vì vậy hãy xem mọi kết quả dưới đây chỉ mang tính không chính thức và mang tính khám phá — thậm chí không phải là một kết quả sàng lọc theo nghĩa đã được kiểm định. Nếu các vấn đề về sự chú ý hoặc hành vi đang ảnh hưởng đến việc học hoặc cuộc sống gia đình, bác sĩ nhi khoa, nhà tâm lý học đường, hoặc bác sĩ tâm thần trẻ em & vị thành niên có thể sử dụng các công cụ thực sự được kiểm định cho độ tuổi của bạn (ví dụ: thang đo Vanderbilt, SNAP-IV, Conners, thường được phụ huynh và giáo viên điền thêm).",
  },
  neverADiagnosis: {
    en: "No score on this page is a diagnosis. ADHD is diagnosed by a qualified clinician through a full evaluation — clinical interview, symptom history since childhood, impairment across settings, and ruling out other explanations (sleep, anxiety, depression, thyroid problems, and more can all look similar). This tool can only tell you whether your answers resemble a pattern worth having evaluated.",
    vi: "Không có điểm số nào trên trang này là một chẩn đoán. ADHD được chẩn đoán bởi một chuyên gia có trình độ thông qua một buổi đánh giá toàn diện — phỏng vấn lâm sàng, lịch sử triệu chứng từ thời thơ ấu, mức độ ảnh hưởng ở nhiều môi trường khác nhau, và loại trừ các nguyên nhân khác (giấc ngủ, lo âu, trầm cảm, vấn đề tuyến giáp, và nhiều yếu tố khác đều có thể trông tương tự). Công cụ này chỉ có thể cho bạn biết liệu câu trả lời của bạn có giống với một mẫu hình đáng để được đánh giá hay không.",
  },
  noSeverityLevel: {
    en: "You may have expected a \"mild / moderate / severe\" ADHD level here. The ASRS v1.1 deliberately doesn't produce one — Part A only tells you positive or negative screen, and Part B adds descriptive detail with no validated cutoff of its own. Severity is a clinical judgment made during a full evaluation, not something a checklist can assign.",
    vi: "Có thể bạn đã mong đợi một mức \"nhẹ / vừa / nặng\" của ADHD ở đây. ASRS v1.1 cố tình không tạo ra điều đó — Phần A chỉ cho bạn biết sàng lọc dương tính hay âm tính, và Phần B bổ sung chi tiết mô tả mà không có ngưỡng kiểm định riêng. Mức độ nghiêm trọng là một đánh giá lâm sàng được đưa ra trong một buổi đánh giá toàn diện, không phải điều một bảng câu hỏi có thể quyết định.",
  },
  historyPositive: {
    en: "You indicated that similar patterns were noticeable in childhood — this matters, because current diagnostic criteria require some symptoms to have been present before age 12 (even if never formally recognized at the time). Mention this clearly to whoever evaluates you.",
    vi: "Bạn cho biết những mẫu hình tương tự đã thấy rõ từ thời thơ ấu — điều này quan trọng, vì tiêu chuẩn chẩn đoán hiện tại yêu cầu một số triệu chứng đã xuất hiện trước 12 tuổi (kể cả khi chưa từng được nhận ra chính thức lúc đó). Hãy nói rõ điều này với người đánh giá bạn.",
  },
  historyNegative: {
    en: "You indicated these patterns weren't noticeable in childhood. That's worth mentioning too — a clinician will want to understand whether what you're noticing now is truly lifelong or newer (which can point toward other explanations, like a mood, anxiety, sleep, or medical change).",
    vi: "Bạn cho biết những mẫu hình này không thấy rõ từ thời thơ ấu. Điều này cũng đáng được đề cập — một chuyên gia sẽ muốn hiểu liệu điều bạn đang nhận thấy hiện tại có thực sự kéo dài từ lâu hay mới xuất hiện gần đây (điều này có thể gợi ý các nguyên nhân khác, như thay đổi về tâm trạng, lo âu, giấc ngủ, hoặc sức khỏe).",
  },
  historyUnsure: {
    en: "You weren't sure whether these patterns showed up in childhood — that's completely normal; a clinician can help piece this together using your history and, if possible, input from parents or old school records.",
    vi: "Bạn không chắc liệu những mẫu hình này có xuất hiện từ thời thơ ấu hay không — điều đó hoàn toàn bình thường; một chuyên gia có thể giúp bạn ghép nối lại thông tin này bằng lịch sử của bạn và, nếu có thể, thông tin từ phụ huynh hoặc hồ sơ học tập cũ.",
  },
};

function buildADHDReport(asrs, context, ageGroup) {
  const notableDomains = context.domains.filter((d) => d.notable);
  const quietDomains = context.domains.filter((d) => !d.notable && d.avg !== null);

  const headline =
    asrs.partAScreen === "positive"
      ? { en: "Your Part A answers cross the screening threshold — a fuller evaluation is a reasonable next step.", vi: "Câu trả lời Phần A của bạn vượt ngưỡng sàng lọc — một buổi đánh giá toàn diện hơn là bước tiếp theo hợp lý." }
      : { en: "Your Part A answers are below the screening threshold this time.", vi: "Câu trả lời Phần A của bạn hiện dưới ngưỡng sàng lọc." };

  return {
    headline: L(headline),
    underage: ageGroup === "teen",
    notableDomains,
    quietDomains,
    historyNote:
      context.historyValue === "yes" ? L(_RT.historyPositive) :
      context.historyValue === "no" ? L(_RT.historyNegative) :
      L(_RT.historyUnsure),
  };
}
