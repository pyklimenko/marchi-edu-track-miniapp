const { MongoClient } = require('mongodb');

let client;
let db;

async function connectToDatabase() {
    if (!client) {
        const uri = process.env.MARHI_MONGODB_URI;
        if (!uri) {
            throw new Error('MARHI_MONGODB_URI is not defined');
        }
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db('MARHI');
    }
    return db;
}

module.exports = connectToDatabase;
