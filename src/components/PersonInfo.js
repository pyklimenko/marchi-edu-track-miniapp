import React, { useState, useEffect } from 'react';
import { handleApiRequest } from '../utils/api-helpers';

function PersonInfo({ userType }) {
  const [person, setPerson] = useState(null);

  useEffect(() => {
    const fetchPerson = async () => {
      const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      const data = await handleApiRequest(`/api/user/find-by-tgId?tgId=${tgId}`, null, 'GET');
      if (data?.type === userType) setPerson(data);
    };
    fetchPerson();
  }, [userType]);

  if (!person) return null;

  return (
    <div>
      <h1>{userType === 'student' ? 'Информация о студенте' : 'Информация о преподавателе'}</h1>
      <div>ID: {person.tgId}</div>
      <div>Имя: {person.firstName}</div>
      <div>Фамилия: {person.lastName}</div>
      {userType === 'student' ? (
        <div>Номер зачётки: {person.gradeBookId}</div>
      ) : (
        <div>Кафедра: {person.department}</div>
      )}
    </div>
  );
}

export default PersonInfo;
