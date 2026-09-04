import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  DollarSign,
  Edit2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Card from '../common/Card.jsx'
import { formatCurrency } from '../../utils/expenseUtils.js'

export function ExpenseSummaryCards({ stats, currency, onOpenBudgetModal }) {
  const {
    monthlyExpense,
    monthlyIncome,
    monthlyNet,
    budget,
    budgetRatio,
    budgetRemaining,
    isOverBudget,
    savingsRate,
  } = stats

  const isNetPositive = monthlyNet >= 0

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Monthly Outflow (Expense) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card variant="glass" className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <p className="label-caps text-rose-300/80">Monthly Outflow</p>
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-rose-400/20 bg-rose-400/10 text-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.15)]">
              <TrendingDown size={17} />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
              {formatCurrency(monthlyExpense, currency)}
            </h2>
            <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="flex items-center text-rose-300">
                <ArrowDownRight size={13} className="mr-0.5" />
                This Month
              </span>
              <span>•</span>
              <span className="truncate">{stats.categoryBreakdown.length} categories</span>
            </div>
          </div>
          {/* Subtle glowing accent */}
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-rose-500/10 blur-xl" />
        </Card>
      </motion.div>

      {/* 2. Monthly Inflow (Income) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <Card variant="glass" className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <p className="label-caps text-cyan-300/80">Treasury Inflow</p>
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.15)]">
              <TrendingUp size={17} />
            </span>
          </div>
          <div className="mt-3">
            <h2 className="font-mono text-2xl font-bold tracking-tight text-white lg:text-3xl">
              {formatCurrency(monthlyIncome, currency)}
            </h2>
            <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
              <span className="flex items-center text-cyan-300">
                <ArrowUpRight size={13} className="mr-0.5" />
                Savings: {savingsRate}%
              </span>
              <span>•</span>
              <Badge tone="cyan" className="text-[0.6rem]">Yield Active</Badge>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-500/10 blur-xl" />
        </Card>
      </motion.div>

      {/* 3. Net Capital Balance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <Card variant="glass" className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <p className="label-caps text-violet-300/80">Monthly Net Yield</p>
            <span
              className={`grid h-8 w-8 place-items-center rounded-xl border ${
                isNetPositive
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
              }`}
            >
              <Wallet size={17} />
            </span>
          </div>
          <div className="mt-3">
            <h2
              className={`font-mono text-2xl font-bold tracking-tight lg:text-3xl ${
                isNetPositive ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {isNetPositive ? '+' : ''}
              {formatCurrency(monthlyNet, currency)}
            </h2>
            <div className="mt-2 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">Total Treasury:</span>
              <span className="font-semibold text-white">
                {formatCurrency(stats.netBalanceAllTime, currency)}
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-500/10 blur-xl" />
        </Card>
      </motion.div>

      {/* 4. Budget Guardian */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        <Card variant="highlighted" className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <p className="label-caps text-cyan-300">Budget Limit</p>
              {isOverBudget ? (
                <AlertTriangle size={13} className="text-rose-400" />
              ) : (
                <ShieldCheck size={13} className="text-emerald-400" />
              )}
            </div>
            <button
              type="button"
              onClick={onOpenBudgetModal}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 font-mono text-[0.65rem] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"
              title="Set Monthly Budget"
            >
              <Edit2 size={11} />
              <span>EDIT</span>
            </button>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-lg font-bold text-white">
                {formatCurrency(budgetRemaining, currency)}
              </span>
              <span className="text-xs text-slate-400">of {formatCurrency(budget, currency)}</span>
            </div>

            {/* Progress Gauge */}
            <div className="mt-2.5">
              <div className="mb-1 flex justify-between font-mono text-[0.65rem]">
                <span className={isOverBudget ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {budgetRatio}% used
                </span>
                <span className="text-slate-500">{isOverBudget ? 'OVER BUDGET' : 'REMAINING'}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget
                      ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                      : budgetRatio > 80
                      ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'
                      : 'bg-linear-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_#38bdf8]'
                  }`}
                  style={{ width: `${Math.min(100, budgetRatio)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ExpenseSummaryCards
