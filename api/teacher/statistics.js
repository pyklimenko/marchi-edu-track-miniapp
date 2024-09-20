// api/teacher/statistics.js
const connectToDatabase = require('../db/db-connect');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();
    // Предположим, что вы получаете статистику из коллекции 'Statistics'
    const statistics = await db.collection('Statistics').findOne({ /* условия поиска */ });

    if (statistics) {
      res.status(200).json(statistics);
    } else {
      res.status(404).json({ error: 'Статистика не найдена' });
    }
  } catch (error) {
    logger.error('Ошибка при получении статистики: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
