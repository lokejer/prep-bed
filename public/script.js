document.addEventListener("DOMContentLoaded", () => {
  const editExerciseModal = document.getElementById("editExerciseModal");
  const editForm = document.getElementById("editExerciseForm");
  const nameInput = document.getElementById("exerciseName");
  const set1RepsInput = document.getElementById("set1Reps");
  const set2RepsInput = document.getElementById("set2Reps");
  const set3RepsInput = document.getElementById("set3Reps");

  editExerciseModal.addEventListener("show.bs.modal", event => {
    const button = event.relatedTarget;

    const workoutId = button.getAttribute("data-workout-id");
    const exerciseId = button.getAttribute("data-exercise-id");
    const exerciseName = button.getAttribute("data-exercise-name");
    const set1Reps = button.getAttribute("data-set1-reps");
    const set2Reps = button.getAttribute("data-set2-reps");
    const set3Reps = button.getAttribute("data-set3-reps");

    // point form to /workouts/:workoutId/edit-exercise/:exerciseId
    editForm.action = `/workouts/${workoutId}/edit-exercise/${exerciseId}?_method=PUT`;

    // fill inputs
    nameInput.value = exerciseName;
    set1RepsInput.value = set1Reps;
    set2RepsInput.value = set2Reps;
    set3RepsInput.value = set3Reps;
  });
});