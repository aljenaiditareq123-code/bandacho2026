'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Calculator,
  ChartColumnIncreasing,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Package,
  Sparkles,
  SearchCheck,
} from 'lucide-react';
import { cn, slugify } from '@/lib/utils';
import { Button, LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function Logo({ className }: { className?: string }) {
  const t = useTranslations('nav');
  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2 font-semibold tracking-tight',
        className,
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background transition-transform duration-200 group-hover:rotate-[-4deg]">
        <Sparkles className="h-5 w-5" />
      </span>
      <span className="text-lg">{t('brand')}</span>
    </Link>
  );
}

export function Navbar({
  authenticated = false,
  locale = 'en',
}: {
  authenticated?: boolean;
  locale?: string;
}) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const routeLocale = useLocale();
  const activeLocale = (routeLocale as string) || locale || 'en';

  const links = [
    { href: `/${activeLocale}/calculator`, label: t('calculator'), icon: Calculator },
    { href: `/${activeLocale}/track`, label: t('track'), icon: SearchCheck },
    { href: `/${activeLocale}/products`, label: t('products'), icon: Package },
    { href: `/${activeLocale}/docs`, label: t('docs'), icon: ClipboardList },
  ];

  const isActive = (href: string) => {
    const normalized = href.replace(/\/$/, '');
    const p = (pathname ?? '').replace(/\/$/, '');
    return normalized === p || (normalized.length > 4 && p.startsWith(normalized));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-panda-black/80 text-panda-white backdrop-blur-md supports-[backdrop-filter]:bg-panda-black/60">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo className="text-white" />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const Icon = l.icon;
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/75 hover:bg-white/8 hover:text-white',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          {authenticated ? (
            <>
              <LinkButton
                href={`/${activeLocale}/dashboard`}
                variant="outline"
                size="sm"
                className={cn(
                  'border-white/15 bg-white/5 text-white hover:bg-white/10',
                  isActive(`/${activeLocale}/dashboard`) && 'bg-white/15',
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard')}
              </LinkButton>
              <form
                action={`/${activeLocale}/login`}
                method="post"
                className="contents"
              >
                <input type="hidden" name="_action" value="logout" />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 text-panda-black hover:bg-white"
                  formAction={`/${activeLocale}/login`}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </Button>
              </form>
            </>
          ) : (
            <LinkButton
              href={`/${activeLocale}/login`}
              size="sm"
              variant="default"
              className="bg-white text-panda-black hover:bg-white/92"
            >
              <ChartColumnIncreasing className="h-4 w-4" />
              <span className="hidden sm:inline">{t('login')}</span>
              <span className="sm:hidden">{slugify(t('login')).slice(0, 3)}</span>
            </LinkButton>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="container-x flex gap-1 overflow-x-auto pb-3 pt-0 md:hidden">
        {links.map((l) => {
          const Icon = l.icon;
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium',
                active ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/8',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

export function MobileNavLinks() {
  return null;
}

export function LangSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const options = [
    { value: 'en', label: 'EN' },
    { value: 'ar', label: 'العربية' },
    { value: 'zh', label: '中文' },
  ];

  const switchTo = (newLocale: string) => {
    const current = pathname ?? `/${locale}`;
    const segments = current.split('/');
    // replace locale at index 1
    if (segments[1] && ['en', 'ar', 'zh'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const next = segments.join('/') || `/${newLocale}`;
    return next;
  };

  return (
    <div className="relative group">
      <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 p-1 text-white transition-colors hover:bg-white/8">
        {options.map((opt) => {
          const active = locale === opt.value;
          return (
            <Link
              key={opt.value}
              href={switchTo(opt.value)}
              prefetch={false}
              title={`${t('switchLang')}: ${opt.label}`}
              aria-pressed={active}
              className={cn(
                'rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors',
                active ? 'bg-white text-panda-black shadow-sm' : 'text-white/85 hover:text-white',
              )}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, 'success' | 'warning' | 'secondary' | 'danger'> = {
    DELIVERED: 'success',
    SHIPPED: 'success',
    PACKAGED: 'warning',
    INSPECTED: 'success',
    PROCURED: 'warning',
    APPROVED: 'warning',
    PENDING: 'secondary',
    CANCELLED: 'danger',
    REFUNDED: 'danger',
  };
  return <Badge variant={map[stage] || 'secondary'}>{stage}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, 'success' | 'warning' | 'secondary' | 'danger'> = {
    PAID: 'success',
    RELEASED: 'success',
    HELD: 'warning',
    PENDING: 'secondary',
    FAILED: 'danger',
    REFUNDED: 'danger',
  };
  return <Badge variant={map[status] || 'secondary'}>{status}</Badge>;
}

export function ListIcon() {
  return <ListChecks className="h-4 w-4" />;
}
