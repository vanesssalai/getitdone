const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
    const uri = `mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@vanessa.cmfcsdg.mongodb.net/?retryWrites=true&w=majority&appName=vanessa`;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        await listDatabases(client);
    } catch (e) {
        console.error(e.message);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client) {
    const databaseList = await client.db().admin().listDatabases();

    console.log('Databases:');
    databaseList.databases.forEach(db => {
        console.log(` - ${db.name}`);
    });
}