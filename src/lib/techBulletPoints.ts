export interface TechBulletPoint {
  id: string;
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'fullstack' | 'mobile' | 'testing' | 'leadership';
  actionVerbVi: string;
  actionVerbEn: string;
  techStack: string[];
  metric: string;
  textVi: string;
  textEn: string;
}

export interface BulletCategory {
  id: string;
  labelVi: string;
  labelEn: string;
  badgeColor: string;
}

export const BULLET_CATEGORIES: BulletCategory[] = [
  { id: 'all', labelVi: 'Tất cả gợi ý', labelEn: 'All Suggestions', badgeColor: 'bg-neutral-800 text-neutral-300' },
  { id: 'frontend', labelVi: 'Frontend & UI/UX', labelEn: 'Frontend & UI/UX', badgeColor: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' },
  { id: 'backend', labelVi: 'Backend & APIs', labelEn: 'Backend & APIs', badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' },
  { id: 'devops', labelVi: 'DevOps & Cloud CI/CD', labelEn: 'DevOps & Cloud CI/CD', badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' },
  { id: 'database', labelVi: 'Database & Caching', labelEn: 'Database & Caching', badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' },
  { id: 'fullstack', labelVi: 'Full Stack & System', labelEn: 'Full Stack & System', badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/30' },
  { id: 'mobile', labelVi: 'Mobile App (iOS/Android)', labelEn: 'Mobile App (iOS/Android)', badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/30' },
  { id: 'testing', labelVi: 'Testing & Bảo mật', labelEn: 'Testing & Security', badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/30' },
  { id: 'leadership', labelVi: 'Lead, Agile & Mentoring', labelEn: 'Lead, Agile & Mentoring', badgeColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/30' },
];

export const TECH_BULLET_POINTS: TechBulletPoint[] = [
  // --- FRONTEND ---
  {
    id: 'fe-perf',
    category: 'frontend',
    actionVerbVi: 'Tối ưu hóa',
    actionVerbEn: 'Optimized',
    techStack: ['Next.js', 'React', 'Core Web Vitals', 'Code-splitting'],
    metric: 'Giảm 42% thời gian tải trang',
    textVi: 'Tối ưu hóa hiệu năng website và chỉ số Core Web Vitals (LCP, CLS, FID) bằng Next.js, Dynamic Imports và tối ưu hóa hình ảnh, giảm 42% thời gian tải trang ban đầu và tăng 28% tỷ lệ giữ chân người dùng.',
    textEn: 'Optimized web application performance and Core Web Vitals (LCP, CLS, FID) utilizing Next.js, dynamic code-splitting, and modern image formats, slashing initial load times by 42% and boosting user retention by 28%.'
  },
  {
    id: 'fe-state',
    category: 'frontend',
    actionVerbVi: 'Thiết kế kiến trúc',
    actionVerbEn: 'Architected',
    techStack: ['React', 'Zustand', 'TanStack Query', 'TypeScript'],
    metric: 'Giảm 60% truy vấn mạng dư thừa',
    textVi: 'Thiết kế kiến trúc quản lý state tập trung và caching tầng client với Zustand và TanStack Query (React Query), giảm 60% số lượt gọi API dư thừa và nâng cao tính phản hồi tức thì của giao diện.',
    textEn: 'Architected centralized client state management and data-fetching layer with Zustand and TanStack Query, eliminating 60% of redundant API requests and ensuring real-time UI responsiveness.'
  },
  {
    id: 'fe-design-system',
    category: 'frontend',
    actionVerbVi: 'Xây dựng',
    actionVerbEn: 'Engineered',
    techStack: ['Tailwind CSS', 'Storybook', 'Radix UI', 'Accessibility'],
    metric: 'Rút ngắn 35% thời gian bàn giao tính năng',
    textVi: 'Xây dựng và duy trì hệ thống Design System nội bộ gồm 40+ reusable components với Tailwind CSS, Radix UI và Storybook, chuẩn hóa trải nghiệm trên 15+ module và rút ngắn 35% thời gian phát triển giao diện.',
    textEn: 'Engineered and maintained an internal Design System of 40+ reusable components using Tailwind CSS, Radix UI, and Storybook, unifying UX across 15+ modules and cutting feature delivery cycles by 35%.'
  },
  {
    id: 'fe-micro',
    category: 'frontend',
    actionVerbVi: 'Triển khai',
    actionVerbEn: 'Implemented',
    techStack: ['Micro-Frontends', 'Webpack 5', 'Module Federation', 'TypeScript'],
    metric: '4 team triển khai độc lập zero-downtime',
    textVi: 'Triển khai kiến trúc Micro-Frontend với Module Federation (Webpack/Vite), cho phép 4 squad kỹ thuật phát triển và release độc lập mà không gây ảnh hưởng đến hệ sinh thái chung.',
    textEn: 'Implemented Micro-Frontend architecture using Webpack Module Federation, empowering 4 engineering squads to develop and deploy features autonomously with zero downtime.'
  },
  {
    id: 'fe-a11y',
    category: 'frontend',
    actionVerbVi: 'Nâng chuẩn',
    actionVerbEn: 'Standardized',
    techStack: ['WCAG 2.1 AA', 'ARIA', 'Semantic HTML', 'Lighthouse'],
    metric: 'Đạt điểm số Accessibility 98/100',
    textVi: 'Tái cấu trúc giao diện theo tiêu chuẩn tiếp cận WCAG 2.1 AA, bổ sung ARIA landmarks và điều hướng bàn phím hoàn chỉnh, nâng điểm Lighthouse Accessibility từ 74 lên 98/100.',
    textEn: 'Restructured web accessibility to comply with WCAG 2.1 AA guidelines, integrating ARIA landmarks and keyboard navigation, raising Lighthouse Accessibility score from 74 to 98/100.'
  },

  // --- BACKEND ---
  {
    id: 'be-microservices',
    category: 'backend',
    actionVerbVi: 'Thiết kế',
    actionVerbEn: 'Architected',
    techStack: ['Node.js', 'Go', 'NestJS', 'Microservices', 'gRPC'],
    metric: 'Xử lý 10,000+ RPS, SLA 99.95%',
    textVi: 'Thiết kế và phát triển cụm Microservices chịu tải cao bằng Node.js / NestJS và Go, xử lý ổn định 10,000+ requests/giây với độ trễ p99 dưới 45ms và đảm bảo độ khả dụng hệ thống 99.95%.',
    textEn: 'Architected high-throughput microservices using Node.js/NestJS and Go, sustaining 10,000+ requests/sec with p99 latency under 45ms while maintaining 99.95% system uptime.'
  },
  {
    id: 'be-events',
    category: 'backend',
    actionVerbVi: 'Xây dựng',
    actionVerbEn: 'Designed',
    techStack: ['Apache Kafka', 'RabbitMQ', 'Event-Driven', 'Redis'],
    metric: 'Tăng 4x năng lực xử lý giao dịch song song',
    textVi: 'Xây dựng kiến trúc xử lý sự kiện bất đồng bộ (Event-Driven Architecture) với Apache Kafka và RabbitMQ, tăng năng lực xử lý giao dịch song song lên 4x và loại bỏ nút thắt cổ chai của hệ thống cũ.',
    textEn: 'Designed and integrated asynchronous event-driven architecture with Apache Kafka and RabbitMQ, multiplying transaction processing capacity by 4x and resolving critical legacy bottlenecks.'
  },
  {
    id: 'be-api',
    category: 'backend',
    actionVerbVi: 'Phát triển',
    actionVerbEn: 'Developed',
    techStack: ['RESTful API', 'GraphQL', 'OAuth2', 'JWT', 'Rate Limiting'],
    metric: 'Phục vụ 100,000+ người dùng hàng tháng',
    textVi: 'Phát triển hệ thống RESTful API và GraphQL đạt chuẩn bảo mật OAuth2 / JWT, phục vụ 100,000+ người dùng hoạt động hàng tháng (MAU) với cơ chế rate limiting và payload validation nghiêm ngặt.',
    textEn: 'Developed secure RESTful and GraphQL APIs protected by OAuth2 / JWT authentication, serving 100,000+ monthly active users (MAU) with strict rate-limiting and payload validation.'
  },
  {
    id: 'be-grpc',
    category: 'backend',
    actionVerbVi: 'Tối ưu',
    actionVerbEn: 'Streamlined',
    techStack: ['gRPC', 'Protocol Buffers', 'HTTP/2', 'Microservices'],
    metric: 'Giảm 65% dung lượng payload liên dịch vụ',
    textVi: 'Chuyển đổi giao tiếp nội bộ giữa các microservices từ REST sang gRPC/Protobuf trên nền HTTP/2, giảm 65% kích thước payload truyền tải và hạ độ trễ mạng nội bộ 50%.',
    textEn: 'Streamlined inter-service communications by migrating from REST to gRPC with Protocol Buffers over HTTP/2, reducing network payload size by 65% and lowering network latency by 50%.'
  },

  // --- DEVOPS & CLOUD ---
  {
    id: 'devops-cicd',
    category: 'devops',
    actionVerbVi: 'Thiết lập',
    actionVerbEn: 'Automated',
    techStack: ['GitHub Actions', 'Docker', 'CI/CD', 'Automated Testing'],
    metric: 'Deploy < 5 phút, giảm 80% lỗi phát hành',
    textVi: 'Thiết lập pipeline CI/CD tự động hóa hoàn toàn với GitHub Actions, tự động chạy test, build Docker image và triển khai lên Production trong chưa đầy 5 phút, giảm 80% lỗi do can thiệp thủ công.',
    textEn: 'Automated continuous integration and deployment pipelines using GitHub Actions, executing test suites, container builds, and zero-downtime production releases in under 5 minutes, cutting release errors by 80%.'
  },
  {
    id: 'devops-k8s',
    category: 'devops',
    actionVerbVi: 'Điều phối',
    actionVerbEn: 'Orchestrated',
    techStack: ['Kubernetes', 'AWS EKS', 'Docker', 'Horizontal Pod Autoscaler'],
    metric: 'Tiết kiệm 30% chi phí hạ tầng cloud',
    textVi: 'Điều phối cụm Kubernetes (AWS EKS) với cơ chế tự động co giãn (Horizontal Pod Autoscaler) và Spot Instances, đáp ứng linh hoạt các đợt tăng đột biến lưu lượng và tiết kiệm 30% chi phí hạ tầng cloud.',
    textEn: 'Orchestrated container workloads on AWS EKS utilizing Kubernetes Horizontal Pod Autoscaler (HPA) and Spot Instances, dynamically scaling for peak traffic while reducing monthly cloud spend by 30%.'
  },
  {
    id: 'devops-monitor',
    category: 'devops',
    actionVerbVi: 'Triển khai',
    actionVerbEn: 'Deployed',
    techStack: ['Prometheus', 'Grafana', 'Sentry', 'ELK Stack'],
    metric: 'Hạ MTTR từ 2 giờ xuống dưới 15 phút',
    textVi: 'Triển khai hệ thống giám sát và cảnh báo thời gian thực với Prometheus, Grafana và Sentry, giúp đội ngũ kỹ thuật phát hiện sự cố sớm và giảm thời gian khắc phục (MTTR) từ 2 giờ xuống dưới 15 phút.',
    textEn: 'Deployed centralized monitoring and alerting dashboards using Prometheus, Grafana, and Sentry, accelerating root-cause discovery and driving Mean Time to Resolution (MTTR) down from 2 hours to under 15 minutes.'
  },
  {
    id: 'devops-iac',
    category: 'devops',
    actionVerbVi: 'Quy chuẩn hóa',
    actionVerbEn: 'Provisioned',
    techStack: ['Terraform', 'AWS', 'Infrastructure as Code (IaC)'],
    metric: '100% tài nguyên cloud quản lý bằng mã nguồn',
    textVi: 'Quy chuẩn hóa hạ tầng đám mây dạng Infrastructure-as-Code (IaC) bằng Terraform, cho phép khởi tạo môi trường Staging/Production đồng nhất và kiểm soát phiên bản cấu hình 100%.',
    textEn: 'Provisioned cloud infrastructure as code (IaC) with Terraform, enabling rapid spin-up of identical Staging/Production environments and ensuring 100% version-controlled configuration auditability.'
  },

  // --- DATABASE & CACHING ---
  {
    id: 'db-optimization',
    category: 'database',
    actionVerbVi: 'Tối ưu hóa',
    actionVerbEn: 'Tuned',
    techStack: ['PostgreSQL', 'SQL Optimization', 'Indexing', 'PgBouncer'],
    metric: 'Giảm 75% độ trễ truy vấn, giảm 40% CPU DB',
    textVi: 'Tối ưu hóa các truy vấn SQL phức tạp, cấu trúc lại chỉ mục (B-tree / GIN Indexing) và cấu hình PgBouncer trên PostgreSQL, giảm 75% thời gian truy vấn trung bình và giải phóng 40% tải CPU cơ sở dữ liệu.',
    textEn: 'Tuned slow SQL queries, implemented composite indexing strategies, and configured PgBouncer connection pooling on PostgreSQL, slashing execution latency by 75% and reducing database CPU consumption by 40%.'
  },
  {
    id: 'db-cache',
    category: 'database',
    actionVerbVi: 'Xây dựng',
    actionVerbEn: 'Implemented',
    techStack: ['Redis Cluster', 'Multi-tier Caching', 'Pub/Sub'],
    metric: 'Tỷ lệ Cache Hit 88%, phục vụ 50,000 CCU',
    textVi: 'Xây dựng giải pháp Multi-tier Caching với Redis Cluster, đạt tỷ lệ Cache Hit 88%, giảm tải đáng kể cho database chính và hỗ trợ khả năng phản hồi dữ liệu thời gian thực cho hơn 50,000 người dùng đồng thời.',
    textEn: 'Implemented a multi-tier caching layer with Redis Cluster, achieving an 88% cache hit ratio, offloading heavy reads from primary DB, and supporting real-time data streaming for 50,000+ concurrent sessions.'
  },
  {
    id: 'db-migration',
    category: 'database',
    actionVerbVi: 'Di chuyển',
    actionVerbEn: 'Migrated',
    techStack: ['MongoDB', 'PostgreSQL', 'Prisma', 'Data Migration'],
    metric: 'Di chuyển 2,000,000+ bản ghi với 0 gián đoạn',
    textVi: 'Lập kế hoạch và thực hiện chuyển đổi cơ sở dữ liệu từ MongoDB sang PostgreSQL cho 2,000,000+ bản ghi giao dịch bằng công cụ migration tùy biến, hoàn thành đúng hạn với độ toàn vẹn 100% và 0 downtime.',
    textEn: 'Planned and executed seamless database migration from MongoDB to PostgreSQL for 2,000,000+ transaction records using custom scripts, achieving 100% data integrity with zero system downtime.'
  },

  // --- FULL STACK & ARCHITECTURE ---
  {
    id: 'fs-feature',
    category: 'fullstack',
    actionVerbVi: 'Phát triển trọn vẹn',
    actionVerbEn: 'Delivered',
    techStack: ['Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
    metric: '100% đúng tiến độ và yêu cầu nghiệp vụ',
    textVi: 'Phát triển trọn vẹn (End-to-End) các tính năng cốt lõi từ giao diện người dùng Next.js đến API backend và lược đồ cơ sở dữ liệu, đảm bảo 100% tiêu chí chấp thuận (Acceptance Criteria) và chất lượng code cao.',
    textEn: 'Delivered end-to-end fullstack features from responsive Next.js frontend interfaces to robust backend API services and database models, satisfying 100% of acceptance criteria on schedule.'
  },
  {
    id: 'fs-payment',
    category: 'fullstack',
    actionVerbVi: 'Tích hợp',
    actionVerbEn: 'Integrated',
    techStack: ['Stripe', 'VNPay', 'Webhooks', 'Idempotency', 'Security'],
    metric: 'Xử lý $500K+ giao dịch với độ chính xác 100%',
    textVi: 'Tích hợp các cổng thanh toán (Stripe, VNPay, MoMo) kèm cơ chế Idempotency chống trừ tiền lặp và xử lý Webhook bất đồng bộ, xử lý an toàn hơn $500,000 giao dịch thanh toán không xảy ra sai lệch.',
    textEn: 'Integrated enterprise payment gateways (Stripe, VNPay, MoMo) with idempotent webhook handling and automated reconciliation, safely processing $500,000+ in transactional volume with zero discrepancies.'
  },
  {
    id: 'fs-search',
    category: 'fullstack',
    actionVerbVi: 'Tích hợp',
    actionVerbEn: 'Integrated',
    techStack: ['Elasticsearch', 'Meilisearch', 'Full-text Search', 'Redis'],
    metric: 'Tốc độ tìm kiếm tức thì < 25ms',
    textVi: 'Tích hợp công cụ tìm kiếm toàn văn bản (Full-text Search) với Elasticsearch / Meilisearch, hỗ trợ fuzzy matching và gợi ý tự động (autocomplete) cho kho 100,000+ sản phẩm với tốc độ phản hồi dưới 25ms.',
    textEn: 'Integrated full-text fuzzy search engine with Elasticsearch/Meilisearch and real-time autocomplete across 100,000+ catalog items, reducing search response times to under 25ms.'
  },

  // --- MOBILE APP ---
  {
    id: 'mob-cross',
    category: 'mobile',
    actionVerbVi: 'Phát triển',
    actionVerbEn: 'Engineered',
    techStack: ['React Native', 'Flutter', 'iOS', 'Android', 'Redux'],
    metric: '50,000+ lượt tải, đánh giá 4.8 sao trên Store',
    textVi: 'Phát triển ứng dụng di động đa nền tảng bằng React Native / Flutter, đạt chuyển động 60 FPS mượt mà, tối ưu hóa thời lượng pin và phát hành thành công lên App Store & Google Play với 50,000+ lượt tải (4.8 sao).',
    textEn: 'Engineered cross-platform mobile application using React Native/Flutter, maintaining fluid 60 FPS performance, optimizing battery consumption, and publishing to App Store & Google Play with 50,000+ downloads (4.8 rating).'
  },
  {
    id: 'mob-offline',
    category: 'mobile',
    actionVerbVi: 'Xây dựng',
    actionVerbEn: 'Implemented',
    techStack: ['Offline-First', 'WatermelonDB', 'SQLite', 'Background Sync'],
    metric: 'Tăng 25% tỷ lệ tương tác hàng ngày',
    textVi: 'Xây dựng kiến trúc Offline-First với WatermelonDB / SQLite cục bộ và cơ chế giải quyết xung đột khi tái kết nối mạng, nâng cao trải nghiệm người dùng vùng mạng yếu và tăng 25% tương tác hàng ngày.',
    textEn: 'Implemented offline-first mobile architecture utilizing local WatermelonDB/SQLite with seamless background synchronization, elevating user retention in poor network conditions by 25%.'
  },

  // --- TESTING & SECURITY ---
  {
    id: 'test-qa',
    category: 'testing',
    actionVerbVi: 'Xây dựng',
    actionVerbEn: 'Constructed',
    techStack: ['Jest', 'Playwright', 'React Testing Library', 'CI Gates'],
    metric: 'Tăng code coverage từ 45% lên 88%',
    textVi: 'Xây dựng hệ thống kiểm thử tự động hóa với Jest, React Testing Library và Playwright E2E, nâng độ bao phủ mã nguồn (Code Coverage) từ 45% lên 88% và loại bỏ triệt để lỗi hồi quy khi release.',
    textEn: 'Constructed automated testing suites using Jest, React Testing Library, and Playwright E2E, boosting code coverage from 45% to 88% and eliminating critical production regression defects.'
  },
  {
    id: 'sec-compliance',
    category: 'testing',
    actionVerbVi: 'Bảo mật',
    actionVerbEn: 'Hardened',
    techStack: ['OWASP Top 10', 'CSP', 'AES-256', 'SonarQube'],
    metric: 'Khắc phục 100% cảnh báo lỗ hổng bảo mật',
    textVi: 'Rà soát và khắc phục triệt để các lỗ hổng bảo mật theo tiêu chuẩn OWASP Top 10, thiết lập Content Security Policy (CSP), mã hóa dữ liệu nhạy cảm AES-256 và tích hợp SonarQube kiểm tra mã nguồn tự động.',
    textEn: 'Hardened application security against OWASP Top 10 vulnerabilities, enforcing Content Security Policy (CSP), AES-256 data encryption, and integrating automated SonarQube code vulnerability scans.'
  },

  // --- LEADERSHIP & MENTORING ---
  {
    id: 'lead-mentorship',
    category: 'leadership',
    actionVerbVi: 'Dẫn dắt & Đào tạo',
    actionVerbEn: 'Mentored',
    techStack: ['Pair-Programming', 'Code Review', 'Knowledge Sharing', 'Agile'],
    metric: 'Đào tạo 4 kỹ sư, tăng 30% năng suất team',
    textVi: 'Dẫn dắt kỹ thuật và kèm cặp trực tiếp cho 4 kỹ sư phần mềm (Junior/Mid-level), thiết lập quy chuẩn review code nghiêm ngặt và tổ chức các buổi chia sẻ kiến thức nội bộ hàng tuần, giúp team tăng 30% năng suất.',
    textEn: 'Mentored and upskilled 4 junior/mid-level software engineers via pair-programming, established strict code review guidelines, and hosted bi-weekly technical workshops, driving a 30% boost in team velocity.'
  },
  {
    id: 'lead-agile',
    category: 'leadership',
    actionVerbVi: 'Điều phối & Lập kế hoạch',
    actionVerbEn: 'Facilitated',
    techStack: ['Scrum', 'Sprint Planning', 'Product Roadmap', 'Cross-functional'],
    metric: '95% sprint hoàn thành đúng cam kết',
    textVi: 'Phối hợp chặt chẽ với Product Managers và Designers trong các buổi Sprint Planning và Backlog Grooming, phân tách các yêu cầu kinh doanh phức tạp thành các user stories kỹ thuật rõ ràng, đạt 95% tỷ lệ hoàn thành cam kết.',
    textEn: 'Facilitated Scrum ceremonies with Product Managers and Designers, translating ambiguous business requirements into high-impact technical user stories, achieving a 95% sprint commitment completion rate.'
  }
];
