export const themes = {
  light: {
    // Backgrounds — warm stone family
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#eff6ff',

    // Backgrounds
    background: '#fafaf9',
    backgroundSecondary: '#f5f5f4',
    backgroundTertiary: '#e7e5e4',

    // Text — warm stone, paired with background
    text: '#1c1917',
    textSecondary: '#57534e',
    textTertiary: '#78716c',

    // Borders
    border: '#d6d3d1',
    borderHover: '#a8a29e',

    // Status — functional only
    success: '#16a34a',
    error: '#dc2626',
    warning: '#d97706',

    // Aliases (for backward compatibility — consolidate later)
    accent: '#16a34a',
    info: '#2563eb',
    highlight: '#d97706',

    // Hero background (same as base — no special gradient)
    heroBackground: '#fafaf9',
    heroGradientStart: '#eff6ff',
    heroGradientMid: '#fafaf9',
    heroGradientEnd: '#fafaf9',

    // Shadows — warm-tinted
    shadowSm: '0 1px 2px 0 rgb(28 25 23 / 0.05)',
    shadowMd: '0 4px 6px -1px rgb(28 25 23 / 0.07), 0 2px 4px -2px rgb(28 25 23 / 0.05)',
    shadowLg: '0 10px 15px -3px rgb(28 25 23 / 0.07), 0 4px 6px -4px rgb(28 25 23 / 0.05)',
  },

  dark: {
    // Accent — slightly lighter blue, legible on dark surfaces
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryLight: 'rgba(59, 130, 246, 0.15)',

    // Backgrounds — warm stone, lifted (library evening, not midnight)
    background: '#1c1917',
    backgroundSecondary: '#292524',
    backgroundTertiary: '#3b3835',

    // Text — warm off-whites
    text: '#edebe8',
    textSecondary: '#a8a29e',
    textTertiary: '#78716c',

    // Borders — warm stone, clearly visible
    border: '#3b3835',
    borderHover: '#57534e',

    // Status — lighter for dark backgrounds
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',

    // Aliases
    accent: '#4ade80',
    info: '#3b82f6',
    highlight: '#fbbf24',

    // Hero background
    heroBackground: '#1c1917',
    heroGradientStart: '#1c1917',
    heroGradientMid: '#1c1917',
    heroGradientEnd: '#1c1917',

    // Shadows — heavier on dark to create depth
    shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  },
} as const;

export type Theme = typeof themes.light;
export type ThemeKey = keyof typeof themes;
