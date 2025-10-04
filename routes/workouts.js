const express = require("express");
const router = express.Router();

// import database methods
const Workouts = require('../models/workout');
const Exercises = require('../models/exercise');
let exercises = []; // temporarily store user-added exercises

// route for /workouts/new
router.get('/new', (req, res) => {
  res.render('newWorkout', { 
    name: req.query.name || "User",
    added: req.query.added, // will be "1" if redirected from endpoint '/add-exercise'
    exercises: exercises
  });
});

// log exercises into my new workout
router.post('/add-exercise', (req, res) => {
  console.log("Form submitted successfully. req.body:" ,req.body) // this is just an object of all the labels&inputs you submitted in the form
  let {exerciseName, exerciseWeight, set1, set2, set3} = req.body;

  // add exercises to the current workout
  exercises.push({ 
    name: exerciseName,
    weight: exerciseWeight,
    sets: [
      { setNumber: 1, reps: Number(set1) },
      ...(set2 ? [{ setNumber: 2, reps: Number(set2) }] : []),
      ...(set3 ? [{ setNumber: 3, reps: Number(set3) }] : [])
    ]
  });

  // continue to show form on-screen so user can add more exercises if needed
  console.log(`${exerciseName} (${exerciseWeight}) created successfully.`);
  res.redirect('/workouts/new?added=1');
});

// DEV USAGE: create sample workout (for testing)
router.post('/dev-workout', (req, res) => {
  exercises.push();
});
  
// create workout
router.post('/create-workout', async (req, res) => {
  if (exercises.length === 0) return res.send("❌ ERROR: Cannot create empty workout!");

  try {
    // 1: create workout in DB
    const today = new Date();
    const workoutDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const workoutID = await Workouts.create(workoutDate);

    // 2: add exercises linked to this workout
    for (const e of exercises) {
      const set1 = e.sets[0]?.reps || null;
      const set2 = e.sets[1]?.reps || null;
      const set3 = e.sets[2]?.reps || null;

      await Exercises.create(workoutID, {
        name: e.name,
        weight: e.weight,
        set1,
        set2,
        set3
      });
      console.log(`ENDED WORKOUT: successfully added ${e.name}.`)
    };

    // 3: clear temporary exercises
    exercises = [];
    res.redirect('/workouts');
  }
  catch (err) {
    console.error(err);
    res.status(500).send("❌ ERROR: could not create new workout. Please try again.")
  };
});

// edit/delete exercises
router.route('/:workoutId/edit-exercise/:exerciseID')

  // edit exercise details (name, sets&reps)
  .put(async (req, res) => {
    const { exerciseID } = req.params;
    const { name, weight, set1, set2, set3 } = req.body;

    try {
      await Exercises.update(exerciseID, { name, weight, set1, set2, set3 });
      console.log(`edited ${name} successfully.`);
      res.redirect('/workouts');
    }
    catch (err) {
      console.error(err);
      res.status(500).send("❌ ERROR: failed to update exercise. Please try again");
    };
  })

  // delete individual exercises in a workout
  .delete(async (req, res) => {
    const { workoutId, exerciseID } = req.params;

    try {
      await Exercises.delete(exerciseID);
      console.log(`exercise of ID ${exerciseID} in workout of ID ${workoutId} deleted successfully.`);
      res.redirect('/workouts');
    }
    catch(err) {
      console.error(err);
      res.status(500).send("❌ ERROR: Failed to delete exercise. Please try again");
    };
  });

// delete workout
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  // delete workout
  try {
    await Workouts.delete(id);
    console.log(`workout and its constituent exercises deleted successfully. ID: ${id}`);
    res.redirect('/workouts');
  }
  catch (err) {
    console.error(err);
    res.status(500).send("❌ ERROR: Failed to delete workout. Please try again")
  };
});

// route for /workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workouts.getAll();

    // fetch all exercises for each workout
    for (const workout of workouts) {
      const exercises = await Exercises.getByWorkout(workout.id);

      // transform set1/set2/set3 into an array, sets
      workout.exercises = exercises.map(e => ({
        id: e.id,
        name: e.name,
        weight: e.weight,
        sets: [
          e.set1 != null ? { setNumber: 1, reps: e.set1 } : null,
          e.set2 != null ? { setNumber: 2, reps: e.set2 } : null,
          e.set3 != null ? { setNumber: 3, reps: e.set3 } : null,
        ].filter(Boolean) // safety precaution: remove nulls
      }));
    };

    res.render('workouts', { workouts });

  } 
  catch (err) {
    console.error(err);
    res.status(500).send("❌ ERROR: Failed to fetch your workouts. Please try again.");
  };
});

module.exports = router;