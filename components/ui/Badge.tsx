import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'aed' | 'usd' | 'sar' | 'rmb';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default:
    'border-transparent bg-foreground text-background',
  secondary:
    'border-transparent bg-muted text-muted-foreground',
  outline: 'text-foreground border-border',
  success:
    'border-transparent bg-success/10 text-success-foreground ring-1 ring-success/20',
  warning:
    'border-transparent bg-warning/10 text-warning-foreground ring-1 ring-warning/20',
  danger:
    'border-transparent bg-danger/10 text-danger-foreground ring-1 ring-danger/20',
  aed: 'border-transparent bg-[color:var(--color-aed)]/10 text-[color:var(--color-aed)] ring-1 ring-[color:var(--color-aed)]/20',
  usd: 'border-transparent bg-[color:var(--color-usd)]/10 text-[color:var(--color-usd)] ring-1 ring-[color:var(--color-usd)]/20',
  sar: 'border-transparent bg-[color:var(--color-sar)]/10 text-[color:var(--color-sar)] ring-1 ring-[color:var(--color-sar)]/20',
  rmb: 'border-transparent bg-[color:var(--color-rmb)]/10 text-[color:var(--color-rmb)] ring-1 ring-[color:var(--color-rmb)]/20',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
