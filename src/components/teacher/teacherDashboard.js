// src/components/teacher/teacherDashboard.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TeacherProfile from './teacherProfile';
import TeacherQRGenerator from './teacherQRGenerator';
import TeacherAttendance from './teacherAttendance';
import { Container, Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ListIcon from '@mui/icons-material/List';

function TeacherDashboard() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Перенаправляем на нужный маршрут при изменении вкладки
    if (newValue === 0) navigate('profile');
    if (newValue === 1) navigate('qr');
    if (newValue === 2) navigate('attendance');
  };

  return (
    <Container maxWidth="md">
      {/* Вкладки с иконками */}
      <Tabs value={value} onChange={handleChange} aria-label="icon tabs" centered>
        <Tab icon={<AccountCircleOutlinedIcon />} aria-label="profile" label="Profile" />
        <Tab icon={<CameraAltOutlinedIcon />} aria-label="qr" label="QR" />
        <Tab icon={<ListIcon />} aria-label="attendance" label="Attendance" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="qr" element={<TeacherQRGenerator />} />
        <Route path="attendance" element={<TeacherAttendance />} />
      </Routes>
    </Container>
  );
}

export default TeacherDashboard;
