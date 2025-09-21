const express = require("express");
const router = express.Router();

let workouts = [];
let exercises = [];

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
router.post('/create-workout', (req, res) => {

  const newWorkout = {
    id: workouts.length + 1,
    date: new Date().toISOString().split('T')[0],
    exercises: []
  };

  exercises.forEach(e => newWorkout.exercises.push(e));
  console.log(newWorkout)
    
  if (newWorkout.exercises.length > 0) {  
    workouts.push(newWorkout);
    exercises = [];
    console.log("Workout created", workouts);
    res.redirect('/workouts');
  } else {
    res.send("Cannot create empty workout!");
  }
})

// edit/delete exercises
router.route('/:workoutId/edit-exercise/:exerciseIndex')

  // edit exercise details (name, sets&reps)
  .put((req, res) => {
    const { workoutId, exerciseIndex } = req.params;
    const { name, weight, set1, set2, set3 } = req.body;

    const workout = workouts.find(w => w.id === parseInt(workoutId));
    if (!workout) return res.status(404).send("Workout not found");

    const exercise = workout.exercises[exerciseIndex];
    if (!exercise) return res.status(404).send("Exercise not found");

    // update name
    exercise.name = name;
    exercise.weight = weight;

    // update sets & reps
    const updateSet = (setsArray, setNumber, reps) => {
      const index = setNumber - 1; // array index
      if (reps) {
        if (setsArray[index]) {
          setsArray[index].reps = parseInt(reps);
        } else {
          setsArray.push({ setNumber: setNumber, reps: parseInt(reps) });
        }
      }
    };

    updateSet(exercise.sets, 1, set1);
    updateSet(exercise.sets, 2, set2);
    updateSet(exercise.sets, 3, set3);

    console.log("Exercise updated:", exercise);
    res.redirect('/workouts')
  })

  // delete individual exercises in a workout
  .delete((req, res) => {
    const { workoutId, exerciseIndex } = req.params;

    const workout = workouts.find(w => w.id === parseInt(workoutId));
    if (!workout) return res.status(404).send("Workout not found");

    // Remove the exercise at that index
    workout.exercises.splice(exerciseIndex, 1);

    console.log(`Exercise deleted. Remaining exercises:`, workout.exercises);
    res.redirect('/workouts');
  });

// delete workout
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // remove from workouts array
  workouts = workouts.filter(w => w.id !== id);

  console.log(`Workout deleted. ID: ${id}`);
  res.redirect('/workouts');
});

// route for /workouts
router.get('/', (req, res) => {
  res.render('workouts', { workouts });
});

// router.param('id', (req, res, next, id) => {
//   console.log(id);
//   next();
// });

module.exports = router;