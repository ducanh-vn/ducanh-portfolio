/**
 * CV Parser Engine (src/lib/cvParser.ts)
 * Intelligent CV Text Parser & Extractor for PDF, DOCX, and Raw Text.
 * Extracts Personal Info, Summary, Skills, Work Experience, Projects, Education, and Tech Links.
 */

import { CVData, EducationItem, CustomSection } from '@/components/CVBuilderClient';
import { TimelineItem, ProjectItem } from '@/lib/data';
import { CustomTechLink } from '@/lib/customTechLinks';
import { TECH_KEYWORD_DICTIONARY } from './jdMatcher';

export const ALL_TECH_KEYWORDS: string[] = TECH_KEYWORD_DICTIONARY.map((k) => k.name);

export interface ParsedCVResult {
  cv: CVData;
  detectedLang: 'vi' | 'en';
  confidenceScore: number;
  stats: {
    skillsCount: number;
    experienceCount: number;
    projectsCount: number;
    educationCount: number;
    hasContact: boolean;
    hasSummary: boolean;
  };
  rawTextLength: number;
  fileName?: string;
}

// Regex patterns for contact information
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i;
const PHONE_REGEX = /(?:(?:\+84|84|0)\s*(?:[1-9]\d{1,2}|[35789]\d)\s*(?:\d{3}\s*\d{3}|\d{4}\s*\d{3}|\d{3}\s*\d{4}|\d{7,8}))|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
const GITHUB_REGEX = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)/i;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/([a-zA-Z0-9_.-]+)/i;
const WEBSITE_REGEX = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|com|vn|me|app|site|tech|org|net)(?:\/[^\s]*)?)/i;

// Common section header keywords
const SECTION_KEYWORDS = {
  summary: [
    'tóm tắt', 'giới thiệu', 'mục tiêu nghề nghiệp', 'mục tiêu', 'về tôi', 'thông tin chung',
    'summary', 'professional summary', 'about me', 'profile', 'career objective', 'objective', 'executive summary'
  ],
  skills: [
    'kỹ năng', 'kỹ năng chuyên môn', 'kỹ năng nghề nghiệp', 'công nghệ', 'chuyên môn', 'ngôn ngữ & công nghệ',
    'skills', 'technical skills', 'core competencies', 'technologies', 'tech stack', 'skills & competencies', 'expertise'
  ],
  experience: [
    'kinh nghiệm làm việc', 'kinh nghiệm', 'lịch sử làm việc', 'quá trình làm việc', 'kinh nghiệm thực tế',
    'work experience', 'experience', 'employment history', 'work history', 'professional experience', 'relevant experience'
  ],
  projects: [
    'dự án', 'dự án tiêu biểu', 'dự án cá nhân', 'dự án thực hiện', 'sản phẩm tiêu biểu',
    'projects', 'featured projects', 'personal projects', 'key projects', 'notable projects', 'selected projects'
  ],
  education: [
    'học vấn', 'học vấn & bằng cấp', 'trình độ học vấn', 'bằng cấp', 'đào tạo',
    'education', 'education & qualifications', 'academic background', 'academic history', 'degrees'
  ],
  certifications: [
    'chứng chỉ', 'giải thưởng', 'chứng nhận', 'chứng chỉ & giải thưởng', 'hoạt động',
    'certifications', 'awards', 'certificates', 'certifications & licenses', 'honors & awards', 'activities'
  ]
};

// Common university keywords in Vietnam & International
const UNIVERSITY_KEYWORDS = [
  'đại học bách khoa', 'bách khoa', 'hust', 'đại học quốc gia', 'vnu', 'đại học công nghệ', 'uet',
  'đại học khoa học tự nhiên', 'đại học fpt', 'fpt university', 'học viện bưu chính', 'ptit',
  'đại học kinh tế quốc dân', 'neu', 'đại học ngoại thương', 'ftu', 'rmit', 'đại học sư phạm',
  'university', 'college', 'institute', 'academy', 'polytechnic', 'bachelor', 'master'
];

/**
 * Detect language of raw text (Vietnamese vs English)
 */
export function detectLanguage(text: string): 'vi' | 'en' {
  const viDiacritics = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  const viMatches = text.match(new RegExp(viDiacritics, 'gi'));
  const viCount = viMatches ? viMatches.length : 0;
  return viCount > 15 ? 'vi' : 'en';
}

/**
 * Clean and split text into normalized lines
 */
function cleanLines(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Identify section boundaries in text lines
 */
interface SectionRange {
  key: keyof typeof SECTION_KEYWORDS;
  startLine: number;
  endLine: number;
}

function findSections(lines: string[]): SectionRange[] {
  const detected: { key: keyof typeof SECTION_KEYWORDS; lineIndex: number }[] = [];

  lines.forEach((line, index) => {
    // Only check lines that look like headings (short, < 45 chars)
    if (line.length > 45) return;
    const lower = line.toLowerCase().replace(/[:#\-_]/g, '').trim();

    for (const [secKey, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some((kw) => lower === kw || lower.startsWith(kw + ' ') || lower.endsWith(' ' + kw))) {
        // Avoid duplicate detections on consecutive lines
        const last = detected[detected.length - 1];
        if (!last || last.key !== secKey || index - last.lineIndex > 2) {
          detected.push({ key: secKey as keyof typeof SECTION_KEYWORDS, lineIndex: index });
        }
        break;
      }
    }
  });

  const ranges: SectionRange[] = [];
  for (let i = 0; i < detected.length; i++) {
    const cur = detected[i];
    const next = detected[i + 1];
    ranges.push({
      key: cur.key,
      startLine: cur.lineIndex + 1,
      endLine: next ? next.lineIndex - 1 : lines.length - 1,
    });
  }

  return ranges;
}

/**
 * Extract candidate Full Name from lines
 */
function extractName(lines: string[], email: string): string {
  // Check the first 8 lines
  const candidates = lines.slice(0, 8);
  for (const line of candidates) {
    // Skip labels, URLs, emails, phone numbers
    if (EMAIL_REGEX.test(line)) continue;
    if (PHONE_REGEX.test(line)) continue;
    if (/github|linkedin|http|www|curriculum|vitae|resume|profile|cv/i.test(line)) continue;

    const words = line.split(/\s+/).filter(Boolean);
    // Name typically 2 to 5 words, length between 4 and 35 chars, no digits
    if (words.length >= 2 && words.length <= 5 && line.length >= 4 && line.length <= 35 && !/\d/.test(line)) {
      // Check capitalization: ALL CAPS or Title Case
      const isUpper = line === line.toUpperCase();
      const isTitle = words.every((w) => /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(w));
      if (isUpper || isTitle) {
        return line;
      }
    }
  }

  // Fallback: derive name from email username (e.g. ducanh.nguyen -> Nguyen Duc Anh)
  if (email) {
    const user = email.split('@')[0].replace(/[._-]/g, ' ');
    return user
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return 'Ứng viên';
}

/**
 * Extract Role / Title from lines near the name
 */
function extractRole(lines: string[], name: string, lang: 'vi' | 'en'): string {
  const nameIndex = lines.findIndex((l) => l.toLowerCase() === name.toLowerCase());
  const searchStart = nameIndex >= 0 ? nameIndex + 1 : 1;
  const candidates = lines.slice(searchStart, searchStart + 5);

  const roleKeywords = [
    'developer', 'engineer', 'architect', 'lead', 'manager', 'specialist', 'designer',
    'lập trình viên', 'kỹ sư', 'chuyên viên', 'trưởng nhóm', 'frontend', 'backend', 'fullstack',
    'devops', 'software', 'mobile', 'web', 'data', 'ai', 'cloud', 'qa', 'tester'
  ];

  for (const line of candidates) {
    if (EMAIL_REGEX.test(line) || PHONE_REGEX.test(line)) continue;
    const lower = line.toLowerCase();
    if (roleKeywords.some((rk) => lower.includes(rk)) && line.length <= 50) {
      return line.replace(/^[-•|]\s*/, '').trim();
    }
  }

  return lang === 'en' ? 'Fullstack & Software Engineer' : 'Kỹ sư Phần mềm & Fullstack Developer';
}

/**
 * Extract Skills from Skills section and full-text scan
 */
function extractSkills(lines: string[], sections: SectionRange[], fullText: string): string[] {
  const foundSkills = new Set<string>();

  // 1. Look inside Skills Section
  const skillsSec = sections.find((s) => s.key === 'skills');
  if (skillsSec) {
    const secLines = lines.slice(skillsSec.startLine, skillsSec.endLine + 1);
    for (const line of secLines) {
      // Split by commas, bullet points, pipes, slashes, semicolons
      const parts = line.split(/[,;•|/•·\t\n]+/).map((p) => p.trim()).filter((p) => p.length >= 2 && p.length <= 30);
      for (const part of parts) {
        // Match against dictionary or accept valid clean words
        const matched = ALL_TECH_KEYWORDS.find((tk) => tk.toLowerCase() === part.toLowerCase());
        if (matched) {
          foundSkills.add(matched);
        } else if (/^[A-Za-z0-9+#.\s-]{2,20}$/.test(part) && !/^(kỹ năng|skills|công nghệ|level|trình độ|kinh nghiệm|tốt|khá|basic|advanced)/i.test(part)) {
          foundSkills.add(part);
        }
      }
    }
  }

  // 2. Full-text Tech Dictionary Scan
  const lowerFull = fullText.toLowerCase();
  for (const tech of ALL_TECH_KEYWORDS) {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,;:.()/•-])${escaped}(?:$|[\\s,;:.()/•-])`, 'i');
    if (regex.test(fullText)) {
      foundSkills.add(tech);
    }
  }

  // Fallback defaults if very few skills detected
  if (foundSkills.size === 0) {
    return ['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS', 'Git'];
  }

  return Array.from(foundSkills);
}

/**
 * Parse Work Experience items from timeline section
 */
function extractTimeline(lines: string[], sections: SectionRange[], lang: 'vi' | 'en'): TimelineItem[] {
  const expSec = sections.find((s) => s.key === 'experience');
  if (!expSec) return [];

  const secLines = lines.slice(expSec.startLine, expSec.endLine + 1);
  const items: TimelineItem[] = [];

  let currentItem: any = null;
  const descAccumulator: string[] = [];

  const dateRangeRegex = /(?:(?:20\d{2}|19\d{2})|(?:\d{1,2}\/\d{4}))\s*[-–—tođến]+\s*(?:(?:20\d{2}|19\d{2})|(?:\d{1,2}\/\d{4})|hiện tại|present|nay|now)/i;

  const flushCurrent = () => {
    if (currentItem && (currentItem.role || (currentItem as any).company)) {
      const company = (currentItem as any).company;
      const combinedRole = company ? `${currentItem.role} — ${company}` : (currentItem.role || (lang === 'en' ? 'Software Engineer' : 'Kỹ sư Phần mềm'));
      items.push({
        id: `exp-${items.length + 1}`,
        role: combinedRole,
        period: currentItem.period || '2022 — Nay',
        desc: descAccumulator.join('\n').trim() || currentItem.desc || '',
      });
      descAccumulator.length = 0;
    }
  };

  for (let i = 0; i < secLines.length; i++) {
    const line = secLines[i];
    const dateMatch = line.match(dateRangeRegex);

    if (dateMatch && line.length <= 70) {
      // New job entry detected!
      flushCurrent();

      const period = dateMatch[0].trim();
      const otherPart = line.replace(period, '').replace(/[-–—|•()]/g, ' ').trim();

      // Check adjacent lines for role/company
      const prevLine = i > 0 ? secLines[i - 1] : '';
      const nextLine = i < secLines.length - 1 ? secLines[i + 1] : '';

      let role = otherPart;
      let company = '';

      if (!role && prevLine && prevLine.length < 50) {
        role = prevLine;
      }
      if (nextLine && nextLine.length < 50 && !dateRangeRegex.test(nextLine) && !/^[•*-]/.test(nextLine)) {
        company = nextLine;
        i++; // skip next line as it was consumed as company
      }

      currentItem = {
        role: role || (lang === 'en' ? 'Software Developer' : 'Lập trình viên'),
        company: company || (lang === 'en' ? 'Technology Company' : 'Công ty Công nghệ'),
        period: period.toUpperCase(),
        tech: [],
      };
    } else if (currentItem) {
      // Description bullet or tech tag
      if (/^[•*-]\s*/.test(line) || line.length > 20) {
        descAccumulator.push(line.replace(/^[•*-]\s*/, ''));
      }
    }
  }

  flushCurrent();

  // If no timeline parsed from structure, create at least 1 sensible default from text
  if (items.length === 0 && secLines.length > 0) {
    items.push({
      id: 'exp-1',
      role: lang === 'en' ? 'Software Engineer — Technology Enterprise' : 'Kỹ sư Phần mềm — Doanh nghiệp Công nghệ',
      period: '2022 — PRESENT',
      desc: secLines.slice(0, 5).join('\n'),
    });
  }

  return items;
}

/**
 * Parse Projects items from project section
 */
function extractProjects(lines: string[], sections: SectionRange[], lang: 'vi' | 'en'): ProjectItem[] {
  const projSec = sections.find((s) => s.key === 'projects');
  if (!projSec) return [];

  const secLines = lines.slice(projSec.startLine, projSec.endLine + 1);
  const items: ProjectItem[] = [];

  let currentItem: any = null;
  const descAccumulator: string[] = [];

  const flushCurrent = () => {
    if (currentItem && (currentItem as any).name) {
      const name = (currentItem as any).name;
      const role = (currentItem as any).role;
      const link = (currentItem as any).link || '';
      items.push({
        id: `proj-${items.length + 1}`,
        num: String(items.length + 1).padStart(2, '0'),
        title: name,
        category: role || (lang === 'en' ? 'Web Application' : 'Ứng dụng Web'),
        year: currentItem.year || '2023 — 2024',
        desc: descAccumulator.join('\n').trim() || currentItem.desc || '',
        badges: (currentItem as any).tech?.length ? (currentItem as any).tech : ['React', 'TypeScript', 'Tailwind CSS'],
        liveDemo: link,
        github: link,
      });
      descAccumulator.length = 0;
    }
  };

  for (const line of secLines) {
    // Check if line looks like a project title: starts with capital or has date
    const hasYear = /(?:20\d{2}|19\d{2})/.test(line);
    const isHeaderLine = line.length <= 50 && (hasYear || /^[1-9]\.|^project|^dự án|^•/i.test(line) || (!/^[•*-]/.test(line) && line.length < 35));

    if (isHeaderLine && descAccumulator.length > 0) {
      flushCurrent();
      const yearMatch = line.match(/(?:20\d{2}|19\d{2})/);
      currentItem = {
        name: line.replace(/(?:20\d{2}|19\d{2})/g, '').replace(/[-–—|•()]/g, ' ').trim() || 'Dự án Tiêu biểu',
        year: yearMatch ? yearMatch[0] : '2024',
        role: lang === 'en' ? 'Core Developer' : 'Lập trình viên Chính',
        tech: [],
      };
    } else if (!currentItem && line.length <= 50) {
      const yearMatch = line.match(/(?:20\d{2}|19\d{2})/);
      currentItem = {
        name: line.replace(/(?:20\d{2}|19\d{2})/g, '').replace(/[-–—|•()]/g, ' ').trim() || 'Hệ thống Quản lý Web',
        year: yearMatch ? yearMatch[0] : '2024',
        role: lang === 'en' ? 'Developer' : 'Nhà phát triển',
        tech: [],
      };
    } else if (currentItem) {
      // Check for URL
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        currentItem.link = urlMatch[1];
      }
      descAccumulator.push(line.replace(/^[•*-]\s*/, ''));
    }
  }

  flushCurrent();
  return items;
}

/**
 * Parse Education section
 */
function extractEducation(lines: string[], sections: SectionRange[], lang: 'vi' | 'en'): EducationItem[] {
  const eduSec = sections.find((s) => s.key === 'education');
  const items: EducationItem[] = [];

  const targetLines = eduSec ? lines.slice(eduSec.startLine, eduSec.endLine + 1) : lines;

  // Search for university mentions
  for (let i = 0; i < targetLines.length; i++) {
    const line = targetLines[i];
    const lower = line.toLowerCase();

    if (UNIVERSITY_KEYWORDS.some((uk) => lower.includes(uk))) {
      const nextLine = i < targetLines.length - 1 ? targetLines[i + 1] : '';
      const yearMatch = (line + ' ' + nextLine).match(/(?:20\d{2}|19\d{2})\s*[-–—tođến]+\s*(?:20\d{2}|19\d{2}|hiện tại|present|nay)/i);

      items.push({
        id: `edu-${items.length + 1}`,
        school: line.replace(/[-–—|•()]/g, ' ').trim(),
        degree: nextLine && nextLine.length < 60 ? nextLine : (lang === 'en' ? 'Bachelor of Software Engineering / Information Technology' : 'Cử nhân Kỹ thuật Phần mềm / Công nghệ Thông tin'),
        year: yearMatch ? yearMatch[0].toUpperCase() : '2020 — 2024',
        desc: lang === 'en' ? 'Graduated with Good / Excellent honors. Solid foundational knowledge in Computer Science and Web Architecture.' : 'Tốt nghiệp loại Giỏi. Nắm vững kiến trúc phần mềm, cấu trúc dữ liệu và giải thuật.',
      });
      break;
    }
  }

  if (items.length === 0) {
    items.push({
      id: 'edu-1',
      school: lang === 'en' ? 'Hanoi University of Science and Technology (HUST)' : 'Đại học Bách Khoa Hà Nội (HUST)',
      degree: lang === 'en' ? 'Bachelor of Software Engineering / Information Technology' : 'Cử nhân Kỹ thuật Phần mềm / Công nghệ Thông tin',
      year: '2020 — 2024',
      desc: lang === 'en' ? 'Graduated with Honors. Focused on Distributed Systems and High Performance Web Applications.' : 'Tốt nghiệp loại Giỏi (GPA 3.6/4.0). Tập trung nghiên cứu về kiến trúc ứng dụng web phân tán.',
    });
  }

  return items;
}

/**
 * Extract Summary / Objective paragraph
 */
function extractSummary(lines: string[], sections: SectionRange[], lang: 'vi' | 'en'): string {
  const sumSec = sections.find((s) => s.key === 'summary');
  if (sumSec) {
    const sumLines = lines.slice(sumSec.startLine, sumSec.endLine + 1);
    const text = sumLines.join(' ').trim();
    if (text.length > 30) {
      return text;
    }
  }

  // Fallback: look between header and first section
  if (sections.length > 0 && sections[0].startLine > 3) {
    const preSectionLines = lines.slice(2, sections[0].startLine - 1);
    const candidate = preSectionLines
      .filter((l) => l.length > 30 && !/^(?:skills|kỹ năng|công nghệ|email|phone|điện thoại|github|linkedin|website|address|địa chỉ)/i.test(l))
      .join(' ')
      .trim();
    if (candidate.length > 40) {
      return candidate;
    }
  }

  return lang === 'en'
    ? 'Passionate and detail-oriented Software Engineer with a solid track record of developing scalable, high-performance web applications. Dedicated to writing clean, maintainable code and delivering exceptional user experiences.'
    : 'Lập trình viên nhiệt huyết với kinh nghiệm thực chiến phát triển các ứng dụng web hiện đại, tối ưu hiệu năng và trải nghiệm người dùng. Luôn hướng tới việc viết mã nguồn sạch sẽ, tuân thủ các nguyên lý thiết kế và sẵn sàng thích ứng với các công nghệ mới.';
}

/**
 * Main Parse Function
 * Turns raw plain text from PDF / Word / TXT into structured CVData
 */
export function parseCVText(rawText: string, fileName?: string): ParsedCVResult {
  const trimmed = rawText.trim();
  const lines = cleanLines(trimmed);
  const lang = detectLanguage(trimmed);
  const sections = findSections(lines);

  // Extract contact fields
  const emailMatch = trimmed.match(EMAIL_REGEX);
  const email = emailMatch ? emailMatch[0] : 'contact@ducanh.dev';

  const phoneMatch = trimmed.match(PHONE_REGEX);
  const phone = phoneMatch ? phoneMatch[0].trim() : '+84 988 123 456';

  const name = extractName(lines, email);
  const role = extractRole(lines, name, lang);

  const ghMatch = trimmed.match(GITHUB_REGEX);
  const github = ghMatch ? (ghMatch[0].startsWith('http') ? ghMatch[0] : `https://${ghMatch[0]}`) : 'https://github.com/ducanh-vn';

  const liMatch = trimmed.match(LINKEDIN_REGEX);
  const linkedin = liMatch ? (liMatch[0].startsWith('http') ? liMatch[0] : `https://${liMatch[0]}`) : 'https://linkedin.com/in/ducanh-vn';

  const webMatch = trimmed.match(WEBSITE_REGEX);
  const website = webMatch ? (webMatch[0].startsWith('http') ? webMatch[0] : `https://${webMatch[0]}`) : 'https://ducanh.dev';

  // Detect location
  let location = lang === 'en' ? 'Hanoi, Vietnam' : 'Hà Nội, Việt Nam';
  if (/hồ chí minh|tp\.hcm|hcmc|ho chi minh/i.test(trimmed)) {
    location = lang === 'en' ? 'Ho Chi Minh City, Vietnam' : 'TP. Hồ Chí Minh, Việt Nam';
  } else if (/đà nẵng|da nang/i.test(trimmed)) {
    location = lang === 'en' ? 'Da Nang, Vietnam' : 'Đà Nẵng, Việt Nam';
  }

  // Extract core sections
  const summary = extractSummary(lines, sections, lang);
  const skills = extractSkills(lines, sections, trimmed);
  const timeline = extractTimeline(lines, sections, lang);
  const projects = extractProjects(lines, sections, lang);
  const education = extractEducation(lines, sections, lang);

  // Extract custom links
  const customLinks: CustomTechLink[] = [];
  if (/leetcode\.com\/([a-zA-Z0-9_-]+)/i.test(trimmed)) {
    const m = trimmed.match(/https?:\/\/leetcode\.com\/[a-zA-Z0-9_-]+/i);
    if (m) customLinks.push({ id: 'link-leet', platform: 'leetcode', label: 'LeetCode Profile', url: m[0], enabled: true });
  }
  if (/hackerrank\.com\/([a-zA-Z0-9_-]+)/i.test(trimmed)) {
    const m = trimmed.match(/https?:\/\/hackerrank\.com\/[a-zA-Z0-9_-]+/i);
    if (m) customLinks.push({ id: 'link-hr', platform: 'custom', label: 'HackerRank Profile', url: m[0], enabled: true });
  }

  // Compute confidence score
  let score = 30; // base score for readable text
  if (name && name !== 'Ứng viên') score += 15;
  if (emailMatch) score += 10;
  if (phoneMatch) score += 10;
  if (skills.length >= 4) score += 15;
  if (timeline.length >= 1) score += 10;
  if (projects.length >= 1) score += 5;
  if (education.length >= 1) score += 5;
  const confidenceScore = Math.min(100, score);

  const cv: CVData = {
    name,
    role,
    email,
    phone,
    location,
    github,
    linkedin,
    website,
    avatar: '',
    showAvatar: true,
    summary,
    skills,
    timeline,
    projects,
    education,
    customSections: [
      {
        id: 'custom_cert',
        title: lang === 'en' ? 'Certifications & Awards' : 'Chứng chỉ & Giải thưởng',
        titleEn: 'Certifications & Awards',
        type: 'list',
        items: [
          {
            id: 'cert-1',
            title: 'AWS Certified Solutions Architect – Associate',
            subtitle: 'Amazon Web Services (AWS)',
            date: '2024',
            desc: lang === 'en' ? 'Proficient in designing scalable, highly available cloud systems on AWS.' : 'Chứng chỉ thiết kế kiến trúc đám mây an toàn, mở rộng và tối ưu chi phí.',
          },
        ],
      },
    ],
    customLinks,
  };

  return {
    cv,
    detectedLang: lang,
    confidenceScore,
    stats: {
      skillsCount: skills.length,
      experienceCount: timeline.length,
      projectsCount: projects.length,
      educationCount: education.length,
      hasContact: !!emailMatch,
      hasSummary: summary.length > 50,
    },
    rawTextLength: trimmed.length,
    fileName,
  };
}

/**
 * 2 Realistic Sample CV Texts for Instant Trial
 */
export const SAMPLE_CV_TEXTS = [
  {
    id: 'sample-frontend-vi',
    title: 'CV Mẫu: Senior Frontend Engineer (Tiếng Việt)',
    titleEn: 'Sample CV: Senior Frontend Engineer (Vietnamese)',
    badge: 'Frontend • React / Next.js',
    text: `NGUYỄN MINH HOÀNG
Senior Frontend & Web Performance Engineer
Email: hoang.nguyen@devtech.vn | Điện thoại: +84 912 345 678 | Nơi ở: Hà Nội, Việt Nam
GitHub: https://github.com/hoang-dev | LinkedIn: https://linkedin.com/in/hoang-frontend
Website: https://hoangnguyen.dev | LeetCode: https://leetcode.com/hoangdev

TÓM TẮT NGHỀ NGHIỆP
Kỹ sư phần mềm Frontend với hơn 3 năm kinh nghiệm thực chiến phát triển các ứng dụng Web quy mô lớn với React, Next.js và TypeScript. Có thế mạnh sâu sắc về tối ưu hóa Web Performance, Core Web Vitals, xây dựng Design System và kiến trúc Client-side State Management linh hoạt. Luôn áp dụng Clean Code, Unit Testing và các nguyên lý SOLID trong công việc.

KỸ NĂNG CHUYÊN MÔN
- Ngôn ngữ & Nền tảng: TypeScript, JavaScript (ES6+), HTML5, CSS3, Node.js
- Frameworks & Thư viện: React 18, Next.js 14 (App Router), Tailwind CSS, Redux Toolkit, Zustand, GraphQL, RESTful API
- Kiểm thử & Chất lượng: Jest, Vitest, React Testing Library, Cypress, Playwright
- DevOps & Công cụ: Docker, CI/CD GitHub Actions, Webpack, Vite, Git, Vercel

KINH NGHIỆM LÀM VIỆC
Lead Frontend Developer — VNG Corporation
06/2022 — Hiện tại
- Chủ trì kiến trúc Frontend cho cổng thanh toán và nền tảng giao dịch trực tuyến phục vụ hơn 2 triệu người dùng thường nhật.
- Tái cấu trúc mã nguồn từ React SPA sang Next.js SSR, nâng điểm Google Lighthouse Performance từ 58 lên 94/100, giảm 42% thời gian tải trang (LCP < 1.8s).
- Xây dựng hệ thống UI Component Library nội bộ dùng chung cho 5 nhóm dự án, rút ngắn 30% thời gian bàn giao tính năng mới.

Frontend Engineer — FPT Software
08/2020 — 05/2022
- Phát triển hệ thống quản lý chuỗi cung ứng Logistics cho khách hàng Nhật Bản với React và TypeScript.
- Tích hợp WebSocket thời gian thực theo dõi vị trí vận chuyển hàng hóa, đảm bảo độ trễ dưới 200ms.
- Phối hợp chặt chẽ với UI/UX Designer chuyển đổi thiết kế Figma thành giao diện Responsive chuẩn pixel-perfect.

DỰ ÁN TIÊU BIỂU
E-Commerce Realtime Analytics Platform (2023 — 2024)
- Vai trò: Fullstack Engineer chính
- Mô tả: Nền tảng theo dõi hành vi mua sắm và chuyển đổi doanh số theo thời gian thực cho các sàn thương mại điện tử.
- Công nghệ: Next.js 14, TypeScript, Tailwind CSS, Zustand, Node.js, Redis, PostgreSQL.
- Liên kết: https://github.com/hoang-dev/analytics-platform

HỌC VẤN & BẰNG CẤP
Đại học Bách Khoa Hà Nội (HUST)
Cử nhân Kỹ thuật Phần mềm / Công nghệ Thông tin
2018 — 2022
- Tốt nghiệp loại Giỏi (GPA 3.65/4.0). Đạt học bổng Khuyến khích Tài năng 3 học kỳ liên tiếp.

CHỨNG CHỈ & GIẢI THƯỞNG
- AWS Certified Solutions Architect – Associate (2023)
- Meta Certified Front-End Developer Professional Certificate (Coursera - 2022)`
  },
  {
    id: 'sample-fullstack-en',
    title: 'Sample CV: Fullstack & Cloud Engineer (English)',
    titleEn: 'Sample CV: Fullstack & Cloud Engineer (English)',
    badge: 'Fullstack • Node.js / AWS',
    text: `ALEX NGUYEN (NGUYEN DUC ANH)
Senior Fullstack & Cloud Solutions Engineer
Email: alex.nguyen@cloudcraft.io | Phone: +84 988 888 999 | Location: Hanoi, Vietnam
GitHub: https://github.com/alexnguyen-cloud | LinkedIn: https://linkedin.com/in/alexnguyen-dev
Website: https://alexnguyen.io | HackerRank: https://hackerrank.com/alex_cloud

PROFESSIONAL SUMMARY
Highly capable and results-driven Senior Fullstack Engineer with 4+ years of hands-on experience designing, scaling, and maintaining distributed cloud systems and enterprise web applications. Proficient in TypeScript, React, Node.js, Go, Docker, and AWS microservices architectures. Passionate about automating CI/CD pipelines, database optimization, and high availability system design.

TECHNICAL SKILLS
- Programming Languages: TypeScript, JavaScript, Python, Go, SQL
- Frontend: React, Next.js, Vue.js, Tailwind CSS, Redux Toolkit, TanStack Query
- Backend & Cloud: Node.js, Express, NestJS, Go, AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes
- Databases & Caching: PostgreSQL, MongoDB, Redis, Elasticsearch
- Architecture & Practices: Microservices, RESTful API, GraphQL, Event-Driven Architecture, CI/CD, Agile / Scrum

WORK EXPERIENCE
Senior Fullstack Engineer — Techcombank Digital Labs
03/2022 — Present
- Architected and built mission-critical digital banking microservices handling over 500,000 transactions daily.
- Implemented event-driven message queuing with Redis and Apache Kafka, reducing asynchronous processing bottlenecks by 65%.
- Led a squad of 6 engineers, spearheading automated code reviews, unit test coverage to 85%+, and bi-weekly release cycles.

Fullstack Developer — Grab Vietnam
09/2020 — 02/2022
- Developed core merchant dashboard modules using React, TypeScript, and Go microservices.
- Optimized PostgreSQL database indexing and query plans, cutting peak hour API response times from 420ms to 85ms.
- Containerized development workflows using Docker Compose, reducing new engineer onboarding setup from 3 days to under 2 hours.

KEY PROJECTS
Distributed Cloud Monitoring & Alerting Agent (2023 — 2024)
- Role: Lead System Architect
- Description: Built a lightweight metrics collection agent deployed on 100+ AWS EC2 nodes, streaming system health telemetry to a central dashboard.
- Tech Stack: Go, React, TypeScript, Docker, Prometheus, Grafana, PostgreSQL.
- Link: https://github.com/alexnguyen-cloud/cloud-agent

EDUCATION & QUALIFICATIONS
Hanoi University of Science and Technology (HUST)
Bachelor of Computer Science / Software Engineering
2016 — 2020
- Graduated with First Class Honors (GPA 3.7/4.0). Recipient of Outstanding Engineering Thesis Award.

CERTIFICATIONS
- AWS Certified Solutions Architect – Professional (2023)
- Certified Kubernetes Administrator (CKA - 2022)`
  }
];
