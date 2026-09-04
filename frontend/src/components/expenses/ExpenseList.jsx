import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Edit3,
  Filter,
  PackageOpen,
  Plus,
  Search,
  Tag,
  Trash2,
} from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import Card from '../common/Card.jsx'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  formatCurrency,
} from '../../utils/expenseUtils.js'

function formatTxDate(dateStr) {
  if (!dateStr) return 'Today'
  try {
    const d = new Date(`${dateStr}T12:00:00`)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

export function ExpenseList({
  expenses = [],
  currency = '$',
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
}) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all', 'expense', 'income'
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortOption, setSortOption] = useState('date_desc')

  // Collect all active categories
  const allCategories = [
    'All',
    ...new Set([
      ...EXPENSE_CATEGORIES.map((c) => c.name),
      ...INCOME_CATEGORIES.map((c) => c.name),
    ]),
  ]

  // Filter and sort items
  const filtered = expenses
    .filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query) ||
        item.paymentMethod?.toLowerCase().includes(query) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(query)))
      return matchesType && matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortOption === 'date_desc') return new Date(b.date) - new Date(a.date)
      if (sortOption === 'date_asc') return new Date(a.date) - new Date(b.date)
      if (sortOption === 'amount_desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0)
      if (sortOption === 'amount_asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0)
      return 0
    })

  const getCategoryColor = (catName, isIncome) => {
    if (isIncome) {
      const match = INCOME_CATEGORIES.find((c) => c.name === catName)
      return match ? match.color : '#2dd4bf'
    }
    const match = EXPENSE_CATEGORIES.find((c) => c.name === catName)
    return match ? match.color : '#94a3b8'
  }

  return (
    <div className="space-y-5">
      {/* Controls Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search bar */}
        <div className="relative min-w-48 flex-1 lg:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions, notes, tags..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-300/50"
          />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filters */}
          <div className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'expense', label: 'Outflows' },
              { id: 'income', label: 'Inflows' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs transition ${
                  typeFilter === tab.id
                    ? 'bg-cyan-300/15 text-cyan-200 border border-cyan-300/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-slate-300 outline-none transition focus:border-cyan-300/50"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-9 rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-slate-300 outline-none transition focus:border-cyan-300/50"
          >
            <option value="date_desc">Latest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>

          <Button onClick={onAddTransaction} size="sm" className="ml-auto">
            <Plus size={15} /> RECORD TRANSACTION
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item, index) => {
            const isIncome = item.type === 'income'
            const catColor = getCategoryColor(item.category, isIncome)

            return (
              <motion.div
                key={item.id || item._id || index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                <Card
                  variant="glass"
                  className="group flex flex-col justify-between gap-4 p-4 transition sm:flex-row sm:items-center hover:border-white/20"
                >
                  {/* Left: Icon & Details */}
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
                        isIncome
                          ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                          : 'border-rose-400/30 bg-rose-400/10 text-rose-300'
                      }`}
                      style={{
                        borderColor: `${catColor}40`,
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                      }}
                    >
                      {isIncome ? <ArrowUpRight size={19} /> : <ArrowDownRight size={19} />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-display text-sm font-semibold text-white sm:text-base">
                          {item.title}
                        </h3>
                        <span
                          className="rounded-md border px-2 py-0.5 font-mono text-[0.62rem]"
                          style={{
                            borderColor: `${catColor}40`,
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                          }}
                        >
                          {item.category}
                        </span>
                        {item.paymentMethod && (
                          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[0.62rem] text-slate-400">
                            {item.paymentMethod}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          {item.notes}
                        </p>
                      )}

                      <div className="mt-1.5 flex flex-wrap items-center gap-3 font-mono text-[0.68rem] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatTxDate(item.date)}
                        </span>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={11} />
                            <span>{item.tags.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span
                        className={`font-mono text-base font-bold sm:text-lg ${
                          isIncome ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <p className="font-mono text-[0.62rem] text-slate-500 uppercase tracking-wider">
                        {isIncome ? 'Inflow Yield' : 'Outflow'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Edit transaction"
                        onClick={() => onEditTransaction(item)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete transaction"
                        onClick={() => onDeleteTransaction(item)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <Card variant="glass" className="py-14 text-center">
          <PackageOpen size={36} className="mx-auto text-slate-600 mb-3" />
          <h3 className="font-display text-base font-semibold text-white">
            NO TRANSACTIONS MATCH FILTERS
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
            No entries found matching the active search or category criteria. Reset filters or log a new transaction.
          </p>
          <Button onClick={onAddTransaction} className="mt-4 mx-auto" size="sm">
            <Plus size={15} /> RECORD NEW TRANSACTION
          </Button>
        </Card>
      )}
    </div>
  )
}

export default ExpenseList
