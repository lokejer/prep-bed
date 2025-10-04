const pool = require('./config/db');

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');

    // create workouts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workouts (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Workouts table created');

    // create exercises table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        workout_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        weight VARCHAR(50),
        set1 INTEGER,
        set2 INTEGER,
        set3 INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Exercises table created');

    // Create index for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id)
    `);
    console.log('✅ Index created');

    console.log('🎉 Database setup complete!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Database setup failed:', err);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();