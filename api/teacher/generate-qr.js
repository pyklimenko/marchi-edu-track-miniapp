// api/teacher/generate-qr.js
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
  try {
    // Подключение к базе данных
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.DB_NAME);

    // Генерация нового QR-кода
    const qrCode = 'marhi-qr-' + uuidv4().slice(0, 8); // Укорачиваем UUID

    // Обновление или вставка записи в коллекцию
    await db.collection('currentQrCode').updateOne(
      { _id: 'current' },
      { $set: { qrCode, timestamp: new Date() } },
      { upsert: true }
    );

    client.close();

    res.status(200).json({ qrCode });
  } catch (error) {
    logger.error('Ошибка при генерации QR-кода: %o', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
