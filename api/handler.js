// api/handler.js
const express = require('express');
const serverless = require('serverless-http'); // Импортируем serverless-http
const app = express();

app.use(express.json());

// Импорт необходимых модулей
const { ObjectId } = require('mongodb');
const connectToDatabase = require('../utils/db/db-connect');
const {
  findPersonById,
  findPersonByEmail,
  findPersonByTgId,
  updatePersonTgId,
  Student,
  Teacher,
} = require('../utils/db/db-queries');
const sendGmailWithRetry = require('../utils/google/google-mail');
const logger = require('../utils/logger');

// Маршруты для студентов
app.get('/student/sessions', getStudentSessions);
app.post('/student/check-in', studentCheckIn);

// Маршруты для преподавателей
app.get('/teacher/attendance', getTeacherAttendance);
app.post('/teacher/generate-qr', generateQrCode);
app.get('/teacher/student-count', getStudentCount);

// Маршруты для пользователей
app.post('/user/check-email', checkEmail);
app.get('/user/find-by-tgId', findByTgId);
app.post('/user/verify-code', verifyCode);

app.get('/test', (req, res) => {
  res.json({ message: 'Тестовый маршрут работает!' });
});


// Обработчики маршрутов

// 1. Обработчики для студентов

async function getStudentSessions(req, res) {
  try {
    const db = await connectToDatabase();

    // Получение studentId из параметров запроса
    const studentId = req.query.studentId;
    if (!studentId) {
      return res.status(400).json({ error: 'Не указан studentId' });
    }

    const studentObjectId = new ObjectId(studentId);

    // Шаг 1: Получаем текущий семестр
    const currentDate = new Date();
    const currentSemester = await db.collection('Semesters').findOne({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    if (!currentSemester) {
      return res.status(404).json({ error: 'Текущий семестр не найден' });
    }

    // Шаг 2: Получаем группы студента
    const student = await db.collection('Students').findOne({ _id: studentObjectId });
    if (!student) {
      return res.status(404).json({ error: 'Студент не найден' });
    }

    const studentGroupIds = student.departmentGroupIds || [];

    if (studentGroupIds.length === 0) {
      return res.status(404).json({ error: 'Студент не состоит ни в одной группе' });
    }

    // Шаг 3: Получаем CourseOfferings
    const courseOfferings = await db.collection('CourseOfferings').find({
      departmentGroupId: { $in: studentGroupIds.map((id) => new ObjectId(id)) },
      semesterId: currentSemester._id,
    }).toArray();

    if (courseOfferings.length === 0) {
      return res.status(404).json({ error: 'Нет курсов для студента в текущем семестре' });
    }

    // Шаг 4: Получаем все Sessions
    const sessionIds = courseOfferings.flatMap((co) => co.sessions);
    const uniqueSessionIds = [...new Set(sessionIds.map((id) => id.toString()))];

    const sessions = await db.collection('Sessions').find({
      _id: { $in: uniqueSessionIds.map((id) => new ObjectId(id)) },
    }).toArray();

    if (sessions.length === 0) {
      return res.status(404).json({ error: 'Сессии не найдены' });
    }

    // Шаг 5: Обогащаем данные сессий
    for (let session of sessions) {
      const courseOffering = courseOfferings.find((co) => co._id.equals(session.courseOfferingId));
      const course = await db.collection('Courses').findOne({ _id: courseOffering.courseId });
      const topic = course.topics.find((t) => t.topicNumber === session.topicNumber);

      session.courseTitle = course.title;
      session.topicTitle = topic ? topic.title : 'Нет данных';

      // Определяем статус посещения
      const attendanceRecord = session.attendance.find((a) => a.studentId.equals(studentObjectId));
      session.attendanceStatus = attendanceRecord
        ? attendanceRecord.present
          ? 'present'
          : 'absent'
        : 'noData';
    }

    // Сортируем сессии по дате
    sessions.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    // Находим предыдущую, текущую и следующую сессии
    const currentDateTime = new Date();
    let lastSession = null;
    let currentSession = null;
    let nextSession = null;

    for (let session of sessions) {
      const sessionStart = new Date(session.startDate);
      const sessionEnd = new Date(sessionStart.getTime() + 90 * 60000); // +1 час 30 минут

      if (sessionEnd < currentDateTime) {
        lastSession = session;
      } else if (sessionStart <= currentDateTime && sessionEnd >= currentDateTime) {
        currentSession = session;
      } else if (sessionStart > currentDateTime && !nextSession) {
        nextSession = session;
      }
    }

    const result = {
      lastSession,
      currentSession,
      nextSession,
    };

    res.json(result);
  } catch (error) {
    logger.error('Ошибка при получении сессий студента: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function studentCheckIn(req, res) {
  try {
    const { qrCode } = req.body;

    const db = await connectToDatabase();

    // Получение текущего QR-кода
    const currentQr = await db.collection('currentQrCode').findOne({ _id: 'current' });

    if (!currentQr || currentQr.qrCode !== qrCode) {
      res.status(400).json({ error: 'QR-код недействителен или устарел' });
      return;
    }

    // Получение tgUserId из заголовков
    const tgUserId = req.headers['x-telegram-user-id'];
    if (!tgUserId) {
      res.status(400).json({ error: 'Не удалось идентифицировать пользователя' });
      return;
    }

    const student = await db.collection('Students').findOne({ tgId: parseInt(tgUserId, 10) });

    if (!student) {
      res.status(404).json({ error: 'Студент не найден' });
      return;
    }

    // Получение текущего занятия
    const now = new Date();
    const currentSession = await db.collection('Sessions').findOne({
      startDate: {
        $lte: now,
      },
      endDate: {
        $gte: now,
      },
    });

    if (!currentSession) {
      res.status(404).json({ error: 'Текущее занятие не найдено' });
      return;
    }

    // Проверяем, не было ли уже отметки для текущей сессии
    const attendanceRecord = currentSession.attendance.find((a) =>
      a.studentId.equals(student._id)
    );

    if (attendanceRecord) {
      res.status(200).json({ success: true, message: 'Вы уже отметились на этом занятии' });
      return;
    }

    // Добавляем отметку посещения
    await db.collection('Sessions').updateOne(
      { _id: currentSession._id },
      { $push: { attendance: { studentId: student._id, present: true } } }
    );

    res.status(200).json({ success: true, message: 'Вы успешно отметились на занятии!' });
  } catch (error) {
    logger.error('Ошибка при отметке посещения: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// 2. Обработчики для преподавателей

async function getTeacherAttendance(req, res) {
  try {
    const db = await connectToDatabase();

    // Получение списка студентов и их посещаемости
    const students = await db
      .collection('Students')
      .aggregate([
        {
          $lookup: {
            from: 'Sessions',
            let: { studentId: '$_id' },
            pipeline: [
              { $unwind: '$attendance' },
              {
                $match: {
                  $expr: { $eq: ['$attendance.studentId', '$$studentId'] },
                },
              },
            ],
            as: 'attendedSessions',
          },
        },
        {
          $addFields: {
            attendanceCount: { $size: '$attendedSessions' },
          },
        },
        {
          $project: {
            firstName: 1,
            lastName: 1,
            attendanceCount: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json({ students });
  } catch (error) {
    logger.error('Ошибка при получении посещаемости студентов: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function generateQrCode(req, res) {
  try {
    const { v4: uuidv4 } = require('uuid');
    const db = await connectToDatabase();

    // Генерация нового QR-кода
    const qrCode = 'marhi-qr-' + uuidv4().slice(0, 8);

    // Обновление или вставка записи в коллекцию
    await db.collection('currentQrCode').updateOne(
      { _id: 'current' },
      { $set: { qrCode, timestamp: new Date() } },
      { upsert: true }
    );

    res.status(200).json({ qrCode });
  } catch (error) {
    logger.error('Ошибка при генерации QR-кода: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function getStudentCount(req, res) {
  try {
    const db = await connectToDatabase();

    // Получение текущего занятия
    const now = new Date();
    const currentSession = await db.collection('Sessions').findOne({
      startDate: {
        $lte: now,
      },
      endDate: {
        $gte: now,
      },
    });

    if (!currentSession) {
      res.status(200).json({ count: 0 });
      return;
    }

    // Подсчёт количества студентов, отметившихся на текущем занятии
    const count = currentSession.attendance.length;

    res.status(200).json({ count });
  } catch (error) {
    logger.error('Ошибка при получении количества студентов: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// 3. Обработчики для пользователей

async function checkEmail(req, res) {
  try {
    const { email } = req.body;

    logger.info('Получен запрос на проверку email: %s', email);

    const person = await findPersonByEmail(email);
    if (person) {
      logger.info('Пользователь найден: %s %s', person.firstName, person.lastName);

      res.status(200).json({
        _id: person._id,
        email: person.email,
        tgId: person.tgId,
      });

      logger.info('Отправка кода регистрации на email: %s', email);

      await sendGmailWithRetry(
        person.email,
        'Код регистрации в MARHIEduTrack',
        `Привет, ${person.firstName}. Чтобы завершить регистрацию, используй код ${person._id}.`
      );
    } else {
      logger.warn('Пользователь с email %s не найден', email);
      res.status(404).json({ error: 'Пользователь не найден' });
    }
  } catch (error) {
    logger.error('Ошибка в обработке запроса check-email: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function findByTgId(req, res) {
  try {
    let { tgId } = req.query;

    logger.info('Получен запрос на поиск пользователя с tgId: %s', tgId);

    tgId = parseInt(tgId, 10);

    const person = await findPersonByTgId(tgId);
    if (person) {
      logger.info('Пользователь найден: %s %s', person.firstName, person.lastName);
      const userType = person instanceof Student ? 'student' : 'teacher';
      res.status(200).json({
        found: true,
        type: userType,
        ...person,
      });
    } else {
      logger.warn('Пользователь с tgId %s не найден', tgId);
      res.status(200).json({ found: false });
    }
  } catch (error) {
    logger.error('Ошибка при поиске пользователя с tgId %s: %o', tgId, error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function verifyCode(req, res) {
  try {
    const { _id, code, tgUserId } = req.body;

    logger.info('Получен запрос на верификацию кода для пользователя с ID: %s', _id);

    if (_id === code) {
      logger.info('Код подтверждения верен для пользователя с ID: %s', _id);

      const person = await findPersonById(_id);
      if (person) {
        logger.info('Пользователь найден: %s %s', person.firstName, person.lastName);

        const collectionName = person instanceof Student ? 'Students' : 'Teachers';
        await updatePersonTgId(_id, parseInt(tgUserId, 10), collectionName);

        logger.info('tgId обновлен для пользователя с ID: %s', _id);

        res.status(200).json({ message: 'Регистрация завершена' });
      } else {
        logger.warn('Пользователь с ID %s не найден', _id);
        res.status(404).json({ error: 'Пользователь не найден' });
      }
    } else {
      logger.warn('Неверный код подтверждения для пользователя с ID: %s', _id);
      res.status(400).json({ error: 'Неверный код' });
    }
  } catch (error) {
    logger.error('Ошибка при верификации кода для пользователя с ID %s: %o', _id, error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

// Экспортируем обработчик для Vercel как дефолтный экспорт
module.exports = serverless(app);
