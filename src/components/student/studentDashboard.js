// src/components/student/studentDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import StudentProfile from './studentProfile';
import StudentCamera from './studentCamera';
import { Typography, Button, Container, Box } from '@mui/material';

function StudentDashboard() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Студенческий Дашборд
      </Typography>
      <nav>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '3px', // Отступ между кнопками
            padding: '0 5px', // Отступ слева и справа от границ окна
          }}
        >
          <Button component={Link} to="profile" variant="contained" sx={{ flex: 1 }}>
            Info
          </Button>
          <Button component={Link} to="camera" variant="contained" sx={{ flex: 1 }}>
            QR
          </Button>
        </Box>
      </nav>
      <Routes>
        <Route path="profile" element={<StudentProfile />} />
        <Route path="camera" element={<StudentCamera />} />
        {/* Можно добавить другие маршруты */}
      </Routes>
    </Container>
  );
}

export default StudentDashboard;
