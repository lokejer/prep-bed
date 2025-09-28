const { pool, sequelize, DataTypes } = require('../config/db');

// Workout table
const Workout = sequelize.define("Workout", {
  name: { type: DataTypes.STRING, allowNull: false },
});

// Exercise table (belongs to a workout)
const Exercise = sequelize.define("Exercise", {
  name: { type: DataTypes.STRING, allowNull: false },
});

// Set table (belongs to an exercise)
const Set = sequelize.define("Set", {
  reps: { type: DataTypes.INTEGER, allowNull: false },
});

// Relations
Workout.hasMany(Exercise, { onDelete: "CASCADE" });
Exercise.belongsTo(Workout);

Exercise.hasMany(Set, { onDelete: "CASCADE" });
Set.belongsTo(Exercise);

// Sync models (creates tables if not exist)
sequelize.sync();

module.exports = { Workout, Exercise, Set };