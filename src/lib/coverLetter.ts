/**
 * Matching Cover Letter System (src/lib/coverLetter.ts)
 * Data structures, templates, presets and sync utilities for Cover Letter Studio.
 */

export interface CoverLetterData {
  recipientName: string;
  recipientRole: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  date: string;
  salutation: string;
  opening: string;
  body1: string;
  body2: string;
  closing: string;
  signOff: string;
  senderName: string;
  senderRole: string;
  senderEmail: string;
  senderPhone: string;
  senderLocation: string;
  senderWebsite: string;
}

export interface CoverLetterPreset {
  id: string;
  titleVi: string;
  titleEn: string;
  roleVi: string;
  roleEn: string;
  badge: string;
  dataVi: Partial<CoverLetterData>;
  dataEn: Partial<CoverLetterData>;
}

export const DEFAULT_COVER_LETTER_VI: CoverLetterData = {
  recipientName: 'Ban Giám đốc & Bộ phận Tuyển dụng Kỹ thuật',
  recipientRole: 'Head of Engineering / Technical Hiring Manager',
  companyName: 'Doanh nghiệp Công nghệ Tiêu biểu',
  companyAddress: 'Hà Nội, Việt Nam',
  jobTitle: 'Kỹ sư Phần mềm Frontend & Fullstack (Senior / Lead)',
  date: 'Ngày 18 tháng 11 năm 2026',
  salutation: 'Kính gửi Quý công ty và Bộ phận Tuyển dụng Kỹ thuật,',
  opening:
    'Tôi viết thư này với sự hào hứng và trân trọng sâu sắc để ứng tuyển vào vị trí Kỹ sư Phần mềm tại Quý công ty. Sau quá trình theo dõi các sản phẩm công nghệ và hành trình phát triển mạnh mẽ của công ty, tôi đặc biệt ấn tượng với định hướng nâng cao chất lượng trải nghiệm người dùng cũng như quy mô kỹ thuật mà đội ngũ đang theo đuổi.',
  body1:
    'Với hơn 2 năm kinh nghiệm thực chiến chuyên sâu về hệ sinh thái JavaScript/TypeScript, đặc biệt là React, Next.js, Node.js và kiến trúc Web phân tán, tôi đã chủ trì nhiều dự án tối ưu hiệu năng toàn diện. Điển hình tại các dự án trước đây, tôi đã trực tiếp tái cấu trúc hệ thống, cải thiện chỉ số Google Lighthouse Performance từ 60 lên trên 90 điểm và cắt giảm hơn 40% thời gian tải trang ban đầu (LCP < 1.8s). Tôi luôn chú trọng áp dụng Clean Code, nguyên lý SOLID và quy trình Unit/E2E Testing (Jest, Playwright) để bảo đảm mã nguồn luôn bền vững và dễ mở rộng.',
  body2:
    'Không chỉ dừng lại ở năng lực lập trình thuần túy, tôi có khả năng phối hợp chặt chẽ với UI/UX Designer, Product Manager và các kỹ sư Backend để giải quyết các bài toán sản phẩm thực tế. Tôi tin rằng sự kỷ luật, tinh thần học hỏi chủ động và tư duy tập trung vào giá trị người dùng của mình sẽ đóng góp trực tiếp vào mục tiêu tăng trưởng kỹ thuật của Quý công ty.',
  closing:
    'Tôi rất mong có cơ hội được tham gia buổi phỏng vấn trực tiếp để trao đổi chi tiết hơn về việc những kinh nghiệm và kỹ năng của tôi có thể đồng hành cùng các dự án trọng điểm của công ty. Xin chân thành cảm ơn Quý công ty đã dành thời gian xem xét hồ sơ.',
  signOff: 'Trân trọng,',
  senderName: 'Nguyễn Đức Anh',
  senderRole: 'Frontend & Fullstack Developer',
  senderEmail: 'contact@ducanh.dev',
  senderPhone: '+84 988 123 456',
  senderLocation: 'Hà Nội, Việt Nam',
  senderWebsite: 'https://ducanh.dev',
};

export const DEFAULT_COVER_LETTER_EN: CoverLetterData = {
  recipientName: 'Hiring Team & Technical Leadership',
  recipientRole: 'Engineering Manager / Head of Technology',
  companyName: 'Innovative Technology Enterprise',
  companyAddress: 'Hanoi, Vietnam / Remote',
  jobTitle: 'Senior Frontend & Fullstack Software Engineer',
  date: 'November 18, 2026',
  salutation: 'Dear Hiring Manager and Engineering Team,',
  opening:
    'I am writing to express my enthusiastic interest in the Software Engineer position at your company. Having closely followed your technological innovations and scalable product milestones, I am genuinely inspired by your engineering excellence and commitment to delivering seamless user experiences at scale.',
  body1:
    'With over 2 years of hands-on experience specializing in modern web ecosystems—particularly TypeScript, React, Next.js, Node.js, and distributed RESTful architectures—I have consistently delivered measurable engineering outcomes. In my recent roles, I spearheaded architectural revamps that boosted Google Lighthouse scores from 60 to 90+ and cut initial page load latencies by over 40% (achieving LCP < 1.8s). I hold clean code, SOLID design patterns, and rigorous automated testing (Jest, Playwright) at the core of my daily engineering practices.',
  body2:
    'Beyond technical execution, I excel at collaborating across cross-functional teams with UI/UX designers, product managers, and backend engineers to translate ambitious roadmaps into robust digital products. I am confident that my problem-solving mindset, fast adaptability, and dedication to code quality will allow me to make an immediate, meaningful impact on your engineering objectives.',
  closing:
    'I would welcome the opportunity to discuss in an interview how my skills, experience, and proactive mindset align with your strategic roadmap. Thank you for your time, consideration, and dedication to evaluating my application.',
  signOff: 'Sincerely,',
  senderName: 'NGUYEN DUC ANH',
  senderRole: 'Frontend & Fullstack Developer',
  senderEmail: 'contact@ducanh.dev',
  senderPhone: '+84 988 123 456',
  senderLocation: 'Hanoi, Vietnam',
  senderWebsite: 'https://ducanh.dev',
};

export const COVER_LETTER_PRESETS: CoverLetterPreset[] = [
  {
    id: 'frontend-focus',
    titleVi: 'Kỹ sư Frontend & Web Performance',
    titleEn: 'Frontend & Web Performance Engineer',
    roleVi: 'Frontend Developer (React / Next.js)',
    roleEn: 'Frontend Developer (React / Next.js)',
    badge: 'Frontend • React / Next.js',
    dataVi: {
      jobTitle: 'Senior Frontend Engineer (React / Next.js)',
      opening:
        'Tôi viết thư này để bày tỏ mong muốn được đồng hành cùng Quý công ty tại vị trí Senior Frontend Engineer. Với niềm đam mê sâu sắc dành cho Web Performance, Core Web Vitals và thiết kế giao diện chuẩn mực, tôi rất ấn tượng với chất lượng sản phẩm và sứ mệnh công nghệ của công ty.',
      body1:
        'Thế mạnh nổi bật của tôi bao gồm TypeScript, React 18, Next.js App Router, Tailwind CSS và kiến trúc quản lý trạng thái quy mô lớn với Zustand / Redux Toolkit. Tôi có bề dày kinh nghiệm trong việc biến các bản thiết kế Figma phức tạp thành giao diện Responsive pixel-perfect, tối ưu hóa bundle size và thiết lập hệ thống Design System dùng chung giúp các nhóm tăng tốc độ phát triển sản phẩm tới 30%.',
      body2:
        'Tôi đặc biệt chú trọng tới trải nghiệm người dùng mượt mà ở cấp độ 60fps và khả năng tương thích đa thiết bị. Cùng với kỹ năng kiểm thử tự động (Jest, Cypress), tôi luôn đảm bảo từng dòng code đưa lên môi trường Production đều an toàn, ổn định và dễ bảo trì.',
      closing:
        'Tôi rất hy vọng được trao đổi trực tiếp với Quý công ty để chia sẻ rõ hơn về phương pháp tối ưu hiệu năng và các giải pháp Frontend mà tôi có thể mang lại. Xin chân thành cảm ơn Quý ban.',
    },
    dataEn: {
      jobTitle: 'Senior Frontend Engineer (React / Next.js)',
      opening:
        'I am excited to submit my application for the Senior Frontend Engineer position at your company. With a deep passion for web performance engineering, Core Web Vitals, and pixel-perfect design systems, I have long admired your technological craftsmanship and user-centric applications.',
      body1:
        'My core expertise spans TypeScript, React 18, Next.js App Router, Tailwind CSS, and scalable client-state architectures with Zustand and Redux Toolkit. I have proven success turning sophisticated Figma design systems into responsive, accessible web interfaces while systematically reducing bundle payloads and boosting development speed by 30%.',
      body2:
        'I place the highest priority on fluid 60fps user experiences, cross-browser consistency, and rigorous automated testing with Jest and Cypress. My code is consistently clean, thoroughly documented, and engineered for high maintainability.',
      closing:
        'I would love the opportunity to discuss how my frontend architecture principles and performance obsession can accelerate your digital roadmap. Thank you for your consideration.',
    },
  },
  {
    id: 'backend-cloud',
    titleVi: 'Kỹ sư Backend & Điện toán Đám mây',
    titleEn: 'Backend & Cloud Solutions Engineer',
    roleVi: 'Backend Engineer (Node.js / Go / AWS)',
    roleEn: 'Backend Engineer (Node.js / Go / AWS)',
    badge: 'Backend • Cloud & Microservices',
    dataVi: {
      jobTitle: 'Backend & Cloud Engineer (Node.js / Go / Cloud)',
      opening:
        'Tôi viết thư này để ứng tuyển vào vị trí Kỹ sư Backend & Hạ tầng Đám mây tại Quý công ty. Là một lập trình viên đam mê kiến trúc phân tán, xử lý dữ liệu tải cao và độ tin cậy của hệ thống (High Availability), tôi rất mong muốn được cống hiến năng lực của mình cho các dịch vụ cốt lõi của công ty.',
      body1:
        'Kinh nghiệm của tôi tập trung vào Node.js, TypeScript, Go, cơ sở dữ liệu quan hệ PostgreSQL và NoSQL MongoDB / Redis. Tôi đã tham gia thiết kế các dịch vụ microservices xử lý hàng trăm nghìn giao dịch mỗi ngày, tối ưu hóa câu truy vấn cơ sở dữ liệu giúp giảm thời gian phản hồi API từ 400ms xuống dưới 80ms, đồng thời xây dựng quy trình CI/CD tự động hóa trên nền tảng Docker và AWS.',
      body2:
        'Tôi coi trọng các tiêu chuẩn bảo mật hệ thống, Clean Architecture, RESTful API và GraphQL. Tư duy luôn chủ động phát hiện nút thắt cổ chai (bottleneck) và giám sát hiệu năng bằng các công cụ hiện đại giúp tôi luôn giữ cho các dịch vụ hoạt động ổn định và sẵn sàng mở rộng quy mô.',
      closing:
        'Tôi rất mong muốn được thảo luận cùng Quý công ty về cách thức xây dựng hạ tầng Backend bền vững và sẵn sàng đáp ứng lưu lượng truy cập đột biến. Trân trọng cảm ơn Quý công ty.',
    },
    dataEn: {
      jobTitle: 'Backend & Cloud Solutions Engineer (Node / Go / AWS)',
      opening:
        'I am thrilled to apply for the Backend & Cloud Solutions Engineer role at your organization. Driven by an obsession with distributed systems resilience, high concurrency handling, and clean microservices, I am keen to contribute to the robust infrastructure supporting your products.',
      body1:
        'My background includes deep expertise in Node.js, TypeScript, Go, PostgreSQL indexing, and Redis caching. I have designed high-throughput API gateways handling over 500,000 transactions daily, reduced p95 response latencies from 400ms to 80ms, and automated zero-downtime deployment pipelines using Docker Compose and AWS cloud primitives.',
      body2:
        'I uphold strict security best practices, Clean Architecture, and rigorous API contracts. Proactively diagnosing latency bottlenecks and instrumenting distributed tracing enables me to deliver services that scale predictably under peak loads.',
      closing:
        'I look forward to discussing how my backend scalability experience and engineering discipline can strengthen your backend infrastructure. Thank you for your time and review.',
    },
  },
  {
    id: 'fullstack-general',
    titleVi: 'Lập trình viên Fullstack Toàn diện',
    titleEn: 'End-to-End Fullstack Software Engineer',
    roleVi: 'Fullstack Developer (TypeScript / Web)',
    roleEn: 'Fullstack Developer (TypeScript / Web)',
    badge: 'Fullstack • End-to-End Web',
    dataVi: {
      jobTitle: 'Fullstack Software Engineer',
      opening:
        'Tôi trân trọng gửi thư này để ứng tuyển vào vị trí Fullstack Software Engineer tại Quý công ty. Với khả năng bao quát trọn vẹn vòng đời phát triển sản phẩm từ thiết kế giao diện người dùng đến kiến trúc cơ sở dữ liệu phía sau, tôi mong muốn mang lại giá trị thiết thực và nhanh chóng cho đội ngũ.',
      body1:
        'Năng lực cốt lõi của tôi trải dài từ Frontend hiện đại (React, Next.js, Tailwind CSS) đến Backend vững chắc (Node.js, Express, RESTful APIs, PostgreSQL). Nhờ sự am hiểu đồng thời cả hai tầng công nghệ, tôi có thể độc lập làm chủ tính năng từ khâu phân tích yêu cầu, hiện thực hóa giao diện, thiết kế API schema cho tới đóng gói triển khai trên cloud.',
      body2:
        'Tôi là người luôn đề cao tính tự giác, tinh thần đồng đội và văn hóa Product Mindset — hiểu rằng mã nguồn tối ưu nhất là mã nguồn giải quyết đúng nỗi đau của người dùng và mang lại tăng trưởng kinh doanh cho doanh nghiệp.',
      closing:
        'Tôi hy vọng sẽ có cơ hội được trình bày cụ thể hơn về những sản phẩm thực chiến tôi đã xây dựng trong buổi phỏng vấn sắp tới. Xin chân thành cảm ơn Quý công ty.',
    },
    dataEn: {
      jobTitle: 'Fullstack Software Engineer',
      opening:
        'I am writing to express my strong candidacy for the Fullstack Software Engineer position at your company. With a comprehensive skill set spanning both responsive UI engineering and robust backend infrastructure, I am eager to help build end-to-end features that drive customer growth.',
      body1:
        'My toolkit connects modern frontend architecture (React, Next.js, Tailwind CSS) with battle-tested backend frameworks (Node.js, Express, RESTful APIs, PostgreSQL). This dual perspective allows me to bridge technical silos, accelerate sprint cycles, and take full ownership of feature lifecycles from ideation to production rollout.',
      body2:
        'I champion clean code, thoughtful architecture, and a strong product-driven mindset—believing that great engineering should always translate directly into superior business outcomes and delightful user interactions.',
      closing:
        'I would be thrilled to meet with your engineering leadership to discuss how my end-to-end capabilities can add immediate value to your team. Thank you for your consideration.',
    },
  },
  {
    id: 'junior-fresher',
    titleVi: 'Kỹ sư Trẻ & Tinh thần Học hỏi Vượt trội',
    titleEn: 'Junior / High-Potential Software Engineer',
    roleVi: 'Junior Software Engineer',
    roleEn: 'Junior Software Engineer',
    badge: 'Junior / Career Starter • High Agility',
    dataVi: {
      jobTitle: 'Junior / Associate Software Engineer',
      opening:
        'Tôi viết thư này để bày tỏ mong muốn được gia nhập Quý công ty tại vị trí Kỹ sư Phần mềm. Với nền tảng kiến thức khoa học máy tính vững chắc từ trường Đại học Bách Khoa cùng tinh thần học hỏi không ngừng, tôi rất hào hứng trước môi trường chuyên nghiệp và giàu thử thách tại công ty.',
      body1:
        'Trong quá trình học tập và thực hiện các dự án cá nhân thực chiến, tôi đã thành thạo các công nghệ web nền tảng như TypeScript, React, Next.js và Node.js. Tôi luôn tuân thủ các chuẩn mực viết code sạch, chủ động áp dụng Git workflow, viết unit tests và không ngại nghiên cứu sâu về các tài liệu kỹ thuật quốc tế để tìm ra giải pháp tối ưu.',
      body2:
        'Điểm mạnh lớn nhất của tôi là tốc độ thích ứng nhanh với các công nghệ mới, sự khiêm tốn lắng nghe phản hồi từ các Senior đi trước và tinh thần trách nhiệm cao đối với từng dòng code được giao.',
      closing:
        'Tôi rất mong có cơ hội được gặp gỡ Quý công ty để chứng minh năng lực thực tế và khát khao cống hiến lâu dài cùng đội ngũ. Xin trân trọng cảm ơn Quý ban tuyển dụng.',
    },
    dataEn: {
      jobTitle: 'Junior / Associate Software Engineer',
      opening:
        'I am writing to express my strong enthusiasm for the Junior / Associate Software Engineer role at your company. Backed by solid foundational computer science coursework and hands-on project experience, I am eager to embark on my professional engineering journey with your talented team.',
      body1:
        'Through academic research and building fullstack web applications, I have developed solid proficiency in TypeScript, React, Next.js, and Node.js. I take pride in adhering to clean coding standards, structured Git workflows, automated testing, and proactively diving into technical documentation to solve non-trivial problems.',
      body2:
        'My greatest assets are high learning agility, humble receptiveness to mentorship from senior engineers, and rigorous ownership over every piece of code I commit.',
      closing:
        'I would love the opportunity to interview and demonstrate my work ethic and passion for software craftsmanship. Thank you for your time and consideration.',
    },
  },
];

/**
 * Creates an initial Cover Letter synchronized with CV profile data
 */
export function createSyncedCoverLetter(
  lang: 'vi' | 'en',
  cvData: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
  }
): CoverLetterData {
  const base = lang === 'en' ? { ...DEFAULT_COVER_LETTER_EN } : { ...DEFAULT_COVER_LETTER_VI };
  return {
    ...base,
    senderName: cvData.name || base.senderName,
    senderRole: cvData.role || base.senderRole,
    senderEmail: cvData.email || base.senderEmail,
    senderPhone: cvData.phone || base.senderPhone,
    senderLocation: cvData.location || base.senderLocation,
    senderWebsite: cvData.website || base.senderWebsite,
  };
}
