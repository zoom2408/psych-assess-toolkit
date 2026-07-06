/* =========================================================================
   PERCEIVED STRESS SECTION (PSS-inspired — original items)
   Measures how unpredictable, uncontrollable, and overloaded life has
   felt over the past month. Inspired by Cohen's Perceived Stress Scale
   construct; items are originally written, not reproductions.

   Item shape: { id, scale: "PSS", reverse: Boolean, text: {en, vi} }
   - reverse: true  → item describes feeling in-control / on top of things;
     it is reverse-scored (answering "Very Often" LOWERS the stress score).
   Answered on a frequency scale: Never … Very Often (past month).
   Balance rule: equal counts of reverse and non-reverse items, in both
   the full bank and the core (Quick) subset.

   Bilingual: text/name/summary/etc. fields are { en, vi } objects,
   resolved at render time via L() from lang.js.
========================================================================= */

const PSS_QUESTIONS = [
  // --- Stress-keyed (reverse: false) ---
  { id: "ps01", scale: "PSS", reverse: false, text: { en: "In the last month, how often have you felt that things were piling up faster than you could deal with them?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy mọi việc dồn dập nhanh hơn khả năng bạn xử lý không?" } },
  { id: "ps02", scale: "PSS", reverse: false, text: { en: "In the last month, how often have you been upset because something happened that you didn't see coming?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy bực bội vì có chuyện xảy ra ngoài dự đoán của mình không?" } },
  { id: "ps03", scale: "PSS", reverse: false, text: { en: "In the last month, how often have you felt tense or on edge for much of the day?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy căng thẳng, bồn chồn trong phần lớn thời gian của ngày không?" } },
  { id: "ps04", scale: "PSS", reverse: false, text: { en: "In the last month, how often have you felt that important parts of your life were outside your control?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy những phần quan trọng trong cuộc sống của mình nằm ngoài tầm kiểm soát không?" } },
  { id: "ps05", scale: "PSS", reverse: false, text: { en: "In the last month, how often have small annoyances felt harder to shake off than they should?", vi: "Trong tháng vừa qua, những phiền toái nhỏ có thường khiến bạn khó bỏ qua hơn mức bình thường không?" } },
  { id: "ps06", scale: "PSS", reverse: false, text: { en: "In the last month, how often have you had trouble winding down, even when you finally had free time?", vi: "Trong tháng vừa qua, bạn có thường gặp khó khăn khi thư giãn, ngay cả lúc cuối cùng cũng có thời gian rảnh không?" } },
  { id: "ps07", scale: "PSS", reverse: false, text: { en: "In the last month, how often have you felt overwhelmed by everything you were expected to handle?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy quá tải trước tất cả những việc mình phải lo liệu không?" } },
  // --- Control/coping-keyed (reverse: true) ---
  { id: "ps08", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you felt confident about your ability to handle your personal problems?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy tự tin vào khả năng xử lý các vấn đề cá nhân của mình không?" } },
  { id: "ps09", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you felt that things were generally going your way?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy mọi việc nhìn chung diễn ra theo ý mình không?" } },
  { id: "ps10", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you been able to stay calm when something stressful came up?", vi: "Trong tháng vừa qua, bạn có thường giữ được bình tĩnh khi có chuyện căng thẳng xảy đến không?" } },
  { id: "ps11", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you felt on top of your responsibilities?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy làm chủ được các trách nhiệm của mình không?" } },
  { id: "ps12", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you been able to control the things that irritate you?", vi: "Trong tháng vừa qua, bạn có thường kiểm soát được những điều khiến mình khó chịu không?" } },
  { id: "ps13", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you ended the day feeling that you managed your time well?", vi: "Trong tháng vừa qua, bạn có thường kết thúc ngày với cảm giác đã quản lý thời gian tốt không?" } },
  { id: "ps14", scale: "PSS", reverse: true, text: { en: "In the last month, how often have you felt able to recover quickly after something went wrong?", vi: "Trong tháng vừa qua, bạn có thường cảm thấy hồi phục nhanh sau khi có chuyện không suôn sẻ không?" } },
];

/* Interpretation bands for the normalized 0–100 perceived-stress score. */
const PSS_LEVELS = {
  low: {
    key: "low",
    name: { en: "Low Perceived Stress", vi: "Mức Căng Thẳng Cảm Nhận Thấp" },
    range: "0–33",
    summary: {
      en: "Over the past month, life has mostly felt manageable and predictable to you. You generally feel in control of your responsibilities and able to recover when things go wrong.",
      vi: "Trong tháng qua, cuộc sống với bạn phần lớn cảm thấy có thể kiểm soát và dự đoán được. Bạn nhìn chung cảm thấy làm chủ được trách nhiệm của mình và có thể hồi phục khi có chuyện không suôn sẻ.",
    },
    whatItMeans: {
      en: "A low score doesn't mean zero stress — it means the demands you face and your sense of control over them are roughly in balance right now. This is a good moment to invest in the habits and relationships that keep it that way.",
      vi: "Điểm số thấp không có nghĩa là không có căng thẳng — nó nghĩa là những đòi hỏi bạn đối mặt và cảm giác kiểm soát của bạn đang tương đối cân bằng lúc này. Đây là thời điểm tốt để đầu tư vào những thói quen và mối quan hệ giúp duy trì sự cân bằng đó.",
    },
    tips: {
      en: [
        "Bank your resilience: keep up the routines (sleep, movement, downtime) that are working — they're easiest to maintain before you need them.",
        "Notice your early warning signs of overload now, while calm, so you can spot them sooner next time demands spike.",
        "Consider supporting someone around you who is under more strain — helping others is itself protective.",
      ],
      vi: [
        "Tích lũy sức bền: duy trì những thói quen đang hiệu quả (giấc ngủ, vận động, thời gian nghỉ) — chúng dễ giữ nhất khi bạn chưa thực sự cần đến.",
        "Nhận diện các dấu hiệu cảnh báo sớm của quá tải ngay từ bây giờ, lúc còn bình tĩnh, để nhận ra chúng nhanh hơn khi áp lực tăng lên lần sau.",
        "Cân nhắc hỗ trợ ai đó xung quanh đang chịu áp lực nhiều hơn — giúp người khác cũng là cách bảo vệ chính mình.",
      ],
    },
  },
  moderate: {
    key: "moderate",
    name: { en: "Moderate Perceived Stress", vi: "Mức Căng Thẳng Cảm Nhận Vừa Phải" },
    range: "34–66",
    summary: {
      en: "Over the past month, you've felt a real mix: some stretches of feeling on top of things, and other stretches where demands felt unpredictable or hard to control.",
      vi: "Trong tháng qua, bạn đã trải qua sự pha trộn thực sự: có những giai đoạn cảm thấy làm chủ được mọi việc, và những giai đoạn khác mà các đòi hỏi trở nên khó đoán hoặc khó kiểm soát.",
    },
    whatItMeans: {
      en: "Moderate perceived stress is very common and often workable — but it's worth acting on, because it tends to drift upward when demands rise or recovery time shrinks. Your coping style and support results below show where you have the most leverage.",
      vi: "Căng thẳng cảm nhận ở mức vừa phải rất phổ biến và thường có thể xử lý được — nhưng đáng để hành động, vì nó có xu hướng tăng dần khi đòi hỏi tăng lên hoặc thời gian hồi phục bị thu hẹp. Kết quả về phong cách ứng phó và hỗ trợ bên dưới sẽ cho thấy bạn có thể tác động mạnh nhất ở đâu.",
    },
    tips: {
      en: [
        "Identify your single biggest recurring stressor and apply one concrete problem-solving step to it this week.",
        "Protect at least one genuinely restorative block of time per day, even if short — recovery is what keeps moderate stress from becoming high stress.",
        "Say the stress out loud to someone you trust; naming it accurately reduces its intensity and often surfaces practical help.",
      ],
      vi: [
        "Xác định một tác nhân gây căng thẳng lặp lại lớn nhất và áp dụng một bước giải quyết vấn đề cụ thể cho nó trong tuần này.",
        "Bảo vệ ít nhất một khoảng thời gian thực sự phục hồi mỗi ngày, dù ngắn — sự phục hồi chính là điều giữ căng thẳng vừa phải không biến thành căng thẳng cao.",
        "Nói to căng thẳng của mình với người bạn tin tưởng; gọi tên nó chính xác giúp giảm cường độ và thường mở ra sự giúp đỡ thiết thực.",
      ],
    },
  },
  high: {
    key: "high",
    name: { en: "High Perceived Stress", vi: "Mức Căng Thẳng Cảm Nhận Cao" },
    range: "67–100",
    summary: {
      en: "Over the past month, life has frequently felt overloaded, unpredictable, or out of your control, and it has likely been hard to properly recover between demands.",
      vi: "Trong tháng qua, cuộc sống thường xuyên cảm thấy quá tải, khó đoán, hoặc nằm ngoài tầm kiểm soát của bạn, và có lẽ rất khó để phục hồi đầy đủ giữa các đòi hỏi.",
    },
    whatItMeans: {
      en: "A high score is a signal worth taking seriously — sustained high perceived stress affects sleep, mood, concentration, and physical health. It is also very responsive to change: reducing even one or two sources of load, or adding one reliable source of support, can shift it meaningfully.",
      vi: "Điểm số cao là một tín hiệu đáng để nghiêm túc lưu tâm — căng thẳng cảm nhận cao kéo dài ảnh hưởng đến giấc ngủ, tâm trạng, sự tập trung và sức khỏe thể chất. Nó cũng phản ứng rất tốt với thay đổi: chỉ cần giảm một hoặc hai nguồn tải, hoặc thêm một nguồn hỗ trợ đáng tin cậy, cũng có thể tạo ra khác biệt đáng kể.",
    },
    tips: {
      en: [
        "Triage: list your current demands and mark what can be dropped, delayed, shrunk, or handed to someone else — then actually drop one this week.",
        "Prioritize sleep and basic routines before any productivity fixes; a stressed system needs recovery first.",
        "Tell at least one specific person how loaded you are and what would help. If stress feels unmanageable or is affecting your health, talking to a doctor or mental-health professional is a strong, practical next step — not a last resort.",
      ],
      vi: [
        "Phân loại ưu tiên: liệt kê các đòi hỏi hiện tại và đánh dấu điều gì có thể bỏ bớt, hoãn lại, thu nhỏ, hoặc giao cho người khác — rồi thực sự bỏ một việc trong tuần này.",
        "Ưu tiên giấc ngủ và các thói quen cơ bản trước bất kỳ giải pháp năng suất nào; một hệ thống đang căng thẳng cần được phục hồi trước tiên.",
        "Nói cụ thể với ít nhất một người về mức độ quá tải của bạn và điều gì có thể giúp ích. Nếu căng thẳng cảm thấy không thể kiểm soát hoặc đang ảnh hưởng đến sức khỏe, việc trò chuyện với bác sĩ hoặc chuyên gia sức khỏe tâm thần là một bước đi thiết thực và mạnh mẽ — không phải là lựa chọn cuối cùng.",
      ],
    },
  },
};

/* ---- Quick-version subset (3 stress-keyed + 3 reverse) ---- */
const PSS_CORE_IDS = ["ps01", "ps04", "ps07", "ps08", "ps09", "ps11"];
PSS_QUESTIONS.forEach((q) => { q.core = PSS_CORE_IDS.includes(q.id); });
const PSS_QUESTIONS_CORE = PSS_QUESTIONS.filter((q) => q.core);
