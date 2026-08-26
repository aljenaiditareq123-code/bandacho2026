import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none';

const variants: Record<Variant, string> = {
  default:
    'bg-foreground text-background shadow-soft hover:bg-foreground/92 hover:shadow-card active:scale-[0.985]',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-foreground/5',
  outline:
    'border border-border bg-background text-foreground hover:bg-secondary/60 hover:border-foreground/25',
  ghost: 'text-foreground hover:bg-foreground/5 hover:text-foreground',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/92',
  link: 'text-foreground underline-offset-4 hover:underline p-0 h-auto rounded-none',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-7 text-sm',
  icon: 'h-11 w-11 p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    return (
      <button ref={ref} className={classes} {...props}>
        {props.children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export function LinkButton({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <a
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </a>
  );
}
