import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../common/Card.jsx'

function CustomXpTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-cyan-300/30 bg-rankora-950/90 p-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <p className="font-display text-xs font-semibold text-white">{label}</p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <p className="text-cyan-300">
            Total XP: <span className="font-bold text-white">{data.xp?.toLocaleString()} XP</span>
          </p>
          <p className="text-amber-300">
            Gained: <span className="font-bold text-white">+{data.gained} XP</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function XPHistoryChart({ data = [] }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <p className="label-caps text-cyan-300/80">PROGRESSION TRAJECTORY</p>
          <h2 className="mt-1 font-display text-base font-semibold text-white">
            XP PROGRESS HISTORY
          </h2>
        </div>
        <span className="font-mono text-xs text-slate-500">
          Cumulative Growth Curve
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#67e8f9" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
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
              tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            />
            <Tooltip content={<CustomXpTooltip />} />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="#67e8f9"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#xpGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default XPHistoryChart
