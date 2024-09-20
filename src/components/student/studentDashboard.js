// src/components/student/StudentDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentProfile from './studentProfile';
import StudentCamera from './studentCamera';

function StudentDashboard() {
  return (
    <div>
      <h1>Студенческий Дашборд</h1>
      <nav>
        <Link to="profile">Профиль</Link>
        <Link to="camera">Камера</Link>
      </nav>
      <Routes>
        <Route path="profile" element={<StudentProfile />} />
        <Route path="camera" element={<StudentCamera />} />
        {/* Можно добавить другие маршруты */}
      </Routes>
    </div>
  );
}

export default StudentDashboard;
