require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');

async function run() {
  console.log('=== MongoDB Ping ===');
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected');
    const db = mongoose.connection.db;
    const admin = db.admin();
    const ping = await admin.command({ ping: 1 });
    console.log('Ping result:', ping);
    const users = await db.collection('users').find({}, { projection: { email: 1, _id: 0 } }).limit(20).toArray();
    console.log('=== Users (email) ===');
    console.log(users);
    const count = await db.collection('users').countDocuments();
    console.log('User count:', count);
  } catch (err) {
    console.error('MongoDB error:', err.message);
  }

  console.log('\n=== bcryptjs installed ===');
  try { require('bcryptjs'); console.log('bcryptjs present'); } catch (e) { console.log('bcryptjs NOT installed'); }

  console.log('\n=== jsonwebtoken installed ===');
  try { require('jsonwebtoken'); console.log('jsonwebtoken present'); } catch (e) { console.log('jsonwebtoken NOT installed'); }

  console.log('\n=== server/package.json ===');
  const fs = require('fs');
  console.log(fs.readFileSync('server/package.json','utf8'));

  console.log('\n=== authController.js ===');
  console.log(fs.readFileSync('server/controllers/authController.js','utf8'));

  console.log('\n=== User.js ===');
  console.log(fs.readFileSync('server/models/User.js','utf8'));

  console.log('\n=== server.js ===');
  console.log(fs.readFileSync('server/server.js','utf8'));

  console.log('\n=== client axios.js ===');
  console.log(fs.readFileSync('client/src/api/axios.js','utf8'));

  console.log('\n=== Health check ===');
  const axios = require('axios');
  try {
    const res = await axios.get('http://localhost:5000/api/health');
    console.log('Health response:', res.data);
  } catch (e) {
    console.error('Health check error:', e.message);
  }

  console.log('\n=== Test login endpoint ===');
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email: 'test@test.com', password: 'test123' });
    console.log('Login response:', res.data);
  } catch (e) {
    console.error('Login error:', e.response ? e.response.data : e.message);
  }
}
run();
