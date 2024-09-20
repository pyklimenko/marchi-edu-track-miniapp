// api/db/db-connect.js
require('dotenv').config();
const { MongoClient } = require('mongodb');
const logger = require('../../utils/logger');

let client;
let db;

async function connectToDatabase() {
    if (!client) {
        const uri = process.env.MARHI_MONGODB_URI;
        if (!uri) {
            logger.error('MARHI_MONGODB_URI не определен');
            throw new Error('MARHI_MONGODB_URI is not defined');
        }
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            db = client.db('MARHI');
            logger.info('Подключение к MongoDB успешно');
        } catch (error) {
            logger.error('Ошибка подключения к MongoDB: %o', error);
            throw error;
        }
    }
    return db;
}

module.exports = connectToDatabase;
