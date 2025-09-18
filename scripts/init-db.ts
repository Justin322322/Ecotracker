import 'dotenv/config';
import mysql from 'mysql2/promise';

async function main() {
  const host = process.env.MYSQL_HOST ?? 'localhost';
  const port = Number(process.env.MYSQL_PORT ?? '3306');
  const user = process.env.MYSQL_USER ?? 'root';
  const password = process.env.MYSQL_PASSWORD ?? '';
  const database = process.env.MYSQL_DATABASE ?? 'ecotracker';

  // Connect without db to create it if missing
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.end();

  const pool = mysql.createPool({ host, port, user, password, database, namedPlaceholders: true });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.end();
  // eslint-disable-next-line no-console
  console.log(`Database '${database}' ready.`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('DB init failed:', err);
  process.exit(1);
});


