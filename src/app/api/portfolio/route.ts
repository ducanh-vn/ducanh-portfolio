import { NextResponse } from 'next/server';
import { getPortfolioData, savePortfolioData } from '@/lib/data';
import { hasAdminSession } from '@/lib/session';

export async function GET() {
  try {
    const data = getPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check admin session cookie
    if (!hasAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedData = await request.json();
    const success = savePortfolioData(updatedData);

    if (success) {
      return NextResponse.json({ message: 'Saved successfully', data: updatedData });
    } else {
      return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
