import { BadgeCheck, CalendarDays, Clock3, Database, Gauge, Layers3, ShieldCheck, Tag } from 'lucide-react'
import Badge from '../../common/Badge.jsx'
import SystemWindow from '../../common/SystemWindow.jsx'

function QuestInformation({ quest }) {
  const items = [
    [Tag, 'Category', quest.category],
    [Gauge, 'Difficulty', quest.difficulty],
    [Layers3, 'Type', quest.type],
    [ShieldCheck, 'Verification', quest.verification],
    [Clock3, 'Estimated time', quest.estimatedTime],
    [CalendarDays, 'Available', quest.available],
    [BadgeCheck, 'Status', quest.status],
  ]
  return (
    <SystemWindow title="Quest Information" icon={<Database size={13} />}>
      <dl className="divide-y divide-edge/60">
        {items.map(([Icon, label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
            <dt className="label-caps flex items-center gap-2 text-frost-500">
              <Icon size={14} className="text-system-400/80" />
              {label}
            </dt>
            <dd className="min-w-0 text-right font-mono text-xs text-frost-100">{value}</dd>
          </div>
        ))}
      </dl>
      <Badge tone="category" className="mt-4">
        {quest.type} objective
      </Badge>
    </SystemWindow>
  )
}
export default QuestInformation
