import { redirect } from 'next/navigation';
import { getPortfolioData } from '@/lib/data';
import { hasAdminSession } from '@/lib/session';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!hasAdminSession()) {
    redirect('/admin/login');
  }

  const data = await getPortfolioData();

  return <AdminDashboardClient initialData={data} />;
}
