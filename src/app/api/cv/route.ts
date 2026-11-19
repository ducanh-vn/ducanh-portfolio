import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getPortfolioData, savePortfolioData } from '@/lib/data';

const cvFilePath = path.join(process.cwd(), 'src', 'data', 'cv.json');

export async function GET() {
  try {
    if (fs.existsSync(cvFilePath)) {
      const data = JSON.parse(fs.readFileSync(cvFilePath, 'utf8'));
      return NextResponse.json({ success: true, cv: data });
    }

    // Fallback to portfolio data
    const portfolio = getPortfolioData();
    return NextResponse.json({ success: true, cv: null, portfolio });
  } catch (error) {
    console.error('Error reading CV data:', error);
    return NextResponse.json({ success: false, error: 'Failed to read CV data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cv, cvVi, cvEn, lang, template, accentColor, fontFamily, isCompact } = body;

    if (!cv) {
      return NextResponse.json({ success: false, error: 'Missing CV data' }, { status: 400 });
    }

    // Read existing to preserve any fields
    let existing: any = {};
    if (fs.existsSync(cvFilePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(cvFilePath, 'utf8'));
      } catch (e) {}
    }

    const payload = {
      ...existing,
      ...cv,
      lang: lang || 'vi',
      cvVi: cvVi || (lang === 'vi' ? cv : existing.cvVi || cv),
      cvEn: cvEn || (lang === 'en' ? cv : existing.cvEn || null),
      template: template || 'rabbit',
      accentColor: accentColor || 'blue',
      fontFamily: fontFamily || 'sans',
      isCompact: !!isCompact,
      updatedAt: new Date().toISOString(),
    };

    // Save to cv.json
    fs.writeFileSync(cvFilePath, JSON.stringify(payload, null, 2), 'utf8');

    // Also sync key profile, skills, timeline, projects back to portfolio.json
    try {
      const portfolio = getPortfolioData();
      const syncSource = lang === 'en' ? (cvVi || cv) : cv;
      if (syncSource.name) portfolio.profile.name = syncSource.name;
      if (syncSource.role) portfolio.profile.role = syncSource.role;
      if (syncSource.email) portfolio.profile.email = syncSource.email;
      if (syncSource.location) portfolio.profile.location = syncSource.location;
      if (syncSource.github) portfolio.profile.github = syncSource.github;
      if (syncSource.linkedin) portfolio.profile.linkedin = syncSource.linkedin;
      if (syncSource.summary) portfolio.profile.bio = syncSource.summary;
      if (Array.isArray(syncSource.skills)) portfolio.skills = syncSource.skills;
      if (Array.isArray(syncSource.timeline)) portfolio.timeline = syncSource.timeline;
      if (Array.isArray(syncSource.projects)) portfolio.projects = syncSource.projects;

      savePortfolioData(portfolio);
    } catch (e) {
      console.warn('Could not sync to portfolio.json:', e);
    }

    return NextResponse.json({ success: true, message: 'Đã lưu và cập nhật CV thành công!' });
  } catch (error) {
    console.error('Error saving CV data:', error);
    return NextResponse.json({ success: false, error: 'Không thể lưu file CV' }, { status: 500 });
  }
}
