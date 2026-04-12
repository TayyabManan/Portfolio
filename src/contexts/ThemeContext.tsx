'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { themes, type ThemeKey } from '@/lib/themes';

type ThemePreference = ThemeKey | 'system';

interface ThemeContextValue {
  theme: ThemeKey;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  preference: 'system',
  setPreference: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(key: ThemeKey) {
  const root = document.documentElement;
  const selectedTheme = themes[key];

  Object.entries(selectedTheme).forEach(([k, value]) => {
    const cssVarName = `--${k.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });

  root.setAttribute('data-theme', key);
}

function getSystemTheme(): ThemeKey {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>('light');
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemePreference | null;
    if (saved === 'light' || saved === 'dark') {
      setPreferenceState(saved);
      setTheme(saved);
      applyTheme(saved);
    } else {
      setPreferenceState('system');
      const resolved = getSystemTheme();
      setTheme(resolved);
      applyTheme(resolved);
    }
    setMounted(true);
  }, []);

  // Listen for system preference changes when preference is 'system'
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (preference === 'system') {
        const next = e.matches ? 'dark' : 'light';
        setTheme(next);
        applyTheme(next);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    if (pref === 'system') {
      localStorage.removeItem('theme');
      const resolved = getSystemTheme();
      setTheme(resolved);
      applyTheme(resolved);
    } else {
      localStorage.setItem('theme', pref);
      setTheme(pref);
      applyTheme(pref);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    setPreference(next);
  }, [theme, setPreference]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
