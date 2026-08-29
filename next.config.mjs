import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react', '@prisma/client'],
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
