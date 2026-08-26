'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales } from '@/src/i18n/request';

const LABELS: Record<string, string> = {
  en: 'EN',
  ar: 'العربية',
  zh: '中文',
};

export function LangSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function switchLocale(next: string) {
    const segments = pathname.split('/');
    if (segments[1] && locales.includes(segments[1] as (typeof locales)[number])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const target = segments.join('/') || `/${next}`;
    router.push(target);
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-black/90 transition-colors"
      >
        <span>{LABELS[locale]}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="absolute mt-2 min-w-[140px] overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/10 z-50">
          <div className="py-1">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLocale(l)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                  locale === l
                    ? 'bg-black/5 text-black font-medium'
                    : 'text-black/70 hover:bg-black/5 hover:text-black',
                )}
              >
                <span>{LABELS[l]}</span>
                {locale === l && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LangSwitcher;
