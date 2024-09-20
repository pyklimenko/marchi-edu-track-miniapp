// src/components/PersonInfo.js
import React, { useState, useEffect } from 'react';
import { handleApiRequest } from '../utils/api-helpers';
import logger from '../utils/logger';

function PersonInfo({ userType }) {
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchPerson = async () => {
      const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (!tgId) {
        logger.error('Telegram user ID не найден');
        return;
      }
      const data = await handleApiRequest(`/api/user/find-by-tgId?tgId=${tgId}`, null, 'GET');
      if (data?.type === userType) {
        setPerson(data);
        logger.info('Данные пользователя получены: %o', data);
      } else {
        logger.warn('Пользователь с tgId %s не найден или тип не соответствует', tgId);
      }
    };
    fetchPerson();
  }, [userType]);

  if (!person) return null;

  return (
    <div>
      <h1>{userType === 'student' ? 'Информация о студенте' : 'Информация о преподавателе'}</h1>
      <div>ID: {person.tgId}</div>
      <div>Имя: {person.firstName}</div>
      <div>Фамилия: {person.lastName}</div>
      {userType === 'student' ? (
        <div>Номер зачётки: {person.gradeBookId}</div>
      ) : (
        <div>Кафедра: {person.department}</div>
      )}
    </div>
  );
}

export default PersonInfo;
