/* =========================================================================
   DISC-STYLE BEHAVIORAL ASSESSMENT
   Original items written to measure the four classic behavioral-style
   dimensions popularized by William Moulton Marston's DISC theory
   (public-domain psychological model): Dominance, Influence,
   Steadiness, and Conscientiousness. Independently authored items —
   not reproduced from any publisher's proprietary instrument.

   Format: Likert 1-5 (Strongly Disagree -> Strongly Agree).
   Unlike MBTI's opposing poles, each DISC scale is scored independently
   (a person can be high or low on all four), so items are not paired
   opposites — each simply measures agreement with that style.

   Translatable string fields (text, name, summary, strengths[],
   growthAreas[]) are stored as { en, vi } objects and resolved with L()
   at render time.
========================================================================= */

const DISC_QUESTIONS = [
  // ---------------- DOMINANCE (D) ----------------
  { id: "d01", scale: "D", text: { en: "I like to take charge of a situation when things are unclear or disorganized.", vi: "Tôi thích đứng ra chủ động khi tình huống chưa rõ ràng hoặc thiếu tổ chức." } },
  { id: "d02", scale: "D", text: { en: "I enjoy competition and pushing myself to win or come out on top.", vi: "Tôi thích cạnh tranh và thúc đẩy bản thân để chiến thắng hoặc vượt trội." } },
  { id: "d03", scale: "D", text: { en: "I make decisions quickly and am comfortable taking risks.", vi: "Tôi ra quyết định nhanh chóng và thoải mái khi chấp nhận rủi ro." } },
  { id: "d04", scale: "D", text: { en: "I prefer to focus on results and getting things done over discussing feelings.", vi: "Tôi thích tập trung vào kết quả và hoàn thành công việc hơn là bàn về cảm xúc." } },
  { id: "d05", scale: "D", text: { en: "I'm comfortable challenging people or ideas I disagree with, directly.", vi: "Tôi thoải mái phản bác trực tiếp những người hoặc ý tưởng mà tôi không đồng ý." } },
  { id: "d06", scale: "D", text: { en: "I get impatient with slow processes or excessive discussion before action.", vi: "Tôi mất kiên nhẫn với các quy trình chậm chạp hoặc thảo luận quá nhiều trước khi hành động." } },
  { id: "d07", scale: "D", text: { en: "I naturally step into a leadership role in group settings.", vi: "Tôi tự nhiên đảm nhận vai trò lãnh đạo trong các bối cảnh nhóm." } },

  // ---------------- INFLUENCE (I) ----------------
  { id: "i01", scale: "I", text: { en: "I enjoy meeting new people and am usually the one who starts conversations.", vi: "Tôi thích gặp gỡ người mới và thường là người mở lời bắt chuyện trước." } },
  { id: "i02", scale: "I", text: { en: "I like to persuade and motivate others toward an idea or plan.", vi: "Tôi thích thuyết phục và truyền động lực cho người khác theo một ý tưởng hay kế hoạch." } },
  { id: "i03", scale: "I", text: { en: "I express my emotions openly and enthusiastically.", vi: "Tôi bày tỏ cảm xúc của mình một cách cởi mở và nhiệt tình." } },
  { id: "i04", scale: "I", text: { en: "People often describe me as optimistic and fun to be around.", vi: "Mọi người thường nhận xét tôi là người lạc quan và vui vẻ khi ở cùng." } },
  { id: "i05", scale: "I", text: { en: "I prefer working with and through people rather than working alone.", vi: "Tôi thích làm việc cùng và thông qua người khác hơn là làm việc một mình." } },
  { id: "i06", scale: "I", text: { en: "I like to be recognized publicly for my contributions.", vi: "Tôi thích được công nhận công khai cho những đóng góp của mình." } },
  { id: "i07", scale: "I", text: { en: "I find it easy to build rapport quickly, even with strangers.", vi: "Tôi dễ dàng xây dựng mối quan hệ thân thiện nhanh chóng, kể cả với người lạ." } },

  // ---------------- STEADINESS (S) ----------------
  { id: "s01", scale: "S", text: { en: "I prefer a steady, predictable pace over sudden, high-pressure change.", vi: "Tôi thích nhịp độ ổn định, có thể dự đoán được hơn là thay đổi đột ngột, áp lực cao." } },
  { id: "s02", scale: "S", text: { en: "I'm a patient, good listener when others need support.", vi: "Tôi là người kiên nhẫn, biết lắng nghe khi người khác cần được hỗ trợ." } },
  { id: "s03", scale: "S", text: { en: "I value loyalty and long-term relationships over short-term wins.", vi: "Tôi coi trọng lòng trung thành và các mối quan hệ lâu dài hơn là những thắng lợi ngắn hạn." } },
  { id: "s04", scale: "S", text: { en: "I prefer to work behind the scenes rather than be in the spotlight.", vi: "Tôi thích làm việc phía sau hậu trường hơn là trở thành tâm điểm chú ý." } },
  { id: "s05", scale: "S", text: { en: "I try to keep the peace and avoid unnecessary conflict in a group.", vi: "Tôi cố gắng giữ hòa khí và tránh những xung đột không cần thiết trong nhóm." } },
  { id: "s06", scale: "S", text: { en: "I like knowing what's expected of me and having consistent routines.", vi: "Tôi thích biết rõ những gì được kỳ vọng ở mình và có những thói quen ổn định." } },
  { id: "s07", scale: "S", text: { en: "I'm the person others come to when they need calm, dependable support.", vi: "Tôi là người mà người khác tìm đến khi cần sự hỗ trợ bình tĩnh, đáng tin cậy." } },

  // ---------------- CONSCIENTIOUSNESS (C) ----------------
  { id: "c01", scale: "C", text: { en: "I check my work carefully for accuracy before considering it finished.", vi: "Tôi kiểm tra kỹ công việc của mình để đảm bảo chính xác trước khi coi là hoàn tất." } },
  { id: "c02", scale: "C", text: { en: "I like to follow clear rules, standards, or quality guidelines.", vi: "Tôi thích tuân theo các quy tắc, tiêu chuẩn, hoặc hướng dẫn chất lượng rõ ràng." } },
  { id: "c03", scale: "C", text: { en: "I prefer to gather all the facts and analyze them before deciding.", vi: "Tôi thích thu thập đầy đủ dữ kiện và phân tích chúng trước khi quyết định." } },
  { id: "c04", scale: "C", text: { en: "I hold myself and others to high standards.", vi: "Tôi đặt ra tiêu chuẩn cao cho bản thân và cả người khác." } },
  { id: "c05", scale: "C", text: { en: "I feel uncomfortable when tasks are done sloppily or without a clear process.", vi: "Tôi cảm thấy khó chịu khi công việc được làm cẩu thả hoặc thiếu quy trình rõ ràng." } },
  { id: "c06", scale: "C", text: { en: "I'm cautious about taking risks until I've thought through the downsides.", vi: "Tôi thận trọng khi chấp nhận rủi ro cho đến khi đã suy nghĩ kỹ về những mặt bất lợi." } },
  { id: "c07", scale: "C", text: { en: "I prefer written plans and data over gut instinct when making decisions.", vi: "Khi ra quyết định, tôi thích dựa vào kế hoạch bằng văn bản và dữ liệu hơn là trực giác." } },
];

/* ---------------------------------------------------------------------
   CONCISE-VERSION MARKERS — 2 of 7 items per scale for the "Quick" path
   (~10 minutes total across all three frameworks).
--------------------------------------------------------------------- */
const DISC_CORE_IDS = [
  "d01", "d02",
  "i01", "i02",
  "s01", "s02",
  "c01", "c02",
];
DISC_CORE_IDS.forEach((id) => {
  const q = DISC_QUESTIONS.find((x) => x.id === id);
  if (q) q.core = true;
});
const DISC_QUESTIONS_CORE = DISC_QUESTIONS.filter((q) => q.core);

/* ---------------------------------------------------------------------
   STYLE PROFILES (primary style + all six two-letter blends)
--------------------------------------------------------------------- */
const DISC_STYLES = {
  D: {
    name: { en: "Dominance", vi: "Quyết Đoán (Dominance)" },
    summary: { en: "Direct, results-driven, and decisive. You like to take charge, move fast, and focus on the bottom line.", vi: "Trực tiếp, hướng đến kết quả, và quyết đoán. Bạn thích đứng ra chủ động, hành động nhanh, và tập trung vào kết quả cuối cùng." },
    strengths: [
      { en: "Confident decision-making under pressure", vi: "Ra quyết định tự tin dưới áp lực" },
      { en: "Goal-oriented and results-focused", vi: "Hướng đến mục tiêu và tập trung vào kết quả" },
      { en: "Comfortable taking calculated risks", vi: "Thoải mái khi chấp nhận rủi ro có tính toán" },
      { en: "Natural, direct leadership presence", vi: "Sự hiện diện lãnh đạo tự nhiên, trực tiếp" },
    ],
    growthAreas: [
      { en: "Can come across as blunt or impatient", vi: "Có thể bị nhìn nhận là thẳng thừng hoặc thiếu kiên nhẫn" },
      { en: "May steamroll quieter voices in a group", vi: "Có thể lấn át những ý kiến trầm lặng hơn trong nhóm" },
      { en: "Can undervalue process and detail", vi: "Có thể xem nhẹ quy trình và chi tiết" },
      { en: "Might struggle to slow down and listen", vi: "Có thể gặp khó khăn khi cần chậm lại để lắng nghe" },
    ],
  },
  I: {
    name: { en: "Influence", vi: "Ảnh Hưởng (Influence)" },
    summary: { en: "Enthusiastic, sociable, and persuasive. You energize the people around you and thrive on connection and recognition.", vi: "Nhiệt huyết, hòa đồng, và thuyết phục. Bạn truyền năng lượng cho những người xung quanh và phát huy tốt nhờ sự kết nối và được công nhận." },
    strengths: [
      { en: "Excellent at building rapport and relationships", vi: "Xuất sắc trong việc xây dựng mối quan hệ" },
      { en: "Persuasive, engaging communicator", vi: "Giao tiếp thuyết phục và cuốn hút" },
      { en: "Brings energy and optimism to a team", vi: "Mang lại năng lượng và sự lạc quan cho nhóm" },
      { en: "Comfortable in the spotlight", vi: "Thoải mái khi trở thành tâm điểm chú ý" },
    ],
    growthAreas: [
      { en: "Can lose focus on details or follow-through", vi: "Có thể mất tập trung vào chi tiết hoặc việc theo đuổi đến cùng" },
      { en: "May avoid difficult, unpopular conversations", vi: "Có thể né tránh những cuộc trò chuyện khó khăn, không được ưa chuộng" },
      { en: "Can overpromise in the moment", vi: "Có thể hứa hẹn quá mức trong lúc cao hứng" },
      { en: "Might need external validation to stay motivated", vi: "Có thể cần sự công nhận từ bên ngoài để duy trì động lực" },
    ],
  },
  S: {
    name: { en: "Steadiness", vi: "Ổn Định (Steadiness)" },
    summary: { en: "Calm, dependable, and supportive. You value stability, loyalty, and harmonious, cooperative relationships.", vi: "Bình tĩnh, đáng tin cậy, và biết hỗ trợ. Bạn coi trọng sự ổn định, lòng trung thành, và các mối quan hệ hòa hợp, hợp tác." },
    strengths: [
      { en: "Highly dependable and consistent", vi: "Rất đáng tin cậy và nhất quán" },
      { en: "Patient, empathetic listener", vi: "Kiên nhẫn và biết lắng nghe với sự đồng cảm" },
      { en: "Strong team player who supports others", vi: "Thành viên nhóm tốt, luôn hỗ trợ người khác" },
      { en: "Calm and steady under pressure", vi: "Bình tĩnh và vững vàng dưới áp lực" },
    ],
    growthAreas: [
      { en: "Can resist necessary change", vi: "Có thể chống lại những thay đổi cần thiết" },
      { en: "May avoid conflict even when it's needed", vi: "Có thể né tránh xung đột ngay cả khi cần thiết" },
      { en: "Can struggle to assert your own needs", vi: "Có thể gặp khó khăn khi cần khẳng định nhu cầu của bản thân" },
      { en: "Might take on too much to keep others comfortable", vi: "Có thể ôm đồm quá nhiều để giữ cho người khác thoải mái" },
    ],
  },
  C: {
    name: { en: "Conscientiousness", vi: "Tận Tâm (Conscientiousness)" },
    summary: { en: "Careful, analytical, and quality-focused. You value accuracy, structure, and getting things right.", vi: "Cẩn trọng, có tư duy phân tích, và chú trọng chất lượng. Bạn coi trọng sự chính xác, cấu trúc, và làm mọi việc đúng đắn." },
    strengths: [
      { en: "High attention to detail and accuracy", vi: "Chú ý cao đến chi tiết và độ chính xác" },
      { en: "Strong analytical and planning skills", vi: "Kỹ năng phân tích và lập kế hoạch vững vàng" },
      { en: "Sets and maintains high standards", vi: "Đặt ra và duy trì tiêu chuẩn cao" },
      { en: "Thoughtful, careful decision-making", vi: "Ra quyết định thấu đáo, cẩn trọng" },
    ],
    growthAreas: [
      { en: "Can be overly critical or perfectionistic", vi: "Có thể quá khắt khe hoặc cầu toàn" },
      { en: "May get stuck overanalyzing instead of acting", vi: "Có thể bị mắc kẹt trong việc phân tích quá mức thay vì hành động" },
      { en: "Can come across as distant or overly reserved", vi: "Có thể bị nhìn nhận là xa cách hoặc quá dè dặt" },
      { en: "Might resist ideas that lack sufficient data", vi: "Có thể phản đối những ý tưởng thiếu đủ dữ liệu" },
    ],
  },
};

if (typeof module !== "undefined") module.exports = { DISC_QUESTIONS, DISC_QUESTIONS_CORE, DISC_STYLES };
