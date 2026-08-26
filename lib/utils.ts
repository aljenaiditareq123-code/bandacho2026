import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NUMBER_FORMATTERS: Record<string, Intl.NumberFormat> = {};

function getFormatter(currency: string, locale: string = 'en-US') {
  const key = `${currency}|${locale}`;
  if (!NUMBER_FORMATTERS[key]) {
    NUMBER_FORMATTERS[key] = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
  return NUMBER_FORMATTERS[key];
}

export function formatCurrency(
  amount: number | string | bigint,
  currency: 'AED' | 'USD' | 'SAR' | 'RMB' | 'CNY' = 'AED',
  locale: string = 'en-US',
) {
  const value = typeof amount === 'bigint' ? Number(amount) : Number(amount);
  if (!Number.isFinite(value)) return '—';

  const displayCurrency = currency === 'RMB' ? 'CNY' : currency;
  try {
    return getFormatter(displayCurrency, locale).format(value);
  } catch {
    const sym = { AED: 'AED ', USD: '$', SAR: 'SAR ', CNY: '¥' }[displayCurrency] ?? '';
    return `${sym}${value.toFixed(2)}`;
  }
}

export function formatNumber(value: number | bigint, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits }).format(
    typeof value === 'bigint' ? Number(value) : value,
  );
}

export function formatDate(
  iso: Date | string | null | undefined,
  locale: string = 'en-US',
): string {
  if (!iso) return '—';
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export function formatDateTime(
  iso: Date | string | null | undefined,
  locale: string = 'en-US',
): string {
  if (!iso) return '—';
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return d.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0621-\u064A\u4e00-\u9fff]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
