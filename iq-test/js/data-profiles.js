/* =========================================================================
   DOMAIN PROFILES · INTERPRETATION BANDS · AGE & EDUCATION FACTORS
   -------------------------------------------------------------------------
   IQ_DOMAINS: the 5 ability domains, with report content per domain.

   IQ_BANDS: interpretation bands for the ADJUSTED composite (0–100 % of
   weighted points). `indicative` gives a rough IQ-style equivalent RANGE,
   always presented with the caveat that a self-administered, untimed
   browser test cannot measure true IQ (no standardized administration,
   no norming sample).

   AGE_GROUPS / EDU_LEVELS: heuristic interpretation adjustments, NOT
   psychometric norms. Rationale (documented, deliberately conservative):
   - Fluid abilities (logic, spatial, memory, speed) peak in early
     adulthood and decline gradually with age in normed batteries, so the
     same raw score is a stronger signal at 65 than at 25 → small positive
     offsets for teens (still developing) and older groups.
   - Formal education specifically trains verbal/numerical material, so
     the same raw score means more from someone with less schooling →
     positive offsets for less formal education, small negative for
     postgraduate.
   Offsets are added to the composite before banding (clamped 0–100) and
   are shown transparently in the report.
========================================================================= */

const IQ_DOMAINS = {
  verbal: {
    key: "verbal", emoji: "📖",
    name: { en: "Verbal Reasoning", vi: "Tư Duy Ngôn Ngữ" },
    desc: { en: "Working with word meanings, analogies, and verbal logic.", vi: "Làm việc với nghĩa của từ, phép loại suy, và suy luận bằng ngôn ngữ." },
    strongTip: { en: "Your verbal reasoning is a standout — lean on it: think problems through by writing or talking them out.", vi: "Tư duy ngôn ngữ là điểm nổi bật của bạn — hãy tận dụng: suy nghĩ vấn đề bằng cách viết ra hoặc nói ra." },
    growTip: { en: "To build verbal agility: read outside your usual genres and try summarizing arguments in one sentence.", vi: "Để rèn sự linh hoạt ngôn ngữ: đọc ngoài thể loại quen thuộc và tập tóm tắt lập luận trong một câu." },
  },
  numerical: {
    key: "numerical", emoji: "🔢",
    name: { en: "Numerical Reasoning", vi: "Tư Duy Số Học" },
    desc: { en: "Spotting number patterns and reasoning with quantities.", vi: "Nhận ra quy luật con số và suy luận với các đại lượng." },
    strongTip: { en: "Numbers are a natural language for you — use estimates and quick models when deciding.", vi: "Con số là ngôn ngữ tự nhiên của bạn — hãy dùng ước lượng và mô hình nhanh khi ra quyết định." },
    growTip: { en: "To sharpen number sense: do everyday math mentally (tips, discounts, unit prices) before reaching for a calculator.", vi: "Để rèn cảm giác con số: tính nhẩm các phép toán hằng ngày (tiền tip, giảm giá, đơn giá) trước khi dùng máy tính." },
  },
  logical: {
    key: "logical", emoji: "🧩",
    name: { en: "Logical Reasoning", vi: "Tư Duy Logic" },
    desc: { en: "Finding rules and patterns, and drawing valid conclusions.", vi: "Tìm ra quy luật, khuôn mẫu, và rút ra kết luận hợp lệ." },
    strongTip: { en: "Pattern-finding is your engine — you'll do well wherever systems and rules need untangling.", vi: "Tìm quy luật là động cơ của bạn — bạn sẽ làm tốt ở bất cứ đâu cần gỡ rối hệ thống và nguyên tắc." },
    growTip: { en: "To train pattern-finding: puzzle games (sudoku, logic grids) genuinely exercise this — a little, often.", vi: "Để luyện tìm quy luật: các trò giải đố (sudoku, lưới logic) thực sự rèn kỹ năng này — mỗi lần một chút, đều đặn." },
  },
  spatial: {
    key: "spatial", emoji: "📐",
    name: { en: "Spatial Reasoning", vi: "Tư Duy Không Gian" },
    desc: { en: "Rotating, folding, and manipulating shapes in the mind's eye.", vi: "Xoay, gấp, và thao tác hình khối trong tâm trí." },
    strongTip: { en: "You think well in 3-D — sketching and diagramming problems will multiply your other strengths.", vi: "Bạn tư duy tốt trong không gian 3 chiều — vẽ phác và sơ đồ hóa vấn đề sẽ nhân sức mạnh các thế mạnh khác của bạn." },
    growTip: { en: "To build spatial skill: navigate without GPS sometimes, sketch objects from other angles, try assembly puzzles.", vi: "Để rèn kỹ năng không gian: thỉnh thoảng tìm đường không dùng GPS, vẽ vật thể từ góc nhìn khác, thử các trò lắp ráp." },
  },
  memory: {
    key: "memory", emoji: "🧠",
    name: { en: "Working Memory & Attention", vi: "Trí Nhớ Làm Việc & Sự Chú Ý" },
    desc: { en: "Holding and mentally manipulating information without notes.", vi: "Giữ và thao tác thông tin trong đầu mà không cần ghi chú." },
    strongTip: { en: "Strong mental workspace — you can juggle steps in your head that others need paper for.", vi: "Không gian làm việc tinh thần mạnh mẽ — bạn có thể xử lý trong đầu những bước mà người khác cần giấy bút." },
    growTip: { en: "Working memory responds to sleep and focus more than any trick — single-task hard things, and protect rest.", vi: "Trí nhớ làm việc cải thiện nhờ giấc ngủ và sự tập trung hơn bất kỳ mẹo nào — làm việc khó một cách chuyên tâm, và bảo vệ sự nghỉ ngơi." },
  },
};

const IQ_BANDS = {
  exceptional: {
    key: "exceptional", cutoff: 85,
    name: { en: "Exceptional", vi: "Xuất Sắc" },
    indicative: { en: "indicatively comparable to the upper ranges (~125+) on formal tests", vi: "tương đương một cách gợi ý với vùng điểm cao (~125+) của các bài trắc nghiệm chính thức" },
    summary: { en: "You solved nearly everything, including the hardest items. On this (untimed, self-administered) challenge your reasoning is exceptional across the board.", vi: "Bạn đã giải được gần như tất cả, kể cả những câu khó nhất. Trong thử thách này (không tính giờ, tự thực hiện), năng lực suy luận của bạn xuất sắc trên mọi lĩnh vực." },
  },
  aboveAverage: {
    key: "aboveAverage", cutoff: 70,
    name: { en: "Above Average", vi: "Trên Trung Bình" },
    indicative: { en: "indicatively comparable to roughly the 110–125 region on formal tests", vi: "tương đương một cách gợi ý với vùng khoảng 110–125 của các bài trắc nghiệm chính thức" },
    summary: { en: "You handled most items, including many hard ones. Your reasoning is comfortably above the middle of the range on this challenge.", vi: "Bạn xử lý được hầu hết các câu, kể cả nhiều câu khó. Năng lực suy luận của bạn vượt hẳn mức giữa trong thử thách này." },
  },
  average: {
    key: "average", cutoff: 45,
    name: { en: "Solidly Average", vi: "Trung Bình Vững" },
    indicative: { en: "indicatively comparable to the broad average region (~90–110) on formal tests", vi: "tương đương một cách gợi ý với vùng trung bình rộng (~90–110) của các bài trắc nghiệm chính thức" },
    summary: { en: "You solved the easier and many medium items — the profile most people produce. The domain breakdown below is more informative than the total.", vi: "Bạn giải được các câu dễ và nhiều câu trung bình — hồ sơ mà đa số mọi người đạt được. Phân tích theo lĩnh vực bên dưới có giá trị hơn điểm tổng." },
  },
  belowAverage: {
    key: "belowAverage", cutoff: 30,
    name: { en: "Below Average (today)", vi: "Dưới Trung Bình (hôm nay)" },
    indicative: { en: "below the middle region on this particular challenge", vi: "dưới vùng giữa trong thử thách cụ thể này" },
    summary: { en: "Today's score sits below the middle. Fatigue, stress, language, distraction, or unfamiliarity with test formats can all lower scores substantially — see the context notes below before reading much into it.", vi: "Điểm hôm nay nằm dưới mức giữa. Mệt mỏi, căng thẳng, ngôn ngữ, sự xao nhãng, hoặc chưa quen dạng bài đều có thể làm giảm điểm đáng kể — hãy xem phần lưu ý ngữ cảnh bên dưới trước khi kết luận." },
  },
  developing: {
    key: "developing", cutoff: 0,
    name: { en: "Developing (today)", vi: "Đang Phát Triển (hôm nay)" },
    indicative: { en: "in the lower region on this particular challenge", vi: "ở vùng thấp trong thử thách cụ thể này" },
    summary: { en: "Most items didn't land today. A single sitting of a browser quiz says very little on its own — check the context notes, try the review section, and consider retaking when fresh.", vi: "Phần lớn các câu hôm nay chưa được giải đúng. Một lần làm bài trên trình duyệt tự nó nói lên rất ít — hãy xem phần lưu ý ngữ cảnh, đọc phần giải thích đáp án, và cân nhắc làm lại khi tỉnh táo." },
  },
};
const IQ_BAND_ORDER = ["exceptional", "aboveAverage", "average", "belowAverage", "developing"];

/* ---- Age groups (heuristic composite offsets, in points) ---- */
const AGE_GROUPS = [
  { key: "teen", offset: 3, label: { en: "13–17", vi: "13–17" }, blurb: { en: "Reasoning is still developing at this age — scores are read slightly generously.", vi: "Ở tuổi này năng lực suy luận vẫn đang phát triển — điểm được diễn giải rộng rãi hơn một chút." } },
  { key: "youngAdult", offset: 0, label: { en: "18–29", vi: "18–29" }, blurb: { en: "The reference group — fluid reasoning typically peaks here, so no adjustment.", vi: "Nhóm tham chiếu — tư duy linh hoạt thường đạt đỉnh ở giai đoạn này, nên không điều chỉnh." } },
  { key: "adult", offset: 1, label: { en: "30–49", vi: "30–49" }, blurb: { en: "A small adjustment reflecting the gradual normal shift in fluid abilities.", vi: "Điều chỉnh nhỏ phản ánh sự thay đổi tự nhiên dần dần của tư duy linh hoạt." } },
  { key: "mature", offset: 3, label: { en: "50–64", vi: "50–64" }, blurb: { en: "Fluid abilities normally ease with age while knowledge keeps growing — the same raw score is a stronger signal here.", vi: "Tư duy linh hoạt thường giảm nhẹ theo tuổi trong khi kiến thức tiếp tục tăng — cùng một điểm thô ở nhóm này là tín hiệu mạnh hơn." } },
  { key: "senior", offset: 5, label: { en: "65+", vi: "65+" }, blurb: { en: "Normal aging affects speed and working memory most — scores are read accordingly.", vi: "Lão hóa tự nhiên ảnh hưởng nhiều nhất đến tốc độ và trí nhớ làm việc — điểm được diễn giải tương ứng." } },
];

/* ---- Education levels (heuristic composite offsets, in points) ---- */
const EDU_LEVELS = [
  { key: "belowHS", offset: 4, label: { en: "Below high school", vi: "Dưới trung học phổ thông" }, blurb: { en: "Test formats and school-style material are less familiar — the same raw score means more.", vi: "Dạng bài kiểm tra và nội dung kiểu trường lớp ít quen thuộc hơn — cùng một điểm thô có ý nghĩa lớn hơn." } },
  { key: "highSchool", offset: 2, label: { en: "High school", vi: "Trung học phổ thông" }, blurb: { en: "A modest adjustment for less exposure to test-style verbal and numerical material.", vi: "Điều chỉnh nhẹ do ít tiếp xúc hơn với dạng bài ngôn ngữ và số học kiểu kiểm tra." } },
  { key: "bachelor", offset: 0, label: { en: "College / Bachelor's", vi: "Cao đẳng / Đại học" }, blurb: { en: "The reference group — no adjustment.", vi: "Nhóm tham chiếu — không điều chỉnh." } },
  { key: "postgrad", offset: -2, label: { en: "Postgraduate", vi: "Sau đại học" }, blurb: { en: "Extended education specifically trains test-style reasoning — scores are read slightly more strictly.", vi: "Học vấn kéo dài rèn luyện chính dạng suy luận kiểu kiểm tra — điểm được diễn giải nghiêm hơn một chút." } },
];
