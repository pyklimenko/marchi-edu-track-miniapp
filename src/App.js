// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import StudentDashboard from './components/student/studentDashboard';
import TeacherDashboard from './components/teacher/teacherDashboard';
import RegistrationForm from './components/registrationForm';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
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
  );
}

export default App;
