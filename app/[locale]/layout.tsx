import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import {
  Instrument_Serif,
  JetBrains_Mono,
  Geist,
} from 'next/font/google';
import { notFound } from 'next/navigation';
import { locales, type Locale, defaultLocale } from '@/src/i18n/request';
import { cn } from '@/lib/utils';
import '@/app/globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { getServerSession } from '@/lib/session-server';

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const runtime = 'nodejs';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://bandachao.com';
  return {
    metadataBase: new URL(url),
    title: {
      default: t('title'),
      template: `%s — BandaChao`,
    },
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: locale.replace('-', '_'),
      url,
      siteName: 'BandaChao',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${url}/en`,
        ar: `${url}/ar`,
        zh: `${url}/zh`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale === defaultLocale ? defaultLocale : (locale as Locale));
  const messages = await getMessages();

  const isRTL = locale === 'ar';
  const session = await getServerSession().catch(() => null);
  const authenticated = Boolean(session && session.user && session.user.role === 'PLATFORM_ADMIN');

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={cn(geist.variable, instrumentSerif.variable, jetbrains.variable)}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar authenticated={authenticated} locale={locale} />
          <main className="flex min-h-[calc(100dvh-4rem-1px)] flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
