import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: {
          DEFAULT: '#0D47A1',
          light: '#42A5F5',
          dark: '#01579B',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#28A745',
          light: '#81C784',
        },
        danger: '#E53935',
        warning: '#FF6F61',
        gold: '#C5A880',
        // Neutral Colors
        cream: '#F5F5F5',
        gray: {
          light: '#E0E0E0',
          medium: '#9E9E9E',
          dark: '#2C3E50',
        },
      },
      fontFamily: {
        heading: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['"Courier New"', 'monospace'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
        '5xl': '36px',
        '6xl': '48px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 2px 8px rgba(0, 0, 0, 0.08)',
        md: '0 2px 8px rgba(0, 0, 0, 0.08)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.1)',
        xl: '0 8px 24px rgba(0, 0, 0, 0.12)',
        '2xl': '0 16px 48px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        mobile: '375px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.3',
        normal: '1.5',
        relaxed: '1.6',
        loose: '1.7',
      },
      aspectRatio: {
        property: '16 / 9',
      },
    },
  },
  plugins: [],
};
export default config;
