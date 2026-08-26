'use client';

import { useActionState } from 'react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  BadgeCheck,
  KeyRound,
  Mail,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { loginAction, type LoginResult } from '@/lib/auth-actions';

type Props = {
  locale: string;
};

function safeAction(
  fn: (formData: FormData) => Promise<LoginResult>,
): (prev: LoginResult | null, payload: FormData) => Promise<LoginResult> {
  return async (_prev, formData) => {
    try {
      return await fn(formData);
    } catch (e: any) {
      return {
        ok: false,
        error: 'generic',
        message: e?.message || 'Login failed.',
      };
    }
  };
}

export function LoginForm({ locale }: Props) {
  const t = useTranslations('login');
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = loginAction.bind(null, locale);

  const [state, formAction, pending] = useActionState(
    safeAction(boundAction),
    null,
  );

  useEffect(() => {
    if (state && state.ok) {
      router.replace(state.redirect);
    }
  }, [state, router]);

  const errorMsg =
    state && !state.ok
      ? state.error === 'invalid'
        ? t('errors.invalid')
        : t('errors.generic')
      : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-5">
          <form
            ref={formRef}
            action={formAction}
            className="space-y-5"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">{t('email')}</Label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="ps-10 h-12"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">{t('password')}</Label>
              <div className="relative">
                <KeyRound className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="ps-10 h-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/5 text-danger px-4 py-3 text-sm"
              >
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="w-full h-12"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                t('submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-foreground/10 bg-muted/30">
        <CardContent className="pt-5 space-y-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-success" />
            <div className="text-sm font-semibold">{t('demoBoxTitle')}</div>
          </div>
          <p className="text-sm text-muted-foreground leading-6">
            {t('demoBoxBody')}
          </p>
          <div className="grid gap-2 rounded-xl border border-border bg-background p-4 font-mono text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Email</span>
              <span className="text-foreground tabular-nums">{t('demoEmail')}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Password</span>
              <span className="text-foreground tabular-nums">{t('demoPassword')}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
              const passwordInput = document.getElementById('login-password') as HTMLInputElement | null;
              if (emailInput) emailInput.value = t('demoEmail');
              if (passwordInput) passwordInput.value = t('demoPassword');
            }}
            className="text-xs text-foreground/70 hover:text-foreground underline underline-offset-4"
          >
            Fill demo credentials
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
