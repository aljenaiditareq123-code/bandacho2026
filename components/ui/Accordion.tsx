'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AccordionValue = string | number;

interface RootCtxValue {
  type: 'single' | 'multiple';
  open: Set<AccordionValue>;
  toggle: (v: AccordionValue) => void;
}
const RootCtx = React.createContext<RootCtxValue | null>(null);

interface ItemCtxValue {
  value: AccordionValue;
  isOpen: boolean;
}
const ItemCtx = React.createContext<ItemCtxValue | null>(null);

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: {
  type?: 'single' | 'multiple';
  defaultValue?: AccordionValue | AccordionValue[];
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState<Set<AccordionValue>>(() => {
    if (defaultValue === undefined) return new Set();
    const arr = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    return new Set(arr);
  });
  const toggle = (v: AccordionValue) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else {
        if (type === 'single') next.clear();
        next.add(v);
      }
      return next;
    });
  };
  return (
    <RootCtx.Provider value={{ type, open, toggle }}>
      <div
        className={cn(
          'divide-y divide-border rounded-2xl border border-border overflow-hidden bg-card',
          className,
        )}
      >
        {children}
      </div>
    </RootCtx.Provider>
  );
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: AccordionValue;
  children: React.ReactNode;
  className?: string;
}) {
  const root = React.useContext(RootCtx);
  const isOpen = root ? root.open.has(value) : false;
  return (
    <ItemCtx.Provider value={{ value, isOpen }}>
      <div
        data-accordion-item
        data-value={String(value)}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn('bg-card', className)}
      >
        {children}
      </div>
    </ItemCtx.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = React.useContext(RootCtx);
  const item = React.useContext(ItemCtx);
  const isOpen = item?.isOpen ?? false;
  return (
    <button
      type="button"
      onClick={() => item && root && root.toggle(item.value)}
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      className={cn(
        'flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-sm font-medium transition-all hover:bg-muted/40 [&[data-state=open]>svg:last-child]:rotate-180',
        className,
      )}
    >
      <span className="flex-1 text-left start:text-left">{children}</span>
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground" />
    </button>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const item = React.useContext(ItemCtx);
  const isOpen = item?.isOpen ?? false;
  return (
    <div
      data-state={isOpen ? 'open' : 'closed'}
      className={cn(
        'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
        isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0',
        className,
      )}
    >
      <div className="px-5 pb-6 pt-0 text-sm text-foreground/85 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
