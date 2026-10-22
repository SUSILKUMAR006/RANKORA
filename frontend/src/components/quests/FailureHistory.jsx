import { AlertTriangle, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'
import SystemWindow from '../common/SystemWindow.jsx'

function FailureHistory({ history = [] }) {
  const failures = history.filter((item) => item.status === 'FAILED').slice(0, 5)
  return (
    <SystemWindow
      title="Failure History"
      tone="penalty"
      icon={<AlertTriangle size={13} />}
      bodyClassName="p-0"
      actions={<span className="font-mono text-xs text-frost-400">[{failures.length}]</span>}
    >
      {failures.length ? (
        <div className="divide-y divide-edge/60">
          {failures.map((failure, index) => (
            <motion.div
              key={`${failure.date}-${failure.time || index}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 px-5 py-3.5"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center border border-penalty-400/60 bg-penalty-500/10 text-penalty-300">
                <AlertTriangle size={14} />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-sm text-frost-200">
                  {failure.date}
                  {failure.time && <span className="ml-2 text-xs text-frost-500">{failure.time}</span>}
                </p>
                <p className="label-caps mt-1 text-penalty-300">{failure.reason || 'Recorded'}</p>
                {failure.note && <p className="mt-1 text-xs leading-5 text-frost-400">{failure.note}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-3 px-5 py-5 text-sm">
          <Clock3 size={16} className="mt-0.5 shrink-0 text-frost-500" />
          <span>
            <span className="label-caps text-frost-300">No failure data</span>
            <span className="mt-1 block text-xs text-frost-500">Complete or attempt missions to generate failure records.</span>
          </span>
        </div>
      )}
    </SystemWindow>
  )
}

export default FailureHistory
