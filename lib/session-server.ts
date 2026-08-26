import { cookies } from 'next/headers';
import { readSession } from '@/lib/auth';

export async function getServerSession(): Promise<ReturnType<typeof readSession>> {
  const cookieStore = await cookies();
  void cookieStore;
  return readSession();
}
