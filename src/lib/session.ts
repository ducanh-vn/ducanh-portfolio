import { cookies } from 'next/headers';
import {
  PENDING_2FA_MAX_AGE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SESSION_VALUE,
} from '@/constants/auth';

/** Server-only: true when the request carries a valid admin session cookie. */
export function hasAdminSession(): boolean {
  const session = cookies().get(SESSION_COOKIE);
  return !!session && session.value === SESSION_VALUE;
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export const sessionCookieOptions = () => cookieOptions(SESSION_MAX_AGE);
export const pending2FACookieOptions = () => cookieOptions(PENDING_2FA_MAX_AGE);
