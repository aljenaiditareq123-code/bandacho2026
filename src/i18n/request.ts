import { headers, cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

function hasLocale(candidates: readonly string[], value: unknown): value is Locale {
  return typeof value === 'string' && candidates.includes(value);
}

export default getRequestConfig(async (context) => {
  await headers();
  await cookies();

  const providedLocale = (context as { locale?: unknown }).locale;

  let resolved: Locale = defaultLocale;

  if (hasLocale(locales, providedLocale)) {
    resolved = providedLocale;
  } else {
    const cookieStore = await cookies();
    const headerStore = await headers();

    const fromCookie = cookieStore.get('NEXT_LOCALE')?.value;
    if (hasLocale(locales, fromCookie)) {
      resolved = fromCookie;
    } else {
      const acceptLang = headerStore.get('accept-language') ?? '';
      const lower = acceptLang.toLowerCase();
      const match = locales.find(
        (l) =>
          lower.startsWith(`${l.toLowerCase()}-`) ||
          lower
            .split(',')
            .some((p) => p.trim().toLowerCase().startsWith(l.toLowerCase())),
      );
      resolved = match ?? defaultLocale;
    }
  }

  if (!locales.includes(resolved)) notFound();

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
