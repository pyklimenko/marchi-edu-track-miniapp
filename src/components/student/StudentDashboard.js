// src/components/student/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StudentProfile from './StudentProfile';
import StudentSessions from './StudentSessions'; // Новый компонент
import StudentStatistics from './StudentStatistics';
import { Container, Tabs, Tab } from '@mui/material';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabNameToIndex = {
    '/student/sessions': 0,
    '/student/statistics': 1,
    '/student/profile': 2,
  };

  const indexToTabName = {
    0: 'sessions',
    1: 'statistics',
    2: 'profile',
  };

  const [value, setValue] = useState(tabNameToIndex[location.pathname] || 0);

  useEffect(() => {
    setValue(tabNameToIndex[location.pathname] || 0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/student') {
      navigate('sessions');
    }
  }, [location.pathname, navigate]);

  const handleChange = (event, newValue) => {
    navigate(indexToTabName[newValue]);
  };

  return (
    <Container maxWidth="md">
      {/* Вкладки с иконками */}
      <Tabs value={value} onChange={handleChange} aria-label="icon tabs" centered>
        <Tab icon={<ListAltOutlinedIcon />} aria-label="sessions" label="Занятия" />
        <Tab icon={<InsertChartOutlinedIcon />} aria-label="statistics" label="Статистика" />
        <Tab icon={<AccountCircleOutlinedIcon />} aria-label="profile" label="Профиль" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="sessions" element={<StudentSessions />} />
        <Route path="statistics" element={<StudentStatistics />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </Container>
  );
}

export default StudentDashboard;
