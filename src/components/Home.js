// src/components/home.js
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import Loading from './Loading'; // Импортируем компонент Loading

function Home() {
  const { user } = useContext(UserContext);

  if (user === undefined) {
    // Если пользователь ещё загружается, показываем индикатор загрузки
    return <Loading message="Подождите, идет загрузка..." />;
  }

  if (user === null) {
    // Если пользователь не найден, показываем форму регистрации
    return <RegistrationForm />;
  } else if (user.type === 'student') {
    // Перенаправляем студента на его дашборд
    return <Navigate to="/student" replace />;
  } else if (user.type === 'teacher') {
    // Перенаправляем преподавателя на его дашборд
    return <Navigate to="/teacher" replace />;
  } else {
    // Непредвиденный тип пользователя
    return <div>Ошибка: неизвестный тип пользователя</div>;
  }
}

export default Home;
