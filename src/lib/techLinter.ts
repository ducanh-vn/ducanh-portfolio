import { CVData } from '@/components/CVBuilderClient';
import { CoverLetterData } from '@/lib/coverLetter';
import { TechCategory, TECH_CATEGORY_META } from '@/lib/jdMatcher';

export interface TechDefinition {
  canonical: string; // The official branded capitalization: e.g. "Node.js", "TypeScript", "Tailwind CSS"
  category: TechCategory;
  aliases: string[]; // Variations, lowercased, unpunctuated: e.g. ["nodejs", "node.js", "node js", "node-js"]
  reasonVi: string;
  reasonEn: string;
  isExactRegex?: boolean; // if true, use custom regex instead of word boundary
}

// 120+ Industry Standard Tech Nomenclature Dictionary
export const TECH_STANDARDS_REGISTRY: TechDefinition[] = [
  // --- PROGRAMMING LANGUAGES ---
  {
    canonical: 'JavaScript',
    category: 'languages',
    aliases: ['javascript', 'Javascript', 'JAVASCRIPT', 'java script', 'Java Script'],
    reasonVi: 'Quy chuẩn thương hiệu chính thức: Chữ "J" và "S" viết hoa, viết liền.',
    reasonEn: 'Official brand standard: CamelCase with capital "J" and "S".',
  },
  {
    canonical: 'TypeScript',
    category: 'languages',
    aliases: ['typescript', 'Typescript', 'TYPESCRIPT', 'type script', 'Type Script'],
    reasonVi: 'Quy chuẩn Microsoft: Chữ "T" và "S" viết hoa, viết liền.',
    reasonEn: 'Official Microsoft standard: CamelCase with capital "T" and "S".',
  },
  {
    canonical: 'Python',
    category: 'languages',
    aliases: ['python', 'PYTHON'],
    reasonVi: 'Tên ngôn ngữ viết hoa chữ cái đầu "Python".',
    reasonEn: 'Proper noun: Initial capital "Python".',
  },
  {
    canonical: 'Golang',
    category: 'languages',
    aliases: ['golang', 'GOLANG'],
    reasonVi: 'Tên ngôn ngữ viết hoa chữ cái đầu "Golang".',
    reasonEn: 'Proper noun: Capital "Golang".',
  },
  {
    canonical: 'HTML5',
    category: 'languages',
    aliases: ['html5', 'Html5', 'HTML 5', 'html 5'],
    reasonVi: 'Viết hoa toàn bộ chữ viết tắt "HTML" kèm số phiên bản "5".',
    reasonEn: 'Official W3C standard: Uppercase acronym "HTML5".',
  },
  {
    canonical: 'CSS3',
    category: 'languages',
    aliases: ['css3', 'Css3', 'CSS 3', 'css 3'],
    reasonVi: 'Viết hoa toàn bộ chữ viết tắt "CSS" kèm số phiên bản "3".',
    reasonEn: 'Official W3C standard: Uppercase acronym "CSS3".',
  },
  {
    canonical: 'PHP',
    category: 'languages',
    aliases: ['php', 'Php'],
    reasonVi: 'Viết tắt viết hoa toàn bộ "PHP".',
    reasonEn: 'Standard acronym: All uppercase "PHP".',
  },
  {
    canonical: 'C#',
    category: 'languages',
    aliases: ['csharp', 'c sharp', 'c-sharp', 'C sharp'],
    reasonVi: 'Quy chuẩn ký hiệu ngôn ngữ lập trình Microsoft "C#".',
    reasonEn: 'Official Microsoft notation: "C#".',
  },
  {
    canonical: 'C++',
    category: 'languages',
    aliases: ['cplusplus', 'c plus plus', 'c-plus-plus'],
    reasonVi: 'Quy chuẩn ký hiệu ngôn ngữ lập trình "C++".',
    reasonEn: 'Standard programming notation: "C++".',
  },
  {
    canonical: 'SQL',
    category: 'languages',
    aliases: ['sql', 'Sql'],
    reasonVi: 'Viết tắt ngôn ngữ truy vấn viết hoa toàn bộ "SQL".',
    reasonEn: 'Standard acronym: All uppercase "SQL".',
  },
  {
    canonical: 'Solidity',
    category: 'languages',
    aliases: ['solidity', 'SOLIDITY'],
    reasonVi: 'Ngôn ngữ Smart Contract viết hoa chữ cái đầu "Solidity".',
    reasonEn: 'Proper noun: Initial capital "Solidity".',
  },
  {
    canonical: 'Rust',
    category: 'languages',
    aliases: ['rust', 'RUST'],
    reasonVi: 'Ngôn ngữ lập trình viết hoa chữ cái đầu "Rust".',
    reasonEn: 'Proper noun: Initial capital "Rust".',
  },
  {
    canonical: 'Kotlin',
    category: 'languages',
    aliases: ['kotlin', 'KOTLIN'],
    reasonVi: 'Ngôn ngữ lập trình viết hoa chữ cái đầu "Kotlin".',
    reasonEn: 'Proper noun: Initial capital "Kotlin".',
  },
  {
    canonical: 'Swift',
    category: 'languages',
    aliases: ['swift', 'SWIFT'],
    reasonVi: 'Ngôn ngữ iOS Apple viết hoa chữ cái đầu "Swift".',
    reasonEn: 'Proper noun: Initial capital "Swift".',
  },

  // --- FRONTEND & UI/UX ---
  {
    canonical: 'React',
    category: 'frontend',
    aliases: ['reactjs', 'react.js', 'React.js', 'react js', 'REACT', 'react'],
    reasonVi: 'Thương hiệu chính thức từ Meta: "React" (hoặc "React.js").',
    reasonEn: 'Official Meta standard: "React" or "React.js".',
  },
  {
    canonical: 'Next.js',
    category: 'frontend',
    aliases: ['nextjs', 'next.js', 'Nextjs', 'NextJS', 'NEXTJS', 'next js', 'Next js'],
    reasonVi: 'Thương hiệu chính thức từ Vercel: "Next.js" (có dấu chấm và chữ hoa "N").',
    reasonEn: 'Official Vercel standard: "Next.js" with dot and capital "N".',
  },
  {
    canonical: 'Vue.js',
    category: 'frontend',
    aliases: ['vuejs', 'vue.js', 'Vuejs', 'VueJS', 'vue js', 'VUE'],
    reasonVi: 'Thương hiệu chính thức: "Vue.js" (hoặc "Vue").',
    reasonEn: 'Official project standard: "Vue.js".',
  },
  {
    canonical: 'Angular',
    category: 'frontend',
    aliases: ['angular', 'angularjs', 'angular.js', 'ANGULAR'],
    reasonVi: 'Thương hiệu chính thức từ Google: "Angular" viết hoa chữ "A".',
    reasonEn: 'Official Google standard: Initial capital "Angular".',
  },
  {
    canonical: 'Nuxt.js',
    category: 'frontend',
    aliases: ['nuxtjs', 'nuxt.js', 'Nuxtjs', 'NuxtJS', 'nuxt js'],
    reasonVi: 'Thương hiệu chính thức: "Nuxt.js" có dấu chấm.',
    reasonEn: 'Official standard: "Nuxt.js" with dot.',
  },
  {
    canonical: 'Svelte',
    category: 'frontend',
    aliases: ['svelte', 'sveltejs', 'svelte.js', 'SVELTE'],
    reasonVi: 'Thương hiệu chính thức: "Svelte".',
    reasonEn: 'Official standard: "Svelte".',
  },
  {
    canonical: 'Tailwind CSS',
    category: 'frontend',
    aliases: ['tailwindcss', 'tailwind css', 'Tailwindcss', 'TailwindCSS', 'tailwind', 'Tailwind'],
    reasonVi: 'Thương hiệu đầy đủ chính thức: "Tailwind CSS" có khoảng trắng và CSS viết hoa.',
    reasonEn: 'Official brand standard: "Tailwind CSS" with space and uppercase CSS.',
  },
  {
    canonical: 'Redux',
    category: 'frontend',
    aliases: ['redux', 'REDUX', 'reduxjs', 'redux.js'],
    reasonVi: 'Thư viện State Management viết hoa chữ cái đầu "Redux".',
    reasonEn: 'Proper noun: Initial capital "Redux".',
  },
  {
    canonical: 'Zustand',
    category: 'frontend',
    aliases: ['zustand', 'ZUSTAND'],
    reasonVi: 'Thư viện State Management viết hoa chữ cái đầu "Zustand".',
    reasonEn: 'Proper noun: Initial capital "Zustand".',
  },
  {
    canonical: 'Bootstrap',
    category: 'frontend',
    aliases: ['bootstrap', 'BOOTSTRAP', 'bootstrap 5', 'bootstrap5'],
    reasonVi: 'Framework UI viết hoa chữ cái đầu "Bootstrap".',
    reasonEn: 'Proper noun: Initial capital "Bootstrap".',
  },
  {
    canonical: 'Material UI',
    category: 'frontend',
    aliases: ['material ui', 'material-ui', 'materialui', 'mui', 'MUI'],
    reasonVi: 'Thương hiệu chính thức: "Material UI" hoặc "MUI".',
    reasonEn: 'Official brand standard: "Material UI" or "MUI".',
  },
  {
    canonical: 'Ant Design',
    category: 'frontend',
    aliases: ['ant design', 'ant-design', 'antd', 'AntD', 'Antd'],
    reasonVi: 'Thương hiệu chính thức: "Ant Design" (antd).',
    reasonEn: 'Official standard: "Ant Design".',
  },
  {
    canonical: 'Vite',
    category: 'frontend',
    aliases: ['vite', 'vitejs', 'vite.js', 'VITE'],
    reasonVi: 'Build tool thế hệ mới viết hoa chữ cái đầu "Vite".',
    reasonEn: 'Proper noun: Initial capital "Vite".',
  },
  {
    canonical: 'Webpack',
    category: 'frontend',
    aliases: ['webpack', 'WEBPACK'],
    reasonVi: 'Bundler viết hoa chữ cái đầu "Webpack".',
    reasonEn: 'Proper noun: Initial capital "Webpack".',
  },
  {
    canonical: 'Sass',
    category: 'frontend',
    aliases: ['sass', 'SASS', 'scss', 'SCSS'],
    reasonVi: 'CSS Preprocessor viết chuẩn "Sass" (hoặc định dạng SCSS).',
    reasonEn: 'Official standard: "Sass" (title case).',
  },
  {
    canonical: 'Figma',
    category: 'frontend',
    aliases: ['figma', 'FIGMA'],
    reasonVi: 'Công cụ thiết kế giao diện UI/UX viết hoa chữ cái đầu "Figma".',
    reasonEn: 'Proper noun: Initial capital "Figma".',
  },

  // --- BACKEND & APIS ---
  {
    canonical: 'Node.js',
    category: 'backend',
    aliases: ['nodejs', 'node.js', 'Nodejs', 'NodeJS', 'NODEJS', 'node js', 'Node js'],
    reasonVi: 'Thương hiệu chính thức từ OpenJS Foundation: "Node.js" có dấu chấm giữa "Node" và "js".',
    reasonEn: 'Official OpenJS Foundation standard: "Node.js" with dot.',
  },
  {
    canonical: 'Express.js',
    category: 'backend',
    aliases: ['expressjs', 'express.js', 'Expressjs', 'ExpressJS', 'express js', 'express'],
    reasonVi: 'Framework Node.js phổ biến: "Express.js" (hoặc "Express").',
    reasonEn: 'Standard naming: "Express.js" or "Express".',
  },
  {
    canonical: 'NestJS',
    category: 'backend',
    aliases: ['nestjs', 'nest.js', 'Nestjs', 'Nest js', 'NESTJS'],
    reasonVi: 'Thương hiệu chính thức: "NestJS" viết hoa chữ "Nest" và "JS".',
    reasonEn: 'Official brand standard: "NestJS" with capital "Nest" and "JS".',
  },
  {
    canonical: 'FastAPI',
    category: 'backend',
    aliases: ['fastapi', 'fast api', 'FastApi', 'FASTAPI'],
    reasonVi: 'Thương hiệu chính thức: "FastAPI" viết hoa "Fast" và "API".',
    reasonEn: 'Official standard: "FastAPI" with uppercase "API".',
  },
  {
    canonical: 'Django',
    category: 'backend',
    aliases: ['django', 'DJANGO'],
    reasonVi: 'Framework Python viết hoa chữ cái đầu "Django".',
    reasonEn: 'Proper noun: Initial capital "Django".',
  },
  {
    canonical: 'Spring Boot',
    category: 'backend',
    aliases: ['springboot', 'spring boot', 'SpringBoot', 'SPRING BOOT'],
    reasonVi: 'Thương hiệu chính thức từ VMware: "Spring Boot" có khoảng trắng.',
    reasonEn: 'Official standard: "Spring Boot" with space.',
  },
  {
    canonical: 'ASP.NET Core',
    category: 'backend',
    aliases: ['asp.net core', 'asp.net', 'aspnet', 'aspnet core', 'ASPNET'],
    reasonVi: 'Thương hiệu Microsoft chính thức: "ASP.NET Core".',
    reasonEn: 'Official Microsoft standard: "ASP.NET Core".',
  },
  {
    canonical: 'Laravel',
    category: 'backend',
    aliases: ['laravel', 'LARAVEL'],
    reasonVi: 'Framework PHP viết hoa chữ cái đầu "Laravel".',
    reasonEn: 'Proper noun: Initial capital "Laravel".',
  },
  {
    canonical: 'GraphQL',
    category: 'backend',
    aliases: ['graphql', 'graph-ql', 'Graphql', 'GRAPHQL'],
    reasonVi: 'Thương hiệu chính thức từ Linux Foundation: "GraphQL" với chữ "QL" viết hoa.',
    reasonEn: 'Official brand standard: CamelCase "GraphQL" with uppercase "QL".',
  },
  {
    canonical: 'RESTful API',
    category: 'backend',
    aliases: [
      'restful api',
      'rest api',
      'restful apis',
      'rest apis',
      'restful',
      'Restful API',
      'Rest API',
      'REST API',
    ],
    reasonVi: 'Quy chuẩn thuật ngữ kiến trúc: "RESTful API" hoặc "RESTful APIs".',
    reasonEn: 'Official architectural convention: "RESTful API".',
  },
  {
    canonical: 'gRPC',
    category: 'backend',
    aliases: ['grpc', 'Grpc', 'GRPC'],
    reasonVi: 'Thương hiệu chính thức từ Google: "gRPC" chữ "g" viết thường, "RPC" viết hoa.',
    reasonEn: 'Official Google convention: lowercase "g" followed by uppercase "RPC".',
  },
  {
    canonical: 'WebSockets',
    category: 'backend',
    aliases: ['websocket', 'websockets', 'Websocket', 'web socket', 'Web socket'],
    reasonVi: 'Quy chuẩn giao thức web thời gian thực: "WebSockets" (hoặc "WebSocket").',
    reasonEn: 'Standard protocol naming: "WebSocket" / "WebSockets".',
  },
  {
    canonical: 'Socket.io',
    category: 'backend',
    aliases: ['socketio', 'socket.io', 'SocketIO', 'Socketio', 'socket io'],
    reasonVi: 'Thương hiệu chính thức: "Socket.io" có dấu chấm.',
    reasonEn: 'Official brand standard: "Socket.io" with dot.',
  },

  // --- DATABASES & ORMS ---
  {
    canonical: 'PostgreSQL',
    category: 'databases',
    aliases: ['postgresql', 'postgres', 'Postgresql', 'Postgres', 'POSTGRESQL', 'POSTGRES'],
    reasonVi: 'Thương hiệu chính thức: "PostgreSQL" (hoặc gọi ngắn gọn là "Postgres").',
    reasonEn: 'Official project standard: "PostgreSQL" with capital "SQL".',
  },
  {
    canonical: 'MongoDB',
    category: 'databases',
    aliases: ['mongodb', 'mongo', 'Mongodb', 'Mongo', 'MONGODB', 'MONGO'],
    reasonVi: 'Thương hiệu chính thức: "MongoDB" viết hoa chữ "DB".',
    reasonEn: 'Official brand standard: "MongoDB" with uppercase "DB".',
  },
  {
    canonical: 'MySQL',
    category: 'databases',
    aliases: ['mysql', 'Mysql', 'MYSQL'],
    reasonVi: 'Thương hiệu chính thức từ Oracle: "MySQL" với chữ "SQL" viết hoa.',
    reasonEn: 'Official Oracle brand standard: "MySQL" with uppercase "SQL".',
  },
  {
    canonical: 'Redis',
    category: 'databases',
    aliases: ['redis', 'REDIS'],
    reasonVi: 'Hệ thống In-memory Cache & DB: "Redis" viết hoa chữ "R".',
    reasonEn: 'Proper noun: Initial capital "Redis".',
  },
  {
    canonical: 'SQLite',
    category: 'databases',
    aliases: ['sqlite', 'Sqlite', 'SQLITE'],
    reasonVi: 'Thương hiệu chính thức: "SQLite" viết hoa "SQL" và "Lite".',
    reasonEn: 'Official standard: "SQLite" with uppercase "SQL".',
  },
  {
    canonical: 'Firebase',
    category: 'databases',
    aliases: ['firebase', 'FIREBASE'],
    reasonVi: 'Nền tảng Google Backend-as-a-Service: "Firebase".',
    reasonEn: 'Proper noun: Initial capital "Firebase".',
  },
  {
    canonical: 'Supabase',
    category: 'databases',
    aliases: ['supabase', 'SUPABASE'],
    reasonVi: 'Nền tảng Backend mã nguồn mở: "Supabase".',
    reasonEn: 'Proper noun: Initial capital "Supabase".',
  },
  {
    canonical: 'Prisma',
    category: 'databases',
    aliases: ['prisma', 'prisma orm', 'Prisma orm', 'PRISMA'],
    reasonVi: 'Next-generation ORM: "Prisma" (hoặc "Prisma ORM").',
    reasonEn: 'Official brand: "Prisma" or "Prisma ORM".',
  },
  {
    canonical: 'Drizzle ORM',
    category: 'databases',
    aliases: ['drizzle', 'drizzle orm', 'drizzleorm', 'DrizzleORM', 'Drizzle'],
    reasonVi: 'TypeScript ORM thế hệ mới: "Drizzle ORM" chữ "ORM" viết hoa.',
    reasonEn: 'Official brand: "Drizzle ORM" with uppercase "ORM".',
  },
  {
    canonical: 'TypeORM',
    category: 'databases',
    aliases: ['typeorm', 'type orm', 'Typeorm', 'TYPEORM'],
    reasonVi: 'TypeScript ORM: "TypeORM" chữ "ORM" viết hoa.',
    reasonEn: 'Official brand: "TypeORM" with uppercase "ORM".',
  },
  {
    canonical: 'Elasticsearch',
    category: 'databases',
    aliases: ['elasticsearch', 'elastic search', 'ElasticSearch', 'ELASTICSEARCH'],
    reasonVi: 'Search Engine phân tán: "Elasticsearch" viết liền, chữ "E" viết hoa.',
    reasonEn: 'Official Elastic standard: "Elasticsearch" (single word, title case).',
  },

  // --- DEVOPS, CLOUD & TOOLS ---
  {
    canonical: 'Docker',
    category: 'devops_cloud',
    aliases: ['docker', 'DOCKER'],
    reasonVi: 'Nền tảng Containerization viết hoa chữ cái đầu "Docker".',
    reasonEn: 'Proper noun: Initial capital "Docker".',
  },
  {
    canonical: 'Kubernetes',
    category: 'devops_cloud',
    aliases: ['kubernetes', 'k8s', 'K8s', 'K8S', 'KUBERNETES'],
    reasonVi: 'Hệ thống điều phối container: "Kubernetes" (hoặc viết tắt là "K8s").',
    reasonEn: 'Official standard: "Kubernetes" or "K8s".',
  },
  {
    canonical: 'AWS',
    category: 'devops_cloud',
    aliases: ['aws', 'Aws', 'amazon web services', 'Amazon web services'],
    reasonVi: 'Amazon Web Services: viết tắt chuẩn quốc tế "AWS" (viết hoa toàn bộ).',
    reasonEn: 'Standard acronym: All uppercase "AWS".',
  },
  {
    canonical: 'GCP',
    category: 'devops_cloud',
    aliases: ['gcp', 'Gcp', 'google cloud', 'Google cloud platform'],
    reasonVi: 'Google Cloud Platform: viết tắt chuẩn quốc tế "GCP" (viết hoa toàn bộ).',
    reasonEn: 'Standard acronym: All uppercase "GCP".',
  },
  {
    canonical: 'Microsoft Azure',
    category: 'devops_cloud',
    aliases: ['azure', 'Azure', 'ms azure', 'microsoft azure'],
    reasonVi: 'Nền tảng đám mây Microsoft: "Microsoft Azure" (hoặc "Azure").',
    reasonEn: 'Official brand standard: "Microsoft Azure" or "Azure".',
  },
  {
    canonical: 'CI/CD',
    category: 'devops_cloud',
    aliases: ['ci/cd', 'cicd', 'ci-cd', 'Ci/Cd', 'CI / CD', 'ci / cd'],
    reasonVi: 'Quy chuẩn DevOps quốc tế: "CI/CD" viết hoa toàn bộ và có dấu gạch chéo.',
    reasonEn: 'Industry standard: Uppercase "CI/CD" with slash.',
  },
  {
    canonical: 'GitHub',
    category: 'devops_cloud',
    aliases: ['github', 'Github', 'GITHUB', 'git hub', 'Git hub'],
    reasonVi: 'Thương hiệu chính thức từ Microsoft/GitHub: "GitHub" viết hoa chữ "G" và "H".',
    reasonEn: 'Official brand standard: CamelCase "GitHub" with capital "G" and "H".',
  },
  {
    canonical: 'GitLab',
    category: 'devops_cloud',
    aliases: ['gitlab', 'Gitlab', 'GITLAB', 'git lab'],
    reasonVi: 'Thương hiệu chính thức: "GitLab" viết hoa chữ "G" và "L".',
    reasonEn: 'Official brand standard: CamelCase "GitLab" with capital "G" and "L".',
  },
  {
    canonical: 'Linux',
    category: 'devops_cloud',
    aliases: ['linux', 'LINUX'],
    reasonVi: 'Hệ điều hành mã nguồn mở viết hoa chữ cái đầu "Linux".',
    reasonEn: 'Proper noun: Initial capital "Linux".',
  },
  {
    canonical: 'Ubuntu',
    category: 'devops_cloud',
    aliases: ['ubuntu', 'UBUNTU'],
    reasonVi: 'Bản phân phối Linux: "Ubuntu" viết hoa chữ "U".',
    reasonEn: 'Proper noun: Initial capital "Ubuntu".',
  },
  {
    canonical: 'Nginx',
    category: 'devops_cloud',
    aliases: ['nginx', 'NGINX', 'NginX'],
    reasonVi: 'Web server & Reverse Proxy: "Nginx" (hoặc "NGINX").',
    reasonEn: 'Standard naming: "Nginx" or "NGINX".',
  },
  {
    canonical: 'Vercel',
    category: 'devops_cloud',
    aliases: ['vercel', 'VERCEL'],
    reasonVi: 'Nền tảng Cloud Deployment: "Vercel" viết hoa chữ "V".',
    reasonEn: 'Proper noun: Initial capital "Vercel".',
  },
  {
    canonical: 'Netlify',
    category: 'devops_cloud',
    aliases: ['netlify', 'NETLIFY'],
    reasonVi: 'Nền tảng Cloud Hosting: "Netlify" viết hoa chữ "N".',
    reasonEn: 'Proper noun: Initial capital "Netlify".',
  },
  {
    canonical: 'Postman',
    category: 'devops_cloud',
    aliases: ['postman', 'POSTMAN'],
    reasonVi: 'Công cụ API Testing: "Postman" viết hoa chữ "P".',
    reasonEn: 'Proper noun: Initial capital "Postman".',
  },
  {
    canonical: 'Terraform',
    category: 'devops_cloud',
    aliases: ['terraform', 'TERRAFORM'],
    reasonVi: 'Infrastructure as Code (IaC): "Terraform".',
    reasonEn: 'Proper noun: Initial capital "Terraform".',
  },

  // --- TESTING & QA ---
  {
    canonical: 'Jest',
    category: 'testing_qa',
    aliases: ['jest', 'JEST', 'jestjs'],
    reasonVi: 'Testing Framework viết hoa chữ cái đầu "Jest".',
    reasonEn: 'Proper noun: Initial capital "Jest".',
  },
  {
    canonical: 'Cypress',
    category: 'testing_qa',
    aliases: ['cypress', 'CYPRESS', 'cypress.io'],
    reasonVi: 'E2E Testing Tool viết hoa chữ cái đầu "Cypress".',
    reasonEn: 'Proper noun: Initial capital "Cypress".',
  },
  {
    canonical: 'Playwright',
    category: 'testing_qa',
    aliases: ['playwright', 'PLAYWRIGHT'],
    reasonVi: 'Thư viện tự động hóa trình duyệt Microsoft: "Playwright".',
    reasonEn: 'Proper noun: Initial capital "Playwright".',
  },
  {
    canonical: 'Vitest',
    category: 'testing_qa',
    aliases: ['vitest', 'VITEST'],
    reasonVi: 'Vite-native Unit Testing Framework: "Vitest".',
    reasonEn: 'Proper noun: Initial capital "Vitest".',
  },
  {
    canonical: 'Postman',
    category: 'testing_qa',
    aliases: ['postman'],
    reasonVi: 'Công cụ kiểm thử API: "Postman".',
    reasonEn: 'Proper noun: Initial capital "Postman".',
  },

  // --- ARCHITECTURE, SECURITY & PRACTICES ---
  {
    canonical: 'Clean Code',
    category: 'architecture_practices',
    aliases: ['clean code', 'cleancode', 'clean-code'],
    reasonVi: 'Triết lý lập trình sạch: "Clean Code" viết hoa chữ "C" cả 2 từ.',
    reasonEn: 'Industry standard: Title case "Clean Code".',
  },
  {
    canonical: 'SOLID',
    category: 'architecture_practices',
    aliases: ['solid', 'Solid', 'solid principles', 'Solid principles'],
    reasonVi: '5 nguyên lý thiết kế hướng đối tượng: viết tắt viết hoa toàn bộ "SOLID".',
    reasonEn: 'Standard acronym: All uppercase "SOLID".',
  },
  {
    canonical: 'OOP',
    category: 'architecture_practices',
    aliases: ['oop', 'Oop', 'object oriented programming'],
    reasonVi: 'Lập trình hướng đối tượng: viết tắt viết hoa toàn bộ "OOP".',
    reasonEn: 'Standard acronym: All uppercase "OOP".',
  },
  {
    canonical: 'JWT',
    category: 'architecture_practices',
    aliases: ['jwt', 'Jwt', 'json web token', 'json web tokens'],
    reasonVi: 'JSON Web Token: chuẩn mã hóa xác thực viết hoa toàn bộ "JWT".',
    reasonEn: 'Standard security acronym: All uppercase "JWT".',
  },
  {
    canonical: 'OAuth 2.0',
    category: 'architecture_practices',
    aliases: ['oauth', 'oauth2', 'oauth 2', 'oauth 2.0', 'Oauth', 'Oauth2', 'OAuth2'],
    reasonVi: 'Giao thức ủy quyền bảo mật: "OAuth 2.0" viết hoa chữ "OA" và số "2.0".',
    reasonEn: 'Official security standard: "OAuth 2.0".',
  },
  {
    canonical: 'Microservices',
    category: 'architecture_practices',
    aliases: ['microservices', 'micro-services', 'micro service', 'micro services'],
    reasonVi: 'Kiến trúc dịch vụ phân tán: "Microservices" viết liền, chữ "M" viết hoa.',
    reasonEn: 'Architectural term: Title case "Microservices".',
  },
  {
    canonical: 'Agile / Scrum',
    category: 'architecture_practices',
    aliases: ['agile/scrum', 'agile scrum', 'scrum', 'agile', 'Agile', 'Scrum'],
    reasonVi: 'Mô hình phát triển phần mềm linh hoạt: "Agile" và "Scrum" viết hoa chữ cái đầu.',
    reasonEn: 'Methodology standards: Title case "Agile" & "Scrum".',
  },

  // --- MOBILE & CROSS-PLATFORM ---
  {
    canonical: 'React Native',
    category: 'frontend',
    aliases: ['react native', 'react-native', 'reactnative', 'ReactNative', 'REACT NATIVE'],
    reasonVi: 'Framework di động từ Meta: "React Native" viết hoa cả 2 từ có khoảng trắng.',
    reasonEn: 'Official Meta standard: "React Native" with space.',
  },
  {
    canonical: 'Flutter',
    category: 'frontend',
    aliases: ['flutter', 'FLUTTER'],
    reasonVi: 'UI Toolkit đa nền tảng từ Google: "Flutter" viết hoa chữ "F".',
    reasonEn: 'Proper noun: Initial capital "Flutter".',
  },
  {
    canonical: 'iOS',
    category: 'frontend',
    aliases: ['ios', 'Ios', 'IOS'],
    reasonVi: 'Hệ điều hành di động Apple: "iOS" chữ "i" viết thường, "OS" viết hoa.',
    reasonEn: 'Official Apple brand standard: lowercase "i" and uppercase "OS".',
  },
  {
    canonical: 'Android',
    category: 'frontend',
    aliases: ['android', 'ANDROID'],
    reasonVi: 'Hệ điều hành di động Google: "Android" viết hoa chữ "A".',
    reasonEn: 'Proper noun: Initial capital "Android".',
  },
];

export interface TechLintIssue {
  id: string;
  section: 'skills' | 'timeline' | 'projects' | 'summary' | 'custom' | 'cover_letter';
  sectionTitleVi: string;
  sectionTitleEn: string;
  targetId?: string; // id of item in array
  targetTitle?: string;
  field?: string;
  original: string; // The non-standard text found e.g. "nodejs"
  replacement: string; // The standardized name e.g. "Node.js"
  category: TechCategory;
  contextSnippet: string; // Surrounding text
  reasonVi: string;
  reasonEn: string;
}

export interface LintCVResult {
  totalIssuesCount: number;
  issues: TechLintIssue[];
  categoryStats: Record<TechCategory, number>;
  cleanCv: CVData;
  cleanCoverLetter?: CoverLetterData;
}

// Helper: Escape string for regex
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Automatically collapses accidental repeated suffixes (stuttering)
 * e.g. "Tailwind CSS CSS CSS" -> "Tailwind CSS"
 * e.g. "RESTful API API" -> "RESTful API"
 * e.g. "Drizzle ORM ORM" -> "Drizzle ORM"
 */
export function deStutterTechTerms(text: string): string {
  if (!text) return text;
  return text
    .replace(/\bTailwind(?:\s*CSS)+\b/gi, 'Tailwind CSS')
    .replace(/\bRESTful\s*API(?:\s*API)+\b/gi, 'RESTful API')
    .replace(/\bDrizzle\s*ORM(?:\s*ORM)+\b/gi, 'Drizzle ORM')
    .replace(/\bSpring\s*Boot(?:\s*Boot)+\b/gi, 'Spring Boot')
    .replace(/\bASP\.NET\s*Core(?:\s*Core)+\b/gi, 'ASP.NET Core')
    .replace(/\bNode(?:\.js)+(?:\.js)+\b/gi, 'Node.js')
    .replace(/\bNext(?:\.js)+(?:\.js)+\b/gi, 'Next.js')
    .replace(/\bVue(?:\.js)+(?:\.js)+\b/gi, 'Vue.js')
    .replace(/\bSocket(?:\.io)+(?:\.io)+\b/gi, 'Socket.io');
}

/**
 * Safely replaces a specific tech issue in text, ensuring any accidental repeated suffixes
 * (like "Tailwind CSS CSS CSS") are cleanly collapsed and normalized to the canonical name.
 */
export function safeReplaceTechName(text: string, original: string, replacement: string): string {
  if (!text) return text;

  if (replacement === 'Tailwind CSS') {
    const escaped = escapeRegExp(original);
    const regex = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?:\\s+CSS)*(?=[\\s,;:)/\\]."']|$)`, 'gi');
    return deStutterTechTerms(text.replace(regex, 'Tailwind CSS'));
  }
  if (replacement === 'RESTful API') {
    const escaped = escapeRegExp(original);
    const regex = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?:\\s*(?:ful)?\\s*APIs?)*(?=[\\s,;:)/\\]."']|$)`, 'gi');
    return deStutterTechTerms(text.replace(regex, 'RESTful API'));
  }
  if (replacement === 'Drizzle ORM') {
    const escaped = escapeRegExp(original);
    const regex = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?:\\s+ORM)*(?=[\\s,;:)/\\]."']|$)`, 'gi');
    return deStutterTechTerms(text.replace(regex, 'Drizzle ORM'));
  }
  if (replacement === 'Spring Boot') {
    const escaped = escapeRegExp(original);
    const regex = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?:\\s+Boot)*(?=[\\s,;:)/\\]."']|$)`, 'gi');
    return deStutterTechTerms(text.replace(regex, 'Spring Boot'));
  }
  if (replacement === 'ASP.NET Core') {
    const escaped = escapeRegExp(original);
    const regex = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?:\\s+Core)*(?=[\\s,;:)/\\]."']|$)`, 'gi');
    return deStutterTechTerms(text.replace(regex, 'ASP.NET Core'));
  }

  const escaped = escapeRegExp(original);
  const regex = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?=[\\s,;:)/\\]."']|$)`, 'g');
  return deStutterTechTerms(text.replace(regex, replacement));
}

/**
 * Recursively de-stutters all tech terms across a CVData object
 */
export function sanitizeCVTechStuttering(cv: CVData): CVData {
  if (!cv) return cv;
  const clone: CVData = JSON.parse(JSON.stringify(cv));

  if (clone.summary) clone.summary = deStutterTechTerms(clone.summary);

  if (clone.timeline && Array.isArray(clone.timeline)) {
    clone.timeline = clone.timeline.map((item) => ({
      ...item,
      role: deStutterTechTerms(item.role),
      desc: deStutterTechTerms(item.desc),
    }));
  }

  if (clone.projects && Array.isArray(clone.projects)) {
    clone.projects = clone.projects.map((proj) => ({
      ...proj,
      desc: deStutterTechTerms(proj.desc),
      features: proj.features
        ? proj.features.map((f) => ({
            ...f,
            title: deStutterTechTerms(f.title),
            detail: deStutterTechTerms(f.detail),
          }))
        : proj.features,
    }));
  }

  if (clone.customSections && Array.isArray(clone.customSections)) {
    clone.customSections = clone.customSections.map((sec) => ({
      ...sec,
      content: sec.content ? deStutterTechTerms(sec.content) : sec.content,
      items: sec.items
        ? sec.items.map((it) => ({
            ...it,
            desc: it.desc ? deStutterTechTerms(it.desc) : it.desc,
          }))
        : sec.items,
    }));
  }

  return clone;
}

/**
 * Normalizes all detected technology names in a freeform text string.
 * Uses word boundaries so "React" doesn't change "reaction", but handles symbols like "C#", "C++", "Next.js", "Node.js".
 * Protects existing canonical names via masking so sub-token aliases never corrupt already-standardized terms.
 */
export function lintAndFormatText(text: string): {
  cleanText: string;
  replacements: { original: string; replacement: string; def: TechDefinition }[];
} {
  if (!text) return { cleanText: text, replacements: [] };

  // 1. De-stutter pass for any preexisting corrupted repetitions
  let current = deStutterTechTerms(text);
  const replacements: { original: string; replacement: string; def: TechDefinition }[] = [];

  // 2. Protect existing canonical names (Canonical Masking)
  // Sort canonicals by length descending so longer multi-word canonicals (e.g. "Tailwind CSS") mask before "CSS"
  const maskedTokens: { token: string; value: string }[] = [];
  const sortedCanonicals = [...TECH_STANDARDS_REGISTRY]
    .map((d) => d.canonical)
    .sort((a, b) => b.length - a.length);

  for (const canonical of sortedCanonicals) {
    const escaped = escapeRegExp(canonical);
    const pattern = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}(?=[\\s,;:)/\\]."']|$)`, 'g');
    current = current.replace(pattern, (match) => {
      const token = `\uE000CANONICAL_${maskedTokens.length}\uE001`;
      maskedTokens.push({ token, value: match });
      return token;
    });
  }

  // 3. Build flattened alias rules sorted by length descending (Longest Match First)
  const aliasRules: { alias: string; canonical: string; def: TechDefinition }[] = [];
  for (const def of TECH_STANDARDS_REGISTRY) {
    for (const alias of def.aliases) {
      if (alias === def.canonical) continue;
      aliasRules.push({
        alias,
        canonical: def.canonical,
        def,
      });
    }
  }
  aliasRules.sort((a, b) => b.alias.length - a.alias.length);

  // 4. Match and Replace Aliases
  for (const rule of aliasRules) {
    const escaped = escapeRegExp(rule.alias);
    let lookahead = `(?=[\\s,;:)/\\]."']|$)`;

    // Special negative lookahead for aliases that could prefix their own canonical name or suffix
    if (
      rule.canonical === 'Tailwind CSS' &&
      (rule.alias.toLowerCase() === 'tailwind' || rule.alias.toLowerCase() === 'tailwindcss')
    ) {
      lookahead = `(?!\\s*css\\b)(?=[\\s,;:)/\\]."']|$)`;
    } else if (rule.canonical === 'Drizzle ORM' && rule.alias.toLowerCase() === 'drizzle') {
      lookahead = `(?!\\s*orm\\b)(?=[\\s,;:)/\\]."']|$)`;
    } else if (
      rule.canonical === 'RESTful API' &&
      (rule.alias.toLowerCase() === 'rest' || rule.alias.toLowerCase() === 'restful')
    ) {
      lookahead = `(?!\\s*(?:ful)?\\s*api\\b)(?=[\\s,;:)/\\]."']|$)`;
    } else if (
      rule.canonical.endsWith('.js') &&
      (rule.alias.toLowerCase() === 'vue' ||
        rule.alias.toLowerCase() === 'node' ||
        rule.alias.toLowerCase() === 'next' ||
        rule.alias.toLowerCase() === 'nuxt')
    ) {
      lookahead = `(?!\\s*\\.js\\b)(?=[\\s,;:)/\\]."']|$)`;
    }

    const pattern = new RegExp(`(?<=^|[\\s,;:(/\\["'])${escaped}${lookahead}`, 'g');

    if (pattern.test(current)) {
      replacements.push({
        original: rule.alias,
        replacement: rule.canonical,
        def: rule.def,
      });

      // Replace matched alias with a new masked token of the canonical name so subsequent aliases don't touch it
      current = current.replace(pattern, () => {
        const token = `\uE000CANONICAL_${maskedTokens.length}\uE001`;
        maskedTokens.push({ token, value: rule.canonical });
        return token;
      });
    }
  }

  // 5. Restore all masked tokens
  for (let i = maskedTokens.length - 1; i >= 0; i--) {
    current = current.replace(maskedTokens[i].token, maskedTokens[i].value);
  }

  return { cleanText: current, replacements };
}

/**
 * Normalizes an individual skill tag.
 * e.g. "nodejs" -> "Node.js", "react" -> "React", "Typescript" -> "TypeScript"
 */
export function normalizeSingleSkill(skill: string): {
  normalized: string;
  isChanged: boolean;
  def?: TechDefinition;
} {
  const trimmed = skill.trim();
  if (!trimmed) return { normalized: skill, isChanged: false };

  for (const def of TECH_STANDARDS_REGISTRY) {
    // If it's already canonical, no change
    if (trimmed === def.canonical) {
      return { normalized: def.canonical, isChanged: false, def };
    }

    // Check direct case-insensitive match or alias match
    const lower = trimmed.toLowerCase();
    const matchesAlias = def.aliases.some((a) => a.toLowerCase() === lower);
    const matchesCanonical = def.canonical.toLowerCase() === lower;

    if (matchesAlias || matchesCanonical) {
      return {
        normalized: def.canonical,
        isChanged: trimmed !== def.canonical,
        def,
      };
    }
  }

  return { normalized: skill, isChanged: false };
}

/**
 * Comprehensive Linting function that inspects all areas of CVData
 */
export function lintCVTechnologies(
  cv: CVData,
  coverLetter?: CoverLetterData
): LintCVResult {
  const issues: TechLintIssue[] = [];
  const categoryStats: Record<TechCategory, number> = {
    languages: 0,
    frontend: 0,
    backend: 0,
    databases: 0,
    devops_cloud: 0,
    testing_qa: 0,
    architecture_practices: 0,
    ai_data: 0,
  };

  // Clone CV for producing the clean version
  const cleanCv: CVData = sanitizeCVTechStuttering(JSON.parse(JSON.stringify(cv)));
  const cleanCoverLetter: CoverLetterData | undefined = coverLetter
    ? JSON.parse(JSON.stringify(coverLetter))
    : undefined;

  // 1. Lint Skills Array
  if (cv.skills && Array.isArray(cv.skills)) {
    const nextSkills: string[] = [];
    cv.skills.forEach((skill, index) => {
      const { normalized, isChanged, def } = normalizeSingleSkill(skill);
      nextSkills.push(normalized);

      if (isChanged && def) {
        issues.push({
          id: `issue-skill-${index}-${def.canonical}`,
          section: 'skills',
          sectionTitleVi: 'Kỹ năng chuyên môn',
          sectionTitleEn: 'Technical Skills',
          targetId: `skill-${index}`,
          field: 'skills',
          original: skill,
          replacement: normalized,
          category: def.category,
          contextSnippet: `Thẻ kỹ năng: "${skill}"`,
          reasonVi: def.reasonVi,
          reasonEn: def.reasonEn,
        });
        categoryStats[def.category] = (categoryStats[def.category] || 0) + 1;
      }
    });
    cleanCv.skills = nextSkills;
  }

  // 2. Lint Summary / Bio
  if (cv.summary) {
    const { cleanText, replacements } = lintAndFormatText(cv.summary);
    cleanCv.summary = cleanText;

    replacements.forEach((rep, idx) => {
      issues.push({
        id: `issue-summary-${idx}-${rep.def.canonical}`,
        section: 'summary',
        sectionTitleVi: 'Mục tiêu & Tóm tắt',
        sectionTitleEn: 'Summary & Objectives',
        field: 'summary',
        original: rep.original,
        replacement: rep.replacement,
        category: rep.def.category,
        contextSnippet: extractSnippet(cv.summary, rep.original),
        reasonVi: rep.def.reasonVi,
        reasonEn: rep.def.reasonEn,
      });
      categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
    });
  }

  // 3. Lint Work Experience Timeline
  if (cv.timeline && Array.isArray(cv.timeline)) {
    cv.timeline.forEach((item, itemIdx) => {
      // Role field
      if (item.role) {
        const { cleanText, replacements } = lintAndFormatText(item.role);
        cleanCv.timeline[itemIdx].role = cleanText;
        replacements.forEach((rep, rIdx) => {
          issues.push({
            id: `issue-timeline-${item.id}-role-${rIdx}`,
            section: 'timeline',
            sectionTitleVi: 'Kinh nghiệm làm việc',
            sectionTitleEn: 'Work Experience',
            targetId: item.id,
            targetTitle: item.role,
            field: 'role',
            original: rep.original,
            replacement: rep.replacement,
            category: rep.def.category,
            contextSnippet: item.role,
            reasonVi: rep.def.reasonVi,
            reasonEn: rep.def.reasonEn,
          });
          categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
        });
      }

      // Description field
      if (item.desc) {
        const { cleanText, replacements } = lintAndFormatText(item.desc);
        cleanCv.timeline[itemIdx].desc = cleanText;
        replacements.forEach((rep, rIdx) => {
          issues.push({
            id: `issue-timeline-${item.id}-desc-${rIdx}`,
            section: 'timeline',
            sectionTitleVi: 'Kinh nghiệm làm việc',
            sectionTitleEn: 'Work Experience',
            targetId: item.id,
            targetTitle: item.role,
            field: 'desc',
            original: rep.original,
            replacement: rep.replacement,
            category: rep.def.category,
            contextSnippet: extractSnippet(item.desc, rep.original),
            reasonVi: rep.def.reasonVi,
            reasonEn: rep.def.reasonEn,
          });
          categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
        });
      }
    });
  }

  // 4. Lint Featured Projects
  if (cv.projects && Array.isArray(cv.projects)) {
    cv.projects.forEach((proj, projIdx) => {
      // Project Badges (tech stack tags)
      if (proj.badges && Array.isArray(proj.badges)) {
        const nextBadges: string[] = [];
        proj.badges.forEach((badge, bIdx) => {
          const { normalized, isChanged, def } = normalizeSingleSkill(badge);
          nextBadges.push(normalized);
          if (isChanged && def) {
            issues.push({
              id: `issue-proj-${proj.id}-badge-${bIdx}`,
              section: 'projects',
              sectionTitleVi: 'Dự án tiêu biểu',
              sectionTitleEn: 'Featured Projects',
              targetId: proj.id,
              targetTitle: proj.title,
              field: 'badges',
              original: badge,
              replacement: normalized,
              category: def.category,
              contextSnippet: `Tag công nghệ dự án: "${badge}"`,
              reasonVi: def.reasonVi,
              reasonEn: def.reasonEn,
            });
            categoryStats[def.category] = (categoryStats[def.category] || 0) + 1;
          }
        });
        cleanCv.projects[projIdx].badges = nextBadges;
      }

      // Project Description
      if (proj.desc) {
        const { cleanText, replacements } = lintAndFormatText(proj.desc);
        cleanCv.projects[projIdx].desc = cleanText;
        replacements.forEach((rep, rIdx) => {
          issues.push({
            id: `issue-proj-${proj.id}-desc-${rIdx}`,
            section: 'projects',
            sectionTitleVi: 'Dự án tiêu biểu',
            sectionTitleEn: 'Featured Projects',
            targetId: proj.id,
            targetTitle: proj.title,
            field: 'desc',
            original: rep.original,
            replacement: rep.replacement,
            category: rep.def.category,
            contextSnippet: extractSnippet(proj.desc, rep.original),
            reasonVi: rep.def.reasonVi,
            reasonEn: rep.def.reasonEn,
          });
          categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
        });
      }

      // Project Features list
      if (proj.features && Array.isArray(proj.features)) {
        proj.features.forEach((feat, fIdx) => {
          if (feat.title) {
            const { cleanText, replacements } = lintAndFormatText(feat.title);
            cleanCv.projects[projIdx].features![fIdx].title = cleanText;
            replacements.forEach((rep, rIdx) => {
              issues.push({
                id: `issue-proj-${proj.id}-feat-title-${fIdx}-${rIdx}`,
                section: 'projects',
                sectionTitleVi: 'Dự án tiêu biểu',
                sectionTitleEn: 'Featured Projects',
                targetId: proj.id,
                targetTitle: proj.title,
                field: 'features',
                original: rep.original,
                replacement: rep.replacement,
                category: rep.def.category,
                contextSnippet: feat.title,
                reasonVi: rep.def.reasonVi,
                reasonEn: rep.def.reasonEn,
              });
              categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
            });
          }

          if (feat.detail) {
            const { cleanText, replacements } = lintAndFormatText(feat.detail);
            cleanCv.projects[projIdx].features![fIdx].detail = cleanText;
            replacements.forEach((rep, rIdx) => {
              issues.push({
                id: `issue-proj-${proj.id}-feat-detail-${fIdx}-${rIdx}`,
                section: 'projects',
                sectionTitleVi: 'Dự án tiêu biểu',
                sectionTitleEn: 'Featured Projects',
                targetId: proj.id,
                targetTitle: proj.title,
                field: 'features',
                original: rep.original,
                replacement: rep.replacement,
                category: rep.def.category,
                contextSnippet: extractSnippet(feat.detail, rep.original),
                reasonVi: rep.def.reasonVi,
                reasonEn: rep.def.reasonEn,
              });
              categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
            });
          }
        });
      }
    });
  }

  // 5. Lint Custom Sections
  if (cv.customSections && Array.isArray(cv.customSections)) {
    cv.customSections.forEach((sec, sIdx) => {
      if (sec.type === 'text' && sec.content) {
        const { cleanText, replacements } = lintAndFormatText(sec.content);
        cleanCv.customSections![sIdx].content = cleanText;
        replacements.forEach((rep, rIdx) => {
          issues.push({
            id: `issue-custom-${sec.id}-content-${rIdx}`,
            section: 'custom',
            sectionTitleVi: sec.title || 'Mục tùy chỉnh',
            sectionTitleEn: sec.titleEn || sec.title || 'Custom Section',
            targetId: sec.id,
            targetTitle: sec.title,
            field: 'content',
            original: rep.original,
            replacement: rep.replacement,
            category: rep.def.category,
            contextSnippet: extractSnippet(sec.content || '', rep.original),
            reasonVi: rep.def.reasonVi,
            reasonEn: rep.def.reasonEn,
          });
          categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
        });
      }

      if (sec.type === 'list' && sec.items && Array.isArray(sec.items)) {
        sec.items.forEach((item, itIdx) => {
          if (item.desc) {
            const { cleanText, replacements } = lintAndFormatText(item.desc);
            cleanCv.customSections![sIdx].items![itIdx].desc = cleanText;
            replacements.forEach((rep, rIdx) => {
              issues.push({
                id: `issue-custom-${sec.id}-item-${item.id}-${rIdx}`,
                section: 'custom',
                sectionTitleVi: sec.title || 'Mục tùy chỉnh',
                sectionTitleEn: sec.titleEn || sec.title || 'Custom Section',
                targetId: item.id,
                targetTitle: item.title,
                field: 'desc',
                original: rep.original,
                replacement: rep.replacement,
                category: rep.def.category,
                contextSnippet: extractSnippet(item.desc || '', rep.original),
                reasonVi: rep.def.reasonVi,
                reasonEn: rep.def.reasonEn,
              });
              categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
            });
          }
        });
      }
    });
  }

  // 6. Lint Cover Letter (if provided)
  if (coverLetter && cleanCoverLetter) {
    const clFields: (keyof CoverLetterData)[] = ['opening', 'body1', 'body2', 'closing'];
    clFields.forEach((field) => {
      const val = coverLetter[field];
      if (typeof val === 'string' && val) {
        const { cleanText, replacements } = lintAndFormatText(val);
        (cleanCoverLetter as any)[field] = cleanText;
        replacements.forEach((rep, rIdx) => {
          issues.push({
            id: `issue-cl-${field}-${rIdx}`,
            section: 'cover_letter',
            sectionTitleVi: 'Thư xin việc',
            sectionTitleEn: 'Cover Letter',
            field,
            original: rep.original,
            replacement: rep.replacement,
            category: rep.def.category,
            contextSnippet: extractSnippet(val, rep.original),
            reasonVi: rep.def.reasonVi,
            reasonEn: rep.def.reasonEn,
          });
          categoryStats[rep.def.category] = (categoryStats[rep.def.category] || 0) + 1;
        });
      }
    });
  }

  // De-duplicate issues with exact same id or location
  const uniqueIssues = issues.filter(
    (issue, index, self) =>
      index === self.findIndex((t) => t.id === issue.id || (t.original === issue.original && t.contextSnippet === issue.contextSnippet && t.targetId === issue.targetId))
  );

  return {
    totalIssuesCount: uniqueIssues.length,
    issues: uniqueIssues,
    categoryStats,
    cleanCv,
    cleanCoverLetter,
  };
}

// Helper: Extract a readable surrounding snippet
function extractSnippet(fullText: string, keyword: string, radius: number = 35): string {
  if (!fullText) return '';
  const idx = fullText.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return fullText.slice(0, 70);

  const start = Math.max(0, idx - radius);
  const end = Math.min(fullText.length, idx + keyword.length + radius);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < fullText.length ? '...' : '';

  return `${prefix}${fullText.slice(start, end).trim()}${suffix}`;
}
