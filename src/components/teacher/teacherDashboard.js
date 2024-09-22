// src/components/teacher/teacherDashboard.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TeacherProfile from './teacherProfile';
import TeacherStatistics from './teacherStatistics';
import TeacherQRGenerator from './teacherQRGenerator';
import TeacherAttendance from './teacherAttendance';
import { Container, Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import ListIcon from '@mui/icons-material/List';

function TeacherDashboard() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Перенаправляем на нужный маршрут при изменении вкладки
    if (newValue === 0) navigate('profile');
    if (newValue === 1) navigate('attendance');
    if (newValue === 2) navigate('statistics');
    if (newValue === 3) navigate('qr');

  };

  return (
    <Container maxWidth="md">
      {/* Вкладки с иконками */}
      <Tabs value={value} onChange={handleChange} aria-label="icon tabs" centered>
        <Tab icon={<AccountCircleOutlinedIcon />} aria-label="profile" label="Profile" />
        <Tab icon={<ListIcon />} aria-label="attendance" label="Attendance" />
        <Tab icon={<InsertChartOutlinedIcon />} aria-label="statistics" label="Statistics" />
        <Tab icon={<CameraAltOutlinedIcon />} aria-label="qr" label="QR" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="statistics" element={<TeacherStatistics />} />
        <Route path="qr" element={<TeacherQRGenerator />} />
        <Route path="attendance" element={<TeacherAttendance />} />
      </Routes>
    </Container>
  );
}

export default TeacherDashboard;
