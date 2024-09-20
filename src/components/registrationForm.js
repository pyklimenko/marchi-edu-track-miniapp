// src/components/registrationForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiRequest } from '../utils/api-helpers';
import logger from '../utils/logger';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      logger.error('Не удалось инициализировать Telegram WebApp.');
      alert('Не удалось инициализировать Telegram WebApp.');
      return;
    }
    logger.info('Telegram WebApp успешно инициализирован. Пользователь: ', tgUser);
  }, []);

  // Добавляем новый useEffect для перенаправления после успешной регистрации
  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        window.location.href = '/';
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await handleApiRequest('/api/user/check-email', { email });
    if (data) {
      localStorage.setItem('dbUserId', data._id);
      setError('');
      logger.info('Код отправлен на email: %s', email);
    } else {
      setError('Пользователь не найден');
      logger.warn('Пользователь с email %s не найден', email);
    }
  };

  const handleVerify = async () => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const dbUserId = localStorage.getItem('dbUserId');
    const data = await handleApiRequest('/api/user/verify-code', {
      _id: dbUserId,
      code,
      tgUserId: tgUser?.id,
    });
    if (data) {
      setIsRegistered(true); // Устанавливаем isRegistered в true
      console.log('isRegistered set to true');
      setError('');
      logger.info('Пользователь успешно зарегистрирован с tgId: %s', tgUser?.id);
    } else {
      setError('Неверный код');
      logger.warn('Введён неверный код для пользователя с ID: %s', dbUserId);
    }
  };

  return isRegistered ? (
    <div>
      <p>Вы успешно зарегистрировались!</p>
      <p>Сейчас вы будете перенаправлены...</p>
    </div>
  ) : (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Введите ваш email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Отправить</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <label>
          Введите код:
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <button onClick={handleVerify}>Проверить</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default RegistrationForm;
