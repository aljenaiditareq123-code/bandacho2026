'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function TrackLandingClient() {
  const t = useTranslations('track');
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;
  const [value, setValue] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    router.push(`/${locale}/track/${encodeURIComponent(v)}`);
  };

  return (
    <section className="container-x py-16 md:py-24 max-w-3xl mx-auto">
      <div className="space-y-4 mb-10 text-center">
        <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.1]">
          {t('landingTitle')}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg leading-8">
          {t('landingSubtitle')}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <form onSubmit={submit} className="space-y-3">
            <Label htmlFor="track-id">{t('landingTitle')}</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="track-id"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={t('placeholder')}
                  className="ps-11 h-12 font-mono tabular-nums"
                />
              </div>
              <Button type="submit" size="lg" className="h-12">
                <Search className="h-4 w-4" />
                {t('search')}
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t('sampleHint')}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push(`/${locale}/track/AE123456789`)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AE123456789
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
