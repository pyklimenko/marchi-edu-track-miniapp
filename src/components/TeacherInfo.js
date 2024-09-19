import React, { useState, useEffect } from 'react';

function TeacherInfo() {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await fetch(`/api/user/find-by-tgId?tgId=${window.Telegram.WebApp.initDataUnsafe.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.type === 'teacher') {
            setTeacher(data);
          }
        }
      } catch (error) {
        console.error('Ошибка при получении информации о преподавателе:', error);
      }
    };

    fetchTeacher();
  }, []);

  if (!teacher) return null;

  return (
    <div>
      <h1>Информация о преподавателе</h1>
      <div>ID: {teacher.tgId}</div>
      <div>Имя: {teacher.firstName}</div>
      <div>Фамилия: {teacher.lastName}</div>
      <div>Кафедра: {teacher.department}</div>
    </div>
  );
}

export default TeacherInfo;
