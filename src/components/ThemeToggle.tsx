'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
  size?: 'sm' | 'default';
};

export function ThemeToggle({ className, size = 'default' }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size={size === 'sm' ? 'sm' : 'icon'}
        aria-label="Toggle theme"
        className={cn(
          'h-10 w-10 cursor-wait rounded-full border border-border/50 bg-card/80 text-muted-foreground',
          className,
        )}
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === 'sm' ? 'sm' : 'icon'}
      aria-label={`Activate ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'h-10 w-10 rounded-full border border-border/70 bg-card/70 text-foreground shadow-sm transition-colors hover:bg-card',
        'focus-visible:ring-2 focus-visible:ring-ring/60',
        className,
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

