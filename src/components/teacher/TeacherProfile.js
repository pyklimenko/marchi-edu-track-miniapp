// src/components/teacher/TeacherProfile.js
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Box, Typography, Stack } from '@mui/material';
import SessionCard from '../common/SessionCard';

function TeacherProfile() {
  const { user } = useContext(UserContext);

  if (!user) return null;

  // Пример данных для карточек
  const classSessions = [
    {
      title: 'Предыдущая пара',
      topic: 'Введение в математический анализ',
      dateTime: '01.09.2024, 10:00 - 11:30',
      assignment: 'Прочитать главы 1-2 и решить упражнения 1.1-1.5',
      attendance: 'present',
    },
    {
      title: 'Текущая пара',
      topic: 'Линейная алгебра',
      dateTime: '02.09.2024, 12:00 - 13:30',
      assignment: 'Решить задачи 2.1-2.3 и подготовить презентацию',
      attendance: 'absent',
    },
    {
      title: 'Следующая пара',
      topic: 'Дифференциальные уравнения',
      dateTime: '03.09.2024, 14:00 - 15:30',
      assignment: 'Подготовить доклад по теме "Методы решения уравнений"',
      attendance: 'present',
    },
  ];

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>
        Профиль Преподавателя
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="body1">ID: {user.tgId}</Typography>
        <Typography variant="body1">Имя: {user.firstName}</Typography>
        <Typography variant="body1">Фамилия: {user.lastName}</Typography>
        <Typography variant="body1">Кафедра: {user.department}</Typography>
        {/* Добавьте дополнительную информацию по необходимости */}
      </Box>

      {/* Карточки с информацией о парах */}
      <Stack spacing={3}>
        {classSessions.map((session, index) => (
          <SessionCard
            key={index}
            title={session.title}
            topic={session.topic}
            dateTime={session.dateTime}
            assignment={session.assignment}
            attendance={session.attendance}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default TeacherProfile;
