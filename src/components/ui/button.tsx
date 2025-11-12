import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/70',
        destructive:
          'bg-destructive text-destructive-foreground shadow-md shadow-destructive/20 hover:bg-destructive/90 dark:bg-destructive/80 dark:hover:bg-destructive/70',
        outline:
          'border border-border/60 bg-transparent text-foreground hover:bg-primary/10 hover:text-primary dark:border-white/20 dark:text-white dark:hover:bg-white/10',
        secondary:
          'border border-border/60 bg-card/80 text-foreground hover:bg-card dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',
        ghost:
          'text-muted-foreground hover:text-foreground hover:bg-card/70 dark:text-white dark:hover:bg-white/10',
        link: 'text-primary underline-offset-4 hover:underline dark:text-primary/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-11 rounded-lg px-5 text-base',
        xl: 'h-12 rounded-xl px-6 text-base',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

export { buttonVariants };

