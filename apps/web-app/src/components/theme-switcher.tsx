'use client';

import { Button } from '@ts/uikit';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@ts/uikit-utils';

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [mounted, setMounted] = useState(false);
  const isDark = currentTheme === 'dark';

  useEffect(() => setMounted(true), []);

  if (!mounted) return <></>;

  return (
    <Button
      aria-label="theme-switcher"
      className={cn(
        'xl:w-10 xl:h-10 w-8 h-8 xl:p-2.5 p-2 mt-1 xl:mt-0 rounded-3xl',
        className
      )}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeSwitcher;
