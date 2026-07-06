/* =========================================================================
   SCORING ENGINE — pure function, no DOM/state dependencies (same
   contract as the project's other assessments: explicit `questions` param,
   deterministic, percentage math that always stays in range).

   Rosenberg Self-Esteem Scale (RSES) uses its own standard 4-point
   agreement scale (1=Strongly Disagree … 4=Strongly Agree), NOT the
   5-point Likert used by the other assessments in this project — this is
   the authentic instrument's native format, not a deviation.

   Per item: non-reverse contributes (answer - 1), reverse contributes
   (4 - answer). Both land in 0–3, so raw total ranges 0–30 for the full
   10-item scale (or fewer if a partial subset were ever scored).
   Unanswered items default to neutral (midpoint of the 4-point scale is
   not a whole number; we use 2.5 pre-conversion, i.e. 1.5 raw points,
   rounded at the end only — never per item — so ties don't accumulate
   rounding bias).
========================================================================= */

function _rsesRawPoints(answers, q) {
  const v = answers[q.id];
  if (typeof v !== "number" || v < 1 || v > 4) return 1.5; // neutral midpoint, unanswered
  return q.reverse ? 4 - v : v - 1;
}

function scoreRSES(answers, questions = RSES_QUESTIONS) {
  let raw = 0;
  questions.forEach((q) => {
    raw += _rsesRawPoints(answers, q);
  });
  raw = Math.round(raw);
  const maxRaw = questions.length * 3;
  const pct = maxRaw === 0 ? 0 : Math.round((raw / maxRaw) * 100);
  const level = raw <= 14 ? "low" : raw <= 25 ? "normal" : "high";
  return { raw, maxRaw, pct, level, profile: RSES_LEVELS[level] };
}
