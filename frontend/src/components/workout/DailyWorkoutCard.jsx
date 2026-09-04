import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import QuestVerificationModal from '../quests/QuestVerificationModal.jsx'
import {
  WEEKLY_WORKOUT_SPLIT,
  getStoredExerciseStatus,
  toggleExerciseCompleted,
} from '../../data/workoutSplit.js'
import { completeQuest, getStoredQuests } from '../../hooks/useQuestCompletion.js'

function DailyWorkoutCard({ onQuestCompleted }) {
  const currentDayIndex = new Date().getDay()
  const [selectedDay, setSelectedDay] = useState(currentDayIndex)
  const [completedExercises, setCompletedExercises] = useState(() =>
    getStoredExerciseStatus(selectedDay)
  )
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [gymQuest, setGymQuest] = useState(null)

  const workoutPlan = WEEKLY_WORKOUT_SPLIT[selectedDay]
  const isToday = selectedDay === currentDayIndex

  const refreshWorkoutProgress = () => {
    setCompletedExercises(getStoredExerciseStatus(selectedDay))
    const quests = getStoredQuests()
    const gym = quests.find(
      (q) => q.id === 'gym-workout' || q.title?.toLowerCase().includes('gym')
    )
    setGymQuest(gym || null)
  }

  useEffect(() => {
    refreshWorkoutProgress()
  }, [selectedDay])

  useEffect(() => {
    window.addEventListener('rankora-workout-updated', refreshWorkoutProgress)
    window.addEventListener('storage', refreshWorkoutProgress)
    return () => {
      window.removeEventListener('rankora-workout-updated', refreshWorkoutProgress)
      window.removeEventListener('storage', refreshWorkoutProgress)
    }
  }, [selectedDay])

  const handleToggleExercise = (exerciseId) => {
    const updated = toggleExerciseCompleted(selectedDay, exerciseId)
    setCompletedExercises(updated)
  }

  const totalExercises = workoutPlan.exercises.length
  const completedCount = workoutPlan.exercises.filter(
    (e) => completedExercises[e.id]
  ).length
  const progressPercentage =
    totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0
  const allCompleted = totalExercises > 0 && completedCount === totalExercises
  const gymQuestCompleted = gymQuest?.status === 'completed'

  const handleVerificationSuccess = () => {
    setVerificationOpen(false)
    if (gymQuest) {
      completeQuest(gymQuest.id)
    }
    refreshWorkoutProgress()
    if (onQuestCompleted) onQuestCompleted()
  }

  const dayOrder = [1, 2, 3, 4, 5, 6, 0] // Mon -> Sun

  return (
    <Card variant="highlighted" className="space-y-6">
      {/* Card Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_20px_rgba(103,232,249,0.15)]">
            <Dumbbell size={20} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="label-caps text-cyan-300/80">DAILY WORKOUT SPLIT</p>
              {isToday && (
                <span className="rounded-md bg-cyan-400/20 border border-cyan-300/30 px-2 py-0.5 font-mono text-[0.6rem] font-bold text-cyan-100 uppercase animate-pulse">
                  TODAY'S TARGET
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl mt-0.5">
              {workoutPlan.dayName.toUpperCase()} — {workoutPlan.focus}
            </h2>
          </div>
        </div>

        {/* Quick stats pill */}
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-slate-300">
            {completedCount} / {totalExercises} Done ({progressPercentage}%)
          </span>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {dayOrder.map((dayIdx) => {
          const split = WEEKLY_WORKOUT_SPLIT[dayIdx]
          const isSelected = selectedDay === dayIdx
          const isCurrentToday = currentDayIndex === dayIdx

          return (
            <button
              type="button"
              key={dayIdx}
              onClick={() => setSelectedDay(dayIdx)}
              className={`relative rounded-xl px-3.5 py-2 font-mono text-xs font-semibold transition ${
                isSelected
                  ? 'border border-cyan-300/50 bg-cyan-400/15 text-white shadow-[0_0_16px_rgba(103,232,249,0.2)]'
                  : 'border border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{split.shortDay}</span>
              {isCurrentToday && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Focus Description & Muscle Target */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
        <div>
          <p className="font-display font-medium text-slate-200">{workoutPlan.subtitle}</p>
          <p className="mt-0.5 font-mono text-[0.68rem] text-slate-400">
            Target: {workoutPlan.targetMuscles.join(' · ')}
          </p>
        </div>

        <div className="w-full sm:w-48">
          <ProgressBar
            value={progressPercentage}
            max={100}
            tone="cyan"
            label="Workout Execution"
          />
        </div>
      </div>

      {/* Interactive Exercises Checklist */}
      <div className="space-y-3">
        <p className="label-caps text-slate-400">EXERCISE CHECKLIST (ONE BY ONE)</p>

        <div className="grid gap-2.5">
          {workoutPlan.exercises.map((exercise, index) => {
            const isDone = Boolean(completedExercises[exercise.id])

            return (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className={`flex items-start justify-between gap-3.5 rounded-xl border p-3.5 transition cursor-pointer ${
                  isDone
                    ? 'border-emerald-400/30 bg-emerald-950/15'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
                onClick={() => handleToggleExercise(exercise.id)}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Custom Checkbox */}
                  <button
                    type="button"
                    aria-label={`Toggle ${exercise.name}`}
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-lg border transition ${
                      isDone
                        ? 'border-emerald-400 bg-emerald-400 text-rankora-950 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
                        : 'border-white/20 bg-white/5 text-transparent hover:border-cyan-300/60'
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                  </button>

                  {/* Exercise Title and Sets/Reps */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 font-bold">
                        {index + 1}.
                      </span>
                      <h4
                        className={`font-display text-sm font-semibold transition ${
                          isDone ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {exercise.name}
                      </h4>
                    </div>

                    <p className="mt-1 font-mono text-[0.68rem] text-slate-400">
                      {exercise.notes}
                    </p>
                  </div>
                </div>

                {/* Sets & Reps Pill */}
                <div className="shrink-0 text-right font-mono text-xs">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-cyan-200 font-semibold block">
                    {exercise.sets}
                  </span>
                  <span className="mt-1 block text-[0.62rem] text-slate-400">
                    {exercise.reps}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Completion & Gym Photo Proof Upload Footer */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {gymQuestCompleted ? (
            <div className="flex items-center gap-2 text-emerald-300 font-display text-sm font-semibold">
              <CheckCircle2 size={16} />
              <span>TODAY'S WORKOUT QUEST VERIFIED & COMPLETED (+50 XP, +2 STR)</span>
            </div>
          ) : allCompleted ? (
            <div>
              <p className="font-display text-sm font-bold text-emerald-300">
                ALL EXERCISES COMPLETED!
              </p>
              <p className="text-xs text-slate-300">
                Upload your gym proof photo to verify and claim +50 XP and +2 STR.
              </p>
            </div>
          ) : (
            <div>
              <p className="font-display text-sm font-semibold text-white">
                Workout in Progress
              </p>
              <p className="text-xs text-slate-400">
                Complete your exercises and upload photo proof to finish the Gym quest.
              </p>
            </div>
          )}
        </div>

        {!gymQuestCompleted && (
          <Button
            type="button"
            variant={allCompleted ? 'primary' : 'secondary'}
            onClick={() => setVerificationOpen(true)}
            className="min-w-48 text-xs"
          >
            <Camera size={15} /> UPLOAD GYM PROOF PHOTO
          </Button>
        )}
      </div>

      {/* Gym Photo Verification Modal */}
      {verificationOpen && gymQuest && (
        <QuestVerificationModal
          open={verificationOpen}
          quest={gymQuest}
          onClose={() => setVerificationOpen(false)}
          onVerified={handleVerificationSuccess}
          onSubmitted={handleVerificationSuccess}
        />
      )}
    </Card>
  )
}

export default DailyWorkoutCard
