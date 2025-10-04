const pool = require('../config/db');

/*
  static allows me to call the function immediately without having to create an instance of class Workouts 
  eg: 
  i can do Workouts.getAll() straight away instead of 
  let w = Workouts()
  w.getAll()
*/

class Workouts {
  // READ all workouts
  static async getAll() {
    try {
      const result = await pool.query(
        'SELECT * FROM workouts ORDER BY date DESC, created_at DESC'
      );
      return result.rows;
    } catch (err) {
      console.error('❌ ERROR fetching workouts:', err);
      throw err;
    };
  };

  // CREATE new workout
  static async create(date) {
    try {
      const result = await pool.query(
        'INSERT INTO workouts (date) VALUES ($1) RETURNING id',
        [date] // $1 above is substituted with the date variable's value
      );
      return result.rows[0].id;
    } catch (err) {
      console.error('❌ ERROR creating workout:', err);
      throw err;
    };
  };

  // Delete workout (exercises will be deleted automatically due to CASCADE)
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM workouts WHERE id = $1',
        [id]
      );
      // ON DELETE CASCADE means children exercises of this workout are also deleted. 
      // the foreign key workout_id figures out which exercises belong to this workout
      return result.rowCount > 0;
    } catch (err) {
      console.error('❌ ERROR deleting workout:', err);
      throw err;
    };
  };

  // GET single workout by ID
  static async getById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM workouts WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      console.error('❌ ERROR fetching workout:', err);
      throw err;
    };
  };
};

module.exports = Workouts;