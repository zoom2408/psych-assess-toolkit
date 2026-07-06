/* =========================================================================
   GAD-7 — Generalized Anxiety Disorder scale
   -------------------------------------------------------------------------
   Developed by Drs. Robert L. Spitzer, Janet B. W. Williams, Kurt Kroenke
   and colleagues, with an educational grant from Pfizer Inc. No permission
   is required to reproduce, translate, display or distribute (public
   domain). English item wording below is VERBATIM.

   Scale (0–3): Not at all / Several days / More than half the days /
   Nearly every day. Total 0–21. Standard cutoffs: 5 / 10 / 15
   (Spitzer et al., 2006). NO Quick/Full split — used whole.
========================================================================= */

const GAD_STEM = {
  en: "Over the last 2 weeks, how often have you been bothered by the following problem?",
  vi: "Trong 2 tuần vừa qua, bạn có thường xuyên bị làm phiền bởi vấn đề sau đây không?",
};

const GAD_QUESTIONS = [
  { id: "ga01", scale: "GAD", text: { en: "Feeling nervous, anxious, or on edge", vi: "Cảm thấy bồn chồn, lo âu, hoặc căng thẳng" } },
  { id: "ga02", scale: "GAD", text: { en: "Not being able to stop or control worrying", vi: "Không thể ngừng lo lắng hoặc kiểm soát được sự lo lắng" } },
  { id: "ga03", scale: "GAD", text: { en: "Worrying too much about different things", vi: "Lo lắng quá nhiều về nhiều chuyện khác nhau" } },
  { id: "ga04", scale: "GAD", text: { en: "Trouble relaxing", vi: "Khó thư giãn" } },
  { id: "ga05", scale: "GAD", text: { en: "Being so restless that it is hard to sit still", vi: "Bồn chồn đến mức khó ngồi yên" } },
  { id: "ga06", scale: "GAD", text: { en: "Becoming easily annoyed or irritable", vi: "Dễ bực bội hoặc cáu gắt" } },
  { id: "ga07", scale: "GAD", text: { en: "Feeling afraid, as if something awful might happen", vi: "Cảm thấy sợ hãi, như thể điều gì đó khủng khiếp sắp xảy ra" } },
];

const GAD_BANDS = [
  {
    key: "minimal", min: 0, max: 4, pill: "low",
    name: { en: "Minimal anxiety symptoms", vi: "Triệu chứng lo âu tối thiểu" },
    summary: { en: "Your answers suggest few or no anxiety symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy ít hoặc không có triệu chứng lo âu trong hai tuần qua." },
    guidance: { en: "Nothing here suggests action is needed. Everyday worry that comes and goes is normal — this screener looks for worry that is persistent and hard to control.", vi: "Không có gì ở đây cho thấy cần hành động. Lo lắng thường nhật đến rồi đi là bình thường — bài sàng lọc này tìm kiếm sự lo lắng dai dẳng và khó kiểm soát." },
  },
  {
    key: "mild", min: 5, max: 9, pill: "low",
    name: { en: "Mild anxiety symptoms", vi: "Triệu chứng lo âu nhẹ" },
    summary: { en: "Your answers suggest mild anxiety symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy triệu chứng lo âu ở mức nhẹ trong hai tuần qua." },
    guidance: { en: "Mild anxiety often responds to basics: steady sleep, regular movement, less caffeine, and brief daily wind-down practices (slow breathing, a walk without your phone). Re-take in 2–4 weeks to see the trend.", vi: "Lo âu nhẹ thường đáp ứng với những điều cơ bản: ngủ đều, vận động thường xuyên, giảm caffeine, và các thực hành thư giãn ngắn mỗi ngày (thở chậm, đi bộ không mang điện thoại). Làm lại sau 2–4 tuần để thấy xu hướng." },
  },
  {
    key: "moderate", min: 10, max: 14, pill: "moderate",
    name: { en: "Moderate anxiety symptoms", vi: "Triệu chứng lo âu vừa" },
    summary: { en: "Your answers suggest moderate anxiety symptoms over the past two weeks. A score of 10 or more is the level at which clinicians usually take a closer look.", vi: "Câu trả lời của bạn cho thấy triệu chứng lo âu ở mức vừa trong hai tuần qua. Điểm từ 10 trở lên là mức mà các bác sĩ lâm sàng thường xem xét kỹ hơn." },
    guidance: { en: "Consider talking to a doctor or mental-health professional. Anxiety at this level is very treatable — cognitive-behavioral approaches in particular have strong evidence — and an assessment can also rule out physical contributors (thyroid, caffeine, medications).", vi: "Hãy cân nhắc trao đổi với bác sĩ hoặc chuyên gia sức khỏe tâm thần. Lo âu ở mức này rất có thể điều trị được — đặc biệt các liệu pháp nhận thức-hành vi có bằng chứng mạnh — và việc thăm khám cũng giúp loại trừ các yếu tố thể chất (tuyến giáp, caffeine, thuốc đang dùng)." },
  },
  {
    key: "severe", min: 15, max: 21, pill: "high",
    name: { en: "Severe anxiety symptoms", vi: "Triệu chứng lo âu nặng" },
    summary: { en: "Your answers suggest severe anxiety symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy triệu chứng lo âu ở mức nặng trong hai tuần qua." },
    guidance: { en: "Please consider seeing a doctor or mental-health professional soon. Anxiety this persistent is exhausting to live with and responds well to treatment — you don't have to white-knuckle it.", vi: "Vui lòng cân nhắc gặp bác sĩ hoặc chuyên gia sức khỏe tâm thần sớm. Lo âu dai dẳng đến mức này rất mệt mỏi khi phải sống cùng và đáp ứng tốt với điều trị — bạn không cần phải gồng mình chịu đựng." },
  },
];
