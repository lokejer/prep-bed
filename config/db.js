const { Pool } = require('pg');
require('dotenv').config();

// create connection pool for PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// test connection
pool.query('SELECT NOW()')
  .then(() => console.log('connected to db successfully.'))
  .catch(err => console.error('❌ db connection failed:', err.message));

module.exports = pool;