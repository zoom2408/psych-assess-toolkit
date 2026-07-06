/* =========================================================================
   APPRAISAL & COPING SECTION (Lazarus & Folkman's Transactional Model)
   The transactional model says stress isn't in the event — it's in the
   transaction between the event and you: how you APPRAISE it (threat vs
   challenge) and how you COPE with it.

   Four scales (all positively keyed, agree/disagree):
   - PF: Problem-focused coping  (act on the stressor itself)
   - EF: Emotion-focused coping  (regulate the feelings the stressor causes)
   - AV: Avoidant coping         (disengage, distract, put off)
   - AP: Challenge appraisal     (high = sees stressors as challenges;
                                  low = tends to appraise them as threats)

   Item shape: { id, scale: "PF"|"EF"|"AV"|"AP", text: {en, vi} }
   Balance rule: equal item counts per scale (full: 8 each, quick: 2 each).
   Bilingual fields resolved at render time via L() from lang.js.
========================================================================= */

const COPING_QUESTIONS = [
  // --- PF: Problem-focused coping (8) ---
  { id: "pf01", scale: "PF", text: { en: "When something stresses me, my first instinct is to figure out what I can actually do about it.", vi: "Khi có điều gì đó khiến tôi căng thẳng, phản xạ đầu tiên của tôi là tìm ra mình có thể làm gì để giải quyết nó." } },
  { id: "pf02", scale: "PF", text: { en: "I break overwhelming problems into smaller steps I can start on right away.", vi: "Tôi chia nhỏ những vấn đề quá tải thành các bước nhỏ hơn mà tôi có thể bắt đầu ngay." } },
  { id: "pf03", scale: "PF", text: { en: "I actively look for information or advice that will help me tackle a stressful situation.", vi: "Tôi chủ động tìm kiếm thông tin hoặc lời khuyên giúp tôi xử lý tình huống căng thẳng." } },
  { id: "pf04", scale: "PF", text: { en: "Under pressure, I make a concrete plan and follow it.", vi: "Khi chịu áp lực, tôi lập một kế hoạch cụ thể và tuân theo nó." } },
  { id: "pf05", scale: "PF", text: { en: "I try to remove or reduce the source of my stress rather than just live with it.", vi: "Tôi cố gắng loại bỏ hoặc giảm bớt nguồn gây căng thẳng thay vì chỉ chấp nhận sống chung với nó." } },
  { id: "pf06", scale: "PF", text: { en: "When a deadline or conflict looms, I deal with it early instead of waiting.", vi: "Khi thời hạn hoặc mâu thuẫn sắp đến gần, tôi xử lý sớm thay vì chờ đợi." } },
  { id: "pf07", scale: "PF", text: { en: "I'm willing to ask directly for what I need to fix a stressful situation.", vi: "Tôi sẵn sàng yêu cầu trực tiếp những gì mình cần để giải quyết một tình huống căng thẳng." } },
  { id: "pf08", scale: "PF", text: { en: "After a setback, I quickly shift into working out my next move.", vi: "Sau một trở ngại, tôi nhanh chóng chuyển sang việc tìm ra bước tiếp theo." } },
  // --- EF: Emotion-focused coping (8) ---
  { id: "ef01", scale: "EF", text: { en: "When I'm stressed, I take deliberate steps to calm myself down (breathing, a walk, a pause).", vi: "Khi căng thẳng, tôi chủ động thực hiện các bước để làm dịu bản thân (hít thở, đi bộ, tạm dừng lại)." } },
  { id: "ef02", scale: "EF", text: { en: "Talking through my feelings with someone helps me handle stressful periods.", vi: "Chia sẻ cảm xúc của mình với ai đó giúp tôi vượt qua những giai đoạn căng thẳng." } },
  { id: "ef03", scale: "EF", text: { en: "I can usually find a more helpful way of looking at a situation that's upsetting me.", vi: "Tôi thường có thể tìm ra một cách nhìn tích cực hơn về tình huống đang khiến mình khó chịu." } },
  { id: "ef04", scale: "EF", text: { en: "I allow myself to feel difficult emotions without being swept away by them.", vi: "Tôi cho phép bản thân cảm nhận những cảm xúc khó khăn mà không bị chúng cuốn đi." } },
  { id: "ef05", scale: "EF", text: { en: "Humor helps me release tension when things get hard.", vi: "Sự hài hước giúp tôi giải tỏa căng thẳng khi mọi thứ trở nên khó khăn." } },
  { id: "ef06", scale: "EF", text: { en: "When something is truly outside my control, I work on accepting it.", vi: "Khi điều gì đó thực sự nằm ngoài tầm kiểm soát của tôi, tôi cố gắng chấp nhận nó." } },
  { id: "ef07", scale: "EF", text: { en: "I use routines like exercise, music, or journaling to process stress.", vi: "Tôi dùng các thói quen như tập thể dục, nghe nhạc, hoặc viết nhật ký để xử lý căng thẳng." } },
  { id: "ef08", scale: "EF", text: { en: "I remind myself of what's still going well when one area of life gets rough.", vi: "Tôi tự nhắc mình về những điều vẫn đang tốt đẹp khi một khía cạnh nào đó của cuộc sống trở nên khó khăn." } },
  // --- AV: Avoidant coping (8) ---
  { id: "av01", scale: "AV", text: { en: "I put off dealing with stressful things for as long as I possibly can.", vi: "Tôi trì hoãn việc xử lý những điều căng thẳng lâu nhất có thể." } },
  { id: "av02", scale: "AV", text: { en: "When I'm stressed, I distract myself (scrolling, shows, games) instead of facing the issue.", vi: "Khi căng thẳng, tôi làm bản thân sao nhãng (lướt điện thoại, xem phim, chơi game) thay vì đối mặt với vấn đề." } },
  { id: "av03", scale: "AV", text: { en: "I tend to act as if a problem doesn't exist and hope it resolves itself.", vi: "Tôi có xu hướng hành động như thể vấn đề không tồn tại và hy vọng nó tự biến mất." } },
  { id: "av04", scale: "AV", text: { en: "I avoid people or places that remind me of what's stressing me.", vi: "Tôi tránh những người hoặc nơi chốn gợi nhắc tôi về điều đang khiến mình căng thẳng." } },
  { id: "av05", scale: "AV", text: { en: "I keep myself extra busy with other things so I don't have to think about the real problem.", vi: "Tôi khiến bản thân bận rộn thêm với những việc khác để không phải nghĩ về vấn đề thực sự." } },
  { id: "av06", scale: "AV", text: { en: "When a hard conversation is needed, I usually find a reason not to have it.", vi: "Khi cần một cuộc trò chuyện khó khăn, tôi thường tìm ra lý do để không thực hiện nó." } },
  { id: "av07", scale: "AV", text: { en: "I use food, shopping, or other quick comforts to push stressful feelings away.", vi: "Tôi dùng đồ ăn, mua sắm, hoặc những niềm an ủi nhanh khác để đẩy lùi cảm giác căng thẳng." } },
  { id: "av08", scale: "AV", text: { en: "I mentally check out when the pressure gets high.", vi: "Tôi thường 'thoát ly' về mặt tinh thần khi áp lực lên cao." } },
  // --- AP: Challenge appraisal (8) ---
  { id: "ap01", scale: "AP", text: { en: "When something demanding lands on me, I tend to see it as a challenge rather than a threat.", vi: "Khi có điều gì đó đòi hỏi ập đến, tôi có xu hướng xem đó là thử thách hơn là mối đe dọa." } },
  { id: "ap02", scale: "AP", text: { en: "I usually believe I have what it takes to handle whatever comes up.", vi: "Tôi thường tin rằng mình có đủ khả năng để xử lý bất cứ điều gì xảy đến." } },
  { id: "ap03", scale: "AP", text: { en: "Difficult situations often feel like a chance to learn or prove myself.", vi: "Những tình huống khó khăn thường mang lại cảm giác như một cơ hội để học hỏi hoặc chứng tỏ bản thân." } },
  { id: "ap04", scale: "AP", text: { en: "When plans change suddenly, my first thought is 'okay, how do I make this work?'", vi: "Khi kế hoạch thay đổi đột ngột, suy nghĩ đầu tiên của tôi là 'được rồi, làm sao để việc này vẫn ổn?'" } },
  { id: "ap05", scale: "AP", text: { en: "High-stakes moments tend to sharpen me rather than shake me.", vi: "Những khoảnh khắc áp lực cao thường khiến tôi tỉnh táo hơn là run sợ." } },
  { id: "ap06", scale: "AP", text: { en: "I expect that most stressful periods in my life will pass and leave me stronger.", vi: "Tôi tin rằng hầu hết những giai đoạn căng thẳng trong đời rồi sẽ qua và khiến tôi mạnh mẽ hơn." } },
  { id: "ap07", scale: "AP", text: { en: "Feedback or criticism feels more like useful information than an attack.", vi: "Phản hồi hay lời phê bình với tôi giống như thông tin hữu ích hơn là một sự công kích." } },
  { id: "ap08", scale: "AP", text: { en: "When I imagine an upcoming difficulty, I picture myself coping with it, not failing at it.", vi: "Khi hình dung về một khó khăn sắp tới, tôi thấy mình đang ứng phó với nó, chứ không phải thất bại trước nó." } },
];

/* Profile content for each coping scale. */
const COPING_STYLES = {
  PF: {
    name: { en: "Problem-Focused Coping", vi: "Ứng Phó Tập Trung Vào Vấn Đề" },
    nickname: { en: "The Fixer", vi: "Người Giải Quyết" },
    summary: {
      en: "You cope by acting on the stressor itself — planning, gathering information, taking steps, removing obstacles. This is the most consistently effective style when the situation is actually changeable.",
      vi: "Bạn ứng phó bằng cách hành động trực tiếp lên tác nhân gây căng thẳng — lập kế hoạch, thu thập thông tin, thực hiện các bước, loại bỏ trở ngại. Đây là phong cách hiệu quả nhất một cách nhất quán khi tình huống thực sự có thể thay đổi được.",
    },
    strengths: {
      en: [
        "You convert anxiety into action quickly, which shrinks problems before they grow.",
        "People experience you as dependable in a crisis because you move toward the problem.",
      ],
      vi: [
        "Bạn chuyển hóa lo lắng thành hành động nhanh chóng, giúp thu nhỏ vấn đề trước khi nó lớn lên.",
        "Mọi người thấy bạn đáng tin cậy trong khủng hoảng vì bạn tiến về phía vấn đề thay vì lùi lại.",
      ],
    },
    watchOuts: {
      en: [
        "Problem-solving can't fix the unfixable — for losses or situations outside your control, pure fixing turns into frustration. That's when emotion-focused tools matter.",
        "Watch for 'fix mode' with other people's feelings; sometimes they need listening, not solutions.",
      ],
      vi: [
        "Giải quyết vấn đề không thể sửa được những gì không thể sửa — với những mất mát hay tình huống ngoài tầm kiểm soát, việc cố sửa đơn thuần sẽ biến thành sự thất vọng. Đó là lúc các công cụ tập trung vào cảm xúc trở nên quan trọng.",
        "Cẩn thận với 'chế độ sửa chữa' khi đối diện cảm xúc của người khác; đôi khi họ cần được lắng nghe, không phải giải pháp.",
      ],
    },
  },
  EF: {
    name: { en: "Emotion-Focused Coping", vi: "Ứng Phó Tập Trung Vào Cảm Xúc" },
    nickname: { en: "The Regulator", vi: "Người Điều Tiết" },
    summary: {
      en: "You cope by managing the feelings a stressor produces — calming your body, reframing, accepting, seeking comfort and perspective. This is the most effective style when a situation can't be changed.",
      vi: "Bạn ứng phó bằng cách quản lý những cảm xúc mà tác nhân gây căng thẳng tạo ra — làm dịu cơ thể, nhìn nhận lại vấn đề, chấp nhận, tìm kiếm sự an ủi và góc nhìn khác. Đây là phong cách hiệu quả nhất khi tình huống không thể thay đổi được.",
    },
    strengths: {
      en: [
        "You can stay steady in situations that can't be immediately fixed, which protects your health and relationships during long stressors.",
        "You recover emotional balance relatively quickly, which keeps stress from compounding.",
      ],
      vi: [
        "Bạn có thể giữ vững tinh thần trong những tình huống không thể sửa ngay lập tức, điều này bảo vệ sức khỏe và các mối quan hệ của bạn trong những giai đoạn căng thẳng kéo dài.",
        "Bạn phục hồi cân bằng cảm xúc tương đối nhanh, giúp căng thẳng không tích tụ chồng chất.",
      ],
    },
    watchOuts: {
      en: [
        "If a problem IS solvable, regulating feelings about it isn't a substitute for acting on it — pair this style with one concrete problem-solving step.",
        "Reframing can slide into rationalizing a genuinely bad situation you should change.",
      ],
      vi: [
        "Nếu một vấn đề THỰC SỰ có thể giải quyết được, việc điều tiết cảm xúc về nó không thể thay thế cho hành động — hãy kết hợp phong cách này với một bước giải quyết vấn đề cụ thể.",
        "Việc nhìn nhận lại có thể trượt thành sự hợp lý hóa cho một tình huống thực sự tệ mà bạn nên thay đổi.",
      ],
    },
  },
  AV: {
    name: { en: "Avoidant Coping", vi: "Ứng Phó Né Tránh" },
    nickname: { en: "The Escape Artist", vi: "Người Trốn Tránh" },
    summary: {
      en: "You cope by creating distance from the stressor — distraction, delay, disengagement. Short bursts of avoidance can be useful for acute overwhelm, but as a dominant style it reliably makes stress worse over time.",
      vi: "Bạn ứng phó bằng cách tạo khoảng cách với tác nhân gây căng thẳng — sao nhãng, trì hoãn, rút lui. Những khoảng né tránh ngắn có thể hữu ích khi quá tải cấp tính, nhưng nếu là phong cách chủ đạo, nó chắc chắn khiến căng thẳng tệ hơn theo thời gian.",
    },
    strengths: {
      en: [
        "Brief, chosen distraction is a legitimate tool — it can lower acute distress enough to think clearly again.",
        "You rarely act impulsively in the heat of the moment, because your instinct is to step back.",
      ],
      vi: [
        "Sự sao nhãng ngắn ngủi, có chủ đích là một công cụ hợp lý — nó có thể giảm bớt khó chịu cấp tính đủ để suy nghĩ rõ ràng trở lại.",
        "Bạn hiếm khi hành động bốc đồng trong lúc nóng vội, vì bản năng của bạn là lùi lại.",
      ],
    },
    watchOuts: {
      en: [
        "Avoided problems compound: the deadline gets closer, the conversation gets harder, the interest accrues. Research consistently links dominant avoidant coping with higher long-term stress.",
        "Try a '10-minute start' rule: commit to just 10 minutes of facing the avoided thing — starting is usually the whole battle.",
      ],
      vi: [
        "Những vấn đề bị né tránh sẽ chồng chất: thời hạn đến gần hơn, cuộc trò chuyện trở nên khó hơn, lãi suất cộng dồn. Nghiên cứu liên tục cho thấy ứng phó né tránh chủ đạo liên quan đến căng thẳng dài hạn cao hơn.",
        "Hãy thử quy tắc 'bắt đầu 10 phút': cam kết chỉ 10 phút để đối mặt với điều đang né tránh — bắt đầu thường là phần khó khăn nhất.",
      ],
    },
  },
  AP: {
    name: { en: "Challenge Appraisal", vi: "Đánh Giá Theo Hướng Thử Thách" },
    nickname: { en: "The Reframer", vi: "Người Nhìn Nhận Lại" },
    summary: {
      en: "This scale reflects your primary appraisal — Lazarus's term for the instant judgment of 'is this a threat to me, or a challenge I can meet?' High scores mean demanding situations tend to feel like challenges; low scores mean they tend to feel like threats.",
      vi: "Thang đo này phản ánh đánh giá sơ cấp của bạn — thuật ngữ của Lazarus chỉ phán đoán tức thời rằng 'đây có phải là mối đe dọa với tôi, hay là một thử thách tôi có thể vượt qua?' Điểm cao nghĩa là các tình huống đòi hỏi thường được cảm nhận như thử thách; điểm thấp nghĩa là chúng thường được cảm nhận như mối đe dọa.",
    },
    strengths: {
      en: [
        "Appraising demands as challenges is linked with better performance under pressure and faster physiological recovery afterward.",
        "You approach rather than brace — which keeps options visible that threat-mode hides.",
      ],
      vi: [
        "Việc nhìn nhận các đòi hỏi như thử thách liên quan đến hiệu suất tốt hơn dưới áp lực và phục hồi sinh lý nhanh hơn sau đó.",
        "Bạn tiến tới thay vì phòng thủ — điều này giữ cho các lựa chọn vẫn hiện rõ, những lựa chọn mà chế độ 'đe dọa' thường che khuất.",
      ],
    },
    watchOuts: {
      en: [
        "A strong challenge orientation can underestimate real risks — occasionally ask 'what would a more cautious person prepare for here?'",
        "If your score here is low, that's trainable: appraisal shifts with practice (naming resources you have, recalling past copes, reframing stakes).",
      ],
      vi: [
        "Định hướng thử thách mạnh có thể khiến bạn đánh giá thấp những rủi ro thật sự — thỉnh thoảng hãy tự hỏi 'một người thận trọng hơn sẽ chuẩn bị gì cho việc này?'",
        "Nếu điểm số ở đây thấp, điều này có thể rèn luyện được: cách đánh giá thay đổi qua luyện tập (gọi tên nguồn lực bạn có, nhớ lại những lần đã ứng phó thành công, nhìn nhận lại mức độ nghiêm trọng).",
      ],
    },
  },
};

/* ---- Quick-version subset (2 per scale, balanced) ---- */
const COPING_CORE_IDS = ["pf01", "pf04", "ef01", "ef03", "av01", "av02", "ap01", "ap02"];
COPING_QUESTIONS.forEach((q) => { q.core = COPING_CORE_IDS.includes(q.id); });
const COPING_QUESTIONS_CORE = COPING_QUESTIONS.filter((q) => q.core);
