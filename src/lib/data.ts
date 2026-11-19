import fs from 'fs';
import path from 'path';

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

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

export function getPortfolioData(): PortfolioData {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    throw new Error('Failed to load portfolio data');
  }
}

export function savePortfolioData(data: PortfolioData): boolean {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return false;
  }
}
