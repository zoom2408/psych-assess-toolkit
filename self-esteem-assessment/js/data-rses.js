/* =========================================================================
   ROSENBERG SELF-ESTEEM SCALE (RSES) — public domain (Rosenberg, 1965).
   The 10 items below are the original, verbatim published wording — no
   paraphrasing needed since (unlike PSS) this instrument is public domain.

   Item shape: { id, reverse: Boolean, text: {en, vi} }
   - reverse: true → negatively-worded item; reverse-scored so that a
     higher final score always means HIGHER self-esteem.
   Balance: 5 positively-worded + 5 negatively-worded items (the original
   scale's own balance — not something we imposed).

   Answered on Rosenberg's standard 4-point agreement scale:
   Strongly Disagree(1) · Disagree(2) · Agree(3) · Strongly Agree(4).
   Per-item contribution to the 0–3 raw score:
     non-reverse: answer - 1   (SD=0, D=1, A=2, SA=3)
     reverse:     4 - answer   (SD=3, D=2, A=1, SA=0)
   Total raw score range: 0–30 (see scoring.js).

   Bilingual: text/name/summary/etc. fields are { en, vi } objects,
   resolved at render time via L() from shared/i18n.js.
========================================================================= */

const RSES_QUESTIONS = [
  { id: "rs01", reverse: false, text: { en: "On the whole, I am satisfied with myself.", vi: "Nhìn chung, tôi hài lòng với bản thân mình." } },
  { id: "rs02", reverse: true, text: { en: "At times, I think I am no good at all.", vi: "Đôi khi, tôi nghĩ mình chẳng ra gì cả." } },
  { id: "rs03", reverse: false, text: { en: "I feel that I have a number of good qualities.", vi: "Tôi cảm thấy mình có khá nhiều phẩm chất tốt." } },
  { id: "rs04", reverse: false, text: { en: "I am able to do things as well as most other people.", vi: "Tôi có thể làm mọi việc tốt như hầu hết những người khác." } },
  { id: "rs05", reverse: true, text: { en: "I feel I do not have much to be proud of.", vi: "Tôi cảm thấy mình không có nhiều điều để tự hào." } },
  { id: "rs06", reverse: true, text: { en: "I certainly feel useless at times.", vi: "Đôi khi tôi thực sự cảm thấy mình vô dụng." } },
  { id: "rs07", reverse: false, text: { en: "I feel that I'm a person of worth, at least on an equal plane with others.", vi: "Tôi cảm thấy mình là người có giá trị, ít nhất là ngang bằng với người khác." } },
  { id: "rs08", reverse: true, text: { en: "I wish I could have more respect for myself.", vi: "Tôi ước mình có thể tôn trọng bản thân nhiều hơn." } },
  { id: "rs09", reverse: true, text: { en: "All in all, I am inclined to feel that I am a failure.", vi: "Nhìn chung, tôi có xu hướng cảm thấy mình là một người thất bại." } },
  { id: "rs10", reverse: false, text: { en: "I take a positive attitude toward myself.", vi: "Tôi có thái độ tích cực đối với bản thân mình." } },
];

/* Interpretation bands for the raw 0–30 score (standard RSES convention:
   below 15 flags low self-esteem; 15–25 is the typical/healthy range;
   above 25 is a notably high, confident self-view). */
const RSES_LEVELS = {
  low: {
    key: "low",
    name: { en: "Lower Self-Esteem", vi: "Lòng Tự Trọng Thấp" },
    range: "0–14",
    summary: {
      en: "Right now, your answers suggest you're being quite hard on yourself — self-doubt, self-criticism, or a sense of not measuring up show up more often than a sense of self-worth.",
      vi: "Hiện tại, câu trả lời của bạn cho thấy bạn đang khá khắt khe với chính mình — sự nghi ngờ bản thân, tự phê bình, hoặc cảm giác không đủ tốt xuất hiện thường xuyên hơn cảm giác về giá trị bản thân.",
    },
    whatItMeans: {
      en: "A lower score is common and very workable — self-esteem is not a fixed trait, it shifts with circumstances, relationships, and how you talk to yourself. It's also worth noting: this score reflects a snapshot of how you feel right now, not a verdict on your actual worth or abilities.",
      vi: "Điểm số thấp là điều khá phổ biến và hoàn toàn có thể cải thiện — lòng tự trọng không phải là một đặc điểm cố định, nó thay đổi theo hoàn cảnh, các mối quan hệ, và cách bạn tự nói với chính mình. Cũng cần lưu ý: điểm số này chỉ phản ánh cảm nhận của bạn ngay lúc này, không phải là một phán quyết về giá trị hay năng lực thực sự của bạn.",
    },
    tips: {
      en: [
        "Notice your inner critic's exact words for a day — just naming the pattern ('I'm being harsh on myself right now') loosens its grip.",
        "Keep a running list of small things you did well or handled okay, even ordinary ones — self-esteem often rebuilds from evidence, not from willpower.",
        "Watch for all-or-nothing self-talk ('I always fail', 'I'm no good at all') and try restating it more specifically and fairly ('this one thing didn't go well').",
        "If low self-worth is persistent, affecting relationships or daily functioning, or tangled up with low mood, talking to a therapist or counselor is a genuinely effective next step — not a sign of failure.",
      ],
      vi: [
        "Theo dõi lời lẽ chính xác của \"nhà phê bình nội tâm\" trong một ngày — chỉ cần gọi tên khuôn mẫu này ('mình đang khắt khe với bản thân') cũng làm giảm sức ảnh hưởng của nó.",
        "Ghi lại liên tục những điều nhỏ bạn đã làm tốt hoặc xử lý ổn, kể cả những việc bình thường — lòng tự trọng thường được xây lại từ bằng chứng cụ thể, không phải từ ý chí.",
        "Chú ý đến kiểu tự nói chuyện \"tất cả hoặc không gì cả\" ('mình luôn thất bại', 'mình chẳng ra gì cả') và thử diễn đạt lại cụ thể và công bằng hơn ('việc này chưa suôn sẻ').",
        "Nếu cảm giác thiếu giá trị bản thân kéo dài, ảnh hưởng đến các mối quan hệ hoặc sinh hoạt hằng ngày, hoặc đi kèm tâm trạng suy giảm, việc trò chuyện với chuyên gia trị liệu hoặc tư vấn tâm lý là một bước đi thực sự hiệu quả — không phải là dấu hiệu của thất bại.",
      ],
    },
  },
  normal: {
    key: "normal",
    name: { en: "Typical, Healthy Self-Esteem", vi: "Lòng Tự Trọng Bình Thường, Lành Mạnh" },
    range: "15–25",
    summary: {
      en: "Your answers land in the range most people fall into: a generally steady sense of your own worth, alongside normal moments of self-doubt.",
      vi: "Câu trả lời của bạn nằm trong khoảng mà hầu hết mọi người đạt được: một cảm giác nhìn chung ổn định về giá trị bản thân, song song với những khoảnh khắc nghi ngờ bản thân bình thường.",
    },
    whatItMeans: {
      en: "This is the healthy middle ground — confident enough to try, act, and recover from setbacks, while still being realistic and self-critical when it's useful. Self-esteem at this level tends to be resilient, but it isn't immune to being knocked around by a hard week, a big rejection, or a rough patch.",
      vi: "Đây là vùng trung dung lành mạnh — đủ tự tin để thử sức, hành động, và phục hồi sau thất bại, trong khi vẫn thực tế và tự phê bình khi cần thiết. Lòng tự trọng ở mức này thường khá bền vững, nhưng không hoàn toàn miễn nhiễm trước một tuần khó khăn, một lần bị từ chối lớn, hay một giai đoạn chật vật.",
    },
    tips: {
      en: [
        "Notice which situations dent your self-esteem the most (comparison, criticism, failure) — that's useful self-knowledge, not a weakness.",
        "Keep investing in the things that reliably support it: competence in areas you care about, and relationships where you feel genuinely valued.",
        "Practice self-compassion, not just self-confidence — being kind to yourself when things go wrong is what keeps a healthy score healthy under pressure.",
      ],
      vi: [
        "Nhận diện những tình huống làm giảm lòng tự trọng của bạn nhiều nhất (so sánh, chỉ trích, thất bại) — đó là sự hiểu biết bản thân hữu ích, không phải điểm yếu.",
        "Tiếp tục đầu tư vào những điều thực sự nâng đỡ nó: năng lực trong những lĩnh vực bạn quan tâm, và các mối quan hệ mà bạn cảm thấy thực sự được trân trọng.",
        "Thực hành lòng trắc ẩn với bản thân, không chỉ sự tự tin — đối xử tử tế với chính mình khi mọi việc không suôn sẻ chính là điều giữ cho một điểm số lành mạnh vẫn lành mạnh khi gặp áp lực.",
      ],
    },
  },
  high: {
    key: "high",
    name: { en: "High Self-Esteem", vi: "Lòng Tự Trọng Cao" },
    range: "26–30",
    summary: {
      en: "Your answers show a strong, consistent sense of your own worth and capability across almost every statement.",
      vi: "Câu trả lời của bạn cho thấy một cảm giác mạnh mẽ và nhất quán về giá trị và năng lực bản thân trên hầu hết mọi câu hỏi.",
    },
    whatItMeans: {
      en: "A high score is generally a strength: it's linked to resilience, willingness to take reasonable risks, and recovering well from setbacks. The one thing worth checking in with yourself on is whether that confidence stays open to feedback and to others' perspectives — healthy high self-esteem and defensiveness can sometimes look similar from the outside.",
      vi: "Điểm số cao nhìn chung là một thế mạnh: nó gắn liền với khả năng phục hồi, sẵn sàng chấp nhận rủi ro hợp lý, và hồi phục tốt sau thất bại. Điều đáng để tự xem xét là liệu sự tự tin đó có vẫn cởi mở với phản hồi và góc nhìn của người khác hay không — lòng tự trọng cao lành mạnh và sự phòng thủ đôi khi trông khá giống nhau từ bên ngoài.",
    },
    tips: {
      en: [
        "Use your confidence to support others — modeling steady self-worth (without dismissiveness) is genuinely helpful to people who are struggling with theirs.",
        "Stay curious about critical feedback rather than dismissing it outright; strong self-esteem and openness to being wrong aren't in conflict.",
        "Keep checking that your self-worth isn't overly tied to one area (looks, achievement, status) — the most durable version is spread across several sources.",
      ],
      vi: [
        "Sử dụng sự tự tin của bạn để hỗ trợ người khác — làm gương về lòng tự trọng ổn định (mà không xem thường người khác) thực sự hữu ích cho những ai đang chật vật với giá trị bản thân của họ.",
        "Giữ sự tò mò với phản hồi mang tính phê bình thay vì gạt bỏ ngay lập tức; lòng tự trọng mạnh mẽ và sự cởi mở khi mình sai không hề mâu thuẫn với nhau.",
        "Tiếp tục kiểm tra xem giá trị bản thân của bạn có đang phụ thuộc quá nhiều vào một lĩnh vực duy nhất (ngoại hình, thành tích, địa vị) hay không — phiên bản bền vững nhất được trải rộng trên nhiều nguồn khác nhau.",
      ],
    },
  },
};
