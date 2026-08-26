import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/session-server';
import { LoginForm } from '@/components/auth/LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('login');

  const session = await getServerSession().catch(() => null);
  if (session && session.user && session.user.role === 'PLATFORM_ADMIN') {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-panda-black text-white noise-bg overflow-hidden flex-col justify-between p-12 xl:p-16">
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(800px 400px at 20% 20%, rgba(34,197,94,0.12), transparent 60%), radial-gradient(800px 400px at 80% 80%, rgba(255,255,255,0.08), transparent 60%)',
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-panda-black">
            <span className="font-display italic text-xl">B</span>
          </div>
          <div>
            <div className="font-display text-xl">BandaChao</div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
              Admin Portal
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div>
            <div className="text-xs uppercase tracking-widest text-success mb-4">
              RAKEZ FREE ZONE · UAE
            </div>
            <h2 className="font-display text-4xl xl:text-5xl leading-[1.1] tracking-tight">
              Licensed cross-border import operations —
              <span className="block italic opacity-90">all in one dashboard.</span>
            </h2>
          </div>
          <p className="text-white/70 leading-8 text-base">
            Track 7-stage milestones, review multi-currency settlements, manage
            commissions, and upload compliance evidence — from a single operator
            console.
          </p>
          <div className="grid gap-3 pt-2">
            {[
              '7-stage order tracking with evidence',
              'Multi-currency AED · USD · SAR pricing',
              'Transparent 10% platform fee split',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                <div className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success ring-1 ring-success/30">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          BandaChao FZ-LLC · TRN 105281937000001
        </div>
      </div>

      <div className="flex flex-col justify-center px-5 py-16 md:px-10 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="font-display text-3xl tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground text-base leading-7">{t('subtitle')}</p>
          </div>

          <LoginForm locale={locale} />

          <a
            href={`/${locale}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('backHome')}
          </a>
        </div>
      </div>
    </section>
  );
}
