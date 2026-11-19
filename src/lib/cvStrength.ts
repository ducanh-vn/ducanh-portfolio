import { CVData } from '@/components/CVBuilderClient';

export interface ChecklistItem {
  id: string;
  category: 'contact' | 'summary' | 'experience' | 'projects' | 'skills' | 'education' | 'ats';
  points: number;
  passed: boolean;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  actionTab?: 'profile' | 'summary' | 'experience' | 'projects' | 'skills' | 'education';
  actionSpecial?: 'openTechModal' | 'toggleCompact';
  actionLabelVi?: string;
  actionLabelEn?: string;
}

export interface CategoryScore {
  id: string;
  titleVi: string;
  titleEn: string;
  earned: number;
  total: number;
}

export interface CVStrengthEvaluation {
  score: number;
  ratingVi: string;
  ratingEn: string;
  ratingColor: string;
  ratingBg: string;
  summaryVi: string;
  summaryEn: string;
  items: ChecklistItem[];
  categories: CategoryScore[];
  passedCount: number;
  totalCount: number;
}

// Regex to detect quantifiable impact metrics (%, ms, numbers, k, x, metrics, action impact keywords)
const METRIC_REGEX = /\b(\d+(\.\d+)?%|\d+[kKxX+]|\d+\+?\s*(users|người dùng|khách hàng|rps|RPS|ms|giây|s|phút|h|%))\b|(tăng|giảm|tiết kiệm|đạt|vượt|boost|reduced|increased|optimized|saved|slashed)\s+\d+/i;

export function evaluateCVStrength(cv: CVData, lang: 'vi' | 'en'): CVStrengthEvaluation {
  const items: ChecklistItem[] = [];

  // --- 1. CONTACT & LINKS (15 pts) ---
  const hasValidEmail = Boolean(cv.email && cv.email.includes('@') && cv.email.includes('.') && cv.email !== 'ducanh.dev@email.com' ? true : cv.email && cv.email.includes('@'));
  items.push({
    id: 'contact-email',
    category: 'contact',
    points: 5,
    passed: Boolean(hasValidEmail),
    titleVi: 'Địa chỉ Email chuyên nghiệp',
    titleEn: 'Professional Email Address',
    descVi: 'Email hợp lệ là phương thức liên lạc bắt buộc số 1 mà mọi hệ thống ATS và HR tìm kiếm.',
    descEn: 'A valid professional email is the primary contact method for all ATS and recruiters.',
    actionTab: 'profile',
    actionLabelVi: 'Sửa email',
    actionLabelEn: 'Edit email',
  });

  const hasPhone = Boolean(cv.phone && cv.phone.replace(/\D/g, '').length >= 9);
  items.push({
    id: 'contact-phone',
    category: 'contact',
    points: 3,
    passed: hasPhone,
    titleVi: 'Số điện thoại liên lạc',
    titleEn: 'Direct Phone Number',
    descVi: 'Cung cấp số điện thoại chính xác để nhà tuyển dụng có thể gọi phỏng vấn nhanh.',
    descEn: 'Accurate phone number ensures hiring managers can schedule quick phone screens.',
    actionTab: 'profile',
    actionLabelVi: 'Sửa số ĐT',
    actionLabelEn: 'Edit phone',
  });

  const hasLocation = Boolean(cv.location && cv.location.trim().length >= 3);
  items.push({
    id: 'contact-location',
    category: 'contact',
    points: 2,
    passed: hasLocation,
    titleVi: 'Địa điểm / Khu vực làm việc',
    titleEn: 'Location / City',
    descVi: 'Giúp bộ lọc ATS phân loại ứng viên theo khu vực địa lý hoặc làm việc Hybrid/Remote.',
    descEn: 'Helps ATS scanners filter candidates by geographical proximity or Hybrid/Remote eligibility.',
    actionTab: 'profile',
    actionLabelVi: 'Sửa địa chỉ',
    actionLabelEn: 'Edit location',
  });

  const linkCount = [cv.github, cv.linkedin, cv.website].filter((l) => Boolean(l && l.trim().length > 5)).length;
  items.push({
    id: 'contact-links',
    category: 'contact',
    points: 5,
    passed: linkCount >= 1,
    titleVi: 'Liên kết chuyên nghiệp (GitHub, LinkedIn, Portfolio)',
    titleEn: 'Professional Links (GitHub, LinkedIn, Portfolio)',
    descVi: 'Ứng viên công nghệ có hồ sơ GitHub hoặc LinkedIn được nhà tuyển dụng đánh giá cao hơn 40%.',
    descEn: 'Tech candidates with active GitHub or LinkedIn links are 40% more likely to receive callbacks.',
    actionTab: 'profile',
    actionLabelVi: 'Thêm liên kết',
    actionLabelEn: 'Add links',
  });

  // --- 2. SUMMARY & ROLE (15 pts) ---
  const summaryLength = (cv.summary || '').trim().length;
  items.push({
    id: 'summary-depth',
    category: 'summary',
    points: 10,
    passed: summaryLength >= 80,
    titleVi: 'Tóm tắt chuyên môn có chiều sâu (>= 80 ký tự)',
    titleEn: 'Compelling Professional Summary (>= 80 chars)',
    descVi: 'Tóm tắt 2-3 câu thể hiện định hướng, số năm kinh nghiệm và giá trị cốt lõi mang lại cho công ty.',
    descEn: 'A 2-3 sentence overview highlighting your focus, years of experience, and core value proposition.',
    actionTab: 'summary',
    actionLabelVi: 'Viết tóm tắt',
    actionLabelEn: 'Edit summary',
  });

  const hasTargetRole = Boolean(cv.role && cv.role.trim().length >= 4);
  items.push({
    id: 'summary-role',
    category: 'summary',
    points: 5,
    passed: hasTargetRole,
    titleVi: 'Chức danh ứng tuyển rõ ràng',
    titleEn: 'Clear Target Job Title',
    descVi: 'Tiêu đề vị trí (VD: Senior Frontend Developer) giúp ATS xếp hạng hồ sơ đúng thang tuyển dụng.',
    descEn: 'Explicit job title (e.g. Senior Frontend Engineer) maps directly into ATS vacancy criteria.',
    actionTab: 'profile',
    actionLabelVi: 'Sửa chức danh',
    actionLabelEn: 'Edit job title',
  });

  // --- 3. WORK EXPERIENCE & QUANTIFIABLE METRICS (30 pts) ---
  const timelineCount = cv.timeline ? cv.timeline.length : 0;
  items.push({
    id: 'exp-count',
    category: 'experience',
    points: 10,
    passed: timelineCount >= 2,
    titleVi: 'Có ít nhất 2 mốc kinh nghiệm thực chiến',
    titleEn: 'At least 2 Work Experience milestones',
    descVi: 'Minh chứng cho quá trình phát triển sự nghiệp liên tục và khả năng gắn bó, cống hiến.',
    descEn: 'Demonstrates a continuous track record of professional growth and contributions.',
    actionTab: 'experience',
    actionLabelVi: 'Thêm kinh nghiệm',
    actionLabelEn: 'Add experience',
  });

  // Check how many timeline items have quantifiable metrics
  const metricItemsCount = (cv.timeline || []).filter((item) => METRIC_REGEX.test(item.desc || '')).length;
  items.push({
    id: 'exp-metrics',
    category: 'experience',
    points: 12,
    passed: metricItemsCount >= 1,
    titleVi: 'Chỉ số định lượng & Tác động (Công thức Google XYZ)',
    titleEn: 'Quantifiable Metrics & Business Impact (Google XYZ)',
    descVi: 'CV công nghệ xuất sắc luôn đi kèm con số cụ thể: % cải thiện, thời gian tải trang, số lượng người dùng, SLA.',
    descEn: 'Elite tech CVs prove impact with numbers: % performance gain, latency reduction, user volume, uptime.',
    actionSpecial: 'openTechModal',
    actionLabelVi: 'Gợi ý chuẩn Tech',
    actionLabelEn: 'Get Tech Bullets',
  });

  // Check if bullet points formatting is used
  const hasBulletPoints = (cv.timeline || []).some((item) => (item.desc || '').includes('•') || (item.desc || '').includes('\n- ') || (item.desc || '').split('\n').length >= 2);
  items.push({
    id: 'exp-bullets',
    category: 'experience',
    points: 8,
    passed: hasBulletPoints,
    titleVi: 'Định dạng gạch đầu dòng (Bullet Points) rõ ràng',
    titleEn: 'Structured Bullet Points Formatting',
    descVi: 'Trình bày theo các gạch đầu dòng giúp nhà tuyển dụng quét nội dung trong 6 giây đầu tiên.',
    descEn: 'Bullet points structure enhances readability, allowing recruiters to scan key achievements in 6 seconds.',
    actionTab: 'experience',
    actionLabelVi: 'Định dạng lại',
    actionLabelEn: 'Format bullets',
  });

  // --- 4. FEATURED PROJECTS (15 pts) ---
  const projectCount = cv.projects ? cv.projects.length : 0;
  items.push({
    id: 'proj-count',
    category: 'projects',
    points: 8,
    passed: projectCount >= 2,
    titleVi: 'Có ít nhất 2 dự án tiêu biểu',
    titleEn: 'At least 2 Featured Projects',
    descVi: 'Dự án thực tế là bằng chứng rõ nhất về năng lực thực thi và khả năng vận dụng công nghệ.',
    descEn: 'Real-world projects showcase your execution ability and technical problem-solving skills.',
    actionTab: 'projects',
    actionLabelVi: 'Thêm dự án',
    actionLabelEn: 'Add projects',
  });

  const detailedProjects = (cv.projects || []).filter((p) => (p.desc && p.desc.trim().length >= 30) || (p.badges && p.badges.length >= 2)).length;
  items.push({
    id: 'proj-details',
    category: 'projects',
    points: 7,
    passed: detailedProjects >= 1,
    titleVi: 'Mô tả dự án kèm công nghệ & đóng góp nổi bật',
    titleEn: 'Detailed Project Scope & Tech Stacks',
    descVi: 'Nêu rõ vai trò của bạn, các công nghệ chủ chốt và tính năng nổi bật của từng sản phẩm.',
    descEn: 'Clearly state your responsibilities, core technologies, and major achievements for each product.',
    actionTab: 'projects',
    actionLabelVi: 'Bổ sung mô tả',
    actionLabelEn: 'Refine projects',
  });

  // --- 5. TECHNICAL SKILLS (15 pts) ---
  const skillCount = cv.skills ? cv.skills.length : 0;
  items.push({
    id: 'skills-count',
    category: 'skills',
    points: 10,
    passed: skillCount >= 6,
    titleVi: 'Khai báo tối thiểu 6 kỹ năng kỹ thuật cốt lõi',
    titleEn: 'At least 6 Core Technical Skills listed',
    descVi: 'Cung cấp đầy đủ các ngôn ngữ, thư viện, database và công cụ đáp ứng yêu cầu công việc.',
    descEn: 'Provide a well-rounded list of languages, libraries, databases, and DevOps tools.',
    actionTab: 'skills',
    actionLabelVi: 'Thêm kỹ năng',
    actionLabelEn: 'Add skills',
  });

  // Keyword check for modern fullstack/frontend/backend tooling
  const allSkillsStr = (cv.skills || []).join(' ').toLowerCase();
  const hasModernStack = /react|next|vue|angular|node|typescript|javascript|python|go|docker|aws|sql|mongo|tailwind/i.test(allSkillsStr);
  items.push({
    id: 'skills-modern',
    category: 'skills',
    points: 5,
    passed: hasModernStack,
    titleVi: 'Chứa các công nghệ thị trường săn đón',
    titleEn: 'In-demand Market Tech Stacks included',
    descVi: 'Các từ khóa như TypeScript, React, Next.js, Node.js, Docker giúp CV vượt qua bộ lọc ATS tự động.',
    descEn: 'Keywords like TypeScript, React, Next.js, Node.js, and Docker match high-demand ATS keyword filters.',
    actionTab: 'skills',
    actionLabelVi: 'Bổ sung kỹ năng',
    actionLabelEn: 'Add tech skills',
  });

  // --- 6. EDUCATION (10 pts) ---
  const hasEducation = (cv.education || []).some((e) => Boolean(e.school && e.degree));
  items.push({
    id: 'edu-complete',
    category: 'education',
    points: 10,
    passed: hasEducation,
    titleVi: 'Học vấn & Bằng cấp / Chứng chỉ đầy đủ',
    titleEn: 'Verified Education & Qualifications',
    descVi: 'Ghi rõ tên trường đại học / học viện, bằng cấp / chuyên ngành và giai đoạn tốt nghiệp.',
    descEn: 'Specify institution name, degree/major, and graduation period.',
    actionTab: 'education',
    actionLabelVi: 'Sửa học vấn',
    actionLabelEn: 'Edit education',
  });

  // Calculate Total Score
  let score = 0;
  items.forEach((item) => {
    if (item.passed) {
      score += item.points;
    }
  });

  // Categorized breakdown
  const categoryKeys: ChecklistItem['category'][] = ['contact', 'summary', 'experience', 'projects', 'skills', 'education'];
  const categoryNames: Record<ChecklistItem['category'], { vi: string; en: string }> = {
    contact: { vi: 'Thông tin liên hệ & Mạng xã hội', en: 'Contact & Social Links' },
    summary: { vi: 'Tóm tắt chuyên môn', en: 'Professional Summary' },
    experience: { vi: 'Kinh nghiệm & Chỉ số định lượng', en: 'Experience & Metrics' },
    projects: { vi: 'Dự án thực tế & Đóng góp', en: 'Projects & Demos' },
    skills: { vi: 'Kỹ năng & Chuyên môn', en: 'Technical Skills' },
    education: { vi: 'Học vấn & Bằng cấp', en: 'Education & Credentials' },
    ats: { vi: 'Định dạng chuẩn ATS', en: 'ATS Formatting' },
  };

  const categories: CategoryScore[] = categoryKeys.map((catKey) => {
    const catItems = items.filter((i) => i.category === catKey);
    const total = catItems.reduce((acc, curr) => acc + curr.points, 0);
    const earned = catItems.reduce((acc, curr) => acc + (curr.passed ? curr.points : 0), 0);
    return {
      id: catKey,
      titleVi: categoryNames[catKey].vi,
      titleEn: categoryNames[catKey].en,
      earned,
      total,
    };
  });

  // Rating bands
  let ratingVi = '';
  let ratingEn = '';
  let ratingColor = '';
  let ratingBg = '';
  let summaryVi = '';
  let summaryEn = '';

  if (score >= 90) {
    ratingVi = 'Xuất sắc • Chuẩn ATS Tối Ưu';
    ratingEn = 'Exceptional • ATS Ready';
    ratingColor = 'text-emerald-400';
    ratingBg = 'bg-emerald-500/10 border-emerald-500/30';
    summaryVi = 'Hồ sơ của bạn đã hoàn thiện ở mức tối đa, đầy đủ số liệu định lượng và sẵn sàng gây ấn tượng với các nhà tuyển dụng công nghệ khắt khe nhất!';
    summaryEn = 'Your CV is fully optimized with high-impact quantifiable metrics and ready to pass any ATS filter and impress top tech recruiters!';
  } else if (score >= 75) {
    ratingVi = 'Rất tốt • Đạt chuẩn tuyển dụng';
    ratingEn = 'Very Good • Recruiter Ready';
    ratingColor = 'text-cyan-400';
    ratingBg = 'bg-cyan-500/10 border-cyan-500/30';
    summaryVi = 'Hồ sơ đạt chất lượng cao! Hãy hoàn thiện nốt 1-2 tiêu chí còn thiếu để đạt điểm số tuyệt đối 100/100.';
    summaryEn = 'High quality resume! Complete the remaining 1-2 pending items to reach the perfect 100/100 score.';
  } else if (score >= 50) {
    ratingVi = 'Khá • Cần bổ sung thêm số liệu';
    ratingEn = 'Moderate • Needs Metrics & Polish';
    ratingColor = 'text-amber-400';
    ratingBg = 'bg-amber-500/10 border-amber-500/30';
    summaryVi = 'Nền tảng hồ sơ khá tốt, nhưng cần bổ sung thêm số liệu định lượng (Google XYZ formula) và thông tin liên hệ để tăng tỷ lệ phản hồi.';
    summaryEn = 'Decent foundation, but needs more quantifiable metrics (Google XYZ formula) and complete links to maximize interview callback rates.';
  } else {
    ratingVi = 'Chưa hoàn thiện • Cần bổ sung';
    ratingEn = 'Incomplete • Action Required';
    ratingColor = 'text-rose-400';
    ratingBg = 'bg-rose-500/10 border-rose-500/30';
    summaryVi = 'Hồ sơ còn thiếu các thông tin cơ bản hoặc chưa đủ số mốc kinh nghiệm/kỹ năng để cạnh tranh hiệu quả.';
    summaryEn = 'Missing essential contact info or insufficient experience/skill milestones to compete effectively.';
  }

  const passedCount = items.filter((i) => i.passed).length;

  return {
    score,
    ratingVi,
    ratingEn,
    ratingColor,
    ratingBg,
    summaryVi,
    summaryEn,
    items,
    categories,
    passedCount,
    totalCount: items.length,
  };
}
