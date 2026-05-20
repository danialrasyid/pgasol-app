const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pgasol_db'
  });

  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash  = await bcrypt.hash('user123', 10);

  await conn.execute(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?)',
    ['admin', adminHash, 'admin', 'user1', userHash, 'user']
  );

  console.log('Users seeded!');
  await conn.end();
}

seed();