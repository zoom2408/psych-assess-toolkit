/* =========================================================================
   DEMAND–CONTROL–SUPPORT SECTION (Karasek & Theorell's JDCS model)
   Where does your stress come from, structurally? The model maps your
   main daily role (job, studies, or home/caregiving) on three dimensions:
   - DE: Demands  (workload, time pressure, conflicting expectations)
   - CO: Control  (autonomy, decision latitude, skill use)
   - SU: Support  (help and understanding from the people around the role)

   High demands are not automatically harmful — the toxic combination is
   HIGH demands + LOW control ("high strain"), and it's worse still with
   low support ("iso-strain"). Items say "main daily role" so the same
   bank works whether your context is work, study, or home life.

   Item shape: { id, scale: "DE"|"CO"|"SU", text: {en, vi} }
   Balance rule: equal item counts per scale (full: 8 each, quick: 3 each).
   Bilingual fields resolved at render time via L() from lang.js.
========================================================================= */

const DCS_QUESTIONS = [
  // --- DE: Demands (8) ---
  { id: "de01", scale: "DE", text: { en: "In my main daily role, I have more to do than I can comfortably finish.", vi: "Trong vai trò hằng ngày chính của mình, tôi có nhiều việc phải làm hơn khả năng hoàn thành một cách thoải mái." } },
  { id: "de02", scale: "DE", text: { en: "I regularly work (or study, or care for others) under intense time pressure.", vi: "Tôi thường xuyên làm việc (hoặc học tập, hoặc chăm sóc người khác) dưới áp lực thời gian gay gắt." } },
  { id: "de03", scale: "DE", text: { en: "Different people expect conflicting things from me in my main role.", vi: "Nhiều người kỳ vọng những điều mâu thuẫn nhau từ tôi trong vai trò chính của mình." } },
  { id: "de04", scale: "DE", text: { en: "My daily responsibilities demand long stretches of intense concentration.", vi: "Trách nhiệm hằng ngày của tôi đòi hỏi những khoảng thời gian dài tập trung cao độ." } },
  { id: "de05", scale: "DE", text: { en: "My workload arrives unpredictably, making it hard to plan my days.", vi: "Khối lượng công việc của tôi đến một cách khó đoán, khiến việc lên kế hoạch mỗi ngày trở nên khó khăn." } },
  { id: "de06", scale: "DE", text: { en: "I often have to sacrifice breaks, meals, or sleep to keep up with my responsibilities.", vi: "Tôi thường phải hy sinh giờ nghỉ, bữa ăn, hoặc giấc ngủ để theo kịp trách nhiệm của mình." } },
  { id: "de07", scale: "DE", text: { en: "The pace of my main daily role has been increasing over time.", vi: "Nhịp độ của vai trò hằng ngày chính của tôi đã tăng dần theo thời gian." } },
  { id: "de08", scale: "DE", text: { en: "Even when I'm off duty, unfinished demands from my main role occupy my mind.", vi: "Ngay cả khi không làm việc, những đòi hỏi chưa hoàn thành từ vai trò chính vẫn chiếm lấy tâm trí tôi." } },
  // --- CO: Control (8) ---
  { id: "co01", scale: "CO", text: { en: "I have a real say in how I organize and carry out my daily responsibilities.", vi: "Tôi có tiếng nói thực sự trong việc tổ chức và thực hiện trách nhiệm hằng ngày của mình." } },
  { id: "co02", scale: "CO", text: { en: "I can usually decide the order in which I do my tasks.", vi: "Tôi thường có thể tự quyết định thứ tự thực hiện các công việc của mình." } },
  { id: "co03", scale: "CO", text: { en: "My main daily role lets me use my skills and judgment, not just follow instructions.", vi: "Vai trò hằng ngày chính của tôi cho phép tôi sử dụng kỹ năng và phán đoán của mình, chứ không chỉ làm theo chỉ dẫn." } },
  { id: "co04", scale: "CO", text: { en: "I can influence decisions that affect my daily work or responsibilities.", vi: "Tôi có thể ảnh hưởng đến các quyết định tác động đến công việc hoặc trách nhiệm hằng ngày của mình." } },
  { id: "co05", scale: "CO", text: { en: "When something isn't working in my routine, I'm able to change it.", vi: "Khi điều gì đó không hiệu quả trong thói quen của mình, tôi có thể thay đổi nó." } },
  { id: "co06", scale: "CO", text: { en: "I have enough flexibility to handle personal matters when they come up.", vi: "Tôi có đủ sự linh hoạt để xử lý các việc cá nhân khi chúng phát sinh." } },
  { id: "co07", scale: "CO", text: { en: "I get chances to learn and develop within my main daily role.", vi: "Tôi có cơ hội học hỏi và phát triển trong vai trò hằng ngày chính của mình." } },
  { id: "co08", scale: "CO", text: { en: "How well things go in my main role depends substantially on choices I make.", vi: "Mọi việc diễn ra tốt đẹp trong vai trò chính của tôi phần lớn phụ thuộc vào những lựa chọn tôi đưa ra." } },
  // --- SU: Support (8) ---
  { id: "su01", scale: "SU", text: { en: "There are people around my main daily role I can rely on when things get difficult.", vi: "Có những người xung quanh vai trò hằng ngày chính của tôi mà tôi có thể dựa vào khi mọi thứ trở nên khó khăn." } },
  { id: "su02", scale: "SU", text: { en: "Someone in a position to help me (a manager, teacher, or family member) genuinely looks out for me.", vi: "Một người ở vị trí có thể giúp tôi (quản lý, giáo viên, hoặc người thân) thực sự quan tâm chăm lo cho tôi." } },
  { id: "su03", scale: "SU", text: { en: "The people around me notice and acknowledge the effort I put in.", vi: "Những người xung quanh nhận thấy và ghi nhận nỗ lực mà tôi bỏ ra." } },
  { id: "su04", scale: "SU", text: { en: "I can be honest about struggling without it being held against me.", vi: "Tôi có thể thành thật về việc mình đang gặp khó khăn mà không sợ bị đánh giá vì điều đó." } },
  { id: "su05", scale: "SU", text: { en: "When my load gets too heavy, someone will actually share it if I ask.", vi: "Khi gánh nặng của tôi quá lớn, sẽ có người thực sự chia sẻ nếu tôi nhờ giúp đỡ." } },
  { id: "su06", scale: "SU", text: { en: "I feel a sense of belonging with the people connected to my daily role.", vi: "Tôi cảm thấy mình thuộc về với những người liên quan đến vai trò hằng ngày của mình." } },
  { id: "su07", scale: "SU", text: { en: "I get useful guidance or feedback when I face something I haven't handled before.", vi: "Tôi nhận được hướng dẫn hoặc phản hồi hữu ích khi đối mặt với điều mình chưa từng xử lý trước đây." } },
  { id: "su08", scale: "SU", text: { en: "Outside my main role, I have people who reliably support me emotionally.", vi: "Ngoài vai trò chính của mình, tôi có những người luôn hỗ trợ tôi về mặt cảm xúc." } },
];

/* Quadrant profiles: demands × control, with support as a modifier.
   Advice arrays are tiered by life context (work / study / life). */
const DCS_QUADRANTS = {
  highStrain: {
    key: "highStrain",
    name: { en: "High-Strain", vi: "Áp Lực Cao" },
    formula: { en: "High Demands + Low Control", vi: "Đòi Hỏi Cao + Kiểm Soát Thấp" },
    summary: {
      en: "Your role asks a lot of you while giving you little say over how, when, or how much. In the research this is the most health-relevant pattern — sustained high-strain roles predict burnout, sleep problems, and cardiovascular risk more strongly than heavy workload alone.",
      vi: "Vai trò của bạn đòi hỏi rất nhiều nhưng lại cho bạn rất ít tiếng nói về cách thức, thời điểm, hay mức độ. Trong nghiên cứu, đây là mô hình liên quan mạnh nhất đến sức khỏe — các vai trò áp lực cao kéo dài dự báo kiệt sức, vấn đề giấc ngủ, và nguy cơ tim mạch mạnh hơn so với chỉ riêng khối lượng công việc nặng.",
    },
    riskNote: {
      en: "The lever that matters most here is CONTROL, not just reducing workload. Even small increases in decision latitude measurably reduce strain at the same workload.",
      vi: "Đòn bẩy quan trọng nhất ở đây là QUYỀN KIỂM SOÁT, chứ không chỉ giảm khối lượng công việc. Ngay cả những gia tăng nhỏ về quyền tự quyết cũng có thể giảm áp lực một cách rõ rệt dù khối lượng công việc không đổi.",
    },
    advice: {
      work: {
        en: [
          "Negotiate for control before negotiating for less work: propose owning the 'how' and 'when' of one recurring deliverable end-to-end.",
          "Make invisible workload visible — a simple shared list of what's on your plate forces prioritization conversations that managers otherwise never have.",
          "Batch interruptions: two or three fixed times a day for messages/email returns a surprising amount of felt control.",
        ],
        vi: [
          "Đàm phán để có quyền kiểm soát trước khi đàm phán để giảm việc: đề xuất tự chủ toàn bộ 'cách làm' và 'thời điểm làm' cho một hạng mục công việc lặp lại.",
          "Làm rõ khối lượng công việc vô hình — một danh sách đơn giản chia sẻ những gì bạn đang đảm nhận sẽ buộc phải có cuộc trò chuyện về ưu tiên mà quản lý thường không bao giờ chủ động thực hiện.",
          "Gộp nhóm các gián đoạn: cố định hai hoặc ba khung giờ mỗi ngày để trả lời tin nhắn/email mang lại cảm giác kiểm soát đáng ngạc nhiên.",
        ],
      },
      study: {
        en: [
          "Reclaim control over scheduling even when the syllabus is fixed: decide when and where you study, in what order, and in what chunks.",
          "Talk to instructors early about crunch points — extensions and clarified priorities are far easier to get before a deadline than after.",
          "Drop or defer one optional commitment this term; in a high-strain phase, subtraction beats optimization.",
        ],
        vi: [
          "Giành lại quyền kiểm soát lịch trình ngay cả khi giáo trình đã cố định: tự quyết định khi nào, ở đâu, theo thứ tự nào, và theo từng phần nào bạn học.",
          "Trao đổi sớm với giảng viên về những giai đoạn cao điểm — việc xin gia hạn hay làm rõ ưu tiên dễ dàng hơn nhiều nếu thực hiện trước hạn chót thay vì sau đó.",
          "Bỏ hoặc hoãn một cam kết không bắt buộc trong học kỳ này; trong giai đoạn áp lực cao, việc bớt đi hiệu quả hơn là tối ưu hóa.",
        ],
      },
      life: {
        en: [
          "List your caregiving/household demands and mark which are truly fixed vs. habit — then renegotiate or rotate at least one 'habit' demand.",
          "Introduce predictability where you can't reduce load: fixed routines lower the strain of the same demands.",
          "Formal help (respite care, delivery services, paid or community support) is a control lever, not a failure — price out one option this week.",
        ],
        vi: [
          "Liệt kê các đòi hỏi về chăm sóc/gia đình và đánh dấu điều nào thực sự cố định so với điều nào chỉ là thói quen — sau đó đàm phán lại hoặc luân phiên ít nhất một đòi hỏi 'thói quen'.",
          "Tạo sự dự đoán được ở nơi bạn không thể giảm tải: những thói quen cố định làm giảm áp lực của cùng một khối lượng đòi hỏi.",
          "Sự hỗ trợ chính thức (dịch vụ chăm sóc thay thế, dịch vụ giao hàng, hỗ trợ trả phí hoặc cộng đồng) là một đòn bẩy kiểm soát, không phải là sự thất bại — hãy tìm hiểu giá của một lựa chọn trong tuần này.",
        ],
      },
    },
  },
  active: {
    key: "active",
    name: { en: "Active", vi: "Chủ Động" },
    formula: { en: "High Demands + High Control", vi: "Đòi Hỏi Cao + Kiểm Soát Cao" },
    summary: {
      en: "Your role is demanding, but you have real say over how you meet those demands. The model calls this the 'active' quadrant — typically the most engaging and growth-producing pattern, where high effort tends to produce learning rather than damage.",
      vi: "Vai trò của bạn đòi hỏi nhiều, nhưng bạn có tiếng nói thực sự trong cách đáp ứng những đòi hỏi đó. Mô hình gọi đây là góc phần tư 'chủ động' — thường là mô hình cuốn hút và mang lại sự phát triển nhất, nơi nỗ lực cao có xu hướng tạo ra sự học hỏi thay vì tổn hại.",
    },
    riskNote: {
      en: "The active quadrant's failure mode is self-inflicted overload: because the work is engaging and you control it, you keep adding more. Recovery discipline is your main protection.",
      vi: "Rủi ro chính của góc phần tư chủ động là quá tải tự gây ra: vì công việc cuốn hút và bạn kiểm soát được nó, bạn liên tục thêm việc vào. Kỷ luật phục hồi là biện pháp bảo vệ chính của bạn.",
    },
    advice: {
      work: {
        en: [
          "Your risk is boundary erosion, not the work itself — set a hard stop time for most days and treat it as an appointment.",
          "Use your autonomy deliberately: schedule your hardest work in your best hours, and protect at least one meeting-free block.",
          "Channel the growth: negotiate for stretch work you want, since this quadrant is where skills compound fastest.",
        ],
        vi: [
          "Rủi ro của bạn là ranh giới bị xói mòn, không phải bản thân công việc — đặt một giờ dừng cứng cho hầu hết các ngày và xem đó như một cuộc hẹn.",
          "Sử dụng quyền tự chủ của bạn một cách có chủ đích: sắp xếp công việc khó nhất vào giờ tốt nhất, và bảo vệ ít nhất một khung giờ không họp.",
          "Định hướng sự phát triển: đàm phán để nhận những công việc thử thách bạn mong muốn, vì đây là góc phần tư mà kỹ năng phát triển nhanh nhất.",
        ],
      },
      study: {
        en: [
          "You likely take on too much because you can — audit your commitments each term and cut the lowest-value one.",
          "Build recovery into your system, not around it: plan rest after intense study blocks the way athletes plan rest after training.",
          "Use your control to work ahead of deadlines; the active pattern turns toxic mainly when everything lands at once.",
        ],
        vi: [
          "Bạn có thể đang nhận quá nhiều việc chỉ vì bạn có thể làm được — hãy rà soát các cam kết mỗi học kỳ và cắt bỏ điều ít giá trị nhất.",
          "Đưa sự phục hồi vào hệ thống của bạn, không phải quanh nó: lên kế hoạch nghỉ ngơi sau các đợt học tập căng thẳng giống như vận động viên lên kế hoạch nghỉ sau khi tập luyện.",
          "Dùng quyền kiểm soát của bạn để làm việc trước thời hạn; mô hình chủ động chỉ trở nên độc hại khi mọi thứ dồn đến cùng lúc.",
        ],
      },
      life: {
        en: [
          "You're running a demanding life you've largely designed — check every few months that it's still your design, not accumulated obligations.",
          "Protect one genuinely demand-free ritual per week (no logistics, no serving anyone) as non-negotiable recovery.",
          "Delegate outcomes, not just tasks — hand over full ownership of one household domain rather than supervising everything.",
        ],
        vi: [
          "Bạn đang vận hành một cuộc sống bận rộn mà phần lớn do chính bạn thiết kế — hãy kiểm tra vài tháng một lần xem đó có còn là thiết kế của bạn, hay đã trở thành các nghĩa vụ tích tụ.",
          "Bảo vệ một nghi thức thực sự không có đòi hỏi mỗi tuần (không hậu cần, không phục vụ ai) như một sự phục hồi không thể thương lượng.",
          "Giao phó kết quả, không chỉ nhiệm vụ — trao toàn quyền sở hữu một lĩnh vực trong gia đình thay vì giám sát mọi thứ.",
        ],
      },
    },
  },
  passive: {
    key: "passive",
    name: { en: "Passive", vi: "Thụ Động" },
    formula: { en: "Low Demands + Low Control", vi: "Đòi Hỏi Thấp + Kiểm Soát Thấp" },
    summary: {
      en: "Your role currently asks little of you and gives you little say. This can feel restful briefly, but over time the passive quadrant is linked with disengagement, skill erosion, and a flat, draining kind of stress — under-stimulation is a real stressor too.",
      vi: "Vai trò của bạn hiện đòi hỏi rất ít và cho bạn rất ít tiếng nói. Điều này có thể mang lại cảm giác nghỉ ngơi trong chốc lát, nhưng theo thời gian, góc phần tư thụ động liên quan đến sự mất kết nối, xói mòn kỹ năng, và một dạng căng thẳng đơn điệu, hao mòn — thiếu kích thích cũng là một tác nhân gây căng thẳng thật sự.",
    },
    riskNote: {
      en: "The risk here isn't overload — it's atrophy and low mood. The lever is adding meaningful challenge and carving out spheres of control, even small ones.",
      vi: "Rủi ro ở đây không phải là quá tải — mà là sự thoái hóa và tâm trạng chán nản. Đòn bẩy là thêm vào những thử thách có ý nghĩa và tạo ra những phạm vi kiểm soát, dù nhỏ.",
    },
    advice: {
      work: {
        en: [
          "Volunteer for one project slightly beyond your current role — demand you choose is energizing in a way assigned demand isn't.",
          "Ask directly for more decision latitude over something concrete you already do.",
          "If the role can't grow, grow beside it: a certification or skill project restores challenge and improves your options.",
        ],
        vi: [
          "Xung phong tham gia một dự án hơi vượt ngoài vai trò hiện tại — đòi hỏi mà bạn tự chọn sẽ tiếp thêm năng lượng theo cách mà đòi hỏi được giao không thể làm được.",
          "Yêu cầu trực tiếp có thêm quyền quyết định đối với một việc cụ thể mà bạn đang làm.",
          "Nếu vai trò không thể phát triển, hãy phát triển song song: một chứng chỉ hoặc dự án kỹ năng sẽ khôi phục thử thách và cải thiện các lựa chọn của bạn.",
        ],
      },
      study: {
        en: [
          "Under-challenge kills momentum — add one elective, project, or competition that genuinely interests you.",
          "Create your own control: set personal standards and deadlines above the minimum the program asks.",
          "Connect coursework to a real goal (a portfolio piece, a side project) so effort has a visible payoff.",
        ],
        vi: [
          "Thiếu thử thách sẽ giết chết đà tiến — hãy thêm một môn tự chọn, dự án, hoặc cuộc thi mà bạn thực sự quan tâm.",
          "Tự tạo quyền kiểm soát của riêng bạn: đặt tiêu chuẩn và thời hạn cá nhân cao hơn mức tối thiểu chương trình yêu cầu.",
          "Kết nối việc học với một mục tiêu thực tế (một sản phẩm cho hồ sơ năng lực, một dự án phụ) để nỗ lực có kết quả rõ ràng.",
        ],
      },
      life: {
        en: [
          "Add one chosen challenge with visible progress — physical, creative, or learning-based; progress you can see is the antidote to flatness.",
          "Take full ownership of one domain you care about and run it your way.",
          "Structure creates engagement: a weekly rhythm of commitments (even social ones) beats an open, shapeless week.",
        ],
        vi: [
          "Thêm một thử thách tự chọn có tiến độ rõ ràng — về thể chất, sáng tạo, hoặc học tập; tiến độ nhìn thấy được là liều thuốc cho sự đơn điệu.",
          "Nhận toàn quyền sở hữu một lĩnh vực bạn quan tâm và điều hành nó theo cách của mình.",
          "Cấu trúc tạo ra sự gắn kết: một nhịp điệu cam kết hằng tuần (kể cả các hoạt động xã hội) tốt hơn một tuần mở, không có hình dạng rõ ràng.",
        ],
      },
    },
  },
  lowStrain: {
    key: "lowStrain",
    name: { en: "Low-Strain", vi: "Áp Lực Thấp" },
    formula: { en: "Low Demands + High Control", vi: "Đòi Hỏi Thấp + Kiểm Soát Cao" },
    summary: {
      en: "Your role gives you plenty of say while asking a comfortable amount of you. This is the lowest-stress quadrant in the model — a genuinely protective position, and often a recovery phase after a demanding season.",
      vi: "Vai trò của bạn cho bạn nhiều tiếng nói trong khi chỉ đòi hỏi một mức độ thoải mái. Đây là góc phần tư ít căng thẳng nhất trong mô hình — một vị thế thực sự có tính bảo vệ, và thường là giai đoạn phục hồi sau một mùa nhiều đòi hỏi.",
    },
    riskNote: {
      en: "Little acute risk. Watch only for slow drift into under-challenge, and use the spare capacity intentionally rather than letting it evaporate.",
      vi: "Rủi ro cấp tính rất ít. Chỉ cần lưu ý sự trôi dạt chậm rãi vào tình trạng thiếu thử thách, và sử dụng năng lực dư thừa một cách có chủ đích thay vì để nó tan biến.",
    },
    advice: {
      work: {
        en: [
          "Invest the slack deliberately: mentoring, learning, or building something reusable — capacity spent on compounding assets pays off when demands return.",
          "Bank goodwill and systems now (documentation, templates, relationships) that will protect you in a future high-demand phase.",
          "Check in with yourself quarterly: is this restful, or has it quietly become boring? The answer decides whether to maintain or stretch.",
        ],
        vi: [
          "Đầu tư khoảng dư một cách có chủ đích: cố vấn, học hỏi, hoặc xây dựng thứ gì đó có thể tái sử dụng — năng lực dành cho những tài sản tích lũy sẽ đem lại lợi ích khi đòi hỏi quay trở lại.",
          "Tích lũy thiện chí và hệ thống ngay bây giờ (tài liệu, mẫu biểu, các mối quan hệ) sẽ bảo vệ bạn trong giai đoạn đòi hỏi cao trong tương lai.",
          "Tự kiểm tra bản thân mỗi quý: đây có còn là sự nghỉ ngơi, hay đã âm thầm trở thành sự nhàm chán? Câu trả lời sẽ quyết định nên duy trì hay mở rộng.",
        ],
      },
      study: {
        en: [
          "Use the headroom for depth: go beyond the syllabus in the one subject you actually care about.",
          "Front-load future crunch periods — work ahead while the pressure is low.",
          "Add breadth cheaply: clubs, projects, or part-time experience integrate easily when demands are manageable.",
        ],
        vi: [
          "Tận dụng khoảng trống để đào sâu: vượt ra ngoài giáo trình ở môn học bạn thực sự quan tâm.",
          "Chuẩn bị trước cho các giai đoạn cao điểm trong tương lai — làm việc trước trong khi áp lực còn thấp.",
          "Mở rộng phạm vi với chi phí thấp: câu lạc bộ, dự án, hoặc kinh nghiệm bán thời gian dễ dàng lồng ghép khi đòi hỏi vẫn trong tầm kiểm soát.",
        ],
      },
      life: {
        en: [
          "Enjoy it on purpose — schedule the trips, projects, and time with people that high-demand seasons crowd out.",
          "Build the health habits now (sleep schedule, exercise, routines) that will hold up when life gets demanding again.",
          "Stay lightly stretched: one meaningful ongoing commitment keeps the low-demand season restorative rather than stagnant.",
        ],
        vi: [
          "Tận hưởng nó một cách có chủ đích — lên lịch cho các chuyến đi, dự án, và thời gian bên người thân mà những mùa đòi hỏi cao thường lấn át.",
          "Xây dựng thói quen sức khỏe ngay bây giờ (lịch ngủ, tập thể dục, các thói quen) để duy trì vững vàng khi cuộc sống trở nên đòi hỏi hơn.",
          "Duy trì một chút thử thách: một cam kết đang diễn ra có ý nghĩa giữ cho giai đoạn ít đòi hỏi mang tính phục hồi thay vì trì trệ.",
        ],
      },
    },
  },
};

/* Support modifier notes (applied on top of the quadrant). */
const DCS_SUPPORT_NOTES = {
  high: {
    name: { en: "Well-Supported", vi: "Được Hỗ Trợ Tốt" },
    text: {
      en: "Your support score is solid — you have people who notice, help, and back you up. Support is the strongest buffer in this model: the same demands are measurably less harmful when you don't carry them alone. Keep those relationships actively maintained; they're doing real work for your health.",
      vi: "Điểm hỗ trợ của bạn vững vàng — bạn có những người nhận thấy, giúp đỡ, và ủng hộ bạn. Hỗ trợ là vùng đệm mạnh nhất trong mô hình này: cùng một mức đòi hỏi sẽ ít gây hại hơn rõ rệt khi bạn không phải gánh vác một mình. Hãy tiếp tục chủ động duy trì những mối quan hệ đó; chúng đang thực sự có tác dụng đối với sức khỏe của bạn.",
    },
  },
  low: {
    name: { en: "Low Support (Iso-Strain Risk)", vi: "Hỗ Trợ Thấp (Nguy Cơ Cô Lập Căng Thẳng)" },
    text: {
      en: "Your support score is low — you may be carrying your demands largely alone. The model calls the combination of strain and isolation 'iso-strain', and it's the highest-risk pattern of all. Building support is therefore not a soft extra; it's the single highest-leverage change available to you. Start small and specific: one person, told one concrete thing they could do.",
      vi: "Điểm hỗ trợ của bạn thấp — bạn có thể đang gánh vác phần lớn các đòi hỏi của mình một mình. Mô hình gọi sự kết hợp giữa áp lực và sự cô lập là 'cô lập căng thẳng', và đây là mô hình rủi ro cao nhất trong tất cả. Vì vậy, việc xây dựng hỗ trợ không phải là một điều 'nice to have'; đó là thay đổi có tác động lớn nhất mà bạn có thể thực hiện. Hãy bắt đầu nhỏ và cụ thể: một người, được nói về một điều cụ thể họ có thể làm.",
    },
  },
};

/* ---- Quick-version subset (3 per scale, balanced) ---- */
const DCS_CORE_IDS = ["de01", "de02", "de08", "co01", "co03", "co05", "su01", "su04", "su05"];
DCS_QUESTIONS.forEach((q) => { q.core = DCS_CORE_IDS.includes(q.id); });
const DCS_QUESTIONS_CORE = DCS_QUESTIONS.filter((q) => q.core);
