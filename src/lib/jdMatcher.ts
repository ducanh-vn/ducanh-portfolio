import { CVData } from '@/components/CVBuilderClient';

export type TechCategory =
  | 'languages'
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'devops_cloud'
  | 'testing_qa'
  | 'architecture_practices'
  | 'ai_data';

export interface KeywordDefinition {
  name: string;
  category: TechCategory;
  aliases?: string[];
  importance?: 'high' | 'medium' | 'normal';
}

export interface MatchedKeyword {
  name: string;
  category: TechCategory;
  countInCV: number;
  countInJD: number;
  priority: 'high' | 'medium' | 'normal';
}

export interface MissingKeyword {
  name: string;
  category: TechCategory;
  countInJD: number;
  priority: 'high' | 'medium' | 'normal';
  recommendationVi: string;
  recommendationEn: string;
}

export interface CategoryBreakdown {
  category: TechCategory;
  titleVi: string;
  titleEn: string;
  matched: number;
  total: number;
  percentage: number;
}

export interface JDMatchResult {
  matchScore: number; // 0 - 100%
  totalJDKeywords: number;
  matchedCount: number;
  missingCount: number;
  matchedKeywords: MatchedKeyword[];
  missingKeywords: MissingKeyword[];
  ratingVi: string;
  ratingEn: string;
  ratingColor: string;
  ratingBg: string;
  summaryVi: string;
  summaryEn: string;
  categoryBreakdown: CategoryBreakdown[];
}

export interface SampleJD {
  id: string;
  titleVi: string;
  titleEn: string;
  badge: string;
  descriptionVi: string;
  descriptionEn: string;
}

// Category Metadata
export const TECH_CATEGORY_META: Record<
  TechCategory,
  { titleVi: string; titleEn: string; color: string; badgeBg: string }
> = {
  languages: {
    titleVi: 'Ngôn ngữ lập trình',
    titleEn: 'Programming Languages',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  frontend: {
    titleVi: 'Frontend & UI/UX',
    titleEn: 'Frontend & UI/UX',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
  backend: {
    titleVi: 'Backend & APIs',
    titleEn: 'Backend & APIs',
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  },
  databases: {
    titleVi: 'Cơ sở dữ liệu & Cache',
    titleEn: 'Databases & Caching',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  devops_cloud: {
    titleVi: 'DevOps, Cloud & Hạ tầng',
    titleEn: 'DevOps, Cloud & Infrastructure',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  testing_qa: {
    titleVi: 'Kiểm thử & Chất lượng (QA)',
    titleEn: 'Testing & Quality Assurance',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  },
  architecture_practices: {
    titleVi: 'Kiến trúc & Quy trình Agile',
    titleEn: 'Architecture & Agile Practices',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  },
  ai_data: {
    titleVi: 'Trí tuệ nhân tạo (AI) & Dữ liệu',
    titleEn: 'Artificial Intelligence & Data',
    color: 'text-pink-400',
    badgeBg: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  },
};

// Comprehensive Industry Tech Dictionary (120+ Key Terms)
export const TECH_KEYWORD_DICTIONARY: KeywordDefinition[] = [
  // --- Languages ---
  { name: 'TypeScript', category: 'languages', aliases: ['TS'], importance: 'high' },
  { name: 'JavaScript', category: 'languages', aliases: ['JS', 'ES6', 'ECMAScript'], importance: 'high' },
  { name: 'Python', category: 'languages', aliases: ['Python3', 'py'], importance: 'high' },
  { name: 'Java', category: 'languages', aliases: ['Core Java', 'JDK'], importance: 'high' },
  { name: 'Go', category: 'languages', aliases: ['Golang'], importance: 'high' },
  { name: 'C++', category: 'languages', aliases: ['CPP'], importance: 'medium' },
  { name: 'C#', category: 'languages', aliases: ['CSharp', '.NET'], importance: 'medium' },
  { name: 'Rust', category: 'languages', importance: 'medium' },
  { name: 'PHP', category: 'languages', aliases: ['PHP8', 'PHP7'], importance: 'medium' },
  { name: 'Ruby', category: 'languages', aliases: ['Ruby on Rails', 'RoR'], importance: 'medium' },
  { name: 'Kotlin', category: 'languages', importance: 'medium' },
  { name: 'Swift', category: 'languages', importance: 'medium' },
  { name: 'Dart', category: 'languages', aliases: ['Flutter'], importance: 'normal' },
  { name: 'SQL', category: 'languages', aliases: ['Structured Query Language'], importance: 'high' },
  { name: 'HTML5', category: 'languages', aliases: ['HTML'], importance: 'normal' },
  { name: 'CSS3', category: 'languages', aliases: ['CSS', 'SCSS', 'Sass'], importance: 'normal' },
  { name: 'Bash', category: 'languages', aliases: ['Shell Scripting', 'Shell', 'Zsh'], importance: 'normal' },

  // --- Frontend ---
  { name: 'React', category: 'frontend', aliases: ['ReactJS', 'React.js'], importance: 'high' },
  { name: 'Next.js', category: 'frontend', aliases: ['NextJS', 'Next'], importance: 'high' },
  { name: 'Vue.js', category: 'frontend', aliases: ['Vue', 'VueJS', 'Vue3'], importance: 'high' },
  { name: 'Nuxt.js', category: 'frontend', aliases: ['Nuxt', 'NuxtJS'], importance: 'medium' },
  { name: 'Angular', category: 'frontend', aliases: ['AngularJS', 'Angular 14+'], importance: 'medium' },
  { name: 'Svelte', category: 'frontend', aliases: ['SvelteKit'], importance: 'normal' },
  { name: 'Tailwind CSS', category: 'frontend', aliases: ['Tailwind', 'TailwindCSS'], importance: 'high' },
  { name: 'Redux', category: 'frontend', aliases: ['Redux Toolkit', 'RTK'], importance: 'medium' },
  { name: 'Zustand', category: 'frontend', importance: 'medium' },
  { name: 'Vite', category: 'frontend', aliases: ['ViteJS'], importance: 'medium' },
  { name: 'Webpack', category: 'frontend', importance: 'normal' },
  { name: 'Responsive Design', category: 'frontend', aliases: ['Mobile-first', 'Responsive'], importance: 'medium' },
  { name: 'Web Performance', category: 'frontend', aliases: ['Core Web Vitals', 'Lighthouse', 'PageSpeed'], importance: 'medium' },
  { name: 'SSR', category: 'frontend', aliases: ['Server Side Rendering', 'SSG', 'ISR'], importance: 'medium' },
  { name: 'Material UI', category: 'frontend', aliases: ['MUI', 'Chakra UI', 'Shadcn UI', 'Shadcn'], importance: 'normal' },

  // --- Backend ---
  { name: 'Node.js', category: 'backend', aliases: ['Node', 'NodeJS'], importance: 'high' },
  { name: 'Express.js', category: 'backend', aliases: ['Express', 'ExpressJS'], importance: 'high' },
  { name: 'NestJS', category: 'backend', aliases: ['Nest.js'], importance: 'high' },
  { name: 'FastAPI', category: 'backend', importance: 'high' },
  { name: 'Django', category: 'backend', aliases: ['Django REST Framework', 'DRF'], importance: 'high' },
  { name: 'Flask', category: 'backend', importance: 'medium' },
  { name: 'Spring Boot', category: 'backend', aliases: ['Spring', 'Spring MVC'], importance: 'high' },
  { name: 'ASP.NET Core', category: 'backend', aliases: ['ASP.NET', '.NET Core', 'Dotnet'], importance: 'high' },
  { name: 'Laravel', category: 'backend', importance: 'medium' },
  { name: 'Microservices', category: 'backend', aliases: ['Microservice Architecture', 'Distributed Systems'], importance: 'high' },
  { name: 'RESTful API', category: 'backend', aliases: ['REST API', 'REST', 'RESTful'], importance: 'high' },
  { name: 'GraphQL', category: 'backend', aliases: ['Apollo GraphQL', 'GQL'], importance: 'medium' },
  { name: 'gRPC', category: 'backend', aliases: ['Protobuf', 'Protocol Buffers'], importance: 'medium' },
  { name: 'WebSocket', category: 'backend', aliases: ['WebSockets', 'Socket.io'], importance: 'medium' },
  { name: 'RabbitMQ', category: 'backend', aliases: ['Message Broker', 'AMQP'], importance: 'medium' },
  { name: 'Kafka', category: 'backend', aliases: ['Apache Kafka', 'Event Streaming'], importance: 'high' },

  // --- Databases ---
  { name: 'PostgreSQL', category: 'databases', aliases: ['Postgres', 'PGSQL', 'Postgre'], importance: 'high' },
  { name: 'MySQL', category: 'databases', aliases: ['MariaDB'], importance: 'high' },
  { name: 'MongoDB', category: 'databases', aliases: ['Mongo', 'NoSQL'], importance: 'high' },
  { name: 'Redis', category: 'databases', aliases: ['In-memory Cache', 'Key-value'], importance: 'high' },
  { name: 'Elasticsearch', category: 'databases', aliases: ['Elastic', 'ELK Stack', 'OpenSearch'], importance: 'medium' },
  { name: 'SQLite', category: 'databases', importance: 'normal' },
  { name: 'DynamoDB', category: 'databases', importance: 'medium' },
  { name: 'Prisma', category: 'databases', aliases: ['Prisma ORM'], importance: 'medium' },
  { name: 'Drizzle ORM', category: 'databases', aliases: ['Drizzle'], importance: 'normal' },
  { name: 'TypeORM', category: 'databases', aliases: ['Sequelize', 'Hibernate', 'Entity Framework'], importance: 'normal' },
  { name: 'Supabase', category: 'databases', aliases: ['Firebase'], importance: 'normal' },

  // --- DevOps & Cloud ---
  { name: 'Docker', category: 'devops_cloud', aliases: ['Containerization', 'Containers'], importance: 'high' },
  { name: 'Kubernetes', category: 'devops_cloud', aliases: ['K8s'], importance: 'high' },
  { name: 'AWS', category: 'devops_cloud', aliases: ['Amazon Web Services', 'EC2', 'S3', 'Lambda', 'ECS'], importance: 'high' },
  { name: 'Google Cloud', category: 'devops_cloud', aliases: ['GCP', 'Google Cloud Platform'], importance: 'medium' },
  { name: 'Azure', category: 'devops_cloud', aliases: ['Microsoft Azure'], importance: 'medium' },
  { name: 'CI/CD', category: 'devops_cloud', aliases: ['Continuous Integration', 'Continuous Deployment', 'Pipelines'], importance: 'high' },
  { name: 'GitHub Actions', category: 'devops_cloud', aliases: ['GitLab CI', 'Jenkins'], importance: 'high' },
  { name: 'Terraform', category: 'devops_cloud', aliases: ['IaC', 'Infrastructure as Code'], importance: 'medium' },
  { name: 'Linux', category: 'devops_cloud', aliases: ['Ubuntu', 'CentOS', 'Debian'], importance: 'high' },
  { name: 'Nginx', category: 'devops_cloud', aliases: ['Reverse Proxy'], importance: 'medium' },
  { name: 'Prometheus', category: 'devops_cloud', aliases: ['Grafana', 'Monitoring', 'Observability', 'Datadog'], importance: 'medium' },
  { name: 'Serverless', category: 'devops_cloud', aliases: ['AWS Lambda', 'Cloud Functions'], importance: 'medium' },

  // --- Testing & QA ---
  { name: 'Unit Testing', category: 'testing_qa', aliases: ['Unit Tests', 'Unit Test'], importance: 'high' },
  { name: 'Integration Testing', category: 'testing_qa', aliases: ['Integration Tests'], importance: 'medium' },
  { name: 'E2E Testing', category: 'testing_qa', aliases: ['End-to-End', 'End-to-end Testing'], importance: 'medium' },
  { name: 'Jest', category: 'testing_qa', aliases: ['Vitest'], importance: 'high' },
  { name: 'Cypress', category: 'testing_qa', aliases: ['Playwright', 'Selenium'], importance: 'medium' },
  { name: 'TDD', category: 'testing_qa', aliases: ['Test Driven Development', 'BDD'], importance: 'medium' },
  { name: 'Postman', category: 'testing_qa', aliases: ['API Testing', 'Swagger', 'OpenAPI'], importance: 'normal' },

  // --- Architecture & Practices ---
  { name: 'Clean Architecture', category: 'architecture_practices', aliases: ['Clean Code', 'Hexagonal Architecture'], importance: 'high' },
  { name: 'Design Patterns', category: 'architecture_practices', aliases: ['Software Architecture', 'OOP Patterns'], importance: 'high' },
  { name: 'SOLID', category: 'architecture_practices', aliases: ['SOLID Principles'], importance: 'high' },
  { name: 'System Design', category: 'architecture_practices', aliases: ['High Level Design', 'Architecture Design'], importance: 'high' },
  { name: 'Scalability', category: 'architecture_practices', aliases: ['High Availability', 'High Throughput', 'Fault Tolerance'], importance: 'high' },
  { name: 'Security', category: 'architecture_practices', aliases: ['OWASP', 'Web Security', 'Data Protection'], importance: 'high' },
  { name: 'OAuth 2.0', category: 'architecture_practices', aliases: ['OAuth', 'JWT', 'Authentication', 'SSO'], importance: 'high' },
  { name: 'Agile', category: 'architecture_practices', aliases: ['Scrum', 'Sprint', 'Kanban'], importance: 'high' },
  { name: 'Code Review', category: 'architecture_practices', aliases: ['Peer Review', 'Pull Request Review'], importance: 'high' },
  { name: 'Git', category: 'architecture_practices', aliases: ['Git Flow', 'GitHub', 'Version Control'], importance: 'high' },

  // --- AI & Data ---
  { name: 'Machine Learning', category: 'ai_data', aliases: ['ML', 'AI'], importance: 'medium' },
  { name: 'Deep Learning', category: 'ai_data', aliases: ['Neural Networks', 'PyTorch', 'TensorFlow'], importance: 'medium' },
  { name: 'LLM', category: 'ai_data', aliases: ['Large Language Models', 'OpenAI', 'GPT', 'Claude', 'Gemini'], importance: 'high' },
  { name: 'RAG', category: 'ai_data', aliases: ['Retrieval-Augmented Generation', 'Retrieval Augmented Generation'], importance: 'high' },
  { name: 'LangChain', category: 'ai_data', aliases: ['LlamaIndex'], importance: 'medium' },
  { name: 'Vector Database', category: 'ai_data', aliases: ['Vector DB', 'Pinecone', 'Qdrant', 'Chroma', 'Embeddings'], importance: 'medium' },
  { name: 'Data Pipeline', category: 'ai_data', aliases: ['ETL', 'Pandas', 'Apache Spark'], importance: 'normal' },
];

// Helper: Escape special chars for regex
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Check presence of keyword or any alias in text
function checkKeywordInText(text: string, def: KeywordDefinition): { found: boolean; count: number } {
  const terms = [def.name, ...(def.aliases || [])];
  let totalCount = 0;

  for (const term of terms) {
    const escaped = escapeRegex(term);
    let regex: RegExp;

    // Handle symbols like C++, C#, .NET
    if (/[\+\#\.]/.test(term)) {
      regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'gi');
    } else {
      regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    }

    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      totalCount += matches.length;
    }
  }

  return { found: totalCount > 0, count: totalCount };
}

// Extract full text from CVData
export function extractCVFullText(cv: CVData): string {
  const parts: string[] = [];

  if (cv.name) parts.push(cv.name);
  if (cv.role) parts.push(cv.role);
  if (cv.summary) parts.push(cv.summary);

  if (Array.isArray(cv.skills)) {
    parts.push(...cv.skills);
  }

  if (Array.isArray(cv.timeline)) {
    for (const t of cv.timeline) {
      if (t.role) parts.push(t.role);
      if (t.desc) parts.push(t.desc);
    }
  }

  if (Array.isArray(cv.projects)) {
    for (const p of cv.projects) {
      if (p.title) parts.push(p.title);
      if (p.category) parts.push(p.category);
      if (p.desc) parts.push(p.desc);
      if (Array.isArray(p.badges)) {
        parts.push(...p.badges);
      }
      if (Array.isArray(p.features)) {
        for (const f of p.features) {
          if (f.title) parts.push(f.title);
          if (f.detail) parts.push(f.detail);
        }
      }
    }
  }

  if (Array.isArray(cv.education)) {
    for (const e of cv.education) {
      if (e.school) parts.push(e.school);
      if (e.degree) parts.push(e.degree);
      if (e.desc) parts.push(e.desc);
    }
  }

  if (Array.isArray(cv.customSections)) {
    for (const cs of cv.customSections) {
      if (cs.title) parts.push(cs.title);
      if (cs.titleEn) parts.push(cs.titleEn);
      if (cs.content) parts.push(cs.content);
      if (Array.isArray(cs.items)) {
        for (const it of cs.items) {
          if (it.title) parts.push(it.title);
          if (it.subtitle) parts.push(it.subtitle);
          if (it.desc) parts.push(it.desc);
        }
      }
    }
  }

  return parts.join(' ');
}

// Core Matching Algorithm
export function analyzeJDMatch(jdText: string, cv: CVData, lang: 'vi' | 'en'): JDMatchResult {
  const trimmedJD = (jdText || '').trim();

  if (!trimmedJD) {
    return {
      matchScore: 0,
      totalJDKeywords: 0,
      matchedCount: 0,
      missingCount: 0,
      matchedKeywords: [],
      missingKeywords: [],
      ratingVi: 'Chưa nhập JD',
      ratingEn: 'No JD Provided',
      ratingColor: 'text-neutral-400',
      ratingBg: 'bg-neutral-800 text-neutral-400 border-neutral-700',
      summaryVi: 'Vui lòng dán nội dung tin tuyển dụng (Job Description) vào ô bên dưới để so khớp từ khóa.',
      summaryEn: 'Please paste the Job Description into the box below to analyze keyword matching.',
      categoryBreakdown: [],
    };
  }

  const cvText = extractCVFullText(cv);

  // 1. Identify all keywords present in the JD
  const detectedJDKeywords: {
    def: KeywordDefinition;
    countInJD: number;
    countInCV: number;
    foundInCV: boolean;
  }[] = [];

  for (const def of TECH_KEYWORD_DICTIONARY) {
    const jdCheck = checkKeywordInText(trimmedJD, def);
    if (jdCheck.found) {
      const cvCheck = checkKeywordInText(cvText, def);
      detectedJDKeywords.push({
        def,
        countInJD: jdCheck.count,
        countInCV: cvCheck.count,
        foundInCV: cvCheck.found,
      });
    }
  }

  const matchedKeywords: MatchedKeyword[] = [];
  const missingKeywords: MissingKeyword[] = [];

  // Sort and separate
  for (const item of detectedJDKeywords) {
    // Determine priority based on frequency in JD and dictionary importance
    let priority: 'high' | 'medium' | 'normal' = item.def.importance || 'normal';
    if (item.countInJD >= 3) {
      priority = 'high';
    } else if (item.countInJD >= 2 && priority === 'normal') {
      priority = 'medium';
    }

    if (item.foundInCV) {
      matchedKeywords.push({
        name: item.def.name,
        category: item.def.category,
        countInCV: item.countInCV,
        countInJD: item.countInJD,
        priority,
      });
    } else {
      missingKeywords.push({
        name: item.def.name,
        category: item.def.category,
        countInJD: item.countInJD,
        priority,
        recommendationVi:
          priority === 'high'
            ? `Xuất hiện ${item.countInJD} lần trong JD. Cần bổ sung ngay vào mục Kỹ năng hoặc mô tả dự án gần nhất.`
            : `Được nhắc đến trong JD. Nên thêm vào danh sách Kỹ năng để tăng điểm tương thích ATS.`,
        recommendationEn:
          priority === 'high'
            ? `Mentioned ${item.countInJD} times in JD. Strongly recommended to add to Skills or recent project bullets.`
            : `Mentioned in JD. Recommended to include in your Skills list to improve ATS match.`,
      });
    }
  }

  // Sort missing: high priority first, then by countInJD desc
  missingKeywords.sort((a, b) => {
    const pOrder = { high: 0, medium: 1, normal: 2 };
    if (pOrder[a.priority] !== pOrder[b.priority]) {
      return pOrder[a.priority] - pOrder[b.priority];
    }
    return b.countInJD - a.countInJD;
  });

  // Sort matched: high priority first, then countInCV desc
  matchedKeywords.sort((a, b) => {
    const pOrder = { high: 0, medium: 1, normal: 2 };
    if (pOrder[a.priority] !== pOrder[b.priority]) {
      return pOrder[a.priority] - pOrder[b.priority];
    }
    return b.countInCV - a.countInCV;
  });

  const totalJDKeywords = detectedJDKeywords.length;
  const matchedCount = matchedKeywords.length;
  const missingCount = missingKeywords.length;

  let matchScore = 0;
  if (totalJDKeywords > 0) {
    // Weighted scoring: high priority matches weigh 1.5x
    let earnedWeight = 0;
    let totalWeight = 0;

    for (const item of detectedJDKeywords) {
      const w = item.countInJD >= 3 ? 1.5 : item.countInJD >= 2 ? 1.2 : 1.0;
      totalWeight += w;
      if (item.foundInCV) {
        earnedWeight += w;
      }
    }
    matchScore = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));
  }

  // Determine Rating Level
  let ratingVi = '';
  let ratingEn = '';
  let ratingColor = '';
  let ratingBg = '';
  let summaryVi = '';
  let summaryEn = '';

  if (matchScore >= 85) {
    ratingVi = 'Xuất sắc (Match Rất Cao)';
    ratingEn = 'Exceptional Match';
    ratingColor = 'text-emerald-400';
    ratingBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    summaryVi = `Hồ sơ của bạn khớp ${matchScore}% với tin tuyển dụng này! Đã bao phủ hầu hết các công nghệ và kỹ năng quan trọng mà nhà tuyển dụng yêu cầu.`;
    summaryEn = `Your CV matches ${matchScore}% with this job posting! You have covered almost all critical technologies and required skills.`;
  } else if (matchScore >= 70) {
    ratingVi = 'Tốt (Đạt chuẩn sàng lọc)';
    ratingEn = 'Strong Match';
    ratingColor = 'text-cyan-400';
    ratingBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    summaryVi = `Hồ sơ đạt ${matchScore}%, đủ điều kiện vượt qua vòng quét từ khóa tự động của đa số hệ thống ATS. Bổ sung thêm ${missingCount} từ khóa còn thiếu để đạt tỷ lệ phỏng vấn cao nhất.`;
    summaryEn = `Your CV scored ${matchScore}%, ready to pass automated ATS keyword screening. Adding the ${missingCount} missing keywords will maximize interview callbacks.`;
  } else if (matchScore >= 50) {
    ratingVi = 'Trung bình (Cần bổ sung)';
    ratingEn = 'Moderate Match';
    ratingColor = 'text-amber-400';
    ratingBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    summaryVi = `Độ tương thích đạt ${matchScore}%. Bạn đã có nền tảng tốt nhưng còn thiếu một số từ khóa trọng tâm được nhắc lại nhiều lần trong JD.`;
    summaryEn = `Keyword match is ${matchScore}%. You have solid fundamentals but lack several key terms emphasized in the job description.`;
  } else {
    ratingVi = 'Thấp (Chưa tối ưu ATS)';
    ratingEn = 'Needs Optimization';
    ratingColor = 'text-rose-400';
    ratingBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    summaryVi = `Độ khớp chỉ đạt ${matchScore}%. Hồ sơ có nguy cơ bị loại sớm ở vòng lọc ATS tự động do thiếu nhiều công nghệ cốt lõi của vị trí này.`;
    summaryEn = `Match rate is ${matchScore}%. Your CV risks early filtering by ATS scanners due to missing core technologies required for this role.`;
  }

  // Category Breakdown
  const catMap = new Map<TechCategory, { matched: number; total: number }>();
  for (const item of detectedJDKeywords) {
    const cat = item.def.category;
    const current = catMap.get(cat) || { matched: 0, total: 0 };
    current.total += 1;
    if (item.foundInCV) current.matched += 1;
    catMap.set(cat, current);
  }

  const categoryBreakdown: CategoryBreakdown[] = Array.from(catMap.entries()).map(([cat, stats]) => {
    const meta = TECH_CATEGORY_META[cat];
    return {
      category: cat,
      titleVi: meta ? meta.titleVi : cat,
      titleEn: meta ? meta.titleEn : cat,
      matched: stats.matched,
      total: stats.total,
      percentage: stats.total > 0 ? Math.round((stats.matched / stats.total) * 100) : 0,
    };
  });

  categoryBreakdown.sort((a, b) => b.total - a.total);

  return {
    matchScore,
    totalJDKeywords,
    matchedCount,
    missingCount,
    matchedKeywords,
    missingKeywords,
    ratingVi,
    ratingEn,
    ratingColor,
    ratingBg,
    summaryVi,
    summaryEn,
    categoryBreakdown,
  };
}

// 4 Realistic IT Sample Job Descriptions (Bilingual)
export const SAMPLE_JDS: SampleJD[] = [
  {
    id: 'frontend-sr',
    titleVi: 'Senior Frontend / Fullstack Engineer',
    titleEn: 'Senior Frontend / Fullstack Engineer',
    badge: 'React • Next.js • TypeScript',
    descriptionVi: `Vị trí: Senior Frontend Engineer
Công ty: TechCorp Global (Fintech & E-Commerce)
Mô tả công việc:
- Thiết kế, phát triển và tối ưu hóa các ứng dụng Web quy mô lớn với React, Next.js và TypeScript.
- Phối hợp chặt chẽ với UI/UX Designer chuyển hóa thiết kế Figma thành giao diện chuẩn Responsive Design, tối ưu Core Web Vitals và Web Performance.
- Xây dựng hệ thống quản lý state hiệu quả với Redux Toolkit hoặc Zustand, kết nối RESTful API và GraphQL.
- Thiết lập quy trình Unit Testing với Jest, Vitest và E2E Testing với Cypress / Playwright.
- Áp dụng các nguyên lý Clean Code, Design Patterns, SOLID và Clean Architecture trong mã nguồn.
- Tham gia quy trình Agile / Scrum, thực hiện Code Review nghiêm ngặt và cải tiến CI/CD với GitHub Actions.
Yêu cầu bắt buộc:
- Tối thiểu 3+ năm kinh nghiệm vững chắc với JavaScript (ES6+), TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS.
- Hiểu biết sâu về SSR, Micro-frontends, Responsive Design và RESTful API.
- Có kinh nghiệm với Docker, Git, CI/CD và tối ưu hóa hiệu năng tải trang.`,
    descriptionEn: `Position: Senior Frontend Engineer
Company: TechCorp Global (Fintech & E-Commerce)
Job Description:
- Architect, build, and optimize high-scale web applications using React, Next.js, and TypeScript.
- Collaborate closely with UI/UX designers to translate Figma mockups into pixel-perfect Responsive Design while optimizing Core Web Vitals and Web Performance.
- Build robust state management using Redux Toolkit or Zustand, integrating RESTful API and GraphQL endpoints.
- Establish comprehensive testing suites using Jest, Vitest, and Cypress / Playwright for E2E Testing.
- Apply Clean Code, Design Patterns, SOLID principles, and Clean Architecture throughout codebases.
- Participate in Agile / Scrum rituals, conduct rigorous Code Reviews, and improve CI/CD pipelines via GitHub Actions.
Key Requirements:
- 3+ years of professional experience with JavaScript, TypeScript, React, Next.js, HTML5, CSS3, and Tailwind CSS.
- In-depth understanding of SSR, Responsive Design, and RESTful API integration.
- Hands-on experience with Docker, Git, CI/CD, and web performance tuning.`,
  },
  {
    id: 'backend-sr',
    titleVi: 'Senior Backend / Cloud Engineer',
    titleEn: 'Senior Backend / Cloud Engineer',
    badge: 'Node.js • Go • PostgreSQL • Docker',
    descriptionVi: `Vị trí: Senior Backend Engineer
Công ty: CloudFlow Systems
Mô tả công việc:
- Thiết kế và phát triển hệ thống backend phân tán (Microservices) chịu tải cao với Node.js, Express.js / NestJS hoặc Go (Golang).
- Thiết kế mô hình dữ liệu quan hệ và tối ưu hóa truy vấn với PostgreSQL, MySQL và caching đa tầng với Redis.
- Xây dựng kiến trúc hướng sự kiện (Event-driven Architecture) sử dụng Message Queue như Apache Kafka hoặc RabbitMQ.
- Thiết kế và triển khai các API chuẩn RESTful API và gRPC bảo mật cao với OAuth 2.0 và JWT.
- Đóng gói ứng dụng với Docker, triển khai và điều phối trên Kubernetes (K8s) và hạ tầng đám mây AWS (EC2, S3, RDS).
- Viết Unit Testing tự động, thiết lập giám sát hệ thống với Prometheus và Grafana.
Yêu cầu bắt buộc:
- Kinh nghiệm làm việc chuyên sâu với Node.js, TypeScript, Go hoặc Python.
- Thành thạo PostgreSQL, Redis, Docker, Microservices và Clean Architecture.
- Có kinh nghiệm thực chiến với AWS, CI/CD pipelines và hệ thống chịu tải lớn (Scalability & High Availability).`,
    descriptionEn: `Position: Senior Backend Engineer
Company: CloudFlow Systems
Job Description:
- Architect and develop high-throughput distributed Microservices using Node.js (NestJS / Express) or Go (Golang).
- Design relational schemas and optimize complex SQL queries on PostgreSQL and MySQL, backed by multi-level caching with Redis.
- Build event-driven streaming pipelines using Apache Kafka or RabbitMQ message brokers.
- Develop secure, scalable RESTful API and gRPC endpoints protected by OAuth 2.0 and JWT.
- Containerize services with Docker, orchestrate deployments with Kubernetes (K8s) on AWS infrastructure (EC2, S3, RDS).
- Write automated Unit Testing, configure system monitoring and alerting with Prometheus and Grafana.
Key Requirements:
- Strong experience with Node.js, TypeScript, Go, or Python.
- Proficiency with PostgreSQL, Redis, Docker, Microservices, and Clean Architecture.
- Practical experience with AWS, CI/CD pipelines, and high-concurrency Scalability.`,
  },
  {
    id: 'devops-cloud',
    titleVi: 'DevOps & Platform Engineer',
    titleEn: 'DevOps & Platform Engineer',
    badge: 'AWS • Kubernetes • Terraform • CI/CD',
    descriptionVi: `Vị trí: DevOps & Cloud Infrastructure Engineer
Công ty: Nexus Cloud Solutions
Mô tả công việc:
- Quản trị, mở rộng và tự động hóa hạ tầng đám mây đa vùng trên AWS và Google Cloud (GCP).
- Quản lý các cụm Kubernetes (K8s), tối ưu hóa cấu hình Docker containers, Helm charts và Nginx Ingress.
- Xây dựng và duy trì các đường ống CI/CD tự động bằng GitHub Actions hoặc GitLab CI để triển khai không gián đoạn (Zero-downtime).
- Áp dụng Infrastructure as Code (IaC) toàn diện sử dụng Terraform và Ansible.
- Triển khai hệ thống giám sát toàn diện (Observability) với Prometheus, Grafana, ELK Stack (Elasticsearch) và Datadog.
- Tăng cường bảo mật hạ tầng mạng, quản lý quyền hạn IAM, tuân thủ tiêu chuẩn OWASP và bảo vệ dữ liệu.
Yêu cầu bắt buộc:
- 3+ năm kinh nghiệm quản trị hệ thống Linux, Docker, Kubernetes và AWS.
- Thành thạo Terraform, Bash script, Python và tự động hóa CI/CD.
- Nắm vững kiến trúc mạng, Nginx, bảo mật đám mây và giám sát hệ thống.`,
    descriptionEn: `Position: DevOps & Cloud Infrastructure Engineer
Company: Nexus Cloud Solutions
Job Description:
- Administer, scale, and automate multi-region cloud infrastructure on AWS and Google Cloud (GCP).
- Manage production Kubernetes (K8s) clusters, optimizing Docker container images, Helm charts, and Nginx Ingress controllers.
- Build and maintain robust CI/CD pipelines using GitHub Actions or GitLab CI for zero-downtime releases.
- Implement comprehensive Infrastructure as Code (IaC) using Terraform and Ansible.
- Deploy full-stack observability with Prometheus, Grafana, ELK Stack (Elasticsearch), and Datadog.
- Enforce network and cloud security best practices, IAM governance, and OWASP compliance.
Key Requirements:
- 3+ years managing Linux environments, Docker, Kubernetes, and AWS infrastructure.
- Proficiency with Terraform, Bash scripting, Python, and CI/CD automation.
- Deep grasp of networking, Nginx, cloud security, and monitoring frameworks.`,
  },
  {
    id: 'ai-software',
    titleVi: 'AI Software Engineer (LLM & Fullstack)',
    titleEn: 'AI Software Engineer (LLM & Fullstack)',
    badge: 'Python • FastAPI • LLM • RAG • React',
    descriptionVi: `Vị trí: AI Software Engineer / LLM Application Developer
Công ty: OpenAI / Cognition Labs Partner
Mô tả công việc:
- Xây dựng các ứng dụng AI thế hệ mới kết hợp mô hình ngôn ngữ lớn (LLM: OpenAI GPT, Claude, Gemini) vào quy trình doanh nghiệp.
- Thiết kế hệ thống RAG (Retrieval-Augmented Generation) tiên tiến với Vector Database như Pinecone, Qdrant hoặc pgvector.
- Phát triển backend hiệu năng cao với Python, FastAPI và kết nối framework LangChain / LlamaIndex.
- Xây dựng giao diện tương tác AI mượt mà bằng React, Next.js và Tailwind CSS.
- Đóng gói ứng dụng vào Docker containers, triển khai trên AWS / GCP và cấu hình CI/CD tự động.
- Đo lường và tối ưu hóa độ trễ phản hồi (latency), chi phí token và độ chính xác của phản hồi AI.
Yêu cầu bắt buộc:
- Thành thạo lập trình Python và TypeScript / JavaScript.
- Kinh nghiệm thực chiến với OpenAI API, LangChain, RAG và Vector Database.
- Có hiểu biết vững chắc về FastAPI, Docker, PostgreSQL và kiến trúc RESTful API.`,
    descriptionEn: `Position: AI Software Engineer / LLM Application Developer
Company: NextGen AI Solutions
Job Description:
- Build next-generation generative AI applications integrating Large Language Models (LLM: OpenAI GPT, Claude, Gemini).
- Design and optimize production RAG (Retrieval-Augmented Generation) architectures utilizing Vector Databases (Pinecone, Qdrant, pgvector).
- Develop high-performance backend microservices using Python, FastAPI, and LangChain / LlamaIndex.
- Create responsive, interactive AI frontends with React, Next.js, and Tailwind CSS.
- Containerize services with Docker, deploy to AWS / GCP, and maintain CI/CD pipelines.
- Benchmark and optimize model latency, token economics, and response accuracy.
Key Requirements:
- Strong proficiency in Python and TypeScript / JavaScript.
- Hands-on experience with OpenAI API, LangChain, RAG, and Vector Databases.
- Solid background in FastAPI, Docker, PostgreSQL, and RESTful API architecture.`,
  },
];
