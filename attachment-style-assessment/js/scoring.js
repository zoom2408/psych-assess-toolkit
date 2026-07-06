/* =========================================================================
   SCORING ENGINE — Attachment Style (ECR-R inspired)
   Pure functions, no DOM/state dependencies (design doc §4).

   Per-item score: if `rev`, score = 8 - rawAnswer; else score = rawAnswer.
   Raw answers are 1-7 Likert responses. Subscale score = mean of that
   subscale's item scores (range 1.0-7.0). Full precision is kept for
   categorization; only the *display* value is rounded to 1 decimal.

   Categorical mapping: a 2x2 grid (Anxiety x Avoidance), cutoff at the
   scale midpoint 4.0 on each axis — this is an EDUCATIONAL HEURISTIC, not
   a clinical or psychometrically normed cutoff (mirrors the cautious
   "heuristic, not a norm" language used in iq-test/scoring.js).
     Low Anxiety + Low Avoidance   -> Secure
     High Anxiety + Low Avoidance  -> Anxious-Preoccupied
     Low Anxiety + High Avoidance  -> Dismissive-Avoidant
     High Anxiety + High Avoidance -> Fearful-Avoidant

   IMPORTANT: always pass the ACTUAL question array the user answered
   (Quick vs Full) so the subscale mean's denominator matches.
========================================================================= */

const ECRR_MIDPOINT = 4.0; // scale midpoint (1-7 scale) — heuristic cutoff, not a clinical norm

/* Per-dimension blurbs: what a high/low raw score means for THAT axis
   alone, independent of the quadrant it lands in (design-doc "domain bars
   + overall quadrant" pattern, same as the DCS section). */
const ECRR_DIMENSIONS = {
  anxiety: {
    key: "anxiety",
    name: { en: "Anxiety", vi: "Lo Âu Gắn Bó" },
    emoji: "💭",
    lowLabel: { en: "Low Anxiety", vi: "Lo Âu Thấp" },
    highLabel: { en: "High Anxiety", vi: "Lo Âu Cao" },
    lowBlurb: {
      en: "You tend to feel secure that your partner cares about you and don't spend much energy worrying about the relationship's stability.",
      vi: "Bạn thường cảm thấy an tâm rằng người ấy quan tâm đến mình và không tốn nhiều năng lượng lo lắng về sự ổn định của mối quan hệ.",
    },
    highBlurb: {
      en: "You tend to worry about whether your partner truly loves you and whether the relationship will last, and you may seek frequent reassurance.",
      vi: "Bạn thường lo lắng liệu người ấy có thực sự yêu mình không và liệu mối quan hệ có bền lâu không, và có thể tìm kiếm sự trấn an thường xuyên.",
    },
  },
  avoidance: {
    key: "avoidance",
    name: { en: "Avoidance", vi: "Né Tránh Gắn Bó" },
    emoji: "🚪",
    lowLabel: { en: "Low Avoidance", vi: "Né Tránh Thấp" },
    highLabel: { en: "High Avoidance", vi: "Né Tránh Cao" },
    lowBlurb: {
      en: "You tend to feel comfortable with emotional closeness, sharing your inner world, and depending on a partner when you need to.",
      vi: "Bạn thường cảm thấy thoải mái với sự gần gũi cảm xúc, chia sẻ thế giới nội tâm, và dựa vào người ấy khi cần thiết.",
    },
    highBlurb: {
      en: "You tend to prefer emotional distance and self-reliance, and may feel uneasy when a partner wants more closeness or vulnerability than you're used to.",
      vi: "Bạn thường thích khoảng cách cảm xúc và tự lực, và có thể cảm thấy không thoải mái khi người ấy muốn sự gần gũi hoặc dễ tổn thương nhiều hơn mức bạn quen thuộc.",
    },
  },
};

/* Quadrant profiles — bilingual, strengths-based, non-judgmental tone
   (mirrors DCS_QUADRANTS' structure/tone in stress-assessment). */
const ECRR_PROFILES = {
  secure: {
    key: "secure",
    name: { en: "Secure", vi: "An Toàn" },
    formula: { en: "Low Anxiety + Low Avoidance", vi: "Lo Âu Thấp + Né Tránh Thấp" },
    oneLiner: {
      en: "Comfortable with closeness and comfortable with independence — you trust that connection can be steady.",
      vi: "Thoải mái với sự gần gũi và thoải mái với sự độc lập — bạn tin rằng sự kết nối có thể bền vững.",
    },
    description: {
      en: "In relationships, this pattern tends to look like ease: you can be emotionally close to a partner without feeling swallowed up, and you can be apart from them without spiraling into worry. You generally trust that people who love you will keep loving you, and that conflict or distance doesn't have to mean the relationship is ending. This doesn't mean you never feel jealous, hurt, or uncertain — everyone does — but those feelings tend to pass without derailing how you show up for your partner or yourself.",
      vi: "Trong các mối quan hệ, mô hình này thường thể hiện sự nhẹ nhàng: bạn có thể gần gũi cảm xúc với người ấy mà không cảm thấy bị 'nuốt chửng', và có thể xa cách họ mà không rơi vào vòng xoáy lo âu. Bạn thường tin rằng những người yêu bạn sẽ tiếp tục yêu bạn, và xung đột hay khoảng cách không nhất thiết có nghĩa là mối quan hệ đang kết thúc. Điều này không có nghĩa là bạn không bao giờ ghen tuông, tổn thương, hay bất an — ai cũng có những cảm xúc đó — nhưng chúng thường qua đi mà không làm chệch hướng cách bạn đối xử với người ấy hay với chính mình.",
    },
    strengths: [
      { en: "Comfortable both giving and receiving emotional support", vi: "Thoải mái cả khi cho lẫn nhận sự hỗ trợ cảm xúc" },
      { en: "Able to communicate needs directly instead of testing or withdrawing", vi: "Có thể trình bày nhu cầu một cách trực tiếp thay vì thử thách hay rút lui" },
      { en: "Resilient to normal relationship friction — conflict doesn't feel catastrophic", vi: "Kiên cường trước những va chạm bình thường trong mối quan hệ — xung đột không cảm thấy như thảm họa" },
    ],
    tips: [
      { en: "Keep noticing what your partners with more anxiety or avoidance need — your steadiness can be a real anchor for them, but only if you stay curious about their patterns rather than assuming yours is the default.", vi: "Tiếp tục để ý xem những người bạn đời có mức lo âu hoặc né tránh cao hơn cần gì — sự vững vàng của bạn có thể là điểm tựa thực sự cho họ, nhưng chỉ khi bạn giữ sự tò mò về mô hình của họ thay vì mặc định mô hình của mình là chuẩn mực." },
      { en: "Security can still be disrupted by high-stress periods or a partner with unresolved patterns — it helps to know your own early-warning signs of drift toward anxiety or avoidance under stress.", vi: "Sự an toàn vẫn có thể bị xáo trộn bởi những giai đoạn căng thẳng cao hoặc một người bạn đời có những mô hình chưa được giải quyết — sẽ hữu ích nếu bạn biết các dấu hiệu cảnh báo sớm của việc nghiêng về lo âu hoặc né tránh khi căng thẳng." },
    ],
  },
  anxiousPreoccupied: {
    key: "anxiousPreoccupied",
    name: { en: "Anxious-Preoccupied", vi: "Lo Âu-Bận Tâm" },
    formula: { en: "High Anxiety + Low Avoidance", vi: "Lo Âu Cao + Né Tránh Thấp" },
    oneLiner: {
      en: "You want closeness deeply and reach for it — but often worry it isn't as solid as you'd like.",
      vi: "Bạn khao khát sự gần gũi sâu sắc và luôn tìm kiếm nó — nhưng thường lo rằng nó không vững chắc như bạn mong muốn.",
    },
    description: {
      en: "In relationships, this pattern tends to look like high investment paired with high vigilance: you notice small shifts in a partner's tone or availability quickly, and those shifts can trigger real worry about whether you're still loved. You likely value closeness highly and are willing to work hard for a relationship — the flip side is that reassurance-seeking, checking in frequently, or replaying conversations can sometimes crowd out the sense of ease you're actually looking for. Partners sometimes experience this as caring deeply, and sometimes as intense — both readings usually miss that the underlying drive is a genuine wish to feel securely loved.",
      vi: "Trong các mối quan hệ, mô hình này thường thể hiện sự đầu tư cao đi kèm với sự cảnh giác cao: bạn nhanh chóng nhận ra những thay đổi nhỏ trong giọng điệu hay sự sẵn có của người ấy, và những thay đổi đó có thể kích hoạt sự lo lắng thực sự về việc liệu mình có còn được yêu hay không. Bạn có thể coi trọng sự gần gũi rất nhiều và sẵn sàng nỗ lực vì mối quan hệ — mặt trái là việc tìm kiếm sự trấn an, kiểm tra thường xuyên, hoặc suy đi nghĩ lại các cuộc trò chuyện đôi khi có thể lấn át cảm giác thoải mái mà bạn thực sự mong muốn. Người yêu đôi khi cảm nhận điều này là sự quan tâm sâu sắc, và đôi khi là sự mãnh liệt — cả hai cách nhìn đều thường bỏ lỡ điều cốt lõi là mong muốn chân thành được yêu thương một cách an toàn.",
    },
    strengths: [
      { en: "Deep investment in relationships and willingness to work through difficulty rather than walk away", vi: "Đầu tư sâu sắc vào các mối quan hệ và sẵn lòng vượt qua khó khăn thay vì bỏ đi" },
      { en: "High attunement to a partner's emotional state and small changes in connection", vi: "Nhạy bén cao với trạng thái cảm xúc của người ấy và những thay đổi nhỏ trong sự kết nối" },
      { en: "Openness about wanting closeness — not afraid to name what you need", vi: "Cởi mở về mong muốn sự gần gũi — không ngại nói ra điều mình cần" },
    ],
    tips: [
      { en: "Before reaching out for reassurance, try naming the specific fear to yourself first ('I'm scared this means they're pulling away') — it's often easier to communicate clearly and reduces the urge to test the relationship indirectly.", vi: "Trước khi tìm kiếm sự trấn an, hãy thử gọi tên nỗi sợ cụ thể của mình trước ('Mình sợ rằng điều này nghĩa là họ đang xa cách') — điều này thường dễ giao tiếp rõ ràng hơn và giảm bớt mong muốn thử thách mối quan hệ một cách gián tiếp." },
      { en: "Build a few reliable self-soothing tools for the moments between reaching out and getting a reply — that gap is often where anxiety escalates fastest.", vi: "Xây dựng một vài công cụ tự trấn an đáng tin cậy cho những khoảnh khắc giữa lúc bạn liên hệ và lúc nhận được phản hồi — khoảng thời gian đó thường là lúc sự lo âu leo thang nhanh nhất." },
      { en: "A partner's calm silence usually isn't a verdict on the relationship — practice treating ambiguous signals as neutral information rather than automatic bad news.", vi: "Sự im lặng bình thản của người ấy thường không phải là một phán quyết về mối quan hệ — hãy tập xem những tín hiệu mơ hồ là thông tin trung lập thay vì tự động coi đó là tin xấu." },
    ],
  },
  dismissiveAvoidant: {
    key: "dismissiveAvoidant",
    name: { en: "Dismissive-Avoidant", vi: "Né Tránh-Xa Cách" },
    formula: { en: "Low Anxiety + High Avoidance", vi: "Lo Âu Thấp + Né Tránh Cao" },
    oneLiner: {
      en: "You feel steady on your own — closeness is welcome in moderation, but self-sufficiency comes first.",
      vi: "Bạn cảm thấy vững vàng khi ở một mình — sự gần gũi được chào đón ở mức vừa phải, nhưng sự tự chủ luôn được đặt lên hàng đầu.",
    },
    description: {
      en: "In relationships, this pattern tends to look like calm independence: you don't tend to worry much about being loved or abandoned, and you generally feel most like yourself when you have room to operate on your own terms. Deep emotional disclosure, needing a partner, or being needed intensely can feel less comfortable than it does for others — not because you don't care, but because self-reliance has often felt like the more dependable strategy. Partners sometimes read this as distance or low investment, when it's frequently closer to a genuine preference for a lower-intensity, lower-friction kind of closeness.",
      vi: "Trong các mối quan hệ, mô hình này thường thể hiện sự độc lập điềm tĩnh: bạn không quá lo lắng về việc được yêu hay bị bỏ rơi, và nhìn chung bạn cảm thấy là chính mình nhất khi có không gian để hành động theo cách riêng. Việc bộc lộ cảm xúc sâu sắc, cần đến người ấy, hoặc được cần đến một cách mãnh liệt có thể kém thoải mái hơn so với người khác — không phải vì bạn không quan tâm, mà vì sự tự lực thường là chiến lược đáng tin cậy hơn đối với bạn. Người yêu đôi khi hiểu điều này là sự xa cách hoặc đầu tư thấp, trong khi thực chất nó thường gần với một sở thích chân thật về kiểu gần gũi cường độ thấp hơn, ít va chạm hơn.",
    },
    strengths: [
      { en: "Emotional steadiness under pressure — not prone to panic when a relationship hits a rough patch", vi: "Sự ổn định cảm xúc dưới áp lực — không dễ hoảng loạn khi mối quan hệ gặp trục trặc" },
      { en: "Respect for a partner's autonomy and personal space", vi: "Tôn trọng sự tự chủ và không gian riêng của người ấy" },
      { en: "Clear-headed decision-making that isn't easily clouded by relationship anxiety", vi: "Ra quyết định sáng suốt, không dễ bị lo âu trong mối quan hệ làm mờ mắt" },
    ],
    tips: [
      { en: "Practice small, low-stakes moments of sharing feelings before big ones are required — vulnerability is a skill that builds gradually, not a switch to flip in a crisis.", vi: "Luyện tập những khoảnh khắc chia sẻ cảm xúc nhỏ, ít rủi ro trước khi cần đến những khoảnh khắc lớn — sự dễ tổn thương là một kỹ năng xây dựng dần dần, không phải một công tắc để bật lên khi khủng hoảng." },
      { en: "Notice if 'needing space' is sometimes a reflex rather than an actual need — a brief pause before withdrawing can reveal which one it is.", vi: "Để ý xem việc 'cần không gian riêng' đôi khi có phải là một phản xạ hơn là nhu cầu thực sự — một khoảng dừng ngắn trước khi rút lui có thể cho biết đó là điều nào." },
      { en: "Your partner's requests for closeness are rarely a demand to lose yourself — try naming what amount of closeness would still feel comfortable, rather than defaulting to distance.", vi: "Yêu cầu gần gũi của người ấy hiếm khi là đòi hỏi bạn phải đánh mất chính mình — hãy thử nói rõ mức độ gần gũi nào vẫn khiến bạn thoải mái, thay vì mặc định chọn khoảng cách." },
    ],
  },
  fearfulAvoidant: {
    key: "fearfulAvoidant",
    name: { en: "Fearful-Avoidant", vi: "Lo Âu-Né Tránh" },
    formula: { en: "High Anxiety + High Avoidance", vi: "Lo Âu Cao + Né Tránh Cao" },
    oneLiner: {
      en: "You want closeness and find it unsettling at the same time — pulled toward connection and away from it in turn.",
      vi: "Bạn vừa mong muốn sự gần gũi vừa cảm thấy bất an với nó — bị kéo về phía kết nối rồi lại rời xa nó.",
    },
    description: {
      en: "In relationships, this pattern tends to look like an internal tug-of-war: part of you wants deep closeness and reassurance, and part of you finds that same closeness uncomfortable or risky, sometimes both within the same conversation. This can show up as reaching out and then pulling back, wanting a partner near but bracing for disappointment, or feeling both hurt by distance and overwhelmed by intimacy. It's an understandably harder pattern to hold day-to-day, but it's also common and workable — many people move toward more security over time, especially with a patient partner or supportive therapeutic relationship.",
      vi: "Trong các mối quan hệ, mô hình này thường thể hiện một cuộc giằng co nội tâm: một phần trong bạn muốn sự gần gũi sâu sắc và sự trấn an, và một phần khác lại thấy chính sự gần gũi đó khó chịu hoặc rủi ro, đôi khi cả hai cùng xuất hiện trong một cuộc trò chuyện. Điều này có thể biểu hiện qua việc chủ động tiếp cận rồi lại rút lui, muốn người ấy ở gần nhưng lại chuẩn bị tinh thần cho sự thất vọng, hoặc vừa tổn thương vì khoảng cách vừa choáng ngợp vì sự thân mật. Đây là một mô hình dễ hiểu là khó nắm giữ hơn trong đời sống hằng ngày, nhưng cũng khá phổ biến và có thể cải thiện được — nhiều người dần trở nên an toàn hơn theo thời gian, đặc biệt khi có một người bạn đời kiên nhẫn hoặc một mối quan hệ trị liệu hỗ trợ.",
    },
    strengths: [
      { en: "Deep capacity for empathy — often highly attuned to when others are hurting, having navigated complex feelings yourself", vi: "Khả năng đồng cảm sâu sắc — thường rất nhạy bén khi người khác đang tổn thương, vì đã tự trải qua những cảm xúc phức tạp" },
      { en: "Self-awareness about the push-pull pattern is often already present, which is the hardest and most useful first step", vi: "Sự nhận thức về bản thân về mô hình kéo-đẩy này thường đã hiện diện, và đó là bước đầu tiên khó khăn nhất nhưng cũng hữu ích nhất" },
      { en: "Genuine desire for connection alongside a realistic sense of its risks — not naive, but not closed off either", vi: "Mong muốn kết nối chân thành song song với nhận thức thực tế về những rủi ro của nó — không ngây thơ, nhưng cũng không khép kín" },
    ],
    tips: [
      { en: "When you notice the urge to pull away right after seeking closeness (or vice versa), naming the pattern out loud to yourself or a trusted partner can loosen its grip.", vi: "Khi bạn nhận ra thôi thúc muốn rút lui ngay sau khi tìm kiếm sự gần gũi (hoặc ngược lại), việc gọi tên mô hình này ra thành lời — với chính mình hoặc với người bạn đời tin cậy — có thể làm giảm bớt sức chi phối của nó." },
      { en: "This pattern often responds well to working with a licensed therapist, particularly approaches focused on attachment and emotion regulation — it's a solvable pattern, not a fixed trait.", vi: "Mô hình này thường đáp ứng tốt với việc làm việc cùng một nhà trị liệu có chứng chỉ hành nghề, đặc biệt là các phương pháp tập trung vào gắn bó và điều hòa cảm xúc — đây là một mô hình có thể thay đổi được, không phải một đặc điểm cố định." },
      { en: "Slow down the relationship's pace deliberately when it feels most intense — a slower pace gives the 'wants closeness' and 'fears closeness' parts of you room to catch up with each other.", vi: "Chủ động làm chậm nhịp độ mối quan hệ khi nó cảm thấy mãnh liệt nhất — nhịp độ chậm hơn cho phần 'muốn gần gũi' và phần 'sợ gần gũi' trong bạn có không gian để hòa hợp với nhau." },
    ],
  },
};

/* ---------------------------------------------------------------------
   Scoring functions
--------------------------------------------------------------------- */

/* Per-item score, honoring reversal. rawAnswer is 1-7. */
function _itemScore(rawAnswer, rev) {
  return rev ? 8 - rawAnswer : rawAnswer;
}

/* scoreAttachment(answers, questions) -> {
     anxiety: { mean, display, items },
     avoidance: { mean, display, items },
     quadrantKey, missingCount
   }
   `answers` is a flat map { itemId: 1-7 }. `questions` should be the exact
   array the user was shown (Quick or Full) so denominators match. */
function scoreAttachment(answers, questions = ECRR_QUESTIONS) {
  const bySubscale = { anxiety: [], avoidance: [] };
  let missingCount = 0;

  questions.forEach((q) => {
    const raw = answers[q.id];
    if (raw === undefined || raw === null) {
      missingCount += 1;
      return;
    }
    bySubscale[q.subscale].push(_itemScore(Number(raw), q.rev));
  });

  function summarize(list) {
    if (list.length === 0) return { mean: 4, display: "4.0", items: 0 };
    const mean = list.reduce((a, b) => a + b, 0) / list.length;
    return { mean, display: mean.toFixed(1), items: list.length };
  }

  const anxiety = summarize(bySubscale.anxiety);
  const avoidance = summarize(bySubscale.avoidance);

  const quadrantKey = categorize(anxiety.mean, avoidance.mean);

  return { anxiety, avoidance, quadrantKey, missingCount };
}

/* categorize(anxietyMean, avoidanceMean) -> one of the 4 quadrant keys.
   Cutoff is the scale midpoint (4.0) on each axis — an educational
   heuristic, not a clinical/normed cutoff. Ties at exactly 4.0 are
   treated as "low" on that axis (deterministic, not a bug). */
function categorize(anxietyMean, avoidanceMean) {
  const highAnxiety = anxietyMean > ECRR_MIDPOINT;
  const highAvoidance = avoidanceMean > ECRR_MIDPOINT;
  if (!highAnxiety && !highAvoidance) return "secure";
  if (highAnxiety && !highAvoidance) return "anxiousPreoccupied";
  if (!highAnxiety && highAvoidance) return "dismissiveAvoidant";
  return "fearfulAvoidant";
}

/* ---------------------------------------------------------------------
   Report content — bilingual copy assembly, analogous to buildIQReport /
   buildCombinedReport in the other apps.
--------------------------------------------------------------------- */
const _AT = {
  headline: { en: (name) => `Your Pattern: ${name}`, vi: (name) => `Mô Hình Của Bạn: ${name}` },
  cutoffNote: {
    en: "Anxiety and Avoidance are each scored on a 1-7 scale. The midpoint (4.0) is used here as an educational heuristic to sort scores into four everyday patterns — it is NOT a clinical or professionally normed cutoff, and real attachment shows up on a continuum, not in hard boxes.",
    vi: "Lo Âu và Né Tránh đều được chấm điểm trên thang 1-7. Điểm giữa (4.0) được dùng ở đây như một ước lượng mang tính giáo dục để phân loại điểm số thành bốn mô hình thường gặp — đây KHÔNG phải là ngưỡng cắt lâm sàng hay được chuẩn hóa chuyên môn, và gắn bó thực tế biểu hiện theo một dải liên tục, không phải trong các ô cố định.",
  },
};

function buildReport(result) {
  const profile = ECRR_PROFILES[result.quadrantKey];
  const headline = _AT.headline[getLang()](L(profile.name));

  const dims = [ECRR_DIMENSIONS.anxiety, ECRR_DIMENSIONS.avoidance].map((dim) => {
    const scoreObj = result[dim.key];
    const isHigh = scoreObj.mean > ECRR_MIDPOINT;
    return {
      key: dim.key,
      name: dim.name,
      emoji: dim.emoji,
      display: scoreObj.display,
      pct: Math.round(((scoreObj.mean - 1) / 6) * 100), // 1-7 -> 0-100 for bar width
      label: isHigh ? dim.highLabel : dim.lowLabel,
      blurb: isHigh ? dim.highBlurb : dim.lowBlurb,
    };
  });

  return {
    profile,
    headline,
    dims,
    cutoffNote: L(_AT.cutoffNote),
    strengths: profile.strengths,
    tips: profile.tips,
    lowDataWarning: result.missingCount > 0,
  };
}
