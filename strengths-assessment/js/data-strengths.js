/* =========================================================================
   CHARACTER STRENGTHS ITEM BANK — VIA-classification-inspired, original items
   -------------------------------------------------------------------------
   24 strengths (Peterson & Seligman's VIA classification taxonomy) grouped
   under 6 virtues. Items are ORIGINALLY WRITTEN self-report statements —
   inspired by the published classification, NOT reproductions of the
   proprietary VIA-IS or CliftonStrengths instruments.

   Item shape: { id, strength, text: {en, vi} }
   - 4 items per strength × 24 strengths = 96 items (Full).
   - `core: true` marks the first 2 items of each strength → 48-item Quick
     subset (STRENGTHS_QUESTIONS_CORE). Always keep counts even per
     strength in BOTH banks (see design doc §3 balance rule).
   - Answered on a 1–5 agreement scale ("Very unlike me" … "Very like me").

   ID prefixes (2 letters, all unique):
   cr creativity · cu curiosity · ju judgment · lo loveOfLearning ·
   pe perspective · br bravery · ho honesty · pr perseverance · ze zest ·
   lv love · ki kindness · si socialIntelligence · te teamwork ·
   fa fairness · le leadership · fo forgiveness · hu humility ·
   pu prudence · sr selfRegulation · ab appreciationOfBeauty ·
   gr gratitude · hp hope · hm humor · sp spirituality
========================================================================= */

const STRENGTHS_QUESTIONS = [
  // ---- WISDOM & KNOWLEDGE -------------------------------------------------
  // Creativity
  { id: "cr01", strength: "creativity", text: { en: "Coming up with new ideas or original ways of doing things comes naturally to me.", vi: "Việc nghĩ ra ý tưởng mới hoặc cách làm độc đáo đến với tôi một cách tự nhiên." } },
  { id: "cr02", strength: "creativity", text: { en: "When something isn't working, I enjoy inventing a different approach rather than repeating the usual one.", vi: "Khi điều gì đó không hiệu quả, tôi thích sáng tạo một cách tiếp cận khác thay vì lặp lại cách quen thuộc." } },
  { id: "cr03", strength: "creativity", text: { en: "People often come to me when they need a fresh or unconventional idea.", vi: "Mọi người thường tìm đến tôi khi họ cần một ý tưởng mới mẻ hoặc khác biệt." } },
  { id: "cr04", strength: "creativity", text: { en: "I like expressing myself in original ways — in my work, words, or hobbies.", vi: "Tôi thích thể hiện bản thân theo những cách độc đáo — trong công việc, lời nói, hoặc sở thích." } },
  // Curiosity
  { id: "cu01", strength: "curiosity", text: { en: "I find myself genuinely fascinated by many different topics.", vi: "Tôi thực sự bị cuốn hút bởi rất nhiều chủ đề khác nhau." } },
  { id: "cu02", strength: "curiosity", text: { en: "I love exploring new places, foods, or experiences just to see what they're like.", vi: "Tôi thích khám phá những địa điểm, món ăn, hoặc trải nghiệm mới chỉ để xem chúng như thế nào." } },
  { id: "cu03", strength: "curiosity", text: { en: "I ask a lot of questions because I truly want to understand how things work.", vi: "Tôi hay đặt nhiều câu hỏi vì tôi thực sự muốn hiểu mọi thứ vận hành ra sao." } },
  { id: "cu04", strength: "curiosity", text: { en: "Boredom is rare for me — there is almost always something interesting to explore.", vi: "Tôi hiếm khi thấy chán — hầu như lúc nào cũng có điều gì đó thú vị để khám phá." } },
  // Judgment / critical thinking
  { id: "ju01", strength: "judgment", text: { en: "I think through all sides of an issue before making up my mind.", vi: "Tôi cân nhắc mọi khía cạnh của một vấn đề trước khi đưa ra quyết định." } },
  { id: "ju02", strength: "judgment", text: { en: "I change my opinion when good evidence goes against it.", vi: "Tôi thay đổi quan điểm khi có bằng chứng thuyết phục đi ngược lại nó." } },
  { id: "ju03", strength: "judgment", text: { en: "People describe me as level-headed and hard to fool.", vi: "Mọi người mô tả tôi là người điềm tĩnh, tỉnh táo và khó bị lừa." } },
  { id: "ju04", strength: "judgment", text: { en: "I try to separate facts from assumptions before drawing conclusions.", vi: "Tôi cố gắng tách bạch sự thật khỏi giả định trước khi rút ra kết luận." } },
  // Love of learning
  { id: "lo01", strength: "loveOfLearning", text: { en: "I get real joy from learning something new, even when I don't have to.", vi: "Tôi cảm thấy niềm vui thực sự khi học điều gì đó mới, ngay cả khi không bắt buộc." } },
  { id: "lo02", strength: "loveOfLearning", text: { en: "I regularly read, watch, or listen to things just to master a topic more deeply.", vi: "Tôi thường xuyên đọc, xem, hoặc nghe chỉ để hiểu sâu hơn về một chủ đề." } },
  { id: "lo03", strength: "loveOfLearning", text: { en: "I enjoy the process of becoming skilled at something new, even the difficult early stage.", vi: "Tôi tận hưởng quá trình trở nên thành thạo một điều mới, kể cả giai đoạn đầu khó khăn." } },
  { id: "lo04", strength: "loveOfLearning", text: { en: "Given free time, I often choose to learn something over other entertainment.", vi: "Khi có thời gian rảnh, tôi thường chọn học một điều gì đó thay vì các hình thức giải trí khác." } },
  // Perspective / wisdom
  { id: "pe01", strength: "perspective", text: { en: "People come to me for advice on important matters.", vi: "Mọi người tìm đến tôi để xin lời khuyên về những vấn đề quan trọng." } },
  { id: "pe02", strength: "perspective", text: { en: "I can usually see the bigger picture when others are stuck in the details.", vi: "Tôi thường nhìn được bức tranh toàn cảnh khi người khác còn mắc kẹt trong chi tiết." } },
  { id: "pe03", strength: "perspective", text: { en: "I'm good at helping others make sense of complicated situations.", vi: "Tôi giỏi giúp người khác hiểu rõ những tình huống phức tạp." } },
  { id: "pe04", strength: "perspective", text: { en: "Friends say my advice is wise and balanced, not just what they want to hear.", vi: "Bạn bè nói lời khuyên của tôi sáng suốt và cân bằng, không chỉ là điều họ muốn nghe." } },

  // ---- COURAGE ------------------------------------------------------------
  // Bravery
  { id: "br01", strength: "bravery", text: { en: "I speak up for what I believe is right, even when it's unpopular.", vi: "Tôi lên tiếng cho điều tôi tin là đúng, ngay cả khi nó không được ủng hộ." } },
  { id: "br02", strength: "bravery", text: { en: "Fear rarely stops me from doing what needs to be done.", vi: "Nỗi sợ hiếm khi ngăn tôi làm điều cần phải làm." } },
  { id: "br03", strength: "bravery", text: { en: "I face difficult situations head-on rather than hoping they will resolve themselves.", vi: "Tôi đối mặt trực diện với những tình huống khó khăn thay vì hy vọng chúng tự được giải quyết." } },
  { id: "br04", strength: "bravery", text: { en: "I have stood up for someone or something even when it cost me personally.", vi: "Tôi đã từng đứng lên bảo vệ ai đó hoặc điều gì đó ngay cả khi bản thân phải chịu thiệt." } },
  // Honesty
  { id: "ho01", strength: "honesty", text: { en: "I present myself to others as I truly am, without pretending.", vi: "Tôi thể hiện bản thân đúng như con người thật của mình, không giả vờ." } },
  { id: "ho02", strength: "honesty", text: { en: "Keeping my word matters more to me than convenience.", vi: "Giữ lời hứa quan trọng với tôi hơn là sự thuận tiện." } },
  { id: "ho03", strength: "honesty", text: { en: "People trust me because I say what I mean, even when it's uncomfortable.", vi: "Mọi người tin tưởng tôi vì tôi nói đúng suy nghĩ của mình, ngay cả khi điều đó không dễ chịu." } },
  { id: "ho04", strength: "honesty", text: { en: "I take responsibility for my mistakes instead of covering them up.", vi: "Tôi chịu trách nhiệm về lỗi lầm của mình thay vì che giấu chúng." } },
  // Perseverance
  { id: "pr01", strength: "perseverance", text: { en: "I finish what I start, even when it gets tedious or hard.", vi: "Tôi hoàn thành những gì mình bắt đầu, ngay cả khi nó trở nên nhàm chán hoặc khó khăn." } },
  { id: "pr02", strength: "perseverance", text: { en: "Setbacks make me try again rather than give up.", vi: "Những thất bại khiến tôi thử lại thay vì bỏ cuộc." } },
  { id: "pr03", strength: "perseverance", text: { en: "I can keep working steadily toward a goal that takes months or years.", vi: "Tôi có thể kiên trì làm việc hướng tới một mục tiêu kéo dài hàng tháng hoặc hàng năm." } },
  { id: "pr04", strength: "perseverance", text: { en: "Once I commit to something, distractions rarely pull me off course.", vi: "Một khi đã cam kết với điều gì, những xao nhãng hiếm khi kéo tôi chệch hướng." } },
  // Zest
  { id: "ze01", strength: "zest", text: { en: "I wake up most days feeling excited about what's ahead.", vi: "Hầu hết các ngày tôi thức dậy với cảm giác háo hức về những gì phía trước." } },
  { id: "ze02", strength: "zest", text: { en: "I throw myself into whatever I do with energy and enthusiasm.", vi: "Tôi dồn hết năng lượng và nhiệt huyết vào bất cứ việc gì mình làm." } },
  { id: "ze03", strength: "zest", text: { en: "People say my energy is contagious.", vi: "Mọi người nói năng lượng của tôi có sức lan tỏa." } },
  { id: "ze04", strength: "zest", text: { en: "I feel alive and activated more often than tired and flat.", vi: "Tôi cảm thấy tràn đầy sức sống và hứng khởi thường xuyên hơn là mệt mỏi và uể oải." } },

  // ---- HUMANITY -----------------------------------------------------------
  // Love
  { id: "lv01", strength: "love", text: { en: "There are people in my life whose wellbeing matters to me as much as my own.", vi: "Trong cuộc sống của tôi có những người mà hạnh phúc của họ quan trọng với tôi như của chính mình." } },
  { id: "lv02", strength: "love", text: { en: "I find it easy both to give warmth and to receive it from those close to me.", vi: "Tôi thấy dễ dàng cả trong việc trao đi sự ấm áp lẫn đón nhận nó từ những người thân thiết." } },
  { id: "lv03", strength: "love", text: { en: "I make time for the people I love, even when life is busy.", vi: "Tôi dành thời gian cho những người tôi yêu thương, ngay cả khi cuộc sống bận rộn." } },
  { id: "lv04", strength: "love", text: { en: "Close, caring relationships are among the things I value most.", vi: "Những mối quan hệ gần gũi, yêu thương là một trong những điều tôi trân trọng nhất." } },
  // Kindness
  { id: "ki01", strength: "kindness", text: { en: "I regularly do favors or good deeds for others without being asked.", vi: "Tôi thường xuyên giúp đỡ hoặc làm việc tốt cho người khác mà không cần được nhờ." } },
  { id: "ki02", strength: "kindness", text: { en: "Helping someone brightens my day, even when I get nothing back.", vi: "Giúp đỡ ai đó làm ngày của tôi tươi sáng hơn, ngay cả khi tôi không nhận lại gì." } },
  { id: "ki03", strength: "kindness", text: { en: "I notice when someone is struggling and act to make things easier for them.", vi: "Tôi nhận ra khi ai đó đang gặp khó khăn và hành động để giúp mọi thứ dễ dàng hơn cho họ." } },
  { id: "ki04", strength: "kindness", text: { en: "People would describe me as generous with my time and care.", vi: "Mọi người sẽ mô tả tôi là người hào phóng với thời gian và sự quan tâm của mình." } },
  // Social intelligence
  { id: "si01", strength: "socialIntelligence", text: { en: "I can usually sense what others are feeling, even when they don't say it.", vi: "Tôi thường cảm nhận được người khác đang cảm thấy gì, ngay cả khi họ không nói ra." } },
  { id: "si02", strength: "socialIntelligence", text: { en: "I know how to adjust what I say to fit different people and situations.", vi: "Tôi biết cách điều chỉnh lời nói cho phù hợp với từng người và từng tình huống." } },
  { id: "si03", strength: "socialIntelligence", text: { en: "I quickly notice the mood of a room when I walk in.", vi: "Tôi nhanh chóng nhận ra bầu không khí của căn phòng khi bước vào." } },
  { id: "si04", strength: "socialIntelligence", text: { en: "I understand what motivates the people around me.", vi: "Tôi hiểu điều gì thúc đẩy những người xung quanh mình." } },

  // ---- JUSTICE ------------------------------------------------------------
  // Teamwork
  { id: "te01", strength: "teamwork", text: { en: "I work at my best as part of a group and do my share without being reminded.", vi: "Tôi làm việc tốt nhất khi là một phần của nhóm và hoàn thành phần việc của mình mà không cần nhắc nhở." } },
  { id: "te02", strength: "teamwork", text: { en: "I put the team's success ahead of my personal credit.", vi: "Tôi đặt thành công của nhóm lên trên công trạng cá nhân." } },
  { id: "te03", strength: "teamwork", text: { en: "I feel a strong sense of duty to the groups and communities I belong to.", vi: "Tôi cảm thấy có trách nhiệm sâu sắc với các nhóm và cộng đồng mà mình thuộc về." } },
  { id: "te04", strength: "teamwork", text: { en: "Colleagues can count on me to support group decisions once they're made.", vi: "Đồng nghiệp có thể tin tưởng tôi sẽ ủng hộ các quyết định chung một khi đã được đưa ra." } },
  // Fairness
  { id: "fa01", strength: "fairness", text: { en: "I treat everyone by the same rules, whether or not I like them personally.", vi: "Tôi đối xử với mọi người theo cùng một nguyên tắc, bất kể tôi có quý mến họ hay không." } },
  { id: "fa02", strength: "fairness", text: { en: "I don't let my personal feelings bias my decisions about others.", vi: "Tôi không để cảm xúc cá nhân làm thiên lệch các quyết định của mình về người khác." } },
  { id: "fa03", strength: "fairness", text: { en: "It bothers me deeply when someone is treated unjustly, even a stranger.", vi: "Tôi thực sự khó chịu khi ai đó bị đối xử bất công, kể cả người xa lạ." } },
  { id: "fa04", strength: "fairness", text: { en: "When dividing work or rewards, I make sure everyone gets a fair share.", vi: "Khi phân chia công việc hoặc phần thưởng, tôi đảm bảo mọi người đều nhận được phần công bằng." } },
  // Leadership
  { id: "le01", strength: "leadership", text: { en: "I naturally step up to organize people and activities when a group needs direction.", vi: "Tôi tự nhiên đứng ra tổ chức con người và hoạt động khi nhóm cần định hướng." } },
  { id: "le02", strength: "leadership", text: { en: "I can get people with different views working together toward one goal.", vi: "Tôi có thể khiến những người có quan điểm khác nhau cùng làm việc hướng tới một mục tiêu." } },
  { id: "le03", strength: "leadership", text: { en: "People often look to me to take charge in group situations.", vi: "Mọi người thường trông đợi tôi đứng ra dẫn dắt trong các tình huống nhóm." } },
  { id: "le04", strength: "leadership", text: { en: "As a leader, I make sure every member feels included and valued.", vi: "Khi dẫn dắt, tôi đảm bảo mọi thành viên đều cảm thấy được tham gia và được trân trọng." } },

  // ---- TEMPERANCE ---------------------------------------------------------
  // Forgiveness
  { id: "fo01", strength: "forgiveness", text: { en: "I let go of grudges rather than carrying them.", vi: "Tôi buông bỏ hận thù thay vì mang theo chúng." } },
  { id: "fo02", strength: "forgiveness", text: { en: "When someone apologizes sincerely, I give them a genuine second chance.", vi: "Khi ai đó xin lỗi chân thành, tôi cho họ một cơ hội thứ hai thực sự." } },
  { id: "fo03", strength: "forgiveness", text: { en: "I rarely seek revenge, even when I've been hurt.", vi: "Tôi hiếm khi tìm cách trả đũa, ngay cả khi bị tổn thương." } },
  { id: "fo04", strength: "forgiveness", text: { en: "I can move past being wronged without it souring the relationship forever.", vi: "Tôi có thể vượt qua việc bị đối xử tệ mà không để nó làm hỏng mối quan hệ mãi mãi." } },
  // Humility
  { id: "hu01", strength: "humility", text: { en: "I let my results speak for themselves rather than seeking the spotlight.", vi: "Tôi để kết quả tự nói lên tất cả thay vì tìm kiếm sự chú ý." } },
  { id: "hu02", strength: "humility", text: { en: "I'm comfortable admitting the limits of what I know.", vi: "Tôi thoải mái thừa nhận giới hạn hiểu biết của mình." } },
  { id: "hu03", strength: "humility", text: { en: "I don't consider myself more special than other people.", vi: "Tôi không cho rằng mình đặc biệt hơn người khác." } },
  { id: "hu04", strength: "humility", text: { en: "When praised, I'm quick to share the credit with others who contributed.", vi: "Khi được khen ngợi, tôi nhanh chóng chia sẻ công lao với những người đã đóng góp." } },
  // Prudence
  { id: "pu01", strength: "prudence", text: { en: "I think carefully about consequences before I act or speak.", vi: "Tôi suy nghĩ kỹ về hậu quả trước khi hành động hoặc phát ngôn." } },
  { id: "pu02", strength: "prudence", text: { en: "I rarely do things I later regret.", vi: "Tôi hiếm khi làm những điều mà sau này phải hối tiếc." } },
  { id: "pu03", strength: "prudence", text: { en: "I avoid unnecessary risks with money, health, or commitments.", vi: "Tôi tránh những rủi ro không cần thiết về tiền bạc, sức khỏe, hoặc các cam kết." } },
  { id: "pu04", strength: "prudence", text: { en: "I plan ahead rather than leaving important things to chance.", vi: "Tôi lên kế hoạch trước thay vì phó mặc những việc quan trọng cho may rủi." } },
  // Self-regulation
  { id: "sr01", strength: "selfRegulation", text: { en: "I can control my impulses and appetites when I need to.", vi: "Tôi có thể kiểm soát những xung động và ham muốn của mình khi cần." } },
  { id: "sr02", strength: "selfRegulation", text: { en: "I stay disciplined with my habits (sleep, food, spending, screen time) even under stress.", vi: "Tôi giữ kỷ luật với các thói quen của mình (giấc ngủ, ăn uống, chi tiêu, thời gian dùng màn hình) ngay cả khi căng thẳng." } },
  { id: "sr03", strength: "selfRegulation", text: { en: "When I feel a strong emotion rising, I can manage how I express it.", vi: "Khi cảm thấy một cảm xúc mạnh trỗi dậy, tôi có thể kiểm soát cách mình thể hiện nó." } },
  { id: "sr04", strength: "selfRegulation", text: { en: "I can delay short-term pleasure for a long-term goal.", vi: "Tôi có thể trì hoãn niềm vui ngắn hạn vì một mục tiêu dài hạn." } },

  // ---- TRANSCENDENCE --------------------------------------------------------
  // Appreciation of beauty & excellence
  { id: "ab01", strength: "appreciationOfBeauty", text: { en: "I often stop to notice beauty — in nature, art, music, or skilled performance.", vi: "Tôi thường dừng lại để chiêm ngưỡng cái đẹp — trong thiên nhiên, nghệ thuật, âm nhạc, hoặc một màn trình diễn điêu luyện." } },
  { id: "ab02", strength: "appreciationOfBeauty", text: { en: "Seeing excellence or mastery in any field genuinely moves me.", vi: "Chứng kiến sự xuất sắc hoặc tài năng bậc thầy trong bất kỳ lĩnh vực nào thực sự làm tôi rung động." } },
  { id: "ab03", strength: "appreciationOfBeauty", text: { en: "Everyday moments — light, weather, a song — can fill me with wonder.", vi: "Những khoảnh khắc đời thường — ánh sáng, thời tiết, một bài hát — có thể khiến tôi tràn ngập sự kinh ngạc." } },
  { id: "ab04", strength: "appreciationOfBeauty", text: { en: "Experiences of beauty stay with me and lift my mood long afterward.", vi: "Những trải nghiệm về cái đẹp ở lại với tôi và nâng đỡ tâm trạng tôi rất lâu sau đó." } },
  // Gratitude
  { id: "gr01", strength: "gratitude", text: { en: "I regularly notice and appreciate the good things in my life.", vi: "Tôi thường xuyên nhận ra và trân trọng những điều tốt đẹp trong cuộc sống của mình." } },
  { id: "gr02", strength: "gratitude", text: { en: "I make a point of thanking people who have helped me.", vi: "Tôi luôn chú ý cảm ơn những người đã giúp đỡ mình." } },
  { id: "gr03", strength: "gratitude", text: { en: "Even in hard periods, I can find things I'm sincerely thankful for.", vi: "Ngay cả trong những giai đoạn khó khăn, tôi vẫn tìm được những điều mình thực lòng biết ơn." } },
  { id: "gr04", strength: "gratitude", text: { en: "I feel fortunate more often than I feel short-changed.", vi: "Tôi cảm thấy may mắn thường xuyên hơn là cảm thấy bị thiệt thòi." } },
  // Hope
  { id: "hp01", strength: "hope", text: { en: "I expect the future to hold more good than bad for me.", vi: "Tôi tin tương lai sẽ mang đến cho mình nhiều điều tốt hơn là điều xấu." } },
  { id: "hp02", strength: "hope", text: { en: "When things go wrong, I trust that I can find a way to make them better.", vi: "Khi mọi việc không suôn sẻ, tôi tin rằng mình có thể tìm ra cách làm cho chúng tốt hơn." } },
  { id: "hp03", strength: "hope", text: { en: "I set goals for the future and believe I can reach them.", vi: "Tôi đặt mục tiêu cho tương lai và tin rằng mình có thể đạt được chúng." } },
  { id: "hp04", strength: "hope", text: { en: "Even in dark moments, I can picture a realistic path to better times.", vi: "Ngay cả trong những thời khắc tăm tối, tôi vẫn hình dung được một con đường thực tế dẫn đến những ngày tốt đẹp hơn." } },
  // Humor
  { id: "hm01", strength: "humor", text: { en: "I like to make people laugh and smile.", vi: "Tôi thích làm mọi người cười và mỉm cười." } },
  { id: "hm02", strength: "humor", text: { en: "I can usually find something funny even in difficult situations.", vi: "Tôi thường tìm được điều gì đó hài hước ngay cả trong những tình huống khó khăn." } },
  { id: "hm03", strength: "humor", text: { en: "Friends count on me to lighten the mood.", vi: "Bạn bè trông cậy vào tôi để làm không khí nhẹ nhàng hơn." } },
  { id: "hm04", strength: "humor", text: { en: "Playfulness is a big part of how I connect with people.", vi: "Sự vui tươi, tinh nghịch là một phần lớn trong cách tôi kết nối với mọi người." } },
  // Spirituality / sense of meaning
  { id: "sp01", strength: "spirituality", text: { en: "I have a sense of purpose that goes beyond my own day-to-day concerns.", vi: "Tôi có một ý thức về mục đích sống vượt lên trên những lo toan thường nhật của bản thân." } },
  { id: "sp02", strength: "spirituality", text: { en: "My beliefs about the meaning of life shape how I act.", vi: "Niềm tin của tôi về ý nghĩa cuộc sống định hình cách tôi hành động." } },
  { id: "sp03", strength: "spirituality", text: { en: "I feel connected to something larger than myself.", vi: "Tôi cảm thấy được kết nối với điều gì đó lớn lao hơn bản thân mình." } },
  { id: "sp04", strength: "spirituality", text: { en: "Reflecting on the meaning of life is important to how I live.", vi: "Suy ngẫm về ý nghĩa cuộc sống là điều quan trọng đối với cách tôi sống." } },
];

/* ---- Quick-version subset: first 2 items of each strength (48 items) ---- */
const STRENGTHS_CORE_SUFFIXES = ["01", "02"];
STRENGTHS_QUESTIONS.forEach((q) => {
  q.core = STRENGTHS_CORE_SUFFIXES.includes(q.id.slice(-2));
});
const STRENGTHS_QUESTIONS_CORE = STRENGTHS_QUESTIONS.filter((q) => q.core);
