import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/types/portfolio';

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
