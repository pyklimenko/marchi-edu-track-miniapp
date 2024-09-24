// src/components/teacher/TeacherProfile.js
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

function TeacherProfile() {
  const { user } = useContext(UserContext);

  if (!user) return null;

  return (
    <div>
      <h2>Профиль Преподавателя</h2>
      <div>ID: {user.tgId}</div>
      <div>Имя: {user.firstName}</div>
      <div>Фамилия: {user.lastName}</div>
      <div>Кафедра: {user.department}</div>
      {/* Добавьте дополнительную информацию по необходимости */}
    </div>
  );
}

export default TeacherProfile;