/* =========================================================================
   SCORING — Wellbeing & Mood Check-In (PHQ-9 + GAD-7)
   Pure functions. Simple validated sums — do NOT normalize, weight, or
   otherwise transform: the published cutoffs only work on raw totals.
   Unanswered items count 0 (the instruments' own convention when items
   are skipped, though the app requires answers, so this is a safety net).
========================================================================= */

function _val(answers, id) {
  const v = answers[id];
  return typeof v === "number" && v >= 0 && v <= 3 ? v : 0;
}

function _bandFor(bands, total) {
  return bands.find((b) => total >= b.min && total <= b.max) || bands[0];
}

/* PHQ-9: total 0–27, plus item-9 flag. */
function scorePHQ(answers) {
  const total = PHQ_QUESTIONS.reduce((acc, q) => acc + _val(answers, q.id), 0);
  const item9 = _val(answers, "ph09"); // 0–3; any non-zero → support resources
  return { total, max: 27, band: _bandFor(PHQ_BANDS, total), item9Flag: item9 > 0, item9 };
}

/* GAD-7: total 0–21. */
function scoreGAD(answers) {
  const total = GAD_QUESTIONS.reduce((acc, q) => acc + _val(answers, q.id), 0);
  return { total, max: 21, band: _bandFor(GAD_BANDS, total) };
}

/* Impairment follow-up (0–3, not part of either total). */
function impairmentLevel(value) {
  return typeof value === "number" && value >= 0 && value <= 3 ? value : null;
}
