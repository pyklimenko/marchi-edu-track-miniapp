// src/components/teacher/teacherAttendance.js
import React, { useEffect, useState } from 'react';
import { handleApiRequest } from '../../utils/api-helpers';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

function TeacherAttendance() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await handleApiRequest('/api/teacher/attendance', null, 'GET');
        if (data && data.students) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error('Ошибка при получении посещаемости', error);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" align="center" gutterBottom>
        Посещаемость студентов
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Фамилия</TableCell>
            <TableCell>Имя</TableCell>
            <TableCell>Группа</TableCell>
            <TableCell>Посещенные занятия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.lastName}</TableCell>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.groupId}</TableCell>
              <TableCell>{student.attendanceCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default TeacherAttendance;
