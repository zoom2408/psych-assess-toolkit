/* =========================================================================
   WELLBEING BUFFERS SECTION (Seligman's PERMA model)
   Stress isn't only about load — it's also about what buffers you.
   PERMA measures five pillars of wellbeing that research links with
   resilience under stress:
   - PP: Positive Emotion   (joy, gratitude, contentment in daily life)
   - EN: Engagement         (absorption, flow, interest)
   - RE: Relationships      (feeling connected, loved, supported)
   - ME: Meaning            (purpose, mattering, being part of something bigger)
   - AC: Accomplishment     (progress, competence, achieving goals)

   Item shape: { id, scale: "PP"|"EN"|"RE"|"ME"|"AC", text: {en, vi} }
   Balance rule: equal item counts per scale (full: 6 each, quick: 2 each).
   Bilingual fields resolved at render time via L() from lang.js.
========================================================================= */

const PERMA_QUESTIONS = [
  // --- PP: Positive Emotion (6) ---
  { id: "pp01", scale: "PP", text: { en: "In a typical week, I experience genuine moments of joy or contentment.", vi: "Trong một tuần bình thường, tôi trải nghiệm những khoảnh khắc vui vẻ hoặc mãn nguyện thực sự." } },
  { id: "pp02", scale: "PP", text: { en: "I regularly notice things I'm grateful for.", vi: "Tôi thường xuyên nhận ra những điều mình biết ơn." } },
  { id: "pp03", scale: "PP", text: { en: "I laugh easily and often.", vi: "Tôi cười dễ dàng và thường xuyên." } },
  { id: "pp04", scale: "PP", text: { en: "Even in busy periods, I find small pleasures in my day.", vi: "Ngay cả trong những giai đoạn bận rộn, tôi vẫn tìm được những niềm vui nhỏ trong ngày." } },
  { id: "pp05", scale: "PP", text: { en: "When I wake up, I more often feel okay about the day ahead than dread it.", vi: "Khi thức dậy, tôi thường cảm thấy ổn về ngày sắp tới hơn là lo sợ về nó." } },
  { id: "pp06", scale: "PP", text: { en: "I generally feel at peace when I have a quiet moment to myself.", vi: "Tôi nhìn chung cảm thấy bình yên khi có một khoảnh khắc yên tĩnh cho riêng mình." } },
  // --- EN: Engagement (6) ---
  { id: "en01", scale: "EN", text: { en: "I regularly get so absorbed in something that I lose track of time.", vi: "Tôi thường bị cuốn hút vào điều gì đó đến mức quên cả thời gian." } },
  { id: "en02", scale: "EN", text: { en: "There are activities in my life that fully hold my attention and interest.", vi: "Có những hoạt động trong cuộc sống của tôi hoàn toàn giữ được sự chú ý và hứng thú của tôi." } },
  { id: "en03", scale: "EN", text: { en: "I get to use my real strengths in my daily activities.", vi: "Tôi được sử dụng những thế mạnh thực sự của mình trong các hoạt động hằng ngày." } },
  { id: "en04", scale: "EN", text: { en: "I'm genuinely curious about things and follow that curiosity.", vi: "Tôi thực sự tò mò về mọi thứ và theo đuổi sự tò mò đó." } },
  { id: "en05", scale: "EN", text: { en: "At least part of my week involves work or activities I find intrinsically interesting.", vi: "Ít nhất một phần trong tuần của tôi gồm công việc hoặc hoạt động mà tôi thấy thực sự thú vị." } },
  { id: "en06", scale: "EN", text: { en: "When I'm doing something I care about, effort feels energizing rather than draining.", vi: "Khi làm điều mình quan tâm, nỗ lực bỏ ra khiến tôi thấy tràn đầy năng lượng hơn là kiệt sức." } },
  // --- RE: Relationships (6) ---
  { id: "re01", scale: "RE", text: { en: "There are people in my life who truly know me and accept me.", vi: "Có những người trong đời tôi thực sự hiểu và chấp nhận con người tôi." } },
  { id: "re02", scale: "RE", text: { en: "When something good happens, I have someone I want to tell.", vi: "Khi có chuyện vui xảy đến, tôi có người mà tôi muốn chia sẻ." } },
  { id: "re03", scale: "RE", text: { en: "I feel loved by the important people in my life.", vi: "Tôi cảm thấy được yêu thương bởi những người quan trọng trong đời mình." } },
  { id: "re04", scale: "RE", text: { en: "I invest time and energy in my close relationships, even when life is busy.", vi: "Tôi đầu tư thời gian và năng lượng cho các mối quan hệ thân thiết, ngay cả khi cuộc sống bận rộn." } },
  { id: "re05", scale: "RE", text: { en: "If I were in trouble at 3 a.m., I know exactly who I could call.", vi: "Nếu gặp rắc rối lúc 3 giờ sáng, tôi biết chính xác mình có thể gọi cho ai." } },
  { id: "re06", scale: "RE", text: { en: "I regularly have conversations that go deeper than logistics and small talk.", vi: "Tôi thường xuyên có những cuộc trò chuyện sâu sắc hơn là chỉ bàn việc vặt hay chuyện phiếm." } },
  // --- ME: Meaning (6) ---
  { id: "me01", scale: "ME", text: { en: "My life feels like it has direction and purpose.", vi: "Cuộc sống của tôi mang lại cảm giác có phương hướng và mục đích." } },
  { id: "me02", scale: "ME", text: { en: "What I do day-to-day matters to someone or something beyond myself.", vi: "Những gì tôi làm hằng ngày có ý nghĩa đối với ai đó hoặc điều gì đó lớn hơn bản thân tôi." } },
  { id: "me03", scale: "ME", text: { en: "My daily activities feel connected to my deeper values.", vi: "Các hoạt động hằng ngày của tôi cảm thấy gắn liền với những giá trị sâu sắc của mình." } },
  { id: "me04", scale: "ME", text: { en: "I feel part of something larger than myself (a family, community, cause, or tradition).", vi: "Tôi cảm thấy mình là một phần của điều gì đó lớn hơn bản thân (gia đình, cộng đồng, lý tưởng, hay truyền thống)." } },
  { id: "me05", scale: "ME", text: { en: "Even during hard periods, I can usually say why my efforts are worth it.", vi: "Ngay cả trong những giai đoạn khó khăn, tôi thường có thể nói rõ vì sao nỗ lực của mình là xứng đáng." } },
  { id: "me06", scale: "ME", text: { en: "I could explain to someone what I'm ultimately working toward in life right now.", vi: "Tôi có thể giải thích cho ai đó biết cuối cùng tôi đang hướng đến điều gì trong cuộc sống lúc này." } },
  // --- AC: Accomplishment (6) ---
  { id: "ac01", scale: "AC", text: { en: "I regularly finish the things I set out to do.", vi: "Tôi thường xuyên hoàn thành những việc mình đặt ra để làm." } },
  { id: "ac02", scale: "AC", text: { en: "I feel a sense of progress in the areas of life that matter to me.", vi: "Tôi cảm nhận được sự tiến bộ trong những lĩnh vực cuộc sống quan trọng với mình." } },
  { id: "ac03", scale: "AC", text: { en: "I handle my responsibilities competently.", vi: "Tôi xử lý trách nhiệm của mình một cách có năng lực." } },
  { id: "ac04", scale: "AC", text: { en: "When I look back over recent months, I can point to things I'm proud of.", vi: "Khi nhìn lại vài tháng gần đây, tôi có thể chỉ ra những điều mình tự hào." } },
  { id: "ac05", scale: "AC", text: { en: "I set goals for myself and make real headway on them.", vi: "Tôi đặt mục tiêu cho bản thân và đạt được tiến triển thực sự với chúng." } },
  { id: "ac06", scale: "AC", text: { en: "People around me would describe me as someone who gets things done.", vi: "Những người xung quanh sẽ mô tả tôi là người luôn hoàn thành công việc." } },
];

/* Pillar profiles with concrete boosters (used for the lowest pillars). */
const PERMA_PILLARS = {
  PP: {
    name: { en: "Positive Emotion", vi: "Cảm Xúc Tích Cực" },
    letter: "P",
    nickname: { en: "Feeling Good", vi: "Cảm Giác Dễ Chịu" },
    description: {
      en: "The presence of pleasant emotions — joy, gratitude, contentment, amusement — woven through ordinary days. Positive emotion isn't a luxury during stress; it broadens thinking and undoes the physiological effects of tension.",
      vi: "Sự hiện diện của những cảm xúc dễ chịu — niềm vui, lòng biết ơn, sự mãn nguyện, sự thích thú — đan xen trong những ngày bình thường. Cảm xúc tích cực không phải là điều xa xỉ khi căng thẳng; nó mở rộng tư duy và hóa giải các tác động sinh lý của sự căng thẳng.",
    },
    boosters: {
      en: [
        "End each day by writing down three specific things that went well and why — small, but one of the most replicated exercises in positive psychology.",
        "Schedule one reliably enjoyable activity per week and protect it like an appointment; under stress, pleasant activities are the first thing people wrongly cut.",
        "Savor on purpose: when something good happens, stay with it for 20–30 seconds instead of moving straight to the next task.",
      ],
      vi: [
        "Kết thúc mỗi ngày bằng cách viết ra ba điều cụ thể đã diễn ra tốt đẹp và lý do — nhỏ bé, nhưng là một trong những bài tập được nghiên cứu nhiều nhất trong tâm lý học tích cực.",
        "Lên lịch một hoạt động thực sự thú vị mỗi tuần và bảo vệ nó như một cuộc hẹn; khi căng thẳng, các hoạt động dễ chịu thường là điều đầu tiên bị cắt bỏ một cách sai lầm.",
        "Chủ động tận hưởng: khi có điều tốt đẹp xảy ra, hãy ở lại với nó trong 20–30 giây thay vì chuyển ngay sang việc tiếp theo.",
      ],
    },
  },
  EN: {
    name: { en: "Engagement", vi: "Sự Gắn Kết" },
    letter: "E",
    nickname: { en: "Flow", vi: "Dòng Chảy" },
    description: {
      en: "Deep absorption in what you're doing — the state where time disappears. Engagement comes from using your strengths on challenges that stretch but don't swamp you, and it's a powerful antidote to both rumination and boredom.",
      vi: "Sự cuốn hút sâu sắc vào những gì bạn đang làm — trạng thái mà thời gian dường như biến mất. Sự gắn kết đến từ việc sử dụng thế mạnh của bạn cho những thử thách vừa đủ căng nhưng không nhấn chìm bạn, và nó là liều thuốc mạnh mẽ cho cả sự suy nghĩ lặp đi lặp lại lẫn sự nhàm chán.",
    },
    boosters: {
      en: [
        "Identify your top strengths and redesign one routine task this week so it uses one of them more.",
        "Create flow conditions deliberately: one clear task, a slight stretch, no notifications, 45–90 minutes.",
        "Rebuild an old absorbing hobby that stress crowded out — you don't need a new one, just the last one back.",
      ],
      vi: [
        "Xác định thế mạnh hàng đầu của bạn và thiết kế lại một công việc thường lệ trong tuần này để sử dụng nhiều hơn một trong số đó.",
        "Chủ động tạo điều kiện cho trạng thái dòng chảy: một nhiệm vụ rõ ràng, một chút thử thách, không thông báo, 45–90 phút.",
        "Khôi phục lại một sở thích cuốn hút cũ đã bị căng thẳng lấn át — bạn không cần cái mới, chỉ cần lấy lại cái cũ.",
      ],
    },
  },
  RE: {
    name: { en: "Relationships", vi: "Các Mối Quan Hệ" },
    letter: "R",
    nickname: { en: "Connection", vi: "Kết Nối" },
    description: {
      en: "Feeling connected, loved, and supported. Across decades of research, relationship quality is the single strongest predictor of wellbeing — and the strongest buffer between stress and health.",
      vi: "Cảm giác được kết nối, được yêu thương, và được hỗ trợ. Qua nhiều thập kỷ nghiên cứu, chất lượng các mối quan hệ là yếu tố dự báo mạnh nhất cho hạnh phúc — và là vùng đệm mạnh nhất giữa căng thẳng và sức khỏe.",
    },
    boosters: {
      en: [
        "Respond actively when someone shares good news — asking questions and celebrating with them measurably strengthens bonds.",
        "Put one recurring get-together on the calendar so connection stops depending on spontaneous energy you don't have when stressed.",
        "Reach out to one person you've drifted from; renewing a dormant tie is easier and more rewarding than it feels beforehand.",
      ],
      vi: [
        "Phản hồi tích cực khi ai đó chia sẻ tin vui — đặt câu hỏi và cùng ăn mừng với họ giúp củng cố mối gắn kết một cách rõ rệt.",
        "Đặt một buổi gặp mặt định kỳ vào lịch để sự kết nối không còn phụ thuộc vào nguồn năng lượng bộc phát mà bạn không có khi căng thẳng.",
        "Liên hệ lại với một người mà bạn đã dần xa cách; việc nối lại một mối quan hệ đã ngủ yên thường dễ dàng và đáng giá hơn bạn nghĩ trước khi thử.",
      ],
    },
  },
  ME: {
    name: { en: "Meaning", vi: "Ý Nghĩa" },
    letter: "M",
    nickname: { en: "Purpose", vi: "Mục Đích" },
    description: {
      en: "The sense that your life has direction and that what you do matters beyond yourself. Meaning is what makes high effort feel worth it — demands with meaning produce growth; the same demands without it produce burnout.",
      vi: "Cảm giác rằng cuộc sống của bạn có phương hướng và những gì bạn làm có ý nghĩa vượt ra ngoài bản thân. Ý nghĩa là điều khiến nỗ lực lớn trở nên xứng đáng — những đòi hỏi có ý nghĩa tạo ra sự phát triển; cùng những đòi hỏi đó mà thiếu ý nghĩa sẽ tạo ra kiệt sức.",
    },
    boosters: {
      en: [
        "Write two or three sentences connecting your most draining current duty to a value or person you care about — reframing 'what for' measurably changes how load feels.",
        "Give a small amount of regular time to something bigger than yourself (a person, cause, or community).",
        "Clarify your values: list the three you most want to live by, and pick one visible way to act on one of them this week.",
      ],
      vi: [
        "Viết hai hoặc ba câu kết nối nhiệm vụ hiện tại tiêu hao năng lượng nhất của bạn với một giá trị hoặc một người bạn quan tâm — việc nhìn nhận lại 'vì điều gì' thay đổi rõ rệt cảm giác về gánh nặng.",
        "Dành một khoảng thời gian đều đặn nhỏ cho điều gì đó lớn hơn bản thân (một người, một lý tưởng, hoặc một cộng đồng).",
        "Làm rõ giá trị của bạn: liệt kê ba giá trị bạn muốn sống theo nhất, và chọn một cách hành động rõ ràng cho một trong số đó trong tuần này.",
      ],
    },
  },
  AC: {
    name: { en: "Accomplishment", vi: "Thành Tựu" },
    letter: "A",
    nickname: { en: "Progress", vi: "Tiến Bộ" },
    description: {
      en: "A sense of competence, progress, and follow-through. Visible progress — even small wins — is one of the most reliable daily sources of motivation and confidence under pressure.",
      vi: "Cảm giác về năng lực, sự tiến bộ, và khả năng hoàn thành. Tiến bộ nhìn thấy được — dù chỉ là những chiến thắng nhỏ — là một trong những nguồn động lực và tự tin đáng tin cậy nhất mỗi ngày khi chịu áp lực.",
    },
    boosters: {
      en: [
        "Shrink the unit of done: set one small, completable goal per day and mark it complete — momentum beats magnitude.",
        "Keep a 'done list' alongside the to-do list; stress makes people forget everything they actually finished.",
        "Pick one stalled project and define only its very next physical action — stalled goals drain more than active ones.",
      ],
      vi: [
        "Thu nhỏ đơn vị 'hoàn thành': đặt một mục tiêu nhỏ, có thể hoàn thành mỗi ngày và đánh dấu xong — đà tiến quan trọng hơn quy mô.",
        "Giữ một 'danh sách đã hoàn thành' bên cạnh danh sách việc cần làm; căng thẳng khiến người ta quên mất tất cả những gì mình đã thực sự hoàn thành.",
        "Chọn một dự án đang bị đình trệ và chỉ xác định hành động cụ thể tiếp theo của nó — những mục tiêu bị đình trệ tiêu hao nhiều hơn những mục tiêu đang hoạt động.",
      ],
    },
  },
};

/* ---- Quick-version subset (2 per pillar, balanced) ---- */
const PERMA_CORE_IDS = ["pp01", "pp05", "en01", "en03", "re01", "re05", "me01", "me03", "ac01", "ac02"];
PERMA_QUESTIONS.forEach((q) => { q.core = PERMA_CORE_IDS.includes(q.id); });
const PERMA_QUESTIONS_CORE = PERMA_QUESTIONS.filter((q) => q.core);
