/* =========================================================================
   SHARED AFFILIATE LINK CONFIG — Psychology Assessments project
   -------------------------------------------------------------------------
   One place to store every outbound affiliate/referral link used across
   the hub and (later) individual assessment results pages. Swap the
   placeholder URLs below for your real affiliate/tracking links once each
   program approves your application — nothing else needs to change,
   since index.html (and any future assessment page) just reads from
   AFFILIATE_LINKS by key.

   HOW TO UPDATE A LINK:
     Find the key below (e.g. "careerCourses") and replace `url` with your
     approved affiliate link. Keep the `label`/`blurb` fields as-is or
     tweak the copy — those are just what renders on the page.

   ADDING A NEW LINK:
     1. Add a new { key: {...} } entry following the same shape.
     2. Add a matching card in index.html's Resources section (or, later,
        an assessment's results screen) referencing AFFILIATE_LINKS.newKey.url.

   COMPLIANCE NOTE (read before publishing):
     FTC rules require a clear, easy-to-see disclosure that these are paid/
     affiliate links, placed near the links themselves (not buried in a
     footer). index.html already includes a disclosure line above the
     Resources section — keep an equivalent disclosure anywhere these links
     are reused. Use rel="sponsored noopener" on every affiliate <a> tag.
========================================================================= */

const AFFILIATE_LINKS = {
  // Career & personality assessment → course platforms, career coaching
  careerCourses: {
    category: "career",
    label: { en: "Coursera — online courses & certificates", vi: "Coursera — khóa học & chứng chỉ trực tuyến" },
    blurb: {
      en: "Explore courses matched to your career interests, from professional certificates to full specializations.",
      vi: "Khám phá các khóa học phù hợp với sở thích nghề nghiệp của bạn, từ chứng chỉ chuyên nghiệp đến chuyên ngành đầy đủ.",
    },
    // TODO: replace with your approved Coursera affiliate link (apply via Coursera's affiliate program / Impact network)
    url: "https://www.coursera.org/?utm_source=REPLACE_WITH_AFFILIATE_ID",
  },
  careerTest: {
    category: "career",
    label: { en: "CareerFitter — deeper career-match report", vi: "CareerFitter — báo cáo phù hợp nghề nghiệp chuyên sâu" },
    blurb: {
      en: "A more detailed, paid career-matching report if you want to go beyond this assessment's free results.",
      vi: "Một báo cáo phù hợp nghề nghiệp trả phí, chi tiết hơn nếu bạn muốn vượt ra ngoài kết quả miễn phí của bài đánh giá này.",
    },
    // TODO: replace with your approved CareerFitter affiliate link
    url: "https://www.careerfitter.com/?ref=REPLACE_WITH_AFFILIATE_ID",
  },

  // Wellbeing / stress / self-esteem → therapy & mindfulness
  therapy: {
    category: "wellbeing",
    label: { en: "BetterHelp — talk to a licensed therapist online", vi: "BetterHelp — trò chuyện với chuyên gia trị liệu trực tuyến" },
    blurb: {
      en: "If your results suggest ongoing stress or low mood, online therapy can offer a starting point for support.",
      vi: "Nếu kết quả của bạn cho thấy căng thẳng kéo dài hoặc tâm trạng thấp, trị liệu trực tuyến có thể là một điểm khởi đầu để được hỗ trợ.",
    },
    // TODO: replace with your approved BetterHelp affiliate link (apply via Impact Radius)
    url: "https://www.betterhelp.com/?utm_source=REPLACE_WITH_AFFILIATE_ID",
  },
  mindfulness: {
    category: "wellbeing",
    label: { en: "Headspace — guided meditation & sleep", vi: "Headspace — thiền có hướng dẫn & giấc ngủ" },
    blurb: {
      en: "Short, guided sessions for stress, focus, and sleep — a low-pressure way to build a daily calming habit.",
      vi: "Các buổi thiền ngắn, có hướng dẫn cho căng thẳng, sự tập trung và giấc ngủ — một cách nhẹ nhàng để xây dựng thói quen thư giãn hằng ngày.",
    },
    // TODO: replace with your approved Headspace affiliate link
    url: "https://www.headspace.com/?utm_source=REPLACE_WITH_AFFILIATE_ID",
  },

  // General self-improvement → books
  books: {
    category: "general",
    label: { en: "Recommended reading on self-understanding", vi: "Sách gợi ý về sự thấu hiểu bản thân" },
    blurb: {
      en: "A short list of well-regarded books related to personality, habits, and emotional wellbeing.",
      vi: "Một danh sách ngắn các cuốn sách được đánh giá cao về tính cách, thói quen và sức khỏe tinh thần.",
    },
    // TODO: replace with your Amazon Associates (or other bookseller) affiliate link
    url: "https://www.amazon.com/s?k=personality+psychology+self+help&tag=REPLACE_WITH_AFFILIATE_ID",
  },
};

// Convenience: get all links for a given category (e.g. "career", "wellbeing", "general")
function getAffiliateLinksByCategory(category) {
  return Object.entries(AFFILIATE_LINKS)
    .filter(([, v]) => v.category === category)
    .map(([key, v]) => ({ key, ...v }));
}
