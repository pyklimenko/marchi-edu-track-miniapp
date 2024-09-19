const { MongoClient } = require('mongodb');

let client;
let db;

async function connectToDatabase(uri) {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db();  // Указывайте название базы данных, если необходимо
    }
    return db;
}

module.exports = connectToDatabase;
