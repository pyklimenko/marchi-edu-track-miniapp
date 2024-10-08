// utils/db/db-queries.js
const { ObjectId } = require('mongodb');
const connectToDatabase = require('./db-connect');
const logger = require('../logger');

class Person {
    constructor({ _id, lastName, firstName, middleName, phoneNumber, email, tgId, tgUserName }) {
        this._id = _id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.tgId = tgId;
        this.tgUserName = tgUserName;
    }
}

class Student extends Person {
    constructor({ gradeBookId, ...person }) {
        super(person);
        this.gradeBookId = gradeBookId;
    }
}

class Teacher extends Person {
    constructor({ department, ...person }) {
        super(person);
        this.department = department;
    }
}

async function findPersonById(id) {
    const db = await connectToDatabase();
    const objectId = new ObjectId(id);

    try {
        const student = await db.collection('Students').findOne({ _id: objectId });
        if (student) {
            logger.info('Студент найден с ID: %s', id);
            return new Student({ ...student });
        }

        const teacher = await db.collection('Teachers').findOne({ _id: objectId });
        if (teacher) {
            logger.info('Преподаватель найден с ID: %s', id);
            return new Teacher({ ...teacher });
        }

        logger.warn('Пользователь с ID %s не найден', id);
        return null;
    } catch (error) {
        logger.error('Ошибка при поиске пользователя по ID %s: %o', id, error);
        throw error;
    }
}

async function findStudentByTgId(tgId) {
    const db = await connectToDatabase();
    return db.collection('Students').findOne({ tgId });
}

async function findTeacherByTgId(tgId) {
    const db = await connectToDatabase();
    return db.collection('Teachers').findOne({ tgId });
}

async function findPersonByTgId(tgId) {
    const student = await findStudentByTgId(tgId);
    if (student) {
        return new Student({ ...student });
    }

    const teacher = await findTeacherByTgId(tgId);
    if (teacher) {
        return new Teacher({ ...teacher });
    }

    return null; // Если пользователь не найден
}

async function findPersonByEmail(email) {
    const db = await connectToDatabase();

    console.log(`[db-queries] Ищем среди студентов документ с email: ${email}`);

    const student = await db.collection('Students').findOne({ email });
    if (student) {
        return new Student({ ...student });
    }

    console.log(`[db-queries] Ищем среди преподавателей документ с email: ${email}`);

    const teacher = await db.collection('Teachers').findOne({ email });
    if (teacher) {
        return new Teacher({ ...teacher });
    }

    return null; // Если пользователь не найден
}

async function updatePersonTgId(userId, tgId, collectionName) {
    const db = await connectToDatabase();

    try {
        // Преобразуем строку userId в ObjectId
        const objectId = new ObjectId(userId);

        const result = await db.collection(collectionName).updateOne(
            { _id: objectId }, // Ищем документ по ObjectId
            { $set: { tgId } } // Обновляем поле tgId
        );

        // Проверяем, был ли обновлен документ
        if (result.modifiedCount === 1) {
            console.log(`[updatePersonTgId] tgId успешно обновлен для пользователя с _id: ${userId}`);
        } else {
            console.log(`[updatePersonTgId] Не удалось обновить tgId для пользователя с _id: ${userId}. Документ не найден.`);
        }
    } catch (error) {
        console.error(`[updatePersonTgId] Ошибка при обновлении tgId для пользователя с _id: ${userId}`, error);
    }
}

module.exports = { findPersonById, findPersonByEmail, findStudentByTgId, findTeacherByTgId, findPersonByTgId, updatePersonTgId, Student, Teacher };
