'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  ArrowRight,
  FileText,
  PieChart,
  Info,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { LinkButton } from '@/components/ui/Button';
import { calcPricing, DEFAULT_CALC_INPUT, type CalcInput } from '@/lib/pricing';
import { cn, formatCurrency } from '@/lib/utils';

export function CalculatorShell() {
  const t = useTranslations('calculator');
  const [input, setInput] = useState<CalcInput>({ ...DEFAULT_CALC_INPUT });

  const result = useMemo(() => calcPricing(input), [input]);

  function setField<K extends keyof CalcInput>(key: K, value: CalcInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const insuranceItem = result.items.find((i) => i.key === 'insurance');
  const subtotalItem = result.items.find((i) => i.key === 'subtotal');
  const platformItem = result.items.find((i) => i.key === 'platform');
  const totalItem = result.items.find((i) => i.key === 'total');

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="calc-supplier">{t('form.supplierPrice')}</Label>
            <p className="text-xs text-muted-foreground mb-2">{t('form.supplierPriceHint')}</p>
            <div className="relative">
              <span className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold font-mono">
              ¥
              </span>
              <Input
                id="calc-supplier"
                type="number"
                min={0}
                inputMode="decimal"
                className="ps-8 font-mono tabular-nums text-lg h-12"
                value={input.supplierPriceRMB}
                onChange={(e) => setField('supplierPriceRMB', Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="calc-qty">{t('form.quantity')}</Label>
              <Input
                id="calc-qty"
                type="number"
                min={1}
                inputMode="numeric"
                className="font-mono tabular-nums h-11"
                value={input.quantity}
                onChange={(e) => setField('quantity', Number(e.target.value || 1))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calc-weight">{t('form.weightKg')}</Label>
              <p className="text-xs text-muted-foreground mb-1">{t('form.weightKgHint')}</p>
              <Input
                id="calc-weight"
                type="number"
                min={0}
                inputMode="decimal"
                className="font-mono tabular-nums h-11"
                value={input.weightKg}
                onChange={(e) => setField('weightKg', Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="calc-shipping">{t('form.shippingRateKgRMB')}</Label>
            <p className="text-xs text-muted-foreground mb-2">{t('form.shippingRateKgRMBHint')}</p>
            <div className="relative">
              <span className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold font-mono">
                ¥
              </span>
              <Input
                id="calc-shipping"
                type="number"
                min={0}
                inputMode="decimal"
                className="ps-8 font-mono tabular-nums h-11"
                value={input.shippingPerKgRMB}
                onChange={(e) => setField('shippingPerKgRMB', Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <Label htmlFor="calc-insurance" className="!mb-0 cursor-pointer">
                  {t('form.insurance')}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground">{t('form.insuranceHint')}</p>
            </div>
            <Switch
              id="calc-insurance"
              checked={input.insurance}
              onCheckedChange={(v) => setField('insurance', v)}
            />
          </div>
          </CardContent>
        </Card>

        <Accordion type="single" defaultValue="breakdown">
          <AccordionItem value="breakdown">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('breakdown.title').split(' & ')[0]}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 font-mono tabular-nums text-sm">
                <BreakdownRow
                  label={t('breakdown.rows.supplier')}
                  value={formatCurrency(result.items[0].amountAED, 'AED')}
                />
                <BreakdownRow
                  label={t('breakdown.rows.shipping')}
                  value={formatCurrency(result.items[1].amountAED, 'AED')}
                />
                {insuranceItem && (
                  <BreakdownRow
                    label={t('breakdown.rows.insurance')}
                    value={formatCurrency(insuranceItem.amountAED, 'AED')}
                  />
                )}
                <BreakdownRow
                  label={t('breakdown.rows.subtotal')}
                  value={formatCurrency(subtotalItem?.amountAED ?? 0, 'AED')}
                  muted
                />
                <BreakdownRow
                  label={t('breakdown.rows.platform')}
                  value={formatCurrency(platformItem?.amountAED ?? 0, 'AED')}
                  tone="warn"
                />
                <BreakdownRow
                  label={t('breakdown.rows.total')}
                  value={formatCurrency(totalItem?.amountAED ?? 0, 'AED')}
                  strong
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="split">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                {t('breakdown.title').split(' & ')[1]}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 font-mono tabular-nums text-sm">
                <BreakdownRow
                  label={t('breakdown.rows.ownerNet')}
                  value={formatCurrency(result.platformSplit.ownerNetAED, 'AED')}
                />
                <BreakdownRow
                  label={t('breakdown.rows.silkRoad')}
                  value={formatCurrency(result.platformSplit.silkRoadAED, 'AED')}
                />
                <BreakdownRow
                  label={t('breakdown.rows.dev')}
                  value={formatCurrency(result.platformSplit.devAED, 'AED')}
                />
                <BreakdownRow
                  label={t('breakdown.rows.legal')}
                  value={formatCurrency(result.platformSplit.legalAED, 'AED')}
                />
                <BreakdownRow
                  label={t('breakdown.rows.platform')}
                  value={formatCurrency(result.platformSplit.totalPlatformFeeAED, 'AED')}
                  strong
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="rounded-2xl border border-border bg-muted/30 p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-6">
            {t('totals.fx')}
          </p>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-6">
        <div className="grid gap-4">
          <CurrencyCard
            variant="aed"
            title="AED"
            subtitle={t('totals.aed')}
            ringColor="ring-aed"
            amount={result.totals.AED}
          />
          <CurrencyCard
            variant="usd"
            title="USD"
            subtitle={t('totals.usd')}
            ringColor="ring-usd"
            amount={result.totals.USD}
          />
          <CurrencyCard
            variant="sar"
            title="SAR"
            subtitle={t('totals.sar')}
            ringColor="ring-sar"
            amount={result.totals.SAR}
          />
        </div>

        <Card className="bg-panda-black text-white border-foreground">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
              Sample tracking link
            </p>
            <LinkButton
              href="/track/AE123456789"
              size="lg"
              className="w-full bg-white text-panda-black hover:bg-white/92 justify-between"
            >
              Track AE123456789
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CurrencyCard({
  variant,
  title,
  subtitle,
  ringColor,
  amount,
}: {
  variant: 'aed' | 'usd' | 'sar';
  title: string;
  subtitle: string;
  ringColor: string;
  amount: number;
}) {
  const accent =
    variant === 'aed'
      ? 'text-[color:var(--color-aed)] bg-[color:var(--color-aed)]/10 ring-[color:var(--color-aed)]/20'
      : variant === 'usd'
        ? 'text-[color:var(--color-usd)] bg-[color:var(--color-usd)]/10 ring-[color:var(--color-usd)]/20'
        : 'text-[color:var(--color-sar)] bg-[color:var(--color-sar)]/10 ring-[color:var(--color-sar)]/20';
  const ring =
    variant === 'aed'
      ? 'ring-[color:var(--color-aed)]/30'
      : variant === 'usd'
        ? 'ring-[color:var(--color-usd)]/30'
        : 'ring-[color:var(--color-sar)]/30';
  return (
    <Card className={cn('ring-1', ring)}>
      <CardContent className="pt-6 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant={variant} className="ring-1">
            {title}
          </Badge>
          <div>
            <div className="font-mono text-2xl md:text-3xl font-semibold tabular-nums">
              {formatCurrency(amount, title as 'AED' | 'USD' | 'SAR')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          </div>
        </div>
        <div
          className={cn(
            'relative h-16 w-16 rounded-full ring-2',
            accent,
            'grid place-items-center',
          )}
        >
          <div
            className={cn(
              'absolute inset-1 rounded-full ring-1',
              ring,
              'opacity-60',
            )}
          />
          <span className="relative font-mono font-bold text-sm">{title[0]}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function BreakdownRow({
  label,
  value,
  muted,
  tone,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  tone?: 'warn';
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-2 px-2 rounded-xl',
        muted && 'bg-muted/40 px-3',
        tone === 'warn' && 'text-warning',
        strong && 'bg-muted/60 font-semibold border-t border-border mt-2',
      )}
    >
      <span
        className={cn(
          'text-[13px] font-sans tabular-nums normal-nums',
          muted ? 'text-muted-foreground' : tone === 'warn' ? '' : 'text-foreground/85',
        )}
      >
        {label}
      </span>
      <span className="font-sans">{value}</span>
    </div>
  );
}
