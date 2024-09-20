// src/components/home.js
import React, { useContext } from 'react';
import { UserContext } from '../context/userContext';
import { Navigate } from 'react-router-dom';
import RegistrationForm from './components/registrationForm';


function Home() {
  const { user } = useContext(UserContext);

  if (user === undefined) {
    // Если пользователь ещё загружается
    return <div>Загрузка...</div>;
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
