const { pool, sequelize, DataTypes } = require('./db');

const Exercises = {
    async create(workoutId, { name, weight, set1, set2, set3 }) {
        await pool.execute(
            'INSERT INTO exercises (workout_id, name, weight, set1, set2, set3) VALUES (?, ?, ?, ?, ?, ?)',
            [workoutId, name, weight, set1 || null, set2 || null, set3 || null]
        );
    },

    async getByWorkout(workoutId) {
        const [exercises] = await pool.execute(
            'SELECT * FROM exercises WHERE workout_id = ?',
            [workoutId]
        );
        return exercises;
    },

    async update(id, { name, weight, set1, set2, set3 }) {
        await pool.execute(
            'UPDATE exercises SET name=?, weight=?, set1=?, set2=?, set3=? WHERE id=?',
            [name, weight, set1 || null, set2 || null, set3 || null, id]
        );
    },

    async delete(id) {
        await pool.execute('DELETE FROM exercises WHERE id=?', [id]);
    }
};

module.exports = Exercises;