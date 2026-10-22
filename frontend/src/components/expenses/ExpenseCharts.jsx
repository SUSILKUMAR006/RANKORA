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
import { Activity, PieChart as PieChartIcon } from 'lucide-react'
import { EmptyState } from '../common/States.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import { chartTheme, palette } from '../../theme/palette.js'
import { formatCurrency } from '../../utils/expenseUtils.js'

const tooltipBox =
  'border border-system-400 bg-void-900/95 px-3 py-2 font-mono text-xs shadow-[0_0_20px_rgba(30,144,255,0.25)]'

function CustomCategoryTooltip({ active, payload, currency = '$' }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className={tooltipBox}>
        <p className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-widest" style={{ color: data.color }}>
          <span className="h-2 w-2" style={{ backgroundColor: data.color }} />
          {data.name}
        </p>
        <div className="mt-1.5 space-y-0.5 text-frost-300">
          <p>
            Amount: <span className="font-bold text-frost-50">{formatCurrency(data.amount, currency)}</span>
          </p>
          <p>
            Allocation: <span className="font-bold text-system-200">{data.percentage}%</span>
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
      <div className={tooltipBox}>
        <p className="mb-1 border-b border-edge pb-1 font-display font-bold uppercase tracking-widest text-frost-50">{label}</p>
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <span style={{ color: entry.color }} className="flex items-center gap-1.5 uppercase">
              <span className="h-2 w-2" style={{ backgroundColor: entry.color }} />
              {entry.name || entry.dataKey}
            </span>
            <span className="font-bold text-frost-50">{formatCurrency(entry.value, currency)}</span>
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
      <SystemWindow
        title="Resource Allocation"
        icon={<PieChartIcon size={13} />}
        actions={<span className="font-mono text-xs text-frost-500">[{categoryBreakdown.length}] categories</span>}
      >
        <p className="label-caps mb-4 text-frost-500">Category breakdown</p>
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
                    innerRadius={56}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {categoryBreakdown.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} stroke={palette.void950} strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend */}
            <div className="sys-inset max-h-56 divide-y divide-edge/60 overflow-y-auto">
              {categoryBreakdown.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-xs transition-colors hover:bg-system-500/5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="label-caps truncate text-[0.7rem] text-frost-200">{item.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2.5 font-mono">
                    <span className="text-frost-50">{formatCurrency(item.amount, currency)}</span>
                    <span className="w-9 text-right font-semibold text-system-300">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="No expense categories logged yet" description="Add an expense to generate category telemetry." />
        )}
      </SystemWindow>

      {/* 2. Cashflow Velocity Area Chart */}
      <SystemWindow
        title="Cashflow Velocity"
        icon={<Activity size={13} />}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="label-caps text-frost-500">14-day inflow &amp; outflow</p>
          <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase">
            <span className="flex items-center gap-1.5 text-system-300">
              <span className="h-2 w-2 bg-system-400" /> Inflow
            </span>
            <span className="flex items-center gap-1.5 text-penalty-300">
              <span className="h-2 w-2 bg-penalty-400" /> Outflow
            </span>
          </div>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.system} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={palette.system} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.penalty} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={palette.penalty} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis dataKey="label" {...chartTheme.axis} tick={{ ...chartTheme.axis.tick, fontSize: 10 }} minTickGap={12} />
              <YAxis {...chartTheme.axis} tick={{ ...chartTheme.axis.tick, fontSize: 10 }} axisLine={false} />
              <Tooltip content={<CustomVelocityTooltip currency={currency} />} cursor={chartTheme.tooltip.cursor} />
              <Area
                type="monotone"
                dataKey="income"
                name="Inflow"
                stroke={palette.system}
                strokeWidth={2}
                dot={false}
                fillOpacity={1}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expense"
                name="Outflow"
                stroke={palette.penalty}
                strokeWidth={2}
                dot={false}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SystemWindow>
    </div>
  )
}

export default ExpenseCharts
