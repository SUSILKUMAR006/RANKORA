import { Check, Target } from 'lucide-react'
import SystemWindow from '../../common/SystemWindow.jsx'

function QuestObjective({ quest }) {
  const completed = quest.status === 'completed'
  const current = quest.target ? Number(quest.progress) || 0 : completed ? 1 : 0
  const total = quest.target || 1
  const done = completed || (quest.target && current >= total)

  return (
    <SystemWindow title="Goal" icon={<Target size={13} />} bodyClassName="p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge/70 px-5 py-3">
        <p className="label-caps text-frost-400">Objective</p>
        <p className="font-mono text-sm text-frost-200">
          [<span className={done ? 'text-clear-300' : 'text-system-300'}>{current}</span>/{total}]
        </p>
      </div>
      <div className="flex items-start gap-4 px-5 py-4">
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center border ${
            done
              ? 'border-clear-400/70 bg-clear-500/10 text-clear-300 shadow-[0_0_10px_rgba(52,217,156,0.35)]'
              : 'border-edge-strong bg-void-950 text-system-300'
          }`}
        >
          {done ? <Check size={14} /> : <span className="h-1.5 w-1.5 rotate-45 bg-system-400" />}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`font-display text-lg font-bold uppercase leading-snug tracking-[0.06em] ${
              done ? 'text-frost-400' : 'text-frost-50'
            }`}
          >
            {quest.objective}
          </p>
          {quest.target && (
            <p className="mt-2 font-mono text-xs text-system-200">
              TARGET: {quest.target} {quest.unit.toUpperCase()}
            </p>
          )}
        </div>
      </div>
    </SystemWindow>
  )
}
export default QuestObjective
