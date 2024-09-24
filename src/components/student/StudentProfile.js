// src/components/student/studentProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { Container, Typography } from '@mui/material';

function StudentProfile() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Typography variant="h5">Загрузка профиля...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Профиль Студента
      </Typography>
      <Typography variant="body1">Имя: {user.firstName}</Typography>
      <Typography variant="body1">Фамилия: {user.lastName}</Typography>
      <Typography variant="body1">Номер зачётки: {user.gradeBookId}</Typography>
    </Container>
  );
}

export default StudentProfile;
