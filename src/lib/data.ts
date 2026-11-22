import fs from 'fs';
import path from 'path';
import type { PortfolioData } from '@/types/portfolio';
import { PORTFOLIO_BLOB_PATH } from '@/constants/storage';
import { hasBlobStore, readJsonBlob, writeJsonBlob } from '@/lib/storage';

/** Bundled seed data; also the store used in local development. */
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'portfolio.json');

function readLocalData(): PortfolioData {
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    if (hasBlobStore()) {
      const stored = await readJsonBlob<PortfolioData>(PORTFOLIO_BLOB_PATH);
      if (stored) return stored;
    }
    return readLocalData();
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    throw new Error('Failed to load portfolio data');
  }
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  try {
    if (hasBlobStore()) {
      await writeJsonBlob(PORTFOLIO_BLOB_PATH, data);
    } else {
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    }
    return true;
  } catch (error) {
    console.error('Error saving portfolio data:', error);
    return false;
  }
}
