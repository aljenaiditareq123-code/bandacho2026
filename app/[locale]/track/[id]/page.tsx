import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  Clock,
  FileCheck2,
  Package,
  SearchCheck,
  ShieldCheck,
  Truck,
  Home,
  Box,
  CheckCircle2,
  Circle,
  FileText,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  getOrderByTracking,
  ORDER_STAGES,
  requiredEvidenceTypesFor,
} from '@/lib/data';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STAGE_ICONS: Record<string, React.ReactNode> = {
  PENDING: <SearchCheck className="h-5 w-5" />,
  APPROVED: <FileCheck2 className="h-5 w-5" />,
  PROCURED: <Package className="h-5 w-5" />,
  INSPECTED: <ShieldCheck className="h-5 w-5" />,
  PACKAGED: <Box className="h-5 w-5" />,
  SHIPPED: <Truck className="h-5 w-5" />,
  DELIVERED: <Home className="h-5 w-5" />,
};

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('track');

  const order = await getOrderByTracking(id);

  if (!order) {
    return (
      <section className="container-x py-20 md:py-28 max-w-xl mx-auto text-center">
        <Card>
          <CardContent className="pt-8 pb-8 space-y-5">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-warning/10 text-warning ring-1 ring-warning/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl tracking-tight">
                {t('notFound').split('.')[0]}
              </h1>
              <p className="text-muted-foreground leading-7">
                {t('notFound')}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <LinkButton
                href={`/${locale}/track`}
                size="md"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4" />
                {id}
              </LinkButton>
              <LinkButton href={`/${locale}`} size="md">
                <Home className="h-4 w-4" />
                {t('badge.pending')}
              </LinkButton>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  const currentStage = (order.currentStage || 'PENDING') as (typeof ORDER_STAGES)[number];
  const currentIdx = ORDER_STAGES.indexOf(currentStage);

  const anyOrder = order as any;
  const customerName =
    anyOrder.customer?.profile?.fullName ||
    anyOrder.customerProfile?.fullName ||
    anyOrder.customer?.email ||
    '—';
  const firstItem = anyOrder.orderItems?.[0];
  const product = firstItem?.product;
  const productTitle =
    product?.titleAR || product?.titleZH || product?.titleEN || '—';
  const productCategory = product?.category || '—';

  return (
    <section className="container-x py-12 md:py-16 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <LinkButton
            href={`/${locale}/track`}
            variant="link"
            className="!p-0 text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Track
          </LinkButton>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            {t('milestones.title')}
          </h1>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="font-mono text-sm text-muted-foreground tabular-nums">
              #{id}
            </span>
            <Badge
              variant={currentIdx >= ORDER_STAGES.length - 1 ? 'success' : currentIdx >= 0 ? 'warning' : 'secondary'}
            >
              {t(`milestones.stages.${currentStage}`)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <ol className="relative space-y-1">
            {ORDER_STAGES.map((stage, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const statusKey = done ? 'completed' : active ? 'inProgress' : 'pending';
              const milestone = anyOrder.orderMilestones?.find(
                (m: any) => ORDER_STAGES[m.stageIndex ?? 0] === stage,
              );
              const completedAt = milestone?.completedAt;
              const evidenceTypes = requiredEvidenceTypesFor(stage);
              const evidencesUploaded = milestone?.evidences?.length ?? 0;

              return (
                <li
                  key={stage}
                  className={cn(
                    'relative ms-8 ps-8 pb-8 border-s-2 last:pb-0 last:border-transparent',
                    done ? 'border-success/40' : active ? 'border-warning/50' : 'border-border',
                  )}
                >
                  <div
                    className={cn(
                      'absolute start-0 top-0 -translate-x-1/2 grid h-10 w-10 place-items-center rounded-full ring-4 transition-all',
                      done
                        ? 'bg-success text-white ring-success/20 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]'
                        : active
                          ? 'bg-warning text-white ring-warning/30 animate-pulse-soft shadow-[0_0_0_8px_rgba(245,158,11,0.10)]'
                          : 'bg-card text-muted-foreground ring-border border border-border',
                    )}
                    aria-hidden
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : active ? (
                      STAGE_ICONS[stage] || <Clock className="h-5 w-5" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </div>

                  <Card className={cn(active && 'ring-1 ring-warning/20')}>
                    <CardContent className="pt-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold tracking-tight">
                              {t(`milestones.stages.${stage}`)}
                            </h3>
                            <Badge
                              variant={done ? 'success' : active ? 'warning' : 'secondary'}
                              className="text-[10px]"
                            >
                              {t(`badge.${statusKey}`)}
                            </Badge>
                          </div>
                          <div className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
                            Stage {i + 1} / {ORDER_STAGES.length} · {stage}
                          </div>
                        </div>
                        {completedAt && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDateTime(completedAt)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          {t('milestones.evidence')}
                          <span className="text-[10px] font-mono">
                            {evidencesUploaded > 0
                              ? `(${evidencesUploaded}/${evidenceTypes.length})`
                              : `(${evidenceTypes.length})`}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {evidenceTypes.map((ev) => (
                            <Badge key={ev} variant="secondary" className="gap-1.5">
                              <CheckCircle2
                                className={cn(
                                  'h-3 w-3',
                                  evidencesUploaded > 0 ? 'text-success' : 'text-muted-foreground/50',
                                )}
                              />
                              {ev}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24 self-start">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl tracking-tight">
                  {t('summary.title')}
                </h2>
                <Badge variant="outline" className="font-mono text-[11px]">
                  {id}
                </Badge>
              </div>

              <div className="space-y-4 border-t border-border pt-5 text-sm">
                <SummaryRow label={t('summary.tracking')} value={id} mono />
                <SummaryRow
                  label={t('summary.currentStage')}
                  value={t(`milestones.stages.${currentStage}`)}
                />
                <SummaryRow label={t('summary.product')} value={productTitle} />
                <SummaryRow label={t('summary.category')} value={productCategory} />
                <SummaryRow label={t('summary.customer')} value={customerName} />
                <SummaryRow
                  label={t('summary.date')}
                  value={formatDate(order.createdAt)}
                />
                <SummaryRow
                  label={t('summary.amount')}
                  value={formatCurrency(
                    Number(order.totalAmount ?? 0),
                    (order.currency as 'AED' | 'USD' | 'SAR') || 'AED',
                  )}
                  mono
                  strong
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            <LinkButton
              href={`/${locale}/calculator`}
              size="md"
              variant="outline"
              className="w-full justify-center"
            >
              {String.fromCharCode(0x2192)} Price Calculator
            </LinkButton>
            <LinkButton
              href={`/${locale}`}
              size="md"
              className="w-full justify-center bg-panda-black text-white hover:bg-panda-black/90"
            >
              <Home className="h-4 w-4" />
              Back Home
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  value,
  mono,
  strong,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">
        {label}
      </span>
      <span
        className={cn(
          'text-right max-w-[60%] break-words',
          mono && 'font-mono tabular-nums',
          strong ? 'font-semibold text-lg text-foreground' : 'text-foreground/85',
        )}
      >
        {value}
      </span>
    </div>
  );
}
