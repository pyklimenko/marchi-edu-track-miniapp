// src/components/student/studentQRCheck.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from 'react-qr-scanner';
import { handleApiRequest } from '../../utils/api-helpers';
import { Container, Typography, Alert } from '@mui/material';

function StudentQRCheck() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Получение tgUserId из Telegram WebApp
  const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const handleScan = async (data) => {
    if (data) {
      const qrCode = data.text;
      if (qrCode && qrCode.startsWith('marhi-qr-')) {
        try {
          const response = await handleApiRequest(
            '/api/student/check-in',
            { qrCode },
            'POST',
            { 'x-telegram-user-id': tgUserId }
          );
          if (response && response.success) {
            setSuccess(response.message || 'Вы успешно отметились на паре!');
          } else {
            setError(response.error || 'Не удалось отметить посещение. Попробуйте снова.');
          }
        } catch (err) {
          console.error(err);
          setError('Ошибка при отметке посещения.');
        }
      } else {
        setError('Неверный QR-код. Попробуйте снова.');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Ошибка при сканировании QR-кода.');
  };

  const previewStyle = {
    height: 240,
    width: '100%',
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Отметка посещения
      </Typography>

      {success ? (
        <Alert severity="success">{success}</Alert>
      ) : (
        <>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography variant="body1" align="center" gutterBottom>
            Наведите камеру на QR-код, чтобы отметиться на паре.
          </Typography>
          <QrReader
            delay={300}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
            constraints={{ facingMode: 'environment' }}
          />
        </>
      )}
    </Container>
  );
}

export default StudentQRCheck;
