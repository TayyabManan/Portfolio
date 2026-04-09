'use client';

import React, { useEffect, useState } from 'react';
import { themes } from '@/lib/themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const selectedTheme = themes.light;

    Object.entries(selectedTheme).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
