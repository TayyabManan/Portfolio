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
  }
} as const;

export type Theme = typeof themes.light;
export type ThemeKey = keyof typeof themes;
