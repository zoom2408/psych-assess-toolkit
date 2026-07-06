/* =========================================================================
   STRENGTH PROFILES + VIRTUE DOMAINS — hand-written bilingual content
   -------------------------------------------------------------------------
   VIRTUES: the 6 virtue domains of the VIA classification (Peterson &
   Seligman), in canonical order. Used for section grouping and the
   virtue-balance chart in the report.

   STRENGTH_PROFILES: one entry per strength — report content only, never
   derived from scores. Each entry:
   { key, virtue, name{en,vi}, nickname{en,vi}, summary{en,vi},
     useMore: {en:[2 tips], vi:[2 tips]}, overuse{en,vi} }
   - useMore: concrete "use this strength MORE this week" suggestions —
     research on signature-strength interventions (using top strengths in
     new ways) is the basis for the report's action plan.
   - overuse: every strength has a shadow side when over-applied; shown
     for signature strengths as a balance note.
========================================================================= */

const VIRTUES = [
  { key: "wisdom", emoji: "🦉", name: { en: "Wisdom & Knowledge", vi: "Trí Tuệ & Hiểu Biết" }, blurb: { en: "Cognitive strengths — how you acquire and use knowledge.", vi: "Các thế mạnh nhận thức — cách bạn tiếp thu và vận dụng hiểu biết." }, strengths: ["creativity", "curiosity", "judgment", "loveOfLearning", "perspective"] },
  { key: "courage", emoji: "🦁", name: { en: "Courage", vi: "Can Đảm" }, blurb: { en: "Emotional strengths — exercising will in the face of opposition.", vi: "Các thế mạnh cảm xúc — thể hiện ý chí trước khó khăn và trở ngại." }, strengths: ["bravery", "honesty", "perseverance", "zest"] },
  { key: "humanity", emoji: "🤝", name: { en: "Humanity", vi: "Nhân Ái" }, blurb: { en: "Interpersonal strengths — tending and befriending others.", vi: "Các thế mạnh liên cá nhân — quan tâm và kết nối với người khác." }, strengths: ["love", "kindness", "socialIntelligence"] },
  { key: "justice", emoji: "⚖️", name: { en: "Justice", vi: "Công Bằng" }, blurb: { en: "Civic strengths — what makes healthy community life possible.", vi: "Các thế mạnh cộng đồng — nền tảng cho đời sống tập thể lành mạnh." }, strengths: ["teamwork", "fairness", "leadership"] },
  { key: "temperance", emoji: "🧘", name: { en: "Temperance", vi: "Tiết Chế" }, blurb: { en: "Strengths that protect against excess.", vi: "Các thế mạnh bảo vệ bạn khỏi sự thái quá." }, strengths: ["forgiveness", "humility", "prudence", "selfRegulation"] },
  { key: "transcendence", emoji: "✨", name: { en: "Transcendence", vi: "Vượt Lên Chính Mình" }, blurb: { en: "Strengths that connect you to the larger universe and provide meaning.", vi: "Các thế mạnh kết nối bạn với thế giới rộng lớn hơn và mang lại ý nghĩa." }, strengths: ["appreciationOfBeauty", "gratitude", "hope", "humor", "spirituality"] },
];

const STRENGTH_PROFILES = {
  creativity: {
    key: "creativity", virtue: "wisdom",
    name: { en: "Creativity", vi: "Sáng Tạo" },
    nickname: { en: "The Original Thinker", vi: "Người Tư Duy Độc Đáo" },
    summary: { en: "You generate novel, useful ideas and ways of doing things. Originality isn't a luxury for you — it's how you naturally approach problems.", vi: "Bạn tạo ra những ý tưởng và cách làm mới mẻ, hữu ích. Sự độc đáo không phải là điều xa xỉ với bạn — đó là cách bạn tiếp cận vấn đề một cách tự nhiên." },
    useMore: { en: ["Pick one routine task this week and deliberately redesign how you do it.", "Volunteer for the problem no one has cracked yet — that's where this strength earns the most."], vi: ["Chọn một công việc thường lệ trong tuần này và chủ động thiết kế lại cách bạn làm nó.", "Xung phong nhận vấn đề chưa ai giải được — đó là nơi thế mạnh này phát huy giá trị nhất."] },
    overuse: { en: "Watch for novelty for its own sake — sometimes the boring, proven solution is the right one.", vi: "Cẩn thận với việc đổi mới chỉ vì thích cái mới — đôi khi giải pháp cũ kỹ nhưng đã được chứng minh mới là lựa chọn đúng." },
  },
  curiosity: {
    key: "curiosity", virtue: "wisdom",
    name: { en: "Curiosity", vi: "Ham Tìm Hiểu" },
    nickname: { en: "The Explorer", vi: "Nhà Thám Hiểm" },
    summary: { en: "You take an active interest in experience for its own sake — exploring, questioning, and finding subjects fascinating that others walk past.", vi: "Bạn chủ động quan tâm đến trải nghiệm vì chính giá trị của nó — khám phá, đặt câu hỏi, và thấy thú vị ở những điều người khác bỏ qua." },
    useMore: { en: ["Ask one more question than usual in every conversation this week.", "Schedule a 'curiosity hour': explore a topic with zero practical justification."], vi: ["Đặt thêm một câu hỏi so với thường lệ trong mọi cuộc trò chuyện tuần này.", "Dành một 'giờ tò mò': khám phá một chủ đề mà không cần bất kỳ lý do thực dụng nào."] },
    overuse: { en: "Too many open threads can scatter your attention — pair curiosity with finishing.", vi: "Quá nhiều mối quan tâm dang dở có thể làm phân tán sự chú ý — hãy kết hợp sự tò mò với việc hoàn thành." },
  },
  judgment: {
    key: "judgment", virtue: "wisdom",
    name: { en: "Judgment", vi: "Phán Đoán" },
    nickname: { en: "The Clear-Eyed Analyst", vi: "Nhà Phân Tích Tỉnh Táo" },
    summary: { en: "You think things through from all sides, weigh evidence fairly, and update your views when the facts change. People rely on your clear head.", vi: "Bạn suy xét vấn đề từ mọi phía, cân nhắc bằng chứng công bằng, và điều chỉnh quan điểm khi sự thật thay đổi. Mọi người tin cậy vào cái đầu tỉnh táo của bạn." },
    useMore: { en: ["Offer to be the 'devil's advocate' when your team is about to make a big decision.", "Before your next major choice, write the strongest case AGAINST your preferred option."], vi: ["Đề nghị đóng vai 'người phản biện' khi nhóm của bạn sắp đưa ra quyết định lớn.", "Trước lựa chọn quan trọng tiếp theo, hãy viết ra lập luận mạnh nhất CHỐNG LẠI phương án bạn thích."] },
    overuse: { en: "Endless weighing can become indecision — set a deadline for analysis, then commit.", vi: "Cân nhắc mãi có thể trở thành thiếu quyết đoán — hãy đặt hạn chót cho việc phân tích, rồi cam kết hành động." },
  },
  loveOfLearning: {
    key: "loveOfLearning", virtue: "wisdom",
    name: { en: "Love of Learning", vi: "Yêu Thích Học Hỏi" },
    nickname: { en: "The Lifelong Student", vi: "Người Học Trọn Đời" },
    summary: { en: "You systematically deepen what you know — mastering new skills and bodies of knowledge brings you satisfaction whether or not anyone requires it.", vi: "Bạn đào sâu hiểu biết của mình một cách có hệ thống — việc thành thạo kỹ năng và kiến thức mới mang lại cho bạn sự thỏa mãn, dù có ai yêu cầu hay không." },
    useMore: { en: ["Turn something you're already doing at work or home into a deliberate learning project.", "Teach someone what you're learning — teaching is the fastest way to deepen mastery."], vi: ["Biến một việc bạn đang làm ở cơ quan hoặc ở nhà thành một dự án học tập có chủ đích.", "Dạy lại cho ai đó điều bạn đang học — dạy học là cách nhanh nhất để hiểu sâu hơn."] },
    overuse: { en: "Learning can become a comfortable way to postpone doing — ship something with what you already know.", vi: "Việc học có thể trở thành cách dễ chịu để trì hoãn hành động — hãy tạo ra kết quả với những gì bạn đã biết." },
  },
  perspective: {
    key: "perspective", virtue: "wisdom",
    name: { en: "Perspective", vi: "Tầm Nhìn Sâu Rộng" },
    nickname: { en: "The Wise Counselor", vi: "Người Cố Vấn Sáng Suốt" },
    summary: { en: "You see the big picture and help others make sense of their situations. Your counsel weighs what matters most, not just what's loudest.", vi: "Bạn nhìn được bức tranh toàn cảnh và giúp người khác hiểu rõ hoàn cảnh của họ. Lời khuyên của bạn cân nhắc điều quan trọng nhất, chứ không phải điều ồn ào nhất." },
    useMore: { en: ["Offer a structured listening session to someone facing a hard decision this week.", "In your next meeting, be the one who zooms out and restates what the group is really trying to achieve."], vi: ["Chủ động lắng nghe một cách nghiêm túc ai đó đang đối mặt với quyết định khó trong tuần này.", "Trong cuộc họp tới, hãy là người lùi lại một bước và nhắc lại điều nhóm thực sự muốn đạt được."] },
    overuse: { en: "Being everyone's advisor can crowd out your own needs — save some wisdom for your own decisions.", vi: "Làm cố vấn cho mọi người có thể khiến bạn quên nhu cầu của chính mình — hãy dành sự sáng suốt cho cả những quyết định của riêng bạn." },
  },
  bravery: {
    key: "bravery", virtue: "courage",
    name: { en: "Bravery", vi: "Dũng Cảm" },
    nickname: { en: "The Valiant One", vi: "Người Quả Cảm" },
    summary: { en: "You don't shrink from threat, challenge, or pain — and you speak up for what's right even when the room disagrees.", vi: "Bạn không chùn bước trước đe dọa, thử thách hay khó khăn — và bạn lên tiếng cho lẽ phải ngay cả khi cả căn phòng không đồng tình." },
    useMore: { en: ["Name the 'elephant in the room' constructively in one conversation this week.", "Do one thing you've been avoiding out of fear of awkwardness, not actual danger."], vi: ["Nêu ra vấn đề 'ai cũng thấy nhưng không ai nói' một cách xây dựng trong một cuộc trò chuyện tuần này.", "Làm một việc bạn đã né tránh vì ngại ngùng, chứ không phải vì nguy hiểm thật sự."] },
    overuse: { en: "Courage without calculation becomes recklessness — pick battles that are worth the cost.", vi: "Dũng cảm mà thiếu tính toán sẽ thành liều lĩnh — hãy chọn những trận chiến xứng đáng với cái giá phải trả." },
  },
  honesty: {
    key: "honesty", virtue: "courage",
    name: { en: "Honesty", vi: "Trung Thực" },
    nickname: { en: "The Authentic One", vi: "Người Chân Thật" },
    summary: { en: "You live truthfully — presenting yourself genuinely, keeping your word, and taking responsibility for your actions.", vi: "Bạn sống chân thật — thể hiện đúng con người mình, giữ lời hứa, và chịu trách nhiệm về hành động của mình." },
    useMore: { en: ["Give one piece of kind, honest feedback you've been holding back.", "Audit one area of life where you've been performing rather than being yourself — and drop the mask."], vi: ["Đưa ra một lời góp ý chân thành, tử tế mà bạn đã giữ trong lòng bấy lâu.", "Xem lại một khía cạnh cuộc sống nơi bạn đang 'diễn' thay vì là chính mình — và bỏ chiếc mặt nạ xuống."] },
    overuse: { en: "Truth without tact can wound — honesty lands best when paired with kindness and timing.", vi: "Sự thật thiếu khéo léo có thể gây tổn thương — trung thực hiệu quả nhất khi đi cùng sự tử tế và đúng thời điểm." },
  },
  perseverance: {
    key: "perseverance", virtue: "courage",
    name: { en: "Perseverance", vi: "Kiên Trì" },
    nickname: { en: "The Finisher", vi: "Người Về Đích" },
    summary: { en: "You finish what you start. Obstacles and tedium that stop others are, for you, just part of the path to done.", vi: "Bạn hoàn thành những gì mình bắt đầu. Trở ngại và sự nhàm chán khiến người khác dừng lại, với bạn, chỉ là một phần của con đường đi đến đích." },
    useMore: { en: ["Pick the stalled project that matters most and give it 25 focused minutes a day this week.", "Share your goal and weekly progress with one person — public persistence compounds."], vi: ["Chọn dự án dang dở quan trọng nhất và dành cho nó 25 phút tập trung mỗi ngày trong tuần này.", "Chia sẻ mục tiêu và tiến độ hàng tuần với một người — sự kiên trì được công khai sẽ nhân lên sức mạnh."] },
    overuse: { en: "Grit on the wrong goal is expensive — periodically check the goal still deserves the effort.", vi: "Bền bỉ với mục tiêu sai lầm sẽ rất tốn kém — hãy định kỳ kiểm tra xem mục tiêu còn xứng đáng với nỗ lực không." },
  },
  zest: {
    key: "zest", virtue: "courage",
    name: { en: "Zest", vi: "Nhiệt Huyết" },
    nickname: { en: "The Spark", vi: "Ngọn Lửa Truyền Cảm Hứng" },
    summary: { en: "You approach life with energy and excitement, doing things wholeheartedly rather than halfway. Your vitality lifts the people around you.", vi: "Bạn sống với năng lượng và sự hào hứng, làm mọi việc hết mình thay vì nửa vời. Sức sống của bạn nâng đỡ những người xung quanh." },
    useMore: { en: ["Start meetings or family dinners by sharing one thing you're genuinely excited about.", "Protect your energy sources — sleep and movement are what keep this strength fueled."], vi: ["Bắt đầu cuộc họp hoặc bữa cơm gia đình bằng cách chia sẻ một điều bạn thực sự hào hứng.", "Bảo vệ nguồn năng lượng của bạn — giấc ngủ và vận động là thứ nuôi dưỡng thế mạnh này."] },
    overuse: { en: "Full throttle everywhere leads to burnout — even the spark needs deliberate rest.", vi: "Bật hết công suất ở mọi nơi sẽ dẫn đến kiệt sức — ngay cả ngọn lửa cũng cần được nghỉ ngơi có chủ đích." },
  },
  love: {
    key: "love", virtue: "humanity",
    name: { en: "Love", vi: "Yêu Thương" },
    nickname: { en: "The Devoted Heart", vi: "Trái Tim Tận Tụy" },
    summary: { en: "You value close relationships deeply and are good at both giving and receiving warmth. Connection is one of your core capacities.", vi: "Bạn trân trọng sâu sắc các mối quan hệ gần gũi và giỏi cả việc trao đi lẫn đón nhận sự ấm áp. Kết nối là một trong những năng lực cốt lõi của bạn." },
    useMore: { en: ["Tell one important person specifically what they mean to you — in words, this week.", "Create one small ritual of connection (a weekly call, a shared walk) and keep it."], vi: ["Nói với một người quan trọng cụ thể rằng họ có ý nghĩa thế nào với bạn — bằng lời, trong tuần này.", "Tạo một thói quen kết nối nhỏ (cuộc gọi hàng tuần, buổi đi dạo chung) và duy trì nó."] },
    overuse: { en: "Pouring everything into others can erase your own boundaries — love yourself with the same devotion.", vi: "Dốc hết tất cả cho người khác có thể xóa nhòa ranh giới của chính bạn — hãy yêu thương bản thân với cùng sự tận tụy đó." },
  },
  kindness: {
    key: "kindness", virtue: "humanity",
    name: { en: "Kindness", vi: "Tử Tế" },
    nickname: { en: "The Generous Helper", vi: "Người Giúp Đỡ Hào Phóng" },
    summary: { en: "You do good things for others — favors, care, and generosity — without needing to be asked and often without needing anything back.", vi: "Bạn làm điều tốt cho người khác — giúp đỡ, quan tâm, và hào phóng — không cần được nhờ vả và thường không cần được đáp lại." },
    useMore: { en: ["Do one anonymous act of kindness this week — generosity with no credit is the purest form of this strength.", "Aim your kindness where it's overlooked: the person everyone else forgets to check on."], vi: ["Làm một việc tử tế ẩn danh trong tuần này — sự hào phóng không cần ghi công là dạng thuần khiết nhất của thế mạnh này.", "Hướng sự tử tế đến nơi bị bỏ quên: người mà ai cũng quên hỏi thăm."] },
    overuse: { en: "Helping everyone can become self-neglect — kindness includes saying no when your tank is empty.", vi: "Giúp đỡ tất cả mọi người có thể thành bỏ bê bản thân — tử tế bao gồm cả việc từ chối khi bạn đã cạn kiệt." },
  },
  socialIntelligence: {
    key: "socialIntelligence", virtue: "humanity",
    name: { en: "Social Intelligence", vi: "Trí Tuệ Xã Hội" },
    nickname: { en: "The People Reader", vi: "Người Thấu Hiểu Lòng Người" },
    summary: { en: "You read feelings and motives accurately — your own and others' — and know how to fit into different social situations gracefully.", vi: "Bạn đọc chính xác cảm xúc và động cơ — của mình và của người khác — và biết cách hòa nhập khéo léo vào các tình huống xã hội khác nhau." },
    useMore: { en: ["Use your read of the room out loud: 'It feels like we're hesitant about this — is that right?'", "Mentor someone who struggles socially; what's obvious to you is a superpower to them."], vi: ["Nói to điều bạn cảm nhận được từ không khí chung: 'Có vẻ mọi người còn ngần ngại về điều này — đúng không?'", "Hướng dẫn ai đó vụng về trong giao tiếp; điều hiển nhiên với bạn là siêu năng lực đối với họ."] },
    overuse: { en: "Reading everyone constantly is exhausting and can shade into people-pleasing — you're allowed to just be present.", vi: "Liên tục 'đọc vị' mọi người rất mệt mỏi và có thể trượt thành chiều lòng người khác — bạn được phép chỉ đơn giản là hiện diện." },
  },
  teamwork: {
    key: "teamwork", virtue: "justice",
    name: { en: "Teamwork", vi: "Tinh Thần Đồng Đội" },
    nickname: { en: "The Loyal Teammate", vi: "Đồng Đội Trung Thành" },
    summary: { en: "You work best as part of a group, do your share reliably, and feel real loyalty to the teams and communities you belong to.", vi: "Bạn làm việc tốt nhất trong một tập thể, hoàn thành phần việc của mình một cách đáng tin cậy, và trung thành thực sự với các nhóm và cộng đồng mình thuộc về." },
    useMore: { en: ["Take on the unglamorous team task no one wants — and notice how much it moves the group.", "Publicly credit a teammate's contribution that would otherwise go unseen."], vi: ["Nhận lấy phần việc chung không hào nhoáng mà không ai muốn làm — và để ý xem nó thúc đẩy cả nhóm nhiều đến mức nào.", "Công khai ghi nhận đóng góp của một đồng đội mà nếu không sẽ chẳng ai nhìn thấy."] },
    overuse: { en: "Loyalty shouldn't silence you — a good teammate also challenges the group when it's heading the wrong way.", vi: "Lòng trung thành không nên khiến bạn im lặng — một đồng đội tốt cũng biết phản biện khi cả nhóm đang đi sai hướng." },
  },
  fairness: {
    key: "fairness", virtue: "justice",
    name: { en: "Fairness", vi: "Công Tâm" },
    nickname: { en: "The Even-Handed Judge", vi: "Vị Quan Tòa Công Minh" },
    summary: { en: "You treat people by consistent principles, give everyone a fair chance, and refuse to let personal feelings bias your decisions about others.", vi: "Bạn đối xử với mọi người theo những nguyên tắc nhất quán, cho mọi người cơ hội công bằng, và không để cảm xúc cá nhân làm thiên lệch quyết định của mình." },
    useMore: { en: ["Volunteer to mediate a disagreement — your instinct for balance is rare and needed.", "Check one of your routine decisions (who gets asked, included, credited) for hidden favoritism."], vi: ["Xung phong hòa giải một bất đồng — trực giác cân bằng của bạn hiếm có và rất cần thiết.", "Kiểm tra một quyết định thường lệ của bạn (ai được hỏi, được tham gia, được ghi nhận) xem có thiên vị ngầm không."] },
    overuse: { en: "Rigid rule-application can miss context — sometimes fairness means treating different situations differently.", vi: "Áp dụng nguyên tắc cứng nhắc có thể bỏ qua hoàn cảnh — đôi khi công bằng nghĩa là xử lý khác nhau cho những tình huống khác nhau." },
  },
  leadership: {
    key: "leadership", virtue: "justice",
    name: { en: "Leadership", vi: "Lãnh Đạo" },
    nickname: { en: "The Organizer", vi: "Người Dẫn Dắt" },
    summary: { en: "You organize group activities and see that they happen, while keeping good relations inside the group. People look to you for direction.", vi: "Bạn tổ chức các hoạt động tập thể và đảm bảo chúng diễn ra, đồng thời giữ quan hệ tốt đẹp trong nhóm. Mọi người trông đợi bạn định hướng." },
    useMore: { en: ["Take point on one initiative that's drifting without an owner.", "Develop someone: delegate a visible task to a quieter member and back them publicly."], vi: ["Đứng ra phụ trách một sáng kiến đang trôi nổi không có người chịu trách nhiệm.", "Phát triển người khác: giao một nhiệm vụ dễ được ghi nhận cho một thành viên trầm lặng và công khai ủng hộ họ."] },
    overuse: { en: "Always taking charge can crowd out other voices — leadership includes engineering moments to follow.", vi: "Luôn nắm quyền điều hành có thể lấn át tiếng nói khác — lãnh đạo bao gồm cả việc chủ động tạo ra những lúc mình lùi lại làm người theo sau." },
  },
  forgiveness: {
    key: "forgiveness", virtue: "temperance",
    name: { en: "Forgiveness", vi: "Bao Dung" },
    nickname: { en: "The Grudge-Free Heart", vi: "Trái Tim Không Oán Hận" },
    summary: { en: "You forgive those who do wrong, give second chances, and refuse to let resentment run your life. Mercy, not vengeance, is your default.", vi: "Bạn tha thứ cho người làm sai, trao cơ hội thứ hai, và không để sự oán giận điều khiển cuộc sống mình. Khoan dung, chứ không phải trả đũa, là lựa chọn mặc định của bạn." },
    useMore: { en: ["Write (not necessarily send) a letter releasing one old grievance you're still carrying.", "When someone slips up this week, respond with curiosity about what happened before judgment."], vi: ["Viết (không nhất thiết phải gửi) một lá thư buông bỏ một nỗi ấm ức cũ bạn vẫn còn mang theo.", "Khi ai đó phạm lỗi trong tuần này, hãy phản ứng bằng sự tò mò về nguyên nhân trước khi phán xét."] },
    overuse: { en: "Forgiving repeated harm without boundaries invites more of it — mercy pairs with clear limits.", vi: "Tha thứ cho tổn hại lặp đi lặp lại mà không có ranh giới sẽ mời gọi thêm tổn hại — bao dung phải đi cùng giới hạn rõ ràng." },
  },
  humility: {
    key: "humility", virtue: "temperance",
    name: { en: "Humility", vi: "Khiêm Nhường" },
    nickname: { en: "The Quiet Achiever", vi: "Người Thành Đạt Thầm Lặng" },
    summary: { en: "You let your accomplishments speak for themselves and see yourself accurately — neither inflated nor diminished. Others find you refreshingly grounded.", vi: "Bạn để thành quả tự lên tiếng và nhìn nhận bản thân chính xác — không thổi phồng cũng không hạ thấp. Mọi người thấy ở bạn sự chân chất đáng quý." },
    useMore: { en: ["Ask for feedback from someone junior to you and thank them for it sincerely.", "In your next success, spotlight the contributions that made it possible before your own."], vi: ["Xin nhận xét từ một người ít kinh nghiệm hơn bạn và chân thành cảm ơn họ.", "Trong thành công tiếp theo, hãy làm nổi bật những đóng góp đã tạo nên nó trước khi nói về phần của mình."] },
    overuse: { en: "Never claiming credit lets others define your value — accurate self-presentation is not arrogance.", vi: "Không bao giờ nhận công khiến người khác định đoạt giá trị của bạn — thể hiện đúng năng lực bản thân không phải là kiêu ngạo." },
  },
  prudence: {
    key: "prudence", virtue: "temperance",
    name: { en: "Prudence", vi: "Thận Trọng" },
    nickname: { en: "The Careful Planner", vi: "Người Lập Kế Hoạch Cẩn Trọng" },
    summary: { en: "You're careful about your choices, look before you leap, and don't say or do things you'll later regret. Your future self thanks you regularly.", vi: "Bạn cẩn thận với các lựa chọn của mình, nhìn trước khi nhảy, và không nói hay làm những điều sẽ phải hối tiếc. 'Bạn của tương lai' thường xuyên cảm ơn bạn." },
    useMore: { en: ["Offer to pre-mortem a team plan: 'imagine this failed — what went wrong?'", "Apply your foresight to one long-horizon personal area (health, savings) you've been coasting on."], vi: ["Đề nghị 'khám nghiệm trước' một kế hoạch của nhóm: 'giả sử nó thất bại — điều gì đã sai?'", "Áp dụng tầm nhìn xa của bạn vào một lĩnh vực cá nhân dài hạn (sức khỏe, tiết kiệm) mà bạn đang lơ là."] },
    overuse: { en: "Excess caution has a cost too — some of life's best returns require acting before you feel 100% ready.", vi: "Thận trọng quá mức cũng có cái giá của nó — nhiều thành quả tốt nhất của cuộc sống đòi hỏi hành động trước khi bạn cảm thấy sẵn sàng 100%." },
  },
  selfRegulation: {
    key: "selfRegulation", virtue: "temperance",
    name: { en: "Self-Regulation", vi: "Tự Chủ" },
    nickname: { en: "The Disciplined One", vi: "Người Kỷ Luật" },
    summary: { en: "You regulate what you feel and do — managing impulses, appetites, and emotions rather than being managed by them.", vi: "Bạn điều chỉnh được cảm xúc và hành động của mình — làm chủ các xung động, ham muốn và cảm xúc thay vì bị chúng điều khiển." },
    useMore: { en: ["Pick the one habit with the biggest ripple effect (sleep is usually it) and guard it fiercely this week.", "Lend your structure to someone: help a friend design a routine they keep failing to start."], vi: ["Chọn thói quen có tác động lan tỏa lớn nhất (thường là giấc ngủ) và bảo vệ nó nghiêm ngặt trong tuần này.", "Chia sẻ tính kỷ luật của bạn: giúp một người bạn thiết kế thói quen mà họ mãi chưa bắt đầu được."] },
    overuse: { en: "Total control can squeeze out spontaneity and joy — schedule some unscheduled time.", vi: "Kiểm soát tuyệt đối có thể bóp nghẹt sự ngẫu hứng và niềm vui — hãy dành cả những khoảng thời gian không theo kế hoạch nào." },
  },
  appreciationOfBeauty: {
    key: "appreciationOfBeauty", virtue: "transcendence",
    name: { en: "Appreciation of Beauty & Excellence", vi: "Cảm Thụ Cái Đẹp & Sự Xuất Sắc" },
    nickname: { en: "The Awe-Seeker", vi: "Người Tìm Kiếm Sự Kỳ Diệu" },
    summary: { en: "You notice and savor beauty, excellence, and skilled performance in every domain of life — and it genuinely elevates you.", vi: "Bạn nhận ra và tận hưởng cái đẹp, sự xuất sắc, và tài năng trong mọi lĩnh vực của cuộc sống — và điều đó thực sự nâng tâm hồn bạn lên." },
    useMore: { en: ["Take one 'beauty walk' this week with no phone — just noticing.", "Share what moves you: send someone the song, image, or performance that gave you chills, and say why."], vi: ["Đi một buổi 'dạo ngắm cái đẹp' trong tuần này mà không mang điện thoại — chỉ để quan sát.", "Chia sẻ điều làm bạn rung động: gửi cho ai đó bài hát, hình ảnh, hoặc màn trình diễn khiến bạn nổi da gà, và nói lý do."] },
    overuse: { en: "Perfectionism is this strength's shadow — high standards for the world can turn harsh on yourself and others.", vi: "Chủ nghĩa hoàn hảo là mặt tối của thế mạnh này — tiêu chuẩn cao với thế giới có thể trở nên khắc nghiệt với chính bạn và người khác." },
  },
  gratitude: {
    key: "gratitude", virtue: "transcendence",
    name: { en: "Gratitude", vi: "Biết Ơn" },
    nickname: { en: "The Thankful Heart", vi: "Trái Tim Tri Ân" },
    summary: { en: "You're aware of the good things that happen to you and never take them for granted — and you take time to express thanks.", vi: "Bạn ý thức được những điều tốt đẹp đến với mình và không bao giờ xem chúng là hiển nhiên — và bạn dành thời gian để bày tỏ lòng biết ơn." },
    useMore: { en: ["Write a gratitude letter to someone who shaped your life and read it to them — one of the best-tested exercises in positive psychology.", "End each day this week by noting three specific good things and your role in them."], vi: ["Viết một lá thư tri ân gửi người đã góp phần định hình cuộc đời bạn và đọc cho họ nghe — một trong những bài tập được kiểm chứng tốt nhất của tâm lý học tích cực.", "Kết thúc mỗi ngày trong tuần này bằng cách ghi lại ba điều tốt cụ thể và vai trò của bạn trong đó."] },
    overuse: { en: "Gratitude shouldn't gag legitimate complaints — you can be thankful and still ask for better.", vi: "Lòng biết ơn không nên bịt miệng những phàn nàn chính đáng — bạn có thể biết ơn mà vẫn đòi hỏi điều tốt hơn." },
  },
  hope: {
    key: "hope", virtue: "transcendence",
    name: { en: "Hope", vi: "Hy Vọng" },
    nickname: { en: "The Future-Builder", vi: "Người Kiến Tạo Tương Lai" },
    summary: { en: "You expect good things and, more importantly, believe your actions can bring them about. Optimism plus agency is a powerful engine.", vi: "Bạn kỳ vọng những điều tốt đẹp và, quan trọng hơn, tin rằng hành động của mình có thể tạo ra chúng. Lạc quan cộng với tinh thần chủ động là một động cơ mạnh mẽ." },
    useMore: { en: ["Write your 'best possible self' one year from now in concrete detail, then extract this month's first step.", "Be the hope-lender: help someone stuck see two realistic paths forward."], vi: ["Viết về 'phiên bản tốt nhất của bạn' một năm sau một cách cụ thể, rồi rút ra bước đi đầu tiên cho tháng này.", "Làm người 'cho vay hy vọng': giúp ai đó đang bế tắc nhìn thấy hai con đường khả thi phía trước."] },
    overuse: { en: "Optimism that skips risk-checking gets blindsided — let hope set the destination and prudence check the route.", vi: "Lạc quan mà bỏ qua việc đánh giá rủi ro sẽ dễ bị bất ngờ — hãy để hy vọng chọn đích đến và sự thận trọng kiểm tra lộ trình." },
  },
  humor: {
    key: "humor", virtue: "transcendence",
    name: { en: "Humor", vi: "Hài Hước" },
    nickname: { en: "The Mood-Lifter", vi: "Người Thắp Sáng Không Khí" },
    summary: { en: "You like to laugh and make others laugh — bringing lightness, play, and perspective, especially when things get heavy.", vi: "Bạn thích cười và làm người khác cười — mang đến sự nhẹ nhõm, vui tươi, và góc nhìn thoáng đãng, nhất là khi mọi thứ trở nên nặng nề." },
    useMore: { en: ["Deploy your humor where it's scarcest — the tense meeting, the tired friend, the stressful week.", "Collect what makes you laugh (clips, memories, jokes) into a personal 'first-aid kit' for hard days."], vi: ["Dùng sự hài hước của bạn ở nơi khan hiếm nó nhất — cuộc họp căng thẳng, người bạn mệt mỏi, tuần lễ áp lực.", "Sưu tầm những gì làm bạn cười (video, kỷ niệm, chuyện vui) thành 'túi cứu thương' cá nhân cho những ngày khó khăn."] },
    overuse: { en: "Jokes can become armor that deflects real feelings — some moments need you serious and present.", vi: "Đùa cợt có thể trở thành tấm khiên né tránh cảm xúc thật — có những khoảnh khắc cần bạn nghiêm túc và hiện diện trọn vẹn." },
  },
  spirituality: {
    key: "spirituality", virtue: "transcendence",
    name: { en: "Spirituality & Sense of Meaning", vi: "Đời Sống Tinh Thần & Ý Nghĩa" },
    nickname: { en: "The Meaning-Maker", vi: "Người Kiến Tạo Ý Nghĩa" },
    summary: { en: "You hold coherent beliefs about the higher purpose and meaning of life, and they genuinely shape your conduct and give you comfort.", vi: "Bạn có những niềm tin nhất quán về mục đích cao hơn và ý nghĩa của cuộc sống, và chúng thực sự định hình cách bạn hành xử cũng như mang lại cho bạn sự an ủi." },
    useMore: { en: ["Reconnect one weekly activity to your deeper 'why' — write the connection down where you'll see it.", "Make space for your practice (reflection, prayer, meditation, nature) at a fixed time this week."], vi: ["Kết nối lại một hoạt động hàng tuần với lý do sâu xa của nó — viết mối liên hệ đó ra nơi bạn dễ nhìn thấy.", "Dành không gian cho thực hành của bạn (chiêm nghiệm, cầu nguyện, thiền, hòa mình vào thiên nhiên) vào một giờ cố định trong tuần này."] },
    overuse: { en: "Strong convictions can shade into certainty about others' paths — meaning is deeply personal; hold yours firmly and others' gently.", vi: "Niềm tin mạnh mẽ có thể trượt thành sự chắc chắn về con đường của người khác — ý nghĩa là điều rất riêng tư; hãy giữ vững niềm tin của mình và nhẹ nhàng với niềm tin của người khác." },
  },
};
