'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'shop-theme';

export function useTheme(): { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    setThemeState(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, t);
      document.documentElement.classList.toggle('dark', t === 'dark');
    }
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return { theme, setTheme, toggle };
}
