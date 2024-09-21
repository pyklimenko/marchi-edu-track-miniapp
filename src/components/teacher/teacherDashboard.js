import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TeacherProfile from './teacherProfile';
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
    if (newValue === 1) navigate('statistics');
    if (newValue === 2) navigate('students');
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
        <Tab icon={<InsertChartOutlinedIcon />} aria-label="statistics" label="Statistics" />
        <Tab icon={<GroupsOutlinedIcon />} aria-label="students" label="Students" />
      </Tabs>

      {/* Маршруты */}
      <Routes>
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="statistics" element={<TeacherStatistics />} />
        <Route path="students" element={<TeacherStudentsList />} />
      </Routes>
    </Container>
  );
}

export default TeacherDashboard;
