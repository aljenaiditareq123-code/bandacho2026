import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
  showWordmark?: boolean;
}

export function Logo({
  variant = 'dark',
  className,
  showWordmark = true,
}: LogoProps) {
  const iconColor = variant === 'dark' ? 'text-white' : 'text-black';
  const textColor = variant === 'dark' ? 'text-white' : 'text-black';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-md',
          variant === 'dark' ? 'bg-white/10' : 'bg-black/5',
        )}
      >
        <Sparkles className={cn('h-5 w-5', iconColor)} />
      </div>
      {showWordmark && (
        <span
          className={cn(
            'font-display text-xl font-semibold tracking-tight',
            textColor,
          )}
        >
          BandaChao
        </span>
      )}
    </div>
  );
}

export default Logo;
