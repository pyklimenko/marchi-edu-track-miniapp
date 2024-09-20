// utils/logger.js

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Уровень логирования
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Форматирование метки времени
    format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`) // Форматирование сообщения
  ),
  transports: [
    new transports.Console() // Вывод логов в консоль
  ],
});

module.exports = logger;
