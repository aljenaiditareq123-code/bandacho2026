import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  ClipboardList,
  CreditCard,
  Gavel,
  Home,
  Package,
  PackageSearch,
  ShieldCheck,
  Truck,
  CircleDollarSign,
  Coins,
  Building2,
  Landmark,
  ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { ORDER_STAGES } from '@/lib/data';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const NAV_ITEMS = [
  {
    id: 'placing',
    kicker: 'kicker',
    title: 'title',
    icon: ClipboardList,
  },
  {
    id: 'milestones',
    kicker: 'kicker',
    title: 'title',
    icon: Package,
  },
  {
    id: 'fees',
    kicker: 'kicker',
    title: 'title',
    icon: CircleDollarSign,
  },
] as const;

const STAGE_ICONS_DOCS: Record<string, React.ReactNode> = {
  PENDING: <PackageSearch className="h-5 w-5" />,
  APPROVED: <BadgeCheck className="h-5 w-5" />,
  PROCURED: <CreditCard className="h-5 w-5" />,
  INSPECTED: <ShieldCheck className="h-5 w-5" />,
  PACKAGED: <Package className="h-5 w-5" />,
  SHIPPED: <Truck className="h-5 w-5" />,
  DELIVERED: <Home className="h-5 w-5" />,
};

const FEE_ICONS = [Coins, Building2, Gavel, Landmark];

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('docs');
  const ts = await getTranslations('docs.sections');

  return (
    <section className="container-x py-16 md:py-24">
      <div className="max-w-3xl space-y-4 mb-14">
        <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
          <BookOpen className="h-3 w-3 mr-1.5" />
          Documentation
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.1]">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-8">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav
            aria-label="Docs navigation"
            className="lg:sticky lg:top-24 space-y-1 p-1 rounded-2xl border border-border bg-muted/30"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={`/${locale}/docs#${item.id}`}
                  className="group flex items-start gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-card hover:shadow-soft"
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-card text-foreground ring-1 ring-border group-hover:ring-foreground/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {ts(`${item.id}.${item.kicker}`)}
                    </div>
                    <div className="font-medium leading-snug group-hover:text-foreground text-foreground/85">
                      {ts(`${item.id}.${item.title}`)}
                    </div>
                  </div>
                  <ArrowUpRight className="ms-auto h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-9 space-y-20">
          <section id="placing" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                {ts('placing.kicker')}
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight leading-[1.1]">
                {ts('placing.title')}
              </h2>
            </div>
            <ol className="grid gap-4 md:grid-cols-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className="group relative rounded-2xl border border-border bg-card p-5 md:p-6 shadow-soft transition-all hover:shadow-card"
                >
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="font-display text-4xl leading-none text-muted/60 select-none shrink-0 -z-0">
                      0{i + 1}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        <span className="font-semibold tracking-tight">
                          Step {i + 1}
                        </span>
                      </div>
                      <p className="text-foreground/85 leading-7 text-sm md:text-base">
                        {ts(`placing.steps.${i}`)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="milestones" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                {ts('milestones.kicker')}
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight leading-[1.1]">
                {ts('milestones.title')}
              </h2>
              <p className="text-muted-foreground text-base leading-8 max-w-2xl">
                {ts('milestones.intro')}
              </p>
            </div>
            <div className="grid gap-3">
              {ORDER_STAGES.map((stage, i) => {
                const tone =
                  i === 0
                    ? 'secondary'
                    : i === ORDER_STAGES.length - 1
                      ? 'success'
                      : i < 3
                        ? 'warning'
                        : 'outline';
                return (
                  <Card key={stage}>
                    <CardContent className="pt-5 flex items-start gap-4 md:gap-5">
                      <div
                        className={cn(
                          'grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1',
                          tone === 'success'
                            ? 'bg-success/10 text-success ring-success/20'
                            : tone === 'warning'
                              ? 'bg-warning/10 text-warning ring-warning/20'
                              : tone === 'secondary'
                                ? 'bg-muted text-foreground ring-border'
                                : 'bg-card text-foreground ring-border',
                        )}
                      >
                        {STAGE_ICONS_DOCS[stage]}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={tone as any} className="font-mono text-[11px]">
                            Stage {i + 1} · {stage}
                          </Badge>
                          <span className="font-semibold tracking-tight">
                            {ts(`milestones.stages.${i}.name`)}
                          </span>
                        </div>
                        <p className="text-sm md:text-[15px] text-foreground/80 leading-7">
                          {ts(`milestones.stages.${i}.desc`)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section id="fees" className="scroll-mt-24 space-y-6">
            <div className="space-y-2">
              <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
                {ts('fees.kicker')}
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight leading-[1.1]">
                {ts('fees.title')}
              </h2>
              <p className="text-muted-foreground text-base leading-8 max-w-2xl">
                {ts('fees.intro')}
              </p>
            </div>

            <Card>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead className="w-[140px]">Share</TableHead>
                      <TableHead>What it covers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[0, 1, 2, 3].map((i) => {
                      const row = ts.raw(`fees.rows.${i}`) as [string, string, string];
                      const Icon = FEE_ICONS[i];
                      const tone =
                        i === 0
                          ? 'text-success bg-success/10 ring-success/20'
                          : i === 1
                            ? 'text-warning bg-warning/10 ring-warning/20'
                            : i === 2
                              ? 'text-[color:var(--color-aed)] bg-[color:var(--color-aed)]/10 ring-[color:var(--color-aed)]/20'
                              : 'text-foreground bg-muted ring-border';
                      return (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1',
                                  tone,
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{row[0]}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {row[1]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground/80 leading-6">
                            {row[2]}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-foreground/10 bg-panda-black text-white p-6 md:p-7 relative overflow-hidden noise-bg">
              <FileSpreadsheet className="absolute end-5 top-5 h-12 w-12 text-white/10" />
              <div className="relative space-y-3 max-w-2xl">
                <div className="text-xs uppercase tracking-widest text-success">
                  Transparency Note
                </div>
                <p className="text-sm md:text-base leading-7 text-white/85">
                  {ts('fees.note')}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
