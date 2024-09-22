// src/components/student/studentDashboard.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StudentProfile from './studentProfile';
import StudentQRCheck from './studentQRCheck';
import StudentStatistics from './studentStatistics';
import { Container, Tabs, Tab } from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

function StudentDashboard() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('profile');
  }, [navigate]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Перенаправляем на нужный маршрут при изменении вкладки
    if (newValue === 0) navigate('profile');
    if (newValue === 1) navigate('qr');
    if (newValue === 2) navigate('statistics');
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
