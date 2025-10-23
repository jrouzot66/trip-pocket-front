export const colors = {
  // Primary colors
  primary: '#3498db',
  primaryLight: '#5dade2',
  primaryDark: '#2980b9',
  
  // Secondary colors
  secondary: '#95a5a6',
  secondaryLight: '#bdc3c7',
  secondaryDark: '#7f8c8d',
  
  // Status colors
  success: '#27ae60',
  successLight: '#58d68d',
  successDark: '#1e8449',
  
  warning: '#f39c12',
  warningLight: '#f7dc6f',
  warningDark: '#d68910',
  
  danger: '#e74c3c',
  dangerLight: '#f1948a',
  dangerDark: '#c0392b',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd',
    500: '#6c757d',
    600: '#495057',
    700: '#343a40',
    800: '#212529',
    900: '#1a1a1a',
  },
  
  // Text colors
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    disabled: '#bdc3c7',
    inverse: '#ffffff',
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef',
  },
  
  // Border colors
  border: {
    light: '#e1e8ed',
    medium: '#bdc3c7',
    dark: '#95a5a6',
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
} as const;

export type ColorKey = keyof typeof colors;
export type GrayKey = keyof typeof colors.gray;
export type TextColorKey = keyof typeof colors.text;
export type BackgroundColorKey = keyof typeof colors.background;
export type BorderColorKey = keyof typeof colors.border;
export type ShadowColorKey = keyof typeof colors.shadow;
