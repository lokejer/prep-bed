const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',        // your MySQL username
  password: '',        // your MySQL password
  database: 'workout_app' // name of your database
});

module.exports = db;