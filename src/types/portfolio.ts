export interface ProfileData {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  status: string;
  bio: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  avatar: string;
  cvUrl: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  role: string;
  desc: string;
}

export interface ProjectFeature {
  title: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  num: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  badges: string[];
  liveDemo: string;
  github: string;
  features?: ProjectFeature[];
}

export interface PortfolioData {
  profile: ProfileData;
  skills: string[];
  timeline: TimelineItem[];
  projects: ProjectItem[];
}
