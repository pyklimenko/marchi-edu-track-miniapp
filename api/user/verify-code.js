// api/user/verify-code.js
const { findPersonById, updatePersonTgId, Student, Teacher } = require('../db/db-queries');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
    const { _id, code, tgUserId } = req.body;

    logger.info('Получен запрос на верификацию кода для пользователя с ID: %s', _id);

    try {
        if (_id === code) {
            logger.info('Код подтверждения верен для пользователя с ID: %s', _id);

            const person = await findPersonById(_id);
            if (person) {
                logger.info('Пользователь найден: %s %s', person.firstName, person.lastName);

                const collectionName = person instanceof Student ? 'Students' : 'Teachers';
                await updatePersonTgId(_id, tgUserId, collectionName);

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
};
