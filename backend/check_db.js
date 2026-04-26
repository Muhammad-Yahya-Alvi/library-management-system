const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log('Connected to MySQL');

    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [process.env.DB_NAME]);
    if (databases.length === 0) {
      console.log(`Database ${process.env.DB_NAME} does not exist. Creating it...`);
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created.`);
    } else {
      console.log(`Database ${process.env.DB_NAME} exists.`);
    }

    await connection.query(`USE ${process.env.DB_NAME}`);

    const [tables] = await connection.query("SHOW TABLES LIKE 'books'");
    if (tables.length === 0) {
      console.log("Table 'books' does not exist. Creating it...");
      await connection.query(`
        CREATE TABLE books (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          isbn VARCHAR(50),
          genre VARCHAR(100),
          available_copies INT DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Table 'books' created.");
    } else {
      console.log("Table 'books' exists.");
    }

    const [usersTable] = await connection.query("SHOW TABLES LIKE 'users'");
    if (usersTable.length === 0) {
      console.log("Table 'users' does not exist. Creating it...");
      await connection.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Table 'users' created.");
    } else {
      console.log("Table 'users' exists.");
    }

    await connection.end();
    console.log('Database check complete.');
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

checkDB();
