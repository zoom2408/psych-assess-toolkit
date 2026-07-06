/* =========================================================================
   SCORING ENGINE — Character Strengths Profile
   Pure functions, no DOM/state dependencies (design doc §4).
   IMPORTANT: always pass the ACTUAL question array the user answered
   (Quick vs Full) — passing the full bank when only Quick items were
   answered silently dilutes scores toward neutral.
   Unanswered items default to neutral (3). Each strength is min-max
   normalized to 0–100 based on the item count actually used.
========================================================================= */

function _answerOrNeutral(answers, id) {
  const v = answers[id];
  return typeof v === "number" && v >= 1 && v <= 5 ? v : 3;
}

function _normalize(sum, n) {
  if (n === 0) return 0;
  const min = n * 1;
  const max = n * 5;
  return Math.round(((sum - min) / (max - min)) * 100);
}

/* Canonical VIA-classification order — used as the stable tie-break so
   ranking is deterministic (design doc convention). */
const STRENGTH_ORDER = VIRTUES.flatMap((v) => v.strengths);

/* ---------------------------------------------------------------------
   Main scorer.
   Returns:
   { scores: {strengthKey: 0-100},
     ranked: [{key, score, profile, virtue}] high→low (stable canonical order on ties),
     signature: top 5, middle: 6–19, lesser: bottom 5 (lowest LAST — i.e.
       lesser[4] is the single lowest strength),
     virtueScores: [{virtue-object, score}] in canonical order,
     strongestVirtue, gentlestVirtue }
--------------------------------------------------------------------- */
function scoreStrengths(answers, questions = STRENGTHS_QUESTIONS) {
  const scores = {};
  STRENGTH_ORDER.forEach((key) => {
    const items = questions.filter((q) => q.strength === key);
    const sum = items.reduce((acc, q) => acc + _answerOrNeutral(answers, q.id), 0);
    scores[key] = _normalize(sum, items.length);
  });

  const ranked = STRENGTH_ORDER
    .map((key) => ({ key, score: scores[key], profile: STRENGTH_PROFILES[key], virtue: STRENGTH_PROFILES[key].virtue }))
    .sort((a, b) => b.score - a.score); // stable sort keeps canonical order on ties

  const signature = ranked.slice(0, 5);
  const middle = ranked.slice(5, 19);
  const lesser = ranked.slice(19); // 5 lowest, highest of them first

  const virtueScores = VIRTUES.map((v) => {
    const avg = Math.round(v.strengths.reduce((acc, k) => acc + scores[k], 0) / v.strengths.length);
    return { virtue: v, score: avg };
  });
  const strongestVirtue = virtueScores.reduce((best, v) => (v.score > best.score ? v : best), virtueScores[0]);
  const gentlestVirtue = virtueScores.reduce((low, v) => (v.score < low.score ? v : low), virtueScores[0]);

  return { scores, ranked, signature, middle, lesser, virtueScores, strongestVirtue, gentlestVirtue };
}

/* ---------------------------------------------------------------------
   Combined report content.
   The core intervention behind this report is the best-evidenced one in
   the strengths literature: identify signature strengths, then USE ONE
   IN A NEW WAY each day/week. So the action plan draws from the top
   strengths' useMore tips (not from "fixing" lesser strengths — lesser
   strengths are framed as low-fuel, not flaws).
--------------------------------------------------------------------- */
const _RT = {
  headline: { en: (name) => `Your signature strength: ${name}`, vi: (name) => `Thế mạnh đặc trưng của bạn: ${name}` },
  spotProfile: { en: "A profile with clear peaks — your signature strengths stand well above the rest, which makes them easy to aim.", vi: "Một hồ sơ với những đỉnh rõ rệt — các thế mạnh đặc trưng của bạn vượt hẳn phần còn lại, nên rất dễ để chủ động vận dụng." },
  evenProfile: { en: "A notably even profile — you draw on many strengths at similar levels. Your top five are still your most natural tools; the ranking is just gentler.", vi: "Một hồ sơ khá đồng đều — bạn vận dụng nhiều thế mạnh ở mức tương đương. Năm thế mạnh hàng đầu vẫn là công cụ tự nhiên nhất của bạn; chỉ là thứ hạng ít chênh lệch hơn." },
  virtueLine: { en: (strong, gentle) => `Your strengths cluster most in <strong>${strong}</strong>; <strong>${gentle}</strong> is currently your quietest domain — not a weakness, just where you naturally reach less often.`, vi: (strong, gentle) => `Các thế mạnh của bạn tập trung nhiều nhất ở nhóm <strong>${strong}</strong>; <strong>${gentle}</strong> hiện là vùng trầm lặng nhất — không phải điểm yếu, chỉ là nơi bạn ít vận dụng đến một cách tự nhiên.` },
  actionIntro: { en: "The best-evidenced way to benefit from this profile: pick ONE signature strength and use it in a NEW way each week. Start here:", vi: "Cách hưởng lợi từ hồ sơ này có nhiều bằng chứng nhất: chọn MỘT thế mạnh đặc trưng và dùng nó theo cách MỚI mỗi tuần. Bắt đầu từ đây:" },
  lesserNote: { en: "Your lesser strengths aren't flaws — they're simply the tools you reach for least. If one of them matters for a current goal, borrow a signature strength to power it (e.g., use Curiosity to make a Self-Regulation habit interesting).", vi: "Các thế mạnh thấp hơn của bạn không phải khuyết điểm — chúng chỉ là những công cụ bạn ít dùng đến nhất. Nếu một trong số đó quan trọng cho mục tiêu hiện tại, hãy mượn một thế mạnh đặc trưng để tiếp sức cho nó (ví dụ: dùng Ham Tìm Hiểu để khiến thói quen Tự Chủ trở nên thú vị)." },
};

function buildStrengthsReport(result) {
  const top = result.signature[0];
  const spread = result.signature[0].score - result.lesser[result.lesser.length - 1].score;
  const shape = spread >= 30 ? L(_RT.spotProfile) : L(_RT.evenProfile);
  const headline = _RT.headline[getLang()](L(top.profile.name));
  const virtueLine = _RT.virtueLine[getLang()](L(result.strongestVirtue.virtue.name), L(result.gentlestVirtue.virtue.name));

  // Action plan: one "use more" tip from each of the top 3 signature
  // strengths + the lesser-strengths reframe.
  const actionPlan = result.signature.slice(0, 3).map((s) => {
    const tips = L(s.profile.useMore);
    return `<strong>${L(s.profile.name)}:</strong> ${tips[0]}`;
  });

  return { headline, shape, virtueLine, actionIntro: L(_RT.actionIntro), actionPlan, lesserNote: L(_RT.lesserNote) };
}
