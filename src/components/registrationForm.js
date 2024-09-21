// src/components/registrationForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleApiRequest } from '../utils/api-helpers';
import logger from '../utils/logger';
import { TextField, Button, Typography, Container } from '@mui/material';

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
      console.log('Navigating immediately without timeout');
      navigate('/', { replace: true });
    }
  }, [isRegistered, navigate]);
  
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
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Вы успешно зарегистрировались!
      </Typography>
      <Typography variant="body1" align="center">
        Сейчас вы будете перенаправлены...
      </Typography>
    </Container>
  ) : (
    <Container maxWidth="sm">
    <Typography variant="h5" align="center" gutterBottom>
      Регистрация
    </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" variant="outlined" color="primary" fullWidth>
        Отправить
      </Button>
    </form>

    <div style={{ marginTop: '20px' }}>
      <TextField
        label="Введите код"
        variant="outlined"
        fullWidth
        margin="normal"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <Button onClick={handleVerify} variant="outlined" color="primary" fullWidth>
        Проверить
      </Button>
    </div>

    {error && (
      <Typography variant="body2" color="error" align="center">
        {error}
      </Typography>
    )}
  </Container>
  );
}

export default RegistrationForm;
