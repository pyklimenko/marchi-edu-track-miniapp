// theme.js
import { createTheme } from '@mui/material/styles';

// Функция для преобразования HEX-цвета в яркость
const getBrightness = (hexColor) => {
  const hex = hexColor.replace('#', '');

  // Разбиваем цвет на составляющие (R, G, B)
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Вычисляем яркость
  return (0.299 * r + 0.587 * g + 0.114 * b);
};

export const getTheme = (themeParams) => {
  const bgColor = themeParams?.bg_color || '#ffffff';
  const brightness = getBrightness(bgColor); // Вычисляем яркость
  // const isLightTheme = brightness > 128; // Определяем, светлая тема или тёмная
  const isLightTheme = true; // Временное решение

  return createTheme({
    palette: {
      mode: isLightTheme ? 'light' : 'dark', // Светлая или тёмная тема
      background: {
        default: isLightTheme ? '#ffffff' : '#000000',
        // default: bgColor,
      },
      text: {
        primary: isLightTheme ? '#000000' : '#ffffff', // Текст зависит от яркости
      },
      primary: {
        main: themeParams?.button_color || '#0088cc', // Бирюзовый цвет при наведении
        contrastText: themeParams?.button_text_color || '#ffffff',
      },
    },
    typography: {
      allVariants: {
        color: isLightTheme ? '#000000' : '#ffffff',
      },
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isLightTheme ? '#000000' : '#ffffff',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isLightTheme ? '#000000' : '#ffffff', // Черная обводка в светлой теме, белая в тёмной
              },
              '&:hover fieldset': {
                borderColor: themeParams?.button_color || '#0088cc', // Бирюзовая обводка при наведении
              },
              '&.Mui-focused fieldset': {
                borderColor: themeParams?.button_color || '#0088cc', // Бирюзовая обводка при фокусе
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderColor: isLightTheme ? '#000000' : '#ffffff', // Черная обводка в светлой теме, белая в тёмной
            color: isLightTheme ? '#000000' : '#ffffff', // Черный текст в светлой теме, белый в темной
            '&:hover': {
              backgroundColor: themeParams?.button_color || '#0088cc', // Бирюзовый фон при наведении
              color: themeParams?.button_text_color || '#ffffff', // Белый текст при наведении
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            color: isLightTheme ? '#000000' : '#ffffff',
          },
          indicator: {
            backgroundColor: themeParams?.button_color || '#0088cc',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            color: isLightTheme ? '#000000' : '#ffffff',
            '&.Mui-selected': {
              color: themeParams?.button_color || '#0088cc',
            },
          },
        },
      },
    },
  });
};
