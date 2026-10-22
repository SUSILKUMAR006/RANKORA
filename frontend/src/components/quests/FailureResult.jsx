import { CheckCircle2 } from 'lucide-react'
import Card from '../common/Card.jsx'

function FailureResult({ quest }) {
  return (
    <Card variant="standard" tone="penalty">
      <div className="flex gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-penalty-400/70 bg-penalty-500/10 text-penalty-300">
          <CheckCircle2 size={18} />
        </span>
        <div className="min-w-0">
          <p className="label-caps text-penalty-300">Mission failure recorded</p>
          <p className="mt-2 text-sm leading-6 text-frost-300">Failure data has been stored for future analysis.</p>
          <p className="mt-3 font-mono text-xs text-penalty-200">{quest.failureReason} · DATA RECORDED</p>
        </div>
      </div>
    </Card>
  )
}

export default FailureResult
