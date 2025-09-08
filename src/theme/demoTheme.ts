import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#10b981', // emerald-500 for medical theme
      light: '#34d399', // emerald-400
      dark: '#047857', // emerald-700
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#3b82f6', // blue-500 for patient role
      light: '#60a5fa', // blue-400
      dark: '#1d4ed8', // blue-700
      contrastText: '#ffffff'
    },
    success: {
      main: '#22c55e', // green-500 for doctor role
      light: '#4ade80', // green-400
      dark: '#15803d', // green-700
      contrastText: '#ffffff'
    },
    warning: {
      main: '#f59e0b', // amber-500 for staff role
      light: '#fbbf24', // amber-400
      dark: '#d97706', // amber-600
      contrastText: '#ffffff'
    },
    info: {
      main: '#06b6d4', // cyan-500 for laboratory role
      light: '#22d3ee', // cyan-400
      dark: '#0891b2', // cyan-600
      contrastText: '#ffffff'
    },
    error: {
      main: '#ef4444', // red-500
      light: '#f87171', // red-400
      dark: '#dc2626', // red-600
      contrastText: '#ffffff'
    },
    text: {
      primary: '#1f2937', // gray-800
      secondary: '#6b7280', // gray-500
      disabled: '#9ca3af' // gray-400
    },
    background: {
      default: '#f9fafb', // gray-50
      paper: '#ffffff'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    divider: '#e5e7eb'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600
  },
  shape: {
    borderRadius: 8
  }
});

export default theme;