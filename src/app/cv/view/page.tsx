import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { getPortfolioData } from '@/lib/data';
import CVBuilderClient from '@/components/CVBuilderClient';

export async function generateMetadata(): Promise<Metadata> {
  const cvPath = path.join(process.cwd(), 'src', 'data', 'cv.json');
  let name = 'Nguyễn Đức Anh';
  let role = 'Frontend & Fullstack Developer';
  let summary = 'Hồ sơ năng lực kỹ thuật số & CV trực tuyến của Nguyễn Đức Anh — Frontend & Fullstack Developer.';

  if (fs.existsSync(cvPath)) {
    try {
      const cv = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
      if (cv.name) name = cv.name;
      if (cv.role) role = cv.role;
      if (cv.summary) summary = cv.summary;
    } catch (e) {
      console.warn('Failed to parse cv.json for metadata:', e);
    }
  }

  const title = `${name} — ${role} (Online Digital CV)`;

  return {
    title,
    description: summary,
    openGraph: {
      title,
      description: summary,
      type: 'profile',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=700&q=80',
          width: 700,
          height: 700,
          alt: `${name} Profile Avatar`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description: summary,
    },
  };
}

export const revalidate = 0; // Always fresh

export default function CVPublicViewPage() {
  const portfolioData = getPortfolioData();

  return (
    <main className="min-h-screen bg-[#090D16]">
      <CVBuilderClient initialPortfolio={portfolioData} isPublicView={true} />
    </main>
  );
}
