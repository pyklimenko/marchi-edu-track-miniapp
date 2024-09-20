// src/components/teacher/teacherDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TeacherProfile from './teacherProfile';
import TeacherStatistics from './teacherStatistics';
import TeacherStudentsList from './teacherStudentsList';

function TeacherDashboard() {
  return (
    <div>
      <h1>Преподавательский Дашборд</h1>
      <nav>
        <ul>
          <li>
            <Link to="profile">Профиль</Link>
          </li>
          <li>
            <Link to="statistics">Статистика</Link>
          </li>
          <li>
            <Link to="students">Список Студентов</Link>
          </li>
          {/* Добавьте другие ссылки по необходимости */}
        </ul>
      </nav>
      <Routes>
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="statistics" element={<TeacherStatistics />} />
        <Route path="students" element={<TeacherStudentsList />} />
        {/* Добавьте другие маршруты по необходимости */}
      </Routes>
    </div>
  );
}

export default TeacherDashboard;
