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

    // Step 3: Create users and posts tables with profile & article columns
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'writer', 'reader') NOT NULL DEFAULT 'reader',
        bio TEXT DEFAULT NULL,
        avatar_url LONGTEXT DEFAULT NULL,
        linkedin VARCHAR(255) DEFAULT NULL,
        is_default_admin TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await db.query(createUsersTableQuery);

    const createPostsTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        slug VARCHAR(255) NOT NULL,
        subheadline TEXT DEFAULT NULL,
        cardSummary TEXT DEFAULT NULL,
        bodyContent LONGTEXT DEFAULT NULL,
        category VARCHAR(100) DEFAULT NULL,
        subCategories JSON DEFAULT NULL,
        homepagePlacement VARCHAR(100) DEFAULT NULL,
        author VARCHAR(150) DEFAULT NULL,
        authorEmail VARCHAR(150) DEFAULT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Drafts',
        thumbnail LONGTEXT DEFAULT NULL,
        photoCaption TEXT DEFAULT NULL,
        tags JSON DEFAULT NULL,
        readDuration VARCHAR(50) DEFAULT NULL,
        views INT DEFAULT 0,
        publishedAt BIGINT DEFAULT 0,
        date VARCHAR(100) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await db.query(createPostsTableQuery);

    const createSavedArticlesTableQuery = `
      CREATE TABLE IF NOT EXISTS saved_articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_email VARCHAR(150) NOT NULL,
        article_id VARCHAR(100) NOT NULL,
        article_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_article (user_email, article_id)
      );
    `;
    await db.query(createSavedArticlesTableQuery);

    const createNewsletterTableQuery = `
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) NOT NULL UNIQUE,
        newsletters JSON DEFAULT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(createNewsletterTableQuery);

    const createWsjAdSlotsTableQuery = `
      CREATE TABLE IF NOT EXISTS wsj_ad_slots (
        id VARCHAR(64) PRIMARY KEY,
        slot_name VARCHAR(255) NOT NULL,
        dimension VARCHAR(64) NOT NULL,
        placement_group VARCHAR(64) NOT NULL,
        description TEXT DEFAULT NULL,
        active TINYINT(1) DEFAULT 1,
        action_type VARCHAR(128) DEFAULT 'External Link (URL)',
        target_url TEXT DEFAULT NULL,
        selected_article_slug VARCHAR(255) DEFAULT NULL,
        image_url TEXT DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await db.query(createWsjAdSlotsTableQuery);

    // Safely add missing columns & upgrade status column if upgrading existing database
    try { await db.query('ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL;'); } catch (e) {}
    try { await db.query('ALTER TABLE users ADD COLUMN avatar_url LONGTEXT DEFAULT NULL;'); } catch (e) {}
    try { await db.query('ALTER TABLE users ADD COLUMN linkedin VARCHAR(255) DEFAULT NULL;'); } catch (e) {}
    try { await db.query('ALTER TABLE users ADD COLUMN is_default_admin TINYINT(1) DEFAULT 0;'); } catch (e) {}
    try { await db.query('ALTER TABLE posts MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT "Drafts";'); } catch (e) {}
    try { await db.query('ALTER TABLE newsletter_subscriptions ADD COLUMN newsletters JSON DEFAULT NULL;'); } catch (e) {}

    // Reset non-default admin flags in MySQL
    try {
      await db.query(
        "UPDATE users SET is_default_admin = 0 WHERE LOWER(email) NOT IN ('akramyoonos006@gmail.com', 'geethliyanage979@gmail.com', 'timeschicago17@gmail.com')"
      );
    } catch (e) {}

    console.log('Tables "users", "posts", "saved_articles", "newsletter_subscriptions", "wsj_ad_slots" verified/created successfully.');

    // Step 4: Required Accounts
    const dummyUsers = [
      {
        full_name: 'Akram Yanoos',
        email: 'akramyoonos006@gmail.com',
        plainPassword: 'Admin123',
        role: 'admin',
        bio: 'Default System Administrator',
        linkedin: '',
        is_default_admin: 1,
      },
      {
        full_name: 'Geeth Liyanage',
        email: 'geethliyanage979@gmail.com',
        plainPassword: 'Admin123',
        role: 'admin',
        bio: 'Default System Administrator',
        linkedin: '',
        is_default_admin: 1,
      },
      {
        full_name: 'Times Chicago',
        email: 'timeschicago17@gmail.com',
        plainPassword: 'times+chicago1724##',
        role: 'admin',
        bio: 'Default System Administrator',
        linkedin: '',
        is_default_admin: 1,
      },
      {
        full_name: 'Admin User',
        email: 'admin@gmail.com',
        plainPassword: 'admin123',
        role: 'admin',
        bio: 'System Administrator',
        linkedin: '',
        is_default_admin: 0,
      },
      {
        full_name: 'Writer User',
        email: 'writer@gmail.com',
        plainPassword: 'writer123',
        role: 'writer',
        bio: 'Journalist & Columnist covering business, economic policy, and global markets.',
        linkedin: 'https://www.linkedin.com/in/your-profile',
        is_default_admin: 0,
      },
      {
        full_name: 'writer1',
        email: 'writer1@gmail.com',
        plainPassword: 'writer456',
        role: 'writer',
        bio: 'Journalist & Writer covering technology, innovation, and global developments.',
        linkedin: 'https://www.linkedin.com/in/your-profile',
        is_default_admin: 0,
      },
      {
        full_name: 'Reader User',
        email: 'reader@gmail.com',
        plainPassword: 'reader123',
        role: 'reader',
        bio: 'Avid Reader and Community Subscriber',
        linkedin: '',
        is_default_admin: 0,
      },
    ];

    // Step 5: Hash passwords and insert/update users by unique email
    for (const u of dummyUsers) {
      const hashedPassword = await bcrypt.hash(u.plainPassword, 10);
      const insertOrUpdateQuery = `
        INSERT INTO users (full_name, email, password, role, bio, linkedin, is_default_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          full_name = VALUES(full_name),
          password = VALUES(password),
          role = VALUES(role),
          bio = VALUES(bio),
          linkedin = VALUES(linkedin),
          is_default_admin = VALUES(is_default_admin);
      `;
      await db.execute(insertOrUpdateQuery, [u.full_name, u.email, hashedPassword, u.role, u.bio, u.linkedin, u.is_default_admin]);
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
