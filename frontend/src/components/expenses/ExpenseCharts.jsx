import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../common/Card.jsx'
import { formatCurrency } from '../../utils/expenseUtils.js'

function CustomCategoryTooltip({ active, payload, currency = '$' }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-white/15 bg-rankora-950/95 p-3 shadow-xl backdrop-blur-md">
        <p className="font-display text-xs font-semibold" style={{ color: data.color }}>
          {data.name}
        </p>
        <div className="mt-1.5 space-y-0.5 font-mono text-xs text-slate-300">
          <p>
            Amount: <span className="font-bold text-white">{formatCurrency(data.amount, currency)}</span>
          </p>
          <p>
            Allocation: <span className="font-bold text-cyan-200">{data.percentage}%</span>
          </p>
        </div>
      </div>
    )
  }
  return null
}

function CustomVelocityTooltip({ active, payload, label, currency = '$' }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/15 bg-rankora-950/95 p-3 shadow-xl backdrop-blur-md font-mono text-xs">
        <p className="text-slate-400 mb-1 border-b border-white/10 pb-1">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="capitalize">
              {entry.name || entry.dataKey}:
            </span>
            <span className="font-bold text-white">
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function ExpenseCharts({ categoryBreakdown = [], velocityData = [], currency = '$' }) {
  const hasCategories = categoryBreakdown.length > 0
  const hasVelocity = velocityData.some((d) => d.expense > 0 || d.income > 0)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 1. Category Allocation Donut Chart */}
      <Card variant="glass" className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <p className="label-caps text-cyan-300/80">RESOURCE ALLOCATION</p>
            <h2 className="mt-1 font-display text-base font-semibold text-white">
              CATEGORY BREAKDOWN
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-500">
            {categoryBreakdown.length} Categories
          </span>
        </div>

        {hasCategories ? (
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_1.1fr]">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomCategoryTooltip currency={currency} />} />
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="amount"
                  >
                    {categoryBreakdown.map((entry) => (
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

            {/* Category Legend */}
            <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
              {categoryBreakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs transition hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate font-medium text-slate-200">{item.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5 font-mono text-slate-400">
                    <span className="text-white">{formatCurrency(item.amount, currency)}</span>
                    <span className="text-cyan-300 font-semibold">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-56 flex-col items-center justify-center text-center text-slate-500">
            <p className="font-mono text-xs">No expense categories logged yet.</p>
            <p className="mt-1 text-[0.7rem]">Add an expense to generate category telemetry.</p>
          </div>
        )}
      </Card>

      {/* 2. Cashflow Velocity Area Chart */}
      <Card variant="glass" className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <p className="label-caps text-violet-300/80">CASHFLOW VELOCITY</p>
            <h2 className="mt-1 font-display text-base font-semibold text-white">
              14-DAY INFLOW & OUTFLOW
            </h2>
          </div>
          <div className="flex items-center gap-3 font-mono text-[0.65rem]">
            <span className="flex items-center gap-1 text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> Inflow
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="h-2 w-2 rounded-full bg-rose-400" /> Outflow
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomVelocityTooltip currency={currency} />} />
              <Area
                type="monotone"
                dataKey="income"
                name="Inflow"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Outflow"
                stroke="#fb7185"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default ExpenseCharts
