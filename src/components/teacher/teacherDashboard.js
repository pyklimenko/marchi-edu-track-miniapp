// teacherDashboard.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TeacherProfile from './teacherProfile';
import TeacherQRGenerator from './teacherQRGenerator';
import TeacherStatistics from './teacherStatistics';
import TeacherStudentsList from './teacherStudentsList';
import { Container, Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

function TeacherDashboard() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Перенаправляем на нужный маршрут при изменении вкладки
    if (newValue === 0) navigate('profile');
    if (newValue === 1) navigate('qr');
    if (newValue === 2) navigate('students');
    if (newValue === 3) navigate('statistics');
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
        <Tab icon={<CameraAltOutlinedIcon />} aria-label="qr" label="QR" />
        <Tab icon={<GroupsOutlinedIcon />} aria-label="students" label="Students" />
        <Tab icon={<InsertChartOutlinedIcon />} aria-label="statistics" label="Statistics" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="qr" element={<TeacherQRGenerator />} />
        <Route path="students" element={<TeacherStudentsList />} />
        <Route path="statistics" element={<TeacherStatistics />} />
      </Routes>
    </Container>
  );
}

export default TeacherDashboard;
