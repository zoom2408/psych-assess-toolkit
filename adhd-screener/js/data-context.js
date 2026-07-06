/* =========================================================================
   CONTEXT MODULE — Impairment, Setting & History
   -------------------------------------------------------------------------
   This module is NOT part of the ASRS v1.1 instrument and is never blended
   into its score. It exists because the ASRS's own official instructions
   (see data-asrs.js header) tell the person administering it to also look
   at three things beyond the 18 items: Impairment (across work/school,
   social, and family settings), and History (childhood onset). This module
   operationalizes exactly those three things as a separate, descriptive,
   unvalidated set of follow-up questions — same spirit as how PHQ-9's
   functional-impairment follow-up in wellbeing-checkin is kept out of the
   0-27 total. Never fold these answers into the ASRS Part A/B score, and
   never present them as if they were part of a validated instrument.

   Impact items use a 4-point scale (0-3): Not at all / A little / Quite a
   bit / A great deal — plain descriptive severity, not a validated scale.
   A couple of items are yes/no/unsure ("ynu") flags instead.

   ageVariant lets the same question read naturally for a teen ("school"),
   a young adult ("school, training, or an early job"), or an adult
   ("work"). All four domains + history are shown to every age tier; only
   the wording adapts.
========================================================================= */

const CONTEXT_IMPACT_LABELS = {
  en: ["Not at all", "A little", "Quite a bit", "A great deal"],
  vi: ["Không chút nào", "Một chút", "Khá nhiều", "Rất nhiều"],
};

const CONTEXT_YNU_LABELS = {
  en: ["No", "Unsure", "Yes"],
  vi: ["Không", "Không chắc", "Có"],
};

const CONTEXT_DOMAINS = [
  {
    key: "education",
    label: { en: "Learning & Education", vi: "Học Tập & Giáo Dục" },
    icon: "🎓",
    intro: {
      en: "How much has attention or organization gotten in the way of learning settings — school, university, or training?",
      vi: "Sự chú ý hoặc khả năng tổ chức đã gây cản trở đến mức nào trong môi trường học tập — trường học, đại học, hoặc khóa đào tạo?",
    },
    items: [
      {
        id: "e1", type: "impact",
        text: {
          teen: { en: "Falling behind on homework or assignments, even ones you understand", vi: "Bị tụt lại trong bài tập về nhà hoặc bài tập được giao, ngay cả những bài bạn hiểu rõ" },
          youngAdult: { en: "Falling behind on coursework, assignments, or study deadlines, even material you understand", vi: "Bị tụt lại trong bài vở, bài tập, hoặc thời hạn học tập, ngay cả với nội dung bạn hiểu rõ" },
          adult: { en: "Historically, falling behind on coursework or assignments during your school years, even material you understood", vi: "Trong quá khứ, bị tụt lại trong bài vở hoặc bài tập trong những năm đi học, ngay cả với nội dung bạn hiểu rõ" },
        },
      },
      {
        id: "e2", type: "impact",
        text: {
          teen: { en: "Losing track of school materials, notes, or what was assigned", vi: "Làm thất lạc tài liệu học tập, ghi chú, hoặc quên bài được giao" },
          youngAdult: { en: "Losing track of course materials, notes, deadlines, or what was assigned", vi: "Làm thất lạc tài liệu học tập, ghi chú, thời hạn, hoặc quên bài được giao" },
          adult: { en: "Historically, losing track of school materials, notes, or assignments", vi: "Trong quá khứ, làm thất lạc tài liệu học tập, ghi chú, hoặc bài được giao" },
        },
      },
      {
        id: "e3", type: "impact",
        text: {
          teen: { en: "Zoning out or losing focus during class or while studying", vi: "Mất tập trung hoặc lơ đãng trong giờ học hoặc khi tự học" },
          youngAdult: { en: "Zoning out or losing focus during lectures, classes, or independent study", vi: "Mất tập trung hoặc lơ đãng trong giờ giảng, lớp học, hoặc khi tự học" },
          adult: { en: "Historically, zoning out or losing focus during class or lectures", vi: "Trong quá khứ, mất tập trung hoặc lơ đãng trong giờ học hoặc giờ giảng" },
        },
      },
      {
        id: "e4", type: "impact",
        text: {
          teen: { en: "Teachers or parents commenting on attention, restlessness, or behavior in class", vi: "Giáo viên hoặc phụ huynh nhận xét về sự chú ý, bồn chồn, hoặc hành vi trong lớp" },
          youngAdult: { en: "Instructors commenting on attention, focus, or missed deadlines", vi: "Giảng viên nhận xét về sự chú ý, khả năng tập trung, hoặc việc trễ hạn" },
          adult: { en: "Historically, teachers commenting on attention, restlessness, or behavior in class", vi: "Trong quá khứ, giáo viên nhận xét về sự chú ý, bồn chồn, hoặc hành vi trong lớp" },
        },
      },
    ],
  },
  {
    key: "professional",
    label: { en: "Work & Professional Life", vi: "Công Việc & Đời Sống Nghề Nghiệp" },
    icon: "💼",
    intro: {
      en: "How much has attention or organization gotten in the way of work?",
      vi: "Sự chú ý hoặc khả năng tổ chức đã gây cản trở đến mức nào trong công việc?",
    },
    items: [
      {
        id: "p1", type: "impact",
        text: {
          teen: { en: "If you have a part-time job or volunteer role: missing shifts, deadlines, or instructions", vi: "Nếu bạn có công việc bán thời gian hoặc làm tình nguyện: bỏ lỡ ca làm, thời hạn, hoặc chỉ dẫn" },
          youngAdult: { en: "Missing work deadlines, deliverables, or last-minute scrambling to finish tasks", vi: "Trễ hạn công việc, sản phẩm bàn giao, hoặc phải chạy nước rút vào phút chót để hoàn thành công việc" },
          adult: { en: "Missing work deadlines, deliverables, or last-minute scrambling to finish tasks", vi: "Trễ hạn công việc, sản phẩm bàn giao, hoặc phải chạy nước rút vào phút chót để hoàn thành công việc" },
        },
      },
      {
        id: "p2", type: "impact",
        text: {
          teen: { en: "Losing focus during longer tasks, meetings, or instructions at work", vi: "Mất tập trung trong các công việc dài, cuộc họp, hoặc chỉ dẫn tại nơi làm việc" },
          youngAdult: { en: "Losing focus in meetings or during long or repetitive work tasks", vi: "Mất tập trung trong các cuộc họp hoặc trong công việc dài hoặc lặp đi lặp lại" },
          adult: { en: "Losing focus in meetings or during long or repetitive work tasks", vi: "Mất tập trung trong các cuộc họp hoặc trong công việc dài hoặc lặp đi lặp lại" },
        },
      },
      {
        id: "p3", type: "impact",
        text: {
          teen: { en: "Getting in trouble at a job or volunteer role for forgetfulness or being late", vi: "Bị nhắc nhở tại công việc hoặc vai trò tình nguyện vì hay quên hoặc đi trễ" },
          youngAdult: { en: "Job or role instability — being let go, reprimanded, or repeatedly changing jobs over attention-related issues", vi: "Sự bất ổn trong công việc — bị cho nghỉ việc, bị khiển trách, hoặc đổi việc liên tục vì các vấn đề liên quan đến sự chú ý" },
          adult: { en: "Job or role instability — being let go, reprimanded, or repeatedly changing jobs over attention-related issues", vi: "Sự bất ổn trong công việc — bị cho nghỉ việc, bị khiển trách, hoặc đổi việc liên tục vì các vấn đề liên quan đến sự chú ý" },
        },
      },
      {
        id: "p4", type: "impact",
        text: {
          teen: { en: "Feeling overwhelmed juggling school, activities, and any work/volunteer commitments at once", vi: "Cảm thấy quá tải khi phải cân bằng việc học, hoạt động ngoại khóa, và các cam kết công việc/tình nguyện cùng lúc" },
          youngAdult: { en: "Feeling overwhelmed juggling multiple responsibilities or projects at once", vi: "Cảm thấy quá tải khi phải xử lý nhiều trách nhiệm hoặc dự án cùng lúc" },
          adult: { en: "Feeling overwhelmed juggling multiple responsibilities or projects at once", vi: "Cảm thấy quá tải khi phải xử lý nhiều trách nhiệm hoặc dự án cùng lúc" },
        },
      },
    ],
  },
  {
    key: "living",
    label: { en: "Home & Daily Living Environment", vi: "Nhà Ở & Môi Trường Sống Hằng Ngày" },
    icon: "🏠",
    intro: {
      en: "How much has attention or organization gotten in the way at home or in daily routines?",
      vi: "Sự chú ý hoặc khả năng tổ chức đã gây cản trở đến mức nào ở nhà hoặc trong sinh hoạt hằng ngày?",
    },
    items: [
      { id: "l1", type: "impact", text: { en: "Keeping up with household tasks — bills, chores, appointments, paperwork", vi: "Theo kịp các việc trong nhà — hóa đơn, việc nhà, cuộc hẹn, giấy tờ" } },
      { id: "l2", type: "impact", text: { en: "Friction with family, a partner, or friends over forgetfulness, interrupting, or restlessness", vi: "Xích mích với gia đình, bạn đời, hoặc bạn bè vì hay quên, ngắt lời, hoặc bồn chồn" } },
      { id: "l3", type: "impact", text: { en: "Trouble winding down at night, or an irregular sleep schedule", vi: "Khó thư giãn vào ban đêm, hoặc lịch trình giấc ngủ không đều đặn" } },
      { id: "l4", type: "impact", text: { en: "Distraction-related close calls — driving, cooking, or handling money", vi: "Những tình huống suýt gặp nguy hiểm do mất tập trung — khi lái xe, nấu ăn, hoặc quản lý tiền bạc" } },
    ],
  },
  {
    key: "other",
    label: { en: "Other Factors Worth Knowing About", vi: "Các Yếu Tố Khác Đáng Lưu Ý" },
    icon: "🧩",
    intro: {
      en: "These commonly overlap with ADHD symptoms or can look like them on their own — worth mentioning to whoever evaluates you, not scored as ADHD symptoms.",
      vi: "Những yếu tố này thường trùng lặp với triệu chứng ADHD hoặc có thể tự trông giống ADHD — đáng để đề cập với người đánh giá bạn, nhưng không được tính điểm như triệu chứng ADHD.",
    },
    items: [
      { id: "o1", type: "impact", text: { en: "Feeling anxious or on-edge most days", vi: "Cảm thấy lo lắng hoặc căng thẳng hầu hết các ngày" } },
      { id: "o2", type: "impact", text: { en: "Feeling low, flat, or down most days", vi: "Cảm thấy buồn, chán nản, hoặc suy sụp hầu hết các ngày" } },
      { id: "o3", type: "impact", text: { en: "Using alcohol, cannabis, or other substances to manage restlessness or focus", vi: "Sử dụng rượu, cần sa, hoặc chất kích thích khác để kiểm soát sự bồn chồn hoặc tập trung" } },
      {
        id: "o4", type: "ynu",
        text: { en: "Do you have a diagnosed or suspected medical condition that can affect attention or energy (e.g. thyroid issues, sleep apnea, anemia, a head injury)?", vi: "Bạn có đang mắc hoặc nghi ngờ mắc một tình trạng y tế nào có thể ảnh hưởng đến sự chú ý hoặc năng lượng không (ví dụ: vấn đề tuyến giáp, ngưng thở khi ngủ, thiếu máu, chấn thương đầu)?" },
      },
    ],
  },
];

/* History item — directly mirrors the official ASRS instructions'
   "History" section ("assess the presence of these symptoms or similar
   symptoms in childhood... adults need not have been formally diagnosed").
   Not scored; shown as a single standalone question after the domains. */
const CONTEXT_HISTORY_ITEM = {
  id: "h1",
  type: "ynu",
  text: {
    en: "Thinking back to childhood (roughly before age 12): were several of these same patterns — trouble finishing things, disorganization, restlessness, impulsivity — already noticeable, even if nothing was ever formally diagnosed?",
    vi: "Nhớ lại thời thơ ấu (khoảng trước 12 tuổi): liệu một vài trong số các mẫu hình này — khó hoàn thành công việc, thiếu tổ chức, bồn chồn, bốc đồng — đã từng thấy rõ chưa, kể cả khi chưa từng được chẩn đoán chính thức?",
  },
  note: {
    en: "This matters because ADHD is, by definition, a developmental condition — current diagnostic criteria require that several symptoms were present before age 12, even if they were only recognized later in life.",
    vi: "Điều này quan trọng vì theo định nghĩa, ADHD là một tình trạng phát triển thần kinh — tiêu chuẩn chẩn đoán hiện tại yêu cầu một số triệu chứng đã xuất hiện trước 12 tuổi, kể cả khi chúng chỉ được nhận ra sau này.",
  },
};

function ageVariantText(item, ageGroup) {
  const t = item.text;
  if (t && (t.teen || t.youngAdult || t.adult)) {
    return t[ageGroup] || t.adult || t.youngAdult || t.teen;
  }
  return t;
}
