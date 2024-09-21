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
        main: themeParams?.button_color || '#0088cc', // Цвет фона при наведении
        contrastText: themeParams?.button_text_color || '#ffffff',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: themeParams?.bg_color ? '#ffffff' : '#000000', // Цвет обводки
              },
              '&:hover fieldset': {
                borderColor: themeParams?.button_color || '#0088cc', // Цвет обводки при наведении
              },
              '&.Mui-focused fieldset': {
                borderColor: themeParams?.button_color || '#0088cc', // Цвет обводки при фокусе
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderColor: themeParams?.bg_color ? '#ffffff' : '#000000', // Цвет обводки для кнопок
            color: themeParams?.bg_color ? '#ffffff' : '#000000', // Цвет текста на кнопке
            '&:hover': {
              backgroundColor: themeParams?.button_color || '#0088cc', // Цвет фона при наведении
              color: themeParams?.button_text_color || '#ffffff', // Цвет текста при наведении
            },
          },
        },
      },
    },
  });
};
