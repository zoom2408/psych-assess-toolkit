/* =========================================================================
   SCORING ENGINE — pure functions, no DOM/state dependencies.
   Every scorer accepts an explicit `questions` list so the Quick and Full
   versions share one engine. IMPORTANT (see design doc §4): always pass
   the ACTUAL question array the user answered — passing the full bank
   when only Quick items were answered silently dilutes scores toward
   neutral. Unanswered items default to neutral (3). All scale scores are
   min-max normalized to 0–100 based on the item count actually used.
========================================================================= */

function _answerOrNeutral(answers, id) {
  const v = answers[id];
  return typeof v === "number" && v >= 1 && v <= 5 ? v : 3;
}

/* Generic helper: normalize a raw Likert sum over n items to 0–100. */
function _normalize(sum, n) {
  if (n === 0) return 0;
  const min = n * 1;
  const max = n * 5;
  return Math.round(((sum - min) / (max - min)) * 100);
}

/* ---------------------------------------------------------------------
   1. Perceived Stress (PSS-style)
   Reverse-keyed items are flipped (6 - value) before summing, so a
   higher score always means MORE perceived stress.
--------------------------------------------------------------------- */
function scorePSS(answers, questions = PSS_QUESTIONS) {
  let sum = 0;
  questions.forEach((q) => {
    const v = _answerOrNeutral(answers, q.id);
    sum += q.reverse ? 6 - v : v;
  });
  const score = _normalize(sum, questions.length);
  const level = score <= 33 ? "low" : score <= 66 ? "moderate" : "high";
  return { score, level, profile: PSS_LEVELS[level] };
}

/* ---------------------------------------------------------------------
   2. Appraisal & Coping (Transactional Model)
   PF/EF/AV are coping styles; AP is challenge-vs-threat appraisal.
   `primary` is the highest of PF/EF/AV only (AP is reported separately).
   Tie-break: first-listed order PF > EF > AV — deterministic, not a bug.
--------------------------------------------------------------------- */
function scoreCoping(answers, questions = COPING_QUESTIONS) {
  const scales = ["PF", "EF", "AV", "AP"];
  const scores = {};
  scales.forEach((s) => {
    const items = questions.filter((q) => q.scale === s);
    const sum = items.reduce((acc, q) => acc + _answerOrNeutral(answers, q.id), 0);
    scores[s] = _normalize(sum, items.length);
  });
  const copingOnly = ["PF", "EF", "AV"];
  const primary = copingOnly.reduce((best, s) => (scores[s] > scores[best] ? s : best), copingOnly[0]);
  const appraisal = scores.AP >= 60 ? "challenge" : scores.AP <= 40 ? "threat" : "balanced";
  return {
    scores,
    primary,
    primaryProfile: COPING_STYLES[primary],
    appraisal,
    appraisalProfile: COPING_STYLES.AP,
  };
}

/* ---------------------------------------------------------------------
   3. Demand–Control–Support (JDCS)
   Quadrant from demands × control (50 = midpoint of the normalized
   scale; ties at exactly 50 count as "high" — deterministic).
   Support < 50 flags iso-strain risk.
--------------------------------------------------------------------- */
function scoreDCS(answers, questions = DCS_QUESTIONS) {
  const scales = ["DE", "CO", "SU"];
  const scores = {};
  scales.forEach((s) => {
    const items = questions.filter((q) => q.scale === s);
    const sum = items.reduce((acc, q) => acc + _answerOrNeutral(answers, q.id), 0);
    scores[s] = _normalize(sum, items.length);
  });
  const highDemand = scores.DE >= 50;
  const highControl = scores.CO >= 50;
  const quadrant = highDemand
    ? highControl ? "active" : "highStrain"
    : highControl ? "lowStrain" : "passive";
  const lowSupport = scores.SU < 50;
  return {
    scores,
    quadrant,
    quadrantProfile: DCS_QUADRANTS[quadrant],
    lowSupport,
    isoStrain: quadrant === "highStrain" && lowSupport,
    supportNote: DCS_SUPPORT_NOTES[lowSupport ? "low" : "high"],
  };
}

/* ---------------------------------------------------------------------
   4. Wellbeing Buffers (PERMA)
   Each pillar normalized 0–100; ranked high→low. Ties keep the canonical
   P-E-R-M-A order (stable sort) — deterministic.
--------------------------------------------------------------------- */
function scorePERMA(answers, questions = PERMA_QUESTIONS) {
  const scales = ["PP", "EN", "RE", "ME", "AC"];
  const scores = {};
  scales.forEach((s) => {
    const items = questions.filter((q) => q.scale === s);
    const sum = items.reduce((acc, q) => acc + _answerOrNeutral(answers, q.id), 0);
    scores[s] = _normalize(sum, items.length);
  });
  const ranked = scales
    .map((s) => ({ key: s, score: scores[s], profile: PERMA_PILLARS[s] }))
    .sort((a, b) => b.score - a.score);
  const overall = Math.round(scales.reduce((acc, s) => acc + scores[s], 0) / scales.length);
  return {
    scores,
    ranked,
    overall,
    strongest: ranked.slice(0, 2),
    weakest: ranked.slice(-2).reverse(), // lowest first
  };
}

/* ---------------------------------------------------------------------
   5. Combined report
   context: "work" | "study" | "life" — selects DCS advice wording.
--------------------------------------------------------------------- */
const _T = {
  srcStress: { en: "Perceived Stress", vi: "Căng Thẳng Cảm Nhận" },
  srcCoping: { en: "Coping", vi: "Ứng Phó" },
  srcAppraisal: { en: "Appraisal", vi: "Đánh Giá Tình Huống" },
  srcDC: { en: "Demand-Control", vi: "Đòi Hỏi-Kiểm Soát" },
  srcSupport: { en: "Support", vi: "Hỗ Trợ" },
  srcPerma: { en: "PERMA", vi: "PERMA" },
  lowStressGood: { en: "Your overall perceived stress is low — demands and your sense of control are in balance right now.", vi: "Mức căng thẳng cảm nhận tổng thể của bạn thấp — các đòi hỏi và cảm giác kiểm soát của bạn đang cân bằng lúc này." },
  highStressBad: { en: "Your overall perceived stress is high — life has frequently felt overloaded or out of your control this past month.", vi: "Mức căng thẳng cảm nhận tổng thể của bạn cao — cuộc sống đã thường xuyên cảm thấy quá tải hoặc ngoài tầm kiểm soát trong tháng qua." },
  modStress: { en: "Your perceived stress is moderate — workable, but worth acting on before demands rise further.", vi: "Mức căng thẳng cảm nhận của bạn ở mức vừa phải — có thể xử lý được, nhưng đáng để hành động trước khi đòi hỏi tăng thêm." },
  pfHigh: { en: "You reliably move toward problems with plans and concrete action — the most effective strategy for changeable stressors.", vi: "Bạn luôn đối mặt với vấn đề bằng kế hoạch và hành động cụ thể — chiến lược hiệu quả nhất cho các tác nhân gây căng thẳng có thể thay đổi được." },
  efHigh: { en: "You have solid emotional-regulation tools (calming, reframing, acceptance) for situations you can't change.", vi: "Bạn có những công cụ điều tiết cảm xúc vững vàng (làm dịu, nhìn nhận lại, chấp nhận) cho những tình huống không thể thay đổi." },
  avHigh: { en: "Avoidant coping is prominent for you — distraction and delay relieve stress briefly but reliably compound it over time.", vi: "Ứng phó né tránh khá nổi bật ở bạn — sao nhãng và trì hoãn làm dịu căng thẳng trong chốc lát nhưng chắc chắn khiến nó tích tụ dần theo thời gian." },
  bothLow: { en: "Both active coping channels (problem-solving and emotion-regulation) score low — building either one would give you an immediate lever on stress.", vi: "Cả hai kênh ứng phó chủ động (giải quyết vấn đề và điều tiết cảm xúc) đều có điểm thấp — xây dựng một trong hai sẽ cho bạn đòn bẩy tức thì đối với căng thẳng." },
  challengeGood: { en: "You tend to appraise demands as challenges rather than threats — linked with better performance under pressure and faster recovery.", vi: "Bạn có xu hướng nhìn nhận các đòi hỏi như thử thách hơn là mối đe dọa — điều này liên quan đến hiệu suất tốt hơn dưới áp lực và phục hồi nhanh hơn." },
  threatBad: { en: "Demanding situations tend to register as threats for you, which amplifies the stress response — the encouraging news is that appraisal style is trainable.", vi: "Các tình huống đòi hỏi thường được bạn nhìn nhận như mối đe dọa, điều này khuếch đại phản ứng căng thẳng — tin vui là phong cách đánh giá này có thể rèn luyện được." },
  dcsGood: { en: (name, formula) => `Your daily role fits the "${name}" pattern (${formula.toLowerCase()}) — a structurally protective position.`, vi: (name, formula) => `Vai trò hằng ngày của bạn khớp với mô hình "${name}" (${formula.toLowerCase()}) — một vị thế có tính bảo vệ về mặt cấu trúc.` },
  dcsBad: { en: (name, formula) => `Your daily role fits the "${name}" pattern (${formula.toLowerCase()}) — see the structural advice in your action plan.`, vi: (name, formula) => `Vai trò hằng ngày của bạn khớp với mô hình "${name}" (${formula.toLowerCase()}) — xem gợi ý về cấu trúc trong kế hoạch hành động của bạn.` },
  isoStrain: { en: "High strain combined with low support ('iso-strain') is the highest-risk pattern in the model — building support is your single highest-leverage change.", vi: "Áp lực cao kết hợp với hỗ trợ thấp ('cô lập căng thẳng') là mô hình rủi ro cao nhất trong khung lý thuyết này — xây dựng hỗ trợ là thay đổi có tác động lớn nhất bạn có thể thực hiện." },
  lowSupportText: { en: "Your support score is low — you may be carrying your demands largely alone.", vi: "Điểm hỗ trợ của bạn thấp — bạn có thể đang gánh vác phần lớn các đòi hỏi của mình một mình." },
  goodSupport: { en: "You have solid support around your daily role — the strongest buffer in the demand-control-support model.", vi: "Bạn có sự hỗ trợ vững vàng xung quanh vai trò hằng ngày của mình — vùng đệm mạnh nhất trong mô hình đòi hỏi-kiểm soát-hỗ trợ." },
  permaStrong: { en: (name, score, nickname) => `${name} is a strong wellbeing buffer for you (${score}%). ${nickname} is working in your favor — keep feeding it.`, vi: (name, score, nickname) => `${name} là một vùng đệm hạnh phúc mạnh mẽ đối với bạn (${score}%). ${nickname} đang có lợi cho bạn — hãy tiếp tục nuôi dưỡng nó.` },
  permaWeak: { en: (name, score) => `${name} is currently a thin buffer (${score}%) — a natural place to rebuild resilience.`, vi: (name, score) => `${name} hiện là một vùng đệm còn mỏng (${score}%) — một nơi tự nhiên để xây dựng lại sức bền.` },
  buildSupportAction: { en: "Build one strand of support this week: tell one specific person one concrete thing that would help you.", vi: "Xây dựng một sợi dây hỗ trợ trong tuần này: nói với một người cụ thể về một điều cụ thể có thể giúp bạn." },
  tenMinRule: { en: "Pick your most-avoided task or conversation and apply the 10-minute rule: commit to just 10 minutes of it today.", vi: "Chọn công việc hoặc cuộc trò chuyện bạn né tránh nhiều nhất và áp dụng quy tắc 10 phút: cam kết dành đúng 10 phút cho nó hôm nay." },
  threatAction: { en: "Before your next demanding situation, write down: the resources you have, a time you coped with something similar, and what's genuinely at stake — this shifts threat appraisal toward challenge.", vi: "Trước tình huống đòi hỏi tiếp theo, hãy viết ra: những nguồn lực bạn có, một lần bạn đã ứng phó với điều tương tự, và điều thực sự đang bị đe dọa — điều này giúp chuyển đánh giá từ mối đe dọa sang thử thách." },
  headlineHigh: { en: "Your stress load deserves attention — and it has clear levers.", vi: "Tải trọng căng thẳng của bạn đáng được chú ý — và có những đòn bẩy rõ ràng để cải thiện." },
  headlineMod: { en: "A real but workable stress load — with clear places to act.", vi: "Một tải trọng căng thẳng có thật nhưng có thể xử lý được — với những điểm rõ ràng để hành động." },
  headlineLow: { en: "A well-managed stress picture — protect what's working.", vi: "Một bức tranh căng thẳng được quản lý tốt — hãy bảo vệ những gì đang hiệu quả." },
};

function buildStressReport(context, pss, coping, dcs, perma) {
  const strengths = [];
  const riskAreas = [];
  const dcsName = L(dcs.quadrantProfile.name);
  const dcsFormula = L(dcs.quadrantProfile.formula);

  // Perceived stress level
  if (pss.level === "low") {
    strengths.push({ text: L(_T.lowStressGood), source: L(_T.srcStress) });
  } else if (pss.level === "high") {
    riskAreas.push({ text: L(_T.highStressBad), source: L(_T.srcStress) });
  } else {
    riskAreas.push({ text: L(_T.modStress), source: L(_T.srcStress) });
  }

  // Coping profile
  if (coping.scores.PF >= 60) strengths.push({ text: L(_T.pfHigh), source: L(_T.srcCoping) });
  if (coping.scores.EF >= 60) strengths.push({ text: L(_T.efHigh), source: L(_T.srcCoping) });
  if (coping.scores.AV >= 60) riskAreas.push({ text: L(_T.avHigh), source: L(_T.srcCoping) });
  if (coping.scores.PF < 40 && coping.scores.EF < 40) riskAreas.push({ text: L(_T.bothLow), source: L(_T.srcCoping) });
  if (coping.appraisal === "challenge") strengths.push({ text: L(_T.challengeGood), source: L(_T.srcAppraisal) });
  if (coping.appraisal === "threat") riskAreas.push({ text: L(_T.threatBad), source: L(_T.srcAppraisal) });

  // DCS structure
  if (dcs.quadrant === "active" || dcs.quadrant === "lowStrain") {
    strengths.push({ text: _T.dcsGood[getLang()](dcsName, dcsFormula), source: L(_T.srcDC) });
  } else {
    riskAreas.push({ text: _T.dcsBad[getLang()](dcsName, dcsFormula), source: L(_T.srcDC) });
  }
  if (dcs.lowSupport) {
    riskAreas.push({ text: dcs.isoStrain ? L(_T.isoStrain) : L(_T.lowSupportText), source: L(_T.srcSupport) });
  } else {
    strengths.push({ text: L(_T.goodSupport), source: L(_T.srcSupport) });
  }

  // PERMA buffers
  perma.strongest.forEach((p) => {
    if (p.score >= 60) strengths.push({ text: _T.permaStrong[getLang()](L(p.profile.name), p.score, L(p.profile.nickname)), source: L(_T.srcPerma) });
  });
  perma.weakest.forEach((p) => {
    if (p.score < 50) riskAreas.push({ text: _T.permaWeak[getLang()](L(p.profile.name), p.score), source: L(_T.srcPerma) });
  });

  // Action plan: stress-level tip + quadrant/context advice + coping + PERMA boosters
  const actionPlan = [];
  actionPlan.push(L(pss.profile.tips)[0]);
  const ctxAdvice = L(dcs.quadrantProfile.advice[context] || dcs.quadrantProfile.advice.work);
  actionPlan.push(ctxAdvice[0], ctxAdvice[1]);
  if (dcs.lowSupport) actionPlan.push(L(_T.buildSupportAction));
  if (coping.scores.AV >= 60) actionPlan.push(L(_T.tenMinRule));
  if (coping.appraisal === "threat") actionPlan.push(L(_T.threatAction));
  const weakestPillar = perma.weakest[0];
  if (weakestPillar) actionPlan.push(L(weakestPillar.profile.boosters)[0]);

  const headline =
    pss.level === "high" ? L(_T.headlineHigh) : pss.level === "moderate" ? L(_T.headlineMod) : L(_T.headlineLow);

  return { headline, strengths, riskAreas, actionPlan: actionPlan.slice(0, 7) };
}
