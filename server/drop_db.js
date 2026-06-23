const mongoose = require('mongoose');

async function dropDB(dbName) {
  const uri = `mongodb://127.0.0.1:27017/${dbName}`;
  console.log(`Connecting to: ${uri}`);
  try {
    const conn = await mongoose.connect(uri);
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    for (let col of collections) {
      if (['users', 'urls', 'visits'].includes(col.name)) {
        await db.collection(col.name).drop();
        console.log(`Dropped collection: ${col.name} in ${dbName}`);
      }
    }
    await mongoose.disconnect();
    console.log(`Finished dropping collections for ${dbName}`);
  } catch (err) {
    console.error(`Error dropping collections for ${dbName}:`, err.message);
  }
}

async function run() {
  await dropDB('valtex');
  await dropDB('valtex_fresh');
}

run();
