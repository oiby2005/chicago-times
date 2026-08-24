const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wsj_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 2000,
});

// Test connection on startup asynchronously
async function testConnection() {
  try {
    const connection = await Promise.race([
      pool.getConnection(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Connection Timeout (2s)')), 2000))
    ]);
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'wsj_db');
    connection.release();
  } catch (error) {
    console.warn('⚠️ MySQL Database not connected:', error.message);
    console.warn('Backend server running. Start XAMPP/MySQL if database features are needed.');
  }
}

setImmediate(() => testConnection());

module.exports = pool;
