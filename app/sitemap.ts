import type { MetadataRoute } from 'next';

const LOCALES = ['en', 'ar', 'zh'] as const;
const PATHS = [
  '',
  '/calculator',
  '/track',
  '/track/AE123456789',
  '/products',
  '/docs',
  '/login',
  '/dashboard',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://bandachao.com';
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of PATHS) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path.startsWith('/track/') ? 'daily' : 'weekly',
        priority:
          path === ''
            ? 1
            : path === '/calculator' || path === '/track'
              ? 0.9
              : 0.7,
      });
    }
  }

  return entries;
}
