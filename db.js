const mysql = require('mysql2');
require('dotenv').config();

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log(' Connected to MySQL Database.');
    }
});

module.exports = db;
