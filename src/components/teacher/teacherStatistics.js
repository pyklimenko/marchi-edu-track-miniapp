// src/components/teacher/teacherStatistics.js
import React, { useEffect, useState } from 'react';
import { handleApiRequest } from '../../utils/api-helpers';
import logger from '../../utils/logger';

function TeacherStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await handleApiRequest('/api/teacher/statistics', null, 'GET');
        if (data) {
          setStatistics(data);
          logger.info('Статистика получена: %o', data);
        } else {
          setError('Не удалось получить статистику');
          logger.warn('Не удалось получить статистику');
        }
      } catch (error) {
        setError('Ошибка при получении статистики');
        logger.error('Ошибка при получении статистики: %o', error);
      }
    };
    fetchStatistics();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!statistics) {
    return <div>Загрузка статистики...</div>;
  }

  return (
    <div>
      <h2>Статистика Преподавателя</h2>
      {/* Отобразите статистику здесь */}
      <div>Количество студентов: {statistics.studentCount}</div>
      <div>Средний балл: {statistics.averageGrade}</div>
      {/* Добавьте дополнительную статистику по необходимости */}
    </div>
  );
}

export default TeacherStatistics;
