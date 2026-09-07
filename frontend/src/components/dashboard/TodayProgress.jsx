import { Check, Circle, X } from 'lucide-react'
import Card from '../common/Card.jsx'

function TodayProgress({ quests = [] }) {
  const safeQuests = Array.isArray(quests) ? quests : []
  const completed = safeQuests.filter((quest) => quest.status === 'completed').length
  const failed = safeQuests.filter((quest) => quest.status === 'failed').length
  const remaining = Math.max(0, safeQuests.length - completed - failed)
  const percentage = safeQuests.length
    ? Math.round((completed / safeQuests.length) * 100)
    : 0

  return (
    <Card variant="glass">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-cyan-300/70">Daily objectives</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white">
            TODAY'S PROGRESS
          </h2>
        </div>
        <span className="font-mono text-sm text-cyan-200">
          {completed} / {safeQuests.length}
        </span>
      </div>
      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div
          className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#67e8f9 ${percentage * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
          }}
        >
          <div className="grid h-32 w-32 place-items-center rounded-full bg-rankora-900">
            <span className="font-mono text-3xl text-white">{percentage}%</span>
          </div>
        </div>
        <div className="w-full space-y-4 sm:max-w-48">
          <p className="font-mono text-xs text-slate-500">
            {remaining} QUESTS REMAINING
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <Check size={15} className="text-emerald-300" />Completed
              </span>
              <span className="font-mono text-white">{completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-slate-400">
                <Circle size={15} className="text-cyan-300" />Remaining
              </span>
              <span className="font-mono text-white">{remaining}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-slate-500">
                <X size={15} />Failed
              </span>
              <span className="font-mono text-white">{failed}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
export default TodayProgress
