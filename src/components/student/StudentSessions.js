import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import SessionCard from '../common/SessionCard';

function StudentSessions() {
  const { user } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/student/sessions?studentId=${user._id}`);
        const data = await response.json();

        if (response.ok) {
          const sessionsToDisplay = [];
          if (data.lastSession) sessionsToDisplay.push({ ...data.lastSession, title: 'Предыдущая пара' });
          if (data.currentSession) sessionsToDisplay.push({ ...data.currentSession, title: 'Текущая пара' });
          if (data.nextSession) sessionsToDisplay.push({ ...data.nextSession, title: 'Следующая пара' });

          setSessions(sessionsToDisplay);
        } else {
          console.error('Ошибка:', data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке сессий:', error);
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ padding: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (sessions.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Нет доступных занятий</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Ваши занятия
      </Typography>
      <Stack spacing={3}>
        {sessions.map((session, index) => (
          <SessionCard
            key={index}
            title={session.title}
            topic={session.topicTitle}
            dateTime={`${new Date(session.startDate).toLocaleString()} - ${new Date(
              new Date(session.startDate).getTime() + 90 * 60000
            ).toLocaleTimeString()}`}
            assignment={session.assignment || 'Нет задания'}
            attendance={session.attendanceStatus}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default StudentSessions;
