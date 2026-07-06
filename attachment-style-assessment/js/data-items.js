/* =========================================================================
   ECR-R-INSPIRED ITEM BANK — Adult Attachment Style
   -------------------------------------------------------------------------
   Two subscales, originally-written items inspired by the construct
   structure of the Experiences in Close Relationships–Revised (ECR-R;
   Fraley, Waller & Brennan, 2000). This is NOT a reproduction of the
   copyrighted ECR-R item wording — items here are original paraphrase-level
   content covering the same two well-replicated dimensions:

     anxiety   — fear of rejection/abandonment, need for reassurance,
                 preoccupation with the partner's love and availability
     avoidance — discomfort with closeness/dependence, preference for
                 emotional distance and self-reliance in relationships

   Each item is answered on a 1–7 Likert scale (1 Disagree strongly …
   7 Agree strongly). Reverse-scored items are flagged `rev: true` — see
   scoring.js for the reversal formula (score = 8 - rawAnswer).

   Item shape:
   { id, subscale: "anxiety"|"avoidance", rev: true|false,
     core: true (only on the 24 curated Quick-version items), text: {en, vi} }

   ID prefixes: anx## (Anxiety) · avo## (Avoidance)

   Quick-version subset mechanism (design doc §3): rather than a second
   parallel bank, a `core: true` flag marks a curated, balanced 12-per-
   subscale subset (24 total). `ECRR_QUESTIONS_CORE` is derived by filtering
   at the bottom of this file — same pattern as IQ_QUESTIONS_CORE etc.
========================================================================= */

const ECRR_QUESTIONS = [
  // ---- ANXIETY SUBSCALE (18 items) ----------------------------------------
  { id: "anx01", subscale: "anxiety", rev: false, core: true,
    text: { en: "I worry a lot about my relationships.", vi: "Tôi lo lắng rất nhiều về các mối quan hệ của mình." } },
  { id: "anx02", subscale: "anxiety", rev: false, core: true,
    text: { en: "I'm afraid that I will lose my partner's love.", vi: "Tôi sợ rằng mình sẽ mất đi tình yêu của người ấy." } },
  { id: "anx03", subscale: "anxiety", rev: false, core: true,
    text: { en: "I often worry that my partner doesn't really love me.", vi: "Tôi thường lo rằng người ấy không thực sự yêu tôi." } },
  { id: "anx04", subscale: "anxiety", rev: false, core: false,
    text: { en: "I worry that romantic partners won't care about me as much as I care about them.", vi: "Tôi lo rằng người yêu sẽ không quan tâm đến tôi nhiều như tôi quan tâm đến họ." } },
  { id: "anx05", subscale: "anxiety", rev: false, core: false,
    text: { en: "I often wish that my partner's feelings for me were as strong as my feelings for them.", vi: "Tôi thường ước rằng tình cảm của người ấy dành cho tôi mạnh mẽ như tình cảm tôi dành cho họ." } },
  { id: "anx06", subscale: "anxiety", rev: false, core: true,
    text: { en: "I worry a lot about being abandoned by my partner.", vi: "Tôi lo lắng rất nhiều về việc bị người ấy bỏ rơi." } },
  { id: "anx07", subscale: "anxiety", rev: false, core: true,
    text: { en: "I need a lot of reassurance that I am loved.", vi: "Tôi cần được trấn an rất nhiều rằng mình đang được yêu thương." } },
  { id: "anx08", subscale: "anxiety", rev: false, core: false,
    text: { en: "I worry that I won't measure up to other people my partner could choose instead.", vi: "Tôi lo rằng mình không đủ tốt so với những người khác mà người ấy có thể chọn thay tôi." } },
  { id: "anx09", subscale: "anxiety", rev: false, core: true,
    text: { en: "My need for closeness sometimes scares people away.", vi: "Nhu cầu gần gũi của tôi đôi khi khiến người khác cảm thấy sợ hãi và rời xa." } },
  { id: "anx10", subscale: "anxiety", rev: false, core: false,
    text: { en: "I'm afraid that once someone gets close to me, they will find things about me they don't like.", vi: "Tôi sợ rằng một khi ai đó đến gần tôi, họ sẽ nhận ra những điều ở tôi mà họ không thích." } },
  { id: "anx11", subscale: "anxiety", rev: false, core: true,
    text: { en: "It upsets me when I don't get the affection and support I need from my partner.", vi: "Tôi cảm thấy buồn khi không nhận được sự yêu thương và hỗ trợ mà tôi cần từ người ấy." } },
  { id: "anx12", subscale: "anxiety", rev: false, core: false,
    text: { en: "I get anxious when my partner is away from me for too long.", vi: "Tôi cảm thấy lo lắng khi người ấy ở xa tôi quá lâu." } },
  { id: "anx13", subscale: "anxiety", rev: false, core: true,
    text: { en: "I get frustrated when my partner is not around as much as I would like.", vi: "Tôi cảm thấy khó chịu khi người ấy không ở bên tôi nhiều như tôi mong muốn." } },
  { id: "anx14", subscale: "anxiety", rev: false, core: false,
    text: { en: "Sometimes I feel I have to push my partner to show more feeling or commitment.", vi: "Đôi khi tôi cảm thấy mình phải thúc ép người ấy thể hiện tình cảm hoặc cam kết nhiều hơn." } },
  { id: "anx15", subscale: "anxiety", rev: true, core: true,
    text: { en: "I rarely worry about my partner leaving me.", vi: "Tôi hiếm khi lo lắng về việc người ấy sẽ rời bỏ tôi." } },
  { id: "anx16", subscale: "anxiety", rev: true, core: true,
    text: { en: "I feel confident my partner wants to stay in this relationship.", vi: "Tôi tin tưởng rằng người ấy muốn duy trì mối quan hệ này." } },
  { id: "anx17", subscale: "anxiety", rev: true, core: true,
    text: { en: "I don't worry much about being abandoned.", vi: "Tôi không quá lo lắng về việc bị bỏ rơi." } },
  { id: "anx18", subscale: "anxiety", rev: false, core: true,
    text: { en: "When I show my feelings for my partner, I'm afraid they won't feel the same way.", vi: "Khi tôi thể hiện tình cảm với người ấy, tôi sợ rằng họ sẽ không cảm nhận điều tương tự." } },

  // ---- AVOIDANCE SUBSCALE (18 items) --------------------------------------
  { id: "avo01", subscale: "avoidance", rev: false, core: true,
    text: { en: "I prefer not to show my partner how I feel deep down.", vi: "Tôi thích không thể hiện cho người ấy biết cảm xúc sâu thẳm của mình." } },
  { id: "avo02", subscale: "avoidance", rev: true, core: false,
    text: { en: "I feel comfortable sharing my private thoughts and feelings with my partner.", vi: "Tôi cảm thấy thoải mái khi chia sẻ những suy nghĩ và cảm xúc riêng tư với người ấy." } },
  { id: "avo03", subscale: "avoidance", rev: false, core: true,
    text: { en: "I find it difficult to allow myself to depend on romantic partners.", vi: "Tôi thấy khó cho phép bản thân dựa dẫm vào người yêu." } },
  { id: "avo04", subscale: "avoidance", rev: true, core: true,
    text: { en: "I am very comfortable being close to romantic partners.", vi: "Tôi cảm thấy rất thoải mái khi gần gũi với người yêu." } },
  { id: "avo05", subscale: "avoidance", rev: false, core: true,
    text: { en: "I don't feel comfortable opening up to romantic partners.", vi: "Tôi không cảm thấy thoải mái khi mở lòng với người yêu." } },
  { id: "avo06", subscale: "avoidance", rev: false, core: false,
    text: { en: "I prefer not to be too close to romantic partners.", vi: "Tôi thích không quá gần gũi với người yêu." } },
  { id: "avo07", subscale: "avoidance", rev: false, core: true,
    text: { en: "I get uncomfortable when a partner wants to be very close to me.", vi: "Tôi cảm thấy không thoải mái khi người ấy muốn thật gần gũi với tôi." } },
  { id: "avo08", subscale: "avoidance", rev: true, core: true,
    text: { en: "I find it relatively easy to get close to my partner.", vi: "Tôi thấy khá dễ dàng để trở nên gần gũi với người ấy." } },
  { id: "avo09", subscale: "avoidance", rev: true, core: false,
    text: { en: "It's not difficult for me to get close to my partner.", vi: "Việc trở nên gần gũi với người ấy không khó đối với tôi." } },
  { id: "avo10", subscale: "avoidance", rev: true, core: true,
    text: { en: "I usually discuss my problems and concerns with my partner.", vi: "Tôi thường trao đổi những vấn đề và lo lắng của mình với người ấy." } },
  { id: "avo11", subscale: "avoidance", rev: true, core: true,
    text: { en: "It helps to turn to my partner in times of need.", vi: "Việc tìm đến người ấy khi cần giúp ích cho tôi rất nhiều." } },
  { id: "avo12", subscale: "avoidance", rev: true, core: false,
    text: { en: "I tell my partner just about everything.", vi: "Tôi kể cho người ấy nghe hầu như mọi chuyện." } },
  { id: "avo13", subscale: "avoidance", rev: false, core: true,
    text: { en: "I try to avoid getting too close to my partner.", vi: "Tôi cố tránh trở nên quá gần gũi với người ấy." } },
  { id: "avo14", subscale: "avoidance", rev: false, core: false,
    text: { en: "I am nervous when a partner gets too physically close to me.", vi: "Tôi cảm thấy lo lắng khi người ấy đến quá gần về mặt thể chất." } },
  { id: "avo15", subscale: "avoidance", rev: true, core: true,
    text: { en: "I feel comfortable depending on romantic partners.", vi: "Tôi cảm thấy thoải mái khi dựa dẫm vào người yêu." } },
  { id: "avo16", subscale: "avoidance", rev: true, core: true,
    text: { en: "I find it easy to depend on romantic partners.", vi: "Tôi thấy dễ dàng khi dựa dẫm vào người yêu." } },
  { id: "avo17", subscale: "avoidance", rev: true, core: true,
    text: { en: "It's easy for me to be affectionate with my partner.", vi: "Tôi dễ dàng thể hiện sự trìu mến với người ấy." } },
  { id: "avo18", subscale: "avoidance", rev: false, core: false,
    text: { en: "I'd rather not share my deepest feelings with my partner.", vi: "Tôi thà không chia sẻ những cảm xúc sâu kín nhất của mình với người ấy." } },
];

/* 7-point Likert response scale, shared by both subscales. */
const ECRR_LIKERT_LABELS = [
  { en: "Disagree strongly", vi: "Hoàn toàn không đồng ý" },
  { en: "Disagree", vi: "Không đồng ý" },
  { en: "Disagree slightly", vi: "Hơi không đồng ý" },
  { en: "Neutral / Mixed", vi: "Trung lập / Lẫn lộn" },
  { en: "Agree slightly", vi: "Hơi đồng ý" },
  { en: "Agree", vi: "Đồng ý" },
  { en: "Agree strongly", vi: "Hoàn toàn đồng ý" },
];

/* ---- Quick-version subset: 12 curated core items per subscale (24 total),
   matching the exact IDs listed in the project spec. Derived, not a
   separately maintained array — same pattern as IQ_QUESTIONS_CORE. ---- */
const ECRR_QUESTIONS_CORE = ECRR_QUESTIONS.filter((q) => q.core);
