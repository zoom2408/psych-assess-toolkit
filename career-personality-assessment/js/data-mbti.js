/* =========================================================================
   MBTI-STYLE PERSONALITY TYPE INDICATOR
   Original items written to measure the four classic Jungian-typology
   dichotomies (Extraversion/Introversion, Sensing/Intuition,
   Thinking/Feeling, Judging/Perceiving). This is an independently written
   instrument inspired by Jungian typology (the general public-domain
   psychological theory), not a reproduction of any publisher's
   proprietary test items.

   Each item has:
     id        - unique string id
     dichotomy - "EI" | "SN" | "TF" | "JP"
     pole      - which letter an "Agree" response counts toward
     text      - the statement shown to the user (Likert 1-5), as
                 { en, vi } for bilingual display via L()

   Scoring: for each dichotomy, sum the weighted agreement score toward
   each pole (see js/scoring.js). The pole with the higher total wins,
   and the % strength = winning pole score / total dichotomy score.
========================================================================= */

const MBTI_QUESTIONS = [
  // ---------------- EXTRAVERSION (E) vs INTROVERSION (I) ----------------
  { id: "ei01", dichotomy: "EI", pole: "E", text: { en: "Being around a group of people for a few hours leaves me feeling energized rather than drained.", vi: "Ở bên một nhóm người trong vài giờ khiến tôi cảm thấy tràn đầy năng lượng hơn là kiệt sức." } },
  { id: "ei02", dichotomy: "EI", pole: "E", text: { en: "I do my best thinking out loud, talking things through with other people.", vi: "Tôi suy nghĩ tốt nhất khi nói to, trao đổi vấn đề cùng người khác." } },
  { id: "ei03", dichotomy: "EI", pole: "E", text: { en: "I usually speak up quickly in group discussions or classes.", vi: "Tôi thường phát biểu nhanh chóng trong các buổi thảo luận nhóm hoặc lớp học." } },
  { id: "ei04", dichotomy: "EI", pole: "E", text: { en: "I'd rather spend a free Saturday out with friends than staying in alone.", vi: "Tôi thích dành một ngày thứ Bảy rảnh rỗi đi chơi cùng bạn bè hơn là ở nhà một mình." } },
  { id: "ei05", dichotomy: "EI", pole: "E", text: { en: "Meeting new people feels exciting to me, not draining.", vi: "Gặp gỡ người mới khiến tôi thấy hào hứng, chứ không mệt mỏi." } },
  { id: "ei06", dichotomy: "EI", pole: "E", text: { en: "I tend to have a wide circle of friends and acquaintances.", vi: "Tôi có xu hướng có một vòng bạn bè và người quen rộng rãi." } },
  { id: "ei07", dichotomy: "EI", pole: "E", text: { en: "In a new situation, I jump in and start interacting before I fully understand it.", vi: "Trong tình huống mới, tôi nhảy vào tương tác ngay trước khi hiểu rõ mọi thứ." } },
  { id: "ei08", dichotomy: "EI", pole: "E", text: { en: "I find it easy to make small talk with strangers.", vi: "Tôi dễ dàng bắt chuyện xã giao với người lạ." } },
  { id: "ei09", dichotomy: "EI", pole: "E", text: { en: "Group projects and team activities usually energize me.", vi: "Các dự án nhóm và hoạt động tập thể thường tiếp thêm năng lượng cho tôi." } },
  { id: "ei10", dichotomy: "EI", pole: "I", text: { en: "After a busy social event, I need quiet time alone to recharge.", vi: "Sau một sự kiện giao lưu bận rộn, tôi cần thời gian yên tĩnh một mình để nạp lại năng lượng." } },
  { id: "ei11", dichotomy: "EI", pole: "I", text: { en: "I prefer to think things through privately before sharing my opinion.", vi: "Tôi thích suy nghĩ kỹ một mình trước khi chia sẻ ý kiến." } },
  { id: "ei12", dichotomy: "EI", pole: "I", text: { en: "I'd rather have a few close friends than a large group of acquaintances.", vi: "Tôi thích có vài người bạn thân hơn là một nhóm quen biết rộng." } },
  { id: "ei13", dichotomy: "EI", pole: "I", text: { en: "Working alone on a task usually feels more comfortable to me than working in a group.", vi: "Làm việc một mình thường khiến tôi thoải mái hơn là làm việc theo nhóm." } },
  { id: "ei14", dichotomy: "EI", pole: "I", text: { en: "I often rehearse what I'm going to say before saying it, especially in groups.", vi: "Tôi thường tập trước những gì mình sẽ nói, đặc biệt là khi ở trong nhóm." } },
  { id: "ei15", dichotomy: "EI", pole: "I", text: { en: "Large parties or crowded events tend to drain my energy after a while.", vi: "Các bữa tiệc lớn hoặc sự kiện đông người thường khiến tôi mất năng lượng sau một thời gian." } },
  { id: "ei16", dichotomy: "EI", pole: "I", text: { en: "I'm seen as quieter or more reserved than most people I know.", vi: "Tôi được xem là trầm tính hoặc dè dặt hơn phần lớn những người tôi biết." } },
  { id: "ei17", dichotomy: "EI", pole: "I", text: { en: "I do my best work when I have uninterrupted, quiet time to focus alone.", vi: "Tôi làm việc tốt nhất khi có thời gian yên tĩnh, không bị gián đoạn để tập trung một mình." } },
  { id: "ei18", dichotomy: "EI", pole: "I", text: { en: "I'd rather text or write than make a phone call or speak in person.", vi: "Tôi thích nhắn tin hoặc viết hơn là gọi điện hay nói chuyện trực tiếp." } },

  // ---------------- SENSING (S) vs INTUITION (N) ----------------
  { id: "sn01", dichotomy: "SN", pole: "S", text: { en: "I trust concrete facts and past experience more than hunches or theories.", vi: "Tôi tin vào các sự kiện cụ thể và kinh nghiệm quá khứ hơn là linh cảm hay lý thuyết." } },
  { id: "sn02", dichotomy: "SN", pole: "S", text: { en: "I prefer step-by-step instructions over figuring things out on my own.", vi: "Tôi thích hướng dẫn từng bước hơn là tự mày mò tìm hiểu." } },
  { id: "sn03", dichotomy: "SN", pole: "S", text: { en: "I pay close attention to details that other people often miss.", vi: "Tôi để ý kỹ đến những chi tiết mà người khác thường bỏ sót." } },
  { id: "sn04", dichotomy: "SN", pole: "S", text: { en: "I'd rather learn a practical, hands-on skill than study abstract theory.", vi: "Tôi thích học một kỹ năng thực hành, cụ thể hơn là nghiên cứu lý thuyết trừu tượng." } },
  { id: "sn05", dichotomy: "SN", pole: "S", text: { en: "I focus on what is real and immediate rather than future possibilities.", vi: "Tôi tập trung vào những gì thực tế và trước mắt hơn là các khả năng trong tương lai." } },
  { id: "sn06", dichotomy: "SN", pole: "S", text: { en: "I like tasks with clear, proven methods rather than open-ended experimentation.", vi: "Tôi thích những nhiệm vụ có phương pháp rõ ràng, đã được kiểm chứng hơn là thử nghiệm mở." } },
  { id: "sn07", dichotomy: "SN", pole: "S", text: { en: "I describe things in a literal, specific way rather than using metaphors.", vi: "Tôi mô tả sự việc theo cách cụ thể, đúng nghĩa đen hơn là dùng ẩn dụ." } },
  { id: "sn08", dichotomy: "SN", pole: "S", text: { en: "I'm more comfortable with routines and established procedures than with constant change.", vi: "Tôi thoải mái hơn với thói quen và quy trình đã thiết lập sẵn hơn là thay đổi liên tục." } },
  { id: "sn09", dichotomy: "SN", pole: "S", text: { en: "When solving a problem, I look at what has worked before.", vi: "Khi giải quyết vấn đề, tôi nhìn vào những gì đã từng hiệu quả trước đây." } },
  { id: "sn10", dichotomy: "SN", pole: "N", text: { en: "I enjoy exploring abstract ideas and theories, even without an immediate practical use.", vi: "Tôi thích khám phá các ý tưởng và lý thuyết trừu tượng, ngay cả khi chưa có ứng dụng thực tế ngay lập tức." } },
  { id: "sn11", dichotomy: "SN", pole: "N", text: { en: "I often notice patterns and connections that aren't obvious to others.", vi: "Tôi thường nhận ra các quy luật và mối liên hệ mà người khác không dễ thấy." } },
  { id: "sn12", dichotomy: "SN", pole: "N", text: { en: "I get more excited about future possibilities than about the present reality.", vi: "Tôi hào hứng với những khả năng trong tương lai hơn là thực tại hiện tại." } },
  { id: "sn13", dichotomy: "SN", pole: "N", text: { en: "I enjoy brainstorming new, unconventional ways to do things.", vi: "Tôi thích động não tìm ra những cách làm mới, khác thường." } },
  { id: "sn14", dichotomy: "SN", pole: "N", text: { en: "I'd rather invent a new method than follow an existing one.", vi: "Tôi thích sáng tạo ra một phương pháp mới hơn là làm theo phương pháp sẵn có." } },
  { id: "sn15", dichotomy: "SN", pole: "N", text: { en: "I frequently think about big-picture meaning rather than small details.", vi: "Tôi thường nghĩ về ý nghĩa tổng thể hơn là những chi tiết nhỏ." } },
  { id: "sn16", dichotomy: "SN", pole: "N", text: { en: "My imagination is one of my strongest traits.", vi: "Trí tưởng tượng là một trong những điểm mạnh nhất của tôi." } },
  { id: "sn17", dichotomy: "SN", pole: "N", text: { en: "I get bored quickly with repetitive tasks that don't require new thinking.", vi: "Tôi nhanh chán với các công việc lặp đi lặp lại không đòi hỏi tư duy mới." } },
  { id: "sn18", dichotomy: "SN", pole: "N", text: { en: "I enjoy speculating about how things could be, not just how they are.", vi: "Tôi thích suy ngẫm về việc mọi thứ có thể như thế nào, chứ không chỉ hiện đang ra sao." } },

  // ---------------- THINKING (T) vs FEELING (F) ----------------
  { id: "tf01", dichotomy: "TF", pole: "T", text: { en: "When making decisions, logic and consistency matter more to me than personal feelings.", vi: "Khi ra quyết định, tính logic và nhất quán quan trọng với tôi hơn là cảm xúc cá nhân." } },
  { id: "tf02", dichotomy: "TF", pole: "T", text: { en: "I'm comfortable giving direct, honest feedback even if it might upset someone.", vi: "Tôi thoải mái đưa ra phản hồi thẳng thắn, trung thực dù có thể khiến ai đó không vui." } },
  { id: "tf03", dichotomy: "TF", pole: "T", text: { en: "I evaluate arguments mainly on whether they are logically sound.", vi: "Tôi đánh giá các lập luận chủ yếu dựa trên việc chúng có hợp lý về mặt logic hay không." } },
  { id: "tf04", dichotomy: "TF", pole: "T", text: { en: "I tend to stay calm and objective during conflicts rather than getting emotionally caught up.", vi: "Tôi có xu hướng giữ bình tĩnh và khách quan trong xung đột thay vì bị cuốn theo cảm xúc." } },
  { id: "tf05", dichotomy: "TF", pole: "T", text: { en: "People sometimes describe me as more head-driven than heart-driven.", vi: "Mọi người đôi khi nhận xét tôi thiên về lý trí hơn là cảm xúc." } },
  { id: "tf06", dichotomy: "TF", pole: "T", text: { en: "I believe fairness means applying the same rules to everyone, regardless of circumstances.", vi: "Tôi tin rằng công bằng nghĩa là áp dụng cùng một quy tắc cho tất cả mọi người, bất kể hoàn cảnh." } },
  { id: "tf07", dichotomy: "TF", pole: "T", text: { en: "I find it easy to point out flaws in an idea, even a popular one.", vi: "Tôi dễ dàng chỉ ra những điểm thiếu sót trong một ý tưởng, kể cả ý tưởng được nhiều người ủng hộ." } },
  { id: "tf08", dichotomy: "TF", pole: "T", text: { en: "I prioritize being right over being liked in most situations.", vi: "Trong hầu hết tình huống, tôi ưu tiên việc đúng đắn hơn là được yêu thích." } },
  { id: "tf09", dichotomy: "TF", pole: "T", text: { en: "I make decisions by weighing pros and cons rather than considering how people will feel.", vi: "Tôi ra quyết định bằng cách cân nhắc ưu nhược điểm hơn là nghĩ đến cảm xúc của người khác." } },
  { id: "tf10", dichotomy: "TF", pole: "F", text: { en: "When making decisions, how they affect people's feelings matters as much as logic to me.", vi: "Khi ra quyết định, việc chúng ảnh hưởng đến cảm xúc của mọi người quan trọng với tôi không kém gì logic." } },
  { id: "tf11", dichotomy: "TF", pole: "F", text: { en: "I go out of my way to keep harmony in a group, even if it means compromising.", vi: "Tôi sẵn sàng cố gắng để giữ sự hòa hợp trong nhóm, kể cả khi phải nhân nhượng." } },
  { id: "tf12", dichotomy: "TF", pole: "F", text: { en: "I'm naturally attuned to other people's emotions, even when they don't say anything.", vi: "Tôi tự nhiên nhạy cảm với cảm xúc của người khác, ngay cả khi họ không nói ra." } },
  { id: "tf13", dichotomy: "TF", pole: "F", text: { en: "I consider the personal circumstances behind a situation before judging it.", vi: "Tôi cân nhắc hoàn cảnh cá nhân đằng sau một tình huống trước khi phán xét." } },
  { id: "tf14", dichotomy: "TF", pole: "F", text: { en: "People often come to me for empathy and emotional support.", vi: "Mọi người thường tìm đến tôi để được đồng cảm và hỗ trợ tinh thần." } },
  { id: "tf15", dichotomy: "TF", pole: "F", text: { en: "I'd rather soften my words than be blunt, even if it takes longer to make a point.", vi: "Tôi thích nói giảm nhẹ hơn là thẳng thừng, dù việc truyền đạt ý có mất nhiều thời gian hơn." } },
  { id: "tf16", dichotomy: "TF", pole: "F", text: { en: "My personal values guide my decisions more than strict logic does.", vi: "Giá trị cá nhân dẫn dắt quyết định của tôi nhiều hơn là logic thuần túy." } },
  { id: "tf17", dichotomy: "TF", pole: "F", text: { en: "I find it hard to stay neutral when someone I care about is upset.", vi: "Tôi khó giữ được trung lập khi ai đó tôi quan tâm đang buồn phiền." } },
  { id: "tf18", dichotomy: "TF", pole: "F", text: { en: "I believe being kind is usually more important than being 100% correct.", vi: "Tôi tin rằng tử tế thường quan trọng hơn là đúng tuyệt đối." } },

  // ---------------- JUDGING (J) vs PERCEIVING (P) ----------------
  { id: "jp01", dichotomy: "JP", pole: "J", text: { en: "I like to make a plan and stick to it rather than keeping my options open.", vi: "Tôi thích lập kế hoạch và bám sát nó hơn là để ngỏ nhiều lựa chọn." } },
  { id: "jp02", dichotomy: "JP", pole: "J", text: { en: "I feel uneasy leaving tasks unfinished or decisions unresolved.", vi: "Tôi cảm thấy bứt rứt khi để công việc dang dở hoặc quyết định chưa ngã ngũ." } },
  { id: "jp03", dichotomy: "JP", pole: "J", text: { en: "I usually complete assignments well before the deadline.", vi: "Tôi thường hoàn thành bài tập trước hạn chót khá lâu." } },
  { id: "jp04", dichotomy: "JP", pole: "J", text: { en: "I like my space and schedule to be organized and predictable.", vi: "Tôi thích không gian và lịch trình của mình được sắp xếp gọn gàng, có thể đoán trước." } },
  { id: "jp05", dichotomy: "JP", pole: "J", text: { en: "I make to-do lists and feel satisfied crossing things off.", vi: "Tôi lập danh sách việc cần làm và cảm thấy hài lòng khi gạch bỏ từng mục." } },
  { id: "jp06", dichotomy: "JP", pole: "J", text: { en: "I prefer knowing the plan in advance rather than figuring it out as I go.", vi: "Tôi thích biết trước kế hoạch hơn là vừa làm vừa tính toán." } },
  { id: "jp07", dichotomy: "JP", pole: "J", text: { en: "Once I've made a decision, I rarely go back and reconsider it.", vi: "Một khi đã quyết định, tôi hiếm khi quay lại cân nhắc lại." } },
  { id: "jp08", dichotomy: "JP", pole: "J", text: { en: "I set clear goals and timelines for myself and follow them closely.", vi: "Tôi đặt ra mục tiêu và mốc thời gian rõ ràng cho bản thân và bám sát chúng." } },
  { id: "jp09", dichotomy: "JP", pole: "J", text: { en: "I get uncomfortable with last-minute changes to plans.", vi: "Tôi cảm thấy khó chịu khi kế hoạch bị thay đổi vào phút chót." } },
  { id: "jp10", dichotomy: "JP", pole: "P", text: { en: "I prefer to stay flexible and adapt as new information comes in, rather than locking in a plan.", vi: "Tôi thích linh hoạt và thích ứng khi có thông tin mới, hơn là chốt cứng một kế hoạch." } },
  { id: "jp11", dichotomy: "JP", pole: "P", text: { en: "I often work best under the pressure of a looming deadline.", vi: "Tôi thường làm việc hiệu quả nhất khi có áp lực từ hạn chót sắp đến." } },
  { id: "jp12", dichotomy: "JP", pole: "P", text: { en: "I enjoy keeping my options open rather than committing early.", vi: "Tôi thích để ngỏ các lựa chọn hơn là cam kết sớm." } },
  { id: "jp13", dichotomy: "JP", pole: "P", text: { en: "My workspace or schedule tends to be more spontaneous than organized.", vi: "Không gian làm việc hay lịch trình của tôi thường mang tính ngẫu hứng hơn là ngăn nắp." } },
  { id: "jp14", dichotomy: "JP", pole: "P", text: { en: "I like to explore multiple possibilities before settling on one.", vi: "Tôi thích khám phá nhiều khả năng trước khi chốt lấy một." } },
  { id: "jp15", dichotomy: "JP", pole: "P", text: { en: "Unexpected changes of plan feel exciting to me rather than stressful.", vi: "Những thay đổi kế hoạch bất ngờ khiến tôi thấy thú vị hơn là căng thẳng." } },
  { id: "jp16", dichotomy: "JP", pole: "P", text: { en: "I tend to start things with enthusiasm but figure out the details along the way.", vi: "Tôi thường bắt đầu mọi việc với sự hào hứng rồi tính toán chi tiết dần trong quá trình làm." } },
  { id: "jp17", dichotomy: "JP", pole: "P", text: { en: "Rules and schedules feel more like guidelines to me than firm commitments.", vi: "Quy tắc và lịch trình với tôi giống như những gợi ý hơn là cam kết cứng nhắc." } },
  { id: "jp18", dichotomy: "JP", pole: "P", text: { en: "I find open-ended, unstructured time more enjoyable than a fixed itinerary.", vi: "Tôi thấy thời gian tự do, không gò bó thú vị hơn một lịch trình cố định." } },
];

/* ---------------------------------------------------------------------
   CONCISE-VERSION MARKERS
   A representative 6-items-per-dichotomy subset (3 per pole) used for
   the shorter "Quick" assessment path (~10 minutes total across all
   three frameworks). Chosen to keep both poles of every dichotomy
   evenly represented.
--------------------------------------------------------------------- */
const MBTI_CORE_IDS = [
  "ei01", "ei02", "ei03", "ei10", "ei11", "ei12",
  "sn01", "sn02", "sn03", "sn10", "sn11", "sn12",
  "tf01", "tf02", "tf03", "tf10", "tf11", "tf12",
  "jp01", "jp02", "jp03", "jp10", "jp11", "jp12",
];
MBTI_CORE_IDS.forEach((id) => {
  const q = MBTI_QUESTIONS.find((x) => x.id === id);
  if (q) q.core = true;
});
const MBTI_QUESTIONS_CORE = MBTI_QUESTIONS.filter((q) => q.core);

/* ---------------------------------------------------------------------
   16-TYPE DETAILED PROFILES
   Each entry includes the cognitive-function stack, a day-to-day
   description, natural strengths, common blind spots/growth areas,
   and broad career-fit themes. This content draws on the general,
   publicly-known Jungian cognitive-function framework used across
   the typology field (original wording).
--------------------------------------------------------------------- */
const MBTI_TYPES = {
  ISTJ: {
    nickname: { en: "The Inspector", vi: "Nhà Thanh Tra" },
    functions: ["Introverted Sensing (Si)", "Extraverted Thinking (Te)", "Introverted Feeling (Fi)", "Extraverted Intuition (Ne)"],
    summary: { en: "Dependable, methodical, and detail-oriented. ISTJs build their decisions on concrete facts, past experience, and a strong sense of duty. They are the people others count on to follow through.", vi: "Đáng tin cậy, có phương pháp, và chú trọng chi tiết. Nhóm ISTJ xây dựng quyết định dựa trên sự kiện cụ thể, kinh nghiệm quá khứ, và tinh thần trách nhiệm cao. Họ là người mà người khác luôn tin tưởng sẽ hoàn thành đến cùng." },
    dayToDay: { en: "You likely keep careful track of commitments, prefer proven methods over untested ones, and feel a strong pull to finish what you start. You're most comfortable when expectations are clear and you can work through them methodically.", vi: "Bạn có xu hướng theo dõi sát sao các cam kết, ưa thích phương pháp đã được kiểm chứng hơn là chưa thử nghiệm, và luôn cảm thấy cần hoàn thành những gì đã bắt đầu. Bạn thoải mái nhất khi kỳ vọng rõ ràng và bạn có thể xử lý chúng một cách có phương pháp." },
    strengths: [
      { en: "Highly reliable and organized", vi: "Rất đáng tin cậy và có tổ chức" },
      { en: "Strong practical judgment", vi: "Khả năng phán đoán thực tế vững vàng" },
      { en: "Excellent at maintaining standards and order", vi: "Xuất sắc trong việc duy trì tiêu chuẩn và trật tự" },
      { en: "Loyal and responsible to teams/institutions", vi: "Trung thành và có trách nhiệm với tập thể/tổ chức" },
    ],
    growthAreas: [
      { en: "Can be resistant to sudden change", vi: "Có thể khó thích nghi với thay đổi đột ngột" },
      { en: "May undervalue new/untested ideas", vi: "Có thể đánh giá thấp những ý tưởng mới, chưa được kiểm chứng" },
      { en: "Can come across as rigid or overly literal", vi: "Có thể bị nhìn nhận là cứng nhắc hoặc quá máy móc" },
      { en: "Might avoid expressing feelings directly", vi: "Có thể tránh né việc bày tỏ cảm xúc trực tiếp" },
    ],
  },
  ISFJ: {
    nickname: { en: "The Protector", vi: "Người Bảo Vệ" },
    functions: ["Introverted Sensing (Si)", "Extraverted Feeling (Fe)", "Introverted Thinking (Ti)", "Extraverted Intuition (Ne)"],
    summary: { en: "Warm, conscientious, and detail-focused. ISFJs quietly notice what people need and work hard behind the scenes to make sure others are taken care of.", vi: "Ấm áp, tận tâm, và tỉ mỉ. Nhóm ISFJ âm thầm nhận ra nhu cầu của người khác và làm việc chăm chỉ phía sau hậu trường để đảm bảo mọi người được chăm sóc chu đáo." },
    dayToDay: { en: "You probably remember small but meaningful details about the people around you, prefer stable and harmonious environments, and take your responsibilities seriously — even when no one is watching.", vi: "Bạn có lẽ ghi nhớ những chi tiết nhỏ nhưng có ý nghĩa về những người xung quanh, ưa thích môi trường ổn định và hài hòa, và luôn nghiêm túc với trách nhiệm của mình — ngay cả khi không ai để ý." },
    strengths: [
      { en: "Deeply caring and attentive to others' needs", vi: "Quan tâm sâu sắc và chú ý đến nhu cầu của người khác" },
      { en: "Extremely dependable and hardworking", vi: "Cực kỳ đáng tin cậy và chăm chỉ" },
      { en: "Excellent at practical, detail-oriented tasks", vi: "Xuất sắc trong các công việc thực tế, đòi hỏi tỉ mỉ" },
      { en: "Loyal and steady under pressure", vi: "Trung thành và vững vàng dưới áp lực" },
    ],
    growthAreas: [
      { en: "May struggle to say no or set boundaries", vi: "Có thể gặp khó khăn khi từ chối hoặc thiết lập ranh giới" },
      { en: "Can take criticism personally", vi: "Có thể xem những lời phê bình là chuyện cá nhân" },
      { en: "Might avoid conflict even when it's needed", vi: "Có thể né tránh xung đột ngay cả khi cần thiết" },
      { en: "Can undersell your own contributions", vi: "Có thể đánh giá thấp đóng góp của chính mình" },
    ],
  },
  INFJ: {
    nickname: { en: "The Advocate", vi: "Người Ủng Hộ" },
    functions: ["Introverted Intuition (Ni)", "Extraverted Feeling (Fe)", "Introverted Thinking (Ti)", "Extraverted Sensing (Se)"],
    summary: { en: "Insightful, idealistic, and quietly driven. INFJs combine a deep sense of meaning with genuine care for people, often seeing patterns and possibilities others miss.", vi: "Sâu sắc, lý tưởng, và âm thầm kiên định. Nhóm INFJ kết hợp cảm nhận sâu sắc về ý nghĩa với sự quan tâm chân thành đến con người, thường nhìn ra những quy luật và khả năng mà người khác bỏ lỡ." },
    dayToDay: { en: "You likely think a lot about the 'why' behind what you do, prefer depth over small talk, and feel strongly about causes or values you believe in — while needing real alone time to recharge.", vi: "Bạn có lẽ suy nghĩ nhiều về 'lý do' đằng sau những gì mình làm, ưa thích chiều sâu hơn là chuyện phiếm, và có cảm xúc mạnh mẽ với những lý tưởng hay giá trị mình tin tưởng — trong khi vẫn cần thời gian ở một mình thực sự để nạp lại năng lượng." },
    strengths: [
      { en: "Strong intuitive insight into people and situations", vi: "Trực giác sắc bén về con người và tình huống" },
      { en: "Deeply value-driven and principled", vi: "Sống theo giá trị và nguyên tắc sâu sắc" },
      { en: "Creative problem-solver", vi: "Giải quyết vấn đề một cách sáng tạo" },
      { en: "Genuinely empathetic and supportive", vi: "Đồng cảm và hỗ trợ người khác một cách chân thành" },
    ],
    growthAreas: [
      { en: "Can be a perfectionist toward yourself", vi: "Có thể quá cầu toàn với chính bản thân" },
      { en: "May burn out from over-giving", vi: "Có thể kiệt sức vì cho đi quá nhiều" },
      { en: "Can overthink decisions", vi: "Có thể suy nghĩ quá mức trước các quyết định" },
      { en: "Might withdraw instead of addressing conflict directly", vi: "Có thể rút lui thay vì đối mặt trực tiếp với xung đột" },
    ],
  },
  INTJ: {
    nickname: { en: "The Strategist", vi: "Nhà Chiến Lược" },
    functions: ["Introverted Intuition (Ni)", "Extraverted Thinking (Te)", "Introverted Feeling (Fi)", "Extraverted Sensing (Se)"],
    summary: { en: "Independent, strategic, and big-picture focused. INTJs like to build long-term visions and systematic plans, and enjoy solving complex problems on their own terms.", vi: "Độc lập, có chiến lược, và tập trung vào bức tranh tổng thể. Nhóm INTJ thích xây dựng tầm nhìn dài hạn và kế hoạch có hệ thống, đồng thời thích giải quyết các vấn đề phức tạp theo cách riêng của mình." },
    dayToDay: { en: "You probably think several steps ahead, prefer efficiency over tradition, and get impatient with processes that seem illogical. You value competence — in yourself and others.", vi: "Bạn có lẽ suy nghĩ trước nhiều bước, ưa thích hiệu quả hơn truyền thống, và mất kiên nhẫn với những quy trình có vẻ thiếu logic. Bạn coi trọng năng lực — cả ở bản thân lẫn người khác." },
    strengths: [
      { en: "Strong strategic and systems thinking", vi: "Tư duy chiến lược và hệ thống vững chắc" },
      { en: "Highly independent and self-motivated", vi: "Rất độc lập và tự tạo động lực cho bản thân" },
      { en: "Excellent at identifying inefficiencies", vi: "Xuất sắc trong việc phát hiện những điểm kém hiệu quả" },
      { en: "Sets and pursues ambitious long-term goals", vi: "Đặt ra và theo đuổi những mục tiêu dài hạn đầy tham vọng" },
    ],
    growthAreas: [
      { en: "Can seem overly blunt or critical", vi: "Có thể tỏ ra quá thẳng thắn hoặc hay chỉ trích" },
      { en: "May dismiss others' feelings in favor of logic", vi: "Có thể bỏ qua cảm xúc của người khác để ưu tiên logic" },
      { en: "Can be perfectionistic or impatient with slower processes", vi: "Có thể quá cầu toàn hoặc thiếu kiên nhẫn với các quy trình chậm" },
      { en: "Might avoid delegating or collaborating", vi: "Có thể ngại giao việc hoặc hợp tác với người khác" },
    ],
  },
  ISTP: {
    nickname: { en: "The Craftsperson", vi: "Người Thợ Thủ Công" },
    functions: ["Introverted Thinking (Ti)", "Extraverted Sensing (Se)", "Introverted Intuition (Ni)", "Extraverted Feeling (Fe)"],
    summary: { en: "Practical, analytical, and hands-on. ISTPs like to understand how things work by taking them apart — literally or figuratively — and solving problems in the moment.", vi: "Thực tế, có tư duy phân tích, và thích thực hành. Nhóm ISTP thích hiểu cách mọi thứ vận hành bằng cách tháo rời chúng ra — theo nghĩa đen hay nghĩa bóng — và giải quyết vấn đề ngay tại thời điểm xảy ra." },
    dayToDay: { en: "You likely prefer action over talk, stay calm in a crisis, and enjoy troubleshooting real, tangible problems. You value your independence and dislike being micromanaged.", vi: "Bạn có lẽ thích hành động hơn là nói, giữ được bình tĩnh trong khủng hoảng, và thích xử lý những vấn đề thực tế, cụ thể. Bạn coi trọng sự độc lập và không thích bị kiểm soát quá chặt." },
    strengths: [
      { en: "Excellent hands-on problem solver", vi: "Xuất sắc trong việc giải quyết vấn đề thực hành" },
      { en: "Calm and effective under pressure", vi: "Bình tĩnh và hiệu quả dưới áp lực" },
      { en: "Highly adaptable and resourceful", vi: "Rất linh hoạt và giàu tài xoay xở" },
      { en: "Objective, logical thinker", vi: "Tư duy khách quan, logic" },
    ],
    growthAreas: [
      { en: "Can seem detached or hard to read emotionally", vi: "Có thể tỏ ra xa cách hoặc khó đoán về mặt cảm xúc" },
      { en: "May avoid long-term commitments or planning", vi: "Có thể né tránh các cam kết hoặc kế hoạch dài hạn" },
      { en: "Can get bored with routine or repetition", vi: "Có thể nhanh chán với công việc lặp đi lặp lại" },
      { en: "Might resist structure even when it would help", vi: "Có thể chống lại cấu trúc ngay cả khi nó có ích" },
    ],
  },
  ISFP: {
    nickname: { en: "The Artist", vi: "Người Nghệ Sĩ" },
    functions: ["Introverted Feeling (Fi)", "Extraverted Sensing (Se)", "Introverted Intuition (Ni)", "Extraverted Thinking (Te)"],
    summary: { en: "Gentle, authentic, and quietly expressive. ISFPs live by a strong personal set of values and appreciate beauty and experience in the present moment.", vi: "Dịu dàng, chân thật, và âm thầm giàu cảm xúc. Nhóm ISFP sống theo một hệ giá trị cá nhân vững chắc và trân trọng vẻ đẹp cùng trải nghiệm trong hiện tại." },
    dayToDay: { en: "You likely prefer to show care through action rather than words, need creative or hands-on outlets, and dislike being boxed into rigid rules that clash with your values.", vi: "Bạn có lẽ thích thể hiện sự quan tâm qua hành động hơn là lời nói, cần có lối thoát sáng tạo hoặc thực hành, và không thích bị gò bó trong những quy tắc cứng nhắc trái với giá trị của mình." },
    strengths: [
      { en: "Strong authentic personal values", vi: "Hệ giá trị cá nhân chân thật, vững vàng" },
      { en: "Naturally creative and aesthetically sensitive", vi: "Tự nhiên sáng tạo và nhạy cảm với cái đẹp" },
      { en: "Adaptable and easygoing", vi: "Linh hoạt và dễ hòa hợp" },
      { en: "Quietly supportive of people around you", vi: "Âm thầm hỗ trợ những người xung quanh" },
    ],
    growthAreas: [
      { en: "Can avoid confrontation or difficult conversations", vi: "Có thể né tránh đối đầu hoặc những cuộc trò chuyện khó khăn" },
      { en: "May struggle with long-term planning", vi: "Có thể gặp khó khăn với việc lập kế hoạch dài hạn" },
      { en: "Can take criticism of your work very personally", vi: "Có thể xem những lời phê bình về công việc của mình là chuyện cá nhân" },
      { en: "Might undersell your ideas in group settings", vi: "Có thể không tự tin trình bày ý tưởng của mình trong nhóm" },
    ],
  },
  INFP: {
    nickname: { en: "The Idealist", vi: "Người Lý Tưởng" },
    functions: ["Introverted Feeling (Fi)", "Extraverted Intuition (Ne)", "Introverted Sensing (Si)", "Extraverted Thinking (Te)"],
    summary: { en: "Imaginative, values-driven, and deeply empathetic. INFPs are motivated by authenticity and meaning, often drawn to causes bigger than themselves.", vi: "Giàu trí tưởng tượng, sống theo giá trị, và rất đồng cảm. Nhóm INFP được thúc đẩy bởi sự chân thật và ý nghĩa, thường bị thu hút bởi những lý tưởng lớn hơn bản thân mình." },
    dayToDay: { en: "You likely spend a lot of time reflecting on your values and possibilities, care about staying true to yourself, and can be quite creative when working on something you believe in.", vi: "Bạn có lẽ dành nhiều thời gian suy ngẫm về giá trị và các khả năng, quan tâm đến việc sống đúng với bản thân, và có thể rất sáng tạo khi làm điều gì đó mình tin tưởng." },
    strengths: [
      { en: "Deep personal integrity and authenticity", vi: "Chính trực và chân thật sâu sắc" },
      { en: "Strong creative and imaginative thinking", vi: "Tư duy sáng tạo và giàu trí tưởng tượng" },
      { en: "Genuinely empathetic toward others", vi: "Đồng cảm chân thành với người khác" },
      { en: "Passionate advocate for causes you believe in", vi: "Nhiệt huyết ủng hộ những lý tưởng mình tin tưởng" },
    ],
    growthAreas: [
      { en: "Can be overly idealistic or self-critical", vi: "Có thể quá lý tưởng hóa hoặc tự phê bình bản thân" },
      { en: "May struggle with routine or detail-heavy tasks", vi: "Có thể gặp khó khăn với công việc lặp lại hoặc nhiều chi tiết" },
      { en: "Can avoid conflict to the point of suppressing your own needs", vi: "Có thể né tránh xung đột đến mức kìm nén nhu cầu của chính mình" },
      { en: "Might procrastinate on less meaningful tasks", vi: "Có thể trì hoãn những việc kém ý nghĩa với mình" },
    ],
  },
  INTP: {
    nickname: { en: "The Analyst", vi: "Nhà Phân Tích" },
    functions: ["Introverted Thinking (Ti)", "Extraverted Intuition (Ne)", "Introverted Sensing (Si)", "Extraverted Feeling (Fe)"],
    summary: { en: "Curious, logical, and endlessly analytical. INTPs love exploring ideas, spotting inconsistencies, and understanding the underlying structure of how things work.", vi: "Tò mò, logic, và luôn phân tích không ngừng. Nhóm INTP thích khám phá ý tưởng, phát hiện những điểm mâu thuẫn, và hiểu cấu trúc nền tảng của cách mọi thứ vận hành." },
    dayToDay: { en: "You likely enjoy going down rabbit holes on interesting topics, question assumptions others take for granted, and prefer flexibility over rigid schedules.", vi: "Bạn có lẽ thích đào sâu vào những chủ đề thú vị, đặt câu hỏi với những giả định mà người khác coi là hiển nhiên, và ưa thích sự linh hoạt hơn là lịch trình cứng nhắc." },
    strengths: [
      { en: "Sharp, independent analytical thinking", vi: "Tư duy phân tích sắc bén, độc lập" },
      { en: "Excellent at spotting logical flaws", vi: "Xuất sắc trong việc phát hiện lỗi logic" },
      { en: "Creative and original problem-solving", vi: "Giải quyết vấn đề sáng tạo và độc đáo" },
      { en: "Deep intellectual curiosity", vi: "Tính tò mò tri thức sâu sắc" },
    ],
    growthAreas: [
      { en: "Can overanalyze instead of taking action", vi: "Có thể phân tích quá mức thay vì hành động" },
      { en: "May neglect emotional aspects of a situation", vi: "Có thể bỏ qua khía cạnh cảm xúc của tình huống" },
      { en: "Can seem detached in social or team settings", vi: "Có thể tỏ ra xa cách trong môi trường xã hội hoặc nhóm" },
      { en: "Might struggle to follow through on routine tasks", vi: "Có thể gặp khó khăn khi hoàn thành các công việc thường nhật" },
    ],
  },
  ESTP: {
    nickname: { en: "The Doer", vi: "Người Hành Động" },
    functions: ["Extraverted Sensing (Se)", "Introverted Thinking (Ti)", "Extraverted Feeling (Fe)", "Introverted Intuition (Ni)"],
    summary: { en: "Energetic, bold, and action-oriented. ESTPs thrive in the moment, enjoy taking calculated risks, and are quick to respond to whatever's happening right now.", vi: "Năng động, táo bạo, và thiên về hành động. Nhóm ESTP phát huy tốt nhất trong khoảnh khắc hiện tại, thích chấp nhận rủi ro có tính toán, và phản ứng nhanh với những gì đang diễn ra." },
    dayToDay: { en: "You likely get restless with too much theory or planning, prefer learning by doing, and read a room quickly to adapt your approach on the fly.", vi: "Bạn có lẽ dễ sốt ruột với quá nhiều lý thuyết hay kế hoạch, thích học qua thực hành, và nhanh chóng nắm bắt bầu không khí để điều chỉnh cách tiếp cận ngay tại chỗ." },
    strengths: [
      { en: "Quick, practical decision-making", vi: "Ra quyết định nhanh chóng, thực tế" },
      { en: "Thrives under pressure and in fast-changing situations", vi: "Phát huy tốt dưới áp lực và trong tình huống thay đổi nhanh" },
      { en: "Highly persuasive and socially perceptive", vi: "Rất thuyết phục và nhạy bén trong giao tiếp xã hội" },
      { en: "Bold and willing to take action", vi: "Táo bạo và sẵn sàng hành động" },
    ],
    growthAreas: [
      { en: "Can act before thinking through consequences", vi: "Có thể hành động trước khi suy nghĩ kỹ hậu quả" },
      { en: "May get bored with long-term planning or routine", vi: "Có thể nhanh chán với kế hoạch dài hạn hoặc công việc thường nhật" },
      { en: "Can be blunt or overly competitive", vi: "Có thể quá thẳng thắn hoặc hiếu thắng" },
      { en: "Might avoid deep emotional reflection", vi: "Có thể né tránh việc suy ngẫm cảm xúc sâu sắc" },
    ],
  },
  ESFP: {
    nickname: { en: "The Performer", vi: "Người Trình Diễn" },
    functions: ["Extraverted Sensing (Se)", "Introverted Feeling (Fi)", "Extraverted Thinking (Te)", "Introverted Intuition (Ni)"],
    summary: { en: "Warm, spontaneous, and full of energy. ESFPs bring enthusiasm into every room and genuinely enjoy connecting with the people around them.", vi: "Ấm áp, tự nhiên, và tràn đầy năng lượng. Nhóm ESFP mang sự nhiệt huyết vào mọi không gian và thực sự thích kết nối với những người xung quanh." },
    dayToDay: { en: "You likely live very much in the present, enjoy bringing fun and energy to group settings, and are highly attuned to the moods of people around you.", vi: "Bạn có lẽ sống rất trọn vẹn trong hiện tại, thích mang lại niềm vui và năng lượng cho nhóm, và rất nhạy cảm với tâm trạng của những người xung quanh." },
    strengths: [
      { en: "Naturally warm and engaging with people", vi: "Tự nhiên ấm áp và cuốn hút với mọi người" },
      { en: "Highly adaptable in the moment", vi: "Rất linh hoạt trong từng khoảnh khắc" },
      { en: "Strong practical common sense", vi: "Óc thực tế và lẽ thường vững vàng" },
      { en: "Brings energy and morale to a team", vi: "Mang lại năng lượng và tinh thần tích cực cho nhóm" },
    ],
    growthAreas: [
      { en: "Can avoid difficult or serious conversations", vi: "Có thể né tránh những cuộc trò chuyện khó khăn hoặc nghiêm túc" },
      { en: "May struggle with long-term planning or follow-through", vi: "Có thể gặp khó khăn với kế hoạch dài hạn hoặc theo đuổi đến cùng" },
      { en: "Can be sensitive to criticism", vi: "Có thể nhạy cảm với những lời phê bình" },
      { en: "Might act impulsively without weighing consequences", vi: "Có thể hành động bốc đồng mà không cân nhắc hậu quả" },
    ],
  },
  ENFP: {
    nickname: { en: "The Campaigner", vi: "Người Truyền Cảm Hứng" },
    functions: ["Extraverted Intuition (Ne)", "Introverted Feeling (Fi)", "Extraverted Thinking (Te)", "Introverted Sensing (Si)"],
    summary: { en: "Enthusiastic, imaginative, and people-focused. ENFPs are energized by possibilities and genuinely curious about the people and ideas around them.", vi: "Nhiệt huyết, giàu trí tưởng tượng, và hướng đến con người. Nhóm ENFP được tiếp thêm năng lượng bởi những khả năng mới và thực sự tò mò về con người, ý tưởng xung quanh." },
    dayToDay: { en: "You likely juggle many interests at once, get excited about new projects and connections, and care deeply about authenticity and meaning in what you do.", vi: "Bạn có lẽ theo đuổi nhiều mối quan tâm cùng lúc, hào hứng với những dự án và mối quan hệ mới, và rất quan tâm đến sự chân thật cùng ý nghĩa trong những gì mình làm." },
    strengths: [
      { en: "Highly creative and idea-generating", vi: "Rất sáng tạo và giàu ý tưởng" },
      { en: "Warm, genuine, and socially perceptive", vi: "Ấm áp, chân thành, và nhạy bén trong giao tiếp" },
      { en: "Adaptable and quick to see new possibilities", vi: "Linh hoạt và nhanh nhạy nhận ra khả năng mới" },
      { en: "Inspiring and persuasive communicator", vi: "Giao tiếp truyền cảm hứng và thuyết phục" },
    ],
    growthAreas: [
      { en: "Can struggle to finish what you start", vi: "Có thể khó hoàn thành những gì đã bắt đầu" },
      { en: "May overcommit to too many projects at once", vi: "Có thể ôm đồm quá nhiều dự án cùng lúc" },
      { en: "Can avoid routine tasks that feel uninspiring", vi: "Có thể né tránh các công việc thường nhật kém truyền cảm hứng" },
      { en: "Might take criticism of your ideas personally", vi: "Có thể xem lời phê bình về ý tưởng của mình là chuyện cá nhân" },
    ],
  },
  ENTP: {
    nickname: { en: "The Innovator", vi: "Người Đổi Mới" },
    functions: ["Extraverted Intuition (Ne)", "Introverted Thinking (Ti)", "Extraverted Feeling (Fe)", "Introverted Sensing (Si)"],
    summary: { en: "Quick-witted, curious, and argumentative in the best sense. ENTPs love debating ideas, challenging assumptions, and inventing new approaches.", vi: "Nhanh nhạy, tò mò, và thích tranh luận theo nghĩa tích cực nhất. Nhóm ENTP yêu thích tranh luận ý tưởng, thách thức các giả định, và sáng tạo ra những cách tiếp cận mới." },
    dayToDay: { en: "You likely enjoy playing devil's advocate, get bored quickly with routine, and see multiple angles on almost every problem you encounter.", vi: "Bạn có lẽ thích đóng vai người phản biện, nhanh chán với những việc lặp lại, và nhìn ra nhiều góc độ khác nhau trong hầu hết mọi vấn đề gặp phải." },
    strengths: [
      { en: "Sharp, fast strategic thinking", vi: "Tư duy chiến lược sắc bén, nhanh nhạy" },
      { en: "Excellent at generating original ideas", vi: "Xuất sắc trong việc tạo ra ý tưởng độc đáo" },
      { en: "Persuasive and engaging debater", vi: "Tranh luận thuyết phục và cuốn hút" },
      { en: "Comfortable challenging the status quo", vi: "Thoải mái khi thách thức những điều đã được mặc định" },
    ],
    growthAreas: [
      { en: "Can neglect follow-through on projects", vi: "Có thể xao nhãng việc theo đuổi dự án đến cùng" },
      { en: "May come across as argumentative for its own sake", vi: "Có thể bị nhìn nhận là thích tranh cãi chỉ vì tranh cãi" },
      { en: "Can overlook practical details", vi: "Có thể bỏ qua các chi tiết thực tế" },
      { en: "Might get bored before finishing long-term commitments", vi: "Có thể chán trước khi hoàn thành các cam kết dài hạn" },
    ],
  },
  ESTJ: {
    nickname: { en: "The Executive", vi: "Nhà Quản Trị" },
    functions: ["Extraverted Thinking (Te)", "Introverted Sensing (Si)", "Extraverted Intuition (Ne)", "Introverted Feeling (Fi)"],
    summary: { en: "Organized, decisive, and results-driven. ESTJs like clear structure, take charge naturally, and get things done efficiently.", vi: "Có tổ chức, quyết đoán, và hướng đến kết quả. Nhóm ESTJ thích cấu trúc rõ ràng, tự nhiên đảm nhận vai trò dẫn dắt, và hoàn thành công việc một cách hiệu quả." },
    dayToDay: { en: "You likely take a leadership role in groups without being asked, value proven procedures, and feel satisfaction from clear, measurable progress.", vi: "Bạn có lẽ tự nhiên đảm nhận vai trò lãnh đạo trong nhóm mà không cần ai yêu cầu, coi trọng những quy trình đã được kiểm chứng, và cảm thấy hài lòng khi thấy tiến độ rõ ràng, đo lường được." },
    strengths: [
      { en: "Strong organizational and leadership skills", vi: "Kỹ năng tổ chức và lãnh đạo vững vàng" },
      { en: "Decisive and results-oriented", vi: "Quyết đoán và hướng đến kết quả" },
      { en: "Reliable follow-through on commitments", vi: "Thực hiện cam kết đáng tin cậy đến cùng" },
      { en: "Clear, direct communicator", vi: "Giao tiếp rõ ràng, trực tiếp" },
    ],
    growthAreas: [
      { en: "Can be inflexible about how things 'should' be done", vi: "Có thể cứng nhắc về cách mọi việc 'nên' được thực hiện" },
      { en: "May come across as overly blunt or controlling", vi: "Có thể bị nhìn nhận là quá thẳng thắn hoặc áp đặt" },
      { en: "Can dismiss unconventional ideas too quickly", vi: "Có thể bác bỏ những ý tưởng khác thường quá nhanh" },
      { en: "Might undervalue others' emotional needs in pursuit of results", vi: "Có thể xem nhẹ nhu cầu cảm xúc của người khác để theo đuổi kết quả" },
    ],
  },
  ESFJ: {
    nickname: { en: "The Consul", vi: "Người Cố Vấn" },
    functions: ["Extraverted Feeling (Fe)", "Introverted Sensing (Si)", "Extraverted Intuition (Ne)", "Introverted Thinking (Ti)"],
    summary: { en: "Warm, organized, and community-minded. ESFJs care deeply about the people around them and work hard to keep groups running smoothly and harmoniously.", vi: "Ấm áp, có tổ chức, và hướng đến cộng đồng. Nhóm ESFJ quan tâm sâu sắc đến những người xung quanh và làm việc chăm chỉ để giữ cho nhóm vận hành trơn tru, hài hòa." },
    dayToDay: { en: "You likely notice what others need before they ask, value tradition and clear roles, and feel energized by helping a group succeed together.", vi: "Bạn có lẽ nhận ra nhu cầu của người khác trước khi họ lên tiếng, coi trọng truyền thống và vai trò rõ ràng, và cảm thấy tràn đầy năng lượng khi giúp cả nhóm cùng thành công." },
    strengths: [
      { en: "Warm, supportive, and socially attuned", vi: "Ấm áp, biết hỗ trợ, và nhạy bén trong giao tiếp xã hội" },
      { en: "Highly organized and dependable", vi: "Rất có tổ chức và đáng tin cậy" },
      { en: "Strong sense of responsibility to others", vi: "Ý thức trách nhiệm cao với người khác" },
      { en: "Skilled at building cooperation in groups", vi: "Giỏi xây dựng sự hợp tác trong nhóm" },
    ],
    growthAreas: [
      { en: "Can seek external validation too much", vi: "Có thể quá tìm kiếm sự công nhận từ bên ngoài" },
      { en: "May avoid conflict even when addressing it would help", vi: "Có thể né tránh xung đột ngay cả khi giải quyết nó sẽ có ích" },
      { en: "Can struggle with unconventional or ambiguous situations", vi: "Có thể gặp khó khăn với những tình huống khác thường hoặc mơ hồ" },
      { en: "Might overextend yourself to please others", vi: "Có thể cố gắng quá sức để làm hài lòng người khác" },
    ],
  },
  ENFJ: {
    nickname: { en: "The Mentor", vi: "Người Cố Vấn Tận Tâm" },
    functions: ["Extraverted Feeling (Fe)", "Introverted Intuition (Ni)", "Extraverted Sensing (Se)", "Introverted Thinking (Ti)"],
    summary: { en: "Charismatic, empathetic, and growth-focused. ENFJs are natural motivators who genuinely want to help others reach their potential.", vi: "Có sức hút, đồng cảm, và chú trọng sự phát triển. Nhóm ENFJ là những người truyền động lực tự nhiên và thực sự muốn giúp người khác đạt được tiềm năng của họ." },
    dayToDay: { en: "You likely pick up on others' emotions quickly, enjoy encouraging and organizing people around a shared goal, and think a lot about the impact of your choices on others.", vi: "Bạn có lẽ nhanh chóng nhận ra cảm xúc của người khác, thích khích lệ và tổ chức mọi người hướng tới mục tiêu chung, và suy nghĩ nhiều về tác động của các lựa chọn của mình đến người khác." },
    strengths: [
      { en: "Inspiring, natural leader and communicator", vi: "Là người lãnh đạo và giao tiếp tự nhiên, truyền cảm hứng" },
      { en: "Deeply empathetic and socially perceptive", vi: "Đồng cảm sâu sắc và nhạy bén trong giao tiếp xã hội" },
      { en: "Skilled at motivating and developing others", vi: "Giỏi truyền động lực và phát triển người khác" },
      { en: "Organized and goal-driven", vi: "Có tổ chức và hướng đến mục tiêu" },
    ],
    growthAreas: [
      { en: "Can overcommit to helping others at your own expense", vi: "Có thể cam kết giúp đỡ người khác quá mức, gây thiệt cho bản thân" },
      { en: "May take on too much responsibility for group harmony", vi: "Có thể gánh quá nhiều trách nhiệm cho sự hòa hợp của nhóm" },
      { en: "Can be sensitive to criticism or conflict", vi: "Có thể nhạy cảm với phê bình hoặc xung đột" },
      { en: "Might struggle to prioritize your own needs", vi: "Có thể gặp khó khăn khi ưu tiên nhu cầu của chính mình" },
    ],
  },
  ENTJ: {
    nickname: { en: "The Commander", vi: "Người Chỉ Huy" },
    functions: ["Extraverted Thinking (Te)", "Introverted Intuition (Ni)", "Extraverted Sensing (Se)", "Introverted Feeling (Fi)"],
    summary: { en: "Confident, strategic, and driven. ENTJs are natural organizers who see the big picture and mobilize people and resources to get there efficiently.", vi: "Tự tin, có chiến lược, và giàu quyết tâm. Nhóm ENTJ là những nhà tổ chức tự nhiên, có khả năng nhìn ra bức tranh tổng thể và huy động con người, nguồn lực để đạt được mục tiêu một cách hiệu quả." },
    dayToDay: { en: "You likely take charge in ambiguous situations, set ambitious goals, and get frustrated with inefficiency or indecision — your own or others'.", vi: "Bạn có lẽ đứng ra chủ động trong những tình huống mơ hồ, đặt ra mục tiêu tham vọng, và cảm thấy bực bội với sự kém hiệu quả hay do dự — dù là của mình hay của người khác." },
    strengths: [
      { en: "Strong strategic vision and leadership", vi: "Tầm nhìn chiến lược và khả năng lãnh đạo vững vàng" },
      { en: "Decisive and confident under pressure", vi: "Quyết đoán và tự tin dưới áp lực" },
      { en: "Excellent at organizing people and resources", vi: "Xuất sắc trong việc tổ chức con người và nguồn lực" },
      { en: "Driven to achieve long-term goals", vi: "Quyết tâm đạt được các mục tiêu dài hạn" },
    ],
    growthAreas: [
      { en: "Can be perceived as domineering or impatient", vi: "Có thể bị nhìn nhận là áp đặt hoặc thiếu kiên nhẫn" },
      { en: "May dismiss others' feelings in pursuit of results", vi: "Có thể bỏ qua cảm xúc của người khác để theo đuổi kết quả" },
      { en: "Can struggle to slow down and reflect", vi: "Có thể gặp khó khăn khi cần chậm lại để suy ngẫm" },
      { en: "Might overlook details in favor of the big picture", vi: "Có thể bỏ qua chi tiết để tập trung vào bức tranh tổng thể" },
    ],
  },
};

if (typeof module !== "undefined") module.exports = { MBTI_QUESTIONS, MBTI_QUESTIONS_CORE, MBTI_TYPES };
