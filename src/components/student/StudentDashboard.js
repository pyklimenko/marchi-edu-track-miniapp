// src/components/student/studentDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import StudentQRCheck from './StudentQRCheck';
import StudentStatistics from './StudentStatistics';
import { Container, Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabNameToIndex = {
    '/student/profile': 0,
    '/student/qr': 1,
    '/student/statistics': 2,
  };

  const indexToTabName = {
    0: 'profile',
    1: 'qr',
    2: 'statistics',
  };

  const [value, setValue] = useState(tabNameToIndex[location.pathname] || 0);

  useEffect(() => {
    setValue(tabNameToIndex[location.pathname] || 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/student') {
      navigate('profile');
    }
  }, [location.pathname, navigate]);

  const handleChange = (event, newValue) => {
    navigate(indexToTabName[newValue]);
  };

  return (
    <Container maxWidth="md">
      {/* Вкладки с иконками */}
      <Tabs value={value} onChange={handleChange} aria-label="icon tabs" centered>
        <Tab icon={<AccountCircleOutlinedIcon />} aria-label="profile" label="Profile" />
        <Tab icon={<CameraAltOutlinedIcon />} aria-label="qr" label="QR" />
        <Tab icon={<InsertChartOutlinedIcon />} aria-label="statistics" label="Statistics" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="profile" element={<StudentProfile />} />
        <Route path="qr" element={<StudentQRCheck />} />
        <Route path="statistics" element={<StudentStatistics />} />
      </Routes>
    </Container>
  );
}

export default StudentDashboard;
