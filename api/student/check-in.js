// api/student/check-in.js
const { MongoClient, ObjectId } = require('mongodb');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const { qrCode } = req.body;

    // Подключение к базе данных
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.DB_NAME);

    // Получение текущего QR-кода
    const currentQr = await db.collection('currentQrCode').findOne({ _id: 'current' });

    if (!currentQr || currentQr.qrCode !== qrCode) {
      res.status(400).json({ error: 'QR-код недействителен или устарел' });
      return;
    }

    // Получение данных студента по tgId
    const tgUserId = req.headers['x-telegram-user-id']; // Предполагается, что tgUserId передаётся в заголовках
    if (!tgUserId) {
      res.status(400).json({ error: 'Не удалось идентифицировать пользователя' });
      return;
    }

    const student = await db.collection('Students').findOne({ tgId: tgUserId });

    if (!student) {
      res.status(404).json({ error: 'Студент не найден' });
      return;
    }

    // Получение текущей пары (Class) по дате
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentClass = await db.collection('Classes').findOne({
      dateTime: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    });

    if (!currentClass) {
      res.status(404).json({ error: 'Текущая пара не найдена' });
      return;
    }

    // Поиск или создание AttendanceGrades
    let attendanceGrades = await db.collection('Grades').findOne({
      studentId: student._id,
    });

    if (!attendanceGrades) {
      // Создаём новый документ AttendanceGrades
      attendanceGrades = {
        studentId: student._id,
        groupId: student.groupId,
        semesterId: currentClass.semesterId, // Предполагается, что поле semesterId есть
        attendanceRecords: [],
        grades: [],
      };
      await db.collection('Grades').insertOne(attendanceGrades);
    }

    // Проверяем, не было ли уже отметки для текущего занятия
    if (attendanceGrades.attendanceRecords.includes(currentClass._id)) {
      res.status(200).json({ success: true, message: 'Вы уже отметились на этой паре' });
      return;
    }

    // Добавляем текущий Class ID в attendanceRecords
    await db.collection('Grades').updateOne(
      { _id: attendanceGrades._id },
      { $push: { attendanceRecords: currentClass._id } }
    );

    client.close();

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Ошибка при отметке посещения: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
