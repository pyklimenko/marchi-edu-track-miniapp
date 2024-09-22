// src/components/student/StudentQRCheck.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { handleApiRequest } from '../../utils/api-helpers';
import { Container, Typography, Alert } from '@mui/material';

function StudentQRCheck() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Получение tgUserId из Telegram WebApp
  const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const handleScan = async (result, error) => {
    if (result) {
      const qrCode = result?.text;
      if (qrCode && qrCode.startsWith('marhi-qr-')) {
        try {
          const data = await handleApiRequest(
            '/api/student/check-in',
            { qrCode },
            'POST',
            { 'x-telegram-user-id': tgUserId }
          );
          if (data && data.success) {
            setSuccess('Вы успешно отметились на паре!');
          } else {
            setError('Не удалось отметить посещение. Попробуйте снова.');
          }
        } catch (err) {
          setError('Ошибка при отметке посещения.');
        }
      } else {
        setError('Неверный QR-код. Попробуйте снова.');
      }
    }
    if (error) {
      console.error(error);
      setError('Ошибка при сканировании QR-кода.');
    }
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
            onResult={handleScan}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
        </>
      )}
    </Container>
  );
}

export default StudentQRCheck;
