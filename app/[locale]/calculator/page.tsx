import { getTranslations } from 'next-intl/server';
import { CalculatorShell } from '@/components/calculator/CalculatorShell';

export const dynamic = 'force-dynamic';

export default async function CalculatorPage() {
  const t = await getTranslations('calculator');
  return (
    <section className="container-x py-16 md:py-24">
      <div className="max-w-3xl space-y-4 mb-12">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.1]">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-8">
          {t('subtitle')}
        </p>
      </div>
      <CalculatorShell />
    </section>
  );
}
