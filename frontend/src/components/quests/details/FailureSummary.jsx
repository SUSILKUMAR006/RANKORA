import { AlertTriangle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SystemWindow from '../../common/SystemWindow.jsx'
import { getQuestFailures, getFailureStats } from '../../../utils/failureUtils.js'

function FailureSummary({ history, questId }) {
  const storedFailures = questId ? getQuestFailures(questId) : []
  const failures = storedFailures.length ? storedFailures : history.filter((item) => item.status === 'FAILED')
  const stats = getFailureStats(failures)
  if (!failures.length)
    return (
      <SystemWindow title="Failure Analysis" icon={<AlertTriangle size={13} />}>
        <p className="label-caps text-frost-400">No failure data</p>
        <p className="mt-1.5 text-xs leading-5 text-frost-500">Complete or attempt missions to generate failure records.</p>
      </SystemWindow>
    )
  const recent = failures[0]
  return (
    <SystemWindow title="Failure Analysis" tone="penalty" icon={<AlertTriangle size={13} />}>
      <dl className="grid gap-2.5 text-sm">
        <div className="sys-inset flex items-center justify-between gap-3 px-3 py-2">
          <dt className="label-caps text-frost-500">Total failures</dt>
          <dd className="font-display text-2xl font-bold leading-none text-penalty-300 sys-glow">{stats.totalFailures}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
          <dt className="label-caps text-frost-500">Most common reason</dt>
          <dd className="text-penalty-200">{stats.mostCommonReason || recent.reason}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-0.5">
          <dt className="label-caps text-frost-500">Recent failure</dt>
          <dd className="font-mono text-xs text-penalty-200">
            {recent.reason} · {recent.date}
          </dd>
        </div>
      </dl>
      <Link
        to="/analytics"
        className="label-caps group mt-4 inline-flex items-center gap-1 text-penalty-300 transition-colors hover:text-frost-50"
      >
        View full analysis <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </SystemWindow>
  )
}
export default FailureSummary
