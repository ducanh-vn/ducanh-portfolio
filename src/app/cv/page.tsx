import React from 'react';
import { Metadata } from 'next';
import { getPortfolioData } from '@/lib/data';
import CVBuilderClient from '@/components/CVBuilderClient';

export const metadata: Metadata = {
  title: 'Nguyen Duc Anh — Curriculum Vitae & CV Studio',
  description: 'Trình tạo và xuất CV chuyên nghiệp của Nguyễn Đức Anh — Frontend & Fullstack Developer.',
};

export const revalidate = 0; // Always fresh

export default function CVPage() {
  const portfolioData = getPortfolioData();

  return <CVBuilderClient initialPortfolio={portfolioData} />;
}
