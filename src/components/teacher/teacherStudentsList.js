// src/components/teacherStudentsList.js
import React, { useEffect, useState } from 'react';
import { handleApiRequest } from '../../utils/api-helpers';
import logger from '../../utils/logger';

function TeacherStudentsList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await handleApiRequest('/api/teacher/students', null, 'GET');
        if (data) {
          setStudents(data.students);
          logger.info('Список студентов получен: %o', data.students);
        } else {
          logger.warn('Не удалось получить список студентов');
        }
      } catch (error) {
        logger.error('Ошибка при получении списка студентов: %o', error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Список Студентов</h2>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.lastName} {student.firstName} ({student.gradeBookId})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeacherStudentsList;
