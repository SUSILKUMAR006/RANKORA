import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import { chartTheme, palette } from '../../theme/palette.js'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xs border border-system-400 bg-void-900/95 p-3 shadow-[0_0_20px_rgba(30,144,255,0.25)]">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-frost-50">
          {label} <span className="text-frost-500">(Day of Week)</span>
        </p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <p className="text-system-300">
            Completed: <span className="font-bold text-frost-50">{data.completed} Quests</span>
          </p>
          <p className="text-gold-300">
            XP Earned: <span className="font-bold text-frost-50">+{data.xp} XP</span>
          </p>
          <p className="text-clear-300">
            Success Rate: <span className="font-bold text-frost-50">{data.rate}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function WeeklyCompletionChart({ data = [] }) {
  return (
    <SystemWindow title="Weekly Quest Completion" icon={<BarChart3 size={13} />}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm text-frost-400">Day-by-day performance: quests cleared on each weekday.</p>
        <span className="label-caps text-frost-600">Mon – Sun Distribution</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="weeklyBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.system} stopOpacity={0.95} />
                <stop offset="100%" stopColor={palette.systemDeep} stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis dataKey="day" {...chartTheme.axis} />
            <YAxis {...chartTheme.axis} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={chartTheme.tooltip.cursor} />
            <Bar
              dataKey="completed"
              fill="url(#weeklyBarGradient)"
              stroke={palette.system}
              strokeOpacity={0.6}
              radius={[1, 1, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SystemWindow>
  )
}

export default WeeklyCompletionChart
