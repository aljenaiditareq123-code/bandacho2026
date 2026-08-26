import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || 'Error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST();
}
