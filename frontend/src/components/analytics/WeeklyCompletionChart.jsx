import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../common/Card.jsx'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-cyan-300/30 bg-rankora-950/90 p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <p className="font-display text-xs font-semibold text-white">
          {label} (Day of Week)
        </p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <p className="text-cyan-300">
            Completed: <span className="font-bold text-white">{data.completed} Quests</span>
          </p>
          <p className="text-amber-300">
            XP Earned: <span className="font-bold text-white">+{data.xp} XP</span>
          </p>
          <p className="text-emerald-300">
            Success Rate: <span className="font-bold text-white">{data.rate}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function WeeklyCompletionChart({ data = [] }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <p className="label-caps text-cyan-300/80">DAY-BY-DAY PERFORMANCE</p>
          <h2 className="mt-1 font-display text-base font-semibold text-white">
            WEEKLY QUEST COMPLETION
          </h2>
        </div>
        <span className="font-mono text-xs text-slate-500">
          Mon – Sun Distribution
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="completed"
              fill="#67e8f9"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default WeeklyCompletionChart
