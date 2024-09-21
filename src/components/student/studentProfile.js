// src/components/student/StudentProfile.js
import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';

function StudentProfile() {
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <div>
      <h2>Профиль Студента</h2>
      <div>Имя: {user.firstName}</div>
      <div>Фамилия: {user.lastName}</div>
      <div>Номер зачётки: {user.gradeBookId}</div>
      {/* Добавьте дополнительную информацию по необходимости */}
    </div>
  );
}

export default StudentProfile;
