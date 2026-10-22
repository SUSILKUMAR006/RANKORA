import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Camera, Check, CheckCircle2, Dumbbell } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import QuestVerificationModal from '../quests/QuestVerificationModal.jsx'
import {
  WEEKLY_WORKOUT_SPLIT,
  getStoredExerciseStatus,
  toggleExerciseCompleted,
} from '../../data/workoutSplit.js'
import { getStoredQuests } from '../../hooks/useQuestCompletion.js'
import { questService } from '../../services/questService.js'
import { defaultRoutineQuests } from '../../data/mockQuests.js'

function DailyWorkoutCard({ onQuestCompleted }) {
  const currentDayIndex = new Date().getDay()
  const [selectedDay, setSelectedDay] = useState(currentDayIndex)
  const [completedExercises, setCompletedExercises] = useState(() =>
    getStoredExerciseStatus(selectedDay)
  )
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [gymQuest, setGymQuest] = useState(null)
  const [syncError, setSyncError] = useState('')

  const workoutPlan = WEEKLY_WORKOUT_SPLIT[selectedDay]
  const isToday = selectedDay === currentDayIndex

  const refreshWorkoutProgress = () => {
    setCompletedExercises(getStoredExerciseStatus(selectedDay))
    const quests = getStoredQuests()
    const gym =
      quests.find(
        (q) =>
          q.id === 'gym-workout' ||
          q.questKey === 'gym-workout' ||
          q.title?.toLowerCase().includes('gym')
      ) ||
      defaultRoutineQuests.find((q) => q.id === 'gym-workout') || {
        id: 'gym-workout',
        title: 'GYM WORKOUT',
        category: 'Fitness',
        xp: 50,
        statReward: '+2 STR',
        verification: 'Photo Required',
        status: 'pending',
        history: [],
      }
    setGymQuest(gym)
  }

  useEffect(() => {
    refreshWorkoutProgress()
  }, [selectedDay])

  useEffect(() => {
    window.addEventListener('rankora-workout-updated', refreshWorkoutProgress)
    window.addEventListener('rankora-player-updated', refreshWorkoutProgress)
    window.addEventListener('storage', refreshWorkoutProgress)
    return () => {
      window.removeEventListener('rankora-workout-updated', refreshWorkoutProgress)
      window.removeEventListener('rankora-player-updated', refreshWorkoutProgress)
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

  const handleVerificationSuccess = async (payload) => {
    const targetQuestId = gymQuest?.id || gymQuest?._id || 'gym-workout'
    setSyncError('')
    try {
      await questService.verifyQuest(targetQuestId, payload)
      refreshWorkoutProgress()
      if (onQuestCompleted) onQuestCompleted()
    } catch (error) {
      setSyncError(error?.message || 'Failed to save workout completion. Check your connection and try again.')
    }
  }

  const dayOrder = [1, 2, 3, 4, 5, 6, 0] // Mon -> Sun

  return (
    <SystemWindow
      title="Daily Workout"
      icon={<Dumbbell size={14} />}
      bodyClassName="p-0"
      actions={
        <span className="font-mono text-sm text-frost-200">
          [<span className={allCompleted ? 'text-clear-300' : 'text-system-300'}>{completedCount}</span>/{totalExercises}]
        </span>
      }
    >
      {/* Quest header */}
      <div className="flex flex-col gap-3 border-b border-edge/70 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="label-caps text-system-300">Training quest · Workout split</p>
            {isToday && (
              <Badge tone="status" className="animate-sys-pulse">
                Today&apos;s target
              </Badge>
            )}
          </div>
          <h3 className="sys-title mt-1.5 text-xl leading-tight sm:text-2xl">
            {workoutPlan.dayName} <span className="text-system-400">—</span> {workoutPlan.focus}
          </h3>
        </div>
        <p className="shrink-0 font-mono text-xs text-frost-400">
          {completedCount} / {totalExercises} done <span className="text-system-300">({progressPercentage}%)</span>
        </p>
      </div>

      <div className="space-y-5 p-5">
        {/* Day selector */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="tablist" aria-label="Workout day">
          {dayOrder.map((dayIdx) => {
            const split = WEEKLY_WORKOUT_SPLIT[dayIdx]
            const isSelected = selectedDay === dayIdx
            const isCurrentToday = currentDayIndex === dayIdx

            return (
              <button
                type="button"
                key={dayIdx}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedDay(dayIdx)}
                className={`relative min-w-0 border px-0.5 py-2 font-mono text-[0.68rem] font-semibold transition-[border-color,background-color,box-shadow,color] sm:text-xs ${
                  isSelected
                    ? 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
                    : 'border-edge text-frost-400 hover:border-edge-strong hover:text-frost-100'
                }`}
              >
                <span>{split.shortDay}</span>
                {isCurrentToday && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rotate-45 bg-system-300 shadow-[0_0_6px_rgba(124,196,255,1)]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Focus description & muscle target */}
        <div className="sys-inset flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-100">{workoutPlan.subtitle}</p>
            <p className="mt-1 font-mono text-[0.68rem] text-frost-500">
              <span className="text-system-300">Target:</span> {workoutPlan.targetMuscles.join(' · ')}
            </p>
          </div>

          <div className="w-full sm:w-52">
            <ProgressBar
              value={progressPercentage}
              max={100}
              tone={allCompleted ? 'quest' : 'xp'}
              label="Workout execution"
              showValue
            />
          </div>
        </div>

        {/* Exercise checklist */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="label-caps text-frost-400">Exercise checklist</p>
            <p className="label-caps text-frost-600">One by one</p>
          </div>

          <div className="sys-inset divide-y divide-edge/60">
            {workoutPlan.exercises.map((exercise, index) => {
              const isDone = Boolean(completedExercises[exercise.id])

              return (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`flex cursor-pointer items-start justify-between gap-3 px-3.5 py-3 transition-colors sm:px-4 ${
                    isDone ? 'bg-clear-500/5' : 'hover:bg-system-500/5'
                  }`}
                  onClick={() => handleToggleExercise(exercise.id)}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {/* Square checkbox */}
                    <button
                      type="button"
                      aria-label={`Toggle ${exercise.name}`}
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-[border-color,background-color,box-shadow] ${
                        isDone
                          ? 'border-clear-400 bg-clear-400 text-void-950 shadow-[0_0_10px_rgba(52,217,156,0.6)]'
                          : 'border-edge-strong bg-void-950 text-transparent hover:border-system-400'
                      }`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-mono text-xs font-bold text-frost-600">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h4
                          className={`font-display text-sm font-bold uppercase tracking-[0.08em] transition-colors sm:text-base ${
                            isDone ? 'text-frost-500 line-through decoration-clear-400/60' : 'text-frost-50'
                          }`}
                        >
                          {exercise.name}
                        </h4>
                      </div>
                      <p className="mt-1 font-mono text-[0.68rem] text-frost-500">{exercise.notes}</p>
                    </div>
                  </div>

                  {/* Sets & reps */}
                  <div className="shrink-0 text-right font-mono text-xs">
                    <span
                      className={`block border px-2 py-0.5 font-semibold ${
                        isDone ? 'border-clear-400/50 text-clear-200' : 'border-edge bg-void-950 text-system-200'
                      }`}
                    >
                      {exercise.sets}
                    </span>
                    <span className="mt-1 block text-[0.62rem] text-frost-500">{exercise.reps}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sync error */}
      {syncError && (
        <p className="flex items-start gap-2 border-t border-penalty-500/30 bg-penalty-500/5 px-5 py-3 text-xs text-penalty-200">
          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-penalty-400" />
          <span>
            <span className="font-display font-bold uppercase tracking-[0.14em] text-penalty-300">Sync error:</span> {syncError}
          </span>
        </p>
      )}

      {/* Completion & gym photo proof footer */}
      <div
        className={`flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
          gymQuestCompleted || allCompleted ? 'border-clear-500/30 bg-clear-500/5' : 'border-edge/70 bg-void-950/40'
        }`}
      >
        <div className="min-w-0">
          {gymQuestCompleted ? (
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-clear-300" />
              <p className="font-display text-sm font-bold uppercase tracking-widest text-clear-200">
                Today&apos;s workout quest verified &amp; completed{' '}
                <span className="font-mono text-xs normal-case tracking-normal text-gold-300">(+50 XP, +2 STR)</span>
              </p>
            </div>
          ) : allCompleted ? (
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-clear-300 sys-glow">
                All exercises completed!
              </p>
              <p className="mt-0.5 text-xs text-frost-300">
                Upload your gym proof photo to verify and claim <span className="font-mono text-gold-300">+50 XP</span> and{' '}
                <span className="font-mono text-gold-300">+2 STR</span>.
              </p>
            </div>
          ) : (
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-frost-50">Workout in progress</p>
              <p className="mt-0.5 text-xs text-frost-400">
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
            className="w-full shrink-0 text-xs sm:w-auto sm:min-w-48"
          >
            <Camera size={15} /> Upload gym proof photo
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
    </SystemWindow>
  )
}

export default DailyWorkoutCard
