// api/teacher/attendance.js
const { MongoClient } = require('mongodb');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    // Подключение к базе данных
    const client = await MongoClient.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db(process.env.DB_NAME);

    // Получение списка студентов и их посещаемости
    const students = await db
      .collection('Students')
      .aggregate([
        {
          $lookup: {
            from: 'Grades',
            localField: '_id',
            foreignField: 'studentId',
            as: 'grades',
          },
        },
        {
          $unwind: {
            path: '$grades',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            groupId: 1,
            attendanceCount: {
              $size: { $ifNull: ['$grades.attendanceRecords', []] },
            },
          },
        },
      ])
      .toArray();

    client.close();

    res.status(200).json({ students });
  } catch (error) {
    logger.error('Ошибка при получении посещаемости студентов: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
