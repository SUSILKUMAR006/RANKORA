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
import Card from '../common/Card.jsx'

function CustomCompareTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-white/15 bg-rankora-950/90 p-3 shadow-xl backdrop-blur-md">
        <p className="font-display text-xs font-semibold text-white">{label}</p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <p className="text-emerald-300">
            Completed: <span className="font-bold text-white">{data.completed}</span>
          </p>
          <p className="text-rose-300">
            Failed: <span className="font-bold text-white">{data.failed}</span>
          </p>
          <p className="text-violet-300">
            Success Rate: <span className="font-bold text-white">{data.rate}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function CompletedVsFailedChart({ data = [] }) {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <p className="label-caps text-emerald-300/80">RELIABILITY ANALYSIS</p>
          <h2 className="mt-1 font-display text-base font-semibold text-white">
            COMPLETED VS FAILED
          </h2>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Completed
          </span>
          <span className="flex items-center gap-1.5 text-rose-300">
            <span className="h-2.5 w-2.5 rounded-sm bg-rose-400" /> Failed
          </span>
        </div>
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
              dataKey="label"
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
            <Tooltip content={<CustomCompareTooltip />} />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#34d399"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="failed"
              name="Failed"
              fill="#fb7185"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default CompletedVsFailedChart
