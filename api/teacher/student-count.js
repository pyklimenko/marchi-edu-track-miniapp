// api/teacher/student-count.js
const { MongoClient } = require('mongodb');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    // Подключение к базе данных
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.DB_NAME);

    // Получение текущей пары
    const now = new Date();
    const currentClass = await db.collection('Classes').findOne({
      dateTime: {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lt: new Date(now.setHours(23, 59, 59, 999)),
      },
    });

    if (!currentClass) {
      res.status(200).json({ count: 0 });
      return;
    }

    // Подсчёт количества студентов, отметившихся на текущей паре
    const count = await db.collection('Grades').countDocuments({
      attendanceRecords: currentClass._id,
    });

    client.close();

    res.status(200).json({ count });
  } catch (error) {
    logger.error('Ошибка при получении количества студентов: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
