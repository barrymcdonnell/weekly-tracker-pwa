
const workoutPlan = {
  Monday: ["Push-ups", "Dumbbell Chest Press", "Plank (30s)"],
  Tuesday: ["30-min Cardio Session (Run or Cycle)"],
  Wednesday: ["Rest or Yoga"],
  Thursday: ["Resistance Band Chest Fly", "Push-ups", "Skipping (2 mins)"],
  Friday: ["TRX Chest Press", "Dumbbell Overhead Press", "Core: Bicycle Crunches (20 reps)"],
  Saturday: ["Rest"],
  Sunday: ["Bodyweight Circuit: 3 rounds - Push-ups, Squats, Mountain Climbers"]
};

const mobilityExercises = [
  "90/90 Hip Switches (1 min)",
  "Hip Flexor Stretch (2 min per side)",
  "Adductor Rockbacks (2 min total)",
  "Standing Hip Abduction Swings (1 min per leg)",
  "Glute Bridge with March (1 min)"
];

function createDayCard(day) {
  const container = document.getElementById("tracker");
  const card = document.createElement("div");
  card.className = "card mb-3";
  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h5");
  title.className = "card-title";
  title.innerText = day;

  const workout = document.createElement("p");
  workout.className = "card-text";
  workout.innerHTML = "<strong>Workout:</strong><br>" + (workoutPlan[day] || []).join("<br>");

  const workoutCheck = document.createElement("input");
  workoutCheck.type = "checkbox";
  workoutCheck.id = `done-${day}`;
  workoutCheck.className = "form-check-input me-2";
  workoutCheck.onchange = () => saveDayData(day, "completed", workoutCheck.checked);

  const workoutLabel = document.createElement("label");
  workoutLabel.innerText = "Workout Done";
  workoutLabel.className = "form-check-label";
  workoutLabel.htmlFor = `done-${day}`;

  const workoutFormGroup = document.createElement("div");
  workoutFormGroup.className = "form-check mb-2";
  workoutFormGroup.appendChild(workoutCheck);
  workoutFormGroup.appendChild(workoutLabel);

  const mobilityTitle = document.createElement("p");
  mobilityTitle.innerHTML = "<strong>Mobility (10 mins):</strong><br>" + mobilityExercises.join("<br>");

  const mobilityCheck = document.createElement("input");
  mobilityCheck.type = "checkbox";
  mobilityCheck.id = `mobility-${day}`;
  mobilityCheck.className = "form-check-input me-2";
  mobilityCheck.onchange = () => saveDayData(day, "mobility", mobilityCheck.checked);

  const mobilityLabel = document.createElement("label");
  mobilityLabel.innerText = "Mobility Done";
  mobilityLabel.className = "form-check-label";
  mobilityLabel.htmlFor = `mobility-${day}`;

  const mobilityFormGroup = document.createElement("div");
  mobilityFormGroup.className = "form-check mb-3";
  mobilityFormGroup.appendChild(mobilityCheck);
  mobilityFormGroup.appendChild(mobilityLabel);

  const macros = createMacrosInputs(day);
  const steps = createInputGroup(day, "steps", "Steps");
  const sleep = createInputGroup(day, "sleep", "Sleep (hrs)");
  const water = createInputGroup(day, "water", "Water (litres)");
  const notes = createTextArea(day, "notes", "Notes");

  body.append(title, workout, workoutFormGroup, mobilityTitle, mobilityFormGroup, macros, steps, sleep, water, notes);
  card.appendChild(body);
  container.appendChild(card);

  loadDayData(day);
}
