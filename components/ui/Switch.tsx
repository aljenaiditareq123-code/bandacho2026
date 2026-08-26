'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(Boolean(defaultChecked));
    const isControlled = checked !== undefined;
    const on = isControlled ? Boolean(checked) : internal;

    const toggle = (next: boolean) => {
      if (!isControlled) setInternal(next);
      (onCheckedChange as unknown as ((v: boolean) => void) | undefined)?.(next);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => toggle(!on)}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          on ? 'bg-foreground' : 'bg-muted',
          className,
        )}
        data-state={on ? 'checked' : 'unchecked'}
      >
        <span
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-background shadow ring-0 transition-transform duration-200',
            on ? 'translate-x-5' : 'translate-x-0',
          )}
        />
        {/* hidden real checkbox for forms */}
        <input
          type="checkbox"
          className="hidden"
          checked={on}
          ref={ref}
          onChange={(e) => toggle(e.target.checked)}
          {...props}
        />
      </button>
    );
  },
);
Switch.displayName = 'Switch';
