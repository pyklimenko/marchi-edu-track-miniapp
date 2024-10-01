// src/components/common/protectedRoute.js
import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);

  if (user === undefined) {
    // Если пользователь ещё загружается, можно показать индикатор загрузки
    return <div>Загрузка...</div>;
  }

  if (!user) {
    // Если пользователь не авторизован, перенаправляем на страницу регистрации
    return <Navigate to="/register" replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    // Если роль пользователя не соответствует разрешённым, показываем сообщение об ошибке
    return <div>Доступ запрещён</div>;
  }

  return children;
}

export default ProtectedRoute;
