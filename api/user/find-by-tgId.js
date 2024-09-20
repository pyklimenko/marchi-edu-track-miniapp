const { findPersonByTgId, Student, Teacher } = require('../db/db-queries');
const logger = require('../../utils/logger');

module.exports = async (req, res) => {
    let { tgId } = req.query;

    logger.info('Получен запрос на поиск пользователя с tgId: %s', tgId);

    tgId = parseInt(tgId, 10);

    try {
        const person = await findPersonByTgId(tgId);
        if (person) {
            logger.info('Пользователь найден: %s %s', person.firstName, person.lastName);
            const userType = person instanceof Student ? 'student' : 'teacher';
            res.status(200).json({
                type: userType,
                ...person
            });
        } else {
            logger.warn('Пользователь с tgId %s не найден', tgId);
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        logger.error('Ошибка при поиске пользователя с tgId %s: %o', tgId, error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
