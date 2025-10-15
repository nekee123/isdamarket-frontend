// IsdaMarket Design System - Fresh Coastal Theme

export const colors = {
  // Primary - Ocean Blues
  primary: {
    main: '#0891B2', // Cyan 600 - Main ocean blue
    light: '#06B6D4', // Cyan 500
    dark: '#0E7490', // Cyan 700
    lighter: '#67E8F9', // Cyan 300
  },
  
  // Secondary - Aqua/Teal
  secondary: {
    main: '#14B8A6', // Teal 500
    light: '#2DD4BF', // Teal 400
    dark: '#0F766E', // Teal 700
    lighter: '#5EEAD4', // Teal 300
  },
  
  // Accent - Coral/Orange (for CTAs)
  accent: {
    main: '#F97316', // Orange 500
    light: '#FB923C', // Orange 400
    dark: '#EA580C', // Orange 600
  },
  
  // Neutrals - Clean whites and grays
  neutral: {
    white: '#FFFFFF',
    lightest: '#F8FAFC', // Slate 50
    lighter: '#F1F5F9', // Slate 100
    light: '#E2E8F0', // Slate 200
    medium: '#94A3B8', // Slate 400
    dark: '#475569', // Slate 600
    darker: '#1E293B', // Slate 800
    darkest: '#0F172A', // Slate 900
  },
  
  // Semantic colors
  success: '#10B981', // Green 500
  warning: '#F59E0B', // Amber 500
  error: '#EF4444', // Red 500
  info: '#3B82F6', // Blue 500
};

export const gradients = {
  ocean: 'linear-gradient(135deg, #0891B2 0%, #14B8A6 100%)',
  oceanLight: 'linear-gradient(135deg, #67E8F9 0%, #5EEAD4 100%)',
  sunset: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
  sky: 'linear-gradient(180deg, #E0F2FE 0%, #FFFFFF 100%)',
  card: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ocean: '0 10px 30px -5px rgba(8, 145, 178, 0.3)',
  card: '0 4px 20px rgba(8, 145, 178, 0.08)',
};

export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
};

export const borderRadius = {
  sm: '0.375rem',  // 6px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component-specific styles
export const components = {
  button: {
    primary: {
      background: gradients.ocean,
      color: colors.neutral.white,
      padding: '0.75rem 2rem',
      borderRadius: borderRadius.full,
      fontWeight: typography.fontWeight.semibold,
      boxShadow: shadows.md,
      transition: transitions.base,
    },
    secondary: {
      background: 'transparent',
      color: colors.primary.main,
      border: `2px solid ${colors.primary.main}`,
      padding: '0.75rem 2rem',
      borderRadius: borderRadius.full,
      fontWeight: typography.fontWeight.semibold,
      transition: transitions.base,
    },
    accent: {
      background: gradients.sunset,
      color: colors.neutral.white,
      padding: '0.75rem 2rem',
      borderRadius: borderRadius.full,
      fontWeight: typography.fontWeight.semibold,
      boxShadow: shadows.md,
      transition: transitions.base,
    },
  },
  card: {
    background: colors.neutral.white,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.card,
    padding: spacing.xl,
    transition: transitions.base,
  },
  input: {
    background: colors.neutral.white,
    border: `2px solid ${colors.neutral.light}`,
    borderRadius: borderRadius.md,
    padding: '0.75rem 1rem',
    fontSize: typography.fontSize.base,
    transition: transitions.base,
  },
};

export default {
  colors,
  gradients,
  shadows,
  typography,
  spacing,
  borderRadius,
  transitions,
  breakpoints,
  components,
};
