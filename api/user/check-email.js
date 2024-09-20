// api/user/check-email.js
const { findPersonByEmail } = require('../db/db-queries');
const sendGmailWithRetry = require('../google/google-mail');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
    try {
        const { email } = req.body;

        logger.info('Получен запрос на проверку email: %s', email);

        const person = await findPersonByEmail(email);
        if (person) {
            logger.info('Пользователь найден: %s %s', person.firstName, person.lastName);

            res.status(200).json({
                _id: person._id,
                email: person.email,
                tgId: person.tgId
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
};
