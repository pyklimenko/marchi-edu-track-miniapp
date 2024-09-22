// src/components/teacher/teacherQRGenerator.js
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Container, Typography } from '@mui/material';
import { handleApiRequest } from '../../utils/api-helpers';

function TeacherQRGenerator() {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [timer, setTimer] = useState(10);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    // Функция для генерации нового QR-кода
    const generateQrCode = async () => {
      try {
        const data = await handleApiRequest('/api/teacher/generate-qr', null, 'GET');
        if (data && data.qrCode) {
          setQrCodeValue(data.qrCode);
          setTimer(10); // Сброс таймера
        }
      } catch (error) {
        console.error('Ошибка при генерации QR-кода', error);
      }
    };

    // Функция для получения количества отметившихся студентов
    const fetchStudentCount = async () => {
      try {
        const data = await handleApiRequest('/api/teacher/student-count', null, 'GET');
        if (data && data.count !== undefined) {
          setStudentCount(data.count);
        }
      } catch (error) {
        console.error('Ошибка при получении количества студентов', error);
      }
    };

    // Генерируем QR-код при загрузке компонента
    generateQrCode();
    fetchStudentCount();

    // Устанавливаем интервал для обновления QR-кода каждые 10 секунд
    const interval = setInterval(() => {
      generateQrCode();
      fetchStudentCount();
    }, 10000);

    // Обновление таймера каждую секунду
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" align="center" gutterBottom>
        Генерация QR-кода для отметки посещений
      </Typography>
      {qrCodeValue ? (
        <div style={{ textAlign: 'center' }}>
          <QRCode value={qrCodeValue} size={256} />
          <Typography variant="body1" align="center">
            Обновление через: {timer} секунд
          </Typography>
          <Typography variant="body1" align="center">
            Отметилось студентов: {studentCount}
          </Typography>
        </div>
      ) : (
        <Typography variant="body1" align="center">
          Генерация QR-кода...
        </Typography>
      )}
    </Container>
  );
}

export default TeacherQRGenerator;
