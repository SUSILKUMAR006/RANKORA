import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import { palette } from '../../theme/palette.js'

function CustomCategoryTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xs border border-system-400 bg-void-900/95 p-3 shadow-[0_0_20px_rgba(30,144,255,0.25)]">
        <p className="font-display text-xs font-bold uppercase tracking-widest" style={{ color: data.color }}>
          {data.name}
        </p>
        <div className="mt-1.5 space-y-0.5 font-mono text-xs text-frost-300">
          <p>
            Completed: <span className="font-bold text-frost-50">{data.count} Quests</span>
          </p>
          <p>
            Share: <span className="font-bold text-system-200">{data.percentage}%</span>
          </p>
          <p>
            XP Earned: <span className="font-bold text-gold-300">+{data.xp} XP</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function CategoryDistributionChart({ data = [] }) {
  return (
    <SystemWindow title="Quest Categories" icon={<PieChartIcon size={13} />}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-frost-400">Discipline breakdown: share of cleared quests by category.</p>
        <span className="label-caps text-frost-600">Distribution</span>
      </div>

      <div className="grid items-center gap-4 sm:grid-cols-[1fr_1.1fr]">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomCategoryTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="count"
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={entry.color}
                    fillOpacity={0.9}
                    stroke={palette.void900}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Legend & Stats */}
        <div className="space-y-1.5">
          {data.map((item) => (
            <div
              key={item.name}
              className="sys-inset flex items-center justify-between gap-3 px-3 py-2 text-xs transition-colors hover:border-edge-strong"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rotate-45"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                />
                <span className="truncate font-display text-sm font-bold uppercase tracking-[0.08em] text-frost-100">
                  {item.name}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3 font-mono text-frost-500">
                <span>{item.count} quests</span>
                <span className="w-9 text-right font-bold text-frost-50">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SystemWindow>
  )
}

export default CategoryDistributionChart
