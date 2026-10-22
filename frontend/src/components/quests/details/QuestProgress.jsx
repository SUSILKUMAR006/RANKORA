import { Activity } from 'lucide-react'
import ProgressBar from '../../common/ProgressBar.jsx'
import SystemWindow from '../../common/SystemWindow.jsx'

function QuestProgress({ quest }) {
  if (!quest.target)
    return (
      <SystemWindow title="Progress" icon={<Activity size={13} />}>
        <div className="sys-inset flex items-center justify-between gap-3 px-4 py-3">
          <span className="label-caps text-frost-500">Completion type</span>
          <span className="font-mono text-sm text-frost-50">Manual</span>
        </div>
      </SystemWindow>
    )
  const percentage = Math.round((quest.progress / quest.target) * 100)
  return (
    <SystemWindow title="Progress" icon={<Activity size={13} />}>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-5xl font-bold leading-none text-frost-50 sys-glow">
          {percentage}
          <span className="text-2xl text-frost-500">%</span>
        </p>
        <p className="font-mono text-sm text-frost-200">
          {quest.progress} <span className="text-frost-500">/ {quest.target} {quest.unit}</span>
        </p>
      </div>
      <ProgressBar value={quest.progress} max={quest.target} tone="quest" size="lg" className="mt-4" />
    </SystemWindow>
  )
}
export default QuestProgress
