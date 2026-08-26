import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales } from '@/src/i18n/request';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localeMatch = pathname.match(/^\/(en|ar|zh)/);
  const locale = (localeMatch?.[1] as 'en' | 'ar' | 'zh') || defaultLocale;
  const isDashboard = new RegExp(`^/${locale}/dashboard`).test(pathname);

  if (isDashboard) {
    const cookie = request.cookies.get('bc_session')?.value;
    const hasSession = Boolean(cookie);
    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}
