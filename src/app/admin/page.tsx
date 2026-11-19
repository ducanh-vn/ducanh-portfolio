import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPortfolioData } from '@/lib/data';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    redirect('/admin/login');
  }

  const data = getPortfolioData();

  return <AdminDashboardClient initialData={data} />;
}
