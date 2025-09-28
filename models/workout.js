const { pool, sequelize, DataTypes } = require('./db');

const Workouts = {
    async create(date) {
        const [result] = await pool.execute(
            'INSERT INTO workouts (date) VALUES (?)',
            [date]
        );
        return result.insertId; // return workout ID
    },

    async getAll() {
        const [workouts] = await pool.execute('SELECT * FROM workouts ORDER BY date DESC');
        return workouts;
    },

    async delete(id) {
        await pool.execute('DELETE FROM workouts WHERE id = ?', [id]);
    }
};

module.exports = Workouts;