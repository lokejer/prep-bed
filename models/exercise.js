const pool = require('../config/db');

class Exercises {
  // GET all exercises for a specific workout
  static async getByWorkout(workoutId) {
    try {
      const result = await pool.query(
        'SELECT * FROM exercises WHERE workout_id = $1 ORDER BY created_at ASC',
        [workoutId]
      );
      return result.rows;
    } catch (err) {
      console.error('❌ ERROR fetching exercises:', err);
      throw err;
    }
  }

  // CREATE new exercise
  static async create(workoutId, exerciseData) {
    try {
      const { name, weight, set1, set2, set3 } = exerciseData; // exerciseData is an object, this line labels each value inside the object.
      const result = await pool.query(
        'INSERT INTO exercises (workout_id, name, weight, set1, set2, set3) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [workoutId, name, weight, set1, set2, set3]
      );
      return result.rows[0].id;
    } catch (err) {
      console.error('❌ ERROR creating exercise:', err);
      throw err;
    }
  }

  // UPDATE exercise
  static async update(exerciseId, exerciseData) {
    try {
      const { name, weight, set1, set2, set3 } = exerciseData;
      const result = await pool.query(
        'UPDATE exercises SET name = $1, weight = $2, set1 = $3, set2 = $4, set3 = $5 WHERE id = $6',
        [name, weight, set1, set2, set3, exerciseId]
      );
      return result.rowCount > 0;
    } catch (err) {
      console.error('❌ ERROR updating exercise:', err);
      throw err;
    }
  }

  // DELETE exercise
  static async delete(exerciseId) {
    try {
      const result = await pool.query(
        'DELETE FROM exercises WHERE id = $1',
        [exerciseId]
      );
      return result.rowCount > 0;
    } catch (err) {
      console.error('❌ ERROR deleting exercise:', err);
      throw err;
    }
  }

  // GET single exercise by ID
  static async getById(exerciseId) {
    try {
      const result = await pool.query(
        'SELECT * FROM exercises WHERE id = $1',
        [exerciseId]
      );
      return result.rows[0];
    } catch (err) {
      console.error('❌ ERROR fetching exercise:', err);
      throw err;
    }
  }
}

module.exports = Exercises;