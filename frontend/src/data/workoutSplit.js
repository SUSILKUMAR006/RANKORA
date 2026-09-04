export const WEEKLY_WORKOUT_SPLIT = {
  0: {
    dayName: 'Sunday',
    shortDay: 'SUN',
    focus: 'REST & RECOVERY',
    subtitle: 'Neural Restoration & Mobility Protocol',
    isRestDay: true,
    targetMuscles: ['Cardiovascular', 'Mobility', 'Central Nervous System'],
    exercises: [
      { id: 'sun-1', name: 'Full Body Mobility & Dynamic Stretching', sets: '1 Session', reps: '15-20 Mins', notes: 'Hip openers, thoracic spine rotations, shoulder dislocates' },
      { id: 'sun-2', name: 'Zone 2 Light Recovery Walk', sets: '1 Walk', reps: '30-45 Mins', notes: 'Outdoor light aerobic movement, nasal breathing only' },
      { id: 'sun-3', name: 'Hydration & Nutrition Checkpoint', sets: '3 Liters', reps: 'All Day', notes: 'Replenish electrolytes and prepare for Monday Chest workout' },
    ],
  },
  1: {
    dayName: 'Monday',
    shortDay: 'MON',
    focus: 'CHEST & TRICEPS',
    subtitle: 'Push Hypertrophy & Upper Body Power',
    isRestDay: false,
    targetMuscles: ['Pectoralis Major/Minor', 'Anterior Deltoids', 'Triceps Brachii'],
    exercises: [
      { id: 'mon-1', name: 'Incline Dumbbell Bench Press', sets: '4 Sets', reps: '8 - 10 Reps', notes: 'Target upper clavicular chest with 30-degree bench angle' },
      { id: 'mon-2', name: 'Barbell Flat Bench Press', sets: '4 Sets', reps: '6 - 8 Reps', notes: 'Heavy progressive overload with controlled eccentric' },
      { id: 'mon-3', name: 'Incline Cable / Dumbbell Flyes', sets: '3 Sets', reps: '12 - 15 Reps', notes: 'Focus on deep chest stretch and peak contraction' },
      { id: 'mon-4', name: 'Tricep Rope Pushdowns', sets: '4 Sets', reps: '12 - 15 Reps', notes: 'Spread the rope at the bottom for lateral head lock' },
      { id: 'mon-5', name: 'Overhead Dumbbell Tricep Extension', sets: '3 Sets', reps: '10 - 12 Reps', notes: 'Full long head stretch behind the head' },
      { id: 'mon-6', name: 'Bodyweight Chest Dips / Pushups', sets: '3 Sets', reps: 'To Failure', notes: 'Burnout finisher with forward torso lean' },
    ],
  },
  2: {
    dayName: 'Tuesday',
    shortDay: 'TUE',
    focus: 'BACK & BICEPS',
    subtitle: 'Pull Hypertrophy & Posterior Chain',
    isRestDay: false,
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Trapezius', 'Biceps Brachii'],
    exercises: [
      { id: 'tue-1', name: 'Weighted Pull-ups / Lat Pulldowns', sets: '4 Sets', reps: '8 - 10 Reps', notes: 'Full lat stretch at the top, drive elbows to hips' },
      { id: 'tue-2', name: 'Barbell Bent-Over Rows', sets: '4 Sets', reps: '6 - 8 Reps', notes: '45-degree hip hinge, pull to lower ribcage' },
      { id: 'tue-3', name: 'Seated Cable Rows (Neutral Grip)', sets: '3 Sets', reps: '10 - 12 Reps', notes: 'Squeeze shoulder blades together for mid-back thickness' },
      { id: 'tue-4', name: 'Incline Dumbbell Bicep Curls', sets: '4 Sets', reps: '10 - 12 Reps', notes: 'Strict form with full bicep stretch on incline bench' },
      { id: 'tue-5', name: 'Hammer Curls (Dumbbell or Rope)', sets: '3 Sets', reps: '12 - 15 Reps', notes: 'Target brachialis and forearm thickness' },
      { id: 'tue-6', name: 'Face Pulls with Rope', sets: '3 Sets', reps: '15 - 20 Reps', notes: 'Shoulder health and rear delt activation' },
    ],
  },
  3: {
    dayName: 'Wednesday',
    shortDay: 'WED',
    focus: 'LEGS & ABS',
    subtitle: 'Lower Body Strength & Core Stability',
    isRestDay: false,
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Rectus Abdominis'],
    exercises: [
      { id: 'wed-1', name: 'Barbell Back Squats', sets: '4 Sets', reps: '6 - 8 Reps', notes: 'Depth below parallel, brace core with valsalva maneuver' },
      { id: 'wed-2', name: 'Romanian Deadlifts (RDL)', sets: '4 Sets', reps: '8 - 10 Reps', notes: 'Slow eccentric, push hips back for deep hamstring stretch' },
      { id: 'wed-3', name: 'Leg Press / Bulgarian Split Squats', sets: '3 Sets', reps: '10 - 12 Reps / leg', notes: 'Quad overload with controlled tempo' },
      { id: 'wed-4', name: 'Lying or Seated Leg Curls', sets: '3 Sets', reps: '12 - 15 Reps', notes: 'Isolate hamstring knee flexion' },
      { id: 'wed-5', name: 'Standing Calf Raises', sets: '4 Sets', reps: '15 - 20 Reps', notes: '2-second hold at peak contraction' },
      { id: 'wed-6', name: 'Hanging Leg Raises / Cable Woodchoppers', sets: '3 Sets', reps: '15 Reps', notes: 'Strict core anti-rotation and spinal flexion' },
    ],
  },
  4: {
    dayName: 'Thursday',
    shortDay: 'THU',
    focus: 'SHOULDERS & ARMS',
    subtitle: 'Deltoid Sculpting & Arm Hypertrophy',
    isRestDay: false,
    targetMuscles: ['Deltoids (Anterior, Lateral, Posterior)', 'Biceps', 'Triceps'],
    exercises: [
      { id: 'thu-1', name: 'Standing Overhead Barbell/Dumbbell Press', sets: '4 Sets', reps: '6 - 8 Reps', notes: 'Lock out overhead with tight glutes and braced core' },
      { id: 'thu-2', name: 'Dumbbell Lateral Raises', sets: '4 Sets', reps: '12 - 15 Reps', notes: 'Lead with elbows, pause slightly at parallel' },
      { id: 'thu-3', name: 'Rear Delt Reverse Flyes', sets: '3 Sets', reps: '15 Reps', notes: 'Isolate rear deltoids on incline bench or pec deck' },
      { id: 'thu-4', name: 'Barbell / EZ-Bar Preacher Curls', sets: '3 Sets', reps: '8 - 10 Reps', notes: 'Strict isolation of the short head of the bicep' },
      { id: 'thu-5', name: 'Skull Crushers (Lying Tricep Extensions)', sets: '3 Sets', reps: '10 - 12 Reps', notes: 'Lower bar to crown of the head with tucked elbows' },
      { id: 'thu-6', name: 'Cable Lateral Raise Burnout', sets: '3 Sets', reps: '15 - 20 Reps', notes: 'Constant cable tension for capped shoulders' },
    ],
  },
  5: {
    dayName: 'Friday',
    shortDay: 'FRI',
    focus: 'UPPER BODY HYPERTROPHY',
    subtitle: 'Chest, Back & Shoulder Density',
    isRestDay: false,
    targetMuscles: ['Chest', 'Lats', 'Upper Back', 'Arms'],
    exercises: [
      { id: 'fri-1', name: 'Incline Barbell Bench Press', sets: '4 Sets', reps: '8 - 10 Reps', notes: 'Explosive concentric with controlled 3-second descent' },
      { id: 'fri-2', name: 'Chest-Supported T-Bar / Dumbbell Rows', sets: '4 Sets', reps: '8 - 10 Reps', notes: 'Zero lower back fatigue, maximal upper back contraction' },
      { id: 'fri-3', name: 'Flat Dumbbell Press', sets: '3 Sets', reps: '10 - 12 Reps', notes: 'Heavy hypertrophy volume' },
      { id: 'fri-4', name: 'Lat Pullovers (Cable or Dumbbell)', sets: '3 Sets', reps: '12 - 15 Reps', notes: 'Full lat stretch from shoulder to hip' },
      { id: 'fri-5', name: 'Superset: Bicep Curls + Tricep Pushdowns', sets: '3 Sets', reps: '12 Reps each', notes: 'Continuous blood flow and peak pump' },
    ],
  },
  6: {
    dayName: 'Saturday',
    shortDay: 'SAT',
    focus: 'LOWER BODY & POWER',
    subtitle: 'Posterior Power & Functional Strength',
    isRestDay: false,
    targetMuscles: ['Glutes', 'Hamstrings', 'Quads', 'Core'],
    exercises: [
      { id: 'sat-1', name: 'Conventional or Trap Bar Deadlifts', sets: '4 Sets', reps: '5 - 6 Reps', notes: 'Maximum posterior chain recruitment and grip strength' },
      { id: 'sat-2', name: 'Front Squats or Goblet Squats', sets: '3 Sets', reps: '8 - 10 Reps', notes: 'Upright posture targeting anterior quadriceps' },
      { id: 'sat-3', name: 'Walking Dumbbell Lunges', sets: '3 Sets', reps: '12 Reps / leg', notes: 'Glute and quad stabilization' },
      { id: 'sat-4', name: 'Seated Calf Raises', sets: '4 Sets', reps: '15 - 20 Reps', notes: 'Soleus calf muscle hypertrophy' },
      { id: 'sat-5', name: 'Planks & Ab Wheel Rollouts', sets: '3 Sets', reps: '60s / 10 Rollouts', notes: 'Anti-extension core finisher' },
    ],
  },
}

export function getTodayWorkoutPlan() {
  const dayIndex = new Date().getDay()
  return WEEKLY_WORKOUT_SPLIT[dayIndex] || WEEKLY_WORKOUT_SPLIT[1]
}

export function getWorkoutStorageKey(dayIndex) {
  const todayDate = new Date().toISOString().slice(0, 10)
  return `rankora_workout_progress_${todayDate}_day${dayIndex}`
}

export function getStoredExerciseStatus(dayIndex) {
  try {
    const raw = localStorage.getItem(getWorkoutStorageKey(dayIndex))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function toggleExerciseCompleted(dayIndex, exerciseId) {
  const current = getStoredExerciseStatus(dayIndex)
  const updated = {
    ...current,
    [exerciseId]: !current[exerciseId],
  }
  try {
    localStorage.setItem(getWorkoutStorageKey(dayIndex), JSON.stringify(updated))
    window.dispatchEvent(new Event('rankora-workout-updated'))
  } catch {
    // ignore
  }
  return updated
}
