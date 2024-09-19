import React, { useState, useEffect } from 'react';

function StudentInfo() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/user/find-by-tgId?tgId=${window.Telegram.WebApp.initDataUnsafe.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.type === 'student') {
            setStudent(data);
          }
        }
      } catch (error) {
        console.error('Ошибка при получении информации о студенте:', error);
      }
    };

    fetchStudent();
  }, []);

  if (!student) return null;

  return (
    <div>
      <h1>Информация о студенте</h1>
      <div>ID: {student.tgId}</div>
      <div>Имя: {student.firstName}</div>
      <div>Фамилия: {student.lastName}</div>
      <div>Номер зачётки: {student.gradeBookId}</div>
    </div>
  );
}

export default StudentInfo;
