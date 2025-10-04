const pool = require('../config/db');

class Workouts {
  // Get all workouts
  static async getAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM workouts ORDER BY date DESC, created_at DESC'
      );
      return result.rows;
    } catch (err) {
      console.error('Error fetching workouts:', err);
      throw err;
    }
  }

  // Create new workout
  static async create(date) {
    try {
      const result = await pool.query(
        'INSERT INTO workouts (date) VALUES ($1) RETURNING id',
        [date]
      );
      return result.rows[0].id;
    } catch (err) {
      console.error('Error creating workout:', err);
      throw err;
    }
  }

  // Delete workout (exercises will be deleted automatically due to CASCADE)
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM workouts WHERE id = $1',
        [id]
      );
      return result.rowCount > 0;
    } catch (err) {
      console.error('Error deleting workout:', err);
      throw err;
    }
  }

  // Get single workout by ID
  static async getById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM workouts WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching workout:', err);
      throw err;
    }
  }
}

module.exports = Workouts;