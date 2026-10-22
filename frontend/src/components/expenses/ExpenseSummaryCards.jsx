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
import ProgressBar from '../common/ProgressBar.jsx'
import SystemWindow from '../common/SystemWindow.jsx'
import { formatCurrency } from '../../utils/expenseUtils.js'

// Big display figure with the currency symbol set in mono.
function Amount({ value, currency, prefix = '', className = 'text-frost-50', size = 'text-3xl' }) {
  return (
    <p className={`flex min-w-0 items-baseline gap-1 leading-none ${className}`}>
      <span className="shrink-0 font-mono text-sm font-bold opacity-70">
        {prefix}
        {currency}
      </span>
      <span className={`truncate font-display font-bold ${size}`}>{formatCurrency(value, '')}</span>
    </p>
  )
}

function StatTile({ index, label, icon, iconClass, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: 0.05 * index }}
      className={`sys-inset flex min-w-0 flex-col p-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="label-caps text-frost-500">{label}</p>
        <span className={`grid h-7 w-7 shrink-0 place-items-center border ${iconClass}`}>{icon}</span>
      </div>
      <div className="mt-3 flex flex-1 flex-col">{children}</div>
    </motion.div>
  )
}

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
  const nearLimit = !isOverBudget && budgetRatio > 80
  const gaugeTone = isOverBudget ? 'boss' : nearLimit ? 'gold' : 'xp'

  return (
    <SystemWindow
      title="Treasury Status"
      icon={<Coins size={13} />}
      actions={<span className="label-caps hidden text-frost-500 sm:inline">This month</span>}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* 1. Monthly Outflow (Expense) */}
        <StatTile
          index={0}
          label="Monthly Outflow"
          icon={<TrendingDown size={15} />}
          iconClass="border-penalty-400/60 bg-penalty-500/10 text-penalty-300"
        >
          <Amount value={monthlyExpense} currency={currency} />
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 font-mono text-xs text-frost-500">
            <span className="flex items-center text-penalty-300">
              <ArrowDownRight size={13} className="mr-0.5" />
              This month
            </span>
            <span className="text-frost-600">/</span>
            <span className="truncate">{stats.categoryBreakdown.length} categories</span>
          </div>
        </StatTile>

        {/* 2. Monthly Inflow (Income) */}
        <StatTile
          index={1}
          label="Treasury Inflow"
          icon={<TrendingUp size={15} />}
          iconClass="border-system-400/60 bg-system-500/10 text-system-300"
        >
          <Amount value={monthlyIncome} currency={currency} />
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3 font-mono text-xs text-frost-500">
            <span className="flex items-center text-system-300">
              <ArrowUpRight size={13} className="mr-0.5" />
              Savings: {savingsRate}%
            </span>
            <Badge tone="status" className="text-[0.6rem]">
              Yield active
            </Badge>
          </div>
        </StatTile>

        {/* 3. Net Capital Balance */}
        <StatTile
          index={2}
          label="Monthly Net Yield"
          icon={<Wallet size={15} />}
          iconClass={
            isNetPositive
              ? 'border-clear-400/60 bg-clear-500/10 text-clear-300'
              : 'border-penalty-400/60 bg-penalty-500/10 text-penalty-300'
          }
        >
          <Amount
            value={monthlyNet}
            currency={currency}
            prefix={isNetPositive ? '+' : ''}
            className={isNetPositive ? 'text-clear-300 sys-glow' : 'text-penalty-300 sys-glow'}
          />
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 font-mono text-xs">
            <span className="label-caps text-frost-500">Total treasury</span>
            <span className="truncate font-bold text-frost-100">
              {formatCurrency(stats.netBalanceAllTime, currency)}
            </span>
          </div>
        </StatTile>

        {/* 4. Budget Guardian */}
        <StatTile
          index={3}
          label="Budget Limit"
          icon={isOverBudget ? <AlertTriangle size={15} /> : <ShieldCheck size={15} />}
          iconClass={
            isOverBudget
              ? 'border-penalty-400/70 bg-penalty-500/15 text-penalty-300 shadow-[0_0_10px_rgba(240,42,62,0.45)]'
              : nearLimit
              ? 'border-gold-400/60 bg-gold-500/10 text-gold-300'
              : 'border-clear-400/60 bg-clear-500/10 text-clear-300'
          }
          className={
            isOverBudget
              ? 'border-penalty-500/50 bg-penalty-500/5 shadow-[inset_0_0_24px_-10px_rgba(240,42,62,0.5)]'
              : ''
          }
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <Amount
                value={budgetRemaining}
                currency={currency}
                size="text-2xl"
                className={isOverBudget ? 'text-penalty-300' : 'text-frost-50'}
              />
              <p className="mt-1 truncate font-mono text-xs text-frost-500">
                of {formatCurrency(budget, currency)}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenBudgetModal}
              className="flex shrink-0 items-center gap-1 border border-edge bg-void-900 px-2 py-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.14em] text-frost-300 transition-colors hover:border-system-400 hover:text-frost-50"
              title="Set Monthly Budget"
            >
              <Edit2 size={11} />
              <span>Edit</span>
            </button>
          </div>

          {/* Segmented budget gauge */}
          <div className="mt-3">
            <div className="mb-1.5 flex justify-between gap-2 font-mono text-[0.68rem]">
              <span
                className={
                  isOverBudget ? 'font-bold text-penalty-300' : nearLimit ? 'text-gold-300' : 'text-frost-300'
                }
              >
                {budgetRatio}% used
              </span>
              <span
                className={`label-caps text-[0.65rem] ${
                  isOverBudget ? 'animate-sys-pulse text-penalty-300' : 'text-frost-500'
                }`}
              >
                {isOverBudget ? 'Over budget' : 'Remaining'}
              </span>
            </div>
            <ProgressBar value={budgetRatio} max={100} tone={gaugeTone} size="md" />
          </div>
        </StatTile>
      </div>
    </SystemWindow>
  )
}

export default ExpenseSummaryCards
