import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { LineChart } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import { chartTheme, palette } from '../../theme/palette.js'

function CustomXpTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xs border border-system-400 bg-void-900/95 p-3 shadow-[0_0_20px_rgba(30,144,255,0.25)]">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-frost-50">{label}</p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <p className="text-system-300">
            Total XP: <span className="font-bold text-frost-50">{data.xp?.toLocaleString()} XP</span>
          </p>
          <p className="text-gold-300">
            Gained: <span className="font-bold text-gold-200">+{data.gained} XP</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function XPHistoryChart({ data = [] }) {
  return (
    <SystemWindow title="XP Progress History" icon={<LineChart size={13} />}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-frost-400">Progression trajectory: total EXP accumulated over the period.</p>
        <span className="label-caps text-frost-600">Cumulative Growth Curve</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.system} stopOpacity={0.35} />
                <stop offset="100%" stopColor={palette.system} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis dataKey="date" {...chartTheme.axis} />
            <YAxis
              {...chartTheme.axis}
              axisLine={false}
              tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            />
            <Tooltip content={<CustomXpTooltip />} cursor={{ stroke: palette.edgeStrong, strokeDasharray: '2 4' }} />
            <Area
              type="monotone"
              dataKey="xp"
              stroke={palette.system}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: palette.gold, stroke: palette.void900, strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#xpGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SystemWindow>
  )
}

export default XPHistoryChart
