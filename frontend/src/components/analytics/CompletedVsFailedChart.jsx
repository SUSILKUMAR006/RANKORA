import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Crosshair } from 'lucide-react'
import SystemWindow from '../common/SystemWindow.jsx'
import { chartTheme, palette } from '../../theme/palette.js'

function CustomCompareTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xs border border-system-400 bg-void-900/95 p-3 shadow-[0_0_20px_rgba(30,144,255,0.25)]">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-frost-50">{label}</p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <p className="text-clear-300">
            Completed: <span className="font-bold text-frost-50">{data.completed}</span>
          </p>
          <p className="text-penalty-300">
            Failed: <span className="font-bold text-frost-50">{data.failed}</span>
          </p>
          <p className="text-system-300">
            Success Rate: <span className="font-bold text-frost-50">{data.rate}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function CompletedVsFailedChart({ data = [] }) {
  return (
    <SystemWindow title="Completed vs Failed" icon={<Crosshair size={13} />}>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="text-sm text-frost-400">Reliability analysis: quests cleared against quests failed.</p>
        <div className="flex items-center gap-3">
          <span className="label-caps flex items-center gap-1.5 text-clear-300">
            <span className="h-2.5 w-2.5 bg-clear-400 shadow-[0_0_6px_rgba(52,217,156,0.7)]" /> Completed
          </span>
          <span className="label-caps flex items-center gap-1.5 text-penalty-300">
            <span className="h-2.5 w-2.5 bg-penalty-400 shadow-[0_0_6px_rgba(255,77,94,0.7)]" /> Failed
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis dataKey="label" {...chartTheme.axis} />
            <YAxis {...chartTheme.axis} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomCompareTooltip />} cursor={chartTheme.tooltip.cursor} />
            <Bar
              dataKey="completed"
              name="Completed"
              fill={palette.clear}
              fillOpacity={0.85}
              radius={[1, 1, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="failed"
              name="Failed"
              fill={palette.penalty}
              fillOpacity={0.85}
              radius={[1, 1, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SystemWindow>
  )
}

export default CompletedVsFailedChart
