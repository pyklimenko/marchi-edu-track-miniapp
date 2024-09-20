// src/theme.js
import { createTheme } from '@mui/material/styles';

export const getTheme = (themeParams) => {
  return createTheme({
    palette: {
      mode: themeParams?.bg_color ? 'dark' : 'light',
      background: {
        default: themeParams?.bg_color || '#ffffff',
      },
      text: {
        primary: themeParams?.text_color || '#000000',
      },
      primary: {
        main: themeParams?.button_color || '#0088cc',
        contrastText: themeParams?.button_text_color || '#ffffff',
      },
      // Дополнительные настройки...
    },
  });
};
