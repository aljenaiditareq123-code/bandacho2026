'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { calcPricing, DEFAULT_CALC_INPUT } from '@/lib/pricing';
import { cn, formatCurrency } from '@/lib/utils';

export type TeaserFormProps = {
  previewAED: number;
  locale: string;
  label: string;
  placeholder: string;
  resultLabel: string;
  rowSupplier: string;
  rowShipping: string;
  rowPlatform: string;
  inclFeesLabel: string;
};

export function TeaserForm({
  locale: _locale,
  label,
  placeholder,
  resultLabel,
  rowSupplier,
  rowShipping,
  rowPlatform,
  inclFeesLabel,
}: TeaserFormProps) {
  const [rmb, setRmb] = useState<number>(DEFAULT_CALC_INPUT.supplierPriceRMB);
  const result = useMemo(
    () => calcPricing({ ...DEFAULT_CALC_INPUT, supplierPriceRMB: rmb || 0 }),
    [rmb],
  );
  return (
    <div className="p-6 md:p-7 space-y-6">
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-3 space-y-3">
          <Label htmlFor="teaser-rmb" className="text-white/80">
            {label}
          </Label>
          <div className="relative">
            <span className="absolute start-4 top-1/2 -translate-y-1/2 text-white/60 font-semibold font-mono">
              ¥
            </span>
            <Input
              id="teaser-rmb"
              inputMode="decimal"
              type="number"
              min={0}
              className="!bg-white/5 !border-white/10 !text-white !placeholder:text-white/40 ps-8 font-mono tabular-nums text-lg h-12"
              value={rmb}
              onChange={(e: any) => setRmb(Number(e.target.value || 0))}
              placeholder={placeholder}
            />
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="text-xs uppercase tracking-widest text-white/50">
            {resultLabel}
          </div>
          <div className="h-12 rounded-xl border border-success/30 bg-success/10 px-4 flex items-center gap-2 font-mono text-2xl tabular-nums text-success">
            {formatCurrency(result.totals.AED, 'AED')}
            <span className="ml-auto text-[10px] uppercase tracking-widest text-success/70">
              {inclFeesLabel}
            </span>
          </div>
        </div>
      </div>
      <div className="grid gap-3 border-t border-white/10 pt-5 text-sm text-white/70 font-mono tabular-nums">
        <Row
          label={rowSupplier}
          value={formatCurrency(result.items[0].amountAED, 'AED')}
        />
        <Row
          label={rowShipping}
          value={formatCurrency(result.items[1].amountAED, 'AED')}
        />
        <Row
          label={rowPlatform}
          value={formatCurrency(result.platformSplit.totalPlatformFeeAED, 'AED')}
          tone="warn"
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'warn';
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4',
        tone === 'warn' && '!text-warning',
      )}
    >
      <span className="text-[13px] font-sans text-white/75 tabular-nums normal-nums font-normal">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
