const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'wsj_db';

  console.log('Connecting to MySQL server...');
  
  try {
    // Step 1: Connect without database to create DB if needed
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database "${database}" verified/created successfully.`);
    await connection.end();

    // Step 2: Connect to specific database
    const db = await mysql.createConnection({ host, user, password, database });

    // Step 3: Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'writer', 'reader') NOT NULL DEFAULT 'reader',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await db.query(createTableQuery);
    console.log('Table "users" verified/created successfully.');

    // Step 4: Dummy Users Data
    const dummyUsers = [
      {
        full_name: 'Admin',
        email: 'admin@gmail.com',
        plainPassword: 'admin123',
        role: 'admin',
      },
      {
        full_name: 'Writer',
        email: 'writer@gmail.com',
        plainPassword: 'Writer123',
        role: 'writer',
      },
      {
        full_name: 'Reader',
        email: 'reader@gmail.com',
        plainPassword: 'Reader123',
        role: 'reader',
      },
    ];

    // Step 5: Hash passwords and insert/update users
    for (const u of dummyUsers) {
      const hashedPassword = await bcrypt.hash(u.plainPassword, 10);
      const insertOrUpdateQuery = `
        INSERT INTO users (full_name, email, password, role)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          password = VALUES(password),
          role = VALUES(role);
      `;
      await db.execute(insertOrUpdateQuery, [u.full_name, u.email, hashedPassword, u.role]);
      console.log(`User [${u.role.toUpperCase()}] ${u.email} seeded successfully.`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    await db.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:');
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
