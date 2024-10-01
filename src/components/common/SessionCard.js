// src/components/common/SessionCard.js
import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Stack } from '@mui/material';

function SessionCard({
  title,
  topic,
  dateTime,
  assignment,
  attendance,
}) {
  const attendanceColors = {
    present: 'success',
    absent: 'error',
  };

  const attendanceLabels = {
    present: 'Присутствует',
    absent: 'Отсутствует',
  };

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        {/* Заголовок Карточки */}
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>

        {/* Тема Пары */}
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Тема пары:
          </Typography>
          <Typography variant="body1">{topic}</Typography>
        </Box>

        {/* Дата и Время */}
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Дата и время проведения:
          </Typography>
          <Typography variant="body1">{dateTime}</Typography>
        </Box>

        {/* Задание */}
        <Box sx={{ marginBottom: 1 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Задание:
          </Typography>
          <Typography variant="body1">{assignment}</Typography>
        </Box>

        {/* Отметка Присутствия/Отсутствия */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" color="text.secondary">
            Статус:
          </Typography>
          <Chip
            label={attendanceLabels[attendance]}
            color={attendanceColors[attendance]}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SessionCard;
