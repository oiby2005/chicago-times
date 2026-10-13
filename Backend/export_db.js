const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function exportDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'timeschicago_db';

  console.log(`Connecting to MySQL database "${database}" for export...`);

  try {
    const conn = await mysql.createConnection({ host, user, password, database });

    let sqlOutput = `-- Times Chicago MySQL Database Dump\n`;
    sqlOutput += `-- Exported on: ${new Date().toISOString()}\n`;
    sqlOutput += `-- Database: ${database}\n\n`;
    sqlOutput += `CREATE DATABASE IF NOT EXISTS \`${database}\`;\n`;
    sqlOutput += `USE \`${database}\`;\n\n`;

    const [tables] = await conn.query('SHOW TABLES');
    const tableKey = `Tables_in_${database}`;

    for (const row of tables) {
      const tableName = row[tableKey] || Object.values(row)[0];
      if (!tableName) continue;

      sqlOutput += `-- --------------------------------------------------------\n`;
      sqlOutput += `-- Table structure for table \`${tableName}\`\n`;
      sqlOutput += `-- --------------------------------------------------------\n`;
      sqlOutput += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;

      const [createTableResult] = await conn.query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableSql = createTableResult[0]['Create Table'];
      sqlOutput += `${createTableSql};\n\n`;

      const [dataRows] = await conn.query(`SELECT * FROM \`${tableName}\``);
      if (dataRows.length > 0) {
        sqlOutput += `-- Dumping data for table \`${tableName}\`\n`;
        for (const dataRow of dataRows) {
          const keys = Object.keys(dataRow).map((k) => `\`${k}\``).join(', ');
          const values = Object.values(dataRow).map((v) => {
            if (v === null || v === undefined) return 'NULL';
            if (typeof v === 'number') return v;
            if (typeof v === 'boolean') return v ? 1 : 0;
            if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
            return `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
          }).join(', ');

          sqlOutput += `INSERT INTO \`${tableName}\` (${keys}) VALUES (${values});\n`;
        }
        sqlOutput += `\n`;
      }
    }

    await conn.end();

    const dumpPath = path.join(__dirname, 'database', 'timeschicago_db.sql');
    fs.writeFileSync(dumpPath, sqlOutput, 'utf-8');

    console.log(`✅ Successfully exported "${database}" to ${dumpPath}`);
  } catch (err) {
    console.error('❌ Failed to export MySQL database:', err.message);
  }
}

exportDatabase();
