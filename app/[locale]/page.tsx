import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  CircleDollarSign,
  Factory,
  Globe2,
  Landmark,
  PackageOpen,
  Scale,
  SearchCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { calcPricing, DEFAULT_CALC_INPUT } from '@/lib/pricing';
import { cn, formatCurrency } from '@/lib/utils';
import { TeaserForm } from '@/components/home/TeaserForm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations();
  const $home = await getTranslations('home');
  const locale = t('locale');

  const heroPreview = calcPricing(DEFAULT_CALC_INPUT);

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-panda-black noise-bg glow" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[700px] opacity-60"
          style={{
            background:
              'radial-gradient(900px 360px at 18% 20%, rgba(255,255,255,0.14), transparent 60%), radial-gradient(700px 360px at 82% 10%, rgba(34,197,94,0.06), transparent 60%)',
          }}
        />
        <div className="relative container-x pb-32 pt-24 md:pt-32 lg:pt-40">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-8">
              <Badge
                variant="outline"
                className="border-white/15 bg-white/5 text-white/90 backdrop-blur"
              >
                <BadgeCheck className="mr-1.5 h-3.5 w-3.5 text-success" />
                {$home('hero.eyebrow')}
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-[450] leading-[1.02] tracking-tight">
                <span className="block font-display italic opacity-90">
                  {$home('hero.titleLine1')}
                </span>
                <span className="block">{$home('hero.titleLine2')}.</span>
              </h1>
              <p className="max-w-2xl text-base md:text-lg leading-8 text-white/75">
                {$home('hero.subtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <LinkButton
                  href={`/${locale}/calculator`}
                  size="lg"
                  className="bg-white text-panda-black hover:bg-white/92 shadow-[0_18px_60px_-20px_rgba(255,255,255,0.35)]"
                >
                  <Calculator className="h-5 w-5" />
                  {$home('hero.ctaPrimary')}
                  <ArrowRight className="h-4.5 w-4.5" />
                </LinkButton>
                <LinkButton
                  href={`/${locale}/track/AE123456789`}
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <SearchCheck className="h-5 w-5" />
                  {$home('hero.ctaSecondary')}
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative -rotate-1 transform-gpu">
                <Card className="border-white/10 bg-panda-black/40 backdrop-blur-xl text-white shadow-hero ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-4 p-6 pb-4">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-white/50">
                        {$home('hero.previewLabel')}
                      </div>
                      <div className="mt-1 font-mono text-xl font-semibold tabular-nums">
                        {$home('hero.previewOrderId')}
                      </div>
                      <div className="mt-3">
                        <Badge variant="warning" className="ring-amber-400/20">
                          {$home('hero.previewStage')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-widest text-white/50">
                        Order Value
                      </div>
                      <div className="mt-1 text-3xl font-semibold font-mono tabular-nums text-white">
                        {$home('hero.previewValue')}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <ol className="grid grid-cols-7 gap-1.5">
                      {['P', 'A', 'R', 'I', 'K', 'S', 'D'].map((k, i) => {
                        const done = i <= 1;
                        const active = i === 2;
                        const stageLabel =
                          k === 'P' ? 'Pending' :
                          k === 'A' ? 'Approved' :
                          k === 'R' ? 'Procured' :
                          k === 'I' ? 'Inspected' :
                          k === 'K' ? 'Packaged' :
                          k === 'S' ? 'Shipped' : 'Delivered';
                        return (
                          <li
                            key={k}
                            className={cn(
                              'grid aspect-square place-items-center rounded-lg text-[11px] font-bold transition-all',
                              done
                                ? 'bg-success/15 text-success ring-1 ring-success/30'
                                : active
                                  ? 'bg-warning/15 text-warning ring-1 ring-warning/40 animate-pulse-soft'
                                  : 'bg-white/5 text-white/40 ring-1 ring-white/10',
                            )}
                            title={stageLabel}
                            aria-label={stageLabel}
                          >
                            {k}
                          </li>
                        );
                      })}
                    </ol>
                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Sample 1,500 RMB →</span>
                        <span className="font-mono font-semibold tabular-nums text-success">
                          {formatCurrency(
                            calcPricing({ ...DEFAULT_CALC_INPUT, supplierPriceRMB: 1500 }).totals.AED,
                            'AED',
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
                <div
                  className="absolute -inset-6 -z-10 rounded-[2rem] blur-3xl"
                  style={{
                    background:
                      'radial-gradient(closest-side, rgba(34,197,94,0.14), transparent 70%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 border-t border-border/60">
        <div className="container-x py-24 md:py-28">
          <SectionHeader
            eyebrow="3 guarantees"
            title={$home('benefits.title')}
            subtitle={$home('benefits.subtitle')}
          />
          <div className="grid gap-6 md:grid-cols-3 mt-14">
            <BenefitCard
              tone="success"
              icon={<SearchCheck />}
              title={$home('benefits.items.0.title')}
              description={$home('benefits.items.0.description')}
            />
            <BenefitCard
              tone="primary"
              icon={<CircleDollarSign />}
              title={$home('benefits.items.1.title')}
              description={$home('benefits.items.1.description')}
            />
            <BenefitCard
              tone="neutral"
              icon={<ShieldCheck />}
              title={$home('benefits.items.2.title')}
              description={$home('benefits.items.2.description')}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-24 md:py-28">
          <SectionHeader
            eyebrow="Simple workflow"
            title={$home('howItWorks.title')}
            subtitle={$home('howItWorks.subtitle')}
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3 relative">
            <div
              aria-hidden
              className="hidden md:block absolute top-10 start-[17%] end-[17%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />
            <StepCard
              number="01"
              icon={<Factory />}
              title={$home('howItWorks.steps.0.title')}
              description={$home('howItWorks.steps.0.description')}
            />
            <StepCard
              number="02"
              icon={<PackageOpen />}
              title={$home('howItWorks.steps.1.title')}
              description={$home('howItWorks.steps.1.description')}
            />
            <StepCard
              number="03"
              icon={<Truck />}
              title={$home('howItWorks.steps.2.title')}
              description={$home('howItWorks.steps.2.description')}
            />
          </div>
        </div>
      </section>

      <section className="bg-panda-black text-white noise-bg relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(700px 360px at 10% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(700px 360px at 90% 80%, rgba(34,197,94,0.08), transparent 60%)',
          }}
        />
        <div className="relative container-x py-24 md:py-28 grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <Badge
              variant="outline"
              className="border-white/15 bg-white/5 text-white/90"
            >
              <Calculator className="mr-1.5 h-3.5 w-3.5" /> Live demo
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
              {$home('teaser.title')}
            </h2>
            <p className="text-white/75 max-w-md leading-7">
              {$home('teaser.subtitle')}
            </p>
            <LinkButton
              href={`/${locale}/calculator`}
              size="lg"
              className="bg-white text-panda-black hover:bg-white/92 shadow-[0_18px_60px_-20px_rgba(255,255,255,0.3)]"
            >
              {$home('teaser.cta')} <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
          <div className="lg:col-span-3">
            <Card className="border-white/10 bg-white/5 backdrop-blur text-white ring-1 ring-white/10">
              <TeaserForm
                previewAED={heroPreview.totals.AED}
                locale={locale as string}
                label={$home('teaser.label')}
                placeholder={$home('teaser.placeholder')}
                resultLabel={$home('teaser.resultLabel')}
                rowSupplier="Supplier"
                rowShipping="Shipping"
                rowPlatform="Platform Fee (10%)"
                inclFeesLabel="incl. fees"
              />
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="container-x py-12 md:py-14">
          <div className="grid gap-6 text-sm text-muted-foreground md:grid-cols-4 items-center">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground">
                <Landmark />
              </div>
              RAKEZ Free Zone, UAE
            </div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground">
                <Scale />
              </div>
              3 Trade Licenses
            </div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground">
                <Globe2 />
              </div>
              bandachao.com
            </div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground">
                <BadgeCheck />
              </div>
              <span className="font-mono tabular-nums">TRN 105281937000001</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl space-y-4">
      {eyebrow && (
        <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
          {eyebrow}
        </Badge>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1]">
        {title}
      </h2>
      <p className="text-muted-foreground text-base md:text-lg leading-8 max-w-xl">
        {subtitle}
      </p>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone: 'success' | 'primary' | 'neutral';
}) {
  const tones: Record<string, string> = {
    success:
      'text-success bg-success/10 ring-1 ring-success/15',
    primary:
      'text-primary bg-muted ring-1 ring-border',
    neutral:
      'text-foreground bg-muted ring-1 ring-border',
  };
  return (
    <Card className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-card">
      <div className="p-7 space-y-5">
        <div
          className={cn(
            'grid h-14 w-14 place-items-center rounded-2xl transition-transform group-hover:scale-[1.03]',
            tones[tone],
          )}
        >
          <span className="h-6 w-6">{icon}</span>
        </div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-7">{description}</p>
      </div>
    </Card>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="font-display text-7xl leading-none tracking-tight text-muted/60 -z-0 absolute -top-6 start-0 select-none">
            {number}
          </div>
          <div className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-soft">
            <span className="h-5 w-5">{icon}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-3">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-7">{description}</p>
      </div>
    </div>
  );
}
