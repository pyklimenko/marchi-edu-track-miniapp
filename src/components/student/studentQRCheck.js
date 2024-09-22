// src/components/student/studentQRCheck.js
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { handleApiRequest } from '../../utils/api-helpers';
import { Container, Typography, Alert, Box, Button } from '@mui/material';

function StudentQRCheck() {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [streaming, setStreaming] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true); // Для iOS
        videoRef.current.play();
        setStreaming(true);
        requestAnimationFrame(tick);
      })
      .catch((err) => {
        console.error('Ошибка при доступе к камере:', err);
        setError('Ошибка при доступе к камере: ' + err.message);
      });
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    }
    videoRef.current.srcObject = null;
    setStreaming(false);
  };

  const tick = () => {
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      canvas.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      const imageData = canvas.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      const code = jsQR(
        imageData.data,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (code) {
        // QR-код распознан
        handleScanResult(code.data);
        stopCamera();
      } else {
        requestAnimationFrame(tick);
      }
    } else {
      requestAnimationFrame(tick);
    }
  };

  const handleScanResult = async (qrCode) => {
    if (qrCode && qrCode.startsWith('marhi-qr-')) {
      try {
        // Получение tgUserId из Telegram WebApp
        const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

        const data = await handleApiRequest(
          '/api/student/check-in',
          { qrCode },
          'POST',
          { 'x-telegram-user-id': tgUserId }
        );

        if (data && data.success) {
          setSuccess(data.message || 'Вы успешно отметились на паре!');
        } else {
          setError(data.error || 'Ошибка при отметке посещения.');
        }
      } catch (err) {
        console.error('Ошибка при отметке посещения:', err);
        setError('Ошибка при отметке посещения.');
      }
    } else {
      setError('Неверный QR-код. Попробуйте снова.');
    }
  };

  useEffect(() => {
    // Очищаем камеру при размонтировании компонента
    return () => {
      stopCamera();
    };
  }, []);

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
          {!streaming && (
            <Button variant="contained" color="primary" onClick={startCamera}>
              Открыть камеру
            </Button>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
              <Paper
                elevation={3}
                style={{
                  width: '70%',
                  height: '70%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >            
              <video
              ref={videoRef}
              style={{
                width: '70%',
                height: '70%',
                borderRadius: '16px',
                display: streaming ? 'block' : 'none',
                objectFit: 'cover',
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
}

export default StudentQRCheck;
