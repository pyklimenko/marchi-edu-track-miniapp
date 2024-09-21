// src/components/student/studentDashboard.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StudentProfile from './studentProfile';
import StudentCamera from './studentCamera';
import StudentStatistics from './studentStatistics';
import { Container, Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

function StudentDashboard() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Перенаправляем на нужный маршрут при изменении вкладки
    if (newValue === 0) navigate('profile');
    if (newValue === 1) navigate('camera');
    if (newValue === 2) navigate('statistics');
  };

  return (
    <Container maxWidth="md">
      {/* Вкладки с иконками */}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon tabs"
        centered
      >
        <Tab icon={<AccountCircleOutlinedIcon />} aria-label="profile" label="Profile" />
        <Tab icon={<CameraAltOutlinedIcon />} aria-label="camera" label="QR" />
        <Tab icon={<InsertChartOutlinedIcon />} aria-label="statistics" label="Statistics" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="profile" element={<StudentProfile />} />
        <Route path="camera" element={<StudentCamera />} />
        <Route path="statistics" element={<StudentStatistics />} />
      </Routes>
    </Container>
  );
}

export default StudentDashboard;
