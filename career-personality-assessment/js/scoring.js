/* =========================================================================
   SCORING ENGINE
   Pure functions that take raw answers (questionId -> 1..5) and produce
   structured results for MBTI, DISC, and RIASEC, plus a combined report
   generator that merges all three into strengths, growth areas, career
   matches, and an action plan.

   Bilingual (EN/VI): question/profile text fields (e.g. .text, .name,
   .strengths[], .growthAreas[]) are now { en, vi } objects, resolved via
   L() from shared/i18n.js. Scoring itself is by id/score and is
   unaffected by this — only display-facing strings that flow into the
   report (buildCombinedReport's sentence fragments, and source labels
   built from .name) need L().
========================================================================= */

const REPORT_UI = {
  mbtiSource: { en: (type) => `MBTI (${type})`, vi: (type) => `MBTI (${type})` },
  discSource: { en: (name) => `DISC (${name})`, vi: (name) => `DISC (${name})` },
  exploreAction: {
    en: (field, examples) => `Explore ${field.toLowerCase()}-track opportunities (${examples}) through a class, club, internship, or informational interview to test the fit in real life.`,
    vi: (field, examples) => `Khám phá các cơ hội theo hướng ${field.toLowerCase()} (${examples}) qua một lớp học, câu lạc bộ, thực tập, hoặc buổi phỏng vấn tìm hiểu để kiểm chứng mức độ phù hợp trong thực tế.`,
  },
  growthAction1: {
    en: (text) => `Pick one growth area to focus on this term: "${text}" — set a small, specific goal to practice it over the next 4-6 weeks.`,
    vi: (text) => `Chọn một điểm cần phát triển để tập trung trong giai đoạn này: "${text}" — đặt ra một mục tiêu nhỏ, cụ thể để rèn luyện điều đó trong 4-6 tuần tới.`,
  },
  growthAction2: {
    en: (text) => `Ask a teacher, mentor, or manager for honest feedback on: "${text}" — outside perspective often reveals blind spots faster than self-reflection alone.`,
    vi: (text) => `Hãy nhờ giáo viên, người cố vấn, hoặc quản lý cho phản hồi thẳng thắn về: "${text}" — góc nhìn từ bên ngoài thường giúp phát hiện điểm mù nhanh hơn là chỉ tự chiêm nghiệm.`,
  },
  strengthAction: {
    en: (text) => `Lean into your strengths deliberately — look for a project or role that specifically uses "${text}."`,
    vi: (text) => `Hãy chủ động phát huy thế mạnh của bạn — tìm một dự án hoặc vai trò sử dụng cụ thể "${text}."`,
  },
  yourStrengths: { en: "your natural strengths", vi: "thế mạnh tự nhiên của bạn" },
  retakeAction: {
    en: (period) => `Retake this assessment in 6-12 months. Interests and self-awareness shift over time, especially during ${period} — tracking changes helps confirm what's a stable pattern vs. a passing phase.`,
    vi: (period) => `Hãy làm lại bài đánh giá này sau 6-12 tháng. Sở thích và sự tự nhận thức thay đổi theo thời gian, đặc biệt là trong giai đoạn ${period} — theo dõi những thay đổi giúp xác nhận điều gì là mô hình ổn định và điều gì chỉ là giai đoạn tạm thời.`,
  },
  periodTeen: { en: "the teen years", vi: "tuổi thiếu niên" },
  periodYoungAdult: { en: "early career exploration", vi: "giai đoạn đầu khám phá sự nghiệp" },
  periodAdult: { en: "career transitions", vi: "giai đoạn chuyển đổi sự nghiệp" },
};

// ---------------------------------------------------------------------
// MBTI scoring
// ---------------------------------------------------------------------
function scoreMBTI(answers, questions) {
  const questionSet = questions || MBTI_QUESTIONS;
  const dichotomyPairs = {
    EI: ["E", "I"],
    SN: ["S", "N"],
    TF: ["T", "F"],
    JP: ["J", "P"],
  };
  const totals = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questionSet.forEach((q) => {
    const val = Number(answers[q.id]) || 3; // default neutral if unanswered
    totals[q.pole] += val;
  });

  const dichotomies = {};
  let typeCode = "";
  Object.keys(dichotomyPairs).forEach((dichotomy) => {
    const [poleA, poleB] = dichotomyPairs[dichotomy];
    const a = totals[poleA];
    const b = totals[poleB];
    const sum = a + b || 1;
    const pctA = Math.round((a / sum) * 100);
    const pctB = 100 - pctA;
    const letter = a >= b ? poleA : poleB;
    typeCode += letter;
    dichotomies[dichotomy] = {
      [poleA]: pctA,
      [poleB]: pctB,
      letter,
      strength: Math.max(pctA, pctB),
    };
  });

  return {
    type: typeCode,
    dichotomies,
    profile: MBTI_TYPES[typeCode] || null,
  };
}

// ---------------------------------------------------------------------
// DISC scoring
// ---------------------------------------------------------------------
function scoreDISC(answers, questions) {
  const questionSet = questions || DISC_QUESTIONS;
  const scaleItemCounts = { D: 0, I: 0, S: 0, C: 0 };
  const totals = { D: 0, I: 0, S: 0, C: 0 };

  questionSet.forEach((q) => {
    const val = Number(answers[q.id]) || 3;
    totals[q.scale] += val;
    scaleItemCounts[q.scale] += 1;
  });

  const scores = {};
  Object.keys(totals).forEach((scale) => {
    const max = scaleItemCounts[scale] * 5;
    const min = scaleItemCounts[scale] * 1;
    scores[scale] = Math.round(((totals[scale] - min) / (max - min)) * 100);
  });

  const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const primary = ranked[0];
  const secondary = ranked[1];

  return {
    scores,
    primary,
    secondary,
    primaryProfile: DISC_STYLES[primary],
    secondaryProfile: DISC_STYLES[secondary],
  };
}

// ---------------------------------------------------------------------
// RIASEC scoring
// ---------------------------------------------------------------------
function scoreRIASEC(answers, questions) {
  const questionSet = questions || RIASEC_QUESTIONS;
  const scaleItemCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const totals = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  questionSet.forEach((q) => {
    const val = Number(answers[q.id]) || 3;
    totals[q.scale] += val;
    scaleItemCounts[q.scale] += 1;
  });

  const scores = {};
  Object.keys(totals).forEach((scale) => {
    const max = scaleItemCounts[scale] * 5;
    const min = scaleItemCounts[scale] * 1;
    scores[scale] = Math.round(((totals[scale] - min) / (max - min)) * 100);
  });

  const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  const hollandCode = ranked.slice(0, 3).join("");
  const topThemes = ranked.slice(0, 3).map((letter) => ({ letter, ...RIASEC_THEMES[letter] }));

  return { scores, ranked, hollandCode, topThemes };
}

// ---------------------------------------------------------------------
// Combined report builder
// ---------------------------------------------------------------------
function ageKeyFor(ageGroup) {
  // ageGroup is one of "teen" | "youngAdult" | "adult"
  if (ageGroup === "teen") return "teens";
  if (ageGroup === "youngAdult") return "youngAdults";
  return "adults";
}

function buildCombinedReport(ageGroup, mbti, disc, riasec) {
  const ageKey = ageKeyFor(ageGroup);

  // ---- Strengths & growth areas: merge MBTI type + DISC primary style ----
  const strengths = [];
  const growthAreas = [];

  if (mbti.profile) {
    const mbtiSourceText = { en: L(REPORT_UI.mbtiSource)(mbti.type), vi: REPORT_UI.mbtiSource.vi(mbti.type) };
    mbti.profile.strengths.forEach((s) => strengths.push({ source: mbtiSourceText, text: s }));
    mbti.profile.growthAreas.forEach((g) => growthAreas.push({ source: mbtiSourceText, text: g }));
  }
  if (disc.primaryProfile) {
    const discName = L(disc.primaryProfile.name);
    const discSourceText = { en: REPORT_UI.discSource.en(discName), vi: REPORT_UI.discSource.vi(discName) };
    disc.primaryProfile.strengths.forEach((s) => strengths.push({ source: discSourceText, text: s }));
    disc.primaryProfile.growthAreas.forEach((g) => growthAreas.push({ source: discSourceText, text: g }));
  }

  // ---- Career matches: primary + secondary RIASEC theme, age-tiered ----
  const careerSet = [];
  const seen = new Set();
  riasec.topThemes.forEach((theme) => {
    const list = theme[ageKey] || [];
    list.forEach((career) => {
      const careerKey = L(career);
      if (!seen.has(careerKey)) {
        seen.add(careerKey);
        careerSet.push({ career, theme: theme.name, letter: theme.letter });
      }
    });
  });
  const careers = careerSet.slice(0, 12);

  // ---- Action plan: templated suggestions from growth areas + top field ----
  const topField = riasec.topThemes[0];
  const actionPlan = [];

  const topFieldExamples = (topField[ageKey] || []).slice(0, 2);
  actionPlan.push({
    en: REPORT_UI.exploreAction.en(L(topField.name), topFieldExamples.map((c) => c.en).join(" or ")),
    vi: REPORT_UI.exploreAction.vi(topField.name.vi, topFieldExamples.map((c) => c.vi).join(" hoặc ")),
  });

  if (growthAreas.length > 0) {
    actionPlan.push({
      en: REPORT_UI.growthAction1.en(growthAreas[0].text.en),
      vi: REPORT_UI.growthAction1.vi(growthAreas[0].text.vi),
    });
  }
  if (growthAreas.length > 1) {
    actionPlan.push({
      en: REPORT_UI.growthAction2.en(growthAreas[1].text.en),
      vi: REPORT_UI.growthAction2.vi(growthAreas[1].text.vi),
    });
  }
  const strengthTextEn = strengths[0] ? strengths[0].text.en.toLowerCase() : REPORT_UI.yourStrengths.en;
  const strengthTextVi = strengths[0] ? strengths[0].text.vi.toLowerCase() : REPORT_UI.yourStrengths.vi;
  actionPlan.push({
    en: REPORT_UI.strengthAction.en(strengthTextEn),
    vi: REPORT_UI.strengthAction.vi(strengthTextVi),
  });
  const periodEn = ageGroup === "teen" ? REPORT_UI.periodTeen.en : ageGroup === "youngAdult" ? REPORT_UI.periodYoungAdult.en : REPORT_UI.periodAdult.en;
  const periodVi = ageGroup === "teen" ? REPORT_UI.periodTeen.vi : ageGroup === "youngAdult" ? REPORT_UI.periodYoungAdult.vi : REPORT_UI.periodAdult.vi;
  actionPlan.push({
    en: REPORT_UI.retakeAction.en(periodEn),
    vi: REPORT_UI.retakeAction.vi(periodVi),
  });

  return { strengths, growthAreas, careers, actionPlan, topField };
}

if (typeof module !== "undefined") {
  module.exports = { scoreMBTI, scoreDISC, scoreRIASEC, buildCombinedReport };
}
