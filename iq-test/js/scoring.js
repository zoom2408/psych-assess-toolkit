/* =========================================================================
   SCORING ENGINE — Cognitive Abilities Challenge
   Pure functions, no DOM/state dependencies (design doc §4).
   RIGHT/WRONG scoring: a correct answer earns the item's difficulty
   weight (1/2/3); wrong or unanswered earns 0. Each domain is normalized
   to 0–100 = percent of that domain's available weighted points.
   IMPORTANT: always pass the ACTUAL question array the user saw
   (Quick vs Full) so the denominator matches.
========================================================================= */

const IQ_DOMAIN_ORDER = ["verbal", "numerical", "logical", "spatial", "memory"];

function scoreIQ(answers, questions = IQ_QUESTIONS) {
  const scores = {};
  const missed = [];
  IQ_DOMAIN_ORDER.forEach((d) => {
    const items = questions.filter((q) => q.domain === d);
    let earned = 0;
    let possible = 0;
    items.forEach((q) => {
      possible += q.difficulty;
      if (answers[q.id] === q.answer) earned += q.difficulty;
      else missed.push(q);
    });
    scores[d] = possible ? Math.round((earned / possible) * 100) : 0;
  });

  const rawComposite = Math.round(
    IQ_DOMAIN_ORDER.reduce((acc, d) => acc + scores[d], 0) / IQ_DOMAIN_ORDER.length
  );

  const ranked = IQ_DOMAIN_ORDER
    .map((d) => ({ key: d, score: scores[d], profile: IQ_DOMAINS[d] }))
    .sort((a, b) => b.score - a.score); // stable: canonical order on ties

  return { scores, rawComposite, ranked, strongest: ranked[0], weakest: ranked[ranked.length - 1], missed };
}

/* Adjusted composite: raw + age offset + education offset, clamped 0–100.
   Offsets are heuristic interpretation aids, NOT norms (see data-profiles). */
function adjustComposite(rawComposite, ageKey, eduKey) {
  const age = AGE_GROUPS.find((a) => a.key === ageKey) || AGE_GROUPS[1];
  const edu = EDU_LEVELS.find((e) => e.key === eduKey) || EDU_LEVELS[2];
  const adjusted = Math.max(0, Math.min(100, rawComposite + age.offset + edu.offset));
  return { adjusted, age, edu, totalOffset: age.offset + edu.offset };
}

function bandFor(adjustedComposite) {
  for (const key of IQ_BAND_ORDER) {
    if (adjustedComposite >= IQ_BANDS[key].cutoff) return IQ_BANDS[key];
  }
  return IQ_BANDS.developing;
}

/* ---------------------------------------------------------------------
   Report content.
--------------------------------------------------------------------- */
const _QT = {
  headline: { en: (band) => `Overall: ${band}`, vi: (band) => `Tổng thể: ${band}` },
  adjNote: {
    en: (raw, adj, ageLabel, eduLabel, offset) =>
      `Raw score ${raw}/100, read as <strong>${adj}/100</strong> for your context (age ${ageLabel}, education: ${eduLabel} — a ${offset >= 0 ? "+" + offset : offset}-point interpretation adjustment). This adjustment is a heuristic, not a psychometric norm.`,
    vi: (raw, adj, ageLabel, eduLabel, offset) =>
      `Điểm thô ${raw}/100, được diễn giải là <strong>${adj}/100</strong> theo bối cảnh của bạn (độ tuổi ${ageLabel}, học vấn: ${eduLabel} — điều chỉnh diễn giải ${offset >= 0 ? "+" + offset : offset} điểm). Điều chỉnh này là ước lượng kinh nghiệm, không phải chuẩn hóa tâm trắc.`,
  },
  strongLine: { en: (name, score) => `Strongest domain: ${name} (${score}%).`, vi: (name, score) => `Lĩnh vực mạnh nhất: ${name} (${score}%).` },
  weakLine: { en: (name, score) => `Most room to grow: ${name} (${score}%).`, vi: (name, score) => `Còn nhiều dư địa nhất: ${name} (${score}%).` },
  evenLine: { en: "Your domain scores are notably even — no single ability dominates.", vi: "Điểm các lĩnh vực của bạn khá đồng đều — không có năng lực nào vượt trội hẳn." },
  perfectLine: { en: "No missed questions — a perfect run. 🎯", vi: "Không sai câu nào — một bài làm hoàn hảo. 🎯" },
};

function buildIQReport(result, adjustment) {
  const band = bandFor(adjustment.adjusted);
  const headline = _QT.headline[getLang()](L(band.name));
  const adjNote = _QT.adjNote[getLang()](
    result.rawComposite,
    adjustment.adjusted,
    L(adjustment.age.label),
    L(adjustment.edu.label),
    adjustment.totalOffset
  );
  const spread = result.strongest.score - result.weakest.score;
  const strongLine = spread < 15 ? L(_QT.evenLine) : _QT.strongLine[getLang()](L(result.strongest.profile.name), result.strongest.score);
  const weakLine = spread < 15 ? "" : _QT.weakLine[getLang()](L(result.weakest.profile.name), result.weakest.score);

  // Tips: strongest domain's strongTip + two lowest domains' growTips.
  const tips = [L(result.strongest.profile.strongTip)];
  result.ranked.slice(-2).reverse().forEach((d) => tips.push(L(d.profile.growTip)));

  return { band, headline, adjNote, strongLine, weakLine, tips, perfect: result.missed.length === 0 ? L(_QT.perfectLine) : null };
}
