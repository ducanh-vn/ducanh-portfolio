'use client';

import { useRouter } from 'next/navigation';
import { postAuth } from '@/lib/api';

export function useAdminLogout() {
  const router = useRouter();

  return async () => {
    await postAuth({ action: 'logout' });
    router.push('/admin/login');
    router.refresh();
  };
}
