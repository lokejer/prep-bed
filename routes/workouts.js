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
    added: req.query.added // will be "1" if redirected from endpoint '/add-exercise'
  });
});

// log exercises into my new workout
router.post('/add-exercise', (req, res) => {
  console.log(req.body) // this is just an object of all the labels&inputs you submitted in the form
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
  workouts.push(
    {
      id: 1,
      date: '2025-09-21',
      exercises: [
        { name: 'Pullups', weight: 'BW', sets: [3, 3, 2] },
        { name: 'Bicep Curls', weight: 8, sets: [10, 10, 9] },
        { name: 'one set', weight: 96, sets: [5] },
        { name: 'Tricep Pulldowns', weight: 27, sets: [10, 8, 5] },
        { name: 'test', weight: 68, sets: [5, 5] }
      ]
    }
  )
});
  
// create workout
router.post('/create-workout', async (req, res) => {
  if (exercises.length === 0) return res.send("Cannot create empty workout!");

  // const newWorkout = {
  //   id: workouts.length + 1,
  //   date: new Date().toISOString().split('T')[0],
  //   exercises: []
  // };

  // exercises.forEach(e => newWorkout.exercises.push(e));

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
      console.log("Exercises successfully added to workout.")
    };

    // 3: clear temporary exercises
    exercises = [];
    res.redirect('/workouts');
  }
  catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while creating your workout. Please try again.")
  };
    
  // if (newWorkout.exercises.length > 0) {  
  //   workouts.push(newWorkout);
  //   exercises = [];
  //   console.log("Workout created", workouts);
  //   res.redirect('/workouts');
  // } else {
  //   res.send("Cannot create empty workout!");
  // };
});

// edit/delete exercises
router.route('/:workoutId/edit-exercise/:exerciseID')

  // edit exercise details (name, sets&reps)
  .put(async (req, res) => {
    const { exerciseID } = req.params;
    const { name, weight, set1, set2, set3 } = req.body;

    try {
      await Exercises.update(exerciseID, { name, weight, set1, set2, set3 });
      res.redirect('/workouts');
    }
    catch (err) {
      console.error(err);
      res.status(500).send("Failed to update exercise. Please try again");
    }

    // const workout = workouts.find(w => w.id === parseInt(workoutId));
    // if (!workout) return res.status(404).send("Workout not found");

    // const exercise = workout.exercises[exerciseID];
    // if (!exercise) return res.status(404).send("Exercise not found");

    // update name
    // exercise.name = name;
    // exercise.weight = weight;

    // update sets & reps
    // const updateSet = (setsArray, setNumber, reps) => {
    //   const index = setNumber - 1; // array index
    //   if (reps) {
    //     if (setsArray[index]) {
    //       setsArray[index].reps = parseInt(reps);
    //     } else {
    //       setsArray.push({ setNumber: setNumber, reps: parseInt(reps) });
    //     }
    //   }
    // };

    // updateSet(exercise.sets, 1, set1);
    // updateSet(exercise.sets, 2, set2);
    // updateSet(exercise.sets, 3, set3);

    // console.log("Exercise updated:", exercise);
    // res.redirect('/workouts')
  })

  // delete individual exercises in a workout
  .delete(async (req, res) => {
    const { workoutId, exerciseID } = req.params;

    // const workout = workouts.find(w => w.id === parseInt(workoutId));
    // if (!workout) return res.status(404).send("Workout not found");

    try {
      await Exercises.delete(exerciseID);
      res.redirect('/workouts');
    }
    catch(err) {
      console.error(err);
      res.status(500).send("Failed to delete exercise. Please try again");
    }
  });

// delete workout
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  // remove from workouts array
  // workouts = workouts.filter(w => w.id !== id);

  // delete workout
  try {
    await Workouts.delete(id);
    console.log(`Workout deleted. ID: ${id}`);
    res.redirect('/workouts');
  }
  catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete workout. Please try again")
  }

  console.log(`Workout deleted. ID: ${id}`);
  res.redirect('/workouts');
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
    res.status(500).send("An error occurred while fetching your workouts. Please try again.");
  }
});

// router.param('id', (req, res, next, id) => {
//   console.log(id);
//   next();
// });

module.exports = router;