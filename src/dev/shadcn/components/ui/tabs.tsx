import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils.ts';

const Tabs = TabsPrimitive.Root;

type TabsVariant = 'segment' | 'card' | 'underline';

interface ListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: TabsVariant;
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  ListProps
>(({ className, variant = 'segment', ...props }, ref) => {
  const base =
    variant === 'card'
      ? 'inline-flex h-10 items-center gap-1 rounded-none bg-transparent p-0'
      : variant === 'underline'
      ? 'inline-flex h-10 items-center gap-6 bg-transparent p-0 text-muted-foreground'
      : 'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground';
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(base, className)}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

interface TriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  variant?: TabsVariant;
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TriggerProps
>(({ className, variant = 'segment', ...props }, ref) => {
  const base =
    variant === 'card'
      ? [
          'inline-flex items-center justify-center whitespace-nowrap rounded-t-md',
          'px-3 py-2 text-sm font-medium ring-offset-background transition-all',
          'border border-b-transparent bg-background',
          'data-[state=active]:bg-card data-[state=active]:text-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
        ].join(' ')
      : variant === 'underline'
      ? [
          'inline-flex items-center justify-center whitespace-nowrap rounded-none bg-transparent',
          'px-1 py-2 text-sm font-medium ring-offset-background transition-all',
          'border-b-2 border-transparent text-muted-foreground',
          'data-[state=active]:text-foreground data-[state=active]:border-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
        ].join(' ')
      : [
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
        ].join(' ');
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(base, className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

interface ContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  variant?: TabsVariant;
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  ContentProps
>(({ className, variant = 'segment', ...props }, ref) => {
  const base =
    variant === 'card'
      ? 'mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      : 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(base, className)}
      {...props}
    />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
