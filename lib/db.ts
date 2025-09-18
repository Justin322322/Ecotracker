import mysql from 'mysql2/promise';

let pool: mysql.Pool | undefined;

export function getDbPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.MYSQL_HOST ?? 'localhost';
    const port = Number(process.env.MYSQL_PORT ?? '3306');
    const user = process.env.MYSQL_USER ?? 'root';
    const password = process.env.MYSQL_PASSWORD ?? '';
    const database = process.env.MYSQL_DATABASE ?? 'ecotracker';

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 10,
      namedPlaceholders: true,
    });
  }
  return pool;
}
;


