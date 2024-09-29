// src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StudentDashboard from './components/student/StudentDashboard';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import RegistrationForm from './components/RegistrationForm';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline'; // Импортируем CssBaseline

function App() {
  const [theme, setTheme] = useState(getTheme(window.Telegram?.WebApp?.themeParams || {}));

  useEffect(() => {
    const onThemeChanged = () => {
      const newThemeParams = window.Telegram.WebApp.themeParams;
      setTheme(getTheme(newThemeParams));
    };

    window.Telegram.WebApp.onEvent('themeChanged', onThemeChanged);

    return () => {
      window.Telegram.WebApp.offEvent('themeChanged', onThemeChanged);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Добавляем CssBaseline */}
      <div className="App">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />} />

          {/* Страницы для студентов */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Страницы для преподавателей */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Страница регистрации */}
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
