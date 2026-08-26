'use server';

import { redirect } from 'next/navigation';
import { destroySession, issueSession, verifyCredentials } from '@/lib/auth';

export type LoginResult =
  | { ok: true; redirect: string }
  | { ok: false; error: 'invalid' | 'generic'; message: string };

export async function loginAction(
  locale: string,
  formData: FormData,
): Promise<LoginResult> {
  try {
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');
    const redirectTo = String(formData.get('from') || `/${locale}/dashboard`).trim();

    if (!email || !password) {
      return {
        ok: false,
        error: 'invalid',
        message: 'Email and password are required.',
      };
    }

    const ok = await verifyCredentials(email, password);
    if (!ok) {
      return {
        ok: false,
        error: 'invalid',
        message: 'Invalid email or password.',
      };
    }

    await issueSession(email);
    return { ok: true, redirect: redirectTo };
  } catch (e: any) {
    return {
      ok: false,
      error: 'generic',
      message: e?.message || 'Login failed.',
    };
  }
}

export async function logoutAction(locale: string = 'en') {
  await destroySession();
  redirect(`/${locale}/login?loggedOut=1`);
}
