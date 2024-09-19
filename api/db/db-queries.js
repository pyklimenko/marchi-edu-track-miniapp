const { ObjectId } = require('mongodb');
const connectToDatabase = require('./db-connect');

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
    const db = await connectToDatabase(process.env.MARHI_MONGODB_URI);
    
    const objectId = new ObjectId(id);
    const student = await db.collection('Students').findOne({ _id: objectId });
    if (student) {
        return new Student({ ...student });
    }

    const teacher = await db.collection('Teachers').findOne({ _id: objectId });
    if (teacher) {
        return new Teacher({ ...teacher });
    }

    return null;
}

async function findStudentByTgId(tgId) {
    const db = await connectToDatabase(process.env.MARHI_MONGODB_URI);
    return db.collection('Students').findOne({ tgId });
}

async function findTeacherByTgId(tgId) {
    const db = await connectToDatabase(process.env.MARHI_MONGODB_URI);
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

    return null;
}

async function findPersonByEmail(email) {
    const db = await connectToDatabase(process.env.MARHI_MONGODB_URI);

    const student = await db.collection('Students').findOne({ email });
    if (student) {
        return new Student({ ...student });
    }

    const teacher = await db.collection('Teachers').findOne({ email });
    if (teacher) {
        return new Teacher({ ...teacher });
    }

    return null;
}

async function updatePersonTgId(userId, tgId, collectionName) {
    const db = await connectToDatabase(process.env.MARHI_MONGODB_URI);

    try {
        const objectId = new ObjectId(userId);
        const result = await db.collection(collectionName).updateOne(
            { _id: objectId },
            { $set: { tgId } }
        );

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
