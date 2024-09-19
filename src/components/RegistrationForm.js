import React, { useState, useEffect } from 'react';
import { handleApiRequest } from '../utils/api-helpers';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      alert('Не удалось инициализировать Telegram WebApp.');
      return;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await handleApiRequest('/api/user/check-email', { email });
    if (data) {
      localStorage.setItem('dbUserId', data._id);
      setError('');
    } else {
      setError('Пользователь не найден');
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
      setIsRegistered(true);
      setError('');
    } else {
      setError('Неверный код');
    }
  };

  return isRegistered ? (
    <div>Вы успешно зарегистрировались!</div>
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
