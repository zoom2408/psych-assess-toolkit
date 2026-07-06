/* =========================================================================
   PHQ-9 — Patient Health Questionnaire (depression module)
   -------------------------------------------------------------------------
   The PHQ-9 was developed by Drs. Robert L. Spitzer, Janet B. W. Williams,
   Kurt Kroenke and colleagues, with an educational grant from Pfizer Inc.
   No permission is required to reproduce, translate, display or distribute
   (public domain). English item wording below is VERBATIM. Vietnamese
   wording follows the standard published Vietnamese translation as closely
   as possible.

   Scale (0–3): Not at all / Several days / More than half the days /
   Nearly every day. Total 0–27.

   ITEM 9 (id "ph09") asks about thoughts of self-harm. The app gives it
   special handling: any non-zero answer triggers an immediate, gentle
   support card and support resources are pinned to the top of the report.
   Do not remove item 9 — dropping it breaks the validated instrument and
   the scoring cutoffs. Do not weaken its handling either.

   NO Quick/Full split: validated instruments must be used whole.
========================================================================= */

const PHQ_STEM = {
  en: "Over the last 2 weeks, how often have you been bothered by the following problem?",
  vi: "Trong 2 tuần vừa qua, bạn có thường xuyên bị làm phiền bởi vấn đề sau đây không?",
};

const PHQ_QUESTIONS = [
  { id: "ph01", scale: "PHQ", text: { en: "Little interest or pleasure in doing things", vi: "Ít hứng thú hoặc niềm vui khi làm mọi việc" } },
  { id: "ph02", scale: "PHQ", text: { en: "Feeling down, depressed, or hopeless", vi: "Cảm thấy buồn chán, trầm uất, hoặc tuyệt vọng" } },
  { id: "ph03", scale: "PHQ", text: { en: "Trouble falling or staying asleep, or sleeping too much", vi: "Khó đi vào giấc ngủ, khó ngủ thẳng giấc, hoặc ngủ quá nhiều" } },
  { id: "ph04", scale: "PHQ", text: { en: "Feeling tired or having little energy", vi: "Cảm thấy mệt mỏi hoặc thiếu năng lượng" } },
  { id: "ph05", scale: "PHQ", text: { en: "Poor appetite or overeating", vi: "Chán ăn hoặc ăn quá nhiều" } },
  { id: "ph06", scale: "PHQ", text: { en: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down", vi: "Cảm thấy tồi tệ về bản thân — hoặc cảm thấy mình là người thất bại, hay đã làm chính mình hoặc gia đình thất vọng" } },
  { id: "ph07", scale: "PHQ", text: { en: "Trouble concentrating on things, such as reading the newspaper or watching television", vi: "Khó tập trung vào công việc, chẳng hạn như đọc báo hoặc xem truyền hình" } },
  { id: "ph08", scale: "PHQ", text: { en: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual", vi: "Cử động hoặc nói năng chậm chạp đến mức người khác có thể nhận thấy? Hoặc ngược lại — bồn chồn, đứng ngồi không yên đến mức đi lại nhiều hơn bình thường" } },
  { id: "ph09", scale: "PHQ", sensitive: true, text: { en: "Thoughts that you would be better off dead or of hurting yourself in some way", vi: "Có ý nghĩ rằng thà mình chết đi còn hơn, hoặc ý nghĩ tự làm tổn thương bản thân theo một cách nào đó" } },
];

/* Standard PHQ functional-impairment follow-up (asked after the 9 items
   if any answer > 0). Not part of the 0–27 total. */
const PHQ_IMPAIRMENT = {
  id: "phImpair",
  text: {
    en: "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
    vi: "Nếu bạn đã đánh dấu bất kỳ vấn đề nào, những vấn đề này gây khó khăn đến mức nào cho bạn trong công việc, chăm lo việc nhà, hoặc hòa hợp với người khác?",
  },
  options: {
    en: ["Not difficult at all", "Somewhat difficult", "Very difficult", "Extremely difficult"],
    vi: ["Hoàn toàn không khó khăn", "Hơi khó khăn", "Rất khó khăn", "Cực kỳ khó khăn"],
  },
};

/* Severity bands — standard cutoffs (Kroenke, Spitzer & Williams, 2001).
   Guidance wording is educational, not prescriptive treatment advice. */
const PHQ_BANDS = [
  {
    key: "minimal", min: 0, max: 4, pill: "low",
    name: { en: "Minimal depression symptoms", vi: "Triệu chứng trầm cảm tối thiểu" },
    summary: { en: "Your answers suggest few or no depression symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy ít hoặc không có triệu chứng trầm cảm trong hai tuần qua." },
    guidance: { en: "Nothing in this screener suggests action is needed. Keep tending the basics — sleep, movement, connection — and re-take monthly if you like tracking.", vi: "Không có gì trong bài sàng lọc này cho thấy cần hành động. Hãy tiếp tục chăm sóc những điều cơ bản — giấc ngủ, vận động, kết nối — và làm lại hằng tháng nếu bạn muốn theo dõi." },
  },
  {
    key: "mild", min: 5, max: 9, pill: "low",
    name: { en: "Mild depression symptoms", vi: "Triệu chứng trầm cảm nhẹ" },
    summary: { en: "Your answers suggest mild depression symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy triệu chứng trầm cảm ở mức nhẹ trong hai tuần qua." },
    guidance: { en: "Mild scores often improve with self-care: regular sleep, daily movement, time with people who matter, and cutting back on alcohol. Re-take in 2–4 weeks — if the score is rising or this has lasted a while, mention it to a doctor.", vi: "Điểm ở mức nhẹ thường cải thiện nhờ tự chăm sóc: ngủ đều đặn, vận động hằng ngày, dành thời gian với người thân thiết, và giảm rượu bia. Làm lại sau 2–4 tuần — nếu điểm tăng lên hoặc tình trạng đã kéo dài, hãy trao đổi với bác sĩ." },
  },
  {
    key: "moderate", min: 10, max: 14, pill: "moderate",
    name: { en: "Moderate depression symptoms", vi: "Triệu chứng trầm cảm vừa" },
    summary: { en: "Your answers suggest moderate depression symptoms over the past two weeks. A score of 10 or more is the level at which clinicians usually take a closer look.", vi: "Câu trả lời của bạn cho thấy triệu chứng trầm cảm ở mức vừa trong hai tuần qua. Điểm từ 10 trở lên là mức mà các bác sĩ lâm sàng thường xem xét kỹ hơn." },
    guidance: { en: "At this level, talking to a doctor or mental-health professional is a sensible next step — not an overreaction. Effective, well-studied options exist (talking therapies, lifestyle changes, and sometimes medication). Bringing this result to the appointment can help start the conversation.", vi: "Ở mức này, việc trao đổi với bác sĩ hoặc chuyên gia sức khỏe tâm thần là bước tiếp theo hợp lý — không phải phản ứng thái quá. Có những phương pháp hiệu quả đã được nghiên cứu kỹ (trị liệu tâm lý, thay đổi lối sống, và đôi khi là thuốc). Mang kết quả này đến buổi hẹn có thể giúp bắt đầu cuộc trò chuyện." },
  },
  {
    key: "modSevere", min: 15, max: 19, pill: "high",
    name: { en: "Moderately severe depression symptoms", vi: "Triệu chứng trầm cảm khá nặng" },
    summary: { en: "Your answers suggest moderately severe depression symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy triệu chứng trầm cảm ở mức khá nặng trong hai tuần qua." },
    guidance: { en: "Please consider making an appointment with a doctor or mental-health professional soon. Symptoms at this level respond well to treatment, and you don't need to wait for things to get worse to deserve help.", vi: "Vui lòng cân nhắc đặt lịch hẹn sớm với bác sĩ hoặc chuyên gia sức khỏe tâm thần. Triệu chứng ở mức này đáp ứng tốt với điều trị, và bạn không cần đợi mọi thứ tệ hơn mới xứng đáng được giúp đỡ." },
  },
  {
    key: "severe", min: 20, max: 27, pill: "high",
    name: { en: "Severe depression symptoms", vi: "Triệu chứng trầm cảm nặng" },
    summary: { en: "Your answers suggest severe depression symptoms over the past two weeks.", vi: "Câu trả lời của bạn cho thấy triệu chứng trầm cảm ở mức nặng trong hai tuần qua." },
    guidance: { en: "Please reach out to a doctor or mental-health professional promptly — this week if possible. Scores in this range usually mean you're carrying far more than you should have to carry alone, and effective help exists.", vi: "Vui lòng liên hệ ngay với bác sĩ hoặc chuyên gia sức khỏe tâm thần — trong tuần này nếu có thể. Điểm trong khoảng này thường có nghĩa là bạn đang gánh vác nhiều hơn rất nhiều so với những gì bạn đáng phải chịu một mình, và sự giúp đỡ hiệu quả là có thật." },
  },
];

/* ---- Support / crisis resources ----------------------------------------
   Shown: (a) immediately after a non-zero answer on item 9, and (b) at the
   top of the report whenever item 9 > 0 (and at the bottom of every report).
   Wording deliberately avoids promises about confidentiality or about what
   any specific service will or won't do. */
const SUPPORT_RESOURCES = {
  title: { en: "Support is available", vi: "Luôn có sự hỗ trợ dành cho bạn" },
  lead: {
    en: "You answered that you've had thoughts of being better off dead or of hurting yourself. Whatever is behind that answer, you deserve support — and talking to someone about it is a strong next step, not a burden on anyone.",
    vi: "Bạn đã trả lời rằng mình từng có ý nghĩ thà chết đi còn hơn hoặc ý nghĩ tự làm tổn thương bản thân. Dù điều gì đứng sau câu trả lời đó, bạn xứng đáng được hỗ trợ — và nói với ai đó về điều này là một bước đi mạnh mẽ, không phải gánh nặng cho bất kỳ ai." },
  items: {
    en: [
      "If you are in immediate danger or close to acting on these thoughts, contact your local emergency number now (911 in the US, 115 for medical emergencies in Vietnam).",
      "US & Canada: call or text 988 (Suicide & Crisis Lifeline). UK & ROI: Samaritans, 116 123.",
      "Anywhere else: findahelpline.com lists free crisis lines by country, including Vietnam.",
      "Tell one person you trust how you've been feeling — a friend, family member, doctor, or counselor. You don't have to have the right words; showing them this screen is enough to start.",
    ],
    vi: [
      "Nếu bạn đang gặp nguy hiểm tức thời hoặc sắp hành động theo những ý nghĩ này, hãy gọi số khẩn cấp địa phương ngay (115 cấp cứu y tế tại Việt Nam).",
      "Tại Việt Nam: danh bạ các đường dây hỗ trợ miễn phí theo quốc gia có tại findahelpline.com (bao gồm Việt Nam). Tại Mỹ & Canada: gọi hoặc nhắn tin 988.",
      "Hãy nói với một người bạn tin tưởng về cảm giác của mình — bạn bè, người thân, bác sĩ, hoặc chuyên viên tư vấn. Bạn không cần tìm được lời lẽ hoàn hảo; cho họ xem màn hình này là đủ để bắt đầu.",
      "Những ý nghĩ này là triệu chứng có thể điều trị được — chúng không phải sự thật về tương lai của bạn, và rất nhiều người đã vượt qua với sự hỗ trợ phù hợp.",
    ],
  },
  continueBtn: { en: "I've read this — continue", vi: "Tôi đã đọc — tiếp tục" },
};
