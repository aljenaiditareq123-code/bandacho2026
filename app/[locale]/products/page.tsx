import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  Calculator,
  Factory,
  Store,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button, LinkButton } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { calcPricing, DEFAULT_CALC_INPUT } from '@/lib/pricing';
import { getProducts } from '@/lib/data';
import { cn, formatCurrency } from '@/lib/utils';

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('products');
  const tNav = await getTranslations('nav');
  const products = await getProducts();

  const RMB_TO_AED = Number(process.env.FX_RMB_TO_AED ?? 0.51);

  return (
    <section className="container-x py-16 md:py-24">
      <div className="max-w-3xl space-y-4 mb-12">
        <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
          Live Catalog
        </Badge>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.1]">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-8">
          {t('subtitle')}
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="pt-14 pb-14 text-center space-y-5">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted ring-1 ring-border">
              <Store className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <div className="font-display text-2xl tracking-tight mb-1">
                {t('empty')}
              </div>
              <p className="text-muted-foreground leading-7 max-w-md mx-auto">
                Try our pricing calculator in the meantime — it works with any supplier price.
              </p>
            </div>
            <LinkButton
              href={`/${locale}/calculator`}
              size="lg"
              className="bg-panda-black text-white hover:bg-panda-black/90"
            >
              <Calculator className="h-5 w-5" />
              {tNav('calculator')}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((pRaw: any, idx: number) => {
            const p = pRaw as any;
            const productId = p.id || `p-${idx}`;
            const seed = `${productId}-${idx}`;

            let supplierPriceRMB = Number(p.supplierPriceRMB ?? 0);
            if (!supplierPriceRMB || !Number.isFinite(supplierPriceRMB)) {
              supplierPriceRMB = (hashCode(seed) % 9000) + 500;
            }

            const pricing = calcPricing({
              ...DEFAULT_CALC_INPUT,
              supplierPriceRMB,
            });
            const aedDisplay = pricing.totals.AED;

            const titleAR = p.titleAR || p.titleEN || '—';
            const titleZH = p.titleZH || p.titleEN || '';
            const category = p.category || 'General';
            const supplierName =
              p.supplierProfile?.user?.fullName ||
              p.supplierProfile?.companyName ||
              p.entrepreneurProfile?.user?.fullName ||
              'BandaChao Supplier';

            const imgSrc = `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/480`;

            return (
              <Card
                key={productId}
                className="group overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={titleAR}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 pointer-events-none">
                    <Badge variant="outline" className="bg-white/85 backdrop-blur text-foreground">
                      {category}
                    </Badge>
                    <Badge variant="secondary" className="gap-1 bg-white/85 backdrop-blur">
                      <Factory className="h-3 w-3" />
                      {t('card.supplier')}
                    </Badge>
                  </div>
                </div>
                <CardContent className="pt-6 space-y-4 flex flex-col flex-1">
                  <div className="space-y-2 min-h-[96px]">
                    <div className="font-semibold tracking-tight leading-snug line-clamp-2">
                      {titleAR}
                    </div>
                    {titleZH && titleZH !== titleAR && (
                      <div className="text-sm text-muted-foreground leading-snug line-clamp-2">
                        {titleZH}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 text-xs border-t border-border pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">{t('card.supplier')}</span>
                      <span className="truncate max-w-[60%] text-foreground/85">
                        {supplierName}
                      </span>
                    </div>
                    {p.sku && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">{t('card.sku')}</span>
                        <span className="font-mono tabular-nums text-foreground/85">
                          {p.sku}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        Supplier (RMB)
                      </span>
                      <span className="font-mono tabular-nums text-foreground/85">
                        ¥{supplierPriceRMB.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-border pt-4 space-y-3">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                          Landed in AED
                        </div>
                        <div className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
                          {formatCurrency(aedDisplay, 'AED')}
                        </div>
                      </div>
                      <Badge variant="aed" className="text-[11px]">
                        incl. fees
                      </Badge>
                    </div>
                    <LinkButton
                      href={`/${locale}/calculator?s=${encodeURIComponent(String(supplierPriceRMB))}`}
                      size="md"
                      className="w-full justify-between bg-panda-black text-white hover:bg-panda-black/90"
                    >
                      <Calculator className="h-4 w-4" />
                      Open Calculator
                      <ArrowRight className="h-4 w-4" />
                    </LinkButton>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
