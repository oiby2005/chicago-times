const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'wsj_db',
});

conn.query('ALTER TABLE users ADD COLUMN is_default_admin TINYINT(1) DEFAULT 0', (err) => {
  if (err && err.code !== 'ER_DUP_FIELDNAME') {
    console.log('Alter notice:', err.message);
  } else {
    console.log('is_default_admin column added or verified');
  }

  const defaultEmails = [
    'akramyoonos006@gmail.com',
    'ishmithabimsarani@gmail.com',
    'geethliyanage979@gmail.com',
  ];

  conn.query(
    'UPDATE users SET is_default_admin = 1 WHERE LOWER(email) IN (?, ?, ?)',
    defaultEmails,
    (err2, res) => {
      if (err2) {
        console.error('Update error:', err2.message);
      } else {
        console.log(`Updated ${res.affectedRows} default admin rows to is_default_admin = 1`);
      }

      conn.query('SELECT id, full_name, email, role, is_default_admin FROM users', (err3, rows) => {
        console.log('Users in Database:', rows);
        conn.end();
      });
    }
  );
});
