import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['better-sqlite3', '@prisma/client', 'iron-session'],
  outputFileTracingIncludes: {
    '/[locale]/track/[id]': ['./prisma/prisma/dev.db'],
    '/[locale]/dashboard': ['./prisma/prisma/dev.db'],
    '/[locale]/products': ['./prisma/prisma/dev.db'],
    '/api/auth/login': ['./prisma/prisma/dev.db'],
    '/api/auth/logout': ['./prisma/prisma/dev.db'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  transpilePackages: ['next-intl'],
  typescript: { ignoreBuildErrors: process.env.TS_IGNORE_BUILD_ERRORS === '1' },
  eslint: { ignoreDuringBuilds: process.env.ESLINT_IGNORE_BUILD === '1' },
};

export default withNextIntl(nextConfig);
