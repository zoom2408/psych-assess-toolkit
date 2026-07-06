/* =========================================================================
   RIASEC / HOLLAND CODE CAREER INTEREST INVENTORY
   Original items measuring John Holland's six interest themes (public
   domain vocational theory): Realistic, Investigative, Artistic,
   Social, Enterprising, Conventional. Independently authored items.

   Format: Likert 1-5 (Strongly Dislike -> Strongly Like) rating how
   much the user would enjoy each activity.

   Translatable string fields (text, name, nickname, description,
   teens[], youngAdults[], adults[]) are stored as { en, vi } objects
   and resolved with L() at render time.
========================================================================= */

const RIASEC_QUESTIONS = [
  // ---------------- REALISTIC (R) — hands-on, mechanical, outdoors ----------------
  { id: "r01", scale: "R", text: { en: "Building or fixing something with tools and your hands.", vi: "Chế tạo hoặc sửa chữa thứ gì đó bằng dụng cụ và đôi tay của bạn." } },
  { id: "r02", scale: "R", text: { en: "Working outdoors rather than in an office all day.", vi: "Làm việc ngoài trời thay vì cả ngày trong văn phòng." } },
  { id: "r03", scale: "R", text: { en: "Operating or repairing machines, vehicles, or equipment.", vi: "Vận hành hoặc sửa chữa máy móc, phương tiện, hoặc thiết bị." } },
  { id: "r04", scale: "R", text: { en: "Following blueprints or diagrams to construct something physical.", vi: "Làm theo bản vẽ hoặc sơ đồ để xây dựng một vật thể thực tế." } },
  { id: "r05", scale: "R", text: { en: "Working with your hands on a craft, like woodworking or electronics.", vi: "Làm việc thủ công bằng tay, như mộc hoặc điện tử." } },
  { id: "r06", scale: "R", text: { en: "Training animals or working closely with them.", vi: "Huấn luyện động vật hoặc làm việc gần gũi với chúng." } },
  { id: "r07", scale: "R", text: { en: "Playing a sport or doing physical, athletic activity.", vi: "Chơi thể thao hoặc tham gia các hoạt động thể chất, vận động." } },
  { id: "r08", scale: "R", text: { en: "Growing plants, gardening, or working the land.", vi: "Trồng cây, làm vườn, hoặc canh tác đất đai." } },
  { id: "r09", scale: "R", text: { en: "Assembling or troubleshooting mechanical/electrical systems.", vi: "Lắp ráp hoặc xử lý sự cố các hệ thống cơ khí/điện." } },
  { id: "r10", scale: "R", text: { en: "Doing physically active work rather than sitting at a desk.", vi: "Làm công việc vận động thể chất thay vì ngồi bàn giấy." } },

  // ---------------- INVESTIGATIVE (I) — analytical, scientific, curious ----------------
  { id: "iv01", scale: "I", text: { en: "Solving a complex puzzle, math problem, or logical brain-teaser.", vi: "Giải một câu đố phức tạp, bài toán, hoặc thử thách tư duy logic." } },
  { id: "iv02", scale: "I", text: { en: "Conducting a science experiment to test a hypothesis.", vi: "Thực hiện thí nghiệm khoa học để kiểm chứng một giả thuyết." } },
  { id: "iv03", scale: "I", text: { en: "Researching a topic deeply to understand how or why something works.", vi: "Nghiên cứu sâu một chủ đề để hiểu cách hoặc lý do một điều gì đó vận hành." } },
  { id: "iv04", scale: "I", text: { en: "Analyzing data to find patterns or trends.", vi: "Phân tích dữ liệu để tìm ra quy luật hoặc xu hướng." } },
  { id: "iv05", scale: "I", text: { en: "Reading scientific articles or technical material for fun.", vi: "Đọc các bài báo khoa học hoặc tài liệu kỹ thuật vì sở thích." } },
  { id: "iv06", scale: "I", text: { en: "Diagnosing the root cause of a problem before fixing it.", vi: "Chẩn đoán nguyên nhân gốc rễ của một vấn đề trước khi khắc phục." } },
  { id: "iv07", scale: "I", text: { en: "Working independently on an intellectually challenging project.", vi: "Làm việc độc lập trên một dự án đòi hỏi tư duy trí tuệ cao." } },
  { id: "iv08", scale: "I", text: { en: "Debating theories or ideas based on evidence.", vi: "Tranh luận về các lý thuyết hoặc ý tưởng dựa trên bằng chứng." } },
  { id: "iv09", scale: "I", text: { en: "Using statistics or computer models to predict outcomes.", vi: "Sử dụng thống kê hoặc mô hình máy tính để dự đoán kết quả." } },
  { id: "iv10", scale: "I", text: { en: "Exploring a new field of science, medicine, or technology.", vi: "Khám phá một lĩnh vực mới về khoa học, y học, hoặc công nghệ." } },

  // ---------------- ARTISTIC (A) — creative, expressive, original ----------------
  { id: "a01", scale: "A", text: { en: "Creating original artwork, music, writing, or design.", vi: "Sáng tạo tác phẩm nghệ thuật, âm nhạc, văn viết, hoặc thiết kế gốc." } },
  { id: "a02", scale: "A", text: { en: "Performing on stage — acting, dancing, or playing music.", vi: "Biểu diễn trên sân khấu — diễn xuất, nhảy múa, hoặc chơi nhạc." } },
  { id: "a03", scale: "A", text: { en: "Designing something visually — a poster, room, outfit, or product.", vi: "Thiết kế một thứ gì đó về mặt hình ảnh — áp phích, căn phòng, trang phục, hoặc sản phẩm." } },
  { id: "a04", scale: "A", text: { en: "Writing stories, poetry, or scripts.", vi: "Viết truyện, thơ, hoặc kịch bản." } },
  { id: "a05", scale: "A", text: { en: "Improvising or coming up with original ideas without a fixed formula.", vi: "Ứng biến hoặc nghĩ ra những ý tưởng độc đáo mà không theo khuôn mẫu cố định." } },
  { id: "a06", scale: "A", text: { en: "Editing photos, video, or audio creatively.", vi: "Chỉnh sửa ảnh, video, hoặc âm thanh một cách sáng tạo." } },
  { id: "a07", scale: "A", text: { en: "Experimenting with recipes, food styling, or presentation to create something visually unique.", vi: "Thử nghiệm công thức nấu ăn, trang trí món ăn, hoặc trình bày để tạo ra thứ gì đó độc đáo về mặt hình ảnh." } },
  { id: "a08", scale: "A", text: { en: "Working in an unstructured environment that allows creative freedom.", vi: "Làm việc trong môi trường không gò bó, cho phép tự do sáng tạo." } },
  { id: "a09", scale: "A", text: { en: "Coming up with a unique concept for a project or campaign.", vi: "Nghĩ ra một ý tưởng độc đáo cho một dự án hoặc chiến dịch." } },
  { id: "a10", scale: "A", text: { en: "Appreciating and critiquing art, film, or design.", vi: "Thưởng thức và bình luận về nghệ thuật, phim ảnh, hoặc thiết kế." } },

  // ---------------- SOCIAL (S) — helping, teaching, caring ----------------
  { id: "so01", scale: "S", text: { en: "Helping someone work through a personal problem.", vi: "Giúp ai đó vượt qua một vấn đề cá nhân." } },
  { id: "so02", scale: "S", text: { en: "Teaching or explaining a concept to someone else.", vi: "Giảng dạy hoặc giải thích một khái niệm cho người khác." } },
  { id: "so03", scale: "S", text: { en: "Volunteering for a cause you care about.", vi: "Làm tình nguyện cho một lý tưởng mà bạn quan tâm." } },
  { id: "so04", scale: "S", text: { en: "Mentoring or coaching someone to help them improve.", vi: "Cố vấn hoặc huấn luyện ai đó để giúp họ tiến bộ." } },
  { id: "so05", scale: "S", text: { en: "Working in a role focused on caring for people's wellbeing.", vi: "Làm công việc tập trung vào chăm sóc sức khỏe và hạnh phúc của con người." } },
  { id: "so06", scale: "S", text: { en: "Organizing group activities that bring people together.", vi: "Tổ chức các hoạt động nhóm để gắn kết mọi người lại với nhau." } },
  { id: "so07", scale: "S", text: { en: "Listening patiently to understand someone else's perspective.", vi: "Lắng nghe kiên nhẫn để hiểu quan điểm của người khác." } },
  { id: "so08", scale: "S", text: { en: "Supporting a friend or classmate who is struggling.", vi: "Hỗ trợ một người bạn hoặc bạn học đang gặp khó khăn." } },
  { id: "so09", scale: "S", text: { en: "Working as part of a team focused on a shared, people-centered goal.", vi: "Làm việc trong một nhóm hướng đến mục tiêu chung, lấy con người làm trung tâm." } },
  { id: "so10", scale: "S", text: { en: "Advocating for someone or something you believe is being treated unfairly.", vi: "Lên tiếng bênh vực cho ai đó hoặc điều gì đó mà bạn tin là đang bị đối xử bất công." } },

  // ---------------- ENTERPRISING (E) — leading, persuading, business ----------------
  { id: "e01", scale: "E", text: { en: "Convincing others to support an idea, product, or plan.", vi: "Thuyết phục người khác ủng hộ một ý tưởng, sản phẩm, hoặc kế hoạch." } },
  { id: "e02", scale: "E", text: { en: "Starting or running your own project, club, or business.", vi: "Khởi xướng hoặc điều hành dự án, câu lạc bộ, hoặc doanh nghiệp của riêng bạn." } },
  { id: "e03", scale: "E", text: { en: "Leading a team toward a shared goal.", vi: "Dẫn dắt một nhóm hướng đến mục tiêu chung." } },
  { id: "e04", scale: "E", text: { en: "Negotiating a deal or resolving a disagreement to reach an outcome.", vi: "Đàm phán một thỏa thuận hoặc giải quyết bất đồng để đạt được kết quả." } },
  { id: "e05", scale: "E", text: { en: "Pitching an idea to a group or an audience.", vi: "Trình bày, thuyết trình một ý tưởng trước nhóm hoặc khán giả." } },
  { id: "e06", scale: "E", text: { en: "Taking calculated risks for a potentially big reward.", vi: "Chấp nhận rủi ro có tính toán để đạt được phần thưởng lớn tiềm năng." } },
  { id: "e07", scale: "E", text: { en: "Setting ambitious goals and pushing a group to achieve them.", vi: "Đặt ra những mục tiêu tham vọng và thúc đẩy nhóm đạt được chúng." } },
  { id: "e08", scale: "E", text: { en: "Selling a product, service, or idea to other people.", vi: "Bán một sản phẩm, dịch vụ, hoặc ý tưởng cho người khác." } },
  { id: "e09", scale: "E", text: { en: "Competing to win — in business, sports, or debate.", vi: "Thi đấu để giành chiến thắng — trong kinh doanh, thể thao, hoặc tranh biện." } },
  { id: "e10", scale: "E", text: { en: "Managing people, budgets, or a project from start to finish.", vi: "Quản lý con người, ngân sách, hoặc một dự án từ đầu đến cuối." } },

  // ---------------- CONVENTIONAL (C) — organizing, structured, precise ----------------
  { id: "co01", scale: "C", text: { en: "Organizing files, schedules, or data into a clear system.", vi: "Sắp xếp tài liệu, lịch trình, hoặc dữ liệu thành một hệ thống rõ ràng." } },
  { id: "co02", scale: "C", text: { en: "Following a detailed checklist to make sure nothing is missed.", vi: "Làm theo một danh sách kiểm tra chi tiết để đảm bảo không bỏ sót điều gì." } },
  { id: "co03", scale: "C", text: { en: "Managing a budget or tracking expenses accurately.", vi: "Quản lý ngân sách hoặc theo dõi chi tiêu một cách chính xác." } },
  { id: "co04", scale: "C", text: { en: "Entering, checking, or verifying data for accuracy.", vi: "Nhập, kiểm tra, hoặc xác minh dữ liệu để đảm bảo độ chính xác." } },
  { id: "co05", scale: "C", text: { en: "Creating a clear, step-by-step process for a repeated task.", vi: "Tạo ra một quy trình rõ ràng, từng bước cho một công việc lặp lại." } },
  { id: "co06", scale: "C", text: { en: "Keeping detailed records and documentation.", vi: "Lưu giữ hồ sơ và tài liệu chi tiết." } },
  { id: "co07", scale: "C", text: { en: "Working with numbers, spreadsheets, or structured reports.", vi: "Làm việc với con số, bảng tính, hoặc báo cáo có cấu trúc." } },
  { id: "co08", scale: "C", text: { en: "Making sure a project follows the correct procedures and rules.", vi: "Đảm bảo một dự án tuân theo đúng quy trình và quy tắc." } },
  { id: "co09", scale: "C", text: { en: "Proofreading or fact-checking a document for errors.", vi: "Rà soát hoặc kiểm chứng thông tin trong một tài liệu để tìm lỗi." } },
  { id: "co10", scale: "C", text: { en: "Working in a structured role with clear, predictable responsibilities.", vi: "Làm việc trong một vai trò có cấu trúc, với trách nhiệm rõ ràng, dễ dự đoán." } },
];

/* ---------------------------------------------------------------------
   CONCISE-VERSION MARKERS — 3 of 10 items per scale for the "Quick" path
   (~10 minutes total across all three frameworks).
--------------------------------------------------------------------- */
const RIASEC_CORE_IDS = [
  "r01", "r02", "r03",
  "iv01", "iv02", "iv03",
  "a01", "a02", "a03",
  "so01", "so02", "so03",
  "e01", "e02", "e03",
  "co01", "co02", "co03",
];
RIASEC_CORE_IDS.forEach((id) => {
  const q = RIASEC_QUESTIONS.find((x) => x.id === id);
  if (q) q.core = true;
});
const RIASEC_QUESTIONS_CORE = RIASEC_QUESTIONS.filter((q) => q.core);

/* ---------------------------------------------------------------------
   HOLLAND THEME PROFILES — description + age-tiered example paths.
   "teens" = school subjects / early exploration paths
   "youngAdults" = college majors + entry-level roles
   "adults" = established careers / career-change directions
--------------------------------------------------------------------- */
const RIASEC_THEMES = {
  R: {
    name: { en: "Realistic", vi: "Thực Tế (Realistic)" },
    nickname: { en: "The Doer", vi: "Người Hành Động" },
    description: { en: "You like practical, hands-on work with tools, machines, or the outdoors, and you prefer tangible results over abstract theory.", vi: "Bạn thích công việc thực hành, thực tế với dụng cụ, máy móc, hoặc ngoài trời, và ưa thích kết quả cụ thể hơn là lý thuyết trừu tượng." },
    teens: [
      { en: "Shop / industrial arts", vi: "Kỹ thuật xưởng / công nghệ" },
      { en: "Agriculture & FFA programs", vi: "Nông nghiệp & các chương trình nông nghiệp học đường" },
      { en: "Robotics club", vi: "Câu lạc bộ robot" },
      { en: "Auto tech electives", vi: "Môn tự chọn kỹ thuật ô tô" },
      { en: "JROTC / athletics", vi: "Chương trình huấn luyện quân sự / thể thao" },
    ],
    youngAdults: [
      { en: "Mechanical/Civil Engineering", vi: "Kỹ thuật Cơ khí/Xây dựng" },
      { en: "Construction Management", vi: "Quản lý Xây dựng" },
      { en: "Automotive Technology", vi: "Công nghệ Ô tô" },
      { en: "Athletic Training", vi: "Huấn luyện Thể thao" },
      { en: "Environmental/Agricultural Science", vi: "Khoa học Môi trường/Nông nghiệp" },
      { en: "Aviation Maintenance", vi: "Bảo trì Hàng không" },
    ],
    adults: [
      { en: "Electrician / Plumber / HVAC Technician", vi: "Thợ điện / Thợ ống nước / Kỹ thuật viên điều hòa" },
      { en: "Civil or Mechanical Engineer", vi: "Kỹ sư Xây dựng hoặc Cơ khí" },
      { en: "Construction Project Manager", vi: "Quản lý Dự án Xây dựng" },
      { en: "Pilot", vi: "Phi công" },
      { en: "Farm/Ranch Manager", vi: "Quản lý Trang trại" },
      { en: "Paramedic / Firefighter", vi: "Nhân viên Cấp cứu / Lính cứu hỏa" },
    ],
  },
  I: {
    name: { en: "Investigative", vi: "Nghiên Cứu (Investigative)" },
    nickname: { en: "The Thinker", vi: "Người Tư Duy" },
    description: { en: "You're drawn to analysis, research, and solving complex problems — you like understanding how and why things work.", vi: "Bạn bị thu hút bởi việc phân tích, nghiên cứu, và giải quyết các vấn đề phức tạp — bạn thích hiểu cách thức và lý do mọi thứ vận hành." },
    teens: [
      { en: "AP Science / Math courses", vi: "Các môn Khoa học / Toán nâng cao" },
      { en: "Science Olympiad", vi: "Olympic Khoa học" },
      { en: "Coding clubs", vi: "Câu lạc bộ lập trình" },
      { en: "Math competitions", vi: "Các cuộc thi Toán học" },
      { en: "Research electives", vi: "Môn tự chọn nghiên cứu" },
    ],
    youngAdults: [
      { en: "Computer Science", vi: "Khoa học Máy tính" },
      { en: "Biology / Chemistry / Physics", vi: "Sinh học / Hóa học / Vật lý" },
      { en: "Data Science & Statistics", vi: "Khoa học Dữ liệu & Thống kê" },
      { en: "Pre-Med / Pre-Pharmacy", vi: "Dự bị Y khoa / Dự bị Dược" },
      { en: "Economics", vi: "Kinh tế học" },
      { en: "Engineering (Research track)", vi: "Kỹ thuật (hướng Nghiên cứu)" },
    ],
    adults: [
      { en: "Data Scientist / Analyst", vi: "Nhà khoa học Dữ liệu / Chuyên viên Phân tích" },
      { en: "Physician / Researcher", vi: "Bác sĩ / Nhà nghiên cứu" },
      { en: "Software Engineer", vi: "Kỹ sư Phần mềm" },
      { en: "Actuary", vi: "Chuyên viên Tính toán Bảo hiểm" },
      { en: "Lab Scientist", vi: "Nhà khoa học Phòng thí nghiệm" },
      { en: "Financial Analyst", vi: "Chuyên viên Phân tích Tài chính" },
    ],
  },
  A: {
    name: { en: "Artistic", vi: "Nghệ Thuật (Artistic)" },
    nickname: { en: "The Creator", vi: "Người Sáng Tạo" },
    description: { en: "You value self-expression, originality, and creative freedom — you're energized by making something new.", vi: "Bạn coi trọng việc thể hiện bản thân, sự độc đáo, và tự do sáng tạo — bạn tràn đầy năng lượng khi tạo ra điều gì đó mới mẻ." },
    teens: [
      { en: "Art, band, theater, or creative writing electives", vi: "Môn tự chọn Mỹ thuật, ban nhạc, kịch nghệ, hoặc viết sáng tạo" },
      { en: "Yearbook / school newspaper", vi: "Kỷ yếu / báo trường" },
      { en: "Film or photography club", vi: "Câu lạc bộ điện ảnh hoặc nhiếp ảnh" },
    ],
    youngAdults: [
      { en: "Graphic/Industrial Design", vi: "Thiết kế Đồ họa/Công nghiệp" },
      { en: "Film & Media Production", vi: "Sản xuất Phim & Truyền thông" },
      { en: "Creative Writing / Journalism", vi: "Viết Sáng tạo / Báo chí" },
      { en: "Music Performance", vi: "Biểu diễn Âm nhạc" },
      { en: "Architecture", vi: "Kiến trúc" },
      { en: "Fine Arts / Fashion Design", vi: "Mỹ thuật / Thiết kế Thời trang" },
    ],
    adults: [
      { en: "UX/UI or Graphic Designer", vi: "Nhà thiết kế UX/UI hoặc Đồ họa" },
      { en: "Writer / Content Creator", vi: "Nhà văn / Người sáng tạo Nội dung" },
      { en: "Architect", vi: "Kiến trúc sư" },
      { en: "Musician / Performer", vi: "Nhạc sĩ / Nghệ sĩ Biểu diễn" },
      { en: "Art Director", vi: "Giám đốc Mỹ thuật" },
      { en: "Film/Video Producer", vi: "Nhà sản xuất Phim/Video" },
    ],
  },
  S: {
    name: { en: "Social", vi: "Xã Hội (Social)" },
    nickname: { en: "The Helper", vi: "Người Trợ Giúp" },
    description: { en: "You're motivated by helping, teaching, and connecting with people, and you feel fulfilled when supporting others' growth.", vi: "Bạn được thúc đẩy bởi việc giúp đỡ, giảng dạy, và kết nối với con người, và cảm thấy mãn nguyện khi hỗ trợ sự phát triển của người khác." },
    teens: [
      { en: "Peer tutoring / mentoring programs", vi: "Chương trình gia sư / cố vấn bạn đồng trang lứa" },
      { en: "Student council", vi: "Hội đồng học sinh" },
      { en: "Volunteer work", vi: "Công tác tình nguyện" },
      { en: "Psychology electives", vi: "Môn tự chọn Tâm lý học" },
    ],
    youngAdults: [
      { en: "Psychology / Social Work", vi: "Tâm lý học / Công tác Xã hội" },
      { en: "Education / Teaching", vi: "Giáo dục / Sư phạm" },
      { en: "Nursing / Healthcare", vi: "Điều dưỡng / Y tế" },
      { en: "Human Resources", vi: "Quản trị Nhân sự" },
      { en: "Counseling", vi: "Tư vấn Tâm lý" },
    ],
    adults: [
      { en: "Teacher / Professor", vi: "Giáo viên / Giảng viên" },
      { en: "Counselor / Therapist", vi: "Chuyên viên Tư vấn / Trị liệu" },
      { en: "Nurse / Healthcare Provider", vi: "Y tá / Nhân viên Y tế" },
      { en: "HR Manager", vi: "Trưởng phòng Nhân sự" },
      { en: "Social Worker", vi: "Nhân viên Công tác Xã hội" },
      { en: "Nonprofit Program Director", vi: "Giám đốc Chương trình Phi lợi nhuận" },
    ],
  },
  E: {
    name: { en: "Enterprising", vi: "Doanh Nhân (Enterprising)" },
    nickname: { en: "The Persuader", vi: "Người Thuyết Phục" },
    description: { en: "You're drawn to leading, persuading, and taking initiative — you like influencing outcomes and pursuing ambitious goals.", vi: "Bạn bị thu hút bởi việc lãnh đạo, thuyết phục, và chủ động — bạn thích tác động đến kết quả và theo đuổi những mục tiêu tham vọng." },
    teens: [
      { en: "DECA / student business clubs", vi: "DECA / câu lạc bộ kinh doanh học sinh" },
      { en: "Debate team", vi: "Đội tranh biện" },
      { en: "Student government", vi: "Chính quyền học sinh" },
      { en: "Part-time sales/retail jobs", vi: "Công việc bán thời gian trong bán hàng/bán lẻ" },
    ],
    youngAdults: [
      { en: "Business Administration", vi: "Quản trị Kinh doanh" },
      { en: "Marketing", vi: "Marketing" },
      { en: "Political Science", vi: "Khoa học Chính trị" },
      { en: "Entrepreneurship", vi: "Khởi nghiệp" },
      { en: "Communications / PR", vi: "Truyền thông / Quan hệ Công chúng" },
    ],
    adults: [
      { en: "Sales / Business Development Manager", vi: "Trưởng phòng Kinh doanh / Phát triển Kinh doanh" },
      { en: "Entrepreneur / Founder", vi: "Doanh nhân / Người sáng lập" },
      { en: "Marketing Manager", vi: "Trưởng phòng Marketing" },
      { en: "Attorney", vi: "Luật sư" },
      { en: "Real Estate Agent", vi: "Môi giới Bất động sản" },
      { en: "Executive / Operations Manager", vi: "Giám đốc Điều hành / Vận hành" },
    ],
  },
  C: {
    name: { en: "Conventional", vi: "Quy Chuẩn (Conventional)" },
    nickname: { en: "The Organizer", vi: "Người Tổ Chức" },
    description: { en: "You value structure, precision, and clear systems — you're energized by organizing information and keeping things accurate and on track.", vi: "Bạn coi trọng cấu trúc, sự chính xác, và các hệ thống rõ ràng — bạn tràn đầy năng lượng khi sắp xếp thông tin và giữ mọi thứ chính xác, đúng tiến độ." },
    teens: [
      { en: "Business/accounting electives", vi: "Môn tự chọn Kinh doanh/Kế toán" },
      { en: "Yearbook layout/logistics", vi: "Dàn trang / hậu cần kỷ yếu" },
      { en: "Club treasurer roles", vi: "Vai trò thủ quỹ câu lạc bộ" },
      { en: "Excel/data clubs", vi: "Câu lạc bộ Excel/dữ liệu" },
    ],
    youngAdults: [
      { en: "Accounting / Finance", vi: "Kế toán / Tài chính" },
      { en: "Business Analytics", vi: "Phân tích Kinh doanh" },
      { en: "Information Systems", vi: "Hệ thống Thông tin" },
      { en: "Supply Chain Management", vi: "Quản lý Chuỗi cung ứng" },
      { en: "Legal Studies (paralegal track)", vi: "Nghiên cứu Pháp lý (hướng trợ lý luật sư)" },
    ],
    adults: [
      { en: "Accountant / Auditor", vi: "Kế toán viên / Kiểm toán viên" },
      { en: "Financial Planner", vi: "Chuyên viên Hoạch định Tài chính" },
      { en: "Operations/Logistics Coordinator", vi: "Điều phối viên Vận hành/Hậu cần" },
      { en: "Paralegal", vi: "Trợ lý Luật sư" },
      { en: "Data/Business Analyst", vi: "Chuyên viên Phân tích Dữ liệu/Kinh doanh" },
      { en: "Office/Practice Manager", vi: "Quản lý Văn phòng/Cơ sở" },
    ],
  },
};

if (typeof module !== "undefined") module.exports = { RIASEC_QUESTIONS, RIASEC_QUESTIONS_CORE, RIASEC_THEMES };
