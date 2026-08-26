import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  PackageOpen,
  Truck,
  CircleDollarSign,
  Coins,
  TrendingUp,
  TrendingDown,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { getDashboardKPIs, getOrdersList, ORDER_STAGES } from '@/lib/data';
import { getServerSession } from '@/lib/session-server';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('dashboard');

  const session = await getServerSession().catch(() => null);
  if (!session || !session.user || session.user.role !== 'PLATFORM_ADMIN') {
    redirect(`/${locale}/login`);
  }

  const [kpis, orders] = await Promise.all([getDashboardKPIs(), getOrdersList()]);

  const trends: Record<string, { pct: number; up: boolean }> = {
    totalOrders: { pct: 12, up: true },
    activeOrders: { pct: 8, up: true },
    revenue: { pct: 23, up: true },
    commissions: { pct: 7, up: true },
  };

  return (
    <section className="container-x py-12 md:py-16 space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {t('welcome')}
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight leading-tight">
            {t('title')}
          </h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t('kpis.totalOrders')}
          value={kpis.totalOrders.toLocaleString()}
          icon={<PackageOpen className="h-5 w-5" />}
          tone="primary"
          trend={trends.totalOrders}
        />
        <KPICard
          title={t('kpis.activeOrders')}
          value={kpis.activeOrders.toLocaleString()}
          icon={<Truck className="h-5 w-5" />}
          tone="warning"
          trend={trends.activeOrders}
        />
        <KPICard
          title={t('kpis.revenue')}
          value={formatCurrency(kpis.revenueTotalAED, 'AED')}
          icon={<CircleDollarSign className="h-5 w-5" />}
          tone="success"
          trend={trends.revenue}
        />
        <KPICard
          title={t('kpis.commissions')}
          value={formatCurrency(kpis.commissionsTotalAED, 'AED')}
          icon={<Coins className="h-5 w-5" />}
          tone="aed"
          trend={trends.commissions}
        />
      </div>

      <Card>
        <CardContent className="pt-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl tracking-tight">
              {t('orders.title')}
            </h2>
            <Badge variant="outline" title={t('stagesTooltip')}>
              7 {t('orders.cols.stages')}
            </Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('orders.cols.tracking')}</TableHead>
                <TableHead>{t('orders.cols.customer')}</TableHead>
                <TableHead>{t('orders.cols.product')}</TableHead>
                <TableHead>{t('orders.cols.amount')}</TableHead>
                <TableHead>{t('orders.cols.stage')}</TableHead>
                <TableHead>{t('orders.cols.payment')}</TableHead>
                <TableHead>{t('orders.cols.date')}</TableHead>
                <TableHead title={t('stagesTooltip')}>{t('orders.cols.stages')}</TableHead>
                <TableHead className="text-right">{t('orders.cols.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((orderRaw: any) => {
                  const order = orderRaw as any;
                  const currentStageIdx = ORDER_STAGES.indexOf(
                    (order.currentStage || 'PENDING') as (typeof ORDER_STAGES)[number],
                  );
                  const productName =
                    order.orderItems?.[0]?.product?.titleAR ||
                    order.orderItems?.[0]?.product?.titleZH ||
                    order.orderItems?.[0]?.product?.titleEN ||
                    '—';
                  const customerName =
                    order.customer?.profile?.fullName ||
                    order.customerProfile?.fullName ||
                    order.customer?.email ||
                    '—';
                  const paymentStatus =
                    order.paymentStatus || 'UNPAID';
                  const amount = Number(order.totalAmount ?? 0);
                  const currency = (order.currency as 'AED' | 'USD' | 'SAR') || 'AED';

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">
                        <LinkButton
                          href={`/${locale}/track/${order.trackingNumber || order.id}`}
                          variant="link"
                          className="font-mono"
                        >
                          {order.trackingNumber || order.id}
                        </LinkButton>
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {customerName}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {productName}
                      </TableCell>
                      <TableCell className="font-mono tabular-nums">
                        {formatCurrency(amount, currency)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            currentStageIdx >= ORDER_STAGES.length - 1
                              ? 'success'
                              : currentStageIdx >= 0
                                ? 'warning'
                                : 'secondary'
                          }
                        >
                          {order.currentStage || 'PENDING'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            paymentStatus === 'PAID' || paymentStatus === 'ESCROWED'
                              ? 'success'
                              : paymentStatus === 'REFUNDED'
                                ? 'danger'
                                : 'secondary'
                          }
                        >
                          {paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <StageDots currentIdx={currentStageIdx} />
                      </TableCell>
                      <TableCell className="text-right">
                        <LinkButton
                          href={`/${locale}/track/${order.trackingNumber || order.id}`}
                          size="sm"
                          variant="outline"
                          className="inline-flex"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {t('orders.view')}
                        </LinkButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}

function KPICard({
  title,
  value,
  icon,
  tone,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone: 'primary' | 'success' | 'warning' | 'aed';
  trend: { pct: number; up: boolean };
}) {
  const toneStyles: Record<string, string> = {
    primary: 'bg-muted text-foreground ring-border',
    success: 'bg-success/10 text-success ring-success/20',
    warning: 'bg-warning/10 text-warning ring-warning/20',
    aed: 'bg-[color:var(--color-aed)]/10 text-[color:var(--color-aed)] ring-[color:var(--color-aed)]/20',
  };
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl ring-1',
              toneStyles[tone],
            )}
          >
            {icon}
          </div>
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              trend.up
                ? 'bg-success/10 text-success ring-1 ring-success/20'
                : 'bg-danger/10 text-danger ring-1 ring-danger/20',
            )}
          >
            {trend.up ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            +{trend.pct}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1.5">{title}</div>
          <div className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
            {value}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StageDots({ currentIdx }: { currentIdx: number }) {
  return (
    <div
      className="inline-flex items-center gap-1"
      title={`Stage ${Math.max(0, currentIdx) + 1} / ${ORDER_STAGES.length}`}
    >
      {ORDER_STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <span
            key={stage}
            aria-label={`${stage}: ${done ? 'completed' : active ? 'active' : 'pending'}`}
            className={cn(
              'inline-block h-2.5 w-2.5 rounded-full transition-all',
              done
                ? 'bg-success'
                : active
                  ? 'bg-warning ring-2 ring-warning/30 animate-pulse-soft'
                  : 'bg-muted-foreground/20',
            )}
          />
        );
      })}
    </div>
  );
}
