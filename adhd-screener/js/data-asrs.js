/* =========================================================================
   ASRS v1.1 — Adult ADHD Self-Report Scale, WHO Symptom Checklist
   -------------------------------------------------------------------------
   © World Health Organization 2003. Based on the Composite International
   Diagnostic Interview © 2001 World Health Organization. Developed with
   NYU/Harvard's Workgroup on Adult ADHD (L. Adler, R. Kessler, T. Spencer).
   Used with permission — free to use for clinical/educational purposes;
   requests to reproduce/translate for sale should go to Prof. Ronald
   Kessler, Dept. of Health Care Policy, Harvard Medical School.
   Primary reference: Kessler RC, et al. "The World Health Organization
   Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in
   the general population." Psychol Med. 2005;35(2):245-256.

   ENGLISH ITEM WORDING IS VERBATIM from the official 18-item Symptom
   Checklist (Part A = items 1-6, the validated 6-question screener; Part B
   = items 7-18, supplementary detail with no diagnostic total of its own).
   Vietnamese wording is an original translation for this project, not an
   official WHO release — treat as a comprehension aid, not a validated
   translation.

   VALIDATION POPULATION: adults aged 18+ (IQ in the normal range, ~80+).
   The ASRS v1.1 was NOT developed or normed on children/adolescents. This
   app still allows younger users to complete it (see data-context.js age
   tiers) but the results screen carries an explicit, unmissable caveat for
   under-18 users — do not remove or soften that caveat.

   SCORING — do not "simplify" this, it is a common source of errors online:
   Each item is scored 0 or 1 (never a 0-4 Likert sum) based on where the
   WHO paper form's shaded threshold begins for that specific item:
     • "Sometimes-or-more" items (shaded from Sometimes/Often/Very Often):
       1, 2, 3, 9, 12, 16, 18
     • "Often-or-more" items (shaded from Often/Very Often only):
       4, 5, 6, 7, 8, 10, 11, 13, 14, 15, 17
   Part A (items 1-6) total range 0-6; a positive screen is 4+ hits.
   Part B (items 7-18) has NO validated cutoff or diagnostic total — the
   official instructions explicitly say to read it as descriptive detail,
   not to score it as a second scale. Never invent a Part B threshold.

   Symptom domains (descriptive only, not a diagnostic subtype assignment):
     Inattention:              items 1, 2, 3, 4, 7, 8, 9, 10, 11  (9 items)
     Hyperactivity-Impulsivity: items 5, 6, 12, 13, 14, 15, 16, 17, 18 (9 items)
========================================================================= */

const ASRS_SCALE_LABELS = {
  en: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
  vi: ["Không Bao Giờ", "Hiếm Khi", "Thỉnh Thoảng", "Thường Xuyên", "Rất Thường Xuyên"],
};

const ASRS_STEM = {
  en: "Please rate yourself on each of the criteria below using the scale on the right, thinking about how you have felt and conducted yourself over the past 6 months.",
  vi: "Vui lòng tự đánh giá bản thân theo từng tiêu chí dưới đây bằng thang điểm bên phải, dựa trên cảm nhận và cách bạn hành xử trong 6 tháng vừa qua.",
};

/* threshold: "sometimes" | "often" — which response column starts scoring 1.
   domain: "IN" (inattention) | "HI" (hyperactivity-impulsivity).
   part: "A" | "B". */
const ASRS_QUESTIONS = [
  { id: "a1", part: "A", domain: "IN", threshold: "sometimes",
    text: { en: "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
            vi: "Bạn có thường xuyên gặp khó khăn trong việc hoàn tất các chi tiết cuối cùng của một dự án, sau khi phần khó khăn đã xong không?" } },
  { id: "a2", part: "A", domain: "IN", threshold: "sometimes",
    text: { en: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
            vi: "Bạn có thường xuyên gặp khó khăn trong việc sắp xếp mọi thứ theo thứ tự khi phải làm một việc đòi hỏi tính tổ chức không?" } },
  { id: "a3", part: "A", domain: "IN", threshold: "sometimes",
    text: { en: "How often do you have problems remembering appointments or obligations?",
            vi: "Bạn có thường xuyên gặp vấn đề trong việc nhớ các cuộc hẹn hoặc nghĩa vụ phải làm không?" } },
  { id: "a4", part: "A", domain: "IN", threshold: "often",
    text: { en: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
            vi: "Khi có một việc đòi hỏi phải suy nghĩ nhiều, bạn có thường xuyên né tránh hoặc trì hoãn việc bắt đầu không?" } },
  { id: "a5", part: "A", domain: "HI", threshold: "often",
    text: { en: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
            vi: "Bạn có thường xuyên cựa quậy tay chân khi phải ngồi yên trong thời gian dài không?" } },
  { id: "a6", part: "A", domain: "HI", threshold: "often",
    text: { en: "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
            vi: "Bạn có thường xuyên cảm thấy hoạt động quá mức và bị thôi thúc phải làm việc gì đó, như thể bị một động cơ thúc đẩy không?" } },
  { id: "b7", part: "B", domain: "IN", threshold: "often",
    text: { en: "How often do you make careless mistakes when you have to work on a boring or difficult project?",
            vi: "Bạn có thường xuyên mắc lỗi bất cẩn khi phải làm một dự án nhàm chán hoặc khó khăn không?" } },
  { id: "b8", part: "B", domain: "IN", threshold: "often",
    text: { en: "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?",
            vi: "Bạn có thường xuyên gặp khó khăn trong việc duy trì sự chú ý khi làm công việc nhàm chán hoặc lặp đi lặp lại không?" } },
  { id: "b9", part: "B", domain: "IN", threshold: "sometimes",
    text: { en: "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?",
            vi: "Bạn có thường xuyên gặp khó khăn trong việc tập trung vào điều người khác nói với bạn, ngay cả khi họ nói trực tiếp với bạn không?" } },
  { id: "b10", part: "B", domain: "IN", threshold: "often",
    text: { en: "How often do you misplace or have difficulty finding things at home or at work?",
            vi: "Bạn có thường xuyên để thất lạc hoặc khó tìm thấy đồ vật ở nhà hoặc nơi làm việc không?" } },
  { id: "b11", part: "B", domain: "IN", threshold: "often",
    text: { en: "How often are you distracted by activity or noise around you?",
            vi: "Bạn có thường xuyên bị phân tâm bởi hoạt động hoặc tiếng ồn xung quanh không?" } },
  { id: "b12", part: "B", domain: "HI", threshold: "sometimes",
    text: { en: "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?",
            vi: "Bạn có thường xuyên rời khỏi chỗ ngồi trong cuộc họp hoặc các tình huống mà bạn được yêu cầu ngồi yên không?" } },
  { id: "b13", part: "B", domain: "HI", threshold: "often",
    text: { en: "How often do you feel restless or fidgety?",
            vi: "Bạn có thường xuyên cảm thấy bồn chồn hoặc không yên không?" } },
  { id: "b14", part: "B", domain: "HI", threshold: "often",
    text: { en: "How often do you have difficulty unwinding and relaxing when you have time to yourself?",
            vi: "Bạn có thường xuyên gặp khó khăn trong việc thư giãn khi có thời gian riêng cho bản thân không?" } },
  { id: "b15", part: "B", domain: "HI", threshold: "often",
    text: { en: "How often do you find yourself talking too much when you are in social situations?",
            vi: "Bạn có thường thấy mình nói quá nhiều trong các tình huống xã giao không?" } },
  { id: "b16", part: "B", domain: "HI", threshold: "sometimes",
    text: { en: "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?",
            vi: "Khi đang trò chuyện, bạn có thường thấy mình nói tiếp câu của người khác trước khi họ kịp nói xong không?" } },
  { id: "b17", part: "B", domain: "HI", threshold: "often",
    text: { en: "How often do you have difficulty waiting your turn in situations when turn taking is required?",
            vi: "Bạn có thường xuyên gặp khó khăn khi phải chờ đến lượt mình trong các tình huống cần thay phiên nhau không?" } },
  { id: "b18", part: "B", domain: "HI", threshold: "sometimes",
    text: { en: "How often do you interrupt others when they are busy?",
            vi: "Bạn có thường xuyên ngắt lời người khác khi họ đang bận không?" } },
];

const ASRS_PART_A = ASRS_QUESTIONS.filter((q) => q.part === "A");
const ASRS_PART_B = ASRS_QUESTIONS.filter((q) => q.part === "B");

/* Screening-result copy (Part A only — the one part of this instrument with
   a validated cutoff). Deliberately does NOT use words like "mild ADHD" or
   "severe ADHD" — the instrument cannot support a severity claim. */
const ASRS_SCREEN_RESULT = {
  positive: {
    pill: "high",
    name: { en: "Positive screen", vi: "Sàng lọc dương tính" },
    summary: {
      en: "Four or more of your Part A answers fell in the range the WHO scoring key flags. On the validated 6-item screener, this pattern is described as \"highly consistent with ADHD in adults\" — meaning it's common among adults who go on to receive an ADHD diagnosis, not that you have one.",
      vi: "Bốn câu trả lời trở lên ở Phần A của bạn rơi vào vùng mà thang điểm chính thức của WHO đánh dấu. Trên bộ sàng lọc 6 câu đã được kiểm định, mẫu hình này được mô tả là \"phù hợp cao với ADHD ở người lớn\" — nghĩa là mẫu hình này phổ biến ở những người lớn sau đó được chẩn đoán ADHD, không có nghĩa là bạn chắc chắn mắc ADHD.",
    },
    guidance: {
      en: "This result means a full evaluation is a reasonable next step, not that a diagnosis is confirmed. Bring this result to a doctor, psychiatrist, or psychologist — ideally with the marked answers and a few concrete examples of when these patterns showed up at school, work, or home.",
      vi: "Kết quả này có nghĩa là một buổi đánh giá toàn diện là bước tiếp theo hợp lý — không có nghĩa là chẩn đoán đã được xác nhận. Hãy mang kết quả này đến gặp bác sĩ, bác sĩ tâm thần, hoặc nhà tâm lý học — tốt nhất kèm theo các câu trả lời đã đánh dấu và vài ví dụ cụ thể về thời điểm những mẫu hình này xuất hiện ở trường học, công việc, hoặc ở nhà.",
    },
  },
  negative: {
    pill: "low",
    name: { en: "Negative screen", vi: "Sàng lọc âm tính" },
    summary: {
      en: "Fewer than four of your Part A answers fell in the flagged range. On the validated 6-item screener, this pattern is described as less consistent with ADHD — though the screener misses some real cases (its sensitivity is roughly 69%), so a negative screen doesn't rule ADHD out if symptoms are clearly causing you difficulty.",
      vi: "Ít hơn bốn câu trả lời ở Phần A của bạn rơi vào vùng được đánh dấu. Trên bộ sàng lọc 6 câu đã được kiểm định, mẫu hình này được mô tả là ít phù hợp với ADHD hơn — tuy nhiên bộ sàng lọc này vẫn bỏ sót một số trường hợp thật (độ nhạy khoảng 69%), vì vậy kết quả âm tính không loại trừ hoàn toàn khả năng mắc ADHD nếu các triệu chứng đang thực sự gây khó khăn cho bạn.",
    },
    guidance: {
      en: "If nothing here feels like a concern, that's a reasonable place to stop. If you still suspect ADHD despite this result — especially if attention or impulsivity problems are clearly affecting your life — it's still worth raising with a clinician; screeners are a starting point, not the final word.",
      vi: "Nếu không có điều gì ở đây khiến bạn lo lắng, đây là một điểm dừng hợp lý. Nếu bạn vẫn nghi ngờ mình có ADHD dù kết quả này, đặc biệt nếu các vấn đề về chú ý hoặc bốc đồng đang rõ ràng ảnh hưởng đến cuộc sống của bạn, vẫn nên trao đổi với chuyên gia — bộ sàng lọc chỉ là điểm khởi đầu, không phải kết luận cuối cùng.",
    },
  },
};

/* Presentation pattern from all 18 items — descriptive only. DSM-5 formally
   requires a clinician to assign a "presentation" (inattentive /
   hyperactive-impulsive / combined) using full criteria, impairment, and
   childhood-onset evidence — this label is a plain-language description of
   which items you endorsed more of, nothing more. */
function asrsPresentationLabel(inCount, hiCount) {
  const inFlag = inCount >= 5; // majority of the 9 inattention items
  const hiFlag = hiCount >= 5; // majority of the 9 hyperactivity-impulsivity items
  if (inFlag && hiFlag) return "combined";
  if (inFlag) return "inattentive";
  if (hiFlag) return "hyperactive";
  return "belowPattern";
}

const ASRS_PRESENTATION_COPY = {
  combined: {
    name: { en: "Mixed pattern (inattention + hyperactivity-impulsivity)", vi: "Mẫu hình hỗn hợp (mất chú ý + tăng động-bốc đồng)" },
    text: { en: "You endorsed a majority of items in both symptom clusters — inattention (organizing, follow-through, distractibility) and hyperactivity-impulsivity (restlessness, interrupting, feeling driven). This roughly maps to what clinicians call the \"combined presentation,\" though only a clinical interview can confirm that.", vi: "Bạn đã xác nhận phần lớn các mục trong cả hai nhóm triệu chứng — mất chú ý (tổ chức, hoàn thành công việc, dễ bị phân tâm) và tăng động-bốc đồng (bồn chồn, ngắt lời, cảm giác bị thôi thúc). Điều này gần tương ứng với điều các chuyên gia gọi là \"biểu hiện hỗn hợp,\" tuy chỉ có buổi phỏng vấn lâm sàng mới có thể xác nhận điều đó." },
  },
  inattentive: {
    name: { en: "Inattention-leaning pattern", vi: "Mẫu hình nghiêng về mất chú ý" },
    text: { en: "Most of what you endorsed clusters around organizing, follow-through, losing things, and staying focused on unstimulating tasks, more than restlessness or impulsivity. This roughly maps to what clinicians call the \"predominantly inattentive presentation.\"", vi: "Phần lớn những gì bạn xác nhận tập trung vào việc tổ chức, hoàn thành công việc, làm mất đồ, và duy trì sự tập trung vào các công việc kém kích thích, nhiều hơn là sự bồn chồn hay bốc đồng. Điều này gần tương ứng với điều các chuyên gia gọi là \"biểu hiện chủ yếu mất chú ý.\"" },
  },
  hyperactive: {
    name: { en: "Hyperactivity-impulsivity-leaning pattern", vi: "Mẫu hình nghiêng về tăng động-bốc đồng" },
    text: { en: "Most of what you endorsed clusters around restlessness, feeling driven, interrupting, and difficulty waiting your turn, more than organization or follow-through problems. This roughly maps to what clinicians call the \"predominantly hyperactive-impulsive presentation.\"", vi: "Phần lớn những gì bạn xác nhận tập trung vào sự bồn chồn, cảm giác bị thôi thúc, ngắt lời, và khó chờ đến lượt, nhiều hơn là các vấn đề về tổ chức hay hoàn thành công việc. Điều này gần tương ứng với điều các chuyên gia gọi là \"biểu hiện chủ yếu tăng động-bốc đồng.\"" },
  },
  belowPattern: {
    name: { en: "No strong pattern in either cluster", vi: "Không có mẫu hình nổi bật ở nhóm nào" },
    text: { en: "You didn't endorse a majority of items in either symptom cluster. This is common even alongside a positive Part A screen — a handful of high-frequency answers can drive a positive screen without a broad symptom pattern across Part B.", vi: "Bạn không xác nhận phần lớn các mục ở nhóm triệu chứng nào. Điều này khá phổ biến ngay cả khi kết quả sàng lọc Phần A là dương tính — một vài câu trả lời tần suất cao có thể khiến sàng lọc dương tính mà không có mẫu hình triệu chứng rộng ở Phần B." },
  },
};
