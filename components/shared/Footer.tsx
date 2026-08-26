'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { FileBarChart, Sparkles, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const docs = useTranslations('docs.sections');
  const locale = useLocale();
  const p = (path: string) => `/${locale}${path}`;

  return (
    <footer
      className={cn(
        'relative border-t border-border bg-panda-white text-foreground',
        className,
      )}
    >
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          <div className="space-y-5 lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
                <Sparkles className="h-5 w-5" />
              </span>
              {t('legalName')}
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
              {t('tagline')}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 font-medium text-foreground/80">
                <Scale className="h-3.5 w-3.5 text-foreground/60" /> {t('trn')}
              </span>
              <span className="text-xs font-mono opacity-80">{t('licenses')}</span>
            </div>
          </div>

          <FooterCol
            title={t('columns.platform')}
            items={[
              { label: nav('home'), href: p('/') },
              { label: nav('calculator'), href: p('/calculator') },
              { label: nav('track'), href: p('/track') },
              { label: nav('products'), href: p('/products') },
              { label: nav('dashboard'), href: p('/dashboard') },
            ]}
          />
          <FooterCol
            title={t('columns.resources')}
            items={[
              { label: docs('placing.title'), href: p('/docs#placing') },
              { label: docs('milestones.title'), href: p('/docs#milestones') },
              { label: docs('fees.title'), href: p('/docs#fees') },
              { label: nav('login'), href: p('/login') },
            ]}
          />
          <FooterCol
            title={t('columns.company')}
            items={[
              { label: 'bandachao.com', href: 'https://bandachao.com', external: true },
              { label: t('legalName'), href: '#' },
              { label: 'RAKEZ Free Zone, UAE', href: '#' },
            ]}
          />
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {t('legalName')}. {t('rights')}
          </p>
          <p className="flex items-center gap-2 font-mono opacity-80">
            <FileBarChart className="h-3.5 w-3.5" /> Demo — build for acquirer preview.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold tracking-tight text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((it, idx) => (
          <li key={idx}>
            {it.external ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={it.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {it.label}
              </a>
            ) : (
              <Link
                href={it.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {it.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
