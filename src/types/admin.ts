export type AdminTab = 'profile' | 'projects' | 'timeline' | 'skills' | 'cv' | 'security';

export interface StatusMessage {
  text: string;
  type: 'success' | 'error';
}

export type PortfolioCountKey = 'projects' | 'timeline' | 'skills';
