// src/components/PersonInfo.js
import React, { useState, useEffect } from 'react';
import { handleApiRequest } from '../utils/api-helpers';
import logger from '../utils/logger';

function PersonInfo({ userType }) {
  const [person, setPerson] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (!tgId) {
        logger.error('Telegram user ID не найден');
        return;
      }
      const data = await handleApiRequest(`/api/user/find-by-tgId?tgId=${tgId}`, null, 'GET');
      if (data?.found) {
        if (data.type === userType) {
          setPerson(data);
          logger.info('Данные пользователя получены: %o', data);
        } else {
          logger.warn('Тип пользователя не соответствует: ожидается %s, получен %s', userType, data.type);
        }
      } else {
        logger.warn('Пользователь с tgId %s не найден', tgId);
        setNotFound(true);
      }
    };
    fetchPerson();
  }, [userType]);

  if (notFound) {
    // Отобразить компонент регистрации или перенаправить пользователя
    return <RegistrationForm />;
  }

  if (!person) return null;

  return (
    <div>
      {/* Отображение информации о пользователе */}
    </div>
  );
}

export default PersonInfo;
