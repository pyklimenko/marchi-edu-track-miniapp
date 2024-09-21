// src/components/student/teacherDashboard.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TeacherProfile from './teacherProfile';
import TeacherStatistics from './teacherStatistics';
import TeacherStudentsList from './teacherStudentsList';
import { Typography, Button, Container, Box } from '@mui/material';

function TeacherDashboard() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Преподавательский Дашборд
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
          <Button component={Link} to="statistics" variant="contained" sx={{ flex: 1 }}>
            Stat
          </Button>
          <Button component={Link} to="students" variant="contained" sx={{ flex: 1 }}>
            List
          </Button>
        </Box>
      </nav>
      <Routes>
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="statistics" element={<TeacherStatistics />} />
        <Route path="students" element={<TeacherStudentsList />} />
        {/* Добавьте другие маршруты по необходимости */}
      </Routes>
    </Container>
  );
}

export default TeacherDashboard;
