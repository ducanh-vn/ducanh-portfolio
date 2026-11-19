'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Printer,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Phone,
  Globe,
  Sparkles,
  Check,
  FileText,
  User,
  Briefcase,
  Code2,
  GraduationCap,
  FolderGit2,
  Camera,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Type,
  Palette,
  Bold,
  Italic,
  Underline,
  List,
  SlidersHorizontal,
  Eye,
  EyeOff,
  GripVertical,
  LayoutTemplate,
  X,
  Layers,
  CheckCircle2,
  Clock,
  Award,
  Terminal,
  Save,
  Loader2,
  Upload,
  Minimize2,
  Maximize2,
  FileJson,
  FileDown,
  FileUp,
  Copy,
  Database,
  AlertCircle,
  Lightbulb,
  Search,
  Gauge,
  ShieldCheck,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Target,
  Undo2,
  Redo2,
  FileEdit,
  Sliders,
  PlusCircle,
  Globe2,
  BookOpen,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Building,
  RefreshCw,
  QrCode,
  ExternalLink,
  Share2,
  PhoneCall,
  Link as LinkIcon,
  Send,
  Wand2,
  CheckCheck,
  SpellCheck,
  Zap,
} from 'lucide-react';
import {
  exportCVToImage,
  ImageExportFormat,
  ExportResolution,
} from '@/lib/exportImage';
import {
  CVProfile,
  loadProfilesFromStorage,
  saveProfilesToStorage,
  duplicateCVProfile,
  createNewCVProfile,
} from '@/lib/cvProfiles';
import { PortfolioData, ProjectItem, TimelineItem } from '@/lib/data';
import {
  BULLET_CATEGORIES,
  TECH_BULLET_POINTS,
  TechBulletPoint,
} from '@/lib/techBulletPoints';
import { evaluateCVStrength, CVStrengthEvaluation, ChecklistItem } from '@/lib/cvStrength';
import {
  analyzeJDMatch,
  JDMatchResult,
  SAMPLE_JDS,
  SampleJD,
  TECH_CATEGORY_META,
  TechCategory,
  MatchedKeyword,
  MissingKeyword,
} from '@/lib/jdMatcher';
import {
  CustomTechLink,
  TechLinkPlatform,
  PlatformMeta,
  TECH_PLATFORM_META,
  POPULAR_LINK_PRESETS,
  detectLinkPlatform,
  ensureCustomLinks,
  getActiveTechLinks,
  formatLinkDisplay,
} from '@/lib/customTechLinks';
import TechLinkIcon from '@/components/TechLinkIcon';
import { ParsedCVResult, SAMPLE_CV_TEXTS } from '@/lib/cvParser';
import CoverLetterCanvas from '@/components/CoverLetterCanvas';
import {
  CoverLetterData,
  CoverLetterPreset,
  COVER_LETTER_PRESETS,
  createSyncedCoverLetter,
  DEFAULT_COVER_LETTER_VI,
  DEFAULT_COVER_LETTER_EN,
} from '@/lib/coverLetter';
import {
  CVQRConfig,
  QRPosition,
  QRColorMode,
  DEFAULT_QR_CONFIG,
  ensureQRConfig,
  getQRTargetText,
  generateQRDataUrl,
  getDefaultQRLabel,
} from '@/lib/cvQRCode';
import CVQRCodeBlock, { CVQRCodeFooter } from '@/components/CVQRCodeBlock';
import {
  lintCVTechnologies,
  TechLintIssue,
  lintAndFormatText,
  normalizeSingleSkill,
  TECH_STANDARDS_REGISTRY,
  safeReplaceTechName,
  sanitizeCVTechStuttering,
} from '@/lib/techLinter';
import {
  CVTypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
  COMPACT_TYPOGRAPHY_PRESET,
  SPACIOUS_TYPOGRAPHY_PRESET,
} from '@/lib/cvTypography';
import { CVTypographySliders } from '@/components/CVTypographySliders';

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  year: string;
  desc?: string;
}

export type StandardSectionKey = 'summary' | 'experience' | 'projects' | 'skills' | 'education';
export type SectionKey = StandardSectionKey | string;

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  desc?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  titleEn?: string;
  type: 'list' | 'text';
  content?: string;
  items?: CustomSectionItem[];
}

export interface CustomSectionPreset {
  presetId: string;
  icon: any;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  type: 'list' | 'text';
  templateVi: CustomSection;
  templateEn: CustomSection;
}

export const CUSTOM_SECTION_PRESETS: CustomSectionPreset[] = [
  {
    presetId: 'certifications',
    icon: Award,
    labelVi: 'Chứng chỉ & Giải thưởng',
    labelEn: 'Certifications & Awards',
    descVi: 'Chứng chỉ nghề nghiệp, giải thưởng hackathon & học bổng',
    descEn: 'Professional certificates, hackathon prizes & honors',
    type: 'list',
    templateVi: {
      id: '',
      title: 'Chứng chỉ & Giải thưởng',
      titleEn: 'Certifications & Awards',
      type: 'list',
      items: [
        {
          id: 'cert-1',
          title: 'AWS Certified Solutions Architect – Associate',
          subtitle: 'Amazon Web Services (AWS)',
          date: '2024',
          desc: 'Chứng chỉ thiết kế kiến trúc đám mây an toàn, mở rộng và tối ưu chi phí.',
        },
        {
          id: 'cert-2',
          title: 'Giải Nhì – Cuộc thi Sáng tạo Công nghệ Trẻ Bách Khoa',
          subtitle: 'Đại học Bách Khoa Hà Nội',
          date: '2023',
          desc: 'Xây dựng giải pháp web quản lý thông minh với kiến trúc phân tán thời gian thực.',
        },
      ],
    },
    templateEn: {
      id: '',
      title: 'Certifications & Awards',
      titleEn: 'Certifications & Awards',
      type: 'list',
      items: [
        {
          id: 'cert-1',
          title: 'AWS Certified Solutions Architect – Associate',
          subtitle: 'Amazon Web Services (AWS)',
          date: '2024',
          desc: 'Certified in architecting distributed, resilient, and secure cloud systems.',
        },
        {
          id: 'cert-2',
          title: '2nd Place – HUST Student Innovation Hackathon',
          subtitle: 'Hanoi University of Science and Technology',
          date: '2023',
          desc: 'Architected high-concurrency smart management web platform with low latency.',
        },
      ],
    },
  },
  {
    presetId: 'languages',
    icon: Globe,
    labelVi: 'Ngoại ngữ & Trình độ',
    labelEn: 'Languages & Proficiency',
    descVi: 'Tiếng Anh, Tiếng Nhật, Tiếng Trung & điểm chứng chỉ',
    descEn: 'English, Japanese, Chinese & proficiency scores',
    type: 'list',
    templateVi: {
      id: '',
      title: 'Ngoại ngữ & Trình độ',
      titleEn: 'Languages & Proficiency',
      type: 'list',
      items: [
        {
          id: 'lang-1',
          title: 'Tiếng Anh (English)',
          subtitle: 'IELTS 7.5 (Academic)',
          date: '2024',
          desc: 'Giao tiếp lưu loát môi trường quốc tế, đọc viết tài liệu kỹ thuật chuyên sâu.',
        },
        {
          id: 'lang-2',
          title: 'Tiếng Nhật (Japanese)',
          subtitle: 'Trình độ N3 (JLPT)',
          date: '2023',
          desc: 'Giao tiếp công sở hàng ngày và đọc hiểu tài liệu nghiệp vụ cơ bản.',
        },
      ],
    },
    templateEn: {
      id: '',
      title: 'Languages & Proficiency',
      titleEn: 'Languages & Proficiency',
      type: 'list',
      items: [
        {
          id: 'lang-1',
          title: 'English',
          subtitle: 'IELTS 7.5 (Academic)',
          date: '2024',
          desc: 'Fluent in international environments, technical documentation & cross-border collaboration.',
        },
        {
          id: 'lang-2',
          title: 'Japanese',
          subtitle: 'JLPT N3',
          date: '2023',
          desc: 'Daily conversational proficiency and basic business document reading.',
        },
      ],
    },
  },
  {
    presetId: 'activities',
    icon: User,
    labelVi: 'Hoạt động & Tình nguyện',
    labelEn: 'Activities & Leadership',
    descVi: 'Câu lạc bộ, ban cán sự, hoạt động xã hội & cộng đồng',
    descEn: 'Clubs, community leadership & social contributions',
    type: 'list',
    templateVi: {
      id: '',
      title: 'Hoạt động & Tình nguyện',
      titleEn: 'Activities & Leadership',
      type: 'list',
      items: [
        {
          id: 'act-1',
          title: 'Trưởng Ban Kỹ thuật – CLB Lập trình Bách Khoa',
          subtitle: 'HUST Developer Club',
          date: '2022 — 2024',
          desc: 'Tổ chức hơn 12 workshop chuyên đề React/Next.js cho hơn 300 sinh viên công nghệ.',
        },
      ],
    },
    templateEn: {
      id: '',
      title: 'Activities & Leadership',
      titleEn: 'Activities & Leadership',
      type: 'list',
      items: [
        {
          id: 'act-1',
          title: 'Technical Lead – HUST Coding Club',
          subtitle: 'HUST Developer Community',
          date: '2022 — 2024',
          desc: 'Conducted 12+ workshops on modern web stacks (React, Next.js) for 300+ engineering students.',
        },
      ],
    },
  },
  {
    presetId: 'publications',
    icon: BookOpen,
    labelVi: 'Công trình & Nghiên cứu khoa học',
    labelEn: 'Publications & Research',
    descVi: 'Bài báo tạp chí, kỷ yếu hội nghị & nghiên cứu khoa học',
    descEn: 'Research papers, conference proceedings & thesis',
    type: 'list',
    templateVi: {
      id: '',
      title: 'Công trình & Nghiên cứu khoa học',
      titleEn: 'Publications & Research',
      type: 'list',
      items: [
        {
          id: 'pub-1',
          title: 'Tối ưu hóa độ trễ truyền gói tin trong ứng dụng Web thời gian thực',
          subtitle: 'Kỷ yếu Hội nghị Khoa học Trẻ HUST 2024',
          date: '2024',
          desc: 'Đề xuất kiến trúc mạng biên phân tán kết hợp WebSocket và Redis Cluster.',
        },
      ],
    },
    templateEn: {
      id: '',
      title: 'Publications & Research',
      titleEn: 'Publications & Research',
      type: 'list',
      items: [
        {
          id: 'pub-1',
          title: 'Latency Optimization in Distributed Real-Time Web Applications',
          subtitle: 'HUST Young Scientists Conference Proceedings 2024',
          date: '2024',
          desc: 'Proposed distributed edge messaging architecture combining WebSockets with Redis Cluster.',
        },
      ],
    },
  },
  {
    presetId: 'custom_text',
    icon: FileText,
    labelVi: 'Đoạn văn tự do (Custom Text)',
    labelEn: 'Free Text Paragraph',
    descVi: 'Khối văn bản tự do cho phương châm, định hướng hoặc giới thiệu',
    descEn: 'Flexible freeform paragraph for personal philosophy or special notes',
    type: 'text',
    templateVi: {
      id: '',
      title: 'Định hướng & Phương châm',
      titleEn: 'Philosophy & Focus',
      type: 'text',
      content: 'Luôn duy trì tinh thần học hỏi liên tục và viết code với tư duy sản phẩm: tối ưu trải nghiệm người dùng cuối, kiến trúc mã nguồn sạch sẽ, dễ mở rộng và đồng hành phát triển cùng đội ngũ kỹ thuật.',
    },
    templateEn: {
      id: '',
      title: 'Philosophy & Focus',
      titleEn: 'Philosophy & Focus',
      type: 'text',
      content: 'Committed to continuous learning and product-driven engineering: optimizing end-user experiences, writing clean, extensible code, and fostering a collaborative technical team culture.',
    },
  },
];

export interface SectionMetaItem {
  key: SectionKey;
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CV_SECTIONS: SectionMetaItem[] = [
  {
    key: 'summary',
    labelVi: 'Tóm tắt & Mục tiêu',
    labelEn: 'Summary & Objective',
    descVi: 'Mục tiêu sự nghiệp & tổng quan năng lực',
    descEn: 'Career objective & professional overview',
    icon: User,
  },
  {
    key: 'experience',
    labelVi: 'Kinh nghiệm làm việc',
    labelEn: 'Work Experience',
    descVi: 'Lịch sử công tác, dự án & thành tích',
    descEn: 'Timeline of employment & achievements',
    icon: Briefcase,
  },
  {
    key: 'projects',
    labelVi: 'Dự án tiêu biểu',
    labelEn: 'Featured Projects',
    descVi: 'Sản phẩm phần mềm thực chiến đã thực hiện',
    descEn: 'Production software products & repositories',
    icon: FolderGit2,
  },
  {
    key: 'skills',
    labelVi: 'Kỹ năng chuyên môn',
    labelEn: 'Technical Skills',
    descVi: 'Ngôn ngữ, framework & công cụ công nghệ',
    descEn: 'Languages, frameworks, DBs & cloud tools',
    icon: Code2,
  },
  {
    key: 'education',
    labelVi: 'Học vấn & Bằng cấp',
    labelEn: 'Education & Degrees',
    descVi: 'Bằng đại học, chứng chỉ & chuyên ngành',
    descEn: 'University degrees, GPA & technical certificates',
    icon: GraduationCap,
  },
];

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'projects',
  'skills',
  'education',
  'custom_cert',
];

export const DEFAULT_SECTION_VISIBILITY: Record<string, boolean> = {
  summary: true,
  experience: true,
  projects: true,
  skills: true,
  education: true,
  custom_cert: true,
};

export interface CVData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
  avatar: string;
  showAvatar: boolean;
  summary: string;
  skills: string[];
  timeline: TimelineItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  customSections?: CustomSection[];
  customLinks?: CustomTechLink[];
  qrConfig?: CVQRConfig;
}

export type TemplateId =
  | 'rabbit' // Tech Dark Banner & Connected Vertical Timeline
  | 'cascade' // Left Colored Sidebar
  | 'chicken' // Dark Header Banner
  | 'iconic' // Icon Header Badges
  | 'crisp' // Two-Column Clean
  | 'basic' // 1-Column Minimalist ATS
  | 'decker' // Pill Badge Headers
  | 'enfold' // Right Colored Sidebar
  | 'bubbles' // Rounded Card Bubbles
  | 'editorial'; // Editorial Luxury Q-HJV

export type Language = 'vi' | 'en';

export type CVFontFamily =
  | 'inter'
  | 'bevietnam'
  | 'jakarta'
  | 'roboto'
  | 'merriweather'
  | 'jetbrains'
  | 'sans'
  | 'serif'
  | 'mono';

export interface CVFontOption {
  id: CVFontFamily;
  name: string;
  tagVi: string;
  tagEn: string;
  descVi: string;
  descEn: string;
  fontClass: string;
  fontFamilyCss: string;
}

export const CV_FONT_OPTIONS: CVFontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    tagVi: 'Chuẩn Tech & ATS',
    tagEn: 'Tech & ATS Gold',
    descVi: 'Tiêu chuẩn quốc tế cho CV công nghệ & SaaS, nét chữ sắc nét trên A4.',
    descEn: 'Global gold standard for tech resumes & ATS parser readability.',
    fontClass: 'font-inter',
    fontFamilyCss: "'Inter', sans-serif",
  },
  {
    id: 'bevietnam',
    name: 'Be Vietnam Pro',
    tagVi: 'Chuẩn Tiếng Việt 🇻🇳',
    tagEn: 'Vietnamese Native',
    descVi: 'Thiết kế tối ưu dấu thanh tiếng Việt, không xô lệch khoảng cách dòng.',
    descEn: 'Engineered specifically for Vietnamese typography & diacritics.',
    fontClass: 'font-bevietnam',
    fontFamilyCss: "'Be Vietnam Pro', sans-serif",
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    tagVi: 'Startup & Design',
    tagEn: 'Modern & Design',
    descVi: 'Phong cách Geometric hiện đại, rất chuộng cho Product, UI/UX & Frontend.',
    descEn: 'Crisp geometric aesthetic favored by startups and product designers.',
    fontClass: 'font-jakarta',
    fontFamilyCss: "'Plus Jakarta Sans', sans-serif",
  },
  {
    id: 'roboto',
    name: 'Roboto',
    tagVi: 'Quốc tế & Thân thiện',
    tagEn: 'Universal Standard',
    descVi: 'Tiêu chuẩn của Google, trung tính, dễ đọc và tương thích tuyệt đối.',
    descEn: "Google's universal standard, friendly and easy to scan.",
    fontClass: 'font-roboto',
    fontFamilyCss: "'Roboto', sans-serif",
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    tagVi: 'Sang trọng & Serif',
    tagEn: 'Executive & Serif',
    descVi: 'Phông chữ có chân sang trọng, thích hợp cho cấp Quản lý, Tài chính, Tư vấn.',
    descEn: 'Warm editorial serif for leadership, corporate and academic resumes.',
    fontClass: 'font-merriweather',
    fontFamilyCss: "'Merriweather', Georgia, serif",
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    tagVi: 'Lập trình viên (Code)',
    tagEn: 'Developer Mono',
    descVi: 'Phông đơn khoảng cách chuẩn lập trình viên, mang dấu ấn kỹ thuật vững chắc.',
    descEn: 'Iconic developer monospace font with strong technical aesthetic.',
    fontClass: 'font-jetbrains',
    fontFamilyCss: "'JetBrains Mono', monospace",
  },
];

export interface CVSnapshot {
  cv: CVData;
  template: TemplateId;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  fontFamily: CVFontFamily;
  isCompact: boolean;
  typography?: CVTypographyConfig;
  sectionOrder: SectionKey[];
  sectionVisibility: Record<string, boolean>;
}

export const cvTranslations = {
  vi: {
    template: 'Mẫu:',
    changeTemplate: 'Đổi mẫu',
    editForm: 'Chỉnh sửa Form',
    form: 'Form',
    compactOn: 'Vừa khít 1 Trang',
    compactOff: 'Chuẩn 1 Trang A4',
    compactShortOn: '1 Trang',
    compactShortOff: 'Chuẩn A4',
    save: 'Lưu thay đổi',
    saving: 'Đang lưu...',
    download: 'Tải xuống',
    reset: 'Khôi phục mặc định',
    bannerNotice: 'Bấm "Vừa khít 1 Trang" để co gọn vừa vặn bản in • Nhấp trực tiếp vào chữ để sửa.',
    contactInfo: 'Thông tin liên hệ',
    personalInfo: 'Thông tin cá nhân',
    contactShort: 'Liên hệ',
    summary: 'Tóm tắt chuyên môn',
    summaryGoal: 'Mục tiêu & Tóm tắt chuyên môn',
    summaryShort: 'Mục tiêu & Tóm tắt',
    experience: 'Kinh nghiệm làm việc',
    experienceTimeline: 'Kinh nghiệm thực chiến (Timeline)',
    projects: 'Dự án tiêu biểu',
    projectsFeatured: 'Dự án tiêu biểu & Đóng góp',
    skills: 'Kỹ năng & Chuyên môn',
    skillsCore: 'Kỹ năng cốt lõi',
    skillsTech: 'Kỹ năng & Công nghệ',
    skillsShort: 'Kỹ năng',
    skillsAndEdu: 'Kỹ năng & Học vấn',
    education: 'Học vấn & Bằng cấp',
    educationShort: 'Học vấn',
    codeStandards: 'Quy chuẩn & Phong cách code',
    standardsCleanCode: '• Clean Code & SOLID principles',
    standardsMicroservices: '• Microservices & RESTful APIs',
    standardsCicd: '• CI/CD & Automated Testing',
    standardsEnglish: '• Đọc hiểu tài liệu tiếng Anh chuyên ngành',
    addItem: 'Thêm mục',
    addProject: 'Thêm dự án',
    addSkill: '+ Thêm',
    addEducation: 'Thêm',
    liveDemo: 'Xem Demo',
    sourceCode: 'Mã nguồn',
    present: 'HIỆN TẠI',
    langVi: 'Tiếng Việt',
    langEn: 'Tiếng Anh',
    drawerTitle: 'Chỉnh sửa Form CV',
    profileTab: 'Hồ sơ',
    summaryTab: 'Giới thiệu',
    expTab: 'Kinh nghiệm',
    projectsTab: 'Dự án',
    skillsTab: 'Kỹ năng',
    eduTab: 'Học vấn',
    editorialSummary: '01 / Hồ sơ & Định hướng',
    editorialExperience: '02 / Kinh nghiệm & Thực chiến',
    editorialSkills: '03 / Kỹ năng',
    editorialEducation: '04 / Học vấn',
    copyToEn: 'Đồng bộ liên hệ sang bản Tiếng Anh',
    copyToVi: 'Đồng bộ liên hệ sang bản Tiếng Việt',
    galleryTitle: 'Bộ Sưu Tập Giao Diện CV',
    gallerySubtitle: 'Chọn mẫu giao diện ưng ý để làm nổi bật hồ sơ của bạn. Toàn bộ nội dung, kinh nghiệm và dự án được giữ nguyên 100%.',
    filterAll: 'Tất cả mẫu (10)',
    filterPopular: 'Thịnh hành & Phổ biến',
    filterSidebar: 'Có cột màu Sidebar',
    filterAts: 'Chuẩn ATS / 1 Cột',
    filterCreative: 'Sáng tạo & Nghệ thuật',
    inUse: 'Đang sử dụng',
    useTemplate: 'Dùng mẫu này',
    dataTab: 'Sao lưu / JSON',
    dataModalTitle: 'Quản Lý Dữ Liệu CV (Export / Import JSON)',
    dataModalSubtitle: 'Sao lưu toàn bộ hồ sơ CV ra file .json về máy tính, hoặc nạp dữ liệu từ file sao lưu có sẵn.',
    exportTab: 'Xuất file JSON',
    importTab: 'Nhập file JSON',
    exportSectionTitle: 'Xuất dữ liệu (Export JSON)',
    exportSectionDesc: 'Tải dữ liệu CV về máy tính dưới định dạng file .json chuẩn hóa.',
    exportFullBtn: 'Xuất trọn gói song ngữ (.json)',
    exportFullHint: 'Bao gồm cả bản Tiếng Việt, Tiếng Anh & thiết lập giao diện (mẫu, màu, font).',
    exportCurrentBtn: 'Chỉ xuất bản hiện tại',
    exportCurrentHint: 'Chỉ tải nội dung bản đang mở dưới dạng file .json độc lập.',
    copyJsonBtn: 'Sao chép mã JSON',
    importSectionTitle: 'Nhập dữ liệu (Import JSON)',
    importSectionDesc: 'Nạp dữ liệu từ file .json đã lưu trước đó để khôi phục hoặc cập nhật nhanh toàn bộ CV.',
    importDropzone: 'Kéo & thả file .json vào đây hoặc nhấp để chọn file',
    importDropzoneHint: 'Chấp nhận file định dạng .json chuẩn',
    importSuccessMsg: 'Đã nhập dữ liệu CV thành công!',
    importInvalidMsg: 'File JSON không hợp lệ hoặc thiếu thông tin CV.',
    applyImportBtn: 'Áp dụng dữ liệu này',
    cancelImportBtn: 'Hủy bỏ',
    previewTitle: 'Xem trước dữ liệu nhận diện được:',
    previewProfile: 'Hồ sơ',
    previewExp: 'Mục kinh nghiệm',
    previewProjects: 'Dự án',
    previewSkills: 'Kỹ năng',
    previewEdu: 'Học vấn',
    techBtn: 'Gợi ý Tech',
    techBtnFull: 'Gợi ý chuẩn công nghệ',
    techModalTitle: 'Kho Gợi Ý Mô Tả Chuẩn Công Nghệ (Google XYZ)',
    techModalSubtitle: 'Mẫu mô tả công việc & đóng góp kỹ thuật cao cấp theo công thức Action Verb + Tech + Impact (Google XYZ) giúp CV ghi điểm tuyệt đối với nhà tuyển dụng và hệ thống ATS.',
    techFormulaLabel: 'Công thức Google XYZ:',
    techFormulaDesc: 'Accomplished [X] as measured by [Y], by doing [Z] (Đạt được [X], đo lường bằng [Y], thông qua việc thực hiện [Z]).',
    techSearchPlaceholder: 'Tìm theo công nghệ, từ khóa (VD: Next.js, Docker, API, Tối ưu)...',
    techTargetLabel: 'Đang chọn chèn vào:',
    techTargetCopyOnly: 'Chỉ sao chép / Không chèn',
    techInsertBtn: 'Chèn vào CV',
    techInserted: 'Đã chèn!',
    techCopyBtn: 'Sao chép',
    techCopied: 'Đã sao chép!',
    techNoResults: 'Không tìm thấy gợi ý phù hợp với từ khóa.',
    techCardImpact: 'Kết quả định lượng:',
    techCardStack: 'Tech Stack:',
    techBrowseLibrary: 'Mở kho gợi ý',
    techInsertSuggestion: '✨ Gợi ý chuẩn công nghệ',
    techInsertProjectSuggestion: '✨ Gợi ý mô tả dự án',
    techTipBanner: 'Dùng công thức Action Verb + Tech + Kết quả định lượng để hồ sơ nổi bật.',
    strengthBtn: 'Độ hoàn thiện',
    strengthModalTitle: 'Thước Đo Độ Hoàn Thiện Hồ Sơ & Chuẩn ATS',
    strengthModalSubtitle: 'Hệ thống đánh giá tự động dựa trên 14 tiêu chí tuyển dụng và bộ lọc ATS (Applicant Tracking System) chuẩn quốc tế.',
    strengthHeroScore: 'Điểm chuẩn ATS',
    strengthHeroOutOf: 'trên 100 điểm',
    strengthCriteriaPassed: 'tiêu chí đạt chuẩn',
    strengthFilterAll: 'Tất cả tiêu chí',
    strengthFilterPending: 'Cần cải thiện',
    strengthFilterPassed: 'Đã đạt chuẩn',
    strengthAtsTipsTitle: '4 Quy Tắc Vàng Cho Hồ Sơ Vượt Qua Vòng Lọc ATS',
    strengthAtsTip1: '1. Định dạng văn bản số hóa (Selectable text) — Tuyệt đối không dùng ảnh chụp hay file scan.',
    strengthAtsTip2: '2. Tiêu đề mục chuẩn hóa — Dùng các tiêu đề quen thuộc: Kinh nghiệm, Dự án, Kỹ năng, Học vấn.',
    strengthAtsTip3: '3. Định lượng thành tựu — Luôn đi kèm số liệu cụ thể (%, người dùng, thời gian tải trang).',
    strengthAtsTip4: '4. Bố cục trang tinh gọn — Dùng chế độ "Chuẩn 1 trang A4" để tránh trang thứ 2 bị lẻ dòng.',
    strengthFixBtn: 'Hoàn thiện ngay',
    railDesign: 'Giao diện',
    railContent: 'Nội dung',
    railLayout: 'Bố cục',
    railAiAts: 'AI & ATS',
    railData: 'Sao lưu',
    drawerDesignTitle: 'Thiết kế & Giao diện',
    drawerContentTitle: 'Quản lý nội dung Form',
    drawerLayoutTitle: 'Bố cục & Ngôn ngữ',
    drawerAiAtsTitle: 'Trợ lý AI & Chuẩn ATS',
    drawerDataTitle: 'Sao lưu & Quản lý dữ liệu',
    collapseDrawer: 'Thu gọn bảng công cụ',
    expandDrawer: 'Mở rộng bảng công cụ',
    previewFullscreen: 'Xem trước',
    exitPreview: 'Thoát xem trước (ESC)',
    activeTemplateLabel: 'Mẫu đang chọn:',
    changeTemplateBtn: 'Đổi mẫu khác',
    popularTemplates: 'Mẫu giao diện phổ biến',
    colorAccent: 'Bảng màu chủ đạo',
    fontFamilyLabel: 'Kiểu chữ hiển thị',
    avatarLabel: 'Ảnh thẻ đại diện',
    uploadAvatarBtn: 'Tải ảnh thẻ từ máy tính',
    showAvatarToggle: 'Hiển thị ảnh thẻ trên CV',
    wysiwygHint: 'Nhấp trực tiếp vào chữ trên CV để sửa nhanh, hoặc điền form bên dưới.',
    atsScoreCardTitle: 'Thước đo độ hoàn thiện hồ sơ',
    viewAtsChecklist: 'Xem chi tiết 14 tiêu chí ATS',
    aiSuggestionsTitle: 'Gợi ý mô tả chuẩn công nghệ (Google XYZ)',
    openAiModalBtn: '✨ Mở Kho Gợi Ý Chuẩn Công Nghệ',
    quickAtsFixes: 'Tiêu chí cần cải thiện',
    syncContactBtn: 'Đồng bộ thông tin liên hệ',
    jdMatcherTitle: 'Bộ So Khớp Từ Khóa CV với Tin Tuyển Dụng (JD Matcher)',
    jdMatcherSubtitle: 'So khớp tin tuyển dụng thực tế, đo tỷ lệ phủ từ khóa qua bộ lọc ATS và phát hiện các kỹ năng cần bổ sung.',
    jdMatcherDrawerCardTitle: 'So khớp Tin tuyển dụng (JD Matcher)',
    jdMatcherDrawerBtn: 'Phân tích JD chi tiết & Bù từ khóa →',
    jdPastePlaceholder: 'Dán toàn bộ nội dung tin tuyển dụng (Job Description) từ LinkedIn, TopCV, ITviec, VietnamWorks... vào đây...',
    jdSamplePrompt: 'Mẫu JD tham khảo nhanh:',
    jdClearBtn: 'Xóa để dán JD mới',
    jdInputLabel: 'Mô tả công việc (Job Description)',
    jdPasteClipboard: 'Dán từ bộ nhớ tạm',
    jdMatchRate: 'Tỷ lệ khớp với JD',
    jdKeywordsMatched: 'Từ khóa đã có',
    jdKeywordsMissing: 'Từ khóa còn thiếu',
    jdAllFilter: 'Tất cả từ khóa',
    jdMissingFilter: '⚠️ Còn thiếu trong CV',
    jdMatchedFilter: '✅ Đã có trong CV',
    jdAddToSkills: '+ Thêm vào Kỹ năng',
    jdAddedToSkills: '✓ Đã thêm vào Kỹ năng',
    jdCopyKeyword: 'Sao chép',
    jdCopied: 'Đã sao chép!',
    jdEmptyKeywords: 'Chưa phát hiện từ khóa công nghệ nào trong JD này. Hãy thử dán một bản mô tả công việc chi tiết hơn hoặc chọn một mẫu JD bên trên.',
    jdAtsTip: '💡 Mẹo chuẩn ATS: Hãy hướng tới tỷ lệ khớp 75%+ để vượt qua các thuật toán quét từ khóa tự động (Workday, Greenhouse, Taleo) trước khi đến tay HR.',
    techLinksTitle: 'Liên kết cá nhân & Nền tảng Kỹ thuật',
    techLinksSubtitle: 'Thêm LeetCode, Kaggle, GitHub, Portfolio... để nâng cao điểm ATS và uy tín kỹ thuật.',
    addTechLinkBtn: '+ Thêm liên kết mới',
    quickPresetsTitle: 'Thêm nhanh nền tảng phổ biến:',
    linkLabel: 'Nhãn hiển thị',
    linkUrl: 'Đường dẫn URL',
    cvParserTitle: 'Trích xuất CV từ file (CV Parser / PDF & Doc Import)',
    cvParserSubtitle: 'Tự động đọc và bóc tách thông tin từ file PDF, Word (.docx) hoặc dán văn bản để điền sẵn vào CV.',
    cvParserDrawerCardTitle: 'Trích xuất CV từ file (PDF / Word / Text)',
    cvParserDrawerBtn: 'Tải lên CV & Trích xuất tự động →',
    cvParserTabUpload: 'Tải lên File (.pdf, .docx, .txt)',
    cvParserTabPaste: 'Dán Văn bản CV',
    cvParserTabSample: 'Thử Mẫu CV có sẵn',
    cvParserDropzoneText: 'Kéo thả file CV của bạn vào đây hoặc nhấp để duyệt file',
    cvParserDropzoneHint: 'Hỗ trợ PDF (đọc được chữ), Word (.docx), Text (.txt), JSON (tối đa 10MB)',
    cvParserPastePrompt: 'Dán toàn bộ nội dung văn bản CV (từ LinkedIn, TopCV, Word...) vào đây:',
    cvParserParsingStatus: 'Đang phân tích cấu trúc CV...',
    cvParserSuccessBadge: 'Trích xuất thành công',
    cvParserCreateNewProfileBtn: '⭐ Tạo Phiên Bản CV Mới từ file này',
    cvParserApplyCurrentBtn: 'Áp dụng vào Phiên Bản hiện tại',
    cvParserReuploadBtn: '← Tải file khác',
    cvParserPreviewSummary: 'Tổng quan trích xuất',
    coverLetterNavTitle: 'Thư xin việc',
    coverLetterStudioTitle: 'Thư xin việc đồng bộ (Matching Cover Letter)',
    coverLetterStudioSubtitle: 'Trang thư xin việc được định dạng đồng bộ 100% với phông chữ, màu sắc và tiêu đề của mẫu CV đang chọn.',
    clPresetsTitle: 'Mẫu thư theo vị trí ứng tuyển:',
    clRecipientSection: 'Thông tin Người nhận & Doanh nghiệp',
    clBodySection: 'Nội dung Thư xin việc',
    clSyncFromCvBtn: '🔄 Đồng bộ thông tin từ CV',
    clCopyTextBtn: '📋 Sao chép văn bản thư',
    clBackToCvBtn: '← Quay lại chỉnh sửa CV',
    clRecipientName: 'Người nhận / Bộ phận',
    clRecipientRole: 'Chức danh người nhận',
    clCompanyName: 'Tên Doanh nghiệp / Công ty',
    clCompanyAddress: 'Địa chỉ công ty',
    clJobTitle: 'Vị trí ứng tuyển',
    clDate: 'Ngày lập thư',
    clSalutation: 'Lời chào đầu thư',
    clOpening: 'Đoạn 1: Mở đầu & Động lực ứng tuyển',
    clBody1: 'Đoạn 2: Thành tích & Kỹ năng thực chiến',
    clBody2: 'Đoạn 3: Giá trị & Sự phù hợp văn hóa',
    clClosing: 'Đoạn 4: Lời cảm ơn & Đề xuất phỏng vấn',
    clSignOff: 'Lời kết thúc (Sign-off)',
    qrCodeTitle: 'Mã QR Cá Nhân (Dynamic QR Code)',
    qrCodeSubtitle: 'Tự động tạo mã QR quét nhanh trên điện thoại để dẫn tới Portfolio, GitHub, LinkedIn hoặc lưu danh thiếp vCard.',
    qrEnableToggle: 'Bật hiển thị Mã QR trên CV',
    qrTargetTypeLabel: 'Nội dung khi quét mã QR:',
    qrTargetWebsite: 'Website / Portfolio',
    qrTargetLinkedin: 'LinkedIn Profile',
    qrTargetGithub: 'GitHub Profile',
    qrTargetVcard: 'Danh thiếp vCard (Lưu liên hệ)',
    qrTargetCustom: 'Liên kết tùy chỉnh (URL)',
    qrCustomUrlLabel: 'Đường dẫn liên kết tùy chỉnh:',
    qrCustomUrlPlaceholder: 'https://your-portfolio-or-demo.com',
    qrPositionLabel: 'Vị trí hiển thị trên CV:',
    qrPositionHeader: 'Góc tiêu đề / Header',
    qrPositionFooter: 'Chân trang / Footer',
    qrColorModeLabel: 'Màu sắc mã QR:',
    qrColorDark: 'Đen trắng chuẩn',
    qrColorAccent: 'Màu chủ đạo CV',
    qrSizeLabel: 'Kích thước:',
    qrCaptionLabel: 'Dòng chú thích:',
    qrShowCaption: 'Hiện chú thích bên dưới mã',
    qrLivePreview: 'Xem trước mã QR thực tế:',
    qrTargetDestination: 'Đích đến:',
    qrUrlEditLabel: 'Đường dẫn liên kết (URL):',
    qrUrlWebsiteLabel: 'Đường dẫn Portfolio / Website:',
    qrUrlLinkedinLabel: 'Đường dẫn LinkedIn Profile:',
    qrUrlGithubLabel: 'Đường dẫn GitHub Profile:',
    qrUrlCustomLabel: 'Đường dẫn liên kết tùy chỉnh (URL):',
    qrUrlVcardNote: 'Mã vCard tự động trích xuất liên hệ từ CV (Tên, SĐT, Email, Website) để nhà tuyển dụng quét lưu danh bạ 1 chạm.',
    qrUrlCopied: 'Đã sao chép liên kết!',
    qrOpenUrl: 'Mở link',
    qrCopyUrl: 'Sao chép',
    shareBtn: 'Chia sẻ',
    shareModalTitle: 'Trang Web Xem Trực Tuyến Công Khai',
    shareModalSubtitle: 'Tạo đường link xem CV trực tiếp trên trình duyệt web cho nhà tuyển dụng mà không cần tải file hay đăng nhập.',
    shareToggleLabel: 'Bật link xem công khai trực tuyến',
    shareStatusLive: 'Đang công khai — Bất kỳ ai có đường link đều có thể xem CV trực tiếp.',
    shareStatusDisabled: 'Đang tắt — Chỉ bạn mới có thể xem CV trong trình chỉnh sửa.',
    shareUrlLabel: 'Đường dẫn chia sẻ trực tuyến:',
    shareCopyBtn: 'Sao chép link',
    shareCopiedBtn: 'Đã sao chép link!',
    shareOpenBtn: 'Mở trang xem trực tiếp',
    shareQrTitle: 'Mã QR quét xem nhanh trên điện thoại:',
    shareDownloadQrBtn: 'Tải mã QR',
    shareSocialTitle: 'Chia sẻ nhanh 1 chạm:',
    shareViaLinkedin: 'Chia sẻ LinkedIn',
    shareViaEmail: 'Gửi Email nhà tuyển dụng',
    shareViaTwitter: 'Đăng X / Twitter',
    sharePrivacyTitle: 'Tùy chọn hiển thị & Quyền riêng tư:',
    shareIncludeCoverLetter: 'Cho phép xem Thư xin việc (Matching Cover Letter)',
    shareAllowDownload: 'Cho phép nhà tuyển dụng tải PDF / Xuất ảnh sắc nét',
    shareHidePhone: 'Ẩn số điện thoại trên bản công khai (Bảo vệ riêng tư)',
    shareHideLocation: 'Ẩn địa chỉ nơi ở chi tiết',
    shareEmbedTitle: 'Mã nhúng Web (iFrame):',
    publicVerifiedBadge: 'Hồ sơ kỹ thuật số xác thực',
    publicOpenToWork: 'Đang tìm kiếm cơ hội',
    publicContactBtn: 'Liên hệ ứng viên',
    publicDownloadPdf: 'Tải bản PDF',
    publicDownloadImg: 'Tải ảnh sắc nét (300 DPI)',
    publicScanQrBtn: 'Quét xem trên điện thoại',
    publicChangeLayout: 'Đổi giao diện xem',
    publicShareLink: 'Sao chép link',
    publicResumeTab: 'Bản CV (Resume)',
    publicCoverLetterTab: 'Thư xin việc (Cover Letter)',
    techLinterBtn: 'Chuẩn hóa Tech',
    techLinterModalTitle: 'Bộ Chuẩn Hóa Danh Pháp Công Nghệ Tự Động (Tech Linter)',
    techLinterModalSubtitle: 'Tự động quét và sửa các lỗi viết hoa/thường không chuẩn của 120+ công nghệ theo đúng quy chuẩn thương hiệu quốc tế (Node.js, TypeScript, Next.js, GitHub, RESTful API...).',
    techLinterFixAll: '⚡ Chuẩn hóa tất cả 1 chạm',
    techLinterFixSingle: 'Áp dụng',
    techLinterIgnoreSingle: 'Bỏ qua',
    techLinterIssuesFound: 'lỗi danh pháp',
    techLinterCleanBadge: '100% Chuẩn thương hiệu',
    techLinterCleanTitle: 'Danh pháp công nghệ đã hoàn hảo!',
    techLinterCleanDesc: 'Toàn bộ kỹ năng, dự án và kinh nghiệm trong CV đã tuân thủ 100% quy tắc viết hoa thương hiệu quốc tế.',
    techLinterDrawerCardTitle: 'Chuẩn hóa danh pháp công nghệ (Tech Linter)',
    techLinterDrawerBtn: 'Mở Bộ Chuẩn Hóa Danh Pháp →',
    techLinterAutoLintToggle: 'Tự động chuẩn hóa khi lưu',
    techLinterTabIssues: 'Lỗi phát hiện',
    techLinterTabPlayground: 'Thử nghiệm văn bản',
    techLinterPlaygroundPrompt: 'Dán đoạn văn bản hoặc câu mô tả vào đây để chuẩn hóa nhanh:',
    techLinterPlaygroundBtn: 'Chuẩn hóa văn bản ngay',
    techLinterPlaygroundResult: 'Kết quả sau khi chuẩn hóa:',
    techLinterQuickSkillsBtn: '✨ Chuẩn hóa danh pháp toàn bộ Kỹ năng',
    techLinterFilterAll: 'Tất cả vị trí',
    techLinterFilterSkills: 'Thẻ Kỹ năng',
    techLinterFilterTimeline: 'Kinh nghiệm',
    techLinterFilterProjects: 'Dự án',
    techLinterFilterSummary: 'Tóm tắt & Giới thiệu',
    techLinterFilterCoverLetter: 'Thư xin việc',
  },
  en: {
    template: 'Template:',
    changeTemplate: 'Change',
    editForm: 'Edit Form',
    form: 'Form',
    compactOn: 'Fit 1-Page',
    compactOff: 'Standard A4',
    compactShortOn: '1 Page',
    compactShortOff: 'A4 Page',
    save: 'Save Changes',
    saving: 'Saving...',
    download: 'Download PDF',
    reset: 'Reset Default',
    bannerNotice: 'Toggle "Fit 1-Page" to compact layout for print • Click text directly to edit.',
    contactInfo: 'Contact Information',
    personalInfo: 'Personal Info',
    contactShort: 'Contact',
    summary: 'Professional Summary',
    summaryGoal: 'Career Objectives & Summary',
    summaryShort: 'Objectives & Summary',
    experience: 'Work Experience',
    experienceTimeline: 'Work Experience (Timeline)',
    projects: 'Featured Projects',
    projectsFeatured: 'Key Projects & Contributions',
    skills: 'Skills & Expertise',
    skillsCore: 'Core Technical Skills',
    skillsTech: 'Skills & Technologies',
    skillsShort: 'Skills',
    skillsAndEdu: 'Skills & Education',
    education: 'Education & Qualifications',
    educationShort: 'Education',
    codeStandards: 'Engineering Standards & Best Practices',
    standardsCleanCode: '• Clean Code & SOLID principles',
    standardsMicroservices: '• Microservices & RESTful APIs',
    standardsCicd: '• CI/CD & Automated Testing',
    standardsEnglish: '• Proficient in English technical communication',
    addItem: 'Add Item',
    addProject: 'Add Project',
    addSkill: '+ Add',
    addEducation: 'Add',
    liveDemo: 'Live Demo',
    sourceCode: 'Source Code',
    present: 'PRESENT',
    langVi: 'Vietnamese',
    langEn: 'English',
    drawerTitle: 'CV Form Editor',
    profileTab: 'Profile',
    summaryTab: 'Summary',
    expTab: 'Experience',
    projectsTab: 'Projects',
    skillsTab: 'Skills',
    eduTab: 'Education',
    editorialSummary: '01 / Profile & Direction',
    editorialExperience: '02 / Experience & Track Record',
    editorialSkills: '03 / Technical Skills',
    editorialEducation: '04 / Academic Education',
    copyToEn: 'Sync Contact & Links to English CV',
    copyToVi: 'Sync Contact & Links to Vietnamese CV',
    galleryTitle: 'CV Template Gallery',
    gallerySubtitle: 'Choose your preferred layout to make your profile stand out. All content, experience, and projects are preserved 100%.',
    filterAll: 'All Templates (10)',
    filterPopular: 'Trending & Popular',
    filterSidebar: 'Colored Sidebar',
    filterAts: 'ATS-Ready / 1-Col',
    filterCreative: 'Creative & Modern',
    inUse: 'In Use',
    useTemplate: 'Use Template',
    dataTab: 'Backup / JSON',
    dataModalTitle: 'CV Data Management (Export / Import JSON)',
    dataModalSubtitle: 'Backup your entire CV dataset as a .json file to your device, or restore from an existing backup file.',
    exportTab: 'Export JSON',
    importTab: 'Import JSON',
    exportSectionTitle: 'Export Data (Export JSON)',
    exportSectionDesc: 'Download CV dataset to your computer in standardized .json format.',
    exportFullBtn: 'Export Full Bilingual Package (.json)',
    exportFullHint: 'Includes Vietnamese, English & all visual style settings (template, colors, fonts).',
    exportCurrentBtn: 'Export Active Profile Only',
    exportCurrentHint: 'Only exports the currently active language profile as a standalone .json file.',
    copyJsonBtn: 'Copy JSON to Clipboard',
    importSectionTitle: 'Import Data (Import JSON)',
    importSectionDesc: 'Restore CV from a previously exported .json file to quickly update your profile.',
    importDropzone: 'Drag & drop .json file here, or click to browse',
    importDropzoneHint: 'Accepts standard .json files',
    importSuccessMsg: 'CV data imported successfully!',
    importInvalidMsg: 'Invalid JSON file or missing CV structure.',
    applyImportBtn: 'Apply & Load Data',
    cancelImportBtn: 'Cancel',
    previewTitle: 'Detected Data Preview:',
    previewProfile: 'Profile',
    previewExp: 'Experience items',
    previewProjects: 'Projects',
    previewSkills: 'Skills',
    previewEdu: 'Education items',
    techBtn: 'Tech Bullets',
    techBtnFull: 'Tech Bullet Points',
    techModalTitle: 'Tech Resume Bullet Points Library (Google XYZ)',
    techModalSubtitle: 'High-impact engineering bullet points crafted using the Action Verb + Context + Metric formula (Google XYZ) to help your resume beat ATS filters and impress tech hiring managers.',
    techFormulaLabel: 'Google XYZ Formula:',
    techFormulaDesc: 'Accomplished [X] as measured by [Y], by doing [Z] (Action Verb + Tech Stack + Measurable Outcome).',
    techSearchPlaceholder: 'Search by technology or keyword (e.g. Next.js, Docker, API, Optimize)...',
    techTargetLabel: 'Currently targeting:',
    techTargetCopyOnly: 'Copy only / Reference',
    techInsertBtn: 'Insert to CV',
    techInserted: 'Inserted!',
    techCopyBtn: 'Copy',
    techCopied: 'Copied!',
    techNoResults: 'No suggestions found matching your search.',
    techCardImpact: 'Impact Metric:',
    techCardStack: 'Tech Stack:',
    techBrowseLibrary: 'Browse Library',
    techInsertSuggestion: '✨ Insert Tech Bullets',
    techInsertProjectSuggestion: '✨ Insert Project Bullets',
    techTipBanner: 'Use Action Verb + Tech + Impact formulas to stand out.',
    strengthBtn: 'CV Strength',
    strengthModalTitle: 'CV Strength & ATS Checklist',
    strengthModalSubtitle: 'Automated evaluation based on 14 international recruiting benchmarks and ATS (Applicant Tracking System) criteria.',
    strengthHeroScore: 'ATS Score',
    strengthHeroOutOf: 'out of 100 pts',
    strengthCriteriaPassed: 'criteria passed',
    strengthFilterAll: 'All Criteria',
    strengthFilterPending: 'Needs Polish',
    strengthFilterPassed: 'Passed',
    strengthAtsTipsTitle: '4 Golden Rules to Beat ATS Resume Filters',
    strengthAtsTip1: '1. Selectable text formatting — Never upload scanned images or non-selectable text.',
    strengthAtsTip2: '2. Standardized section headers — Use clear titles: Experience, Projects, Skills, Education.',
    strengthAtsTip3: '3. Quantify achievements — Back every role with metrics (%, users, latency, uptime).',
    strengthAtsTip4: '4. Compact page layout — Use "Fit 1-Page" mode to prevent awkward trailing orphan lines.',
    strengthFixBtn: 'Fix Now',
    railDesign: 'Design',
    railContent: 'Content',
    railLayout: 'Layout',
    railAiAts: 'AI & ATS',
    railData: 'Backup',
    drawerDesignTitle: 'Design & Templates',
    drawerContentTitle: 'Form Content Management',
    drawerLayoutTitle: 'Layout & Language',
    drawerAiAtsTitle: 'AI & ATS Assistant',
    drawerDataTitle: 'Backup & Data Management',
    collapseDrawer: 'Collapse panel',
    expandDrawer: 'Expand panel',
    previewFullscreen: 'Preview',
    exitPreview: 'Exit Preview (ESC)',
    activeTemplateLabel: 'Active Template:',
    changeTemplateBtn: 'Change Template',
    popularTemplates: 'Popular Templates',
    colorAccent: 'Accent Color',
    fontFamilyLabel: 'Typography',
    avatarLabel: 'Profile Avatar',
    uploadAvatarBtn: 'Upload Photo from Device',
    showAvatarToggle: 'Show Photo on CV',
    wysiwygHint: 'Click directly on any text on the CV to edit, or use the form tabs below.',
    atsScoreCardTitle: 'CV Strength & ATS Score',
    viewAtsChecklist: 'View 14 ATS Criteria',
    aiSuggestionsTitle: 'Tech Bullet Points (Google XYZ)',
    openAiModalBtn: '✨ Open Tech Suggestions Library',
    quickAtsFixes: 'Pending Improvements',
    syncContactBtn: 'Sync Contact Info between languages',
    jdMatcherTitle: 'Job Description (JD) Keyword Matcher & Gap Analysis',
    jdMatcherSubtitle: 'Benchmark your CV against real job postings, measure ATS keyword match rate, and pinpoint missing technical skills.',
    jdMatcherDrawerCardTitle: 'JD Keyword Matcher',
    jdMatcherDrawerBtn: 'Analyze JD & Fill Keyword Gaps →',
    jdPastePlaceholder: 'Paste the complete job description from LinkedIn, Indeed, Glassdoor, etc., here...',
    jdSamplePrompt: 'Quick Sample JDs:',
    jdClearBtn: 'Clear to paste new JD',
    jdInputLabel: 'Job Description (JD)',
    jdPasteClipboard: 'Paste from clipboard',
    jdMatchRate: 'JD Keyword Match Rate',
    jdKeywordsMatched: 'Matched Keywords',
    jdKeywordsMissing: 'Missing Keywords',
    jdAllFilter: 'All Keywords',
    jdMissingFilter: '⚠️ Missing from CV',
    jdMatchedFilter: '✅ Matched in CV',
    jdAddToSkills: '+ Add to Skills',
    jdAddedToSkills: '✓ Added to Skills',
    jdCopyKeyword: 'Copy',
    jdCopied: 'Copied!',
    jdEmptyKeywords: 'No technical keywords detected in this JD yet. Try pasting a more detailed job description or select a sample JD above.',
    jdAtsTip: '💡 ATS Pro Tip: Aim for a 75%+ match rate to reliably clear automated scanning systems (Workday, Greenhouse, Taleo) before HR review.',
    techLinksTitle: 'Personal & Tech Platform Links',
    techLinksSubtitle: 'Add LeetCode, Kaggle, GitHub, Portfolio... to boost ATS score & technical credibility.',
    addTechLinkBtn: '+ Add New Link',
    quickPresetsTitle: 'Quick add popular platforms:',
    linkLabel: 'Display Label',
    linkUrl: 'URL Link',
    cvParserTitle: 'Extract CV from File (CV Parser / PDF & Doc Import)',
    cvParserSubtitle: 'Automatically parse and extract contact info, skills, experience, and projects from PDF, Word (.docx), or raw text.',
    cvParserDrawerCardTitle: 'Extract CV from File (PDF / Word / Text)',
    cvParserDrawerBtn: 'Upload CV & Auto Extract →',
    cvParserTabUpload: 'Upload File (.pdf, .docx, .txt)',
    cvParserTabPaste: 'Paste CV Text',
    cvParserTabSample: 'Try Sample CVs',
    cvParserDropzoneText: 'Drag & drop your CV file here, or click to browse',
    cvParserDropzoneHint: 'Supports text-based PDF, Word (.docx), Text (.txt), JSON (max 10MB)',
    cvParserPastePrompt: 'Paste complete CV text (from LinkedIn, Word, or plain text) here:',
    cvParserParsingStatus: 'Parsing CV structure & skills...',
    cvParserSuccessBadge: 'Extracted Successfully',
    cvParserCreateNewProfileBtn: '⭐ Create New CV Profile from this file',
    cvParserApplyCurrentBtn: 'Apply to Current Profile',
    cvParserReuploadBtn: '← Upload Another File',
    cvParserPreviewSummary: 'Extraction Summary',
    coverLetterNavTitle: 'Cover Letter',
    coverLetterStudioTitle: 'Matching Cover Letter Studio',
    coverLetterStudioSubtitle: 'Synchronized with your active CV template, typography, and accent colors for a complete, professional application package.',
    clPresetsTitle: 'Cover Letter Presets by Target Role:',
    clRecipientSection: 'Recipient & Company Information',
    clBodySection: 'Cover Letter Body & Paragraphs',
    clSyncFromCvBtn: '🔄 Sync Sender Info from CV',
    clCopyTextBtn: '📋 Copy Letter Text',
    clBackToCvBtn: '← Back to CV Editor',
    clRecipientName: 'Recipient Name / Team',
    clRecipientRole: 'Recipient Title / Role',
    clCompanyName: 'Company / Enterprise Name',
    clCompanyAddress: 'Company Address / Location',
    clJobTitle: 'Target Job Position',
    clDate: 'Date',
    clSalutation: 'Salutation',
    clOpening: 'Paragraph 1: Opening Hook & Motivation',
    clBody1: 'Paragraph 2: Core Experience & Achievements',
    clBody2: 'Paragraph 3: Value Proposition & Culture Fit',
    clClosing: 'Paragraph 4: Appreciation & Call to Action',
    clSignOff: 'Sign-off Phrase',
    qrCodeTitle: 'Personal Dynamic QR Code',
    qrCodeSubtitle: 'Generate a mobile-scannable QR code directing recruiters to your live Portfolio, GitHub, LinkedIn, or saving a vCard contact.',
    qrEnableToggle: 'Show QR Code on CV',
    qrTargetTypeLabel: 'Scan Destination:',
    qrTargetWebsite: 'Website / Portfolio',
    qrTargetLinkedin: 'LinkedIn Profile',
    qrTargetGithub: 'GitHub Profile',
    qrTargetVcard: 'vCard Contact (1-tap save)',
    qrTargetCustom: 'Custom URL Link',
    qrCustomUrlLabel: 'Custom Target Link:',
    qrCustomUrlPlaceholder: 'https://your-portfolio-or-demo.com',
    qrPositionLabel: 'Position on CV:',
    qrPositionHeader: 'Header / Top Area',
    qrPositionFooter: 'Footer / Bottom Area',
    qrColorModeLabel: 'QR Code Color:',
    qrColorDark: 'Classic Dark',
    qrColorAccent: 'CV Accent Color',
    qrSizeLabel: 'QR Size:',
    qrCaptionLabel: 'Caption Text:',
    qrShowCaption: 'Show caption below QR',
    qrLivePreview: 'Live QR Code Preview:',
    qrTargetDestination: 'Encodes:',
    qrUrlEditLabel: 'Target URL Link:',
    qrUrlWebsiteLabel: 'Portfolio / Website URL:',
    qrUrlLinkedinLabel: 'LinkedIn Profile URL:',
    qrUrlGithubLabel: 'GitHub Profile URL:',
    qrUrlCustomLabel: 'Custom Target URL:',
    qrUrlVcardNote: 'vCard automatically encodes your CV contact info (Name, Phone, Email, Website) for 1-tap phone contact saving.',
    qrUrlCopied: 'Link copied to clipboard!',
    qrOpenUrl: 'Open link',
    qrCopyUrl: 'Copy',
    shareBtn: 'Share',
    shareModalTitle: 'Public Shareable Link / Web View',
    shareModalSubtitle: 'Generate a live, responsive web link for recruiters to view your CV directly in any browser without downloading.',
    shareToggleLabel: 'Enable Public Web View Link',
    shareStatusLive: 'Public — Anyone with the link can view your digital CV live.',
    shareStatusDisabled: 'Private — Only accessible in your local CV Studio editor.',
    shareUrlLabel: 'Public Shareable URL:',
    shareCopyBtn: 'Copy Link',
    shareCopiedBtn: 'Link Copied!',
    shareOpenBtn: 'Open Public View',
    shareQrTitle: 'Mobile Scannable QR Code:',
    shareDownloadQrBtn: 'Download QR Image',
    shareSocialTitle: 'Quick 1-Tap Share:',
    shareViaLinkedin: 'Share to LinkedIn',
    shareViaEmail: 'Email to Recruiter',
    shareViaTwitter: 'Share on X / Twitter',
    sharePrivacyTitle: 'Display & Privacy Preferences:',
    shareIncludeCoverLetter: 'Include Matching Cover Letter in public view',
    shareAllowDownload: 'Allow recruiters to download PDF & 300 DPI image',
    shareHidePhone: 'Hide phone number on public view (Privacy mode)',
    shareHideLocation: 'Hide detailed street address',
    shareEmbedTitle: 'Web Embed Code (iFrame):',
    publicVerifiedBadge: 'Verified Digital Profile',
    publicOpenToWork: 'Open to Work',
    publicContactBtn: 'Contact Candidate',
    publicDownloadPdf: 'Download PDF',
    publicDownloadImg: 'Export 300 DPI Image',
    publicScanQrBtn: 'Scan on Mobile',
    publicChangeLayout: 'Switch Layout',
    publicShareLink: 'Copy Link',
    publicResumeTab: 'CV / Resume',
    publicCoverLetterTab: 'Cover Letter',
    techLinterBtn: 'Tech Linter',
    techLinterModalTitle: 'Tech Nomenclature Linter & Auto-Capitalize',
    techLinterModalSubtitle: 'Automatically detects and capitalizes 120+ technologies to official international brand standards (Node.js, TypeScript, Next.js, GitHub, RESTful API...).',
    techLinterFixAll: '⚡ 1-Click Fix All',
    techLinterFixSingle: 'Apply',
    techLinterIgnoreSingle: 'Dismiss',
    techLinterIssuesFound: 'issues detected',
    techLinterCleanBadge: '100% Brand Compliant',
    techLinterCleanTitle: 'Tech Nomenclature is Perfect!',
    techLinterCleanDesc: 'All skills, projects, and work experience across your CV follow 100% official brand capitalization rules.',
    techLinterDrawerCardTitle: 'Tech Nomenclature Linter',
    techLinterDrawerBtn: 'Open Tech Linter Studio →',
    techLinterAutoLintToggle: 'Auto-lint on save',
    techLinterTabIssues: 'Detected Issues',
    techLinterTabPlayground: 'Text Playground',
    techLinterPlaygroundPrompt: 'Paste any text or bullet points here to format on-the-fly:',
    techLinterPlaygroundBtn: 'Format Text Now',
    techLinterPlaygroundResult: 'Standardized Output:',
    techLinterQuickSkillsBtn: '✨ Standardize All Skill Names',
    techLinterFilterAll: 'All Sections',
    techLinterFilterSkills: 'Skill Badges',
    techLinterFilterTimeline: 'Experience',
    techLinterFilterProjects: 'Projects',
    techLinterFilterSummary: 'Summary & Bio',
    techLinterFilterCoverLetter: 'Cover Letter',
  },
};

export const formatPeriod = (period: string, currentLang: Language) => {
  if (!period) return '';
  if (currentLang === 'en') {
    return period.replace(/HIỆN TẠI/g, 'PRESENT').replace(/Hiện tại/gi, 'Present');
  }
  return period.replace(/PRESENT/g, 'HIỆN TẠI').replace(/Present/gi, 'Hiện tại');
};

export interface TemplateDef {
  id: TemplateId;
  name: string;
  category: 'all' | 'popular' | 'sidebar' | 'ats' | 'creative';
  badge: string;
  badgeEn?: string;
  desc: string;
  descEn?: string;
}

export const TEMPLATES_COLLECTION: TemplateDef[] = [
  {
    id: 'rabbit',
    name: 'Rabbit',
    category: 'popular',
    badge: 'Tech Pro • Nổi bật',
    badgeEn: 'Tech Pro • Featured',
    desc: 'Khối tiêu đề đen nhám sang trọng, kết hợp đường timeline kết nối các mốc dự án chuyên nghiệp.',
    descEn: 'Matte dark header banner combined with connected vertical timeline for developers.',
  },
  {
    id: 'cascade',
    name: 'Cascade',
    category: 'sidebar',
    badge: 'Thịnh hành',
    badgeEn: 'Trending',
    desc: 'Cột bên trái màu đậm ấn tượng, cột phải hiển thị kinh nghiệm rõ ràng. Lựa chọn số 1 cho lập trình viên.',
    descEn: 'Distinct left colored sidebar with clear experience flow. #1 choice for software engineers.',
  },
  {
    id: 'chicken',
    name: 'Chicken',
    category: 'popular',
    badge: 'Executive',
    badgeEn: 'Executive',
    desc: 'Banner tối màu sang trọng ở phần đầu trang, kết hợp bố cục 2 cột quản lý cấp cao.',
    descEn: 'Sophisticated dark header banner paired with executive 2-column layout.',
  },
  {
    id: 'iconic',
    name: 'Iconic',
    category: 'popular',
    badge: 'Mới • Đề xuất',
    badgeEn: 'Recommended',
    desc: 'Mỗi phần mở đầu bằng icon nhận diện trực quan (Briefcase, Code, Graduation), bố cục 2 cột sắc nét.',
    descEn: 'Each section marked with prominent icon badge, crisp 2-column layout.',
  },
  {
    id: 'basic',
    name: 'Basic',
    category: 'ats',
    badge: 'Chuẩn ATS 100%',
    badgeEn: '100% ATS Ready',
    desc: 'Bố cục 1 cột kinh điển, không màu mè, tối ưu tuyệt đối cho hệ thống lọc hồ sơ tự động.',
    descEn: 'Classic 1-column layout, distraction-free, optimized for automated screening.',
  },
  {
    id: 'decker',
    name: 'Decker',
    category: 'creative',
    badge: 'Pill Badges',
    badgeEn: 'Pill Badges',
    desc: 'Tiêu đề các phần được đóng khung dạng pill badge bo góc viền màu tươi trẻ, năng động.',
    descEn: 'Distinctive rounded pill badge section headers with vibrant accents.',
  },
  {
    id: 'crisp',
    name: 'Crisp',
    category: 'popular',
    badge: 'Hiện đại',
    badgeEn: 'Modern Light',
    desc: 'Bố cục 2 cột trắng sáng thanh thoát, đường phân cách thanh mảnh, bố cục hài hoà.',
    descEn: 'Clean, light 2-column layout with subtle dividers and airy spacing.',
  },
  {
    id: 'bubbles',
    name: 'Bubbles',
    category: 'creative',
    badge: 'Mới • Đề xuất',
    badgeEn: 'Card Style',
    desc: 'Thiết kế thẻ bo tròn mềm mại (Bubble Cards), phong cách giao diện sản phẩm số thân thiện.',
    descEn: 'Soft rounded card bubbles, friendly digital product design.',
  },
  {
    id: 'enfold',
    name: 'Enfold',
    category: 'sidebar',
    badge: 'Độc đáo',
    badgeEn: 'Distinctive',
    desc: 'Cột màu điểm nhấn đặt bên phải, tạo ấn tượng mới lạ theo phong cách thiết kế châu Âu.',
    descEn: 'Right colored accent column inspired by European design principles.',
  },
  {
    id: 'editorial',
    name: 'Editorial Luxury',
    category: 'creative',
    badge: 'Đặc quyền',
    badgeEn: 'Exclusive',
    desc: 'Phong cách tạp chí nghệ thuật cao cấp, font Serif thanh lịch đồng bộ với Portfolio.',
    descEn: 'High-end editorial magazine aesthetic with elegant serif typography.',
  },
];

export interface CVBuilderClientProps {
  initialPortfolio: PortfolioData;
  isPublicView?: boolean;
}

const CVReadOnlyContext = React.createContext<boolean>(false);

// Inline Editable Text Component with WYSIWYG support
function InlineEditable({
  value,
  onChange,
  className = '',
  placeholder = 'Nhấp để nhập...',
  tag = 'span',
  singleLine = false,
  style,
  readOnly = false,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
  tag?: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
  singleLine?: boolean;
  style?: React.CSSProperties;
  readOnly?: boolean;
}) {
  const isReadOnlyFromContext = React.useContext(CVReadOnlyContext);
  const isReadOnly = readOnly || isReadOnlyFromContext;
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (ref.current && !isFocused) {
      if (ref.current.innerText !== (value ?? '')) {
        ref.current.innerText = value ?? '';
      }
    }
  }, [value, isFocused]);

  const Tag = tag as any;

  if (isReadOnly) {
    return (
      <Tag style={style} className={`${className} cursor-default select-text`}>
        {value ?? ''}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsFocused(true)}
      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(false);
        onChange(e.currentTarget.innerText.trim());
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (singleLine && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={`cv-editable outline-none transition-all rounded px-0.5 -mx-0.5 cursor-text ${
        !singleLine ? 'whitespace-pre-line' : ''
      } ${
        isFocused
          ? 'ring-2 ring-cyan-500 bg-cyan-50/20 text-neutral-950'
          : 'hover:ring-1 hover:ring-cyan-400 hover:ring-dashed hover:bg-neutral-50/60'
      } ${className}`}
      data-placeholder={placeholder}
      title="Nhấp trực tiếp để sửa"
    />
  );
}

function CVSkeletonLoading() {
  return (
    <div className="w-[210mm] min-h-[297mm] bg-white rounded-sm shadow-2xl p-8 space-y-8 animate-pulse flex flex-col justify-between select-none">
      {/* Header Skeleton */}
      <div className="space-y-4 pb-6 border-b border-neutral-200">
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-2/3">
            <div className="w-28 h-4 bg-neutral-200 rounded-md" />
            <div className="w-4/5 h-8 bg-neutral-300 rounded-lg" />
            <div className="w-1/2 h-4 bg-cyan-100 rounded-md" />
            <div className="flex gap-4 pt-2">
              <div className="w-32 h-3 bg-neutral-200 rounded" />
              <div className="w-24 h-3 bg-neutral-200 rounded" />
              <div className="w-28 h-3 bg-neutral-200 rounded" />
            </div>
          </div>
          <div className="w-24 h-24 rounded-2xl bg-neutral-200 border border-neutral-300 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-neutral-300/60" />
          </div>
        </div>
      </div>

      {/* Body Skeleton (2 Columns) */}
      <div className="grid grid-cols-12 gap-8 flex-1">
        {/* Left Column (60%) */}
        <div className="col-span-7 space-y-6">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-neutral-50 space-y-2 border border-neutral-200">
            <div className="w-40 h-4 bg-neutral-300 rounded" />
            <div className="w-full h-3 bg-neutral-200 rounded" />
            <div className="w-5/6 h-3 bg-neutral-200 rounded" />
            <div className="w-4/6 h-3 bg-neutral-200 rounded" />
          </div>

          {/* Timeline Experience */}
          <div className="space-y-4">
            <div className="w-48 h-4 bg-neutral-300 rounded" />
            <div className="relative pl-6 ml-2 border-l-2 border-neutral-200 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative space-y-2">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white" />
                  <div className="flex justify-between">
                    <div className="w-44 h-4 bg-neutral-300 rounded" />
                    <div className="w-24 h-3 bg-neutral-200 rounded" />
                  </div>
                  <div className="w-full h-3 bg-neutral-200 rounded" />
                  <div className="w-4/5 h-3 bg-neutral-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <div className="w-40 h-4 bg-neutral-300 rounded" />
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="w-36 h-4 bg-neutral-300 rounded" />
              <div className="w-full h-3 bg-neutral-200 rounded" />
              <div className="flex gap-1.5 pt-1">
                <div className="w-12 h-4 bg-neutral-200 rounded" />
                <div className="w-14 h-4 bg-neutral-200 rounded" />
                <div className="w-10 h-4 bg-neutral-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="col-span-5 space-y-6">
          {/* Skills Matrix */}
          <div className="space-y-3">
            <div className="w-36 h-4 bg-neutral-300 rounded" />
            <div className="flex flex-wrap gap-2">
              {[16, 20, 14, 24, 18, 16, 22, 14].map((w, idx) => (
                <div key={idx} className="h-6 bg-cyan-50 border border-cyan-100 rounded-lg" style={{ width: `${w * 4}px` }} />
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="w-32 h-4 bg-neutral-300 rounded" />
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="w-44 h-4 bg-neutral-300 rounded" />
              <div className="w-36 h-3 bg-cyan-100 rounded" />
              <div className="w-20 h-3 bg-neutral-200 rounded" />
            </div>
          </div>

          {/* Engineering Practices */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="w-32 h-3.5 bg-neutral-300 rounded" />
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2.5 bg-neutral-200 rounded" />
              <div className="w-4/5 h-2.5 bg-neutral-200 rounded" />
              <div className="w-3/4 h-2.5 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hover controls for items (move, add, delete)
function ItemControls({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  onDelete,
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddBelow: () => void;
  onDelete: () => void;
}) {
  const isReadOnly = React.useContext(CVReadOnlyContext);
  if (isReadOnly) return null;

  return (
    <div className="no-print opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 -top-2 bg-[#1e1e24] border border-neutral-700 text-white rounded-lg p-0.5 flex items-center space-x-1 shadow-xl z-20 scale-90">
      <button
        onClick={onMoveUp}
        disabled={index === 0}
        className="p-1 hover:text-cyan-400 disabled:opacity-25"
        title="Di chuyển lên"
      >
        <ArrowUp className="w-3 h-3" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="p-1 hover:text-cyan-400 disabled:opacity-25"
        title="Di chuyển xuống"
      >
        <ArrowDown className="w-3 h-3" />
      </button>
      <button
        onClick={onAddBelow}
        className="p-1 hover:text-emerald-400"
        title="Thêm mục bên dưới"
      >
        <Plus className="w-3 h-3" />
      </button>
      <button
        onClick={onDelete}
        className="p-1 hover:text-rose-400"
        title="Xóa mục này"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function AvatarBlock({
  avatar,
  name,
  showAvatar,
  shape = 'rounded-2xl',
  size = 'w-24 h-24',
  className = '',
  onTriggerUpload,
}: {
  avatar: string;
  name: string;
  showAvatar: boolean;
  shape?: string;
  size?: string;
  className?: string;
  onTriggerUpload: () => void;
}) {
  const isReadOnly = React.useContext(CVReadOnlyContext);
  if (!showAvatar) return null;

  return (
    <div
      onClick={isReadOnly ? undefined : onTriggerUpload}
      className={`relative group/avatar ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:ring-2 hover:ring-cyan-400 hover:scale-105'} flex-shrink-0 overflow-hidden border-2 transition-all shadow-md ${size} ${shape} ${className}`}
      title={isReadOnly ? name : "Nhấp chuột để tải ảnh thẻ mới từ máy tính"}
    >
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-neutral-100 text-neutral-400 flex flex-col items-center justify-center p-2 text-center">
          <Camera className="w-5 h-5 mb-0.5 text-neutral-400" />
          <span className="text-[8px] font-semibold text-neutral-500 uppercase tracking-tighter">Avatar</span>
        </div>
      )}

      {/* Hover Overlay with Camera Icon */}
      {!isReadOnly && (
        <div className="no-print absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center backdrop-blur-[1px]">
          <Camera className="w-4 h-4 mb-0.5 text-cyan-300 animate-bounce" />
          <span className="text-[9px] font-semibold tracking-wide">Đổi ảnh</span>
        </div>
      )}
    </div>
  );
}

// Reusable Custom Section Renderer for All Templates
interface CustomSectionRendererProps {
  section: CustomSection;
  template: TemplateId;
  activeColor: any;
  lang: 'vi' | 'en';
  isCompact?: boolean;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (content: string) => void;
  onAddItem: (afterIndex?: number) => void;
  onUpdateItem: (itemId: string, field: keyof CustomSectionItem, value: string) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveItem: (index: number, direction: 'up' | 'down') => void;
  onDeleteSection: () => void;
}

function CustomSectionRenderer({
  section,
  template,
  activeColor,
  lang,
  isCompact,
  onUpdateTitle,
  onUpdateContent,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
  onDeleteSection,
}: CustomSectionRendererProps) {
  const isDecker = template === 'decker';
  const isBubbles = template === 'bubbles';
  const isEditorial = template === 'editorial';
  const isRabbit = template === 'rabbit';
  const isReadOnly = React.useContext(CVReadOnlyContext);

  // 1. Bubbles style: wrapped in a rounded-2xl white card bubble
  if (isBubbles) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3 group/custom">
        <div className="flex justify-between items-center pb-1">
          <InlineEditable
            tag="h2"
            value={section.title}
            onChange={onUpdateTitle}
            singleLine
            className="text-xs font-bold uppercase tracking-wider text-neutral-900"
          />
          {!isReadOnly && (
            <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
              {section.type === 'list' && (
                <button
                  onClick={() => onAddItem()}
                  className="text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-cyan-50"
                  title={lang === 'en' ? 'Add item' : 'Thêm dòng'}
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
                </button>
              )}
              <button
                onClick={onDeleteSection}
                className="text-neutral-400 hover:text-rose-500 p-1 rounded hover:bg-rose-50"
                title={lang === 'en' ? 'Delete section' : 'Xóa mục này'}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {section.type === 'text' ? (
          <InlineEditable
            tag="p"
            value={section.content || ''}
            onChange={onUpdateContent}
            className="text-xs text-neutral-700 leading-relaxed text-justify block"
          />
        ) : (
          <div className="space-y-2.5">
            {section.items?.map((item, idx) => (
              <div key={item.id} className="relative group space-y-0.5">
                <ItemControls
                  index={idx}
                  total={section.items?.length || 0}
                  onMoveUp={() => onMoveItem(idx, 'up')}
                  onMoveDown={() => onMoveItem(idx, 'down')}
                  onAddBelow={() => onAddItem(idx)}
                  onDelete={() => onDeleteItem(item.id)}
                />
                <div className="flex justify-between items-baseline text-xs">
                  <InlineEditable
                    tag="span"
                    value={item.title}
                    onChange={(v) => onUpdateItem(item.id, 'title', v)}
                    singleLine
                    className="font-bold text-neutral-900"
                  />
                  <InlineEditable
                    tag="span"
                    value={item.date || ''}
                    onChange={(v) => onUpdateItem(item.id, 'date', v)}
                    singleLine
                    className="font-mono text-[10px] text-neutral-500"
                  />
                </div>
                {item.subtitle && (
                  <InlineEditable
                    tag="p"
                    value={item.subtitle}
                    onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                    singleLine
                    className="text-[11px] text-neutral-600"
                  />
                )}
                {item.desc && (
                  <InlineEditable
                    tag="p"
                    value={item.desc}
                    onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                    className="text-xs text-neutral-600 block text-justify"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Decker style: rounded pill badge header
  if (isDecker) {
    return (
      <div className="space-y-3 group/custom">
        <div className="flex justify-between items-center">
          <div
            className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm"
            style={{ backgroundColor: activeColor.primary }}
          >
            <InlineEditable tag="span" value={section.title} onChange={onUpdateTitle} singleLine />
          </div>
          {!isReadOnly && (
            <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
              {section.type === 'list' && (
                <button
                  onClick={() => onAddItem()}
                  className="text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-0.5 px-2 py-0.5 rounded bg-neutral-100"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
                </button>
              )}
              <button onClick={onDeleteSection} className="text-neutral-400 hover:text-rose-500 p-1">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {section.type === 'text' ? (
          <InlineEditable
            tag="p"
            value={section.content || ''}
            onChange={onUpdateContent}
            className="text-xs text-neutral-700 leading-relaxed text-justify block"
          />
        ) : (
          <div className="space-y-2.5">
            {section.items?.map((item, idx) => (
              <div key={item.id} className="relative group space-y-0.5">
                <ItemControls
                  index={idx}
                  total={section.items?.length || 0}
                  onMoveUp={() => onMoveItem(idx, 'up')}
                  onMoveDown={() => onMoveItem(idx, 'down')}
                  onAddBelow={() => onAddItem(idx)}
                  onDelete={() => onDeleteItem(item.id)}
                />
                <div className="flex justify-between items-baseline text-xs">
                  <InlineEditable
                    tag="span"
                    value={item.title}
                    onChange={(v) => onUpdateItem(item.id, 'title', v)}
                    singleLine
                    className="font-bold text-neutral-900"
                  />
                  <InlineEditable
                    tag="span"
                    value={item.date || ''}
                    onChange={(v) => onUpdateItem(item.id, 'date', v)}
                    singleLine
                    className="font-mono text-[10px] text-neutral-500"
                  />
                </div>
                {item.subtitle && (
                  <InlineEditable
                    tag="p"
                    value={item.subtitle}
                    onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                    singleLine
                    className="text-[11px] text-neutral-600"
                  />
                )}
                {item.desc && (
                  <InlineEditable
                    tag="p"
                    value={item.desc}
                    onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                    className="text-xs text-neutral-600 block text-justify"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Editorial style: serif luxury header
  if (isEditorial) {
    return (
      <div className="space-y-3 group/custom">
        <div className="flex justify-between items-center border-b border-neutral-300 pb-1">
          <InlineEditable
            tag="h2"
            value={section.title}
            onChange={onUpdateTitle}
            singleLine
            className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold"
          />
          {!isReadOnly && (
            <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
              {section.type === 'list' && (
                <button
                  onClick={() => onAddItem()}
                  className="text-[10px] text-neutral-700 hover:text-black font-semibold flex items-center space-x-0.5"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
                </button>
              )}
              <button onClick={onDeleteSection} className="text-neutral-400 hover:text-rose-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {section.type === 'text' ? (
          <InlineEditable
            tag="p"
            value={section.content || ''}
            onChange={onUpdateContent}
            className="text-xs text-neutral-700 italic border-l-2 pl-4 border-neutral-300 block text-justify"
          />
        ) : (
          <div className="space-y-2.5">
            {section.items?.map((item, idx) => (
              <div key={item.id} className="relative group border-l-2 border-neutral-400 pl-3 space-y-0.5">
                <ItemControls
                  index={idx}
                  total={section.items?.length || 0}
                  onMoveUp={() => onMoveItem(idx, 'up')}
                  onMoveDown={() => onMoveItem(idx, 'down')}
                  onAddBelow={() => onAddItem(idx)}
                  onDelete={() => onDeleteItem(item.id)}
                />
                <div className="flex justify-between text-xs">
                  <InlineEditable
                    tag="span"
                    value={item.title}
                    onChange={(v) => onUpdateItem(item.id, 'title', v)}
                    singleLine
                    className="font-bold uppercase text-neutral-900"
                  />
                  <InlineEditable
                    tag="span"
                    value={item.date || ''}
                    onChange={(v) => onUpdateItem(item.id, 'date', v)}
                    singleLine
                    className="font-mono text-[10px] text-neutral-500"
                  />
                </div>
                {item.subtitle && (
                  <InlineEditable
                    tag="p"
                    value={item.subtitle}
                    onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                    singleLine
                    className="text-[11px] text-neutral-600 font-mono"
                  />
                )}
                {item.desc && (
                  <InlineEditable
                    tag="p"
                    value={item.desc}
                    onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                    className="text-xs text-neutral-600 block text-justify"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 4. Default / Rabbit / Basic / Iconic / Crisp / Cascade / Chicken style:
  return (
    <div className={`space-y-2 group/custom ${isRabbit ? 'rounded-xl bg-neutral-50 border border-neutral-200/80 p-3.5 shadow-xs' : ''}`}>
      <div
        className="flex justify-between items-center pb-1 border-b"
        style={{ borderColor: activeColor.border || '#e5e7eb' }}
      >
        <div className="flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5" style={{ color: activeColor.primary }} />
          <InlineEditable
            tag="h2"
            value={section.title}
            onChange={onUpdateTitle}
            singleLine
            className="text-xs font-bold uppercase tracking-wider text-neutral-900"
          />
        </div>
        {!isReadOnly && (
          <div className="no-print flex items-center space-x-1 opacity-0 group-hover/custom:opacity-100 transition-opacity">
            {section.type === 'list' && (
              <button
                onClick={() => onAddItem()}
                className="text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-cyan-50"
                title={lang === 'en' ? 'Add item' : 'Thêm dòng'}
              >
                <Plus className="w-2.5 h-2.5" />
                <span>{lang === 'en' ? 'Add' : 'Thêm'}</span>
              </button>
            )}
            <button
              onClick={onDeleteSection}
              className="text-neutral-400 hover:text-rose-500 p-0.5 rounded hover:bg-rose-50"
              title={lang === 'en' ? 'Delete section' : 'Xóa mục này'}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {section.type === 'text' ? (
        <InlineEditable
          tag="p"
          value={section.content || ''}
          onChange={onUpdateContent}
          className="text-xs text-neutral-700 leading-relaxed text-justify block"
        />
      ) : (
        <div className="space-y-2 pt-0.5">
          {section.items?.map((item, idx) => (
            <div key={item.id} className="relative group space-y-0.5">
              <ItemControls
                index={idx}
                total={section.items?.length || 0}
                onMoveUp={() => onMoveItem(idx, 'up')}
                onMoveDown={() => onMoveItem(idx, 'down')}
                onAddBelow={() => onAddItem(idx)}
                onDelete={() => onDeleteItem(item.id)}
              />
              <div className="flex justify-between items-baseline text-xs">
                <InlineEditable
                  tag="span"
                  value={item.title}
                  onChange={(v) => onUpdateItem(item.id, 'title', v)}
                  singleLine
                  className="font-bold text-neutral-900"
                />
                <InlineEditable
                  tag="span"
                  value={item.date || ''}
                  onChange={(v) => onUpdateItem(item.id, 'date', v)}
                  singleLine
                  className="font-mono text-[10px] text-neutral-500"
                />
              </div>
              {item.subtitle && (
                <InlineEditable
                  tag="p"
                  value={item.subtitle}
                  onChange={(v) => onUpdateItem(item.id, 'subtitle', v)}
                  singleLine
                  className="text-[11px] font-medium text-neutral-600"
                  style={{ color: activeColor.primary }}
                />
              )}
              {item.desc && (
                <InlineEditable
                  tag="p"
                  value={item.desc}
                  onChange={(v) => onUpdateItem(item.id, 'desc', v)}
                  className="text-xs text-neutral-600 block text-justify leading-relaxed"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CVBuilderClient({
  initialPortfolio,
  isPublicView = false,
}: CVBuilderClientProps) {
  // Initial default CV data
  const defaultCVData: CVData = {
    name: initialPortfolio.profile.name || 'Nguyễn Đức Anh',
    role: initialPortfolio.profile.role || 'Frontend & Fullstack Developer',
    email: initialPortfolio.profile.email || 'contact@ducanh.dev',
    phone: '+84 988 123 456',
    location: initialPortfolio.profile.location || 'Hà Nội, Việt Nam',
    github: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
    linkedin: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
    website: 'https://ducanh.dev',
    avatar: initialPortfolio.profile.avatar || '',
    showAvatar: true,
    summary:
      initialPortfolio.profile.bio ||
      'Lập trình viên Fullstack với hơn 2 năm kinh nghiệm thực chiến phát triển các ứng dụng web hiện đại. Thế mạnh cốt lõi gồm TypeScript, React, Next.js, Node.js và kiến trúc RESTful APIs phân tán. Đam mê tối ưu hiệu năng Frontend, trải nghiệm người dùng mượt mà và viết mã nguồn sạch sẽ, dễ bảo trì.',
    skills: [...initialPortfolio.skills],
    timeline: [...initialPortfolio.timeline],
    projects: [...initialPortfolio.projects],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách Khoa Hà Nội (HUST)',
        degree: 'Cử nhân Kỹ thuật Phần mềm / Công nghệ Thông tin',
        year: '2020 — 2024',
        desc: 'Tốt nghiệp loại Giỏi (GPA 3.6/4.0). Tập trung nghiên cứu về kiến trúc ứng dụng web phân tán và tối ưu hiệu năng Frontend.',
      },
    ],
    customSections: [
      {
        id: 'custom_cert',
        title: 'Chứng chỉ & Giải thưởng',
        titleEn: 'Certifications & Awards',
        type: 'list',
        items: [
          {
            id: 'cert-1',
            title: 'AWS Certified Solutions Architect – Associate',
            subtitle: 'Amazon Web Services (AWS)',
            date: '2024',
            desc: 'Chứng chỉ thiết kế kiến trúc đám mây an toàn, mở rộng và tối ưu chi phí.',
          },
          {
            id: 'cert-2',
            title: 'Giải Nhì – Cuộc thi Sáng tạo Công nghệ Trẻ Bách Khoa',
            subtitle: 'Đại học Bách Khoa Hà Nội',
            date: '2023',
            desc: 'Xây dựng giải pháp web quản lý thông minh với kiến trúc phân tán thời gian thực.',
          },
        ],
      },
    ],
    customLinks: [
      {
        id: 'link-gh',
        platform: 'github',
        label: 'github.com/ducanh-vn',
        url: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-in',
        platform: 'linkedin',
        label: 'linkedin.com/in/ducanh-vn',
        url: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-web',
        platform: 'website',
        label: 'ducanh.dev',
        url: 'https://ducanh.dev',
        enabled: true,
      },
      {
        id: 'link-lc',
        platform: 'leetcode',
        label: 'leetcode.com/ducanh',
        url: 'https://leetcode.com/ducanh',
        enabled: true,
      },
    ],
    qrConfig: { ...DEFAULT_QR_CONFIG },
  };

  const defaultEnglishCVData: CVData = {
    name: 'NGUYEN DUC ANH',
    role: 'Frontend & Fullstack Developer',
    email: initialPortfolio.profile.email || 'contact@ducanh.dev',
    phone: '+84 988 123 456',
    location: 'Hanoi, Vietnam',
    github: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
    linkedin: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
    website: 'https://ducanh.dev',
    avatar: initialPortfolio.profile.avatar || '',
    showAvatar: true,
    summary:
      'Passionate Software Engineer specialized in developing modern web applications. Core strengths include TypeScript, React, Next.js, Node.js, and distributed RESTful APIs. Dedicated to frontend performance engineering, fluid user experiences, and maintainable, scalable clean code.',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Tailwind CSS',
      'Docker',
      'RESTful API',
      'Socket.io',
      'Git / GitHub',
      'PostgreSQL',
      'MongoDB',
      'Redux / Zustand',
      'CI/CD Basics',
      'Vite',
      'Linux',
    ],
    timeline: [
      {
        id: '1',
        period: '2024 — PRESENT',
        role: 'Fullstack Web Developer',
        desc: 'Architected and engineered Nha Tro Pro (cloud boarding house management platform with TypeScript, React, and Tailwind) and real-time instant messaging Chat App.',
      },
      {
        id: '2',
        period: '2023 — 2024',
        role: 'Frontend & Backend Engineer',
        desc: 'Developed Fullstack Blog System (39+ commits featuring robust JWT authentication and RESTful APIs), e-commerce applications, and scalable backend microservices.',
      },
    ],
    projects: [
      {
        id: 'nhatropro',
        num: '01',
        title: 'Nha Tro Pro',
        category: 'Highlight Project',
        year: '2024',
        desc: 'Intelligent boarding room management platform featuring intuitive search filters, real-time occupancy monitoring, and optimized UX.',
        badges: ['TypeScript', 'React', 'Tailwind CSS', 'Vite', 'Vercel'],
        liveDemo: 'https://nhatropro-lldr.vercel.app',
        github: 'https://github.com/ducanh-vn/nhatropro',
        features: [
          {
            title: 'Dashboard & Room Management',
            detail: 'Track vacant rooms, tenant contracts, billing statements, and monthly utility readings.',
          },
          {
            title: 'Smart Filter & Location Search',
            detail: 'Instant filtering by geographic area, price range, and amenities with zero latency.',
          },
          {
            title: 'Fully Responsive UI',
            detail: 'Engineered seamless cross-device mobile, tablet, and desktop experiences with Tailwind CSS.',
          },
          {
            title: 'Strict TypeScript Architecture',
            detail: 'Type-safe code structure minimizing runtime errors and enhancing team maintainability.',
          },
        ],
      },
      {
        id: 'chatapp',
        num: '02',
        title: 'Real-time Chat App',
        category: 'Realtime App',
        year: '2024',
        desc: 'High-concurrency instant messaging web app with WebSocket streaming, live presence status, and an elegant conversational interface.',
        badges: ['React.js', 'Socket.io', 'Node.js', 'Vercel'],
        liveDemo: 'https://chat-app-snowy-sigma.vercel.app',
        github: 'https://github.com/ducanh-vn/chat-app',
        features: [
          {
            title: 'Real-time Socket.io Sync',
            detail: 'Instant bi-directional message synchronization across active clients without page reloads.',
          },
          {
            title: 'Live Presence & Typing Indicator',
            detail: 'Shows online/offline status and real-time typing indicators for connected peers.',
          },
          {
            title: 'Minimalist Chat Interface',
            detail: 'Distraction-free messaging layout designed for speed, clarity, and comfort.',
          },
        ],
      },
      {
        id: 'blog',
        num: '03',
        title: 'Fullstack Blog System',
        category: 'Fullstack API',
        year: '39 Commits',
        desc: 'End-to-end blogging platform supporting rich article authoring, secure JWT authentication, role-based access control, and clean RESTful API.',
        badges: ['Node.js', 'Express', 'JavaScript', 'REST API'],
        liveDemo: 'https://github.com/ducanh-vn/fullstack_blog_app',
        github: 'https://github.com/ducanh-vn/fullstack_blog_app',
        features: [
          {
            title: 'Secure Auth & RBAC',
            detail: 'Session tokens and JWT verification for author roles and administrative operations.',
          },
          {
            title: 'Complete Article CRUD',
            detail: 'Authoring, editing, category tagging, and publication lifecycle workflows.',
          },
          {
            title: '39+ Commits Development Log',
            detail: 'Demonstrates consistent code iteration, test coverage, and modular design.',
          },
        ],
      },
      {
        id: 'vanhoa',
        num: '04',
        title: 'Community Hall Manager',
        category: 'Management',
        year: '2026',
        desc: 'Enterprise management portal for community centers, coordinating departmental activities, event schedules, and public equipment inventory.',
        badges: ['TypeScript', 'React', 'Tailwind CSS'],
        liveDemo: 'https://github.com/ducanh-vn/quan-ly-nha-van-hoa',
        github: 'https://github.com/ducanh-vn/quan-ly-nha-van-hoa',
        features: [
          {
            title: 'Event Scheduling & Hall Booking',
            detail: 'Conflict-free community scheduling and automated room reservations.',
          },
          {
            title: 'Facility & Asset Inventory',
            detail: 'Auditing and monitoring of AV systems, seating, lighting, and shared facilities.',
          },
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Hanoi University of Science and Technology (HUST)',
        degree: 'Bachelor of Science in Software Engineering / Information Technology',
        year: '2020 — 2024',
        desc: 'Graduated with High Distinction (GPA 3.6/4.0). Specializing in distributed web architectures and frontend performance engineering.',
      },
    ],
    customSections: [
      {
        id: 'custom_cert',
        title: 'Certifications & Awards',
        titleEn: 'Certifications & Awards',
        type: 'list',
        items: [
          {
            id: 'cert-1',
            title: 'AWS Certified Solutions Architect – Associate',
            subtitle: 'Amazon Web Services (AWS)',
            date: '2024',
            desc: 'Certified in architecting distributed, resilient, and secure cloud systems.',
          },
          {
            id: 'cert-2',
            title: '2nd Place – HUST Student Innovation Hackathon',
            subtitle: 'Hanoi University of Science and Technology',
            date: '2023',
            desc: 'Architected high-concurrency smart management web platform with low latency.',
          },
        ],
      },
    ],
    customLinks: [
      {
        id: 'link-gh',
        platform: 'github',
        label: 'github.com/ducanh-vn',
        url: initialPortfolio.profile.github || 'https://github.com/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-in',
        platform: 'linkedin',
        label: 'linkedin.com/in/ducanh-vn',
        url: initialPortfolio.profile.linkedin || 'https://linkedin.com/in/ducanh-vn',
        enabled: true,
      },
      {
        id: 'link-web',
        platform: 'website',
        label: 'ducanh.dev',
        url: 'https://ducanh.dev',
        enabled: true,
      },
      {
        id: 'link-lc',
        platform: 'leetcode',
        label: 'leetcode.com/ducanh',
        url: 'https://leetcode.com/ducanh',
        enabled: true,
      },
    ],
    qrConfig: { ...DEFAULT_QR_CONFIG },
  };

  // Bilingual State (VI ⟷ EN)
  const [lang, setLang] = useState<Language>('vi');
  const [cvVi, setCvVi] = useState<CVData>(() => sanitizeCVTechStuttering(defaultCVData));
  const [cvEn, setCvEn] = useState<CVData>(() => sanitizeCVTechStuttering(defaultEnglishCVData));
  const [rawCv, setCvState] = useState<CVData>(() => sanitizeCVTechStuttering(defaultCVData));

  // Public Share & Recruiter Mode States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isShareLinkEnabled, setIsShareLinkEnabled] = useState(true);
  const [shareQrDataUrl, setShareQrDataUrl] = useState('');
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isPublicQrModalOpen, setIsPublicQrModalOpen] = useState(false);
  const [privacyHidePhone, setPrivacyHidePhone] = useState(false);
  const [privacyHideLocation, setPrivacyHideLocation] = useState(false);
  const [shareAllowDownload, setShareAllowDownload] = useState(true);
  const [shareIncludeCoverLetter, setShareIncludeCoverLetter] = useState(true);
  const [publicTemplateMenuOpen, setPublicTemplateMenuOpen] = useState(false);
  const [shareOrigin, setShareOrigin] = useState('');
  const shareModalRef = useRef<HTMLDivElement>(null);

  // Memoized CV with privacy masking for public view
  const cv = useMemo(() => {
    if (!isPublicView) return rawCv;
    return {
      ...rawCv,
      phone: privacyHidePhone
        ? (lang === 'en' ? '+84 ••• ••• ••• (Hidden for privacy)' : '+84 ••• ••• ••• (Bảo mật riêng tư)')
        : rawCv.phone,
      location: privacyHideLocation
        ? (lang === 'en' ? 'Vietnam (Relocation available)' : 'Việt Nam')
        : rawCv.location,
    };
  }, [rawCv, isPublicView, privacyHidePhone, privacyHideLocation, lang]);

  // Wrapper for setCv that keeps both active state and corresponding language profile in sync
  const setCv = (updater: CVData | ((prev: CVData) => CVData)) => {
    setCvState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (lang === 'vi') {
        setCvVi(next);
      } else {
        setCvEn(next);
      }
      return next;
    });
  };

  const t = cvTranslations[lang];

  // Language Switcher Handler
  const handleSwitchLanguage = (newLang: Language) => {
    if (newLang === lang) return;
    if (newLang === 'en') {
      setCvVi(rawCv);
      setCvState(cvEn);
      setLang('en');
      if (selectedSampleJdId) {
        const found = SAMPLE_JDS.find((s) => s.id === selectedSampleJdId);
        if (found) setJdInputText(found.descriptionEn);
      }
      setToastMessage('Đã chuyển sang CV Tiếng Anh (English CV)!');
    } else {
      setCvEn(rawCv);
      setCvState(cvVi);
      setLang('vi');
      if (selectedSampleJdId) {
        const found = SAMPLE_JDS.find((s) => s.id === selectedSampleJdId);
        if (found) setJdInputText(found.descriptionVi);
      }
      setToastMessage('Đã chuyển sang CV Tiếng Việt!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLang = () => {
    handleSwitchLanguage(lang === 'vi' ? 'en' : 'vi');
  };

  // Quick sync contact info between language profiles
  const syncContactInfoBetweenLangs = () => {
    if (lang === 'vi') {
      setCvEn((prev) => ({
        ...prev,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        github: cv.github,
        linkedin: cv.linkedin,
        website: cv.website,
        avatar: cv.avatar,
        showAvatar: cv.showAvatar,
        customLinks: cv.customLinks ? [...cv.customLinks] : undefined,
      }));
      setToastMessage('Đã đồng bộ thông tin liên hệ sang bản Tiếng Anh!');
    } else {
      setCvVi((prev) => ({
        ...prev,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        github: cv.github,
        linkedin: cv.linkedin,
        website: cv.website,
        avatar: cv.avatar,
        showAvatar: cv.showAvatar,
        customLinks: cv.customLinks ? [...cv.customLinks] : undefined,
      }));
      setToastMessage('Đã đồng bộ thông tin liên hệ sang bản Tiếng Việt!');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [template, setTemplate] = useState<TemplateId>('rabbit');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'popular' | 'sidebar' | 'ats' | 'creative'>('all');
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'data'>('profile');

  // Matching Cover Letter State
  const [docMode, setDocMode] = useState<'cv' | 'cover_letter'>('cv');
  const [coverLetterVi, setCoverLetterVi] = useState<CoverLetterData>(() =>
    createSyncedCoverLetter('vi', defaultCVData)
  );
  const [coverLetterEn, setCoverLetterEn] = useState<CoverLetterData>(() =>
    createSyncedCoverLetter('en', defaultEnglishCVData)
  );
  const [activeCoverLetterPresetId, setActiveCoverLetterPresetId] = useState<string>('frontend-focus');
  const [isCoverLetterCopied, setIsCoverLetterCopied] = useState<boolean>(false);
  const currentCoverLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;

  // Tech Nomenclature Linter & Auto-Capitalize State
  const [showTechLinterModal, setShowTechLinterModal] = useState(false);
  const [techLinterFilter, setTechLinterFilter] = useState<'all' | 'skills' | 'timeline' | 'projects' | 'summary' | 'custom' | 'cover_letter'>('all');
  const [techLinterCategory, setTechLinterCategory] = useState<string>('all');
  const [techLinterActiveTab, setTechLinterActiveTab] = useState<'issues' | 'playground' | 'registry'>('issues');
  const [techRegistrySearch, setTechRegistrySearch] = useState('');
  const [playgroundInput, setPlaygroundInput] = useState('Em co kinh nghiem su dung nodejs, reactjs, typescript va viet restful apis tren github.');
  const [playgroundOutput, setPlaygroundOutput] = useState('');
  const [playgroundReplacements, setPlaygroundReplacements] = useState<{ original: string; replacement: string; def: any }[]>([]);
  const [autoLintOnSave, setAutoLintOnSave] = useState(true);
  const [ignoredIssueIds, setIgnoredIssueIds] = useState<Set<string>>(new Set());

  // JSON Data Management State (Export & Import)
  const [showDataModal, setShowDataModal] = useState(false);
  const [dataModalTab, setDataModalTab] = useState<'export' | 'import'>('export');
  const [importPreview, setImportPreview] = useState<{
    type: 'full' | 'single';
    data: any;
    meta?: any;
    summary: {
      name?: string;
      role?: string;
      hasVi?: boolean;
      hasEn?: boolean;
      viName?: string;
      enName?: string;
      template?: string;
      timelineCount: number;
      projectsCount: number;
      skillsCount: number;
      eduCount: number;
    };
  } | null>(null);
  const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Tech Bullet Points Library Modal State
  const [showTechModal, setShowTechModal] = useState(false);
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>('all');
  const [techSearchQuery, setTechSearchQuery] = useState('');
  const [techTarget, setTechTarget] = useState<{ type: 'timeline' | 'project'; id: string; title?: string } | null>(null);
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  const [insertedBulletId, setInsertedBulletId] = useState<string | null>(null);

  // CV Strength & ATS Checklist State
  const [showStrengthModal, setShowStrengthModal] = useState(false);
  const [strengthFilter, setStrengthFilter] = useState<'all' | 'pending' | 'passed'>('all');

  // Compute live CV Strength evaluation
  const cvStrength = useMemo(() => evaluateCVStrength(cv, lang), [cv, lang]);

  // JD Matcher & Keyword Gap State
  const [showJDModal, setShowJDModal] = useState(false);
  const [selectedSampleJdId, setSelectedSampleJdId] = useState<string | null>(SAMPLE_JDS[0].id);
  const [jdInputText, setJdInputText] = useState(SAMPLE_JDS[0].descriptionVi);
  const [jdFilter, setJdFilter] = useState<'all' | 'missing' | 'matched'>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [addedSkillKeyword, setAddedSkillKeyword] = useState<string | null>(null);

  // Compute live JD Match evaluation
  const jdMatchResult = useMemo(
    () => analyzeJDMatch(jdInputText, cv, lang),
    [jdInputText, cv, lang]
  );

  // Compute live Tech Nomenclature Lint Report
  const techLintReport = useMemo(() => {
    const rawReport = lintCVTechnologies(
      cv,
      docMode === 'cover_letter' ? (lang === 'vi' ? coverLetterVi : coverLetterEn) : undefined
    );
    // Filter out user-ignored issues
    const filteredIssues = rawReport.issues.filter((iss) => !ignoredIssueIds.has(iss.id));
    return {
      ...rawReport,
      totalIssuesCount: filteredIssues.length,
      issues: filteredIssues,
    };
  }, [cv, docMode, lang, coverLetterVi, coverLetterEn, ignoredIssueIds]);

  // Fix All Tech Issues in 1-Click
  const handleFixAllTechIssues = () => {
    const rawReport = lintCVTechnologies(
      cv,
      docMode === 'cover_letter' ? (lang === 'vi' ? coverLetterVi : coverLetterEn) : undefined
    );
    const count = rawReport.totalIssuesCount;
    if (count === 0) return;

    setCv(rawReport.cleanCv);
    if (docMode === 'cover_letter' && rawReport.cleanCoverLetter) {
      if (lang === 'vi') {
        setCoverLetterVi(rawReport.cleanCoverLetter);
      } else {
        setCoverLetterEn(rawReport.cleanCoverLetter);
      }
    }

    setIgnoredIssueIds(new Set());
    setToastMessage(
      lang === 'en'
        ? `Successfully standardized ${count} tech brand names!`
        : `Đã chuẩn hóa thành công ${count} danh pháp công nghệ theo chuẩn quốc tế!`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fix Single Issue
  const handleFixSingleTechIssue = (issue: TechLintIssue) => {
    if (issue.section === 'skills') {
      setCv((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s === issue.original ? issue.replacement : s)),
      }));
    } else if (issue.section === 'summary') {
      setCv((prev) => ({
        ...prev,
        summary: safeReplaceTechName(prev.summary, issue.original, issue.replacement),
      }));
    } else if (issue.section === 'timeline') {
      setCv((prev) => ({
        ...prev,
        timeline: prev.timeline.map((item) => {
          if (item.id !== issue.targetId) return item;
          return {
            ...item,
            role: issue.field === 'role' ? safeReplaceTechName(item.role, issue.original, issue.replacement) : item.role,
            desc: issue.field === 'desc' ? safeReplaceTechName(item.desc, issue.original, issue.replacement) : item.desc,
          };
        }),
      }));
    } else if (issue.section === 'projects') {
      setCv((prev) => ({
        ...prev,
        projects: prev.projects.map((proj) => {
          if (proj.id !== issue.targetId) return proj;
          if (issue.field === 'badges') {
            return {
              ...proj,
              badges: proj.badges.map((b) => (b === issue.original ? issue.replacement : b)),
            };
          }
          if (issue.field === 'desc') {
            return {
              ...proj,
              desc: safeReplaceTechName(proj.desc, issue.original, issue.replacement),
            };
          }
          if (issue.field === 'features' && proj.features) {
            return {
              ...proj,
              features: proj.features.map((f) => ({
                title: safeReplaceTechName(f.title, issue.original, issue.replacement),
                detail: safeReplaceTechName(f.detail, issue.original, issue.replacement),
              })),
            };
          }
          return proj;
        }),
      }));
    } else if (issue.section === 'custom') {
      setCv((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((sec) => {
          if (sec.id === issue.targetId && issue.field === 'content' && sec.content) {
            return { ...sec, content: safeReplaceTechName(sec.content, issue.original, issue.replacement) };
          }
          if (sec.items) {
            return {
              ...sec,
              items: sec.items.map((it) => (it.id === issue.targetId ? { ...it, desc: safeReplaceTechName(it.desc || '', issue.original, issue.replacement) } : it)),
            };
          }
          return sec;
        }),
      }));
    } else if (issue.section === 'cover_letter' && issue.field) {
      if (lang === 'vi') {
        setCoverLetterVi((prev) => ({
          ...prev,
          [issue.field!]: safeReplaceTechName((prev as any)[issue.field!] || '', issue.original, issue.replacement),
        }));
      } else {
        setCoverLetterEn((prev) => ({
          ...prev,
          [issue.field!]: safeReplaceTechName((prev as any)[issue.field!] || '', issue.original, issue.replacement),
        }));
      }
    }

    setToastMessage(
      lang === 'en'
        ? `Standardized: "${issue.original}" ➔ "${issue.replacement}"`
        : `Đã chuẩn hóa: "${issue.original}" ➔ "${issue.replacement}"`
    );
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleIgnoreTechIssue = (issueId: string) => {
    setIgnoredIssueIds((prev) => new Set([...Array.from(prev), issueId]));
  };

  // Quick 1-Click Normalization for Skills in Drawer
  const handleQuickLintSkills = () => {
    const nextSkills = cv.skills.map((s) => normalizeSingleSkill(s).normalized);
    setCv((prev) => ({ ...prev, skills: nextSkills }));
    setToastMessage(lang === 'en' ? 'Standardized all skill names!' : 'Đã chuẩn hóa toàn bộ danh pháp trong mục Kỹ năng!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Playground tester
  const handleRunPlayground = () => {
    if (!playgroundInput.trim()) return;
    const { cleanText, replacements } = lintAndFormatText(playgroundInput);
    setPlaygroundOutput(cleanText);
    setPlaygroundReplacements(replacements);
  };

  const handleSelectSampleJD = (sample: SampleJD) => {
    setSelectedSampleJdId(sample.id);
    setJdInputText(lang === 'en' ? sample.descriptionEn : sample.descriptionVi);
  };

  const handleAddKeywordToSkills = (keywordName: string) => {
    if (!cv.skills.some((s) => s.toLowerCase() === keywordName.toLowerCase())) {
      const nextSkills = [...cv.skills, keywordName];
      setCv((prev) => ({ ...prev, skills: nextSkills }));
      setAddedSkillKeyword(keywordName);
      setTimeout(() => setAddedSkillKeyword(null), 2000);
      setToastMessage(lang === 'en' ? `Added "${keywordName}" to Skills` : `Đã thêm "${keywordName}" vào mục Kỹ năng`);
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleCopyKeyword = (keywordName: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(keywordName);
      setCopiedKeyword(keywordName);
      setTimeout(() => setCopiedKeyword(null), 2000);
    }
  };

  // Custom Tech Links Action Handlers
  const handleAddCustomLink = (platform?: TechLinkPlatform, presetUrl?: string, presetLabel?: string) => {
    const p = platform || 'website';
    const newId = `link-${Date.now()}`;
    const meta = TECH_PLATFORM_META[p];
    const newLink: CustomTechLink = {
      id: newId,
      platform: p,
      url: presetUrl || (meta ? (meta.placeholder.startsWith('http') ? meta.placeholder : `https://${meta.placeholder}`) : 'https://'),
      label: presetLabel || (meta ? meta.defaultLabel : 'Link'),
      enabled: true,
    };
    const currentLinks = ensureCustomLinks(cv);
    setCv({ ...cv, customLinks: [...currentLinks, newLink] });
    setToastMessage(lang === 'en' ? `Added ${meta?.name || p} link` : `Đã thêm liên kết ${meta?.name || p}`);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleUpdateCustomLink = (id: string, updates: Partial<CustomTechLink>) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => {
      if (l.id !== id) return l;
      const next = { ...l, ...updates };
      if (updates.url && !updates.platform) {
        const detected = detectLinkPlatform(updates.url);
        if (detected !== 'custom' && detected !== l.platform) {
          next.platform = detected;
        }
        const pMeta = TECH_PLATFORM_META[next.platform];
        if (!updates.label && (!l.label || l.label === pMeta?.defaultLabel)) {
          next.label = formatLinkDisplay(updates.url, next.platform);
        }
      }
      return next;
    });
    setCv({ ...cv, customLinks: updated });
  };

  const handleToggleCustomLink = (id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.map((l: CustomTechLink) => (l.id === id ? { ...l, enabled: !l.enabled } : l));
    setCv({ ...cv, customLinks: updated });
  };

  const handleRemoveCustomLink = (id: string) => {
    const currentLinks = ensureCustomLinks(cv);
    const updated = currentLinks.filter((l: CustomTechLink) => l.id !== id);
    setCv({ ...cv, customLinks: updated });
  };

  const handleMoveCustomLink = (index: number, direction: 'up' | 'down') => {
    const currentLinks = ensureCustomLinks(cv);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentLinks.length) return;
    const copy = [...currentLinks];
    const [removed] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, removed);
    setCv({ ...cv, customLinks: copy });
  };

  // Style Settings
  const [accentColor, setAccentColor] = useState<'blue' | 'yellow' | 'emerald' | 'slate' | 'rose'>('blue');
  const [fontFamily, setFontFamily] = useState<CVFontFamily>('inter');
  const [zoom, setZoom] = useState<number>(90);
  const [newSkillText, setNewSkillText] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // 1-Page Fit / Compact Mode State
  const [isCompact, setIsCompact] = useState(false);

  // Fine-grain Typography & Margins Config State
  const [typographyConfig, setTypographyConfig] = useState<CVTypographyConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ducanh_cv_typography_config');
      if (saved) {
        try {
          return { ...DEFAULT_TYPOGRAPHY_CONFIG, ...JSON.parse(saved) };
        } catch (e) {}
      }
    }
    return DEFAULT_TYPOGRAPHY_CONFIG;
  });

  // Sync typography to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ducanh_cv_typography_config', JSON.stringify(typographyConfig));
    }
  }, [typographyConfig]);

  // Section Reordering and Visibility State
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, boolean>>(DEFAULT_SECTION_VISIBILITY);

  // Section Navigation Horizontal Scroll State & Ref
  const sectionTabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkSectionTabsScroll = () => {
    if (!sectionTabsRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sectionTabsRef.current;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const handleScrollSectionTabs = (direction: 'left' | 'right') => {
    if (!sectionTabsRef.current) return;
    const offset = direction === 'left' ? -140 : 140;
    sectionTabsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkSectionTabsScroll, 250);
  };

  const handleSectionTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!sectionTabsRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      sectionTabsRef.current.scrollLeft += e.deltaY;
      checkSectionTabsScroll();
    }
  };

  const moveSection = (key: SectionKey, direction: 'up' | 'down') => {
    setSectionOrder((prev) => {
      const idx = prev.indexOf(key);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
    setToastMessage(lang === 'en' ? 'Section order updated' : 'Đã thay đổi thứ tự mục');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const toggleSectionVisibility = (key: SectionKey) => {
    setSectionVisibility((prev) => {
      const nextVisible = !prev[key];
      const next = { ...prev, [key]: nextVisible };
      const meta = CV_SECTIONS.find((s) => s.key === key);
      const name = lang === 'en' ? meta?.labelEn : meta?.labelVi;
      setToastMessage(
        nextVisible
          ? `${name}: ${lang === 'en' ? 'Visible' : 'Đang hiển thị'}`
          : `${name}: ${lang === 'en' ? 'Hidden' : 'Đã ẩn'}`
      );
      setTimeout(() => setToastMessage(null), 2000);
      return next;
    });
  };

  const resetSections = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setSectionVisibility(DEFAULT_SECTION_VISIBILITY);
    setToastMessage(lang === 'en' ? 'Sections reset to default' : 'Đã khôi phục thứ tự các mục mặc định');
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Modern Canva/Figma Layout State
  const [activeRailTab, setActiveRailTab] = useState<'design' | 'content' | 'layout' | 'ai-ats' | 'data' | 'cover_letter'>('design');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [contentSubTab, setContentSubTab] = useState<string>('profile');
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);

  useEffect(() => {
    if (activeRailTab === 'content') {
      const timer = setTimeout(() => {
        checkSectionTabsScroll();
        if (sectionTabsRef.current) {
          const activeEl = sectionTabsRef.current.querySelector<HTMLElement>('[data-active="true"]');
          if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [drawerTab, activeRailTab]);

  useEffect(() => {
    const handleResize = () => checkSectionTabsScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persistence & Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo History State (Snapshots of full CV & Design state)
  const [undoHistory, setUndoHistory] = useState<CVSnapshot[]>([
    {
      cv: defaultCVData,
      template: 'rabbit',
      accentColor: 'blue',
      fontFamily: 'inter',
      isCompact: false,
      sectionOrder: DEFAULT_SECTION_ORDER,
      sectionVisibility: DEFAULT_SECTION_VISIBILITY,
    },
  ]);
  const [undoHistoryIndex, setUndoHistoryIndex] = useState(0);
  const isUndoRedoAction = useRef(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Export High-Res Image & Document Hub State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [exportResolution, setExportResolution] = useState<ExportResolution>(2);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    }
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  // Multiple CV Profiles State
  const [profiles, setProfiles] = useState<CVProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingProfileName, setEditingProfileName] = useState<string>('');
  const [showNewProfileModal, setShowNewProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState('');
  const [newProfileCloneFromCurrent, setNewProfileCloneFromCurrent] = useState(true);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const lastRecordedSnapRef = useRef<string>('');

  // CV Parser / PDF & Doc Import State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTab, setImportTab] = useState<'upload' | 'paste' | 'sample'>('upload');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importRawText, setImportRawText] = useState('');
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedCVResult | null>(null);
  const [importPreviewTab, setImportPreviewTab] = useState<'profile' | 'skills' | 'timeline' | 'projects' | 'education'>('profile');
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // Personal Dynamic QR Code DataURL State
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrCopied, setQrCopied] = useState<boolean>(false);

  // Continuous History Recording Engine
  useEffect(() => {
    if (isLoading) return;

    const currentSnap: CVSnapshot = {
      cv,
      template,
      accentColor,
      fontFamily,
      isCompact,
      typography: typographyConfig,
      sectionOrder,
      sectionVisibility,
    };
    const snapStr = JSON.stringify(currentSnap);

    // Initial snapshot once loaded
    if (!lastRecordedSnapRef.current) {
      lastRecordedSnapRef.current = snapStr;
      setUndoHistory([currentSnap]);
      setUndoHistoryIndex(0);
      return;
    }

    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      lastRecordedSnapRef.current = snapStr;
      return;
    }

    if (snapStr === lastRecordedSnapRef.current) return;

    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    // Debounce: 400ms so typing text groups into coherent undo units
    historyTimeoutRef.current = setTimeout(() => {
      lastRecordedSnapRef.current = snapStr;
      setUndoHistory((prevHistory) => {
        const currentSlice = prevHistory.slice(0, undoHistoryIndex + 1);
        const updated = [...currentSlice, currentSnap];
        if (updated.length > 50) updated.shift();
        return updated;
      });
      setUndoHistoryIndex((prevIdx) => {
        return Math.min(prevIdx + 1, 49);
      });
    }, 400);

    return () => {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    };
  }, [cv, template, accentColor, fontFamily, isCompact, typographyConfig, sectionOrder, sectionVisibility, isLoading, undoHistoryIndex]);

  const handleUndo = () => {
    if (undoHistoryIndex > 0) {
      const prevIdx = undoHistoryIndex - 1;
      const snap = undoHistory[prevIdx];
      isUndoRedoAction.current = true;
      setUndoHistoryIndex(prevIdx);
      setCvState(snap.cv);
      if (lang === 'vi') {
        setCvVi(snap.cv);
      } else {
        setCvEn(snap.cv);
      }
      setTemplate(snap.template);
      setAccentColor(snap.accentColor);
      setFontFamily(snap.fontFamily);
      setIsCompact(snap.isCompact);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
      if (snap.sectionVisibility) setSectionVisibility(snap.sectionVisibility);
      if (snap.typography) setTypographyConfig(snap.typography);
      setToastMessage(lang === 'en' ? 'Undo applied (Ctrl+Z)' : 'Đã hoàn tác (Ctrl+Z)');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const handleRedo = () => {
    if (undoHistoryIndex < undoHistory.length - 1) {
      const nextIdx = undoHistoryIndex + 1;
      const snap = undoHistory[nextIdx];
      isUndoRedoAction.current = true;
      setUndoHistoryIndex(nextIdx);
      setCvState(snap.cv);
      if (lang === 'vi') {
        setCvVi(snap.cv);
      } else {
        setCvEn(snap.cv);
      }
      setTemplate(snap.template);
      setAccentColor(snap.accentColor);
      setFontFamily(snap.fontFamily);
      setIsCompact(snap.isCompact);
      if (snap.sectionOrder) setSectionOrder(snap.sectionOrder);
      if (snap.sectionVisibility) setSectionVisibility(snap.sectionVisibility);
      if (snap.typography) setTypographyConfig(snap.typography);
      setToastMessage(lang === 'en' ? 'Redo applied (Ctrl+Y)' : 'Đã làm lại (Ctrl+Y)');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  // Listen to keyboard shortcuts (Escape to exit preview, Ctrl+Z / Ctrl+Y for undo/redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPreviewMode) setIsPreviewMode(false);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, undoHistoryIndex, undoHistory, lang]);

  const toggleCompactMode = () => {
    const next = !isCompact;
    setIsCompact(next);
    if (next) {
      setTypographyConfig(COMPACT_TYPOGRAPHY_PRESET);
    } else {
      setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
    }
    setToastMessage(next ? (lang === 'en' ? 'Fit 1-Page mode enabled!' : 'Đã bật chế độ Vừa khít 1 trang A4 (Compact)!') : (lang === 'en' ? 'Standard mode enabled' : 'Đã chuyển sang chế độ Tiêu chuẩn'));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Spacing Density Config (Normal vs Compact 1-Page Fit)
  const pad = {
    header: isCompact ? 'py-4 px-6' : 'p-8',
    body: isCompact ? 'p-5' : 'p-8',
    sectionGap: isCompact ? 'space-y-3.5' : 'space-y-6',
    itemGap: isCompact ? 'space-y-2' : 'space-y-4',
    itemSubGap: isCompact ? 'space-y-0.5' : 'space-y-1',
    cardPad: isCompact ? 'p-2.5' : 'p-3',
    gridGap: isCompact ? 'gap-5' : 'gap-8',
    textDesc: isCompact ? 'text-[11px] leading-snug' : 'text-xs leading-relaxed',
    textSummary: isCompact ? 'text-[11px] leading-snug' : 'text-xs leading-relaxed',
    timelineLine: isCompact ? 'space-y-3.5' : 'space-y-5',
    sidebarPad: isCompact ? 'p-5 space-y-4' : 'p-7 space-y-6',
  };

  // Hidden Avatar File Input Ref
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP, GIF)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality square center crop & compression to max 500x500
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500;
        const width = img.width;
        const height = img.height;
        const minDimension = Math.min(width, height);
        const startX = (width - minDimension) / 2;
        const startY = (height - minDimension) / 2;

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minDimension, minDimension, 0, 0, MAX_SIZE, MAX_SIZE);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setCv((prev) => ({
            ...prev,
            avatar: dataUrl,
            showAvatar: true,
          }));
          setToastMessage('Đã tải lên và cập nhật ảnh thẻ mới thành công!');
          setTimeout(() => setToastMessage(null), 3500);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input value so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setCv((prev) => ({ ...prev, avatar: '' }));
    setToastMessage('Đã gỡ ảnh thẻ.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Export Full Bilingual Package (.json)
  const handleExportFullJSON = () => {
    const activeCvVi = lang === 'vi' ? cv : cvVi;
    const activeCvEn = lang === 'en' ? cv : cvEn;
    const exportPayload = {
      $schema: 'https://nguyenducanh.dev/schemas/cv-backup-v1.json',
      app: 'DucAnh Portfolio CV Studio',
      version: 1,
      exportedAt: new Date().toISOString(),
      lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
      cvVi: activeCvVi,
      cvEn: activeCvEn,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute('download', `cv-full-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage(lang === 'en' ? 'Exported full CV backup (.json) successfully!' : 'Đã xuất trọn gói dữ liệu CV (.json) thành công!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 2. Export Active Language Profile Only (.json)
  const handleExportCurrentProfileJSON = () => {
    const exportPayload = {
      $schema: 'https://nguyenducanh.dev/schemas/cv-profile-v1.json',
      app: 'DucAnh Portfolio CV Studio',
      version: 1,
      exportedAt: new Date().toISOString(),
      language: lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
      data: cv,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    const safeName = (cv.name || 'cv').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadAnchor.setAttribute('download', `cv-${lang}-${safeName}-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMessage(lang === 'en' ? `Exported ${lang.toUpperCase()} CV profile (.json) successfully!` : `Đã xuất hồ sơ CV ${lang === 'vi' ? 'Tiếng Việt' : 'Tiếng Anh'} (.json) thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3. Copy JSON to Clipboard
  const handleCopyJSON = () => {
    const activeCvVi = lang === 'vi' ? cv : cvVi;
    const activeCvEn = lang === 'en' ? cv : cvEn;
    const exportPayload = {
      app: 'DucAnh Portfolio CV Studio',
      version: 1,
      exportedAt: new Date().toISOString(),
      lang,
      template,
      accentColor,
      fontFamily,
      isCompact,
      sectionOrder,
      sectionVisibility,
      cvVi: activeCvVi,
      cvEn: activeCvEn,
    };
    navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setToastMessage(t.copyJsonBtn + ' — ' + (lang === 'en' ? 'Copied to clipboard!' : 'Đã sao chép vào bộ nhớ tạm!'));
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Process Uploaded JSON File
  const processImportFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setImportErrorMsg(lang === 'en' ? 'Please select a valid .json file.' : 'Vui lòng chọn tệp có định dạng .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        const parsed = JSON.parse(raw);

        // Case A: Full package containing cvVi and/or cvEn
        if (parsed.cvVi || parsed.cvEn) {
          const vi = parsed.cvVi || parsed.cv;
          const en = parsed.cvEn;
          const primary = vi || en || {};

          setImportPreview({
            type: 'full',
            data: parsed,
            summary: {
              name: primary.name,
              role: primary.role,
              hasVi: !!parsed.cvVi,
              hasEn: !!parsed.cvEn,
              viName: parsed.cvVi?.name,
              enName: parsed.cvEn?.name,
              template: parsed.template,
              timelineCount: (primary.timeline || []).length,
              projectsCount: (primary.projects || []).length,
              skillsCount: (primary.skills || []).length,
              eduCount: (primary.education || []).length,
            },
          });
          setImportErrorMsg(null);
          return;
        }

        // Case B: Single profile (candidate.data, candidate.cv or root candidate)
        const candidate = parsed.data || parsed.cv || parsed;
        if (candidate && (candidate.name || candidate.timeline || candidate.skills || candidate.projects || candidate.role)) {
          const normalized: CVData = {
            name: candidate.name || 'Nguyen Duc Anh',
            role: candidate.role || 'Developer',
            email: candidate.email || '',
            phone: candidate.phone || '',
            location: candidate.location || '',
            github: candidate.github || '',
            linkedin: candidate.linkedin || '',
            website: candidate.website || '',
            avatar: candidate.avatar || '',
            showAvatar: candidate.showAvatar ?? true,
            summary: candidate.summary || '',
            timeline: Array.isArray(candidate.timeline) ? candidate.timeline : [],
            projects: Array.isArray(candidate.projects) ? candidate.projects : [],
            skills: Array.isArray(candidate.skills) ? candidate.skills : [],
            education: Array.isArray(candidate.education) ? candidate.education : [],
          };

          setImportPreview({
            type: 'single',
            data: normalized,
            meta: parsed,
            summary: {
              name: normalized.name,
              role: normalized.role,
              timelineCount: normalized.timeline.length,
              projectsCount: normalized.projects.length,
              skillsCount: normalized.skills.length,
              eduCount: normalized.education.length,
            },
          });
          setImportErrorMsg(null);
          return;
        }

        setImportErrorMsg(t.importInvalidMsg);
      } catch (err: any) {
        setImportErrorMsg(lang === 'en' ? `Failed to parse JSON file: ${err.message}` : `Lỗi đọc file JSON: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setImportErrorMsg(lang === 'en' ? 'Failed to read file.' : 'Không thể đọc tệp đã chọn.');
    };
    reader.readAsText(file);
  };

  const handleJSONFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImportFile(file);
    }
    e.target.value = '';
  };

  // 5. Apply Imported Data to State & Storage
  const handleApplyImport = () => {
    if (!importPreview) return;

    if (importPreview.type === 'full') {
      const p = importPreview.data;
      if (p.cvVi) setCvVi(p.cvVi);
      if (p.cvEn) setCvEn(p.cvEn);
      if (p.template && TEMPLATES_COLLECTION.some((tmpl) => tmpl.id === p.template)) {
        setTemplate(p.template);
      }
      if (p.accentColor) setAccentColor(p.accentColor);
      if (p.fontFamily) setFontFamily(p.fontFamily);
      if (p.isCompact !== undefined) setIsCompact(p.isCompact);
      if (p.sectionOrder) setSectionOrder(p.sectionOrder);
      if (p.sectionVisibility) setSectionVisibility(p.sectionVisibility);

      if (p.lang === 'en' && p.cvEn) {
        setLang('en');
        setCvState(p.cvEn);
      } else {
        setLang('vi');
        setCvState(p.cvVi || p.cv);
      }
    } else if (importPreview.type === 'single') {
      const single = importPreview.data as CVData;
      setCvState(single);
      if (lang === 'vi') {
        setCvVi(single);
      } else {
        setCvEn(single);
      }
      if (importPreview.meta?.template && TEMPLATES_COLLECTION.some((tmpl) => tmpl.id === importPreview.meta.template)) {
        setTemplate(importPreview.meta.template);
      }
      if (importPreview.meta?.accentColor) setAccentColor(importPreview.meta.accentColor);
      if (importPreview.meta?.fontFamily) setFontFamily(importPreview.meta.fontFamily);
      if (importPreview.meta?.isCompact !== undefined) setIsCompact(importPreview.meta.isCompact);
      if (importPreview.meta?.sectionOrder) setSectionOrder(importPreview.meta.sectionOrder);
      if (importPreview.meta?.sectionVisibility) setSectionVisibility(importPreview.meta.sectionVisibility);
    }

    setImportPreview(null);
    setImportErrorMsg(null);
    setShowDataModal(false);

    setToastMessage(t.importSuccessMsg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load saved CV from localStorage or /api/cv on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // 1. Check localStorage first for instant restoration
        const local = localStorage.getItem('ducanh_cv_data');
        if (local) {
          const parsed = JSON.parse(local);
          const savedLang: Language = parsed.lang === 'en' ? 'en' : 'vi';
          if (parsed.cvVi) setCvVi(sanitizeCVTechStuttering({ ...parsed.cvVi, customLinks: ensureCustomLinks(parsed.cvVi) }));
          if (parsed.cvEn) setCvEn(sanitizeCVTechStuttering({ ...parsed.cvEn, customLinks: ensureCustomLinks(parsed.cvEn) }));
          setLang(savedLang);

          if (savedLang === 'en') {
            const base = sanitizeCVTechStuttering(parsed.cvEn || parsed.cv || defaultEnglishCVData);
            setCvState({ ...base, customLinks: ensureCustomLinks(base) });
          } else {
            const base = sanitizeCVTechStuttering(parsed.cvVi || parsed.cv || defaultCVData);
            setCvState({ ...base, customLinks: ensureCustomLinks(base) });
          }
          if (parsed.template) setTemplate(parsed.template);
          if (parsed.accentColor) setAccentColor(parsed.accentColor);
          if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
          if (parsed.isCompact !== undefined) setIsCompact(parsed.isCompact);
          if (parsed.sectionOrder) {
            const loadedOrder: SectionKey[] = [...parsed.sectionOrder];
            const customSecs: CustomSection[] = parsed.cv?.customSections || parsed.cvVi?.customSections || defaultCVData.customSections || [];
            customSecs.forEach((cs) => {
              if (!loadedOrder.includes(cs.id)) loadedOrder.push(cs.id);
            });
            setSectionOrder(loadedOrder);
          }
          if (parsed.sectionVisibility) {
            setSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY, ...parsed.sectionVisibility });
          }
        }

        // 2. Fetch /api/cv to sync from server if available
        const res = await fetch('/api/cv');
        const data = await res.json();
        if (data.success && data.cv) {
          const serverLang: Language = data.cv.lang === 'en' ? 'en' : 'vi';
          if (data.cv.cvVi) setCvVi({ ...data.cv.cvVi, customLinks: ensureCustomLinks(data.cv.cvVi) });
          if (data.cv.cvEn) setCvEn({ ...data.cv.cvEn, customLinks: ensureCustomLinks(data.cv.cvEn) });

          if (serverLang === 'en' && data.cv.cvEn) {
            setCvState({ ...data.cv.cvEn, customLinks: ensureCustomLinks(data.cv.cvEn) });
            setLang('en');
          } else if (data.cv.cvVi) {
            setCvState({ ...data.cv.cvVi, customLinks: ensureCustomLinks(data.cv.cvVi) });
          } else {
            setCvState({ ...data.cv, customLinks: ensureCustomLinks(data.cv) });
          }
          if (data.cv.template) setTemplate(data.cv.template);
          if (data.cv.accentColor) setAccentColor(data.cv.accentColor);
          if (data.cv.fontFamily) setFontFamily(data.cv.fontFamily);
          if (data.cv.isCompact !== undefined) setIsCompact(data.cv.isCompact);
          if (data.cv.sectionOrder) {
            const loadedOrder: SectionKey[] = [...data.cv.sectionOrder];
            const customSecs: CustomSection[] = data.cv.customSections || data.cv.cvVi?.customSections || defaultCVData.customSections || [];
            customSecs.forEach((cs) => {
              if (!loadedOrder.includes(cs.id)) loadedOrder.push(cs.id);
            });
            setSectionOrder(loadedOrder);
          }
          if (data.cv.sectionVisibility) {
            setSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY, ...data.cv.sectionVisibility });
          }
        }

        // 3. Initialize Multiple CV Profiles
        const baseVi = (local ? JSON.parse(local).cvVi : null) || (data?.success && data.cv?.cvVi ? data.cv.cvVi : defaultCVData);
        const baseEn = (local ? JSON.parse(local).cvEn : null) || (data?.success && data.cv?.cvEn ? data.cv.cvEn : defaultEnglishCVData);
        const baseSettings = {
          template: (local ? JSON.parse(local).template : null) || (data?.success && data.cv?.template) || 'rabbit',
          accentColor: (local ? JSON.parse(local).accentColor : null) || (data?.success && data.cv?.accentColor) || 'blue',
          fontFamily: (local ? JSON.parse(local).fontFamily : null) || (data?.success && data.cv?.fontFamily) || 'inter',
          isCompact: (local ? JSON.parse(local).isCompact : false) || (data?.success && data.cv?.isCompact) || false,
          sectionOrder: (local ? JSON.parse(local).sectionOrder : null) || (data?.success && data.cv?.sectionOrder) || DEFAULT_SECTION_ORDER,
          sectionVisibility: (local ? JSON.parse(local).sectionVisibility : null) || (data?.success && data.cv?.sectionVisibility) || DEFAULT_SECTION_VISIBILITY,
          activeLang: ((local ? JSON.parse(local).lang : null) || (data?.success && data.cv?.lang) || 'vi') as Language,
        };

        const { profiles: loadedProfiles, activeProfileId: initialActiveId } = loadProfilesFromStorage(
          baseVi,
          baseEn,
          baseSettings
        );
        setProfiles(loadedProfiles);
        setActiveProfileId(initialActiveId);
      } catch (err) {
        console.warn('Could not load saved CV:', err);
      } finally {
        // Smooth transition to prevent flicker
        setTimeout(() => setIsLoading(false), 350);
      }
    };

    loadSavedData();
  }, []);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (isLoading || !activeProfileId) return;

    try {
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      // Update current profile in profiles list
      setProfiles((prev) => {
        if (!prev || prev.length === 0) return prev;
        const next = prev.map((p) => {
          if (p.id === activeProfileId) {
            return {
              ...p,
              updatedAt: new Date().toISOString(),
              cvVi: activeCvVi,
              cvEn: activeCvEn,
              activeLang: lang,
              coverLetterVi,
              coverLetterEn,
              template,
              accentColor,
              fontFamily,
              isCompact,
              sectionOrder,
              sectionVisibility,
            };
          }
          return p;
        });
        saveProfilesToStorage(next, activeProfileId);
        return next;
      });

      localStorage.setItem(
        'ducanh_cv_data',
        JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          coverLetterVi,
          coverLetterEn,
          template,
          accentColor,
          fontFamily,
          isCompact,
          sectionOrder,
          sectionVisibility,
        })
      );
    } catch (e) {
      // ignore quota errors
    }
  }, [cv, cvVi, cvEn, lang, coverLetterVi, coverLetterEn, template, accentColor, fontFamily, isCompact, sectionOrder, sectionVisibility, activeProfileId, isLoading]);

  // Save changes explicitly to server & localStorage
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const activeCvVi = lang === 'vi' ? cv : cvVi;
      const activeCvEn = lang === 'en' ? cv : cvEn;

      // Save locally
      localStorage.setItem(
        'ducanh_cv_data',
        JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          template,
          accentColor,
          fontFamily,
          isCompact,
          sectionOrder,
          sectionVisibility,
        })
      );

      // Save to server API
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cv,
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          lang,
          template,
          accentColor,
          fontFamily,
          isCompact,
          sectionOrder,
          sectionVisibility,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(lang === 'en' ? 'CV saved & updated successfully!' : 'Đã lưu và cập nhật CV thành công!');
      } else {
        setToastMessage(lang === 'en' ? 'Saved to local browser storage!' : 'Đã lưu vào bộ nhớ trình duyệt!');
      }
    } catch (e) {
      console.error(e);
      setToastMessage(lang === 'en' ? 'Saved to local browser storage!' : 'Đã lưu vào bộ nhớ trình duyệt!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Update handlers
  const updateTimelineItem = (id: string, field: keyof TimelineItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cv.timeline.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...cv.timeline];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setCv({ ...cv, timeline: list });
  };

  const addTimelineItem = (index: number = cv.timeline.length - 1) => {
    const newItem: TimelineItem = {
      id: `exp-${Date.now()}`,
      period: lang === 'en' ? '2024 — PRESENT' : '2024 — HIỆN TẠI',
      role: lang === 'en' ? 'Fullstack Software Engineer' : 'Fullstack Software Engineer',
      desc: lang === 'en'
        ? 'Architected core system modules, optimized database performance, and crafted intuitive user interfaces.'
        : 'Phát triển các module chức năng chính, tối ưu hoá cơ sở dữ liệu và xây dựng giao diện người dùng thân thiện.',
    };
    const list = [...cv.timeline];
    list.splice(index + 1, 0, newItem);
    setCv({ ...cv, timeline: list });
  };

  const deleteTimelineItem = (id: string) => {
    setCv({ ...cv, timeline: cv.timeline.filter((t) => t.id !== id) });
  };

  const updateProjectItem = (id: string, field: keyof ProjectItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const moveProjectItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cv.projects.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...cv.projects];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setCv({ ...cv, projects: list });
  };

  const addProjectItem = (index: number = cv.projects.length - 1) => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      num: `0${cv.projects.length + 1}`,
      title: lang === 'en' ? 'New Project Title' : 'Tên dự án mới',
      category: 'Web Application',
      year: new Date().getFullYear().toString(),
      desc: lang === 'en'
        ? 'Brief overview of technological solution, challenges solved, and key impact achieved...'
        : 'Mô tả ngắn gọn về giải pháp công nghệ, thách thức và kết quả đạt được của dự án...',
      badges: ['React', 'TypeScript', 'Node.js'],
      liveDemo: '',
      github: '',
    };
    const list = [...cv.projects];
    list.splice(index + 1, 0, newProj);
    setCv({ ...cv, projects: list });
  };

  const deleteProjectItem = (id: string) => {
    setCv({ ...cv, projects: cv.projects.filter((p) => p.id !== id) });
  };

  const updateEducationItem = (id: string, field: keyof EducationItem, value: any) => {
    setCv((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const moveEducationItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === cv.education.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const list = [...cv.education];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setCv({ ...cv, education: list });
  };

  const addEducationItem = (index: number = cv.education.length - 1) => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      school: lang === 'en' ? 'University / Institution Name' : 'Tên trường / Học viện',
      degree: lang === 'en' ? 'Degree / Major Field of Study' : 'Chuyên ngành / Bằng cấp',
      year: '2020 — 2024',
      desc: lang === 'en' ? 'Notable academic achievements, honors, or thesis topic.' : 'Thành tích nổi bật, xếp loại hoặc chứng chỉ liên quan.',
    };
    const list = [...cv.education];
    list.splice(index + 1, 0, newEdu);
    setCv({ ...cv, education: list });
  };

  const deleteEducationItem = (id: string) => {
    setCv({ ...cv, education: cv.education.filter((e) => e.id !== id) });
  };

  // Custom Sections Handlers
  const addCustomSection = (presetId?: string) => {
    const preset = CUSTOM_SECTION_PRESETS.find((p) => p.presetId === presetId);
    const newId = `custom_${Date.now()}`;
    const newSec: CustomSection = {
      id: newId,
      title: preset ? (lang === 'en' ? preset.templateEn.title : preset.templateVi.title) : (lang === 'en' ? 'New Section' : 'Mục mới'),
      titleEn: preset ? preset.templateEn.title : 'New Section',
      type: preset ? preset.type : 'list',
      content: preset?.type === 'text' ? (lang === 'en' ? preset.templateEn.content : preset.templateVi.content) : '',
      items: preset?.type === 'list'
        ? (lang === 'en' ? preset.templateEn.items : preset.templateVi.items)?.map((it, idx) => ({
            ...it,
            id: `item-${Date.now()}-${idx}`,
          }))
        : [
            {
              id: `item-${Date.now()}-0`,
              title: lang === 'en' ? 'Title / Name' : 'Tên mục / Chứng chỉ / Hoạt động',
              subtitle: lang === 'en' ? 'Organization / Issuer' : 'Tổ chức / Đơn vị cấp',
              date: '2024',
              desc: lang === 'en' ? 'Description of responsibilities or impact' : 'Mô tả chi tiết hoặc thành tựu đạt được',
            },
          ],
    };

    setCv((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec],
    }));

    setSectionOrder((prev) => [...prev, newId]);
    setSectionVisibility((prev) => ({ ...prev, [newId]: true }));

    setToastMessage(lang === 'en' ? `Added section: ${newSec.title}` : `Đã thêm mục: ${newSec.title}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const removeCustomSection = (sectionId: string) => {
    const sec = cv.customSections?.find((s) => s.id === sectionId);
    const title = sec?.title || 'Mục tùy chỉnh';
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== sectionId),
    }));
    setSectionOrder((prev) => prev.filter((k) => k !== sectionId));
    setSectionVisibility((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setToastMessage(lang === 'en' ? `Removed: ${title}` : `Đã xóa: ${title}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const updateCustomSectionTitle = (sectionId: string, title: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) => (s.id === sectionId ? { ...s, title } : s)),
    }));
  };

  const updateCustomSectionContent = (sectionId: string, content: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((s) => (s.id === sectionId ? { ...s, content } : s)),
    }));
  };

  const addCustomSectionItem = (sectionId: string, afterIndex?: number) => {
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: lang === 'en' ? 'Title / Award / Certificate' : 'Tên mục / Chứng chỉ / Giải thưởng',
      subtitle: lang === 'en' ? 'Issuer / Organization' : 'Đơn vị cấp / Tổ chức',
      date: '2024',
      desc: lang === 'en' ? 'Description or key achievements.' : 'Mô tả chi tiết hoặc thành tựu đạt được.',
    };
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        const currentItems = [...(sec.items || [])];
        if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < currentItems.length) {
          currentItems.splice(afterIndex + 1, 0, newItem);
        } else {
          currentItems.push(newItem);
        }
        return { ...sec, items: currentItems };
      }),
    }));
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: (sec.items || []).map((it) => (it.id === itemId ? { ...it, [field]: value } : it)),
        };
      }),
    }));
  };

  const deleteCustomSectionItem = (sectionId: string, itemId: string) => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: (sec.items || []).filter((it) => it.id !== itemId),
        };
      }),
    }));
  };

  const moveCustomSectionItem = (sectionId: string, index: number, direction: 'up' | 'down') => {
    setCv((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).map((sec) => {
        if (sec.id !== sectionId) return sec;
        const items = [...(sec.items || [])];
        if (direction === 'up' && index === 0) return sec;
        if (direction === 'down' && index === items.length - 1) return sec;
        const target = direction === 'up' ? index - 1 : index + 1;
        const temp = items[index];
        items[index] = items[target];
        items[target] = temp;
        return { ...sec, items };
      }),
    }));
  };

  // Tech Bullet Points Modal Handlers
  const handleOpenTechModal = (target?: { type: 'timeline' | 'project'; id: string; title?: string }) => {
    if (target) {
      setTechTarget(target);
    } else {
      if (cv.timeline.length > 0) {
        setTechTarget({ type: 'timeline', id: cv.timeline[0].id, title: cv.timeline[0].role });
      } else if (cv.projects.length > 0) {
        setTechTarget({ type: 'project', id: cv.projects[0].id, title: cv.projects[0].title });
      } else {
        setTechTarget(null);
      }
    }
    setShowTechModal(true);
  };

  const handleCopyBullet = (bullet: TechBulletPoint) => {
    const text = lang === 'en' ? bullet.textEn : bullet.textVi;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBulletId(bullet.id);
      setTimeout(() => setCopiedBulletId(null), 2000);
      setToastMessage(lang === 'en' ? 'Copied tech bullet point to clipboard!' : 'Đã sao chép gợi ý chuẩn công nghệ vào bộ nhớ tạm!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleInsertBullet = (bullet: TechBulletPoint) => {
    const text = lang === 'en' ? bullet.textEn : bullet.textVi;
    if (!techTarget) {
      handleCopyBullet(bullet);
      return;
    }

    if (techTarget.type === 'timeline') {
      const targetItem = cv.timeline.find((item) => item.id === techTarget.id);
      if (targetItem) {
        const currentDesc = (targetItem.desc || '').trim();
        let updatedDesc = '';
        if (!currentDesc) {
          updatedDesc = `• ${text}`;
        } else {
          updatedDesc = currentDesc.endsWith('\n') 
            ? `${currentDesc}• ${text}`
            : `${currentDesc}\n• ${text}`;
        }
        updateTimelineItem(techTarget.id, 'desc', updatedDesc);
        setInsertedBulletId(bullet.id);
        setTimeout(() => setInsertedBulletId(null), 2000);
        setToastMessage(lang === 'en' ? `Inserted bullet into "${targetItem.role}"!` : `Đã chèn gợi ý vào "${targetItem.role}"!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } else if (techTarget.type === 'project') {
      const targetProj = cv.projects.find((proj) => proj.id === techTarget.id);
      if (targetProj) {
        const currentDesc = (targetProj.desc || '').trim();
        let updatedDesc = '';
        if (!currentDesc) {
          updatedDesc = `• ${text}`;
        } else {
          updatedDesc = currentDesc.endsWith('\n') 
            ? `${currentDesc}• ${text}`
            : `${currentDesc}\n• ${text}`;
        }
        updateProjectItem(techTarget.id, 'desc', updatedDesc);
        setInsertedBulletId(bullet.id);
        setTimeout(() => setInsertedBulletId(null), 2000);
        setToastMessage(lang === 'en' ? `Inserted bullet into "${targetProj.title}"!` : `Đã chèn gợi ý vào dự án "${targetProj.title}"!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  const updateSkill = (index: number, value: string) => {
    const list = [...cv.skills];
    list[index] = value;
    setCv({ ...cv, skills: list });
  };

  const removeSkill = (index: number) => {
    setCv({ ...cv, skills: cv.skills.filter((_, i) => i !== index) });
  };

  const addSkill = (name: string) => {
    if (!name.trim()) return;
    setCv({ ...cv, skills: [...cv.skills, name.trim()] });
  };

  // Color Theme Configuration
  const colorMap = {
    blue: {
      primary: '#0284c7', // Sky / Cyan Blue
      badgeBg: '#e0f2fe',
      badgeText: '#0369a1',
      border: '#0284c7',
      lightBg: '#f0f9ff',
      sidebarBg: '#0f172a',
      gradient: 'from-[#06b6d4] to-[#0284c7]',
    },
    yellow: {
      primary: '#ca8a04',
      badgeBg: '#fef08a',
      badgeText: '#713f12',
      border: '#eab308',
      lightBg: '#fefce8',
      sidebarBg: '#1c1917',
      gradient: 'from-[#facc15] to-[#ca8a04]',
    },
    emerald: {
      primary: '#059669',
      badgeBg: '#d1fae5',
      badgeText: '#065f46',
      border: '#10b981',
      lightBg: '#ecfdf5',
      sidebarBg: '#064e3b',
      gradient: 'from-[#34d399] to-[#059669]',
    },
    slate: {
      primary: '#0f172a',
      badgeBg: '#f1f5f9',
      badgeText: '#0f172a',
      border: '#334155',
      lightBg: '#f8fafc',
      sidebarBg: '#18181b',
      gradient: 'from-[#475569] to-[#0f172a]',
    },
    rose: {
      primary: '#be123c',
      badgeBg: '#ffe4e6',
      badgeText: '#881337',
      border: '#f43f5e',
      lightBg: '#fff1f2',
      sidebarBg: '#4c0519',
      gradient: 'from-[#fb7185] to-[#be123c]',
    },
  };

  const activeColor = colorMap[accentColor];

  // Font family styles with backward compatibility
  const fontClass = {
    inter: 'font-inter',
    bevietnam: 'font-bevietnam',
    jakarta: 'font-jakarta',
    roboto: 'font-roboto',
    merriweather: 'font-merriweather',
    jetbrains: 'font-jetbrains',
    // Legacy compatibility
    sans: 'font-inter',
    serif: 'font-merriweather',
    mono: 'font-jetbrains',
  }[fontFamily] || 'font-inter';

  // Dynamic QR Code Generation
  const activeQrConfig = ensureQRConfig(cv.qrConfig);

  useEffect(() => {
    if (!activeQrConfig.enabled) {
      setQrDataUrl('');
      return;
    }

    let isMounted = true;
    const targetText = getQRTargetText(activeQrConfig, cv);
    const colorHex = activeQrConfig.colorMode === 'accent' ? activeColor.primary : '#0F172A';

    generateQRDataUrl(targetText, {
      color: colorHex,
      size: 200,
      margin: 1,
    }).then((url) => {
      if (isMounted) {
        setQrDataUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    activeQrConfig.enabled,
    activeQrConfig.targetType,
    activeQrConfig.customUrl,
    activeQrConfig.colorMode,
    cv.website,
    cv.linkedin,
    cv.github,
    cv.email,
    cv.phone,
    cv.name,
    activeColor.primary,
  ]);

  const handleUpdateQRConfig = (patch: Partial<CVQRConfig>) => {
    setCv((prev) => {
      const current = ensureQRConfig(prev.qrConfig);
      return {
        ...prev,
        qrConfig: {
          ...current,
          ...patch,
        },
      };
    });
  };

  const handleUpdateQRTargetUrl = (newVal: string) => {
    const currentTarget = activeQrConfig.targetType;
    if (currentTarget === 'website') {
      setCv((prev) => ({
        ...prev,
        website: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'linkedin') {
      setCv((prev) => ({
        ...prev,
        linkedin: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else if (currentTarget === 'github') {
      setCv((prev) => ({
        ...prev,
        github: newVal,
        qrConfig: {
          ...ensureQRConfig(prev.qrConfig),
          customUrl: newVal,
        },
      }));
    } else {
      handleUpdateQRConfig({ customUrl: newVal });
    }
  };

  const handleCopyQRUrl = (textToCopy: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setQrCopied(true);
    setToastMessage(lang === 'en' ? 'Link copied to clipboard!' : 'Đã sao chép liên kết!');
    setTimeout(() => {
      setQrCopied(false);
      setToastMessage(null);
    }, 2000);
  };

  // Public URL & Dynamic QR Generation for Share Link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setShareOrigin(origin);

      // Read query params if in public view or page loaded
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      const urlTpl = params.get('tpl') || params.get('template');
      const urlDoc = params.get('doc');
      const urlHidePhone = params.get('hidePhone');
      const urlHideLoc = params.get('hideLoc');

      if (urlLang === 'en' || urlLang === 'vi') {
        if (urlLang !== lang) {
          handleSwitchLanguage(urlLang as Language);
        }
      }
      if (urlTpl && TEMPLATES_COLLECTION.some((t) => t.id === urlTpl)) {
        setTemplate(urlTpl as TemplateId);
      }
      if (urlDoc === 'cover_letter' || urlDoc === 'letter') {
        setDocMode('cover_letter');
      }
      if (urlHidePhone === '1' || urlHidePhone === 'true') {
        setPrivacyHidePhone(true);
      }
      if (urlHideLoc === '1' || urlHideLoc === 'true') {
        setPrivacyHideLocation(true);
      }
    }
  }, []);

  // Compute live shareable public URL with query options
  const sharePublicUrl = useMemo(() => {
    const origin = shareOrigin || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!origin) return '/cv/view';
    const params = new URLSearchParams();
    if (lang === 'en') params.set('lang', 'en');
    if (template !== 'rabbit') params.set('tpl', template);
    if (privacyHidePhone) params.set('hidePhone', '1');
    if (privacyHideLocation) params.set('hideLoc', '1');
    const qs = params.toString();
    return `${origin}/cv/view${qs ? `?${qs}` : ''}`;
  }, [shareOrigin, lang, template, privacyHidePhone, privacyHideLocation]);

  // Generate QR code whenever sharePublicUrl updates
  useEffect(() => {
    if (!sharePublicUrl || sharePublicUrl === '/cv/view') return;
    let isMounted = true;
    generateQRDataUrl(sharePublicUrl, {
      color: '#0F172A',
      size: 240,
      margin: 1,
    }).then((url) => {
      if (isMounted) {
        setShareQrDataUrl(url);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [sharePublicUrl]);

  // Share Actions Handlers
  const handleCopyShareUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sharePublicUrl);
      setIsShareCopied(true);
      setToastMessage(lang === 'en' ? 'Public link copied to clipboard!' : 'Đã sao chép liên kết xem trực tuyến công khai!');
      setTimeout(() => {
        setIsShareCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePublicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      lang === 'en'
        ? `Check out the interactive resume and portfolio of ${cv.name} (${cv.role}):`
        : `Xem hồ sơ CV trực tuyến & portfolio của ${cv.name} (${cv.role}):`
    );
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(sharePublicUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(
      lang === 'en'
        ? `[Resume] ${cv.name} - ${cv.role}`
        : `[Hồ sơ ứng tuyển] ${cv.name} - ${cv.role}`
    );
    const body = encodeURIComponent(
      lang === 'en'
        ? `Dear Hiring Team,\n\nPlease find my verified digital resume and credentials at:\n${sharePublicUrl}\n\nBest regards,\n${cv.name}`
        : `Kính gửi Quý nhà tuyển dụng,\n\nEm xin gửi đường link xem trực tuyến hồ sơ CV và portfolio của em tại:\n${sharePublicUrl}\n\nTrân trọng,\n${cv.name}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleDownloadShareQr = () => {
    if (!shareQrDataUrl) return;
    const a = document.createElement('a');
    a.href = shareQrDataUrl;
    a.download = `QR_${(cv.name || 'CV').replace(/\s+/g, '_')}_Public_View.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToastMessage(lang === 'en' ? 'Downloaded QR image!' : 'Đã tải ảnh mã QR xem trực tuyến!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Image Export Handler (PNG / JPG 300 DPI)
  const handleExportImage = async (format: ImageExportFormat, resolution: ExportResolution = exportResolution) => {
    setIsExportingImage(true);
    setIsExportMenuOpen(false);
    const isCoverLetter = docMode === 'cover_letter';
    const currentLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;
    const targetElementId = isCoverLetter ? 'cover-letter-paper' : 'cv-paper';
    const baseName = isCoverLetter
      ? (currentLetter.senderName || cv.name || 'Nguyen_Duc_Anh')
      : (cv.name || 'Nguyen_Duc_Anh');
    const sanitizedName = baseName.trim().replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
    const docTag = isCoverLetter ? 'CoverLetter' : 'CV';
    const fileName = `${sanitizedName}_${docTag}_${template}_${lang.toUpperCase()}_${resolution}x`;

    setToastMessage(
      lang === 'en'
        ? `Rendering high-res ${format.toUpperCase()} (${resolution === 2 ? '300 DPI' : `${resolution}x`})...`
        : `Đang xử lý xuất ảnh ${format.toUpperCase()} (${resolution === 2 ? 'chuẩn 300 DPI' : `${resolution}x`})...`
    );

    try {
      const result = await exportCVToImage({
        elementId: targetElementId,
        format,
        resolution,
        fileName,
        quality: 0.95,
      });

      if (result.success) {
        setToastMessage(
          lang === 'en'
            ? `Exported ${format.toUpperCase()} image successfully!`
            : `Đã tải ảnh ${format.toUpperCase()} sắc nét về máy thành công!`
        );
      } else {
        setToastMessage(result.error || (lang === 'en' ? 'Failed to export image.' : 'Có lỗi khi xuất ảnh.'));
      }
    } catch (err: any) {
      setToastMessage(err?.message || (lang === 'en' ? 'Export failed.' : 'Xuất ảnh thất bại.'));
    } finally {
      setIsExportingImage(false);
    }
  };

  // Matching Cover Letter Action Handlers
  const handleUpdateCoverLetterField = (field: keyof CoverLetterData, value: string) => {
    if (lang === 'vi') {
      setCoverLetterVi((prev) => ({ ...prev, [field]: value }));
    } else {
      setCoverLetterEn((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleApplyCoverLetterPreset = (preset: CoverLetterPreset) => {
    setActiveCoverLetterPresetId(preset.id);
    const data = lang === 'en' ? preset.dataEn : preset.dataVi;
    if (lang === 'vi') {
      setCoverLetterVi((prev) => ({
        ...prev,
        ...data,
      }));
    } else {
      setCoverLetterEn((prev) => ({
        ...prev,
        ...data,
      }));
    }
    setToastMessage(
      lang === 'en'
        ? `Applied "${preset.titleEn}" cover letter preset!`
        : `Đã áp dụng mẫu thư: "${preset.titleVi}"!`
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncCoverLetterWithCV = () => {
    const activeCv = cv;
    const updater = (prev: CoverLetterData): CoverLetterData => ({
      ...prev,
      senderName: activeCv.name || prev.senderName,
      senderRole: activeCv.role || prev.senderRole,
      senderEmail: activeCv.email || prev.senderEmail,
      senderPhone: activeCv.phone || prev.senderPhone,
      senderLocation: activeCv.location || prev.senderLocation,
      senderWebsite: activeCv.website || prev.senderWebsite,
    });

    if (lang === 'vi') {
      setCoverLetterVi(updater);
    } else {
      setCoverLetterEn(updater);
    }
    setToastMessage(
      lang === 'en'
        ? 'Cover letter sender info synchronized from CV!'
        : 'Đã đồng bộ thông tin ứng viên từ CV vào Thư xin việc!'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCoverLetterText = () => {
    const currentLetter = lang === 'vi' ? coverLetterVi : coverLetterEn;
    const fullText = [
      `${currentLetter.senderName.toUpperCase()}`,
      `${currentLetter.senderRole} | ${currentLetter.senderEmail} | ${currentLetter.senderPhone} | ${currentLetter.senderLocation}`,
      currentLetter.senderWebsite ? `Website: ${currentLetter.senderWebsite}` : '',
      '',
      `${currentLetter.date}`,
      '',
      `Kính gửi: ${currentLetter.recipientName}`,
      `${currentLetter.recipientRole}`,
      `${currentLetter.companyName}`,
      `${currentLetter.companyAddress}`,
      '',
      `V/v: Ứng tuyển vị trí ${currentLetter.jobTitle}`,
      '',
      `${currentLetter.salutation}`,
      '',
      `${currentLetter.opening}`,
      '',
      `${currentLetter.body1}`,
      '',
      `${currentLetter.body2}`,
      '',
      `${currentLetter.closing}`,
      '',
      `${currentLetter.signOff}`,
      `${currentLetter.senderName}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      setIsCoverLetterCopied(true);
      setToastMessage(
        lang === 'en'
          ? 'Cover letter text copied to clipboard!'
          : 'Đã sao chép toàn bộ nội dung thư xin việc vào bộ nhớ tạm!'
      );
      setTimeout(() => {
        setIsCoverLetterCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  // Multiple CV Profiles Action Handlers
  const handleSwitchProfile = (targetProfileId: string) => {
    if (targetProfileId === activeProfileId) {
      setIsProfileMenuOpen(false);
      return;
    }

    // 1. Sync current active state into profiles list
    const activeCvVi = lang === 'vi' ? cv : cvVi;
    const activeCvEn = lang === 'en' ? cv : cvEn;

    const updatedProfiles = profiles.map((p) => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          updatedAt: new Date().toISOString(),
          cvVi: activeCvVi,
          cvEn: activeCvEn,
          activeLang: lang,
          coverLetterVi,
          coverLetterEn,
          template,
          accentColor,
          fontFamily,
          isCompact,
          typography: typographyConfig,
          sectionOrder,
          sectionVisibility,
        };
      }
      return p;
    });

    // 2. Locate target profile
    const target = updatedProfiles.find((p) => p.id === targetProfileId);
    if (!target) return;

    // 3. Load target profile into active state
    const targetVi = sanitizeCVTechStuttering({ ...target.cvVi, customLinks: ensureCustomLinks(target.cvVi) });
    const targetEn = sanitizeCVTechStuttering({ ...target.cvEn, customLinks: ensureCustomLinks(target.cvEn) });
    setCvVi(targetVi);
    setCvEn(targetEn);
    setLang(target.activeLang || 'vi');
    setCvState(target.activeLang === 'en' ? targetEn : targetVi);
    if (target.coverLetterVi) setCoverLetterVi(target.coverLetterVi);
    if (target.coverLetterEn) setCoverLetterEn(target.coverLetterEn);
    setTemplate((target.template as TemplateId) || 'rabbit');
    setAccentColor((target.accentColor as any) || 'blue');
    setFontFamily((target.fontFamily as CVFontFamily) || 'inter');
    setIsCompact(target.isCompact ?? false);
    if (target.typography) {
      setTypographyConfig(target.typography);
    } else {
      setTypographyConfig(DEFAULT_TYPOGRAPHY_CONFIG);
    }
    setSectionOrder(target.sectionOrder?.length ? (target.sectionOrder as SectionKey[]) : DEFAULT_SECTION_ORDER);
    setSectionVisibility(target.sectionVisibility || DEFAULT_SECTION_VISIBILITY);

    setActiveProfileId(target.id);
    setProfiles(updatedProfiles);
    saveProfilesToStorage(updatedProfiles, target.id);
    setIsProfileMenuOpen(false);

    setToastMessage(
      lang === 'en'
        ? `Switched to profile: ${target.name}`
        : `Đã chuyển sang phiên bản: ${target.name}`
    );
  };

  const handleDuplicateProfile = (sourceId: string) => {
    const source = profiles.find((p) => p.id === sourceId);
    if (!source) return;

    // Sync current active data if duplicating active
    let sourceData = source;
    if (source.id === activeProfileId) {
      sourceData = {
        ...source,
        cvVi: lang === 'vi' ? cv : cvVi,
        cvEn: lang === 'en' ? cv : cvEn,
        activeLang: lang,
        coverLetterVi,
        coverLetterEn,
        template,
        accentColor,
        fontFamily,
        isCompact,
        typography: typographyConfig,
        sectionOrder,
        sectionVisibility,
      };
    }

    const cloned = duplicateCVProfile(sourceData);
    const nextProfiles = [...profiles, cloned];
    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, cloned.id);
    handleSwitchProfile(cloned.id);

    setToastMessage(
      lang === 'en'
        ? `Duplicated profile: ${cloned.name}`
        : `Đã nhân bản phiên bản: ${cloned.name}`
    );
  };

  const handleCreateNewProfile = () => {
    if (!newProfileName.trim()) return;

    const baseVi = newProfileCloneFromCurrent ? (lang === 'vi' ? cv : cvVi) : defaultCVData;
    const baseEn = newProfileCloneFromCurrent ? (lang === 'en' ? cv : cvEn) : defaultEnglishCVData;

    const created = createNewCVProfile(
      newProfileName,
      newProfileRole,
      baseVi,
      baseEn,
      {
        template: newProfileCloneFromCurrent ? template : 'rabbit',
        accentColor: newProfileCloneFromCurrent ? accentColor : 'blue',
        fontFamily: newProfileCloneFromCurrent ? fontFamily : 'inter',
        isCompact: newProfileCloneFromCurrent ? isCompact : false,
        typography: newProfileCloneFromCurrent ? typographyConfig : DEFAULT_TYPOGRAPHY_CONFIG,
        sectionOrder: newProfileCloneFromCurrent ? sectionOrder : DEFAULT_SECTION_ORDER,
        sectionVisibility: newProfileCloneFromCurrent ? sectionVisibility : DEFAULT_SECTION_VISIBILITY,
        activeLang: lang,
        coverLetterVi: newProfileCloneFromCurrent ? coverLetterVi : createSyncedCoverLetter('vi', baseVi),
        coverLetterEn: newProfileCloneFromCurrent ? coverLetterEn : createSyncedCoverLetter('en', baseEn),
      }
    );

    const nextProfiles = [...profiles, created];
    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, created.id);
    handleSwitchProfile(created.id);

    setShowNewProfileModal(false);
    setNewProfileName('');
    setNewProfileRole('');

    setToastMessage(
      lang === 'en'
        ? `Created new profile: ${created.name}`
        : `Đã tạo phiên bản CV mới: ${created.name}`
    );
  };

  const handleRenameProfile = (profileId: string, newName: string) => {
    if (!newName.trim()) return;

    const nextProfiles = profiles.map((p) => {
      if (p.id === profileId) {
        return {
          ...p,
          name: newName.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    setProfiles(nextProfiles);
    saveProfilesToStorage(nextProfiles, activeProfileId);
    setEditingProfileId(null);
    setEditingProfileName('');

    setToastMessage(lang === 'en' ? 'Profile renamed!' : 'Đã đổi tên phiên bản thành công!');
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      alert(lang === 'en' ? 'Cannot delete the only remaining profile!' : 'Không thể xóa phiên bản CV duy nhất còn lại!');
      return;
    }

    const target = profiles.find((p) => p.id === profileId);
    const confirmMsg =
      lang === 'en'
        ? `Are you sure you want to delete profile "${target?.name}"?`
        : `Bạn có chắc chắn muốn xóa phiên bản "${target?.name}" không?`;

    if (!confirm(confirmMsg)) return;

    const remaining = profiles.filter((p) => p.id !== profileId);
    let nextActiveId = activeProfileId;
    if (activeProfileId === profileId) {
      nextActiveId = remaining[0].id;
    }

    setProfiles(remaining);
    saveProfilesToStorage(remaining, nextActiveId);

    if (activeProfileId === profileId) {
      handleSwitchProfile(nextActiveId);
    }

    setToastMessage(lang === 'en' ? 'Profile deleted.' : 'Đã xóa phiên bản CV.');
  };

  // CV Parser Action Handlers
  const handleParseFile = async (file: File) => {
    setIsParsingCV(true);
    setParseError(null);
    setImportFile(file);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || (lang === 'en' ? 'Failed to parse file.' : 'Không thể trích xuất nội dung từ file.'));
      }
      setParsedResult(data.result);
      setImportPreviewTab('profile');
    } catch (err: any) {
      setParseError(err.message || (lang === 'en' ? 'An error occurred while parsing.' : 'Đã xảy ra lỗi khi phân tích file.'));
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleParseRawText = async (text: string, title?: string) => {
    if (!text || text.trim().length < 20) {
      setParseError(lang === 'en' ? 'Please paste at least 20 characters of CV content.' : 'Vui lòng dán ít nhất 20 ký tự nội dung CV.');
      return;
    }
    setIsParsingCV(true);
    setParseError(null);
    try {
      const res = await fetch('/api/cv/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fileName: title || (lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán') }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || (lang === 'en' ? 'Failed to parse text.' : 'Không thể phân tích nội dung văn bản.'));
      }
      setParsedResult(data.result);
      setImportPreviewTab('profile');
    } catch (err: any) {
      setParseError(err.message || (lang === 'en' ? 'An error occurred while parsing.' : 'Đã xảy ra lỗi khi trích xuất.'));
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleApplyImportedCV = (mode: 'new_profile' | 'overwrite_current') => {
    if (!parsedResult) return;
    const importedCV = parsedResult.cv;
    const targetLang = parsedResult.detectedLang;

    if (mode === 'new_profile') {
      const profileName = parsedResult.fileName
        ? `CV ${parsedResult.fileName.replace(/\.[^/.]+$/, '')}`
        : `CV ${importedCV.name || 'Imported'}`;

      const baseVi = targetLang === 'vi' ? importedCV : { ...defaultCVData, ...importedCV };
      const baseEn = targetLang === 'en' ? importedCV : { ...defaultEnglishCVData, ...importedCV };

      const newProfile = createNewCVProfile(
        profileName,
        importedCV.role || 'Software Engineer',
        baseVi,
        baseEn,
        {
          activeLang: targetLang,
          template: template || 'rabbit',
          accentColor: accentColor || 'blue',
          fontFamily: fontFamily || 'inter',
          isCompact: isCompact,
          sectionOrder: sectionOrder,
          sectionVisibility: sectionVisibility,
        }
      );

      const nextProfiles = [...profiles, newProfile];
      saveProfilesToStorage(nextProfiles, newProfile.id);
      setProfiles(nextProfiles);
      handleSwitchProfile(newProfile.id);
      setShowImportModal(false);
      setParsedResult(null);
      setImportFile(null);
      setImportRawText('');
      setToastMessage(lang === 'en' ? 'Created new CV Profile from imported file!' : 'Đã tạo phiên bản CV mới từ file trích xuất thành công!');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      if (targetLang === 'vi') {
        setCvVi(importedCV);
        if (lang === 'vi') setCvState(importedCV);
      } else {
        setCvEn(importedCV);
        if (lang === 'en') setCvState(importedCV);
      }
      setShowImportModal(false);
      setParsedResult(null);
      setImportFile(null);
      setImportRawText('');
      setToastMessage(lang === 'en' ? 'CV updated from imported file!' : 'Đã cập nhật dữ liệu CV từ file thành công!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Reset to Portfolio Data
  const handleReset = () => {
    const confirmMsg =
      lang === 'en'
        ? 'Reset current English CV back to default?'
        : 'Khôi phục toàn bộ nội dung CV về mặc định theo Portfolio?';
    if (confirm(confirmMsg)) {
      if (lang === 'en') {
        setCv(defaultEnglishCVData);
        setCvEn(defaultEnglishCVData);
      } else {
        setCv(defaultCVData);
        setCvVi(defaultCVData);
      }
      localStorage.removeItem('ducanh_cv_data');
      setToastMessage(lang === 'en' ? 'Reset to default successfully!' : 'Đã khôi phục về mặc định!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const activeTemplateDef = TEMPLATES_COLLECTION.find((t) => t.id === template) || TEMPLATES_COLLECTION[0];

  const filteredTemplates = TEMPLATES_COLLECTION.filter((t) =>
    galleryFilter === 'all' ? true : t.category === galleryFilter
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0B0F19] text-neutral-200 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 right-6 z-[99999] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Avatar Upload from Computer */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        className="hidden"
        onChange={handleAvatarFileChange}
      />

      {/* Hidden File Input for JSON CV Data Import */}
      <input
        ref={jsonFileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleJSONFileChange}
      />

      {/* ================= RECRUITER PUBLIC TOPBAR (56px) ================= */}
      {isPublicView && !isPreviewMode && (
        <header className="no-print h-14 min-h-[56px] max-h-[56px] bg-[#0D111A]/95 border-b border-white/10 px-3 sm:px-5 flex items-center justify-between z-40 select-none flex-shrink-0 backdrop-blur-md">
          {/* Cụm Trái: Candidate Info & Badge */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            {cv.avatar ? (
              <img
                src={cv.avatar}
                alt={cv.name}
                className="w-8 h-8 rounded-full object-cover border border-cyan-400/50 shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs flex-shrink-0">
                {cv.name ? cv.name.charAt(0) : 'CV'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[120px] sm:max-w-[180px]">
                  {cv.name || 'Nguyễn Đức Anh'}
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium font-mono shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.publicOpenToWork}</span>
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 truncate hidden xs:block max-w-[160px] sm:max-w-[220px]">
                {cv.role || 'Fullstack Developer'}
              </div>
            </div>
          </div>

          {/* Cụm Giữa: Switcher Bản CV / Thư xin việc & Ngôn ngữ VI/EN */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Doc mode toggle if enabled */}
            {shareIncludeCoverLetter && (
              <div className="flex items-center bg-[#161B26] border border-white/10 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setDocMode('cv')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                    docMode === 'cv'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.publicResumeTab}</span>
                  <span className="md:hidden">CV</span>
                </button>
                <button
                  onClick={() => setDocMode('cover_letter')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                    docMode === 'cover_letter'
                      ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{t.publicCoverLetterTab}</span>
                  <span className="md:hidden">Letter</span>
                </button>
              </div>
            )}

            {/* Language Toggle VI / EN */}
            <button
              onClick={handleToggleLang}
              className="px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
              title={lang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
            </button>

            {/* Template Quick Switcher Dropdown for Recruiters */}
            <div className="relative">
              <button
                onClick={() => setPublicTemplateMenuOpen(!publicTemplateMenuOpen)}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title={t.publicChangeLayout}
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
                <span className="capitalize">{activeTemplateDef.name}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {publicTemplateMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#161B26] border border-white/10 rounded-xl shadow-2xl p-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-white/5 mb-1">
                    {t.publicChangeLayout} (10 Mẫu)
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {TEMPLATES_COLLECTION.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => {
                          setTemplate(tpl.id);
                          setPublicTemplateMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                          template === tpl.id
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                            : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="capitalize">{tpl.name}</span>
                        <span className="text-[10px] text-neutral-500">{tpl.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Zoom Controls on Public View */}
            <div className="hidden sm:flex items-center bg-[#161B26] border border-white/10 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
                title="Thu nhỏ (-10%)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="px-2 py-0.5 font-mono text-[11px] text-neutral-300 hover:text-white font-medium select-none cursor-pointer"
                title="Reset về 100%"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
                title="Phóng to (+10%)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Cụm Phải: Nút Quét QR Mobile, Tải PDF & Liên Hệ Ứng Viên */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Mobile QR Viewer Button */}
            <button
              onClick={() => setIsPublicQrModalOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
              title={t.publicScanQrBtn}
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{t.publicScanQrBtn}</span>
            </button>

            {/* Copy Public Link Button */}
            <button
              onClick={handleCopyShareUrl}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center space-x-1"
              title={t.publicShareLink}
            >
              {isShareCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="hidden xl:inline">{isShareCopied ? (lang === 'en' ? 'Copied' : 'Đã sao chép') : t.publicShareLink}</span>
            </button>

            {/* Export / Download PDF if allowed */}
            {shareAllowDownload && (
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
                title={t.publicDownloadPdf}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.publicDownloadPdf}</span>
              </button>
            )}

            {/* Contact Candidate CTA Button */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              title={t.publicContactBtn}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.publicContactBtn}</span>
            </button>
          </div>
        </header>
      )}

      {/* ================= 1. MINIMAL TOP-BAR (56px) - STUDIO EDITOR ================= */}
      {!isPreviewMode && !isPublicView && (
        <header className="no-print h-14 min-h-[56px] max-h-[56px] bg-[#111827] border-b border-white/10 px-3 sm:px-5 flex items-center justify-between z-40 select-none flex-shrink-0">
          {/* Cụm Trái: Quay lại, Tên CV, Badge Đã lưu */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Link
              href="/"
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
              title={lang === 'en' ? 'Back to Portfolio' : 'Quay lại Portfolio'}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="h-4 w-px bg-white/10 flex-shrink-0" />

            <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-white max-w-[110px] sm:max-w-[160px] truncate" title={cv.name || 'Untitled CV'}>
                {cv.name || 'Untitled CV'}
              </span>
              <span className="text-neutral-500 text-xs flex-shrink-0">/</span>

              {/* CV Profile Switcher Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all cursor-pointer group shadow-xs select-none"
                  title={lang === 'en' ? 'Switch or manage CV Profiles' : 'Nhấp để đổi hoặc quản lý các phiên bản CV'}
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-medium text-xs text-cyan-300 max-w-[110px] sm:max-w-[150px] md:max-w-[180px] truncate">
                    {activeProfile?.name || 'Hồ sơ CV'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 font-mono hidden lg:inline-block">
                    {profiles.length} bản
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-neutral-400 group-hover:text-white transition-transform ${
                      isProfileMenuOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {/* Profile Switcher Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-[#161B26] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 select-none">
                    <div className="px-2 py-1 mb-1.5 flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {lang === 'en' ? 'CV PROFILES' : 'CÁC PHIÊN BẢN CV'} ({profiles.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setShowNewProfileModal(true);
                        }}
                        className="flex items-center space-x-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{lang === 'en' ? 'New Profile' : 'Tạo mới'}</span>
                      </button>
                    </div>

                    {/* Profiles List */}
                    <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                      {profiles.map((p) => {
                        const isActive = p.id === activeProfileId;
                        const isEditing = editingProfileId === p.id;

                        return (
                          <div
                            key={p.id}
                            className={`p-2 rounded-lg border transition-all ${
                              isActive
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                                : 'bg-white/5 border-transparent hover:border-white/10 text-neutral-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              {isEditing ? (
                                <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                                  <input
                                    type="text"
                                    value={editingProfileName}
                                    onChange={(e) => setEditingProfileName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleRenameProfile(p.id, editingProfileName);
                                      if (e.key === 'Escape') setEditingProfileId(null);
                                    }}
                                    autoFocus
                                    className="w-full bg-black/60 border border-cyan-500/50 rounded px-2 py-0.5 text-xs text-white outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRenameProfile(p.id, editingProfileName)}
                                    className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                                    title="Lưu tên"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingProfileId(null)}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-300 cursor-pointer"
                                    title="Hủy"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSwitchProfile(p.id)}
                                    className="flex-1 text-left min-w-0 cursor-pointer"
                                  >
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-semibold text-xs truncate">{p.name}</span>
                                      {isActive && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono shrink-0">
                                          Đang mở
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                                      {p.targetRole || 'Software Engineer'} • Mẫu: <span className="capitalize">{p.template}</span> • {p.activeLang === 'en' ? 'EN' : 'VI'}
                                    </div>
                                  </button>

                                  <div className="flex items-center space-x-0.5 shrink-0">
                                    {/* Duplicate */}
                                    <button
                                      type="button"
                                      onClick={() => handleDuplicateProfile(p.id)}
                                      className="p-1 rounded text-neutral-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                                      title="Nhân bản phiên bản này"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>

                                    {/* Rename */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProfileId(p.id);
                                        setEditingProfileName(p.name);
                                      }}
                                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                      title="Đổi tên phiên bản"
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>

                                    {/* Delete */}
                                    {profiles.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProfile(p.id)}
                                        className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                                        title="Xóa phiên bản này"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Create New Profile Button */}
                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setShowNewProfileModal(true);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? '+ Create New CV Profile' : '+ Thêm phiên bản CV mới'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setShowImportModal(true);
                          setParsedResult(null);
                          setParseError(null);
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 font-medium flex items-center justify-center space-x-1.5 transition-colors cursor-pointer text-xs border border-emerald-500/20"
                      >
                        <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'en' ? 'Extract CV from PDF / Word →' : 'Trích xuất CV từ PDF / Word →'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Indicator trạng thái lưu dạng text nhỏ màu xám mờ ngay cạnh dropdown chọn phiên bản */}
              <div className="flex items-center space-x-1 text-[11px] text-neutral-400/80 select-none pl-1 flex-shrink-0">
                {isSaving ? (
                  <span className="flex items-center space-x-1 text-cyan-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">{lang === 'en' ? 'Saving...' : 'Đang lưu...'}</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-neutral-400/80 hover:text-neutral-300">
                    <Check className="w-3 h-3 text-emerald-400/80" />
                    <span className="hidden sm:inline">{lang === 'en' ? 'Saved' : 'Đã lưu'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cụm Phải: Undo / Redo, Xem trước, Chia sẻ (icon-only), Nút chính Xuất PDF */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Undo / Redo Controls */}
            <div className="flex items-center bg-[#161B26] border border-white/10 rounded-lg p-0.5 text-xs shadow-xs">
              <button
                type="button"
                onClick={handleUndo}
                disabled={undoHistoryIndex <= 0}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                  undoHistoryIndex > 0
                    ? 'text-neutral-200 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer shadow-xs'
                    : 'text-neutral-500/60 cursor-not-allowed opacity-50'
                }`}
                title={
                  undoHistoryIndex > 0
                    ? (lang === 'en' ? `Undo (${undoHistoryIndex} action${undoHistoryIndex > 1 ? 's' : ''}) - Ctrl+Z` : `Hoàn tác (${undoHistoryIndex} thao tác) - Ctrl+Z`)
                    : (lang === 'en' ? 'Undo (No previous action - Ctrl+Z)' : 'Hoàn tác (Chưa có thao tác nào - Ctrl+Z)')
                }
                aria-label="Undo"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-3 bg-white/10 my-auto" />
              <button
                type="button"
                onClick={handleRedo}
                disabled={undoHistoryIndex >= undoHistory.length - 1}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                  undoHistoryIndex < undoHistory.length - 1
                    ? 'text-neutral-200 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer shadow-xs'
                    : 'text-neutral-500/60 cursor-not-allowed opacity-50'
                }`}
                title={
                  undoHistoryIndex < undoHistory.length - 1
                    ? (lang === 'en' ? `Redo (${undoHistory.length - 1 - undoHistoryIndex} action${undoHistory.length - 1 - undoHistoryIndex > 1 ? 's' : ''}) - Ctrl+Y` : `Làm lại (${undoHistory.length - 1 - undoHistoryIndex} thao tác) - Ctrl+Y`)
                    : (lang === 'en' ? 'Redo (No undone action - Ctrl+Y)' : 'Làm lại (Chưa có thao tác hoàn tác - Ctrl+Y)')
                }
                aria-label="Redo"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nút Xem trước (icon mắt + text ngắn) */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/10 bg-[#161B26] hover:bg-white/5 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title={lang === 'en' ? 'Preview Fullscreen (ESC to exit)' : 'Xem trước toàn màn hình (bấm ESC để thoát)'}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{lang === 'en' ? 'Preview' : 'Xem trước'}</span>
            </button>

            {/* Nút Chia sẻ (chỉ hiện icon Share có tooltip) */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center justify-center p-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-xs"
              title={t.shareModalTitle || (lang === 'en' ? 'Share Public Link' : 'Chia sẻ đường dẫn công khai')}
              aria-label="Share CV Link"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {/* Nút chính Xuất PDF (Màu nổi bật nhất) */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                disabled={isExportingImage}
                className="flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
                title={lang === 'en' ? 'Export CV (PDF, PNG, JPG)' : 'Xuất CV (PDF, PNG, JPG)'}
              >
                {isExportingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'en' ? 'Exporting...' : 'Đang xuất...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">{lang === 'en' ? 'Export PDF' : 'Xuất PDF'}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
                  </>
                )}
              </button>

              {/* Dropdown Menu */}
              {isExportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#161B26] border border-white/10 rounded-xl shadow-2xl p-2.5 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 select-none">
                  <div className="px-2 py-1 mb-1.5 flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      {lang === 'en' ? 'EXPORT CV & DOCUMENTS' : 'ĐỊNH DẠNG XUẤT HỒ SƠ'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                      A4 • 210x297mm
                    </span>
                  </div>

                  {/* Option 1: PDF Export */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handlePrint();
                    }}
                    className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {lang === 'en' ? 'Export PDF (Print Ready)' : 'Xuất PDF chuẩn in ấn'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">.pdf</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {lang === 'en' ? 'Vector crisp quality, standard A4 layout for print & ATS.' : 'Chuẩn giấy in A4, giữ nguyên chữ vector sắc nét, tối ưu cho máy quét ATS.'}
                      </p>
                    </div>
                  </button>

                  {/* Option 2: PNG High-Res */}
                  <button
                    type="button"
                    onClick={() => handleExportImage('png', exportResolution)}
                    className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors shrink-0 mt-0.5">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                          <span>{lang === 'en' ? 'Export High-Res PNG' : 'Xuất ảnh PNG sắc nét'}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                            {exportResolution === 2 ? '300 DPI' : `${exportResolution}x`}
                          </span>
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">.png</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {lang === 'en' ? 'Ultra sharp retina quality, perfect for sending via Zalo, LinkedIn, Messenger.' : 'Độ phân giải cao siêu nét, không vỡ hạt, cực tiện gửi xem nhanh qua Zalo, LinkedIn.'}
                      </p>
                    </div>
                  </button>

                  {/* Option 3: JPG High-Quality */}
                  <button
                    type="button"
                    onClick={() => handleExportImage('jpeg', exportResolution)}
                    className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left cursor-pointer group mt-1"
                  >
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors shrink-0 mt-0.5">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {lang === 'en' ? 'Export High-Quality JPG' : 'Xuất ảnh JPG chất lượng cao'}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">.jpg</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                        {lang === 'en' ? 'Compressed 95% quality, smaller file size, fast preview on phones.' : 'Nén 95% chất lượng cao, dung lượng nhẹ, mở cực nhanh trên mọi thiết bị di động.'}
                      </p>
                    </div>
                  </button>

                  {/* Resolution Selector Strip */}
                  <div className="mt-2 pt-2 border-t border-white/5 px-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {lang === 'en' ? 'Image Resolution:' : 'Độ phân giải ảnh:'}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {exportResolution === 1 ? '794 x 1123 px' : exportResolution === 2 ? '1588 x 2246 px (300 DPI)' : '2382 x 3369 px (Ultra 4K)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-0.5 bg-neutral-900/80 rounded-lg border border-white/5">
                      {[
                        { res: 1 as const, label: '1x Web' },
                        { res: 2 as const, label: '2x HD ⭐' },
                        { res: 3 as const, label: '3x Ultra' },
                      ].map(({ res, label }) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setExportResolution(res)}
                          className={`py-1 text-[10px] font-medium rounded transition-all cursor-pointer ${
                            exportResolution === res
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 4: JSON Backup */}
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        setShowDataModal(true);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white text-[11px] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Database className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{lang === 'en' ? 'Backup / Restore (.JSON)' : 'Sao lưu / Khôi phục (.JSON)'}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-neutral-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* ================= 2. MAIN WORKSPACE AREA (RAIL + DRAWER + CANVAS) ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ================= A. LEFT ICON RAIL (70px) ================= */}
        {!isPreviewMode && !isPublicView && (
          <nav className="no-print w-[70px] min-w-[70px] max-w-[70px] bg-[#111827] border-r border-white/10 flex flex-col items-center py-3 z-30 select-none flex-shrink-0 justify-between">
            {/* Top Tabs */}
            <div className="w-full flex flex-col items-center space-y-1">
              {[
                {
                  id: 'design' as const,
                  label: t.railDesign,
                  icon: <Palette className="w-5 h-5 mb-1" />,
                  badge: null,
                },
                {
                  id: 'content' as const,
                  label: t.railContent,
                  icon: <FileEdit className="w-5 h-5 mb-1" />,
                  badge: null,
                },
                {
                  id: 'layout' as const,
                  label: t.railLayout,
                  icon: <Sliders className="w-5 h-5 mb-1" />,
                  badge: null,
                },
                {
                  id: 'ai-ats' as const,
                  label: t.railAiAts,
                  icon: <Sparkles className="w-5 h-5 mb-1 text-amber-400" />,
                  badge: (
                    <span
                      className={`absolute -top-1 -right-2 text-[9px] font-bold font-mono px-1 py-0.2 rounded-full border leading-none shadow-xs ${
                        cvStrength.score >= 80
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : cvStrength.score >= 60
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-rose-500 text-white border-rose-400'
                      }`}
                    >
                      {cvStrength.score}%
                    </span>
                  ),
                },
                {
                  id: 'data' as const,
                  label: t.railData,
                  icon: <FileJson className="w-5 h-5 mb-1 text-cyan-400" />,
                  badge: null,
                },
                {
                  id: 'cover_letter' as const,
                  label: t.coverLetterNavTitle,
                  icon: <Mail className="w-5 h-5 mb-1 text-purple-400" />,
                  badge: (
                    <span className="absolute -top-1 -right-2 text-[8px] font-bold font-mono px-1 py-0.2 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 leading-none shadow-xs">
                      SYNC
                    </span>
                  ),
                },
              ].map((tab) => {
                const isActive = activeRailTab === tab.id && isDrawerOpen;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (activeRailTab === tab.id) {
                        setIsDrawerOpen(!isDrawerOpen);
                      } else {
                        setActiveRailTab(tab.id);
                        if (tab.id === 'cover_letter') {
                          setDocMode('cover_letter');
                        }
                        setIsDrawerOpen(true);
                      }
                    }}
                    className={`w-full py-3 px-1 flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                      isActive
                        ? 'text-white bg-white/10 border-l-2 border-indigo-500'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                    title={tab.label}
                  >
                    <div className="relative flex items-center justify-center">
                      {tab.icon}
                      {tab.badge}
                    </div>
                    <span className="text-[10px] font-medium tracking-tight text-center leading-tight mt-0.5">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom: Collapse / Expand Rail Toggle */}
            <div className="w-full px-2 pt-2 border-t border-white/10 flex flex-col items-center">
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="w-full py-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                title={isDrawerOpen ? (lang === 'en' ? 'Collapse Drawer' : 'Thu gọn bảng công cụ') : (lang === 'en' ? 'Expand Drawer' : 'Mở rộng bảng công cụ')}
              >
                {isDrawerOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </nav>
        )}

        {/* ================= B. TOOL DRAWER (320px) ================= */}
        {!isPreviewMode && !isPublicView && isDrawerOpen && (
          <aside className="no-print w-[320px] min-w-[320px] max-w-[85vw] bg-[#161B26] border-r border-white/10 flex flex-col z-20 flex-shrink-0 transition-all duration-200 ease-in-out absolute lg:relative inset-y-0 left-[70px] lg:left-0 shadow-2xl lg:shadow-none">
            {/* Drawer Header */}
            <div className="h-12 min-h-[48px] px-4 border-b border-white/10 flex items-center justify-between bg-[#111827]/60">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-white text-xs tracking-wide">
                  {activeRailTab === 'design' && t.drawerDesignTitle}
                  {activeRailTab === 'content' && t.drawerContentTitle}
                  {activeRailTab === 'layout' && t.drawerLayoutTitle}
                  {activeRailTab === 'ai-ats' && t.drawerAiAtsTitle}
                  {activeRailTab === 'data' && t.drawerDataTitle}
                  {activeRailTab === 'cover_letter' && t.coverLetterStudioTitle}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Thu gọn"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Independent Scroll) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-xs text-neutral-300">
              {/* ================= TAB 1: DESIGN ================= */}
              {activeRailTab === 'design' && (
                <div className="space-y-5">
                  {/* Active Template Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'CV TEMPLATE' : 'MẪU GIAO DIỆN'}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-medium">14 {lang === 'en' ? 'Templates' : 'Mẫu'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          <LayoutTemplate className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-xs">{activeTemplateDef.name}</div>
                          <div className="text-[10px] text-neutral-400">{activeTemplateDef.category}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowGalleryModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-medium text-[11px] transition-colors cursor-pointer"
                      >
                        {t.changeTemplate}
                      </button>
                    </div>

                    {/* Quick switcher thumbnails / cards */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {TEMPLATES_COLLECTION.slice(0, 6).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTemplate(item.id)}
                          className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            template === item.id
                              ? 'bg-indigo-500/15 border-indigo-500 text-white font-semibold shadow-xs'
                              : 'bg-[#111827] border-white/5 text-neutral-400 hover:text-neutral-200 hover:border-white/15'
                          }`}
                        >
                          <div className="text-[11px] truncate">{item.name}</div>
                          <div className="text-[9px] text-neutral-500 truncate">{item.category}</div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowGalleryModal(true)}
                      className="w-full py-1.5 text-center text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                    >
                      {lang === 'en' ? 'Browse all 14 templates →' : 'Khám phá tất cả 14 mẫu giao diện →'}
                    </button>
                  </div>

                  {/* Accent Color */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'ACCENT COLOR' : 'BẢNG MÀU CHỦ ĐẠO'}
                    </span>
                    <div className="grid grid-cols-5 gap-2 p-2.5 rounded-xl bg-[#111827] border border-white/10">
                      {(['blue', 'yellow', 'emerald', 'slate', 'rose'] as const).map((c) => {
                        const colorHex =
                          c === 'blue'
                            ? '#0284c7'
                            : c === 'yellow'
                            ? '#eab308'
                            : c === 'emerald'
                            ? '#10b981'
                            : c === 'slate'
                            ? '#475569'
                            : '#f43f5e';
                        const isSelected = accentColor === c;
                        return (
                          <button
                            key={c}
                            onClick={() => setAccentColor(c)}
                            className="flex flex-col items-center space-y-1 p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            title={`Màu ${c}`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full transition-transform ${
                                isSelected ? 'scale-115 ring-2 ring-white ring-offset-2 ring-offset-[#111827]' : 'opacity-70 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: colorHex }}
                            />
                            <span className="text-[9px] text-neutral-400 capitalize">{c}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Typography & Modern CV Fonts */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'TYPOGRAPHY & FONTS' : 'KIỂU CHỮ & PHÔNG CV'}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-medium">
                        {CV_FONT_OPTIONS.find((f) => f.id === fontFamily || (fontFamily === 'sans' && f.id === 'inter') || (fontFamily === 'serif' && f.id === 'merriweather') || (fontFamily === 'mono' && f.id === 'jetbrains'))?.name || 'Inter'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {lang === 'en'
                        ? 'Modern ATS-friendly fonts curated for tech, business & creative CVs.'
                        : 'Các phông chữ thịnh hành nhất hiện nay, chuẩn quét ATS và tối ưu trên trang A4.'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {CV_FONT_OPTIONS.map((f) => {
                        const isSelected =
                          fontFamily === f.id ||
                          (f.id === 'inter' && fontFamily === 'sans') ||
                          (f.id === 'merriweather' && fontFamily === 'serif') ||
                          (f.id === 'jetbrains' && fontFamily === 'mono');
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFontFamily(f.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500/50'
                                : 'bg-[#111827] border-white/5 text-neutral-300 hover:text-white hover:border-white/20 hover:bg-[#161f30]'
                            }`}
                          >
                            <div className="flex items-start justify-between w-full mb-1">
                              <span
                                className="text-xl font-bold leading-none"
                                style={{ fontFamily: f.fontFamilyCss }}
                              >
                                Aa
                              </span>
                              {isSelected ? (
                                <span className="w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-indigo-400/40" />
                              ) : null}
                            </div>
                            <div>
                              <div
                                className="text-xs font-semibold tracking-tight text-neutral-100 truncate"
                                style={{ fontFamily: f.fontFamilyCss }}
                              >
                                {f.name}
                              </div>
                              <div className="text-[9px] text-indigo-300/80 font-medium mt-0.5 truncate">
                                {lang === 'en' ? f.tagEn : f.tagVi}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fine-grain Typography Sliders */}
                  <div className="pt-3 border-t border-white/10">
                    <CVTypographySliders
                      config={typographyConfig}
                      onChange={setTypographyConfig}
                      lang={lang}
                    />
                  </div>

                  {/* Avatar photo card */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'AVATAR PHOTO' : 'ẢNH THẺ ĐẠI DIỆN'}
                    </span>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-medium">
                          {lang === 'en' ? 'Show photo on CV' : 'Hiển thị ảnh thẻ'}
                        </span>
                        <label className="flex items-center space-x-1.5 cursor-pointer text-[11px] text-neutral-300 select-none">
                          <input
                            type="checkbox"
                            checked={cv.showAvatar}
                            onChange={(e) => setCv({ ...cv, showAvatar: e.target.checked })}
                            className="rounded border-neutral-700 text-indigo-500 focus:ring-0 accent-indigo-500 cursor-pointer"
                          />
                          <span className="text-[10px] text-neutral-400">{cv.showAvatar ? (lang === 'en' ? 'Visible' : 'Đang bật') : (lang === 'en' ? 'Hidden' : 'Đang ẩn')}</span>
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          onClick={triggerAvatarUpload}
                          className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/10 hover:border-indigo-400 cursor-pointer relative group flex-shrink-0 bg-neutral-800 transition-colors"
                          title={lang === 'en' ? 'Click to upload photo from computer' : 'Nhấp để tải ảnh từ máy tính'}
                        >
                          {cv.avatar ? (
                            <img src={cv.avatar} alt={cv.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                              <Camera className="w-5 h-5" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Upload className="w-4 h-4 text-indigo-300" />
                          </div>
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <button
                            onClick={triggerAvatarUpload}
                            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center justify-center space-x-1.5 transition-colors text-xs shadow-xs cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Upload from device' : 'Tải ảnh từ máy tính'}</span>
                          </button>
                          {cv.avatar && (
                            <button
                              onClick={handleRemoveAvatar}
                              className="w-full py-1 px-3 rounded-lg border border-white/10 hover:border-rose-500 text-neutral-400 hover:text-rose-400 flex items-center justify-center space-x-1 transition-colors text-[11px] cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{lang === 'en' ? 'Remove photo' : 'Xóa ảnh'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic QR Code Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white text-xs">{t.qrCodeTitle}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeQrConfig.enabled}
                          onChange={(e) => handleUpdateQRConfig({ enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {t.qrCodeSubtitle}
                    </p>

                    {activeQrConfig.enabled && (
                      <div className="space-y-3 pt-1 border-t border-white/5">
                        {/* Target Selection Pills */}
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1.5 font-medium">
                            {t.qrTargetTypeLabel}
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {[
                              { id: 'website' as const, label: t.qrTargetWebsite, icon: '🌐' },
                              { id: 'linkedin' as const, label: t.qrTargetLinkedin, icon: '💼' },
                              { id: 'github' as const, label: t.qrTargetGithub, icon: '🐙' },
                              { id: 'vcard' as const, label: t.qrTargetVcard, icon: '📇' },
                              { id: 'custom' as const, label: t.qrTargetCustom, icon: '🔗' },
                            ].map((target) => (
                              <button
                                key={target.id}
                                type="button"
                                onClick={() => {
                                  const defaultLabel = getDefaultQRLabel(target.id, lang);
                                  handleUpdateQRConfig({
                                    targetType: target.id,
                                    labelVi: lang === 'vi' ? defaultLabel : activeQrConfig.labelVi,
                                    labelEn: lang === 'en' ? defaultLabel : activeQrConfig.labelEn,
                                  });
                                }}
                                className={`px-2 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center space-x-1.5 ${
                                  target.id === 'custom' ? 'col-span-2' : ''
                                } ${
                                  activeQrConfig.targetType === target.id
                                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 font-semibold shadow-xs'
                                    : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                                }`}
                              >
                                <span>{target.icon}</span>
                                <span className="truncate">{target.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Interactive URL Input for Website, LinkedIn, GitHub, or Custom */}
                        {activeQrConfig.targetType !== 'vcard' ? (
                          <div className="space-y-1.5 bg-neutral-900/80 p-2.5 rounded-lg border border-cyan-500/20">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-medium text-cyan-300 flex items-center space-x-1.5">
                                <span>
                                  {activeQrConfig.targetType === 'website' && '🌐'}
                                  {activeQrConfig.targetType === 'linkedin' && '💼'}
                                  {activeQrConfig.targetType === 'github' && '🐙'}
                                  {activeQrConfig.targetType === 'custom' && '🔗'}
                                </span>
                                <span>
                                  {activeQrConfig.targetType === 'website' && t.qrUrlWebsiteLabel}
                                  {activeQrConfig.targetType === 'linkedin' && t.qrUrlLinkedinLabel}
                                  {activeQrConfig.targetType === 'github' && t.qrUrlGithubLabel}
                                  {activeQrConfig.targetType === 'custom' && t.qrUrlCustomLabel}
                                </span>
                              </label>

                              {/* Quick Actions: Open & Copy */}
                              <div className="flex items-center space-x-1 text-[10px]">
                                {getQRTargetText(activeQrConfig, cv).startsWith('http') && (
                                  <a
                                    href={getQRTargetText(activeQrConfig, cv)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={t.qrOpenUrl}
                                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center space-x-1 transition-all cursor-pointer"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5 text-cyan-400" />
                                    <span>{t.qrOpenUrl}</span>
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleCopyQRUrl(getQRTargetText(activeQrConfig, cv))}
                                  title={t.qrCopyUrl}
                                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center space-x-1 transition-all cursor-pointer"
                                >
                                  {qrCopied ? (
                                    <>
                                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                                      <span className="text-emerald-400">{lang === 'en' ? 'Copied' : 'Đã chép'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-2.5 h-2.5" />
                                      <span>{t.qrCopyUrl}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Direct URL Input */}
                            <div className="relative">
                              <input
                                type="text"
                                value={
                                  activeQrConfig.targetType === 'website'
                                    ? (cv.website || '')
                                    : activeQrConfig.targetType === 'linkedin'
                                    ? (cv.linkedin || '')
                                    : activeQrConfig.targetType === 'github'
                                    ? (cv.github || '')
                                    : (activeQrConfig.customUrl || '')
                                }
                                onChange={(e) => handleUpdateQRTargetUrl(e.target.value)}
                                placeholder={
                                  activeQrConfig.targetType === 'website'
                                    ? 'https://ducanh.dev'
                                    : activeQrConfig.targetType === 'linkedin'
                                    ? 'https://linkedin.com/in/ducanh-vn'
                                    : activeQrConfig.targetType === 'github'
                                    ? 'https://github.com/ducanh-vn'
                                    : t.qrCustomUrlPlaceholder
                                }
                                className="w-full bg-[#0B0E17] border border-white/15 rounded-lg pl-2.5 pr-7 py-1.5 text-xs text-neutral-100 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                              />
                              {(activeQrConfig.targetType === 'website'
                                ? cv.website
                                : activeQrConfig.targetType === 'linkedin'
                                ? cv.linkedin
                                : activeQrConfig.targetType === 'github'
                                ? cv.github
                                : activeQrConfig.customUrl) && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQRTargetUrl('')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5 cursor-pointer"
                                  title={lang === 'en' ? 'Clear' : 'Xóa'}
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            <p className="text-[10px] text-neutral-400 leading-tight">
                              {lang === 'en'
                                ? '✨ Directly edits the target link & updates QR code live on canvas.'
                                : '✨ Chỉnh sửa trực tiếp đường link & tự động cập nhật mã QR trên CV.'}
                            </p>
                          </div>
                        ) : (
                          /* vCard details box when 'vcard' */
                          <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-medium text-cyan-300 flex items-center space-x-1.5">
                                <span>📇</span>
                                <span>{lang === 'en' ? 'vCard Contact Card' : 'Danh thiếp liên hệ vCard:'}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveRailTab('content');
                                  setContentSubTab('profile');
                                }}
                                className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center space-x-0.5 cursor-pointer"
                              >
                                <span>{lang === 'en' ? 'Edit Profile' : 'Sửa Profile'}</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[10px] text-neutral-400 leading-snug">
                              {t.qrUrlVcardNote}
                            </p>
                            <div className="bg-black/50 rounded p-2 text-[10px] space-y-0.5 text-neutral-300 font-mono border border-white/5">
                              <div className="truncate"><span className="text-neutral-500">Tên:</span> {cv.name || 'Nguyen Duc Anh'}</div>
                              <div className="truncate"><span className="text-neutral-500">Chức danh:</span> {cv.role || 'Software Engineer'}</div>
                              <div className="truncate"><span className="text-neutral-500">Email:</span> {cv.email || '(Chưa nhập)'}</div>
                              <div className="truncate"><span className="text-neutral-500">SĐT:</span> {cv.phone || '(Chưa nhập)'}</div>
                              <div className="truncate"><span className="text-neutral-500">Website:</span> {cv.website || '(Chưa nhập)'}</div>
                            </div>
                          </div>
                        )}

                        {/* Position & Color Controls */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <label className="block text-neutral-400 mb-1">{t.qrPositionLabel}</label>
                            <select
                              value={activeQrConfig.position}
                              onChange={(e) => handleUpdateQRConfig({ position: e.target.value as QRPosition })}
                              className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                            >
                              <option value="header">{t.qrPositionHeader}</option>
                              <option value="footer">{t.qrPositionFooter}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-neutral-400 mb-1">{t.qrColorModeLabel}</label>
                            <select
                              value={activeQrConfig.colorMode}
                              onChange={(e) => handleUpdateQRConfig({ colorMode: e.target.value as QRColorMode })}
                              className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                            >
                              <option value="dark">{t.qrColorDark}</option>
                              <option value="accent">{t.qrColorAccent}</option>
                            </select>
                          </div>
                        </div>

                        {/* Caption Input */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] text-neutral-400">{t.qrCaptionLabel}</label>
                            <label className="flex items-center space-x-1 text-[10px] text-neutral-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={activeQrConfig.showCaption}
                                onChange={(e) => handleUpdateQRConfig({ showCaption: e.target.checked })}
                                className="rounded bg-neutral-800 border-white/20 text-cyan-500 focus:ring-0"
                              />
                              <span>{t.qrShowCaption}</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            value={lang === 'en' ? activeQrConfig.labelEn : activeQrConfig.labelVi}
                            onChange={(e) => {
                              if (lang === 'en') {
                                handleUpdateQRConfig({ labelEn: e.target.value });
                              } else {
                                handleUpdateQRConfig({ labelVi: e.target.value });
                              }
                            }}
                            className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        {/* Live QR Preview in Drawer */}
                        {qrDataUrl && (
                          <div className="p-2.5 rounded-lg bg-neutral-900 border border-white/10 flex items-start space-x-3">
                            <div className="p-1 bg-white rounded-md shrink-0 shadow-xs mt-0.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={qrDataUrl} alt="QR Preview" className="w-12 h-12 object-contain" />
                            </div>
                            <div className="min-w-0 flex-1 text-[10px] space-y-1">
                              <div className="font-semibold text-white flex items-center justify-between">
                                <span>{t.qrLivePreview}</span>
                                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-normal">
                                  {lang === 'en' ? 'Auto-Sync' : 'Đồng bộ tức thì'}
                                </span>
                              </div>
                              <div
                                onClick={() => handleCopyQRUrl(getQRTargetText(activeQrConfig, cv))}
                                title={lang === 'en' ? 'Click to copy' : 'Nhấp để sao chép liên kết'}
                                className="text-cyan-300 font-mono text-[10px] break-all bg-black/60 p-1.5 rounded border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-colors flex items-start justify-between group"
                              >
                                <span className="line-clamp-2 leading-relaxed">{getQRTargetText(activeQrConfig, cv)}</span>
                                <span className="shrink-0 ml-1.5 text-neutral-400 group-hover:text-cyan-300">
                                  {qrCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </span>
                              </div>
                              {getQRTargetText(activeQrConfig, cv).startsWith('http') && (
                                <div className="flex items-center space-x-2 pt-0.5">
                                  <a
                                    href={getQRTargetText(activeQrConfig, cv)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                                  >
                                    <ExternalLink className="w-2.5 h-2.5" />
                                    <span>{t.qrOpenUrl} ↗</span>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyQRUrl(getQRTargetText(activeQrConfig, cv))}
                                    className="inline-flex items-center space-x-1 text-[10px] text-neutral-400 hover:text-white cursor-pointer"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>{qrCopied ? t.qrUrlCopied : t.qrCopyUrl}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= TAB 2: CONTENT ================= */}
              {activeRailTab === 'content' && (
                <div className="space-y-4">
                  {/* Mode hint banner */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[11px] text-neutral-300 leading-snug">
                      {lang === 'en'
                        ? 'Tip: Click text directly on the CV to edit, or use the forms below.'
                        : 'Mẹo: Nhấp trực tiếp vào chữ trên CV để sửa, hoặc dùng form bên dưới.'}
                    </span>
                  </div>

                  {/* Section navigation segmented pills with single sleek horizontal scrollbar & scroll arrows */}
                  <div className="relative -mx-4 bg-[#111827] border-b border-white/10 group">
                    {/* Left Scroll Button */}
                    {canScrollLeft && (
                      <button
                        type="button"
                        onClick={() => handleScrollSectionTabs('left')}
                        className="absolute left-0 inset-y-0 z-10 w-7 bg-gradient-to-r from-[#111827] via-[#111827]/95 to-transparent flex items-center justify-start pl-1 text-indigo-400 hover:text-white transition-all cursor-pointer shadow-md"
                        title={lang === 'en' ? 'Scroll left' : 'Cuộn sang trái'}
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4 shrink-0 drop-shadow" />
                      </button>
                    )}

                    {/* Horizontal Scrollable Tabs Bar with single sleek scrollbar */}
                    <div
                      ref={sectionTabsRef}
                      onScroll={checkSectionTabsScroll}
                      onWheel={handleSectionTabsWheel}
                      className="flex text-xs overflow-x-auto custom-scrollbar-x px-3 pb-1.5 pt-0.5 scroll-smooth"
                    >
                      {[
                        { id: 'profile', label: t.profileTab, isHidden: false },
                        ...sectionOrder.map((key) => {
                          const meta = CV_SECTIONS.find((s) => s.key === key);
                          const customSec = cv.customSections?.find((s) => s.id === key);
                          return {
                            id: key,
                            label: meta
                              ? lang === 'en'
                                ? meta.labelEn
                                : meta.labelVi
                              : customSec?.title || (lang === 'en' ? 'Custom' : 'Tùy chỉnh'),
                            isHidden: !sectionVisibility[key],
                          };
                        }),
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          data-active={drawerTab === tab.id ? 'true' : 'false'}
                          onClick={() => {
                            setDrawerTab(tab.id as any);
                          }}
                          className={`px-3 py-1.5 font-medium whitespace-nowrap transition-colors border-b-2 text-[11px] cursor-pointer flex items-center space-x-1 shrink-0 ${
                            drawerTab === tab.id
                              ? 'border-indigo-400 text-indigo-300 bg-white/5 font-semibold'
                              : 'border-transparent text-neutral-400 hover:text-neutral-200'
                          } ${tab.isHidden ? 'opacity-40' : ''}`}
                        >
                          <span className={tab.isHidden ? 'line-through' : ''}>{tab.label}</span>
                          {tab.isHidden && <span className="text-[9px] text-amber-400/80 font-mono no-underline">(ẩn)</span>}
                        </button>
                      ))}
                    </div>

                    {/* Right Scroll Button */}
                    {canScrollRight && (
                      <button
                        type="button"
                        onClick={() => handleScrollSectionTabs('right')}
                        className="absolute right-0 inset-y-0 z-10 w-7 bg-gradient-to-l from-[#111827] via-[#111827]/95 to-transparent flex items-center justify-end pr-1 text-indigo-400 hover:text-white transition-all cursor-pointer shadow-md"
                        title={lang === 'en' ? 'Scroll right' : 'Cuộn sang phải'}
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4 shrink-0 drop-shadow" />
                      </button>
                    )}
                  </div>

                  {/* Section forms */}
                  {drawerTab === 'profile' && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Full Name' : 'Họ và tên'}</label>
                        <input
                          type="text"
                          value={cv.name}
                          onChange={(e) => setCv({ ...cv, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Job Title / Role' : 'Chức danh / Vị trí'}</label>
                        <input
                          type="text"
                          value={cv.role}
                          onChange={(e) => setCv({ ...cv, role: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-neutral-400 mb-1">Email</label>
                          <input
                            type="email"
                            value={cv.email}
                            onChange={(e) => setCv({ ...cv, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Phone' : 'Số điện thoại'}</label>
                          <input
                            type="text"
                            value={cv.phone}
                            onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Location' : 'Địa chỉ / Khu vực'}</label>
                        <input
                          type="text"
                          value={cv.location}
                          onChange={(e) => setCv({ ...cv, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs"
                        />
                      </div>
                      {/* Custom Tech Links Manager */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                              <Globe className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{t.techLinksTitle}</span>
                            </h4>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                              {t.techLinksSubtitle}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {getActiveTechLinks(cv).length} {lang === 'en' ? 'active' : 'hiển thị'}
                          </span>
                        </div>

                        {/* Quick Presets Pills */}
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            {t.quickPresetsTitle}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_LINK_PRESETS.map((preset) => {
                              const alreadyAdded = ensureCustomLinks(cv).some((l: CustomTechLink) => l.platform === preset.platform);
                              return (
                                <button
                                  key={preset.platform}
                                  type="button"
                                  onClick={() => handleAddCustomLink(preset.platform)}
                                  className={`text-[10px] px-2 py-1 rounded-md border flex items-center space-x-1 transition-all cursor-pointer ${
                                    alreadyAdded
                                      ? 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                                      : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-medium'
                                  }`}
                                >
                                  <TechLinkIcon platform={preset.platform} className="w-3 h-3 shrink-0" />
                                  <span>+ {preset.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Links List */}
                        <div className="space-y-2">
                          {ensureCustomLinks(cv).map((link: CustomTechLink, idx: number, arr: CustomTechLink[]) => (
                            <div
                              key={link.id}
                              className={`p-2.5 rounded-xl border transition-all space-y-2 ${
                                link.enabled
                                  ? 'bg-[#101420] border-white/10 hover:border-white/20'
                                  : 'bg-neutral-900/40 border-white/5 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center space-x-2 min-w-0">
                                  <div className="p-1 rounded-lg bg-white/5 border border-white/10 shrink-0 text-cyan-400">
                                    <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5" />
                                  </div>
                                  <select
                                    value={link.platform}
                                    onChange={(e) => handleUpdateCustomLink(link.id, { platform: e.target.value as TechLinkPlatform })}
                                    className="bg-[#090C13] border border-white/10 rounded-md px-1.5 py-0.5 text-[11px] text-white outline-none cursor-pointer"
                                  >
                                    {(Object.entries(TECH_PLATFORM_META) as [TechLinkPlatform, PlatformMeta][]).map(([pKey, pMeta]) => (
                                      <option key={pKey} value={pKey} className="bg-neutral-900 text-white">
                                        {pMeta.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="flex items-center space-x-1 shrink-0">
                                  {/* Move Up */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveCustomLink(idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Di chuyển lên"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  {/* Move Down */}
                                  <button
                                    type="button"
                                    onClick={() => handleMoveCustomLink(idx, 'down')}
                                    disabled={idx === arr.length - 1}
                                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    title="Di chuyển xuống"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                  {/* Toggle Visibility */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCustomLink(link.id)}
                                    className={`p-1 rounded transition-colors cursor-pointer ${
                                      link.enabled
                                        ? 'text-cyan-400 hover:bg-cyan-500/10'
                                        : 'text-neutral-500 hover:text-neutral-300'
                                    }`}
                                    title={link.enabled ? 'Ẩn liên kết này trên CV' : 'Hiện liên kết này trên CV'}
                                  >
                                    {link.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>
                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCustomLink(link.id)}
                                    className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Xóa liên kết này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Input URL & Label */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className="block text-[10px] text-neutral-400 mb-0.5">{t.linkUrl}</span>
                                  <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => handleUpdateCustomLink(link.id, { url: e.target.value })}
                                    placeholder={TECH_PLATFORM_META[link.platform]?.placeholder || 'https://...'}
                                    className="w-full px-2 py-1 rounded bg-[#090C13] border border-white/10 text-[11px] text-white outline-none focus:border-cyan-400 font-mono"
                                  />
                                </div>
                                <div>
                                  <span className="block text-[10px] text-neutral-400 mb-0.5">{t.linkLabel}</span>
                                  <input
                                    type="text"
                                    value={link.label || ''}
                                    onChange={(e) => handleUpdateCustomLink(link.id, { label: e.target.value })}
                                    placeholder="ducanh.dev"
                                    className="w-full px-2 py-1 rounded bg-[#090C13] border border-white/10 text-[11px] text-white outline-none focus:border-cyan-400 font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Custom Link Button */}
                        <button
                          type="button"
                          onClick={() => handleAddCustomLink('custom')}
                          className="w-full py-2 px-3 rounded-lg border border-dashed border-white/20 hover:border-cyan-400/50 hover:bg-cyan-500/5 text-cyan-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t.addTechLinkBtn}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {drawerTab === 'summary' && (
                    <div className="space-y-3">
                      <label className="block text-neutral-400">{lang === 'en' ? 'Professional summary & core competencies' : 'Tóm tắt mục tiêu nghề nghiệp & năng lực cốt lõi'}</label>
                      <textarea
                        rows={8}
                        value={cv.summary}
                        onChange={(e) => setCv({ ...cv, summary: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 leading-relaxed text-xs"
                      />
                    </div>
                  )}

                  {drawerTab === 'experience' && (
                    <div className="space-y-4">
                      {/* Tech Bullet Tip Banner */}
                      <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-cyan-500/10 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <p className="text-[11px] text-neutral-300 leading-tight">
                            <span className="font-semibold text-amber-300">Google XYZ: </span>
                            {t.techTipBanner}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenTechModal(cv.timeline.length > 0 ? { type: 'timeline', id: cv.timeline[0].id, title: cv.timeline[0].role } : undefined)}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shrink-0 ml-2 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{t.techBrowseLibrary}</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{lang === 'en' ? 'Work Experience List' : 'Danh sách kinh nghiệm'} ({cv.timeline.length})</span>
                        <button
                          onClick={() => addTimelineItem()}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addItem}</span>
                        </button>
                      </div>
                      {cv.timeline.map((item, idx) => (
                        <div key={item.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-300">#{idx + 1}</span>
                            <button
                              onClick={() => deleteTimelineItem(item.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                              title={lang === 'en' ? 'Delete this item' : 'Xoá mục này'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.role}
                            onChange={(e) => updateTimelineItem(item.id, 'role', e.target.value)}
                            placeholder={lang === 'en' ? 'Job Title & Company' : 'Chức danh & Công ty'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => updateTimelineItem(item.id, 'period', e.target.value)}
                            placeholder={lang === 'en' ? 'Period (e.g. 2022 — PRESENT)' : 'Giai đoạn (VD: 2022 — HIỆN TẠI)'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                          />
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <label className="text-neutral-400 text-[11px]">{lang === 'en' ? 'Responsibilities & Impact' : 'Mô tả & Đóng góp'}</label>
                              <button
                                type="button"
                                onClick={() => handleOpenTechModal({ type: 'timeline', id: item.id, title: item.role })}
                                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Browse tech bullet points for this role' : 'Xem gợi ý mô tả chuẩn công nghệ cho vị trí này'}
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>{t.techInsertSuggestion}</span>
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={item.desc}
                              onChange={(e) => updateTimelineItem(item.id, 'desc', e.target.value)}
                              placeholder={lang === 'en' ? 'Job responsibilities & achievements (use • for bullets)...' : 'Chi tiết công việc & thành tích (dùng • để tách ý)...'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {drawerTab === 'projects' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{lang === 'en' ? 'Project List' : 'Danh sách dự án'} ({cv.projects.length})</span>
                        <button
                          onClick={() => addProjectItem()}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addProject}</span>
                        </button>
                      </div>
                      {cv.projects.map((proj, idx) => (
                        <div key={proj.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-300">#{idx + 1}</span>
                            <button
                              onClick={() => deleteProjectItem(proj.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                              title={lang === 'en' ? 'Delete this project' : 'Xoá dự án này'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => updateProjectItem(proj.id, 'title', e.target.value)}
                            placeholder={lang === 'en' ? 'Project Title' : 'Tên dự án'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={proj.category}
                              onChange={(e) => updateProjectItem(proj.id, 'category', e.target.value)}
                              placeholder={lang === 'en' ? 'Category' : 'Thể loại'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                            />
                            <input
                              type="text"
                              value={proj.year}
                              onChange={(e) => updateProjectItem(proj.id, 'year', e.target.value)}
                              placeholder={lang === 'en' ? 'Year' : 'Năm'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <label className="text-neutral-400 text-[11px]">{lang === 'en' ? 'Description & Impact' : 'Mô tả & Đóng góp'}</label>
                              <button
                                type="button"
                                onClick={() => handleOpenTechModal({ type: 'project', id: proj.id, title: proj.title })}
                                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-medium transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Browse tech bullet points for this project' : 'Xem gợi ý mô tả chuẩn công nghệ cho dự án này'}
                              >
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>{t.techInsertProjectSuggestion}</span>
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={proj.desc}
                              onChange={(e) => updateProjectItem(proj.id, 'desc', e.target.value)}
                              placeholder={lang === 'en' ? 'Project description & achievements...' : 'Mô tả dự án & thành tựu kỹ thuật...'}
                              className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {drawerTab === 'skills' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-neutral-400 mb-1.5">{lang === 'en' ? 'Add new skill' : 'Thêm kỹ năng mới'}</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newSkillText}
                            onChange={(e) => setNewSkillText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addSkill(newSkillText);
                                setNewSkillText('');
                              }
                            }}
                            placeholder={lang === 'en' ? 'Enter skill name (e.g. Docker)...' : 'Nhập tên kỹ năng (VD: Docker)...'}
                            className="flex-1 px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none text-xs"
                          />
                          <button
                            onClick={() => {
                              addSkill(newSkillText);
                              setNewSkillText('');
                            }}
                            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
                          >
                            {t.addSkill}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-2">{lang === 'en' ? 'Current Skills' : 'Danh sách kỹ năng hiện tại'} ({cv.skills.length})</label>
                        <div className="flex flex-wrap gap-1.5">
                          {cv.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 border border-white/10 text-neutral-200 flex items-center space-x-1.5 text-xs"
                            >
                              <span>{s}</span>
                              <button
                                onClick={() => removeSkill(idx)}
                                className="text-neutral-400 hover:text-rose-400 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quick Tech Linter for Skills */}
                      <button
                        type="button"
                        onClick={handleQuickLintSkills}
                        className="w-full py-2 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Normalize all skill names to industry standard casing' : 'Chuẩn hóa toàn bộ tên kỹ năng theo quy chuẩn quốc tế'}
                      >
                        <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>{t.techLinterQuickSkillsBtn}</span>
                      </button>
                    </div>
                  )}

                  {drawerTab === 'education' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{t.education} ({cv.education.length})</span>
                        <button
                          onClick={() => addEducationItem()}
                          className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addEducation}</span>
                        </button>
                      </div>
                      {cv.education.map((edu, idx) => (
                        <div key={edu.id} className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-indigo-300">#{idx + 1}</span>
                            <button
                              onClick={() => deleteEducationItem(edu.id)}
                              className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => updateEducationItem(edu.id, 'school', e.target.value)}
                            placeholder={lang === 'en' ? 'School / University' : 'Tên trường / Cơ sở đào tạo'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => updateEducationItem(edu.id, 'degree', e.target.value)}
                            placeholder={lang === 'en' ? 'Degree / Major' : 'Chuyên ngành / Bằng cấp'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => updateEducationItem(edu.id, 'year', e.target.value)}
                            placeholder={lang === 'en' ? 'Niên khóa' : 'Niên khóa'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                          />
                          <textarea
                            rows={2}
                            value={edu.desc || ''}
                            onChange={(e) => updateEducationItem(edu.id, 'desc', e.target.value)}
                            placeholder={lang === 'en' ? 'Honors, GPA, details...' : 'Mô tả thành tích, GPA...'}
                            className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom section form */}
                  {drawerTab.startsWith('custom_') && (() => {
                    const customSec = cv.customSections?.find((s) => s.id === drawerTab);
                    if (!customSec) return null;
                    return (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                          <span className="font-semibold text-white text-xs flex items-center space-x-1.5">
                            <Award className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{customSec.title}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCustomSection(customSec.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center space-x-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Delete Section' : 'Xóa mục này'}</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Section Title' : 'Tiêu đề mục'}</label>
                          <input
                            type="text"
                            value={customSec.title}
                            onChange={(e) => updateCustomSectionTitle(customSec.id, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs font-semibold"
                          />
                        </div>

                        {customSec.type === 'text' ? (
                          <div>
                            <label className="block text-neutral-400 mb-1">{lang === 'en' ? 'Content' : 'Nội dung văn bản'}</label>
                            <textarea
                              rows={5}
                              value={customSec.content || ''}
                              onChange={(e) => updateCustomSectionContent(customSec.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white outline-none focus:border-indigo-400 text-xs leading-relaxed"
                            />
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="block text-neutral-400 text-xs">
                                {lang === 'en' ? 'Items List' : 'Danh sách các mục con'}
                              </label>
                              <button
                                type="button"
                                onClick={() => addCustomSectionItem(customSec.id)}
                                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{lang === 'en' ? '+ Add Item' : '+ Thêm dòng mới'}</span>
                              </button>
                            </div>

                            {customSec.items?.map((item, idx) => (
                              <div key={item.id} className="p-3 rounded-lg bg-neutral-900 border border-white/10 space-y-2 relative group">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-mono text-neutral-500 font-bold">#{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => deleteCustomSectionItem(customSec.id, item.id)}
                                    className="text-neutral-500 hover:text-rose-400 p-1"
                                    title="Xóa dòng này"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'title', e.target.value)}
                                  placeholder={lang === 'en' ? 'Title / Name' : 'Tên chứng chỉ / giải thưởng / mục con'}
                                  className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs font-semibold"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={item.subtitle || ''}
                                    onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'subtitle', e.target.value)}
                                    placeholder={lang === 'en' ? 'Issuer / Organization' : 'Đơn vị cấp / Tổ chức'}
                                    className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                                  />
                                  <input
                                    type="text"
                                    value={item.date || ''}
                                    onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'date', e.target.value)}
                                    placeholder="2024"
                                    className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none font-mono text-xs"
                                  />
                                </div>
                                <textarea
                                  rows={2}
                                  value={item.desc || ''}
                                  onChange={(e) => updateCustomSectionItem(customSec.id, item.id, 'desc', e.target.value)}
                                  placeholder={lang === 'en' ? 'Description...' : 'Mô tả chi tiết hoặc thành tựu...'}
                                  className="w-full px-2.5 py-1.5 rounded bg-neutral-800 border border-neutral-700 text-white outline-none text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ================= TAB 3: LAYOUT ================= */}
              {activeRailTab === 'layout' && (
                <div className="space-y-5">
                  {/* Bilingual Language Switcher */}
                  <div className="space-y-2">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'CV LANGUAGE' : 'NGÔN NGỮ HIỂN THỊ CV'}
                    </span>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#111827] border border-white/10 rounded-xl">
                      <button
                        onClick={() => handleSwitchLanguage('vi')}
                        className={`py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          lang === 'vi'
                            ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>🇻🇳 Tiếng Việt (VI)</span>
                      </button>
                      <button
                        onClick={() => handleSwitchLanguage('en')}
                        className={`py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                          lang === 'en'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span>🇬🇧 English (EN)</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Maintain independent Vietnamese and English versions to apply for domestic and foreign companies.'
                        : 'Hệ thống lưu trữ độc lập 2 bản CV Tiếng Việt & Tiếng Anh để nộp cả công ty trong nước & quốc tế.'}
                    </p>

                    {/* Sync contact info button */}
                    <button
                      type="button"
                      onClick={syncContactInfoBetweenLangs}
                      className="w-full py-2 px-3 rounded-xl bg-[#111827] hover:bg-white/5 text-cyan-300 font-medium text-[11px] flex items-center justify-center space-x-1.5 transition-colors border border-white/10 shadow-xs cursor-pointer"
                      title={lang === 'vi' ? t.copyToEn : t.copyToVi}
                    >
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lang === 'vi' ? t.copyToEn : t.copyToVi}</span>
                    </button>
                  </div>

                  {/* 1-Page Fit (Compact Mode) Toggle Card */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'PRINT & PAGE FIT' : 'KIỂM SOÁT TRANG IN'}
                    </span>
                    <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isCompact ? 'bg-amber-400/20 text-amber-300' : 'bg-neutral-800 text-neutral-400'}`}>
                            <Minimize2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-semibold text-xs">
                              {lang === 'en' ? '1-Page Fit (Compact)' : 'Chuẩn 1 Trang A4 (Auto-fit)'}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {isCompact ? (lang === 'en' ? 'Active' : 'Đang bật') : (lang === 'en' ? 'Disabled' : 'Đang tắt')}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={toggleCompactMode}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                            isCompact
                              ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/20'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                          }`}
                        >
                          {isCompact ? (lang === 'en' ? 'ON' : 'BẬT') : (lang === 'en' ? 'OFF' : 'TẮT')}
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {lang === 'en'
                          ? 'Automatically optimizes line heights, margins, and font sizes to ensure all content fits neatly onto a single A4 page (297mm) without spilling over.'
                          : 'Tự động co giãn khoảng cách dòng, đệm lề và font chữ để nội dung vừa khít trong đúng 1 mặt giấy A4 tiêu chuẩn (297mm), tránh tràn trang khi xuất PDF.'}
                      </p>
                    </div>
                  </div>

                  {/* Fine-grain Typography Sliders */}
                  <div className="pt-1">
                    <CVTypographySliders
                      config={typographyConfig}
                      onChange={setTypographyConfig}
                      lang={lang}
                    />
                  </div>

                  {/* ================= SECTION REORDERING & VISIBILITY ================= */}
                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'SECTIONS ORDER & VISIBILITY' : 'THỨ TỰ & ẨN/HIỆN CÁC MỤC'}
                      </span>
                      <button
                        type="button"
                        onClick={resetSections}
                        className="text-[10px] text-neutral-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        title={lang === 'en' ? 'Reset to default order' : 'Khôi phục thứ tự mặc định'}
                      >
                        {lang === 'en' ? 'Reset Order' : 'Mặc định'}
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      {lang === 'en'
                        ? 'Reorder sections (↑ ↓) or toggle visibility (eye icon) to customize your CV hierarchy.'
                        : 'Bấm mũi tên (↑ ↓) để đổi thứ tự ưu tiên hoặc bật/tắt (icon mắt) để ẩn/hiện mục trên CV.'}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {sectionOrder.map((secKey, index) => {
                        const meta = CV_SECTIONS.find((s) => s.key === secKey);
                        const customSec = cv.customSections?.find((s) => s.id === secKey);
                        if (!meta && !customSec) return null;
                        const isVisible = sectionVisibility[secKey] ?? true;
                        const isCustom = !meta && !!customSec;
                        const IconComponent = meta ? meta.icon : Award;
                        const label = meta ? (lang === 'en' ? meta.labelEn : meta.labelVi) : customSec?.title;
                        const desc = meta
                          ? lang === 'en'
                            ? meta.descEn
                            : meta.descVi
                          : lang === 'en'
                          ? 'Custom section • Click on CV to edit'
                          : 'Mục tùy chỉnh • Nhấp trên CV để sửa';

                        return (
                          <div
                            key={secKey}
                            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                              isVisible
                                ? isCustom
                                  ? 'bg-[#111827] border-indigo-500/30 text-neutral-200 shadow-xs ring-1 ring-indigo-500/10'
                                  : 'bg-[#111827] border-white/10 text-neutral-200 shadow-xs'
                                : 'bg-[#111827]/40 border-white/5 text-neutral-500 opacity-60'
                            }`}
                          >
                            {/* Left: Index badge & Icon & Title */}
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <span className="w-5 h-5 rounded-md bg-white/5 border border-white/5 flex items-center justify-center font-mono text-[10px] text-neutral-400 font-bold shrink-0">
                                {index + 1}
                              </span>
                              <div
                                className={`p-1 rounded-lg shrink-0 ${
                                  isVisible
                                    ? isCustom
                                      ? 'bg-amber-500/15 text-amber-400'
                                      : 'bg-indigo-500/10 text-indigo-400'
                                    : 'bg-neutral-800 text-neutral-500'
                                }`}
                              >
                                <IconComponent className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1.5">
                                  <span
                                    className={`text-xs font-semibold truncate ${
                                      isVisible ? 'text-white' : 'text-neutral-400 line-through'
                                    }`}
                                  >
                                    {label}
                                  </span>
                                  {isCustom && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                                      {lang === 'en' ? 'Custom' : 'Tùy chỉnh'}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] text-neutral-500 truncate">{desc}</div>
                              </div>
                            </div>

                            {/* Right: Controls (Visibility Toggle + Move Up/Down + Delete if Custom) */}
                            <div className="flex items-center space-x-0.5 shrink-0">
                              {/* Visibility Toggle */}
                              <button
                                type="button"
                                onClick={() => toggleSectionVisibility(secKey)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isVisible
                                    ? 'text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                                    : 'text-neutral-500 hover:bg-white/5 hover:text-neutral-300'
                                }`}
                                title={
                                  isVisible
                                    ? lang === 'en'
                                      ? 'Hide Section'
                                      : 'Ẩn mục này'
                                    : lang === 'en'
                                    ? 'Show Section'
                                    : 'Hiện mục này'
                                }
                              >
                                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>

                              {/* Move Up */}
                              <button
                                type="button"
                                onClick={() => moveSection(secKey, 'up')}
                                disabled={index === 0}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Move Up' : 'Chuyển lên'}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Move Down */}
                              <button
                                type="button"
                                onClick={() => moveSection(secKey, 'down')}
                                disabled={index === sectionOrder.length - 1}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title={lang === 'en' ? 'Move Down' : 'Chuyển xuống'}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete if custom */}
                              {isCustom && customSec && (
                                <button
                                  type="button"
                                  onClick={() => removeCustomSection(customSec.id)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title={lang === 'en' ? 'Delete this custom section' : 'Xóa mục tùy chỉnh này'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Custom Section Button & Presets Menu */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
                        className="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-400" />
                        <span>{lang === 'en' ? '+ Add Custom Section' : '+ Thêm mục tùy chỉnh mới'}</span>
                      </button>

                      {showAddSectionMenu && (
                        <div className="mt-2 p-2.5 rounded-xl bg-[#0e131f] border border-indigo-500/30 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block px-1">
                            {lang === 'en' ? 'CHOOSE A PRESET TO ADD:' : 'CHỌN MẪU MỤC ĐỂ THÊM NHANH:'}
                          </span>
                          <div className="space-y-1">
                            {CUSTOM_SECTION_PRESETS.map((preset) => {
                              const PresetIcon = preset.icon;
                              return (
                                <button
                                  key={preset.presetId}
                                  type="button"
                                  onClick={() => {
                                    addCustomSection(preset.presetId);
                                    setShowAddSectionMenu(false);
                                  }}
                                  className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/20 border border-transparent transition-all flex items-center space-x-2.5 cursor-pointer group/preset"
                                >
                                  <div className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-300 group-hover/preset:bg-indigo-500 group-hover/preset:text-white transition-colors shrink-0">
                                    <PresetIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-white truncate">
                                      {lang === 'en' ? preset.labelEn : preset.labelVi}
                                    </div>
                                    <div className="text-[10px] text-neutral-400 truncate">
                                      {lang === 'en' ? preset.descEn : preset.descVi}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Canvas Zoom Presets */}
                  <div className="space-y-2 pt-3 border-t border-white/10">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'ZOOM PRESETS' : 'TỶ LỆ THU PHÓNG'}
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[75, 90, 100, 120].map((z) => (
                        <button
                          key={z}
                          onClick={() => setZoom(z)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border text-center transition-all cursor-pointer ${
                            zoom === z
                              ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                              : 'bg-[#111827] border-white/5 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {z}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: AI & ATS ================= */}
              {activeRailTab === 'ai-ats' && (
                <div className="space-y-5">
                  {/* ATS Score Card */}
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gauge className={`w-4 h-4 ${cvStrength.score >= 90 ? 'text-emerald-400' : cvStrength.score >= 75 ? 'text-cyan-400' : cvStrength.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`} />
                        <span className="font-bold text-white text-xs">
                          {lang === 'en' ? 'ATS Score Benchmark' : 'Thước đo Chuẩn ATS'}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cvStrength.ratingBg} ${cvStrength.ratingColor}`}>
                        {lang === 'en' ? cvStrength.ratingEn : cvStrength.ratingVi}
                      </span>
                    </div>

                    {/* Progress Bar & Big Score */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold font-mono text-white">{cvStrength.score}%</span>
                        <span className="text-[11px] text-neutral-400">
                          {cvStrength.passedCount}/{cvStrength.totalCount} {lang === 'en' ? 'criteria passed' : 'tiêu chuẩn đạt'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            cvStrength.score >= 90
                              ? 'bg-emerald-500'
                              : cvStrength.score >= 75
                              ? 'bg-cyan-500'
                              : cvStrength.score >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${cvStrength.score}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en' ? cvStrength.summaryEn : cvStrength.summaryVi}
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowStrengthModal(true)}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lang === 'en' ? 'View 14 ATS Benchmarks →' : 'Xem chi tiết 14 tiêu chuẩn ATS →'}</span>
                    </button>
                  </div>

                  {/* JD Matcher Card in Drawer */}
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-white text-xs">
                          {t.jdMatcherDrawerCardTitle}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${jdMatchResult.ratingBg} ${jdMatchResult.ratingColor}`}>
                        {lang === 'en' ? jdMatchResult.ratingEn : jdMatchResult.ratingVi}
                      </span>
                    </div>

                    {/* Progress Bar & Match Score */}
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold font-mono text-white">{jdMatchResult.matchScore}%</span>
                        <span className="text-[11px] text-neutral-400">
                          {jdMatchResult.matchedCount}/{jdMatchResult.totalJDKeywords} {lang === 'en' ? 'keywords matched' : 'từ khóa khớp'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            jdMatchResult.matchScore >= 80
                              ? 'bg-emerald-500'
                              : jdMatchResult.matchScore >= 65
                              ? 'bg-cyan-500'
                              : jdMatchResult.matchScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${jdMatchResult.matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Keyword Quick Counts */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{t.jdKeywordsMatched}:</span>
                        </span>
                        <strong className="font-mono font-bold">{jdMatchResult.matchedCount}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                        <span className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>{t.jdKeywordsMissing}:</span>
                        </span>
                        <strong className="font-mono font-bold">{jdMatchResult.missingCount}</strong>
                      </div>
                    </div>

                    {/* Quick Sample JD Pills */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                        {t.jdSamplePrompt}
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {SAMPLE_JDS.slice(0, 4).map((sample) => (
                          <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleSelectSampleJD(sample)}
                            className={`px-2 py-1.5 rounded-lg text-[10px] text-left transition-all border truncate cursor-pointer ${
                              selectedSampleJdId === sample.id
                                ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-semibold'
                                : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
                            }`}
                            title={lang === 'en' ? sample.titleEn : sample.titleVi}
                          >
                            {sample.id === 'frontend-sr' && '🚀 Frontend'}
                            {sample.id === 'backend-sr' && '⚙️ Backend'}
                            {sample.id === 'devops-cloud' && '☁️ DevOps'}
                            {sample.id === 'ai-software' && '🤖 AI Engineer'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowJDModal(true)}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.jdMatcherDrawerBtn}</span>
                    </button>
                  </div>

                  {/* Tech Linter Card in Drawer */}
                  <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        <span className="font-bold text-white text-xs">
                          {lang === 'en' ? 'Tech Nomenclature Linter' : 'Chuẩn Hóa Danh Pháp Tech'}
                        </span>
                      </div>
                      {techLintReport.totalIssuesCount > 0 ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-500/15 border-amber-500/30 text-amber-300 font-mono">
                          {techLintReport.totalIssuesCount} {t.techLinterIssuesFound}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
                          {t.techLinterCleanBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Auto-scan & fix casing for 120+ technologies (Node.js, TypeScript, Next.js, GitHub, RESTful API...).'
                        : 'Quét và sửa lỗi viết hoa/thường 120+ công nghệ theo đúng quy chuẩn thương hiệu quốc tế.'}
                    </p>

                    {/* Primary Button to Open Tech Linter */}
                    <button
                      type="button"
                      onClick={() => setShowTechLinterModal(true)}
                      className="w-full py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{lang === 'en' ? 'Open Tech Linter Studio' : 'Mở Studio Chuẩn Hóa Tech Linter'}</span>
                      {techLintReport.totalIssuesCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-bold font-mono ml-1">
                          {techLintReport.totalIssuesCount}
                        </span>
                      )}
                    </button>

                    {techLintReport.totalIssuesCount > 0 && (
                      <div className="space-y-2 pt-1 border-t border-white/5">
                        <div className="flex flex-wrap gap-1.5">
                          {techLintReport.issues.slice(0, 3).map((issue) => (
                            <span key={issue.id} className="text-[10px] px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-white/5 flex items-center space-x-1">
                              <span className="line-through text-rose-400">{issue.original}</span>
                              <span className="text-neutral-500">➔</span>
                              <span className="text-emerald-400 font-semibold">{issue.replacement}</span>
                            </span>
                          ))}
                          {techLintReport.totalIssuesCount > 3 && (
                            <span className="text-[10px] px-1.5 py-1 text-neutral-500">+{techLintReport.totalIssuesCount - 3} nữa</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleFixAllTechIssues}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-sm"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span className="truncate">{t.techLinterFixAll} ({techLintReport.totalIssuesCount})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Big AI Suggestion Button - NEVER CLIPPED */}
                  <div className="space-y-2">
                    <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                      {lang === 'en' ? 'AI WRITING ASSISTANT' : 'GỢI Ý NỘI DUNG CHUẨN KỸ THUẬT'}
                    </span>
                    <button
                      onClick={() => handleOpenTechModal()}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-600/25 hover:from-amber-500/35 hover:to-orange-500/35 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
                      <span className="font-bold">
                        {lang === 'en' ? 'AI Tech Bullet Points (Google XYZ)' : 'Gợi ý mô tả tối ưu bằng AI (Google XYZ)'}
                      </span>
                    </button>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {lang === 'en'
                        ? 'Browse 24+ high-impact bullet templates using Google formula: Accomplished [X], as measured by [Y], by doing [Z].'
                        : 'Kho 24+ mẫu mô tả kỹ thuật chuẩn Google XYZ: Đạt được [X], đo lường bằng [Y], thông qua thực hiện [Z].'}
                    </p>
                  </div>

                  {/* Top Quick Fixes */}
                  {cvStrength.items.filter((b) => !b.passed).length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <span className="uppercase text-[10px] tracking-wider font-semibold text-neutral-400">
                        {lang === 'en' ? 'CRITICAL SUGGESTIONS' : 'ĐỀ XUẤT CẦN TỐI ƯU NGAY'}
                      </span>
                      <div className="space-y-2">
                        {cvStrength.items
                          .filter((b) => !b.passed)
                          .slice(0, 3)
                          .map((b) => (
                            <div key={b.id} className="p-2.5 rounded-lg bg-[#111827] border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-neutral-200 text-xs truncate max-w-[200px]">
                                  {lang === 'en' ? b.titleEn : b.titleVi}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 font-mono">+{b.points} pts</span>
                              </div>
                              <p className="text-[10px] text-neutral-400 line-clamp-2">
                                {lang === 'en' ? b.descEn : b.descVi}
                              </p>
                              {b.actionTab && (
                                <button
                                  onClick={() => {
                                    setDrawerTab(b.actionTab as any);
                                    setActiveRailTab('content');
                                    setIsDrawerOpen(true);
                                  }}
                                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>{lang === 'en' ? 'Fix in form →' : 'Mở form sửa ngay →'}</span>
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 5: DATA ================= */}
              {activeRailTab === 'data' && (
                <div className="space-y-5">
                  {/* CV Profiles Manager Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white text-xs">
                          {lang === 'en' ? 'CV PROFILES & VERSIONS' : 'CÁC PHIÊN BẢN CV (PROFILES)'}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
                        {profiles.length} phiên bản
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {lang === 'en'
                        ? 'Manage multiple CV variations tailored for specific job roles (Frontend, Fullstack, Lead, Remote).'
                        : 'Tạo nhiều biến thể CV khác nhau phù hợp với từng vị trí ứng tuyển (Frontend, Fullstack, Quản lý, Remote).'}
                    </p>

                    {/* Profiles List */}
                    <div className="space-y-2 pt-1">
                      {profiles.map((p) => {
                        const isActive = p.id === activeProfileId;
                        return (
                          <div
                            key={p.id}
                            className={`p-2.5 rounded-lg border transition-all ${
                              isActive
                                ? 'bg-cyan-950/30 border-cyan-500/40 text-white'
                                : 'bg-[#161B26] border-white/5 hover:border-white/15 text-neutral-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-xs text-white truncate">{p.name}</span>
                                  {isActive && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                                      Đang mở
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">
                                  {p.targetRole || 'Software Engineer'} • Mẫu: <span className="text-neutral-200 capitalize">{p.template}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1 shrink-0">
                                {!isActive && (
                                  <button
                                    type="button"
                                    onClick={() => handleSwitchProfile(p.id)}
                                    className="px-2 py-1 rounded bg-white/10 hover:bg-cyan-600 text-white text-[10px] font-medium transition-colors cursor-pointer"
                                  >
                                    Mở bản này
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateProfile(p.id)}
                                  className="p-1 rounded text-neutral-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer"
                                  title="Nhân bản"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                {profiles.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProfile(p.id)}
                                    className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setShowNewProfileModal(true)}
                        className="w-full py-2 px-3 rounded-lg border border-dashed border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all text-xs cursor-pointer bg-cyan-500/5 hover:bg-cyan-500/10"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? '+ Create New Profile' : '+ Thêm phiên bản CV mới'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Export Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileDown className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-xs">{t.exportSectionTitle}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {t.exportSectionDesc}
                    </p>
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handleExportFullJSON}
                        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.exportFullBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportCurrentProfileJSON}
                        className="w-full py-1.5 px-3 rounded-lg border border-white/10 hover:border-cyan-500 text-neutral-300 hover:text-white flex items-center justify-center space-x-2 transition-all text-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.exportCurrentBtn} ({lang.toUpperCase()})</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-cyan-300" />
                        <span>{t.copyJsonBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* CV Parser / PDF & Doc Import Section */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/20 via-[#111827] to-cyan-950/20 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <FileUp className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-white text-xs">{t.cvParserDrawerCardTitle}</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        AI EXTRACT
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {lang === 'en'
                        ? 'Upload an existing CV (.pdf, .docx, .txt) or paste text to automatically extract contact, skills, experience, and projects.'
                        : 'Tải lên file CV có sẵn (.pdf, .docx, .txt) hoặc dán văn bản để hệ thống tự động bóc tách thông tin điền vào CV.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowImportModal(true);
                        setParsedResult(null);
                        setParseError(null);
                      }}
                      className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all active:scale-95 text-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{t.cvParserDrawerBtn}</span>
                    </button>
                  </div>

                  {/* Import Section */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileUp className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white text-xs">{t.importSectionTitle}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {t.importSectionDesc}
                    </p>
                    <button
                      type="button"
                      onClick={() => jsonFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-lg border-2 border-dashed border-white/20 hover:border-cyan-400 text-neutral-300 hover:text-white flex items-center justify-center space-x-2 transition-all text-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'en' ? 'Upload JSON File' : 'Tải lên file JSON'}</span>
                    </button>

                    {/* Import Preview Card if file selected */}
                    {importPreview && (
                      <div className="p-3 rounded-lg bg-neutral-900 border border-emerald-500/40 space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 text-xs">File hợp lệ</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                            {importPreview.type === 'full' ? 'Full Package' : 'Single Profile'}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-300 space-y-0.5">
                          <div>• {importPreview.summary.name || 'CV'} ({importPreview.summary.role})</div>
                          <div>• Kinh nghiệm: {importPreview.summary.timelineCount} | Dự án: {importPreview.summary.projectsCount}</div>
                        </div>
                        <div className="flex space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={handleApplyImport}
                            className="flex-1 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Áp dụng</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => { setImportPreview(null); setImportErrorMsg(null); }}
                            className="px-2.5 py-1 rounded border border-white/10 hover:bg-white/5 text-neutral-400 text-xs cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reset Section */}
                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={handleReset}
                      className="w-full py-2 px-3 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.reset}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= TAB 6: MATCHING COVER LETTER STUDIO ================= */}
              {activeRailTab === 'cover_letter' && (
                <div className="space-y-4">
                  {/* Matching Banner */}
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-white text-xs">
                        {lang === 'en' ? 'Synchronized Matching Design' : 'Đồng bộ thiết kế với CV'}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">
                      {t.coverLetterStudioSubtitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={handleSyncCoverLetterWithCV}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                        title={t.clSyncFromCvBtn}
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{t.clSyncFromCvBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyCoverLetterText}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer"
                        title={t.clCopyTextBtn}
                      >
                        {isCoverLetterCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCoverLetterCopied ? (lang === 'en' ? 'Copied!' : 'Đã sao chép!') : t.clCopyTextBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{t.clPresetsTitle}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">4 {lang === 'en' ? 'presets' : 'mẫu'}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {COVER_LETTER_PRESETS.map((preset) => {
                        const isSelected = activeCoverLetterPresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleApplyCoverLetterPreset(preset)}
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600/20 border-indigo-400 text-white shadow-xs'
                                : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs">
                                {lang === 'en' ? preset.titleEn : preset.titleVi}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            </div>
                            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{preset.badge}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recipient & Company Details */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-xs">{t.clRecipientSection}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clRecipientName}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.recipientName}
                          onChange={(e) => handleUpdateCoverLetterField('recipientName', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clRecipientRole}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.recipientRole}
                          onChange={(e) => handleUpdateCoverLetterField('recipientRole', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clCompanyName}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.companyName}
                          onChange={(e) => handleUpdateCoverLetterField('companyName', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clCompanyAddress}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.companyAddress}
                          onChange={(e) => handleUpdateCoverLetterField('companyAddress', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clJobTitle}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.jobTitle}
                          onChange={(e) => handleUpdateCoverLetterField('jobTitle', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-cyan-300 font-semibold text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clDate}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.date}
                          onChange={(e) => handleUpdateCoverLetterField('date', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Letter Body Paragraphs */}
                  <div className="p-3.5 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-white text-xs">{t.clBodySection}</span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clSalutation}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.salutation}
                          onChange={(e) => handleUpdateCoverLetterField('salutation', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clOpening}</label>
                        <textarea
                          rows={3}
                          value={currentCoverLetter.opening}
                          onChange={(e) => handleUpdateCoverLetterField('opening', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clBody1}</label>
                        <textarea
                          rows={4}
                          value={currentCoverLetter.body1}
                          onChange={(e) => handleUpdateCoverLetterField('body1', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clBody2}</label>
                        <textarea
                          rows={4}
                          value={currentCoverLetter.body2}
                          onChange={(e) => handleUpdateCoverLetterField('body2', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clClosing}</label>
                        <textarea
                          rows={3}
                          value={currentCoverLetter.closing}
                          onChange={(e) => handleUpdateCoverLetterField('closing', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg p-2.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">{t.clSignOff}</label>
                        <input
                          type="text"
                          value={currentCoverLetter.signOff}
                          onChange={(e) => handleUpdateCoverLetterField('signOff', e.target.value)}
                          className="w-full bg-[#0B0E17] border border-white/10 rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Switch Back to CV Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDocMode('cv');
                        setActiveRailTab('design');
                      }}
                      className="w-full py-2 px-3 rounded-lg border border-white/15 hover:bg-white/5 text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{t.clBackToCvBtn}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-white/10 bg-[#111827] flex items-center justify-between">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 hover:bg-white/5 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? t.saving : t.save}</span>
              </button>
            </div>
          </aside>
        )}

        {/* Small Screen Backdrop */}
        {!isPreviewMode && isDrawerOpen && (
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-10 backdrop-blur-xs"
          />
        )}

{/* ================= TEMPLATE GALLERY MODAL ================= */}
      {showGalleryModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <LayoutTemplate className="w-5 h-5 text-cyan-400" />
                  <span>{t.galleryTitle}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.gallerySubtitle}
                </p>
              </div>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-8 py-3 bg-[#131316] border-b border-neutral-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
              {[
                { id: 'all', label: t.filterAll },
                { id: 'popular', label: t.filterPopular },
                { id: 'sidebar', label: t.filterSidebar },
                { id: 'ats', label: t.filterAts },
                { id: 'creative', label: t.filterCreative },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGalleryFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    galleryFilter === f.id
                      ? 'bg-cyan-500 text-black font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((item) => {
                const isActive = template === item.id;

                return (
                  <div
                    key={item.id}
                    className={`group bg-[#1f1f26] border rounded-2xl p-4 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-xl ${
                      isActive ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {/* Visual Mini Mockup Preview */}
                    <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-white shadow-inner p-2 border border-neutral-300 pointer-events-none relative">
                      {item.id === 'rabbit' && (
                        <div className="h-full flex flex-col gap-1.5">
                          <div className="w-full h-[28%] bg-[#0f172a] rounded p-1.5 flex flex-col justify-between">
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <div className="w-10 h-1 bg-neutral-400 rounded" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="w-3/4 h-2 bg-white rounded" />
                              <div className="w-1/2 h-1 bg-cyan-400 rounded" />
                            </div>
                          </div>
                          <div className="flex-1 flex gap-1.5 p-1">
                            <div className="w-3/5 pl-2 border-l-2 border-cyan-500 space-y-1.5 relative">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 absolute -left-[4px] top-1" />
                              <div className="w-3/4 h-1 bg-neutral-800 rounded" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 absolute -left-[4px] top-5" />
                              <div className="w-3/4 h-1 bg-neutral-800 rounded pt-2" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                            </div>
                            <div className="w-2/5 space-y-1">
                              <div className="w-full h-1 bg-cyan-600 rounded" />
                              <div className="w-full h-1.5 bg-cyan-100 rounded" />
                              <div className="w-full h-1.5 bg-cyan-100 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === 'cascade' && (
                        <div className="h-full flex">
                          <div className="w-[36%] bg-[#0f172a] h-full rounded-l p-1.5 flex flex-col space-y-1.5">
                            <div className="w-6 h-6 rounded-full bg-neutral-400 mx-auto" />
                            <div className="w-full h-1 bg-cyan-400 rounded" />
                            <div className="w-full h-0.5 bg-neutral-400 rounded" />
                          </div>
                          <div className="flex-1 p-2 space-y-1.5">
                            <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                        </div>
                      )}

                      {item.id === 'chicken' && (
                        <div className="h-full flex flex-col gap-1.5">
                          <div className="w-full h-[32%] bg-[#0f172a] rounded p-1.5 flex items-center justify-between">
                            <div className="space-y-1 w-2/3">
                              <div className="w-3/4 h-1.5 bg-white rounded" />
                              <div className="w-1/2 h-1 bg-cyan-400 rounded" />
                            </div>
                            <div className="w-5 h-5 rounded-full bg-neutral-500" />
                          </div>
                          <div className="flex-1 flex gap-1.5 p-1">
                            <div className="w-3/5 space-y-1">
                              <div className="w-2/3 h-1.5 bg-neutral-800 rounded" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                            </div>
                            <div className="w-2/5 space-y-1">
                              <div className="w-full h-1.5 bg-neutral-800 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === 'iconic' && (
                        <div className="h-full flex flex-col p-1.5 space-y-1.5">
                          <div className="flex justify-between items-center pb-1 border-b">
                            <div className="w-1/2 h-2 bg-neutral-900 rounded" />
                            <div className="w-5 h-5 rounded-full bg-cyan-600" />
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded bg-cyan-600" />
                            <div className="w-1/3 h-1.5 bg-neutral-800 rounded" />
                          </div>
                          <div className="w-full h-0.5 bg-neutral-300 rounded" />
                        </div>
                      )}

                      {item.id === 'basic' && (
                        <div className="h-full flex flex-col p-2 space-y-2 text-center">
                          <div className="space-y-1">
                            <div className="w-1/2 h-2 bg-neutral-900 mx-auto rounded" />
                            <div className="w-3/4 h-0.5 bg-neutral-400 mx-auto rounded" />
                          </div>
                          <div className="h-px bg-neutral-300 w-full" />
                          <div className="space-y-1 text-left">
                            <div className="w-1/3 h-1.5 bg-neutral-800 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                        </div>
                      )}

                      {item.id === 'decker' && (
                        <div className="h-full flex flex-col p-1.5 space-y-1.5">
                          <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                          <div className="w-16 h-2 bg-cyan-600 rounded-full" />
                          <div className="w-full h-0.5 bg-neutral-300 rounded" />
                        </div>
                      )}

                      {item.id === 'crisp' && (
                        <div className="h-full flex flex-col p-1.5 gap-1.5">
                          <div className="flex justify-between items-center pb-1 border-b border-neutral-300">
                            <div className="w-24 h-2 bg-neutral-900 rounded" />
                            <div className="w-6 h-6 rounded-full bg-neutral-300" />
                          </div>
                          <div className="flex-1 flex gap-2">
                            <div className="w-1/3 space-y-1">
                              <div className="w-full h-1 bg-cyan-600 rounded" />
                            </div>
                            <div className="w-2/3 space-y-1">
                              <div className="w-1/2 h-1 bg-cyan-600 rounded" />
                              <div className="w-full h-0.5 bg-neutral-300 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                      {item.id === 'bubbles' && (
                        <div className="h-full flex flex-col p-1.5 space-y-1.5">
                          <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                          <div className="p-1 rounded-lg bg-neutral-100 border border-neutral-200 space-y-0.5">
                            <div className="w-1/3 h-1 bg-cyan-600 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                        </div>
                      )}

                      {item.id === 'enfold' && (
                        <div className="h-full flex gap-1.5">
                          <div className="w-[70%] p-1 space-y-1.5">
                            <div className="w-3/4 h-2 bg-neutral-900 rounded" />
                            <div className="w-full h-0.5 bg-neutral-300 rounded" />
                          </div>
                          <div className="w-[30%] bg-[#0f172a] rounded p-1 flex flex-col space-y-1">
                            <div className="w-5 h-5 rounded-full bg-neutral-600 mx-auto" />
                          </div>
                        </div>
                      )}

                      {item.id === 'editorial' && (
                        <div className="h-full flex flex-col p-2 space-y-1.5 border-t-2 border-neutral-900">
                          <div className="w-3/4 h-3 bg-neutral-950 rounded font-serif" />
                          <div className="text-[7px] font-mono text-neutral-400 pt-1">01 / TỔNG QUAN</div>
                          <div className="w-full h-0.5 bg-neutral-400 rounded" />
                        </div>
                      )}
                    </div>

                    {/* Template Card Meta */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300">
                          {lang === 'en' ? (item.badgeEn || item.badge) : item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {lang === 'en' ? (item.descEn || item.desc) : item.desc}
                      </p>

                      <button
                        onClick={() => {
                          setTemplate(item.id);
                          setShowGalleryModal(false);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                          isActive
                            ? 'bg-emerald-500 text-black'
                            : 'bg-[#2a2a34] hover:bg-cyan-500 hover:text-black text-cyan-400'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.inUse}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>{t.useTemplate}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= CV PARSER / PDF & DOC IMPORT MODAL ================= */}
      {showImportModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141822] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-4xl h-[92vh] max-h-[92vh] md:h-[86vh] md:max-h-[86vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-3.5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-950/30 via-[#141822] to-cyan-950/30 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-blue-600/30 border border-emerald-500/40 text-emerald-400 shrink-0">
                  <FileUp className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {t.cvParserTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[9px] font-bold text-emerald-300 tracking-wider font-mono">
                      PDF • DOCX • TEXT
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {t.cvParserSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setParsedResult(null);
                  setParseError(null);
                }}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={cvFileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.json,.md"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleParseFile(file);
                }
                e.target.value = '';
              }}
            />

            {/* Modal Body */}
            {!parsedResult ? (
              /* STEP 1: UPLOAD / PASTE / SAMPLE INPUT SCREEN */
              <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-4">
                {/* Method Tabs */}
                <div className="flex items-center space-x-2 bg-[#090C13] border border-white/10 rounded-xl p-1 text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setImportTab('upload');
                      setParseError(null);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      importTab === 'upload'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.cvParserTabUpload}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportTab('paste');
                      setParseError(null);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      importTab === 'paste'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t.cvParserTabPaste}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImportTab('sample');
                      setParseError(null);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      importTab === 'sample'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.cvParserTabSample}</span>
                  </button>
                </div>

                {/* Error Banner */}
                {parseError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{parseError}</span>
                  </div>
                )}

                {/* Loading State */}
                {isParsingCV && (
                  <div className="py-16 flex flex-col items-center justify-center space-y-3 bg-[#0B0F19] rounded-2xl border border-white/5">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-sm font-semibold text-white">{t.cvParserParsingStatus}</span>
                    <span className="text-xs text-neutral-400">
                      {lang === 'en'
                        ? 'Analyzing text sections, extracting technical skills & experience...'
                        : 'Đang bóc tách thông tin liên hệ, kinh nghiệm, kỹ năng và học vấn...'}
                    </span>
                  </div>
                )}

                {!isParsingCV && importTab === 'upload' && (
                  <div
                    onClick={() => cvFileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleParseFile(file);
                    }}
                    className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group space-y-3"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-105">
                      <FileUp className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        {t.cvParserDropzoneText}
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-md">
                        {t.cvParserDropzoneHint}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .PDF
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .DOCX
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .TXT
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10 font-mono">
                        .JSON
                      </span>
                    </div>
                  </div>
                )}

                {!isParsingCV && importTab === 'paste' && (
                  <div className="flex-1 flex flex-col space-y-3 min-h-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">{t.cvParserPastePrompt}</span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        {importRawText.trim() ? importRawText.trim().split(/\s+/).filter(Boolean).length : 0} {lang === 'en' ? 'words' : 'từ'}
                      </span>
                    </div>
                    <textarea
                      value={importRawText}
                      onChange={(e) => setImportRawText(e.target.value)}
                      placeholder={
                        lang === 'en'
                          ? 'Paste your raw CV text here (Summary, Skills, Experience, Education...)'
                          : 'Dán toàn bộ văn bản CV của bạn vào đây (Họ tên, Thông tin liên hệ, Tóm tắt, Kỹ năng, Kinh nghiệm làm việc, Dự án, Học vấn)...'
                      }
                      className="flex-1 min-h-[220px] w-full bg-[#080B11] border border-white/10 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/60 font-mono leading-relaxed resize-none overflow-y-auto"
                    />
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleParseRawText(importRawText, lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán')}
                        disabled={!importRawText.trim() || importRawText.trim().length < 20}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Parse & Extract CV →' : 'Trích xuất & Bóc tách CV →'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {!isParsingCV && importTab === 'sample' && (
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-400">
                      {lang === 'en'
                        ? 'Select a realistic pre-configured CV to test the parsing and extraction engine instantly:'
                        : 'Chọn một mẫu CV thực tế dưới đây để thử nghiệm ngay khả năng trích xuất thông tin tự động:'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SAMPLE_CV_TEXTS.map((sample) => (
                        <div
                          key={sample.id}
                          className="p-4 rounded-xl bg-[#0F1420] border border-white/10 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                                {sample.badge}
                              </span>
                            </div>
                            <h5 className="font-bold text-white text-xs sm:text-sm">
                              {lang === 'en' ? sample.titleEn : sample.title}
                            </h5>
                            <p className="text-[11px] text-neutral-400 line-clamp-3 font-mono leading-relaxed">
                              {sample.text.slice(0, 150)}...
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleParseRawText(sample.text, sample.title)}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Load & Parse This Sample →' : 'Thử nghiệm mẫu này ngay →'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* STEP 2: EXTRACTION PREVIEW & APPLY SCREEN */
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                {/* Extraction Stats Header Banner */}
                <div className="p-4 sm:p-5 pb-3 border-b border-white/10 bg-[#101420] shrink-0 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">
                            {t.cvParserSuccessBadge}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            {parsedResult.detectedLang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                          </span>
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                            {parsedResult.confidenceScore}% {lang === 'en' ? 'confidence' : 'độ tin cậy'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-md">
                          {parsedResult.fileName || (lang === 'en' ? 'Pasted Text' : 'Văn bản đã dán')}
                        </p>
                      </div>
                    </div>

                    {/* Stats Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        ⚡ <strong>{parsedResult.stats.skillsCount}</strong> {lang === 'en' ? 'skills' : 'kỹ năng'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        💼 <strong>{parsedResult.stats.experienceCount}</strong> {lang === 'en' ? 'jobs' : 'kinh nghiệm'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        🚀 <strong>{parsedResult.stats.projectsCount}</strong> {lang === 'en' ? 'projects' : 'dự án'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300">
                        🎓 <strong>{parsedResult.stats.educationCount}</strong> {lang === 'en' ? 'education' : 'học vấn'}
                      </span>
                    </div>
                  </div>

                  {/* Preview Navigation Tabs */}
                  <div className="flex items-center space-x-1.5 bg-[#090C13] border border-white/10 rounded-xl p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('profile')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'profile'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      👤 {lang === 'en' ? 'Profile & Contact' : 'Hồ sơ & Liên hệ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('skills')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'skills'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      ⚡ {lang === 'en' ? 'Skills' : 'Kỹ năng'} ({parsedResult.cv.skills.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('timeline')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'timeline'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      💼 {lang === 'en' ? 'Experience' : 'Kinh nghiệm'} ({parsedResult.cv.timeline.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('projects')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'projects'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      🚀 {lang === 'en' ? 'Projects' : 'Dự án'} ({parsedResult.cv.projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportPreviewTab('education')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        importPreviewTab === 'education'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      🎓 {lang === 'en' ? 'Education' : 'Học vấn'} ({parsedResult.cv.education.length})
                    </button>
                  </div>
                </div>

                {/* Preview Content Tab Body */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#0D111A]">
                  {/* Tab Profile */}
                  {importPreviewTab === 'profile' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                            {lang === 'en' ? 'Basic Information' : 'Thông tin cá nhân'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Full Name:' : 'Họ và tên:'}</span>
                            <div className="font-bold text-white text-sm">{parsedResult.cv.name}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Target Role:' : 'Vị trí công việc:'}</span>
                            <div className="font-semibold text-cyan-300">{parsedResult.cv.role}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">Email:</span>
                            <div className="text-neutral-200 font-mono">{parsedResult.cv.email}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Phone:' : 'Số điện thoại:'}</span>
                            <div className="text-neutral-200 font-mono">{parsedResult.cv.phone}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">{lang === 'en' ? 'Location:' : 'Địa chỉ:'}</span>
                            <div className="text-neutral-200">{parsedResult.cv.location}</div>
                          </div>
                          <div>
                            <span className="text-neutral-500">GitHub:</span>
                            <div className="text-neutral-200 font-mono truncate">{parsedResult.cv.github}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-1.5">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                          {lang === 'en' ? 'Professional Summary' : 'Tóm tắt sự nghiệp'}
                        </span>
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                          {parsedResult.cv.summary}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab Skills */}
                  {importPreviewTab === 'skills' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          {lang === 'en'
                            ? `Extracted ${parsedResult.cv.skills.length} technical skills:`
                            : `Đã phát hiện ${parsedResult.cv.skills.length} kỹ năng công nghệ:`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3.5 rounded-xl bg-[#141A26] border border-white/10">
                        {parsedResult.cv.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab Timeline */}
                  {importPreviewTab === 'timeline' && (
                    <div className="space-y-3">
                      {parsedResult.cv.timeline.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-xs sm:text-sm">{item.role}</div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                              {item.period}
                            </span>
                          </div>
                          {item.desc && (
                            <p className="text-xs text-neutral-400 whitespace-pre-line leading-relaxed">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab Projects */}
                  {importPreviewTab === 'projects' && (
                    <div className="space-y-3">
                      {parsedResult.cv.projects.length === 0 ? (
                        <div className="text-center py-8 text-neutral-500 text-xs">
                          {lang === 'en' ? 'No specific project section detected.' : 'Chưa phát hiện mục dự án riêng biệt.'}
                        </div>
                      ) : (
                        parsedResult.cv.projects.map((proj, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-white text-xs sm:text-sm">{proj.title}</div>
                                <div className="text-xs text-cyan-300 font-medium">{proj.category}</div>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                                {proj.year}
                              </span>
                            </div>
                            {proj.desc && (
                              <p className="text-xs text-neutral-400 whitespace-pre-line leading-relaxed">
                                {proj.desc}
                              </p>
                            )}
                            {(proj.liveDemo || proj.github) && (
                              <div className="text-[11px] text-cyan-400 truncate font-mono">
                                🔗 {proj.liveDemo || proj.github}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab Education */}
                  {importPreviewTab === 'education' && (
                    <div className="space-y-3">
                      {parsedResult.cv.education.map((edu, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#141A26] border border-white/10 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-white text-xs sm:text-sm">{edu.school}</div>
                              <div className="text-xs text-cyan-300 font-medium">{edu.degree}</div>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 shrink-0">
                              {edu.year}
                            </span>
                          </div>
                          {edu.desc && (
                            <p className="text-xs text-neutral-400 leading-relaxed">{edu.desc}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Extraction Actions Footer */}
                <div className="p-3.5 sm:p-4 bg-[#090C13] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setParsedResult(null);
                      setParseError(null);
                    }}
                    className="px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {t.cvParserReuploadBtn}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleApplyImportedCV('overwrite_current')}
                      className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      {t.cvParserApplyCurrentBtn}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyImportedCV('new_profile')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{t.cvParserCreateNewProfileBtn}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 Footer */}
            {!parsedResult && (
              <div className="px-5 sm:px-7 py-2.5 bg-[#0E121B] border-t border-white/10 flex items-center justify-between text-xs shrink-0">
                <span className="text-neutral-400 text-[11px] line-clamp-1 mr-2">
                  {lang === 'en'
                    ? '💡 Privacy first: All file parsing is processed locally on your server and stays 100% private.'
                    : '💡 Bảo mật tuyệt đối: Mọi tài liệu CV tải lên được xử lý nội bộ và không chia sẻ ra bên ngoài.'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer shrink-0"
                >
                  {lang === 'en' ? 'Close' : 'Đóng'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= NEW CV PROFILE MODAL ================= */}
      {showNewProfileModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
          <div className="w-full max-w-md bg-[#161B26] border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {lang === 'en' ? 'Create New CV Profile' : 'Tạo Phiên Bản CV Mới'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {lang === 'en'
                      ? 'Tailor your CV for specific roles or companies'
                      : 'Tùy biến nội dung cho từng vị trí hoặc công ty mục tiêu'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewProfileModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {lang === 'en' ? 'Profile Name' : 'Tên phiên bản CV'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g., Senior Frontend Engineer' : 'Ví dụ: Senior Frontend Engineer (React focus)'}
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  {lang === 'en' ? 'Target Role / Job Title' : 'Vị trí công việc mục tiêu'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'e.g., Frontend Specialist' : 'Ví dụ: Frontend Lead / React Specialist'}
                  value={newProfileRole}
                  onChange={(e) => setNewProfileRole(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/15 rounded-lg text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProfileCloneFromCurrent}
                    onChange={(e) => setNewProfileCloneFromCurrent(e.target.checked)}
                    className="rounded border-white/20 bg-neutral-800 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-white font-medium">
                    {lang === 'en' ? 'Clone content from current CV' : 'Sao chép nội dung từ phiên bản CV hiện tại'}
                  </span>
                </label>
                <p className="text-[11px] text-neutral-400 pl-6 leading-relaxed">
                  {newProfileCloneFromCurrent
                    ? 'Giữ lại toàn bộ kinh nghiệm, học vấn và kỹ năng của bản hiện tại để bạn chỉ việc chỉnh sửa nhanh.'
                    : 'Bắt đầu với một bản mẫu mặc định ban đầu.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowNewProfileModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Cancel' : 'Hủy'}
              </button>
              <button
                type="button"
                onClick={handleCreateNewProfile}
                disabled={!newProfileName.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer transition-all"
              >
                {lang === 'en' ? 'Create Profile' : 'Tạo Phiên Bản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CV DATA EXPORT / IMPORT MODAL ================= */}
      {showDataModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                    {t.dataModalTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t.dataModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDataModal(false);
                  setImportPreview(null);
                  setImportErrorMsg(null);
                }}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="px-6 sm:px-8 py-2.5 bg-[#131316] border-b border-neutral-800 flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setDataModalTab('export')}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                  dataModalTab === 'export'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{t.exportTab}</span>
              </button>
              <button
                type="button"
                onClick={() => setDataModalTab('import')}
                className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                  dataModalTab === 'import'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>{t.importTab}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-xs">
              {dataModalTab === 'export' && (
                <div className="space-y-4">
                  {/* Option 1: Full Bilingual Package */}
                  <div className="p-5 rounded-2xl bg-[#1f1f26] border border-neutral-700/80 hover:border-cyan-500/50 transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{t.exportFullBtn}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-cyan-500/20 text-cyan-300 font-bold">
                            {lang === 'en' ? 'RECOMMENDED' : 'KHUYÊN DÙNG'}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                          {t.exportFullHint}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportFullJSON}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.exportFullBtn}</span>
                    </button>
                  </div>

                  {/* Option 2: Current Profile */}
                  <div className="p-5 rounded-2xl bg-[#1f1f26] border border-neutral-700/80 space-y-3">
                    <div>
                      <span className="font-bold text-white text-sm">{t.exportCurrentBtn} ({lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'})</span>
                      <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                        {t.exportCurrentHint}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={handleExportCurrentProfileJSON}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-700 hover:border-cyan-500 text-neutral-200 hover:text-white flex items-center justify-center space-x-2 transition-all font-semibold"
                      >
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>{lang === 'en' ? 'Download .json (' + lang.toUpperCase() + ')' : 'Tải file .json (' + lang.toUpperCase() + ')'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyJSON}
                        className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center space-x-2 transition-all"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{t.copyJsonBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {dataModalTab === 'import' && (
                <div className="space-y-4">
                  {/* Dropzone */}
                  <div
                    onClick={() => jsonFileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      if (e.dataTransfer.files?.[0]) processImportFile(e.dataTransfer.files[0]);
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                        : 'border-neutral-700 hover:border-cyan-500/80 bg-[#1f1f26]/60'
                    }`}
                  >
                    <FileUp className="w-10 h-10 mx-auto text-cyan-400 mb-2.5 animate-bounce" />
                    <p className="text-white font-semibold text-sm">{t.importDropzone}</p>
                    <p className="text-neutral-400 text-xs mt-1">{t.importDropzoneHint}</p>
                    <span className="inline-block mt-3 px-3.5 py-1.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-700">
                      *.json
                    </span>
                  </div>

                  {/* Error Alert */}
                  {importErrorMsg && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{importErrorMsg}</span>
                    </div>
                  )}

                  {/* Preview & Apply Card */}
                  {importPreview && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 text-xs animate-in fade-in">
                      <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                        <span>{t.previewTitle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 uppercase font-mono font-bold">
                          {importPreview.type === 'full' ? 'Bilingual Package' : 'Single Profile'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-neutral-300 bg-black/20 p-3 rounded-xl border border-neutral-800">
                        <div>• {t.previewProfile}: <strong className="text-white">{importPreview.summary.name || 'CV'}</strong></div>
                        <div>• Chức danh: <strong className="text-white">{importPreview.summary.role}</strong></div>
                        <div>• {t.previewExp}: <strong className="text-white">{importPreview.summary.timelineCount} mục</strong></div>
                        <div>• {t.previewProjects}: <strong className="text-white">{importPreview.summary.projectsCount} dự án</strong></div>
                        <div>• {t.previewSkills}: <strong className="text-white">{importPreview.summary.skillsCount} kỹ năng</strong></div>
                        <div>• {t.previewEdu}: <strong className="text-white">{importPreview.summary.eduCount} mục</strong></div>
                      </div>
                      <div className="flex space-x-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleApplyImport}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>{t.applyImportBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setImportPreview(null);
                            setImportErrorMsg(null);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-400 text-xs transition-colors"
                        >
                          {t.cancelImportBtn}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TECH BULLET POINTS LIBRARY MODAL ================= */}
      {showTechModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-800 flex items-start justify-between bg-gradient-to-r from-amber-950/20 via-neutral-900 to-indigo-950/20">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-amber-600/30 border border-amber-500/40 text-amber-400 shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {t.techModalTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-bold text-amber-300 tracking-wider font-mono">
                      GOOGLE XYZ
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    {t.techModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTechModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Selector & Google XYZ Formula Banner */}
            <div className="px-6 sm:px-8 py-3 bg-[#131316] border-b border-neutral-800 space-y-2.5">
              {/* Target Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-neutral-400 font-medium">{t.techTargetLabel}</span>
                  <select
                    value={techTarget ? `${techTarget.type}:${techTarget.id}` : 'none'}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'none') {
                        setTechTarget(null);
                      } else {
                        const [type, id] = val.split(':') as ['timeline' | 'project', string];
                        if (type === 'timeline') {
                          const item = cv.timeline.find((x) => x.id === id);
                          setTechTarget({ type: 'timeline', id, title: item?.role || 'Kinh nghiệm' });
                        } else {
                          const proj = cv.projects.find((x) => x.id === id);
                          setTechTarget({ type: 'project', id, title: proj?.title || 'Dự án' });
                        }
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-cyan-300 font-medium text-xs outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="none">-- {t.techTargetCopyOnly} --</option>
                    {cv.timeline.length > 0 && (
                      <optgroup label={lang === 'en' ? 'Work Experience (Timeline)' : 'Kinh nghiệm làm việc'}>
                        {cv.timeline.map((item, idx) => (
                          <option key={item.id} value={`timeline:${item.id}`}>
                            #{idx + 1}: {item.role}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {cv.projects.length > 0 && (
                      <optgroup label={lang === 'en' ? 'Featured Projects' : 'Dự án tiêu biểu'}>
                        {cv.projects.map((proj, idx) => (
                          <option key={proj.id} value={`project:${proj.id}`}>
                            #{idx + 1}: {proj.title}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                {techTarget ? (
                  <span className="text-[11px] text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>
                      {lang === 'en' ? `Target: ${techTarget.title || 'Selected item'}` : `Mục tiêu: ${techTarget.title || 'Mục đang chọn'}`}
                    </span>
                  </span>
                ) : (
                  <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-full border border-neutral-700">
                    {lang === 'en' ? 'Mode: Copy to clipboard' : 'Chế độ: Sao chép nhanh'}
                  </span>
                )}
              </div>

              {/* Formula Tip Callout */}
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 text-xs flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <p className="text-[11px] text-neutral-300">
                  <span className="font-semibold text-amber-300">{t.techFormulaLabel} </span>
                  <span className="font-mono text-neutral-200">"Accomplished [X] as measured by [Y], by doing [Z]"</span>
                  <span className="text-neutral-400 hidden md:inline ml-1.5">— {t.techFormulaDesc}</span>
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="px-6 sm:px-8 py-3 bg-[#151518] border-b border-neutral-800 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={techSearchQuery}
                  onChange={(e) => setTechSearchQuery(e.target.value)}
                  placeholder={t.techSearchPlaceholder}
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-neutral-900 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs outline-none focus:border-amber-400/80 transition-all"
                />
                {techSearchQuery && (
                  <button
                    onClick={() => setTechSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {BULLET_CATEGORIES.map((cat) => {
                  const count =
                    cat.id === 'all'
                      ? TECH_BULLET_POINTS.length
                      : TECH_BULLET_POINTS.filter((b) => b.category === cat.id).length;
                  const isActive = techCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTechCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 ${
                        isActive
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      <span>{lang === 'en' ? cat.labelEn : cat.labelVi}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-black/20 text-neutral-950 font-mono font-bold' : 'bg-neutral-900 text-neutral-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of Bullet Cards */}
            <div className="px-6 sm:px-8 py-4 flex-1 overflow-y-auto space-y-3.5 max-h-[50vh]">
              {TECH_BULLET_POINTS.filter((item) => {
                const matchesCategory = techCategoryFilter === 'all' || item.category === techCategoryFilter;
                if (!matchesCategory) return false;
                if (!techSearchQuery.trim()) return true;
                const q = techSearchQuery.toLowerCase();
                return (
                  item.textVi.toLowerCase().includes(q) ||
                  item.textEn.toLowerCase().includes(q) ||
                  item.techStack.some((tech) => tech.toLowerCase().includes(q)) ||
                  item.actionVerbVi.toLowerCase().includes(q) ||
                  item.actionVerbEn.toLowerCase().includes(q) ||
                  item.metric.toLowerCase().includes(q)
                );
              }).map((bullet) => {
                const isCopied = copiedBulletId === bullet.id;
                const isInserted = insertedBulletId === bullet.id;
                const categoryDef = BULLET_CATEGORIES.find((c) => c.id === bullet.category);
                const activeText = lang === 'en' ? bullet.textEn : bullet.textVi;

                return (
                  <div
                    key={bullet.id}
                    className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-sm space-y-3 group"
                  >
                    {/* Header Row: Category Badge + Action Verb + Metric Highlight */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${categoryDef?.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                          {lang === 'en' ? categoryDef?.labelEn : categoryDef?.labelVi}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-semibold">
                          ⚡ {lang === 'en' ? bullet.actionVerbEn : bullet.actionVerbVi}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-amber-300/90 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 flex items-center space-x-1">
                        <span>📈</span>
                        <span>{bullet.metric}</span>
                      </span>
                    </div>

                    {/* Bullet Description Text */}
                    <p className="text-xs sm:text-[13px] text-neutral-200 leading-relaxed font-normal">
                      • {activeText}
                    </p>

                    {/* Tech Stack Tags & Actions */}
                    <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {bullet.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
                          >
                            #{tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyBullet(bullet)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                            isCopied
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                          }`}
                          title="Sao chép câu gợi ý này"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t.techCopied}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{t.techCopyBtn}</span>
                            </>
                          )}
                        </button>

                        {/* Insert Button */}
                        <button
                          type="button"
                          onClick={() => handleInsertBullet(bullet)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                            isInserted
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold shadow-md shadow-amber-500/20 active:scale-95'
                          }`}
                          title={techTarget ? `Chèn ngay vào "${techTarget.title}"` : 'Sao chép & áp dụng'}
                        >
                          {isInserted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>{t.techInserted}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-neutral-950" />
                              <span>{t.techInsertBtn}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty Search State */}
              {TECH_BULLET_POINTS.filter((item) => {
                const matchesCategory = techCategoryFilter === 'all' || item.category === techCategoryFilter;
                if (!matchesCategory) return false;
                if (!techSearchQuery.trim()) return true;
                const q = techSearchQuery.toLowerCase();
                return (
                  item.textVi.toLowerCase().includes(q) ||
                  item.textEn.toLowerCase().includes(q) ||
                  item.techStack.some((tech) => tech.toLowerCase().includes(q)) ||
                  item.actionVerbVi.toLowerCase().includes(q) ||
                  item.actionVerbEn.toLowerCase().includes(q) ||
                  item.metric.toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-neutral-400 text-xs">
                    {t.techNoResults}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTechSearchQuery('');
                      setTechCategoryFilter('all');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
                  >
                    {lang === 'en' ? 'Reset search filter' : 'Xoá bộ lọc tìm kiếm'}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-3.5 bg-[#131316] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-neutral-400 text-[11px]">
                {lang === 'en'
                  ? '💡 You can click text directly on your CV to further refine numbers and details.'
                  : '💡 Bạn có thể nhấp trực tiếp vào chữ trên CV để tiếp tục chỉnh sửa con số và chi tiết thực tế.'}
              </span>
              <button
                type="button"
                onClick={() => setShowTechModal(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CV STRENGTH & ATS CHECKLIST MODAL ================= */}
      {showStrengthModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#18181c] border border-neutral-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-800 flex items-start justify-between bg-gradient-to-r from-emerald-950/20 via-neutral-900 to-cyan-950/20">
              <div className="flex items-start space-x-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-600/30 border border-emerald-500/40 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {t.strengthModalTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[10px] font-bold text-emerald-300 tracking-wider font-mono">
                      14 ATS BENCHMARKS
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    {t.strengthModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStrengthModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Rating Hero Card */}
            <div className="px-6 sm:px-8 py-5 bg-[#141417] border-b border-neutral-800">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 via-[#18181f] to-neutral-900 border border-neutral-800 shadow-md flex flex-col md:flex-row items-center gap-6">
                {/* Circular Score Gauge */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="text-neutral-800 stroke-current"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className={`stroke-current transition-all duration-1000 ease-out ${
                        cvStrength.score >= 90
                          ? 'text-emerald-400'
                          : cvStrength.score >= 75
                          ? 'text-cyan-400'
                          : cvStrength.score >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                      strokeWidth="8"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * Math.min(100, Math.max(0, cvStrength.score))) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                      {cvStrength.score}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">
                      / 100 PTS
                    </span>
                  </div>
                </div>

                {/* Score Details & Diagnosis */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${cvStrength.ratingBg} ${cvStrength.ratingColor}`}
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? cvStrength.ratingEn : cvStrength.ratingVi}</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      • {cvStrength.passedCount}/{cvStrength.totalCount} {t.strengthCriteriaPassed}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {lang === 'en' ? cvStrength.summaryEn : cvStrength.summaryVi}
                  </p>
                  {/* Category mini pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    {cvStrength.categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between text-[11px]"
                      >
                        <span className="text-neutral-400 truncate pr-1">
                          {lang === 'en' ? cat.titleEn : cat.titleVi}
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            cat.earned === cat.total ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {cat.earned}/{cat.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist Filter Tabs */}
            <div className="px-6 sm:px-8 py-3 bg-[#131316] border-b border-neutral-800 flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setStrengthFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  strengthFilter === 'all'
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {t.strengthFilterAll} ({cvStrength.totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStrengthFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  strengthFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <span>{t.strengthFilterPending}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono text-[10px]">
                  {cvStrength.totalCount - cvStrength.passedCount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setStrengthFilter('passed')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                  strengthFilter === 'passed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <span>{t.strengthFilterPassed}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-mono text-[10px]">
                  {cvStrength.passedCount}
                </span>
              </button>
            </div>

            {/* Checklist Items Container */}
            <div className="px-6 sm:px-8 py-4 flex-1 overflow-y-auto space-y-3 max-h-[46vh]">
              {cvStrength.items
                .filter((item) => {
                  if (strengthFilter === 'pending') return !item.passed;
                  if (strengthFilter === 'passed') return item.passed;
                  return true;
                })
                .map((item) => {
                  const title = lang === 'en' ? item.titleEn : item.titleVi;
                  const desc = lang === 'en' ? item.descEn : item.descVi;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.passed
                          ? 'bg-neutral-900/60 border-neutral-800/80'
                          : 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5 shrink-0">
                          {item.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={`text-xs sm:text-sm font-semibold ${
                                item.passed ? 'text-neutral-200' : 'text-amber-200 font-bold'
                              }`}
                            >
                              {title}
                            </h4>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                                item.passed
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {item.passed ? `+${item.points} pts` : `0/${item.points} pts`}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed max-w-2xl">
                            {desc}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 self-end sm:self-center">
                        {item.passed ? (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{lang === 'en' ? 'Verified' : 'Đạt chuẩn'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setShowStrengthModal(false);
                              if (item.actionSpecial === 'openTechModal') {
                                setShowTechModal(true);
                              } else if (item.actionTab) {
                                setDrawerTab(item.actionTab as any);
                                setActiveRailTab('content');
                                setIsDrawerOpen(true);
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                          >
                            <span>
                              {lang === 'en'
                                ? item.actionLabelEn || t.strengthFixBtn
                                : item.actionLabelVi || t.strengthFixBtn}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* ATS Golden Rules Banner */}
            <div className="px-6 sm:px-8 py-3 bg-[#111114] border-t border-neutral-800 text-[11px]">
              <div className="space-y-1 text-neutral-400">
                <span className="font-bold text-cyan-300 block text-xs">
                  {t.strengthAtsTipsTitle}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                  <p>{t.strengthAtsTip1}</p>
                  <p>{t.strengthAtsTip2}</p>
                  <p>{t.strengthAtsTip3}</p>
                  <p>{t.strengthAtsTip4}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-3.5 bg-[#131316] border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px]">
                {lang === 'en'
                  ? '💡 Tip: Aim for 90+ points to maximize interview callback rates with tech recruiters.'
                  : '💡 Mẹo: Hãy hướng tới 90+ điểm để tối đa hóa tỷ lệ gọi phỏng vấn từ các công ty công nghệ.'}
              </span>
              <button
                type="button"
                onClick={() => setShowStrengthModal(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= JD MATCHER & KEYWORD GAP MODAL ================= */}
      {showJDModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#141822] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[92vh] max-h-[92vh] md:h-[88vh] md:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 sm:px-7 py-3 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/30 via-[#141822] to-cyan-950/30 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 via-cyan-500/15 to-blue-600/30 border border-indigo-500/40 text-cyan-400 shrink-0">
                  <Target className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {t.jdMatcherTitle}
                    </h3>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[9px] font-bold text-indigo-300 tracking-wider font-mono">
                      ATS KEYWORD GAP
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {t.jdMatcherSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJDModal(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Sample JD Presets Bar */}
            <div className="px-5 sm:px-7 py-2 bg-[#0B0E17] border-b border-white/10 flex items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-neutral-400 text-[11px] font-medium shrink-0">
                  {t.jdSamplePrompt}
                </span>
                {SAMPLE_JDS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSampleJD(sample)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                      selectedSampleJdId === sample.id
                        ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 font-semibold shadow-xs'
                        : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <span>
                      {sample.id === 'frontend-sr' && '🚀'}
                      {sample.id === 'backend-sr' && '⚙️'}
                      {sample.id === 'devops-cloud' && '☁️'}
                      {sample.id === 'ai-software' && '🤖'}
                    </span>
                    <span>
                      {sample.id === 'frontend-sr' && (lang === 'en' ? 'Frontend (React/Next)' : 'Frontend (React/Next)')}
                      {sample.id === 'backend-sr' && (lang === 'en' ? 'Backend (Node/Go)' : 'Backend (Node/Go)')}
                      {sample.id === 'devops-cloud' && (lang === 'en' ? 'DevOps (AWS/K8s)' : 'DevOps (AWS/K8s)')}
                      {sample.id === 'ai-software' && (lang === 'en' ? 'AI Engineer (Python/RAG)' : 'AI Engineer (Python/RAG)')}
                    </span>
                  </button>
                ))}
              </div>
              {jdInputText && (
                <button
                  type="button"
                  onClick={() => {
                    setJdInputText('');
                    setSelectedSampleJdId(null);
                  }}
                  className="px-2 py-1 rounded-lg text-[11px] text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t.jdClearBtn}</span>
                </button>
              )}
            </div>

            {/* Main Interactive 2-Column Workspace */}
            <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden flex flex-col md:grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {/* Left Column: Job Description Textarea */}
              <div className="md:col-span-5 flex flex-col p-4 sm:p-5 bg-[#0E121B] shrink-0 md:shrink md:h-full min-h-0 space-y-2.5">
                <div className="flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-white">{t.jdInputLabel}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-400 text-[11px]">
                    <span>
                      {jdInputText.trim() ? jdInputText.trim().split(/\s+/).filter(Boolean).length : 0} {lang === 'en' ? 'words' : 'từ'}
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (navigator.clipboard) {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setJdInputText(text);
                              setSelectedSampleJdId(null);
                            }
                          }
                        } catch {
                          // Clipboard permission denied or unavailable
                        }
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
                      title={t.jdPasteClipboard}
                    >
                      <Copy className="w-3 h-3" />
                      <span>{t.jdPasteClipboard}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  value={jdInputText}
                  onChange={(e) => {
                    setJdInputText(e.target.value);
                    setSelectedSampleJdId(null);
                  }}
                  placeholder={t.jdPastePlaceholder}
                  className="h-36 sm:h-44 md:h-full md:flex-1 w-full bg-[#080B11] border border-white/10 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/60 font-mono leading-relaxed resize-none overflow-y-auto"
                />

                <p className="text-[10px] text-neutral-400 leading-tight shrink-0">
                  {lang === 'en'
                    ? '💡 Real-time ATS match scoring automatically tracks your CV skills, experience, and projects.'
                    : '💡 Tự động so khớp các kỹ năng công nghệ trong JD với toàn bộ nội dung CV theo thời gian thực.'}
                </p>
              </div>

              {/* Right Column: Keyword Match & Gap Breakdown */}
              <div className="md:col-span-7 flex flex-col bg-[#141822] min-h-[380px] md:min-h-0 md:h-full overflow-hidden">
                {/* Fixed Top Header (Non-scrolling: Score + Categories + Filter Tabs) */}
                <div className="p-3.5 sm:p-4 pb-2.5 border-b border-white/10 bg-[#101420] shrink-0 space-y-2">
                  {/* Score & Rating Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                        {jdMatchResult.matchScore}%
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${jdMatchResult.ratingBg} ${jdMatchResult.ratingColor}`}>
                            {lang === 'en' ? jdMatchResult.ratingEn : jdMatchResult.ratingVi}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {jdMatchResult.matchedCount} / {jdMatchResult.totalJDKeywords} {lang === 'en' ? 'keywords' : 'từ khóa đã phủ'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-[260px] text-right hidden sm:block">
                      {lang === 'en' ? jdMatchResult.summaryEn : jdMatchResult.summaryVi}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        jdMatchResult.matchScore >= 80
                          ? 'bg-emerald-500'
                          : jdMatchResult.matchScore >= 65
                          ? 'bg-cyan-500'
                          : jdMatchResult.matchScore >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${jdMatchResult.matchScore}%` }}
                    />
                  </div>

                  {/* Category Coverage Breakdown (Horizontal Scroll Chips) */}
                  {jdMatchResult.categoryBreakdown.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                      {jdMatchResult.categoryBreakdown.map((cat) => (
                        <span
                          key={cat.category}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-neutral-300 flex-shrink-0 flex items-center space-x-1"
                        >
                          <span>{lang === 'en' ? cat.titleEn : cat.titleVi}:</span>
                          <strong className="text-white font-mono">{cat.matched}/{cat.total}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Filter Tabs */}
                  <div className="flex items-center space-x-1.5 bg-[#090C13] border border-white/10 rounded-xl p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setJdFilter('all')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        jdFilter === 'all'
                          ? 'bg-white/15 text-white font-bold shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.jdAllFilter} ({jdMatchResult.totalJDKeywords})
                    </button>
                    <button
                      type="button"
                      onClick={() => setJdFilter('missing')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                        jdFilter === 'missing'
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
                          : 'text-amber-400/80 hover:text-amber-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{t.jdKeywordsMissing} ({jdMatchResult.missingCount})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJdFilter('matched')}
                      className={`flex-1 py-1 px-2 rounded-lg font-medium text-center transition-all cursor-pointer flex items-center justify-center space-x-1 ${
                        jdFilter === 'matched'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
                          : 'text-emerald-400/80 hover:text-emerald-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{t.jdKeywordsMatched} ({jdMatchResult.matchedCount})</span>
                    </button>
                  </div>
                </div>

                {/* Keyword Cards List (Fills entire remaining space, independently scrollable) */}
                <div className="flex-1 min-h-[220px] md:min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-2.5">
                  {/* Missing Keywords */}
                  {(jdFilter === 'all' || jdFilter === 'missing') &&
                    jdMatchResult.missingKeywords.map((k) => {
                      const meta = TECH_CATEGORY_META[k.category] || {
                        titleVi: k.category,
                        titleEn: k.category,
                        color: 'text-neutral-400',
                        badgeBg: 'bg-white/10 text-neutral-300 border-white/10',
                      };
                      const isAdded = addedSkillKeyword === k.name || cv.skills.some((s) => s.toLowerCase() === k.name.toLowerCase());
                      const isCopied = copiedKeyword === k.name;

                      return (
                        <div
                          key={`missing-${k.name}`}
                          className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/25 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="font-bold text-amber-300 text-sm">{k.name}</span>
                              <span className={`text-[9px] px-2 py-0.2 rounded-full border ${meta.badgeBg}`}>
                                {lang === 'en' ? meta.titleEn : meta.titleVi}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                                {lang === 'en' ? `in JD: ${k.countInJD}x` : `JD nhắc: ${k.countInJD} lần`}
                              </span>
                              {k.priority === 'high' && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                  {lang === 'en' ? 'HIGH PRIORITY' : 'YÊU CẦU CAO'}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-snug">
                              {lang === 'en' ? k.recommendationEn : k.recommendationVi}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAddKeywordToSkills(k.name)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs active:scale-95'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{t.jdAddedToSkills}</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{t.jdAddToSkills}</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyKeyword(k.name)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                              title={t.jdCopyKeyword}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  {/* Matched Keywords */}
                  {(jdFilter === 'all' || jdFilter === 'matched') &&
                    jdMatchResult.matchedKeywords.map((k) => {
                      const meta = TECH_CATEGORY_META[k.category] || {
                        titleVi: k.category,
                        titleEn: k.category,
                        color: 'text-neutral-400',
                        badgeBg: 'bg-white/10 text-neutral-300 border-white/10',
                      };
                      const isCopied = copiedKeyword === k.name;

                      return (
                        <div
                          key={`matched-${k.name}`}
                          className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/25 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-3 shadow-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="font-bold text-emerald-300 text-sm">{k.name}</span>
                              <span className={`text-[9px] px-2 py-0.2 rounded-full border ${meta.badgeBg}`}>
                                {lang === 'en' ? meta.titleEn : meta.titleVi}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center space-x-1">
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>
                                  {lang === 'en' ? `in CV: ${k.countInCV}x` : `Đã có trong CV: ${k.countInCV} lần`}
                                </span>
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              {lang === 'en'
                                ? `Matched with job requirement (${k.countInJD}x in JD). Well covered!`
                                : `Trùng khớp với yêu cầu của tin tuyển dụng (${k.countInJD} lần trong JD).`}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyKeyword(k.name)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer shrink-0"
                            title={t.jdCopyKeyword}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}

                  {/* Empty State: Missing filter has 0 missing */}
                  {jdFilter === 'missing' && jdMatchResult.missingCount === 0 && jdMatchResult.totalJDKeywords > 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-emerald-300">
                        {lang === 'en' ? 'All JD Keywords Covered!' : 'Đã có đầy đủ từ khóa trong CV!'}
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        {lang === 'en'
                          ? 'Congratulations! Your CV includes every technical skill and keyword found in this Job Description.'
                          : 'Chúc mừng! Hồ sơ CV của bạn đã bao phủ trọn vẹn toàn bộ các kỹ năng công nghệ được phát hiện trong tin tuyển dụng này.'}
                      </p>
                    </div>
                  )}

                  {/* Empty State: Matched filter has 0 matched */}
                  {jdFilter === 'matched' && jdMatchResult.matchedCount === 0 && jdMatchResult.totalJDKeywords > 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-semibold text-amber-300">
                        {lang === 'en' ? 'No Matched Keywords Yet' : 'Chưa có từ khóa trùng khớp'}
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        {lang === 'en'
                          ? 'None of the keywords from this JD were found in your CV. Click "Missing Keywords" tab to add them.'
                          : 'Chưa tìm thấy từ khóa nào trong CV trùng khớp với JD. Hãy chuyển sang tab "Từ khóa còn thiếu" để bổ sung ngay vào Kỹ năng.'}
                      </p>
                    </div>
                  )}

                  {/* Empty State: No JD keywords detected */}
                  {jdMatchResult.totalJDKeywords === 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/10 bg-white/5 space-y-2">
                      <Search className="w-8 h-8 text-neutral-500 mx-auto animate-pulse" />
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        {t.jdEmptyKeywords}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-7 py-2.5 bg-[#0E121B] border-t border-white/10 flex items-center justify-between text-xs shrink-0">
              <span className="text-neutral-400 text-[11px] line-clamp-1 mr-2">
                {t.jdAtsTip}
              </span>
              <button
                type="button"
                onClick={() => setShowJDModal(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium transition-colors cursor-pointer shrink-0"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CV WORKSPACE CANVAS (FIGMA/MIRO DARK DOT GRID) ================= */}
      <main
        className="flex-1 h-full overflow-y-auto relative flex flex-col items-center py-8 sm:py-12 px-4 sm:px-10 pb-32 no-scrollbar transition-all"
        style={{
          backgroundColor: '#0B0F17',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Minimal Floating Status Pill */}
        <div className="no-print mb-4 px-4 py-1.5 rounded-full bg-[#161B26]/90 border border-white/10 backdrop-blur-md shadow-lg text-[11px] text-neutral-400 flex items-center space-x-2 select-none flex-wrap justify-center flex-shrink-0">
          {isPublicView ? (
            <>
              <span className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.publicVerifiedBadge}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu:'}</span>
                <strong className="text-white font-medium capitalize">{activeTemplateDef.name}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300">
                {lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-cyan-400 font-mono font-medium">A4 210 × 297 mm</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-400">
                {lang === 'en' ? 'Verified Recruiter View' : 'Chế độ xem trực tuyến cho Nhà tuyển dụng'}
              </span>
            </>
          ) : docMode === 'cover_letter' ? (
            <>
              <span className="flex items-center space-x-1">
                <span className="text-purple-400 font-semibold flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Matching Cover Letter' : 'Thư xin việc đồng bộ'}</span>
                </span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu đồng bộ:'}</span>
                <strong className="text-white font-medium capitalize">{activeTemplateDef.name}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-cyan-400 font-mono font-medium">A4 210 × 297 mm</span>
              <span className="text-neutral-600 hidden sm:inline">•</span>
              <span className="text-neutral-400 hidden sm:inline">
                {lang === 'en' ? 'Click any text on letter to edit directly' : 'Nhấp trực tiếp vào chữ trên thư để chỉnh sửa'}
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center space-x-1">
                <span className="text-neutral-500">{lang === 'en' ? 'Template:' : 'Mẫu:'}</span>
                <strong className="text-white font-medium">{activeTemplateDef.name}</strong>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center space-x-1">
                <span>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className={isCompact ? 'text-amber-400 font-medium' : 'text-neutral-400'}>
                {isCompact ? (lang === 'en' ? '1-Page Fit' : 'Chuẩn 1 trang A4') : (lang === 'en' ? 'Standard' : 'Tiêu chuẩn')}
              </span>
              <span className="text-neutral-600">•</span>
              <span
                className="flex items-center space-x-1 font-mono font-semibold"
                style={{
                  color: cvStrength.score >= 90 ? '#34d399' : cvStrength.score >= 75 ? '#22d3ee' : cvStrength.score >= 50 ? '#fbbf24' : '#fb7185',
                }}
              >
                <Gauge className="w-3 h-3" />
                <span>{cvStrength.score}% ATS</span>
              </span>
              <span className="text-neutral-600 hidden sm:inline">•</span>
              <span className="text-neutral-400 hidden sm:inline">
                {lang === 'en' ? 'Click any text on CV to edit directly' : 'Nhấp trực tiếp vào chữ để sửa'}
              </span>
            </>
          )}
        </div>
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
          className="transition-transform duration-200"
        >
          {/* ================= THE A4 SHEET ================= */}
          <CVReadOnlyContext.Provider value={isPublicView}>
            {docMode === 'cover_letter' ? (
              <CoverLetterCanvas
                coverLetter={currentCoverLetter}
                template={template}
                accentColor={accentColor}
                fontFamily={fontFamily}
                lang={lang}
                onUpdateField={handleUpdateCoverLetterField}
                isEditable={!isPublicView}
              />
            ) : isLoading ? (
            <CVSkeletonLoading />
          ) : (
            <div
              id="cv-paper"
              className={`cv-paper bg-white text-neutral-900 shadow-2xl relative w-[210mm] min-h-[297mm] rounded-sm ${fontClass} ${
                isCompact ? 'cv-compact leading-snug' : 'leading-relaxed'
              } ${isPublicView ? 'cv-public-view' : ''} overflow-hidden animate-in fade-in duration-300`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                ['--cv-body-size' as any]: `${typographyConfig.bodyFontSize}px`,
                ['--cv-heading-size' as any]: `${typographyConfig.headingFontSize}px`,
                ['--cv-line-height' as any]: `${typographyConfig.lineHeight}`,
                ['--cv-section-gap' as any]: `${typographyConfig.sectionSpacing}px`,
                ['--cv-item-gap' as any]: `${typographyConfig.itemSpacing}px`,
                ['--cv-pad-top-bottom' as any]: `${typographyConfig.pagePaddingTopBottom}px`,
                ['--cv-pad-left-right' as any]: `${typographyConfig.pagePaddingLeftRight}px`,
              }}
            >
              {/* 1-Page A4 Cutoff Indicator Line (Only visible on screen, never printed) */}
              <div
                className="no-print absolute left-0 right-0 border-b-2 border-dashed border-amber-500/80 z-30 pointer-events-none flex items-center justify-end pr-3 select-none"
                style={{ top: '297mm' }}
              >
                <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-t font-mono shadow-sm tracking-wide">
                  ✂ Giới hạn trang 1 (297mm) — Nội dung bên dưới sẽ tràn sang trang 2
                </span>
              </div>

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 1: RABBIT (CONNECTED TIMELINE & DARK TECH HEADER)  */}
            {/* ========================================================================= */}
            {template === 'rabbit' && (
              <div className="min-h-[297mm] flex flex-col">
                {/* Rabbit Dark Tech Header */}
                <div
                  className={`${pad.header} text-white flex items-center justify-between border-b-4`}
                  style={{ backgroundColor: activeColor.sidebarBg, borderColor: activeColor.primary }}
                >
                  <div className="space-y-2 max-w-[72%]">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
                        Technical Profile
                      </span>
                    </div>
                    <InlineEditable
                      tag="h1"
                      value={cv.name}
                      onChange={(val) => setCv({ ...cv, name: val })}
                      singleLine
                      className="text-3xl font-bold uppercase tracking-tight text-white block"
                    />
                    <InlineEditable
                      tag="p"
                      value={cv.role}
                      onChange={(val) => setCv({ ...cv, role: val })}
                      singleLine
                      className="text-xs font-semibold tracking-wider uppercase text-cyan-400 block"
                    />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-300 pt-1 font-mono">
                      <span>✉ <InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                      <span>☎ <InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                      <span>📍 <InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id} className="inline-flex items-center space-x-1">
                          <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={true}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-2xl"
                      size="w-24 h-24"
                      className="border-cyan-400/50 shadow-xl"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                {/* Rabbit Body (2 Columns with Connected Timeline) */}
                <div className={`${pad.body} flex-1 grid grid-cols-1 md:grid-cols-12 ${pad.gridGap}`}>
                  {/* Left Column (65% width): Summary, Work Experience Timeline & Projects */}
                  <div className={`md:col-span-7 ${pad.sectionGap}`}>
                    {sectionOrder
                      .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'summary') {
                          return (
                            <div key="summary" className={`${pad.cardPad} rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 shadow-sm`}>
                              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center space-x-1.5">
                                <User className="w-3.5 h-3.5 text-cyan-600" />
                                <span>{t.summaryGoal}</span>
                              </h2>
                              <InlineEditable
                                tag="p"
                                value={cv.summary}
                                onChange={(val) => setCv({ ...cv, summary: val })}
                                className={`${pad.textSummary} text-neutral-700 block text-justify`}
                              />
                            </div>
                          );
                        }
                        if (secKey === 'experience') {
                          return (
                            <div key="experience" className={pad.itemGap}>
                              <div className="flex justify-between items-center pb-1.5 border-b-2" style={{ borderColor: activeColor.border }}>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                                  <Briefcase className="w-3.5 h-3.5 text-cyan-600" />
                                  <span>{t.experienceTimeline}</span>
                                </h2>
                                <button
                                  onClick={() => addTimelineItem()}
                                  className="no-print text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>{t.addItem}</span>
                                </button>
                              </div>

                              {/* Connected Vertical Timeline Line */}
                              <div className={`relative pl-6 ml-2 border-l-2 ${pad.timelineLine}`} style={{ borderColor: activeColor.border }}>
                                {cv.timeline.map((item, idx) => (
                                  <div key={item.id} className={`relative group ${pad.itemSubGap}`}>
                                    {/* Circular Connecting Timeline Dot */}
                                    <div
                                      className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125"
                                      style={{ backgroundColor: activeColor.primary }}
                                    />
                                    <ItemControls
                                      index={idx}
                                      total={cv.timeline.length}
                                      onMoveUp={() => moveTimelineItem(idx, 'up')}
                                      onMoveDown={() => moveTimelineItem(idx, 'down')}
                                      onAddBelow={() => addTimelineItem(idx)}
                                      onDelete={() => deleteTimelineItem(item.id)}
                                    />
                                    <div className="flex justify-between items-baseline text-xs">
                                      <InlineEditable
                                        tag="span"
                                        value={item.role}
                                        onChange={(val) => updateTimelineItem(item.id, 'role', val)}
                                        singleLine
                                        className="font-bold text-neutral-900"
                                      />
                                      <InlineEditable
                                        tag="span"
                                        value={formatPeriod(item.period, lang)}
                                        onChange={(val) => updateTimelineItem(item.id, 'period', val)}
                                        singleLine
                                        className="font-mono text-[10px] text-cyan-800 font-semibold px-2 py-0.5 rounded bg-neutral-100"
                                      />
                                    </div>
                                    <InlineEditable
                                      tag="p"
                                      value={item.desc}
                                      onChange={(val) => updateTimelineItem(item.id, 'desc', val)}
                                      className={`${pad.textDesc} text-neutral-600 block text-justify`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (secKey === 'projects') {
                          return (
                            <div key="projects" className={`${pad.itemGap} pt-1`}>
                              <div className="flex justify-between items-center pb-1.5 border-b-2" style={{ borderColor: activeColor.border }}>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                                  <FolderGit2 className="w-3.5 h-3.5 text-cyan-600" />
                                  <span>{t.projectsFeatured}</span>
                                </h2>
                                <button
                                  onClick={() => addProjectItem()}
                                  className="no-print text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>{t.addProject}</span>
                                </button>
                              </div>

                              <div className={pad.itemSubGap}>
                                {cv.projects.map((proj, idx) => (
                                  <div key={proj.id} className={`relative group ${pad.cardPad} rounded-xl bg-neutral-50/80 border border-neutral-200/80 ${pad.itemSubGap} shadow-sm`}>
                                    <ItemControls
                                      index={idx}
                                      total={cv.projects.length}
                                      onMoveUp={() => moveProjectItem(idx, 'up')}
                                      onMoveDown={() => moveProjectItem(idx, 'down')}
                                      onAddBelow={() => addProjectItem(idx)}
                                      onDelete={() => deleteProjectItem(proj.id)}
                                    />
                                    <div className="flex justify-between items-baseline text-xs">
                                      <div className="flex items-center space-x-1 font-bold text-neutral-900">
                                        <InlineEditable
                                          tag="span"
                                          value={proj.title}
                                          onChange={(val) => updateProjectItem(proj.id, 'title', val)}
                                          singleLine
                                        />
                                        <span>—</span>
                                        <InlineEditable
                                          tag="span"
                                          value={proj.category}
                                          onChange={(val) => updateProjectItem(proj.id, 'category', val)}
                                          singleLine
                                          className="text-neutral-600 font-normal"
                                        />
                                      </div>
                                      <InlineEditable
                                        tag="span"
                                        value={proj.year}
                                        onChange={(val) => updateProjectItem(proj.id, 'year', val)}
                                        singleLine
                                        className="font-mono text-[10px] text-neutral-500"
                                      />
                                    </div>
                                    <InlineEditable
                                      tag="p"
                                      value={proj.desc}
                                      onChange={(val) => updateProjectItem(proj.id, 'desc', val)}
                                      className={`${pad.textDesc} text-neutral-600 block`}
                                    />
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      {proj.badges.map((b) => (
                                        <span key={b} className="text-[9px] px-1.5 py-0.5 bg-white border border-neutral-200 rounded font-mono font-medium text-neutral-700">
                                          {b}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        const customSec = cv.customSections?.find((c) => c.id === secKey);
                        if (customSec) {
                          return (
                            <CustomSectionRenderer
                              key={customSec.id}
                              section={customSec}
                              template={template}
                              activeColor={activeColor}
                              lang={lang}
                              isCompact={isCompact}
                              onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                              onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                              onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                              onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                              onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                              onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                              onDeleteSection={() => removeCustomSection(customSec.id)}
                            />
                          );
                        }
                        return null;
                      })}
                  </div>

                  {/* Right Column (35% width): Skills Stack, Education & Credentials */}
                  <div className={`md:col-span-5 ${pad.sectionGap}`}>
                    {sectionOrder
                      .filter((id) => ['skills', 'education'].includes(id))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'skills') {
                          return (
                            <div key="skills" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1.5 border-b-2 flex items-center space-x-1.5" style={{ borderColor: activeColor.border }}>
                                <Code2 className="w-3.5 h-3.5 text-cyan-600" />
                                <span>{t.skillsTech}</span>
                              </h2>

                              <div className="flex flex-wrap gap-1.5 items-center">
                                {cv.skills.map((s, idx) => (
                                  <span
                                    key={`${s}-${idx}`}
                                    className="group/skill relative text-[11px] px-2.5 py-1 rounded-lg font-mono font-medium border shadow-xs inline-flex items-center space-x-1"
                                    style={{
                                      backgroundColor: activeColor.lightBg,
                                      color: activeColor.primary,
                                      borderColor: activeColor.border,
                                    }}
                                  >
                                    <InlineEditable
                                      tag="span"
                                      value={s}
                                      onChange={(v) => updateSkill(idx, v)}
                                      singleLine
                                    />
                                    <button
                                      onClick={() => removeSkill(idx)}
                                      className="no-print opacity-0 group-hover/skill:opacity-100 text-neutral-400 hover:text-rose-500 transition-opacity ml-1"
                                      title="Xoá kỹ năng"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}

                                {/* Inline Add Skill */}
                                {isAddingSkill ? (
                                  <div className="inline-flex items-center space-x-1 no-print">
                                    <input
                                      type="text"
                                      value={newSkillText}
                                      onChange={(e) => setNewSkillText(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          addSkill(newSkillText);
                                          setNewSkillText('');
                                          setIsAddingSkill(false);
                                        } else if (e.key === 'Escape') {
                                          setIsAddingSkill(false);
                                        }
                                      }}
                                      placeholder={lang === 'en' ? 'Skill...' : 'Kỹ năng...'}
                                      className="text-[10px] px-2 py-0.5 rounded border border-cyan-400 bg-white text-neutral-900 outline-none w-24"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => {
                                        addSkill(newSkillText);
                                        setNewSkillText('');
                                        setIsAddingSkill(false);
                                      }}
                                      className="p-1 rounded bg-cyan-600 text-white"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => setIsAddingSkill(false)}
                                      className="p-1 rounded bg-neutral-200 text-neutral-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setIsAddingSkill(true)}
                                    className="no-print text-[10px] px-2 py-0.5 rounded-lg border border-dashed border-cyan-500/50 text-cyan-700 hover:bg-cyan-50 transition-colors inline-flex items-center space-x-1 font-mono"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>{t.addSkill}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }
                        if (secKey === 'education') {
                          return (
                            <div key="education" className="space-y-3">
                              <div className="flex justify-between items-center pb-1.5 border-b-2" style={{ borderColor: activeColor.border }}>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                                  <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                                  <span>{t.education}</span>
                                </h2>
                                <button
                                  onClick={() => addEducationItem()}
                                  className="no-print text-[10px] text-cyan-600 hover:text-cyan-800 font-semibold flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>{t.addEducation}</span>
                                </button>
                              </div>

                              {cv.education.map((edu, idx) => (
                                <div key={edu.id} className="relative group p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-1">
                                  <ItemControls
                                    index={idx}
                                    total={cv.education.length}
                                    onMoveUp={() => moveEducationItem(idx, 'up')}
                                    onMoveDown={() => moveEducationItem(idx, 'down')}
                                    onAddBelow={() => addEducationItem(idx)}
                                    onDelete={() => deleteEducationItem(edu.id)}
                                  />
                                  <InlineEditable
                                    tag="span"
                                    value={edu.school}
                                    onChange={(val) => updateEducationItem(edu.id, 'school', val)}
                                    singleLine
                                    className="font-bold text-xs block text-neutral-900"
                                  />
                                  <InlineEditable
                                    tag="span"
                                    value={edu.degree}
                                    onChange={(val) => updateEducationItem(edu.id, 'degree', val)}
                                    singleLine
                                    className="text-[11px] text-cyan-800 font-semibold block"
                                  />
                                  <InlineEditable
                                    tag="span"
                                    value={edu.year}
                                    onChange={(val) => updateEducationItem(edu.id, 'year', val)}
                                    singleLine
                                    className="font-mono text-[10px] text-neutral-500 block"
                                  />
                                  <InlineEditable
                                    tag="p"
                                    value={edu.desc || ''}
                                    onChange={(val) => updateEducationItem(edu.id, 'desc', val)}
                                    className="text-[11px] text-neutral-600 pt-1 leading-relaxed block"
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        const customSec = cv.customSections?.find((c) => c.id === secKey);
                        if (customSec) {
                          return (
                            <CustomSectionRenderer
                              key={customSec.id}
                              section={customSec}
                              template={template}
                              activeColor={activeColor}
                              lang={lang}
                              isCompact={isCompact}
                              onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                              onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                              onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                              onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                              onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                              onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                              onDeleteSection={() => removeCustomSection(customSec.id)}
                            />
                          );
                        }
                        return null;
                      })}

                    {/* Engineering Practices */}
                    <div className="p-3.5 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-2 text-xs">
                      <h3 className="font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5 text-[11px]">
                        <Award className="w-3.5 h-3.5 text-cyan-600" />
                        <span>{t.codeStandards}</span>
                      </h3>
                      <ul className="text-[11px] text-neutral-600 space-y-1">
                        <li>{t.standardsCleanCode}</li>
                        <li>{t.standardsMicroservices}</li>
                        <li>{t.standardsCicd}</li>
                        <li>{t.standardsEnglish}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 2: CASCADE (LEFT COLORED SIDEBAR)                   */}
            {/* ========================================================================= */}
            {template === 'cascade' && (
              <div className="min-h-[297mm] flex">
                {/* Left Colored Sidebar (32% width) */}
                <div
                  className="w-[32%] text-white p-7 space-y-6 flex-shrink-0"
                  style={{ backgroundColor: activeColor.sidebarBg }}
                >
                  <AvatarBlock
                    avatar={cv.avatar}
                    name={cv.name}
                    showAvatar={cv.showAvatar}
                    shape="rounded-xl"
                    size="w-32 h-36"
                    className="mx-auto border-white/20 shadow-lg"
                    onTriggerUpload={triggerAvatarUpload}
                  />

                  {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                    <div className="flex justify-center pt-1">
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={true}
                        accentColorHex={activeColor.primary}
                      />
                    </div>
                  )}

                  {/* Sidebar Contact Info */}
                  <div className="space-y-2 text-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/20 pb-1">
                      {t.contactInfo}
                    </h3>
                    <div className="space-y-1.5 text-neutral-300">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine className="break-all" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine />
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine />
                      </div>
                      {getActiveTechLinks(cv).map((link) => (
                        <div key={link.id} className="flex items-center space-x-2">
                          <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                            className="break-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Sections */}
                  {sectionOrder
                    .filter((id) => ['skills', 'education'].includes(id))
                    .map((secKey) => {
                      if (!sectionVisibility[secKey]) return null;
                      if (secKey === 'skills') {
                        return (
                          <div key="skills" className="space-y-2 text-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/20 pb-1">
                              {t.skillsCore}
                            </h3>
                            <div className="flex flex-wrap gap-1">
                              {cv.skills.map((s, idx) => (
                                <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono inline-flex items-center space-x-1">
                                  <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                  <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-300 ml-1">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (secKey === 'education') {
                        return (
                          <div key="education" className="space-y-3 text-xs">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/20 pb-1">
                              {t.educationShort}
                            </h3>
                            {cv.education.map((edu, idx) => (
                              <div key={edu.id} className="relative group space-y-0.5">
                                <ItemControls
                                  index={idx}
                                  total={cv.education.length}
                                  onMoveUp={() => moveEducationItem(idx, 'up')}
                                  onMoveDown={() => moveEducationItem(idx, 'down')}
                                  onAddBelow={() => addEducationItem(idx)}
                                  onDelete={() => deleteEducationItem(edu.id)}
                                />
                                <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold text-white block" />
                                <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-300 block text-[11px]" />
                                <InlineEditable tag="span" value={edu.year} onChange={(v) => updateEducationItem(edu.id, 'year', v)} singleLine className="text-cyan-300 font-mono text-[10px] block" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>

                {/* Right Column (68% width) */}
                <div className="flex-1 p-8 space-y-6">
                  <div className="pb-4 border-b-2" style={{ borderColor: activeColor.border }}>
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-700 mt-1 block" />
                  </div>

                  {sectionOrder
                    .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
                    .map((secKey) => {
                      if (!sectionVisibility[secKey]) return null;
                      if (secKey === 'summary') {
                        return (
                          <div key="summary" className="space-y-2">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                              {t.summary}
                            </h2>
                            <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                          </div>
                        );
                      }
                      if (secKey === 'experience') {
                        return (
                          <div key="experience" className="space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                              {t.experience}
                            </h2>
                            {cv.timeline.map((item, idx) => (
                              <div key={item.id} className="relative group space-y-1">
                                <ItemControls
                                  index={idx}
                                  total={cv.timeline.length}
                                  onMoveUp={() => moveTimelineItem(idx, 'up')}
                                  onMoveDown={() => moveTimelineItem(idx, 'down')}
                                  onAddBelow={() => addTimelineItem(idx)}
                                  onDelete={() => deleteTimelineItem(item.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                  <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 leading-relaxed block" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      if (secKey === 'projects') {
                        return (
                          <div key="projects" className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                              {t.projects}
                            </h2>
                            {cv.projects.map((proj, idx) => (
                              <div key={proj.id} className="relative group space-y-1 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200">
                                <ItemControls
                                  index={idx}
                                  total={cv.projects.length}
                                  onMoveUp={() => moveProjectItem(idx, 'up')}
                                  onMoveDown={() => moveProjectItem(idx, 'down')}
                                  onAddBelow={() => addProjectItem(idx)}
                                  onDelete={() => deleteProjectItem(proj.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-neutral-900" />
                                  <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      const customSec = cv.customSections?.find((c) => c.id === secKey);
                      if (customSec) {
                        return (
                          <CustomSectionRenderer
                            key={customSec.id}
                            section={customSec}
                            template={template}
                            activeColor={activeColor}
                            lang={lang}
                            isCompact={isCompact}
                            onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                            onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                            onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                            onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                            onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                            onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                            onDeleteSection={() => removeCustomSection(customSec.id)}
                          />
                        );
                      }
                      return null;
                    })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 3: CHICKEN (EXECUTIVE TOP HEADER BANNER)            */}
            {/* ========================================================================= */}
            {template === 'chicken' && (
              <div>
                <div className="p-8 text-white flex items-center justify-between" style={{ backgroundColor: activeColor.sidebarBg }}>
                  <div className="space-y-2 max-w-[70%]">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-white block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-400 block" />
                    <p className="text-[11px] text-neutral-300 pt-1">
                      <InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /> •{' '}
                      <InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /> •{' '}
                      <InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine />
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id}>
                          {' • '}
                          <TechLinkIcon platform={link.platform} className="w-3 h-3 text-cyan-400 shrink-0 inline mr-1" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                          />
                        </span>
                      ))}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={true}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-full"
                      size="w-24 h-24"
                      className="border-white/30 shadow-md"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Summary */}
                  {sectionVisibility.summary && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">{t.summary}</h2>
                      <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left: Experience & Projects */}
                    <div className="md:col-span-7 space-y-6">
                      {sectionOrder
                        .filter((id) => ['experience', 'projects'].includes(id) || id.startsWith('custom_'))
                        .map((secKey) => {
                          if (!sectionVisibility[secKey]) return null;
                          if (secKey === 'experience') {
                            return (
                              <div key="experience" className="space-y-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">{t.experience}</h2>
                                {cv.timeline.map((item, idx) => (
                                  <div key={item.id} className="relative group space-y-0.5">
                                    <ItemControls
                                      index={idx}
                                      total={cv.timeline.length}
                                      onMoveUp={() => moveTimelineItem(idx, 'up')}
                                      onMoveDown={() => moveTimelineItem(idx, 'down')}
                                      onAddBelow={() => addTimelineItem(idx)}
                                      onDelete={() => deleteTimelineItem(item.id)}
                                    />
                                    <div className="flex justify-between items-baseline text-xs">
                                      <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                      <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                    </div>
                                    <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 leading-relaxed block" />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          if (secKey === 'projects') {
                            return (
                              <div key="projects" className="space-y-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">{t.projects}</h2>
                                {cv.projects.map((proj, idx) => (
                                  <div key={proj.id} className="relative group space-y-1 p-2 rounded bg-neutral-50">
                                    <ItemControls
                                      index={idx}
                                      total={cv.projects.length}
                                      onMoveUp={() => moveProjectItem(idx, 'up')}
                                      onMoveDown={() => moveProjectItem(idx, 'down')}
                                      onAddBelow={() => addProjectItem(idx)}
                                      onDelete={() => deleteProjectItem(proj.id)}
                                    />
                                    <div className="flex justify-between items-baseline text-xs">
                                      <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-neutral-900" />
                                      <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                    </div>
                                    <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          const customSec = cv.customSections?.find((c) => c.id === secKey);
                          if (customSec) {
                            return (
                              <CustomSectionRenderer
                                key={customSec.id}
                                section={customSec}
                                template={template}
                                activeColor={activeColor}
                                lang={lang}
                                isCompact={isCompact}
                                onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                                onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                                onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                                onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                                onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                                onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                                onDeleteSection={() => removeCustomSection(customSec.id)}
                              />
                            );
                          }
                          return null;
                        })}
                    </div>

                    {/* Right: Skills & Education */}
                    <div className="md:col-span-5 space-y-6">
                      {sectionOrder
                        .filter((id) => ['skills', 'education'].includes(id))
                        .map((secKey) => {
                          if (!sectionVisibility[secKey]) return null;
                          if (secKey === 'skills') {
                            return (
                              <div key="skills" className="space-y-2">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">{t.skillsTech}</h2>
                                <div className="flex flex-wrap gap-1.5">
                                  {cv.skills.map((s, idx) => (
                                    <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-medium inline-flex items-center space-x-1">
                                      <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                      <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
                                        <X className="w-2.5 h-2.5" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                          if (secKey === 'education') {
                            return (
                              <div key="education" className="space-y-3">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">{t.educationShort}</h2>
                                {cv.education.map((edu, idx) => (
                                  <div key={edu.id} className="relative group text-xs space-y-0.5">
                                    <ItemControls
                                      index={idx}
                                      total={cv.education.length}
                                      onMoveUp={() => moveEducationItem(idx, 'up')}
                                      onMoveDown={() => moveEducationItem(idx, 'down')}
                                      onAddBelow={() => addEducationItem(idx)}
                                      onDelete={() => deleteEducationItem(edu.id)}
                                    />
                                    <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                                    <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                                    <InlineEditable tag="span" value={edu.year} onChange={(v) => updateEducationItem(edu.id, 'year', v)} singleLine className="text-neutral-500 font-mono text-[10px] block" />
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 4: ICONIC (SECTION HEADER ICON BADGES)              */}
            {/* ========================================================================= */}
            {template === 'iconic' && (
              <div className="p-10 space-y-6">
                <div className="flex justify-between items-center pb-6 border-b-2 border-neutral-900">
                  <div className="space-y-1">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-700 block" />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 pt-1">
                      <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                      <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                      <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id} className="inline-flex items-center space-x-1 text-cyan-800">
                          <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={false}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-xl"
                      size="w-20 h-20"
                      className="border-cyan-600"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Summary, Experience, Projects */}
                  <div className="md:col-span-7 space-y-6">
                    {sectionOrder
                      .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'summary') {
                          return (
                            <div key="summary" className="space-y-2">
                              <div className="flex items-center space-x-2 pb-1 border-b border-neutral-300">
                                <div className="p-1 rounded bg-cyan-600 text-white"><User className="w-3.5 h-3.5" /></div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.summary}</h2>
                              </div>
                              <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                            </div>
                          );
                        }
                        if (secKey === 'experience') {
                          return (
                            <div key="experience" className="space-y-3">
                              <div className="flex items-center space-x-2 pb-1 border-b border-neutral-300">
                                <div className="p-1 rounded bg-cyan-600 text-white"><Briefcase className="w-3.5 h-3.5" /></div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.experience}</h2>
                              </div>
                              {cv.timeline.map((item, idx) => (
                                <div key={item.id} className="relative group space-y-0.5">
                                  <ItemControls
                                    index={idx}
                                    total={cv.timeline.length}
                                    onMoveUp={() => moveTimelineItem(idx, 'up')}
                                    onMoveDown={() => moveTimelineItem(idx, 'down')}
                                    onAddBelow={() => addTimelineItem(idx)}
                                    onDelete={() => deleteTimelineItem(item.id)}
                                  />
                                  <div className="flex justify-between items-baseline text-xs">
                                    <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                    <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                  </div>
                                  <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (secKey === 'projects') {
                          return (
                            <div key="projects" className="space-y-3">
                              <div className="flex items-center space-x-2 pb-1 border-b border-neutral-300">
                                <div className="p-1 rounded bg-cyan-600 text-white"><FolderGit2 className="w-3.5 h-3.5" /></div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.projects}</h2>
                              </div>
                              {cv.projects.map((proj, idx) => (
                                <div key={proj.id} className="relative group space-y-0.5 p-2 rounded bg-neutral-50">
                                  <ItemControls
                                    index={idx}
                                    total={cv.projects.length}
                                    onMoveUp={() => moveProjectItem(idx, 'up')}
                                    onMoveDown={() => moveProjectItem(idx, 'down')}
                                    onAddBelow={() => addProjectItem(idx)}
                                    onDelete={() => deleteProjectItem(proj.id)}
                                  />
                                  <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-xs text-neutral-900 block" />
                                  <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        const customSec = cv.customSections?.find((c) => c.id === secKey);
                        if (customSec) {
                          return (
                            <CustomSectionRenderer
                              key={customSec.id}
                              section={customSec}
                              template={template}
                              activeColor={activeColor}
                              lang={lang}
                              isCompact={isCompact}
                              onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                              onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                              onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                              onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                              onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                              onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                              onDeleteSection={() => removeCustomSection(customSec.id)}
                            />
                          );
                        }
                        return null;
                      })}
                  </div>

                  {/* Right Column: Skills, Education */}
                  <div className="md:col-span-5 space-y-6">
                    {sectionOrder
                      .filter((id) => ['skills', 'education'].includes(id))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'skills') {
                          return (
                            <div key="skills" className="space-y-2">
                              <div className="flex items-center space-x-2 pb-1 border-b border-neutral-300">
                                <div className="p-1 rounded bg-cyan-600 text-white"><Code2 className="w-3.5 h-3.5" /></div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.skillsShort}</h2>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {cv.skills.map((s, idx) => (
                                  <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-medium inline-flex items-center space-x-1">
                                    <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                    <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (secKey === 'education') {
                          return (
                            <div key="education" className="space-y-3">
                              <div className="flex items-center space-x-2 pb-1 border-b border-neutral-300">
                                <div className="p-1 rounded bg-cyan-600 text-white"><GraduationCap className="w-3.5 h-3.5" /></div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.educationShort}</h2>
                              </div>
                              {cv.education.map((edu, idx) => (
                                <div key={edu.id} className="relative group text-xs space-y-0.5">
                                  <ItemControls
                                    index={idx}
                                    total={cv.education.length}
                                    onMoveUp={() => moveEducationItem(idx, 'up')}
                                    onMoveDown={() => moveEducationItem(idx, 'down')}
                                    onAddBelow={() => addEducationItem(idx)}
                                    onDelete={() => deleteEducationItem(edu.id)}
                                  />
                                  <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                                  <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        const customSec = cv.customSections?.find((c) => c.id === secKey);
                        if (customSec) {
                          return (
                            <CustomSectionRenderer
                              key={customSec.id}
                              section={customSec}
                              template={template}
                              activeColor={activeColor}
                              lang={lang}
                              isCompact={isCompact}
                              onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                              onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                              onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                              onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                              onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                              onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                              onDeleteSection={() => removeCustomSection(customSec.id)}
                            />
                          );
                        }
                        return null;
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 5: DECKER (ROUNDED PILL BADGE HEADERS)              */}
            {/* ========================================================================= */}
            {template === 'decker' && (
              <div className="p-10 space-y-6">
                <div className="pb-4 border-b border-neutral-200 flex justify-between items-center">
                  <div>
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-600 mt-1 block" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 pt-1">
                      <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                      <span>|</span>
                      <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                      <span>|</span>
                      <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id} className="inline-flex items-center space-x-1 text-cyan-700">
                          <span>|</span>
                          <TechLinkIcon platform={link.platform} className="w-3 h-3 shrink-0 ml-1" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={false}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-full"
                      size="w-20 h-20"
                      className="border-cyan-500"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {sectionOrder.map((secKey) => {
                    if (!sectionVisibility[secKey]) return null;
                    if (secKey === 'summary') {
                      return (
                        <div key="summary" className="space-y-2">
                          <div className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: activeColor.primary }}>
                            {t.summaryShort}
                          </div>
                          <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                        </div>
                      );
                    }
                    if (secKey === 'experience') {
                      return (
                        <div key="experience" className="space-y-3">
                          <div className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: activeColor.primary }}>
                            {t.experience}
                          </div>
                          {cv.timeline.map((item, idx) => (
                            <div key={item.id} className="relative group space-y-0.5">
                              <ItemControls
                                index={idx}
                                total={cv.timeline.length}
                                onMoveUp={() => moveTimelineItem(idx, 'up')}
                                onMoveDown={() => moveTimelineItem(idx, 'down')}
                                onAddBelow={() => addTimelineItem(idx)}
                                onDelete={() => deleteTimelineItem(item.id)}
                              />
                              <div className="flex justify-between items-baseline text-xs">
                                <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                              </div>
                              <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (secKey === 'projects') {
                      return (
                        <div key="projects" className="space-y-3">
                          <div className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: activeColor.primary }}>
                            {t.projects}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {cv.projects.map((proj, idx) => (
                              <div key={proj.id} className="relative group p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                                <ItemControls
                                  index={idx}
                                  total={cv.projects.length}
                                  onMoveUp={() => moveProjectItem(idx, 'up')}
                                  onMoveDown={() => moveProjectItem(idx, 'down')}
                                  onAddBelow={() => addProjectItem(idx)}
                                  onDelete={() => deleteProjectItem(proj.id)}
                                />
                                <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-xs block text-neutral-900" />
                                <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-[11px] text-neutral-600 pt-1 block" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'skills') {
                      return (
                        <div key="skills" className="space-y-2">
                          <div className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: activeColor.primary }}>
                            {t.skillsShort}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cv.skills.map((s, idx) => (
                              <span key={idx} className="group/skill text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-medium inline-flex items-center space-x-1">
                                <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'education') {
                      return (
                        <div key="education" className="space-y-2">
                          <div className="inline-flex items-center px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: activeColor.primary }}>
                            {t.educationShort}
                          </div>
                          {cv.education.map((edu, idx) => (
                            <div key={edu.id} className="relative group text-xs space-y-0.5">
                              <ItemControls
                                index={idx}
                                total={cv.education.length}
                                onMoveUp={() => moveEducationItem(idx, 'up')}
                                onMoveDown={() => moveEducationItem(idx, 'down')}
                                onAddBelow={() => addEducationItem(idx)}
                                onDelete={() => deleteEducationItem(edu.id)}
                              />
                              <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                              <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    const customSec = cv.customSections?.find((c) => c.id === secKey);
                    if (customSec) {
                      return (
                        <CustomSectionRenderer
                          key={customSec.id}
                          section={customSec}
                          template={template}
                          activeColor={activeColor}
                          lang={lang}
                          isCompact={isCompact}
                          onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                          onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                          onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                          onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                          onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                          onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                          onDeleteSection={() => removeCustomSection(customSec.id)}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 6: BUBBLES (CARD BUBBLES)                          */}
            {/* ========================================================================= */}
            {template === 'bubbles' && (
              <div className="p-8 space-y-5 bg-[#fafafa]">
                <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex justify-between items-center">
                  <div className="space-y-1">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-600 block" />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 pt-1">
                      <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                      <span>•</span>
                      <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                      <span>•</span>
                      <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id} className="inline-flex items-center space-x-1 text-cyan-700">
                          <span>•</span>
                          <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0 ml-1" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={false}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-2xl"
                      size="w-20 h-20"
                      className="border-neutral-200"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                {sectionOrder.map((secKey) => {
                  if (!sectionVisibility[secKey]) return null;
                  if (secKey === 'summary') {
                    return (
                      <div key="summary" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.summaryShort}</h2>
                        <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                      </div>
                    );
                  }
                  if (secKey === 'experience') {
                    return (
                      <div key="experience" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.experience}</h2>
                        {cv.timeline.map((item, idx) => (
                          <div key={item.id} className="relative group space-y-0.5">
                            <ItemControls
                              index={idx}
                              total={cv.timeline.length}
                              onMoveUp={() => moveTimelineItem(idx, 'up')}
                              onMoveDown={() => moveTimelineItem(idx, 'down')}
                              onAddBelow={() => addTimelineItem(idx)}
                              onDelete={() => deleteTimelineItem(item.id)}
                            />
                            <div className="flex justify-between items-baseline text-xs">
                              <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                              <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                            </div>
                            <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                          </div>
                        ))}
                      </div>
                    );
                  }
                  if (secKey === 'projects') {
                    return (
                      <div key="projects" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.projects}</h2>
                        <div className="grid grid-cols-2 gap-3">
                          {cv.projects.map((proj, idx) => (
                            <div key={proj.id} className="relative group p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                              <ItemControls
                                index={idx}
                                total={cv.projects.length}
                                onMoveUp={() => moveProjectItem(idx, 'up')}
                                onMoveDown={() => moveProjectItem(idx, 'down')}
                                onAddBelow={() => addProjectItem(idx)}
                                onDelete={() => deleteProjectItem(proj.id)}
                              />
                              <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-xs block text-neutral-900" />
                              <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-[11px] text-neutral-600 pt-0.5 block" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (secKey === 'skills') {
                    return (
                      <div key="skills" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.skillsShort}</h2>
                        <div className="flex flex-wrap gap-1.5">
                          {cv.skills.map((s, idx) => (
                            <span key={idx} className="group/skill text-[10px] px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 font-medium inline-flex items-center space-x-1">
                              <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                              <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (secKey === 'education') {
                    return (
                      <div key="education" className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">{t.educationShort}</h2>
                        {cv.education.map((edu, idx) => (
                          <div key={edu.id} className="relative group text-xs space-y-0.5">
                            <ItemControls
                              index={idx}
                              total={cv.education.length}
                              onMoveUp={() => moveEducationItem(idx, 'up')}
                              onMoveDown={() => moveEducationItem(idx, 'down')}
                              onAddBelow={() => addEducationItem(idx)}
                              onDelete={() => deleteEducationItem(edu.id)}
                            />
                            <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                            <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                          </div>
                        ))}
                      </div>
                    );
                  }
                  const customSec = cv.customSections?.find((c) => c.id === secKey);
                  if (customSec) {
                    return (
                      <CustomSectionRenderer
                        key={customSec.id}
                        section={customSec}
                        template={template}
                        activeColor={activeColor}
                        lang={lang}
                        isCompact={isCompact}
                        onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                        onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                        onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                        onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                        onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                        onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                        onDeleteSection={() => removeCustomSection(customSec.id)}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 7: BASIC (1-COLUMN MINIMALIST ATS)                  */}
            {/* ========================================================================= */}
            {template === 'basic' && (
              <div className="p-10 space-y-6">
                <div className="text-center space-y-1.5 pb-4 border-b border-neutral-300">
                  <div className="flex items-center justify-center space-x-4 pb-2">
                    {cv.showAvatar && cv.avatar && (
                      <AvatarBlock
                        avatar={cv.avatar}
                        name={cv.name}
                        showAvatar={cv.showAvatar}
                        shape="rounded-full"
                        size="w-20 h-20"
                        className="border border-neutral-300 shadow-xs"
                        onTriggerUpload={triggerAvatarUpload}
                      />
                    )}
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={false}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                  </div>
                  <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-2xl font-bold uppercase tracking-tight text-neutral-900 block" />
                  <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider text-neutral-600 uppercase block" />
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-neutral-600 pt-1">
                    <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                    <span>|</span>
                    <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                    <span>|</span>
                    <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                    {getActiveTechLinks(cv).map((link) => (
                      <span key={link.id} className="inline-flex items-center space-x-1 text-neutral-700">
                        <span>|</span>
                        <TechLinkIcon platform={link.platform} className="w-3 h-3 shrink-0 ml-1" />
                        <InlineEditable
                          tag="span"
                          value={link.label || ''}
                          onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                          singleLine
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  {sectionOrder.map((secKey) => {
                    if (!sectionVisibility[secKey]) return null;
                    if (secKey === 'summary') {
                      return (
                        <div key="summary" className="space-y-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                            {t.summary}
                          </h2>
                          <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                        </div>
                      );
                    }
                    if (secKey === 'experience') {
                      return (
                        <div key="experience" className="space-y-2">
                          <div className="flex justify-between items-center border-b border-neutral-300 pb-0.5">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                              {t.experience}
                            </h2>
                            <button
                              onClick={() => addTimelineItem()}
                              className="no-print text-[10px] text-neutral-600 hover:text-black font-semibold flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{t.addItem}</span>
                            </button>
                          </div>
                          <div className="space-y-3 pt-1">
                            {cv.timeline.map((item, idx) => (
                              <div key={item.id} className="relative group space-y-0.5">
                                <ItemControls
                                  index={idx}
                                  total={cv.timeline.length}
                                  onMoveUp={() => moveTimelineItem(idx, 'up')}
                                  onMoveDown={() => moveTimelineItem(idx, 'down')}
                                  onAddBelow={() => addTimelineItem(idx)}
                                  onDelete={() => deleteTimelineItem(item.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                  <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[11px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-700 leading-relaxed block" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'projects') {
                      return (
                        <div key="projects" className="space-y-2">
                          <div className="flex justify-between items-center border-b border-neutral-300 pb-0.5">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                              {t.projects}
                            </h2>
                            <button
                              onClick={() => addProjectItem()}
                              className="no-print text-[10px] text-neutral-600 hover:text-black font-semibold flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{t.addProject}</span>
                            </button>
                          </div>
                          <div className="space-y-3 pt-1">
                            {cv.projects.map((proj, idx) => (
                              <div key={proj.id} className="relative group space-y-0.5">
                                <ItemControls
                                  index={idx}
                                  total={cv.projects.length}
                                  onMoveUp={() => moveProjectItem(idx, 'up')}
                                  onMoveDown={() => moveProjectItem(idx, 'down')}
                                  onAddBelow={() => addProjectItem(idx)}
                                  onDelete={() => deleteProjectItem(proj.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-neutral-900" />
                                  <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[11px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-700 block" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'skills') {
                      return (
                        <div key="skills" className="space-y-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                            {t.skillsShort}
                          </h2>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cv.skills.map((s, idx) => (
                              <span key={idx} className="group/skill text-xs text-neutral-800 inline-flex items-center space-x-1">
                                <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                {idx < cv.skills.length - 1 && <span className="text-neutral-400">•</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'education') {
                      return (
                        <div key="education" className="space-y-2">
                          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-0.5">
                            {t.educationShort}
                          </h2>
                          <div className="space-y-2 pt-1">
                            {cv.education.map((edu, idx) => (
                              <div key={edu.id} className="relative group flex justify-between text-xs">
                                <ItemControls
                                  index={idx}
                                  total={cv.education.length}
                                  onMoveUp={() => moveEducationItem(idx, 'up')}
                                  onMoveDown={() => moveEducationItem(idx, 'down')}
                                  onAddBelow={() => addEducationItem(idx)}
                                  onDelete={() => deleteEducationItem(edu.id)}
                                />
                                <div>
                                  <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold text-neutral-900 block" />
                                  <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                                </div>
                                <InlineEditable tag="span" value={edu.year} onChange={(v) => updateEducationItem(edu.id, 'year', v)} singleLine className="font-mono text-[11px] text-neutral-500" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    const customSec = cv.customSections?.find((c) => c.id === secKey);
                    if (customSec) {
                      return (
                        <CustomSectionRenderer
                          key={customSec.id}
                          section={customSec}
                          template={template}
                          activeColor={activeColor}
                          lang={lang}
                          isCompact={isCompact}
                          onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                          onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                          onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                          onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                          onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                          onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                          onDeleteSection={() => removeCustomSection(customSec.id)}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 8: CRISP (2-COLUMN LIGHT MODERN)                    */}
            {/* ========================================================================= */}
            {template === 'crisp' && (
              <div className="p-10 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b-2" style={{ borderColor: activeColor.border }}>
                  <div className="space-y-1.5 max-w-[70%]">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase block" style={{ color: activeColor.primary }} />
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-neutral-600">
                      <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                      <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                      <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                      {getActiveTechLinks(cv).map((link) => (
                        <span key={link.id} className="inline-flex items-center space-x-1" style={{ color: activeColor.primary }}>
                          <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
                          <InlineEditable
                            tag="span"
                            value={link.label || ''}
                            onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                            singleLine
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={false}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-2xl"
                      size="w-24 h-24"
                      className="border-neutral-200 shadow-md"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Column: Summary, Experience, Projects */}
                  <div className="md:col-span-7 space-y-6">
                    {sectionOrder
                      .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'summary') {
                          return (
                            <div key="summary" className="space-y-1">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.summary}
                              </h2>
                              <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                            </div>
                          );
                        }
                        if (secKey === 'experience') {
                          return (
                            <div key="experience" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.experience}
                              </h2>
                              {cv.timeline.map((item, idx) => (
                                <div key={item.id} className="relative group space-y-0.5">
                                  <ItemControls
                                    index={idx}
                                    total={cv.timeline.length}
                                    onMoveUp={() => moveTimelineItem(idx, 'up')}
                                    onMoveDown={() => moveTimelineItem(idx, 'down')}
                                    onAddBelow={() => addTimelineItem(idx)}
                                    onDelete={() => deleteTimelineItem(item.id)}
                                  />
                                  <div className="flex justify-between items-baseline text-xs">
                                    <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                    <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                  </div>
                                  <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 leading-relaxed block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        if (secKey === 'projects') {
                          return (
                            <div key="projects" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.projects}
                              </h2>
                              {cv.projects.map((proj, idx) => (
                                <div key={proj.id} className="relative group space-y-1 p-2 rounded bg-neutral-50">
                                  <ItemControls
                                    index={idx}
                                    total={cv.projects.length}
                                    onMoveUp={() => moveProjectItem(idx, 'up')}
                                    onMoveDown={() => moveProjectItem(idx, 'down')}
                                    onAddBelow={() => addProjectItem(idx)}
                                    onDelete={() => deleteProjectItem(proj.id)}
                                  />
                                  <div className="flex justify-between items-baseline text-xs">
                                    <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-neutral-900" />
                                    <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                  </div>
                                  <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        const customSec = cv.customSections?.find((c) => c.id === secKey);
                        if (customSec) {
                          return (
                            <CustomSectionRenderer
                              key={customSec.id}
                              section={customSec}
                              template={template}
                              activeColor={activeColor}
                              lang={lang}
                              isCompact={isCompact}
                              onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                              onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                              onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                              onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                              onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                              onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                              onDeleteSection={() => removeCustomSection(customSec.id)}
                            />
                          );
                        }
                        return null;
                      })}
                  </div>

                  {/* Right Column: Skills, Education */}
                  <div className="md:col-span-5 space-y-6">
                    {sectionOrder
                      .filter((id) => ['skills', 'education'].includes(id))
                      .map((secKey) => {
                        if (!sectionVisibility[secKey]) return null;
                        if (secKey === 'skills') {
                          return (
                            <div key="skills" className="space-y-2">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.skillsTech}
                              </h2>
                              <div className="flex flex-wrap gap-1.5">
                                {cv.skills.map((s, idx) => (
                                  <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded font-medium border inline-flex items-center space-x-1" style={{ backgroundColor: activeColor.lightBg, color: activeColor.primary, borderColor: activeColor.border }}>
                                    <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                    <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        if (secKey === 'education') {
                          return (
                            <div key="education" className="space-y-3">
                              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 border-b" style={{ color: activeColor.primary, borderColor: activeColor.border }}>
                                {t.education}
                              </h2>
                              {cv.education.map((edu, idx) => (
                                <div key={edu.id} className="relative group text-xs space-y-0.5">
                                  <ItemControls
                                    index={idx}
                                    total={cv.education.length}
                                    onMoveUp={() => moveEducationItem(idx, 'up')}
                                    onMoveDown={() => moveEducationItem(idx, 'down')}
                                    onAddBelow={() => addEducationItem(idx)}
                                    onDelete={() => deleteEducationItem(edu.id)}
                                  />
                                  <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                                  <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                                </div>
                              ))}
                            </div>
                          );
                        }
                        const customSec = cv.customSections?.find((c) => c.id === secKey);
                        if (customSec) {
                          return (
                            <CustomSectionRenderer
                              key={customSec.id}
                              section={customSec}
                              template={template}
                              activeColor={activeColor}
                              lang={lang}
                              isCompact={isCompact}
                              onUpdateTitle={(val) => updateCustomSectionTitle(customSec.id, val)}
                              onUpdateContent={(val) => updateCustomSectionContent(customSec.id, val)}
                              onAddItem={(afterIdx) => addCustomSectionItem(customSec.id, afterIdx)}
                              onUpdateItem={(itemId, field, val) => updateCustomSectionItem(customSec.id, itemId, field, val)}
                              onDeleteItem={(itemId) => deleteCustomSectionItem(customSec.id, itemId)}
                              onMoveItem={(idx, dir) => moveCustomSectionItem(customSec.id, idx, dir)}
                              onDeleteSection={() => removeCustomSection(customSec.id)}
                            />
                          );
                        }
                        return null;
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 9: ENFOLD (RIGHT COLORED SIDEBAR)                   */}
            {/* ========================================================================= */}
            {template === 'enfold' && (
              <div className="min-h-[297mm] flex">
                {/* Main Content Area */}
                <div className="flex-1 p-8 space-y-6">
                  <div className="pb-4 border-b border-neutral-200">
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="text-3xl font-bold uppercase tracking-tight text-neutral-900 block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-semibold tracking-wider uppercase text-cyan-800 mt-1 block" />
                  </div>

                  {sectionOrder
                    .filter((id) => ['summary', 'experience', 'projects'].includes(id) || id.startsWith('custom_'))
                    .map((secKey) => {
                      if (!sectionVisibility[secKey]) return null;
                      if (secKey === 'summary') {
                        return (
                          <div key="summary" className="space-y-2">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                              {t.summary}
                            </h2>
                            <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 leading-relaxed text-justify block" />
                          </div>
                        );
                      }
                      if (secKey === 'experience') {
                        return (
                          <div key="experience" className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                              {t.experience}
                            </h2>
                            {cv.timeline.map((item, idx) => (
                              <div key={item.id} className="relative group space-y-0.5">
                                <ItemControls
                                  index={idx}
                                  total={cv.timeline.length}
                                  onMoveUp={() => moveTimelineItem(idx, 'up')}
                                  onMoveDown={() => moveTimelineItem(idx, 'down')}
                                  onAddBelow={() => addTimelineItem(idx)}
                                  onDelete={() => deleteTimelineItem(item.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold text-neutral-900" />
                                  <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      if (secKey === 'projects') {
                        return (
                          <div key="projects" className="space-y-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-800 pb-1 border-b border-cyan-800/20">
                              {t.projects}
                            </h2>
                            {cv.projects.map((proj, idx) => (
                              <div key={proj.id} className="relative group space-y-1 p-2 rounded bg-neutral-50">
                                <ItemControls
                                  index={idx}
                                  total={cv.projects.length}
                                  onMoveUp={() => moveProjectItem(idx, 'up')}
                                  onMoveDown={() => moveProjectItem(idx, 'down')}
                                  onAddBelow={() => addProjectItem(idx)}
                                  onDelete={() => deleteProjectItem(proj.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold text-neutral-900" />
                                  <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>

                {/* Right Colored Sidebar */}
                <div className="w-[32%] text-white p-7 space-y-6 flex-shrink-0" style={{ backgroundColor: activeColor.sidebarBg }}>
                  <AvatarBlock
                    avatar={cv.avatar}
                    name={cv.name}
                    showAvatar={cv.showAvatar}
                    shape="rounded-full"
                    size="w-28 h-28"
                    className="mx-auto border-white/20 shadow-md"
                    onTriggerUpload={triggerAvatarUpload}
                  />

                  {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                    <div className="flex justify-center pt-1">
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={true}
                        accentColorHex={activeColor.primary}
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-white/20 pb-1">{t.contactShort}</h3>
                    <p className="text-neutral-300 break-all"><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></p>
                    <p className="text-neutral-300"><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></p>
                    <p className="text-neutral-300"><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></p>
                    {getActiveTechLinks(cv).map((link) => (
                      <p key={link.id} className="text-neutral-300 break-all flex items-center space-x-1.5">
                        <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <InlineEditable
                          tag="span"
                          value={link.label || ''}
                          onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                          singleLine
                        />
                      </p>
                    ))}
                  </div>

                  {sectionOrder
                    .filter((id) => ['skills', 'education'].includes(id))
                    .map((secKey) => {
                      if (!sectionVisibility[secKey]) return null;
                      if (secKey === 'skills') {
                        return (
                          <div key="skills" className="space-y-2 text-xs">
                            <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-white/20 pb-1">{t.skillsShort}</h3>
                            <div className="flex flex-wrap gap-1">
                              {cv.skills.map((s, idx) => (
                                <span key={idx} className="group/skill text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-mono inline-flex items-center space-x-1">
                                  <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                  <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-300 ml-1">
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      if (secKey === 'education') {
                        return (
                          <div key="education" className="space-y-2 text-xs">
                            <h3 className="text-xs font-bold uppercase text-cyan-400 border-b border-white/20 pb-1">{t.educationShort}</h3>
                            {cv.education.map((edu, idx) => (
                              <div key={edu.id} className="relative group space-y-0.5">
                                <ItemControls
                                  index={idx}
                                  total={cv.education.length}
                                  onMoveUp={() => moveEducationItem(idx, 'up')}
                                  onMoveDown={() => moveEducationItem(idx, 'down')}
                                  onAddBelow={() => addEducationItem(idx)}
                                  onDelete={() => deleteEducationItem(edu.id)}
                                />
                                <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold text-white block" />
                                <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-300 block text-[11px]" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TEMPLATE ARCHITECTURE 10: EDITORIAL LUXURY (SERIF MAGAZINE)               */}
            {/* ========================================================================= */}
            {template === 'editorial' && (
              <div className="p-10 space-y-6">
                <div className="border-b-2 border-neutral-900 pb-6 flex items-start justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-neutral-500">Curriculum Vitae</span>
                    <InlineEditable tag="h1" value={cv.name} onChange={(val) => setCv({ ...cv, name: val })} singleLine className="font-serif text-4xl uppercase tracking-wider text-neutral-950 font-normal block" />
                    <InlineEditable tag="p" value={cv.role} onChange={(val) => setCv({ ...cv, role: val })} singleLine className="text-xs font-mono tracking-widest uppercase font-semibold text-cyan-800 block" />
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    {activeQrConfig.enabled && activeQrConfig.position === 'header' && (
                      <CVQRCodeBlock
                        qrDataUrl={qrDataUrl}
                        config={activeQrConfig}
                        lang={lang}
                        isDarkHeader={false}
                        accentColorHex={activeColor.primary}
                      />
                    )}
                    <AvatarBlock
                      avatar={cv.avatar}
                      name={cv.name}
                      showAvatar={cv.showAvatar}
                      shape="rounded-full"
                      size="w-20 h-20"
                      className="border border-neutral-400 grayscale"
                      onTriggerUpload={triggerAvatarUpload}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-y-1.5 text-xs font-mono border-b border-neutral-200 py-2 text-neutral-600">
                  <div className="flex items-center space-x-4">
                    <span><InlineEditable tag="span" value={cv.location} onChange={(v) => setCv({ ...cv, location: v })} singleLine /></span>
                    <span>•</span>
                    <span><InlineEditable tag="span" value={cv.email} onChange={(v) => setCv({ ...cv, email: v })} singleLine /></span>
                    <span>•</span>
                    <span><InlineEditable tag="span" value={cv.phone} onChange={(v) => setCv({ ...cv, phone: v })} singleLine /></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {getActiveTechLinks(cv).map((link) => (
                      <span key={link.id} className="inline-flex items-center space-x-1 text-neutral-800">
                        <TechLinkIcon platform={link.platform} className="w-3.5 h-3.5 shrink-0" />
                        <InlineEditable
                          tag="span"
                          value={link.label || ''}
                          onChange={(val) => handleUpdateCustomLink(link.id, { label: val })}
                          singleLine
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {sectionOrder.map((secKey) => {
                    if (!sectionVisibility[secKey]) return null;
                    if (secKey === 'summary') {
                      return (
                        <div key="summary" className="space-y-2">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialSummary}</h2>
                          <InlineEditable tag="p" value={cv.summary} onChange={(val) => setCv({ ...cv, summary: val })} className="text-xs text-neutral-700 italic border-l-2 pl-4 border-neutral-300 block" />
                        </div>
                      );
                    }
                    if (secKey === 'experience') {
                      return (
                        <div key="experience" className="space-y-3">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialExperience}</h2>
                          {cv.timeline.map((item, idx) => (
                            <div key={item.id} className="relative group border-l-2 border-neutral-900 pl-4 space-y-0.5">
                              <ItemControls
                                index={idx}
                                total={cv.timeline.length}
                                onMoveUp={() => moveTimelineItem(idx, 'up')}
                                onMoveDown={() => moveTimelineItem(idx, 'down')}
                                onAddBelow={() => addTimelineItem(idx)}
                                onDelete={() => deleteTimelineItem(item.id)}
                              />
                              <div className="flex justify-between text-xs">
                                <InlineEditable tag="span" value={item.role} onChange={(v) => updateTimelineItem(item.id, 'role', v)} singleLine className="font-bold uppercase text-neutral-900" />
                                <InlineEditable tag="span" value={formatPeriod(item.period, lang)} onChange={(v) => updateTimelineItem(item.id, 'period', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                              </div>
                              <InlineEditable tag="p" value={item.desc} onChange={(v) => updateTimelineItem(item.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    if (secKey === 'projects') {
                      return (
                        <div key="projects" className="space-y-3">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.projects}</h2>
                          <div className="grid grid-cols-2 gap-4">
                            {cv.projects.map((proj, idx) => (
                              <div key={proj.id} className="relative group border-l-2 border-neutral-400 pl-3 space-y-1">
                                <ItemControls
                                  index={idx}
                                  total={cv.projects.length}
                                  onMoveUp={() => moveProjectItem(idx, 'up')}
                                  onMoveDown={() => moveProjectItem(idx, 'down')}
                                  onAddBelow={() => addProjectItem(idx)}
                                  onDelete={() => deleteProjectItem(proj.id)}
                                />
                                <div className="flex justify-between items-baseline text-xs">
                                  <InlineEditable tag="span" value={proj.title} onChange={(v) => updateProjectItem(proj.id, 'title', v)} singleLine className="font-bold uppercase text-neutral-900" />
                                  <InlineEditable tag="span" value={proj.year} onChange={(v) => updateProjectItem(proj.id, 'year', v)} singleLine className="font-mono text-[10px] text-neutral-500" />
                                </div>
                                <InlineEditable tag="p" value={proj.desc} onChange={(v) => updateProjectItem(proj.id, 'desc', v)} className="text-xs text-neutral-600 block" />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'skills') {
                      return (
                        <div key="skills" className="space-y-2 pt-2 border-t border-neutral-200">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialSkills}</h2>
                          <div className="flex flex-wrap gap-1.5">
                            {cv.skills.map((s, idx) => (
                              <span key={idx} className="group/skill text-[10px] font-mono border border-neutral-300 px-2 py-0.5 rounded inline-flex items-center space-x-1">
                                <InlineEditable tag="span" value={s} onChange={(v) => updateSkill(idx, v)} singleLine />
                                <button onClick={() => removeSkill(idx)} className="no-print opacity-0 group-hover/skill:opacity-100 text-rose-500 ml-1">
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    if (secKey === 'education') {
                      return (
                        <div key="education" className="space-y-2 pt-2 border-t border-neutral-200">
                          <h2 className="font-serif text-sm uppercase tracking-wider text-neutral-900 font-bold">{t.editorialEducation}</h2>
                          {cv.education.map((edu, idx) => (
                            <div key={edu.id} className="relative group text-xs space-y-0.5">
                              <ItemControls
                                index={idx}
                                total={cv.education.length}
                                onMoveUp={() => moveEducationItem(idx, 'up')}
                                onMoveDown={() => moveEducationItem(idx, 'down')}
                                onAddBelow={() => addEducationItem(idx)}
                                onDelete={() => deleteEducationItem(edu.id)}
                              />
                              <InlineEditable tag="span" value={edu.school} onChange={(v) => updateEducationItem(edu.id, 'school', v)} singleLine className="font-bold block text-neutral-900" />
                              <InlineEditable tag="span" value={edu.degree} onChange={(v) => updateEducationItem(edu.id, 'degree', v)} singleLine className="text-neutral-600 block" />
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Dynamic Personal QR Code Footer Strip */}
            {activeQrConfig.enabled && activeQrConfig.position === 'footer' && (
              <div className="px-8 pb-4 pt-2">
                <CVQRCodeFooter
                  qrDataUrl={qrDataUrl}
                  config={activeQrConfig}
                  lang={lang}
                  accentColorHex={activeColor.primary}
                  candidateName={cv.name}
                  websiteUrl={getQRTargetText(activeQrConfig, cv)}
                />
              </div>
            )}
          </div>
        )}
        </CVReadOnlyContext.Provider>
        </div>
      </main>

        {/* Floating Zoom Control Pill - Fixed at Bottom Right of Editor Canvas */}
        {!isPreviewMode && !isPublicView && (
          <div className="no-print absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center bg-[#161B26]/90 border border-white/10 rounded-full p-1 text-xs shadow-2xl backdrop-blur-md select-none transition-all hover:bg-[#161B26] hover:border-white/20">
            <button
              type="button"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={lang === 'en' ? 'Zoom Out (-10%)' : 'Thu nhỏ (-10%)'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(100)}
              className="px-2.5 py-0.5 font-mono text-[11px] text-neutral-200 hover:text-white font-medium select-none cursor-pointer hover:bg-white/5 rounded-full transition-colors"
              title={lang === 'en' ? 'Click to reset to 100%' : 'Nhấp để reset về 100%'}
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={lang === 'en' ? 'Zoom In (+10%)' : 'Phóng to (+10%)'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL: TECH NOMENCLATURE LINTER STUDIO ================= */}
      {showTechLinterModal && (
        <div className="no-print fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-sm sm:text-base">
                      {t.techLinterModalTitle}
                    </h3>
                    {techLintReport.totalIssuesCount > 0 ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black">
                        {techLintReport.totalIssuesCount} {t.techLinterIssuesFound}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {t.techLinterCleanBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 max-w-xl line-clamp-1 sm:line-clamp-none">
                    {t.techLinterModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTechLinterModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Đóng (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center px-4 sm:px-5 bg-[#0D1017] border-b border-white/10 space-x-2 sm:space-x-3 shrink-0">
              <button
                type="button"
                onClick={() => setTechLinterActiveTab('issues')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  techLinterActiveTab === 'issues'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <SpellCheck className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Detected Issues' : 'Lỗi phát hiện'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  techLintReport.totalIssuesCount > 0
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/10 text-neutral-300'
                }`}>
                  {techLintReport.totalIssuesCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTechLinterActiveTab('playground')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  techLinterActiveTab === 'playground'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Text Playground' : 'Thử nghiệm văn bản'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTechLinterActiveTab('registry')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
                  techLinterActiveTab === 'registry'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Standards Registry' : 'Từ điển 120+ công nghệ'}</span>
              </button>
            </div>

            {/* TAB 1: DETECTED ISSUES & DIFF CARDS */}
            {techLinterActiveTab === 'issues' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Action Bar: 1-Click Fix All & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-[#090C13] border border-white/10">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleFixAllTechIssues}
                      disabled={techLintReport.totalIssuesCount === 0}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{t.techLinterFixAll} ({techLintReport.totalIssuesCount})</span>
                    </button>

                    {techLintReport.totalIssuesCount > 0 && (
                      <span className="text-[11px] text-neutral-400 hidden md:inline">
                        {lang === 'en' ? 'Standardize all sections in one click' : 'Chuẩn hóa toàn bộ CV chỉ với 1 cú nhấp'}
                      </span>
                    )}
                  </div>

                  {/* Section & Category Filters */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                    <select
                      value={techLinterFilter}
                      onChange={(e) => setTechLinterFilter(e.target.value as any)}
                      aria-label={lang === 'en' ? 'Filter by section' : 'Lọc theo mục'}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-xs outline-none cursor-pointer"
                    >
                      <option value="all">{lang === 'en' ? 'All Sections' : 'Tất cả các mục'}</option>
                      <option value="skills">{lang === 'en' ? 'Skills' : 'Kỹ năng'} ({techLintReport.issues.filter(i => i.section === 'skills').length})</option>
                      <option value="projects">{lang === 'en' ? 'Projects' : 'Dự án'} ({techLintReport.issues.filter(i => i.section === 'projects').length})</option>
                      <option value="timeline">{lang === 'en' ? 'Experience' : 'Kinh nghiệm'} ({techLintReport.issues.filter(i => i.section === 'timeline').length})</option>
                      <option value="summary">{lang === 'en' ? 'Summary' : 'Tóm tắt'} ({techLintReport.issues.filter(i => i.section === 'summary').length})</option>
                      <option value="custom">{lang === 'en' ? 'Custom Sections' : 'Mục tùy chỉnh'} ({techLintReport.issues.filter(i => i.section === 'custom').length})</option>
                      <option value="cover_letter">{lang === 'en' ? 'Cover Letter' : 'Thư xin việc'} ({techLintReport.issues.filter(i => i.section === 'cover_letter').length})</option>
                    </select>

                    <select
                      value={techLinterCategory}
                      onChange={(e) => setTechLinterCategory(e.target.value)}
                      aria-label={lang === 'en' ? 'Filter by category' : 'Lọc theo danh mục'}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 text-xs outline-none cursor-pointer"
                    >
                      <option value="all">{lang === 'en' ? 'All Categories' : 'Tất cả danh mục'}</option>
                      <option value="languages">Languages</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="devops">DevOps & Cloud</option>
                      <option value="mobile">Mobile</option>
                      <option value="frameworks">Frameworks</option>
                      <option value="architecture">APIs & Architecture</option>
                      <option value="ai_ml">AI & ML</option>
                      <option value="testing">Testing</option>
                      <option value="tools">Tooling & VCS</option>
                    </select>
                  </div>
                </div>

                {/* Issues List / Clean State */}
                {techLintReport.totalIssuesCount === 0 ? (
                  <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCheck className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-lg">
                        {t.techLinterCleanTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-300/90 max-w-lg mx-auto">
                        {lang === 'en'
                          ? 'All 120+ technologies in your CV and Cover Letter follow official brand casing guidelines. Perfect for ATS parsing and technical review.'
                          : 'Toàn bộ 120+ danh pháp công nghệ trong CV và Thư xin việc đều chuẩn 100% theo quy chuẩn thương hiệu quốc tế. Hoàn hảo để vượt qua bộ lọc ATS và gây ấn tượng mạnh với Tech Lead.'}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setTechLinterActiveTab('playground')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'en' ? 'Open Text Playground' : 'Thử nghiệm văn bản tự do'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTechLinterActiveTab('registry')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{lang === 'en' ? 'Browse Standards Registry' : 'Tra cứu từ điển quy chuẩn'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Active Issues Filtered
                  (() => {
                    const activeIssues = techLintReport.issues.filter(
                      (issue) =>
                        !ignoredIssueIds.has(issue.id) &&
                        (techLinterFilter === 'all' || issue.section === techLinterFilter) &&
                        (techLinterCategory === 'all' || issue.category === techLinterCategory)
                    );

                    if (activeIssues.length === 0) {
                      return (
                        <div className="p-8 text-center rounded-xl bg-[#090C13] border border-white/5 space-y-2">
                          <p className="text-xs text-neutral-400">
                            {lang === 'en'
                              ? 'No issues match the selected filters.'
                              : 'Không có lỗi nào phù hợp với bộ lọc hiện tại.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setTechLinterFilter('all');
                              setTechLinterCategory('all');
                            }}
                            className="text-xs text-purple-400 hover:underline cursor-pointer"
                          >
                            {lang === 'en' ? 'Reset filters' : 'Đặt lại bộ lọc'}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                          <span>
                            {lang === 'en' ? 'Showing' : 'Đang hiển thị'}{' '}
                            <strong className="text-white">{activeIssues.length}</strong>{' '}
                            {lang === 'en' ? 'unresolved issues' : 'lỗi cần tối ưu'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {activeIssues.map((issue) => {
                            const catMeta = TECH_CATEGORY_META[issue.category as keyof typeof TECH_CATEGORY_META];
                            return (
                              <div
                                key={issue.id}
                                className="p-4 rounded-xl bg-[#0E121B] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
                              >
                                <div className="space-y-2 flex-1 min-w-0">
                                  {/* Tags header */}
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium">
                                      {issue.section === 'skills' && (lang === 'en' ? 'Skills' : 'Kỹ năng')}
                                      {issue.section === 'projects' && `${lang === 'en' ? 'Project' : 'Dự án'}: ${issue.targetTitle || 'Item'}`}
                                      {issue.section === 'timeline' && `${lang === 'en' ? 'Experience' : 'Kinh nghiệm'}: ${issue.targetTitle || 'Item'}`}
                                      {issue.section === 'summary' && (lang === 'en' ? 'Summary' : 'Tóm tắt')}
                                      {issue.section === 'custom' && (lang === 'en' ? 'Custom Section' : 'Mục tùy chỉnh')}
                                      {issue.section === 'cover_letter' && (lang === 'en' ? 'Cover Letter' : 'Thư xin việc')}
                                    </span>
                                    {catMeta && (
                                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                        {lang === 'en' ? catMeta.titleEn : catMeta.titleVi}
                                      </span>
                                    )}
                                  </div>

                                  {/* Diff before / after */}
                                  <div className="flex items-center space-x-2">
                                    <span className="line-through text-rose-300 bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 rounded-md font-mono text-xs font-semibold">
                                      {issue.original}
                                    </span>
                                    <span className="text-neutral-500 font-bold">➔</span>
                                    <span className="text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-md font-mono text-xs font-bold shadow-xs">
                                      {issue.replacement}
                                    </span>
                                  </div>

                                  {/* Context snippet if available */}
                                  {issue.contextSnippet && (
                                    <div className="p-2 rounded-lg bg-[#07090E] border border-white/5 text-[11px] text-neutral-300 font-mono leading-relaxed truncate">
                                      <span className="text-neutral-500 text-[10px] mr-1.5 select-none font-sans uppercase">Đoạn văn:</span>
                                      "{issue.contextSnippet}"
                                    </div>
                                  )}

                                  {/* Brand Reason */}
                                  <p className="text-[11px] text-neutral-400 italic flex items-center space-x-1">
                                    <span>💡</span>
                                    <span>{lang === 'en' ? issue.reasonEn : issue.reasonVi}</span>
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center">
                                  <button
                                    type="button"
                                    onClick={() => handleFixSingleTechIssue(issue)}
                                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1 transition-colors cursor-pointer shadow-sm"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{t.techLinterFixSingle}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleIgnoreTechIssue(issue.id)}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 text-xs transition-colors cursor-pointer"
                                  >
                                    <span>{t.techLinterIgnoreSingle}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* TAB 2: TEXT PLAYGROUND */}
            {techLinterActiveTab === 'playground' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'Paste any paragraph or bullet points below to test real-time tech casing normalization.'
                        : 'Dán bất kỳ đoạn văn, bullet point hay JD tuyển dụng nào vào đây để tự động chuẩn hóa danh pháp.'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-300">
                      {lang === 'en' ? 'Input Text:' : 'Văn bản gốc cần kiểm tra:'}
                    </label>
                    <div className="flex items-center space-x-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() =>
                          setPlaygroundInput(
                            'Toi co kinh nghiem su dung nodejs, reactjs, typescript va viet restful apis tren github voi docker va postgresql.'
                          )
                        }
                        className="text-purple-400 hover:underline cursor-pointer"
                      >
                        {lang === 'en' ? 'Load Sample' : 'Nạp mẫu ví dụ'}
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={playgroundInput}
                    onChange={(e) => setPlaygroundInput(e.target.value)}
                    placeholder={lang === 'en' ? 'Paste text here (e.g. built apis with nodejs and express)...' : 'Dán văn bản vào đây (VD: toi xay dung he thong voi nodejs, reactjs va postgre)...'}
                    className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-purple-500 font-mono transition-colors"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleRunPlayground}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Normalize Now' : '✨ Chuẩn hóa ngay'}</span>
                  </button>
                </div>

                {playgroundOutput && (
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                        <CheckCheck className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Normalized Output:' : 'Kết quả sau khi chuẩn hóa:'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined' && navigator.clipboard) {
                            navigator.clipboard.writeText(playgroundOutput);
                            setToastMessage(lang === 'en' ? 'Copied to clipboard!' : 'Đã sao chép kết quả!');
                            setTimeout(() => setToastMessage(null), 2000);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>{lang === 'en' ? 'Copy Text' : 'Sao chép'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#090C13] border border-emerald-500/30 text-white text-xs font-mono leading-relaxed select-text">
                      {playgroundOutput}
                    </div>

                    {playgroundReplacements.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] text-neutral-400">
                          {lang === 'en' ? 'Replacements made:' : 'Các danh pháp đã được sửa:'} ({playgroundReplacements.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {playgroundReplacements.map((r, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-200 border border-white/5 flex items-center space-x-1 font-mono">
                              <span className="line-through text-rose-400">{r.original}</span>
                              <span className="text-neutral-500">➔</span>
                              <span className="text-emerald-400 font-bold">{r.replacement}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: STANDARDS REGISTRY (120+ TECHNOLOGIES) */}
            {techLinterActiveTab === 'registry' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Search & filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={techRegistrySearch}
                      onChange={(e) => setTechRegistrySearch(e.target.value)}
                      placeholder={lang === 'en' ? 'Search 120+ tech standards (e.g. Node, React, Docker)...' : 'Tìm kiếm 120+ công nghệ (VD: Node, React, Docker)...'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs outline-none focus:border-purple-500"
                    />
                  </div>
                  <span className="text-xs text-neutral-400 self-center">
                    {lang === 'en' ? 'Total' : 'Tổng số'}: <strong className="text-white">{TECH_STANDARDS_REGISTRY.length}</strong> {lang === 'en' ? 'standards' : 'quy chuẩn'}
                  </span>
                </div>

                {/* Registry items grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {TECH_STANDARDS_REGISTRY.filter((def) =>
                    !techRegistrySearch.trim() ||
                    def.canonical.toLowerCase().includes(techRegistrySearch.toLowerCase()) ||
                    def.aliases.some((a) => a.toLowerCase().includes(techRegistrySearch.toLowerCase()))
                  ).map((def, idx) => {
                    const catMeta = TECH_CATEGORY_META[def.category];
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0E121B] border border-white/5 hover:border-purple-500/30 transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-white text-xs text-purple-300">
                            {def.canonical}
                          </span>
                          {catMeta && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                              {lang === 'en' ? catMeta.titleEn : catMeta.titleVi}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                          {lang === 'en' ? def.reasonEn : def.reasonVi}
                        </p>
                        <div className="text-[9px] text-neutral-500 truncate font-mono">
                          Lỗi thường gặp: {def.aliases.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E121B] border-t border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-neutral-400">
                {techLintReport.totalIssuesCount > 0 ? (
                  <span>
                    {lang === 'en' ? 'Unsaved linting fixes will be applied to the active CV.' : 'Các sửa đổi sẽ được áp dụng trực tiếp vào bản CV hiện tại.'}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.techLinterCleanBadge}</span>
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={() => setShowTechLinterModal(false)}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PUBLIC SHAREABLE WEB LINK ================= */}
      {isShareModalOpen && !isPublicView && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            ref={shareModalRef}
            className="w-full max-w-2xl bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{t.shareModalTitle}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{t.shareModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
              {/* Public Link Box */}
              <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{t.shareUrlLabel}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Web View</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 truncate select-all">
                    {sharePublicUrl}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyShareUrl}
                    className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                  >
                    {isShareCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isShareCopied ? t.shareCopiedBtn : t.shareCopyBtn}</span>
                  </button>
                  <a
                    href={sharePublicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs flex items-center space-x-1 transition-colors shrink-0"
                    title={t.shareOpenBtn}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.shareOpenBtn}</span>
                  </a>
                </div>
              </div>

              {/* QR Code & 1-Tap Social Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* QR Block */}
                <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-bold text-white text-xs block mb-1">{t.shareQrTitle}</span>
                    <p className="text-[11px] text-neutral-400">
                      {lang === 'en'
                        ? 'Recruiters scan this on mobile to read your CV instantly.'
                        : 'Nhà tuyển dụng có thể dùng camera điện thoại để quét và xem ngay.'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3.5 pt-1">
                    {shareQrDataUrl ? (
                      <div className="p-1.5 rounded-xl bg-white border border-neutral-300 shadow-md shrink-0">
                        <img src={shareQrDataUrl} alt="QR Code" className="w-20 h-20" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
                        <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />
                      </div>
                    )}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="text-[10px] text-neutral-400 font-mono">PNG • 240×240px</div>
                      <button
                        type="button"
                        onClick={handleDownloadShareQr}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>{t.shareDownloadQrBtn}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1-Tap Share Buttons */}
                <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 flex flex-col justify-between space-y-2.5">
                  <div>
                    <span className="font-bold text-white text-xs block mb-1">{t.shareSocialTitle}</span>
                    <p className="text-[11px] text-neutral-400">
                      {lang === 'en' ? 'Send direct link to recruiters and networks.' : 'Gửi nhanh tới nhà tuyển dụng qua các kênh phổ biến.'}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={handleShareLinkedIn}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/40 text-[#70B5F9] font-medium text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>{t.shareViaLinkedin}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareEmail}
                      className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-medium text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.shareViaEmail}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareTwitter}
                      className="w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium text-xs flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{t.shareViaTwitter}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy & View Options */}
              <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 space-y-3">
                <span className="font-bold text-white text-xs block">{t.sharePrivacyTitle}</span>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareIncludeCoverLetter}
                      onChange={(e) => setShareIncludeCoverLetter(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareIncludeCoverLetter}</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareAllowDownload}
                      onChange={(e) => setShareAllowDownload(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareAllowDownload}</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyHidePhone}
                      onChange={(e) => setPrivacyHidePhone(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareHidePhone}</span>
                  </label>
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyHideLocation}
                      onChange={(e) => setPrivacyHideLocation(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-xs text-neutral-300">{t.shareHideLocation}</span>
                  </label>
                </div>
              </div>

              {/* Embed Code (iFrame) */}
              <div className="p-4 rounded-xl bg-[#090C13] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{t.shareEmbedTitle}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const code = `<iframe src="${sharePublicUrl}" width="100%" height="900" frameborder="0"></iframe>`;
                      navigator.clipboard.writeText(code);
                      setToastMessage(lang === 'en' ? 'Embed code copied!' : 'Đã sao chép mã nhúng iFrame!');
                      setTimeout(() => setToastMessage(null), 2000);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Sao chép mã</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 font-mono text-[11px] text-neutral-400 select-all overflow-x-auto">
                  {`<iframe src="${sharePublicUrl}" width="100%" height="900" frameborder="0"></iframe>`}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0E121B] border-t border-white/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONTACT CANDIDATE ================= */}
      {isContactModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E121B] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{t.publicContactBtn}</h3>
                  <p className="text-xs text-neutral-400">{cv.name || 'Nguyễn Đức Anh'} • {cv.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              {cv.email && (
                <a
                  href={`mailto:${cv.email}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-emerald-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">Email trực tiếp</div>
                      <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">{cv.email}</div>
                    </div>
                  </div>
                  <Send className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.phone && !privacyHidePhone && (
                <a
                  href={`tel:${cv.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-cyan-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">Số điện thoại</div>
                      <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">{cv.phone}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.linkedin && (
                <a
                  href={cv.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-[#0A66C2]/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#0A66C2]/10 text-[#70B5F9] shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">LinkedIn Profile</div>
                      <div className="font-semibold text-white group-hover:text-[#70B5F9] transition-colors truncate">{cv.linkedin}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.github && (
                <a
                  href={cv.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">GitHub Profile</div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors truncate">{cv.github}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}

              {cv.website && (
                <a
                  href={cv.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#090C13] border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-neutral-200 group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-[10px] text-neutral-400 uppercase font-mono">Portfolio Website</div>
                      <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">{cv.website}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
                </a>
              )}
            </div>

            <div className="p-4 bg-[#0E121B] border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PUBLIC MOBILE QR CODE ================= */}
      {isPublicQrModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#111622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center p-6 text-center animate-in zoom-in-95 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.publicScanQrBtn}</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                {lang === 'en'
                  ? 'Scan this QR code with your mobile camera or Zalo to open this interactive CV instantly on your phone.'
                  : 'Mở ứng dụng Camera hoặc Zalo trên điện thoại để quét và trải nghiệm bản CV trực tuyến.'}
              </p>
            </div>

            {shareQrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl border-4 border-cyan-500/30 shadow-2xl">
                <img src={shareQrDataUrl} alt="Public CV QR" className="w-52 h-52 object-contain" />
              </div>
            ) : (
              <div className="w-52 h-52 rounded-2xl bg-neutral-800 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
              </div>
            )}

            <div className="flex items-center space-x-2 w-full pt-1">
              <button
                type="button"
                onClick={handleDownloadShareQr}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.shareDownloadQrBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPublicQrModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'Đóng'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN PREVIEW EXIT PILL ================= */}
      {isPreviewMode && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#161B26]/95 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center space-x-3 text-xs text-neutral-200 select-none animate-in fade-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'en' ? 'Exit Preview (ESC)' : 'Thoát xem trước (ESC)'}</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:text-white rounded"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-white">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 hover:text-white rounded"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            title="Xuất PDF in ấn"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExportImage('png', 2)}
            disabled={isExportingImage}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
            title="Xuất ảnh PNG sắc nét (300 DPI)"
          >
            {isExportingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />}
            <span>{isExportingImage ? (lang === 'en' ? 'Exporting...' : 'Đang xuất...') : (lang === 'en' ? 'PNG (HD)' : 'Ảnh PNG (HD)')}</span>
          </button>
        </div>
      )}

      {/* ================= PRINT & COMPACT CSS STYLES (A4 ACCURATE) ================= */}
      <style jsx global>{`
        /* Dynamic CV Typography Engine */
        .cv-paper.font-inter, .cv-paper.font-inter *:not([class*="font-mono"]) {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        .cv-paper.font-bevietnam, .cv-paper.font-bevietnam *:not([class*="font-mono"]) {
          font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-jakarta, .cv-paper.font-jakarta *:not([class*="font-mono"]) {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-roboto, .cv-paper.font-roboto *:not([class*="font-mono"]) {
          font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        .cv-paper.font-merriweather, .cv-paper.font-merriweather *:not([class*="font-mono"]) {
          font-family: 'Merriweather', Georgia, serif !important;
        }
        .cv-paper.font-jetbrains, .cv-paper.font-jetbrains * {
          font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
        }
        .cv-paper .font-mono {
          font-family: 'JetBrains Mono', Consolas, Monaco, monospace !important;
        }

        .cv-compact {
          line-height: 1.35 !important;
        }

        .cv-compact h1 {
          font-size: 1.65rem !important;
          margin-bottom: 2px !important;
        }

        .cv-compact h2 {
          font-size: 0.72rem !important;
          padding-bottom: 2px !important;
          margin-bottom: 4px !important;
        }

        .cv-compact p {
          line-height: 1.38 !important;
          margin-bottom: 2px !important;
        }

        /* Dynamic Fine-grain Typography Engine */
        .cv-paper {
          font-size: var(--cv-body-size, 13.5px);
          line-height: var(--cv-line-height, 1.45);
        }

        .cv-paper p,
        .cv-paper li,
        .cv-paper .text-\[11px\],
        .cv-paper .text-xs:not(h1 *):not(h2 *):not(.font-bold):not([class*="uppercase"]) {
          font-size: var(--cv-body-size, 13.5px) !important;
          line-height: var(--cv-line-height, 1.45) !important;
        }

        .cv-paper h2,
        .cv-paper h2 * {
          font-size: var(--cv-heading-size, 16.5px) !important;
        }

        /* Fine-grain Section Gap */
        .cv-paper .space-y-6 > * + *,
        .cv-paper .space-y-5 > * + *,
        .cv-paper .space-y-4 > * + * {
          margin-top: var(--cv-section-gap, 18px) !important;
        }

        /* Fine-grain Item Gap */
        .cv-paper .space-y-3 > * + *,
        .cv-paper .space-y-2 > * + * {
          margin-top: var(--cv-item-gap, 10px) !important;
        }

        /* Fine-grain Page Padding */
        .cv-paper .p-8,
        .cv-paper .p-7,
        .cv-paper .p-6,
        .cv-paper .p-5 {
          padding-top: var(--cv-pad-top-bottom, 24px) !important;
          padding-bottom: var(--cv-pad-top-bottom, 24px) !important;
          padding-left: var(--cv-pad-left-right, 28px) !important;
          padding-right: var(--cv-pad-left-right, 28px) !important;
        }

        .cv-paper .px-8,
        .cv-paper .px-6,
        .cv-paper .px-5 {
          padding-left: var(--cv-pad-left-right, 28px) !important;
          padding-right: var(--cv-pad-left-right, 28px) !important;
        }

        .cv-paper .py-8,
        .cv-paper .py-6,
        .cv-paper .py-5,
        .cv-paper .py-4 {
          padding-top: var(--cv-pad-top-bottom, 24px) !important;
          padding-bottom: var(--cv-pad-top-bottom, 24px) !important;
        }

        .cv-public-view .no-print {
          display: none !important;
        }

        @media print {
          .h-screen {
            height: auto !important;
            overflow: visible !important;
          }

          .overflow-hidden {
            overflow: visible !important;
          }

          header,
          nav,
          aside,
          .no-print,
          #customCursorWrapper {
            display: none !important;
          }

          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .cv-paper {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            transform: none !important;
          }

          .cv-compact {
            max-height: 297mm !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .cv-editable {
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            outline: none !important;
            background: transparent !important;
          }

          @page {
            size: A4 portrait;
            margin: ${isCompact ? '4mm 6mm' : '8mm 8mm'} !important;
          }
        }
      `}</style>
    </div>
  );
}
