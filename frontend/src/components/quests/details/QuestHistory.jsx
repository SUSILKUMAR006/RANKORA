import { Check, History, X } from 'lucide-react'
import SystemWindow from '../../common/SystemWindow.jsx'

function QuestHistory({ history }) {
  return (
    <SystemWindow title="History" icon={<History size={13} />} bodyClassName="p-0">
      {history.length ? (
        <ol className="divide-y divide-edge/60 font-mono text-xs">
          {history.map((item) => {
            const completed = item.status === 'COMPLETED'
            return (
              <li key={`${item.date}-${item.time || ''}-${item.status}`} className="px-5 py-2.5">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-frost-500">
                    [{item.date}
                    {item.time && <span className="text-frost-600"> {item.time}</span>}]
                  </span>
                  <span className={`inline-flex items-center gap-1 font-bold ${completed ? 'text-clear-300' : 'text-penalty-300'}`}>
                    {completed ? <Check size={13} /> : <X size={13} />}
                    {item.status}
                  </span>
                  <span className="ml-auto text-gold-300">{item.xp ? `+${item.xp} EXP` : '—'}</span>
                </div>
                {item.reason && <p className="mt-1 text-frost-500">&gt; Reason: {item.reason}</p>}
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="label-caps px-5 py-6 text-center text-frost-600">No previous records</p>
      )}
    </SystemWindow>
  )
}
export default QuestHistory
