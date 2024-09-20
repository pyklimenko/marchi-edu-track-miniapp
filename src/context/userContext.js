// src/context/userContext.js
import React, { createContext, useState, useEffect } from 'react';
import { handleApiRequest } from '../utils/api-helpers';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // Начальное значение undefined

  useEffect(() => {
    const fetchUser = async () => {
      const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (!tgId) {
        console.error('Telegram user ID не найден');
        setUser(null);
        return;
      }
      const data = await handleApiRequest(`/api/user/find-by-tgId?tgId=${tgId}`, null, 'GET');
      if (data?.found) {
        setUser(data);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
