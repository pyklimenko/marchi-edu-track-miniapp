import React, { useState, useEffect } from 'react';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!tgUser) {
      console.error("Telegram WebApp не инициализирован или пользователь не доступен");
      alert('Не удалось инициализировать Telegram WebApp.');
      return;
    }

    // Здесь можно продолжить выполнение логики, зависящей от tgUser
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('dbUserId', data._id);
        setError('');
      } else {
        setError('Пользователь не найден');
      }
    } catch (error) {
      setError('Ошибка при проверке email, попробуйте позже');
    }
  };

  const handleVerify = async () => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!tgUser) {
      console.error("Telegram WebApp не инициализирован или пользователь не доступен");
      alert('Ошибка при попытке использовать Telegram WebApp.');
      return;
    }

    const dbUserId = localStorage.getItem('dbUserId');

    try {
      const response = await fetch('/api/user/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: dbUserId, code, tgUserId: tgUser.id })
      });

      if (response.ok) {
        setIsRegistered(true);
        setError('');
      } else {
        setError('Неверный код');
      }
    } catch (error) {
      setError('Ошибка при проверке кода, попробуйте позже');
    }
  };

  if (isRegistered) {
    return <div>Вы успешно зарегистрировались!</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Введите ваш email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <button type="submit">Отправить</button>
      </form>

      <div style={{ display: 'block', marginTop: '20px' }}>
        <label>
          Введите код, который вы получили на почту:
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <button onClick={handleVerify}>Проверить</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default RegistrationForm;
