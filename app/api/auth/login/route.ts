import { NextResponse } from 'next/server';
import { issueSession, verifyCredentials } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string; redirect?: string };
    const email = (body.email || '').toString().trim();
    const password = (body.password || '').toString();
    const redirect = body.redirect || '/en/dashboard';

    if (!email || !password) {
      return NextResponse.json(
        { ok: false as const, error: 'invalid', message: 'Email and password required' },
        { status: 400 },
      );
    }
    const valid = await verifyCredentials(email, password);
    if (!valid) {
      return NextResponse.json(
        { ok: false as const, error: 'invalid', message: 'Invalid email or password' },
        { status: 401 },
      );
    }
    await issueSession(email);
    return NextResponse.json({ ok: true as const, redirect });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false as const, error: 'generic', message: e?.message || 'Error' },
      { status: 500 },
    );
  }
}
