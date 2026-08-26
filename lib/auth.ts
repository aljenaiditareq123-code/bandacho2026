import 'server-only';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export type BcSession = {
  user: {
    email: string;
    name: string;
    role: 'PLATFORM_ADMIN' | 'VISITOR';
  };
  issuedAt: number;
};

const COOKIE_NAME = 'bc_session';
const TTL_MS = 7 * 24 * 60 * 60 * 1_000; // 7 days

const SECRET_BYTES = (() => {
  const secret = process.env.SESSION_SECRET || 'dev-session-secret-change-me-pls-xx';
  return new TextEncoder().encode(secret);
})();

const FOUNDER = {
  email: process.env.FOUNDER_EMAIL || 'founder@bandachao.com',
  password: process.env.FOUNDER_PASSWORD || 'demo123',
  name: 'Founder',
};

export async function verifyCredentials(email: string, password: string) {
  if (!email || !password) return false;
  const emailOk = email.trim().toLowerCase() === FOUNDER.email.trim().toLowerCase();
  const passOk = password === FOUNDER.password;
  return emailOk && passOk;
}

export async function issueSession(email: string) {
  const token = await new SignJWT({
    user: { email, name: FOUNDER.name, role: 'PLATFORM_ADMIN' } as BcSession['user'],
  } satisfies Partial<BcSession>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_BYTES);

  const cookieStore = await cookies();
  await cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TTL_MS / 1_000,
  });
  return true;
}

export async function destroySession() {
  const cookieStore = await cookies();
  await cookieStore.delete(COOKIE_NAME);
  return true;
}

export async function readSession(): Promise<BcSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET_BYTES, {
      algorithms: ['HS256'],
    });
    const user = (payload as any).user;
    if (!user) return null;
    return {
      user,
      issuedAt: Number(payload.iat) * 1000,
    } as BcSession;
  } catch {
    return null;
  }
}

export const FOUNDER_INFO = { email: FOUNDER.email };
