import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import Card from '../common/Card.jsx'

function CustomCategoryTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-white/15 bg-rankora-950/90 p-3 shadow-xl backdrop-blur-md">
        <p className="font-display text-xs font-semibold text-white" style={{ color: data.color }}>
          {data.name}
        </p>
        <div className="mt-1.5 space-y-0.5 font-mono text-xs text-slate-300">
          <p>
            Completed: <span className="font-bold text-white">{data.count} Quests</span>
          </p>
          <p>
            Share: <span className="font-bold text-cyan-200">{data.percentage}%</span>
          </p>
          <p>
            XP Earned: <span className="font-bold text-amber-300">+{data.xp} XP</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function CategoryDistributionChart({ data = [] }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <p className="label-caps text-violet-300/80">DISCIPLINE BREAKDOWN</p>
          <h2 className="mt-1 font-display text-base font-semibold text-white">
            QUEST CATEGORIES
          </h2>
        </div>
        <span className="font-mono text-xs text-slate-500">
          Distribution
        </span>
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
                    stroke="rgba(7, 16, 22, 0.8)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Legend & Stats */}
        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-200">{item.name}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-slate-400">
                <span>{item.count} quests</span>
                <span className="font-semibold text-white">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default CategoryDistributionChart
