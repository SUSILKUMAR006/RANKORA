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
import { palette } from '../../theme/palette.js'

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
      return match ? match.color : palette.clear
    }
    const match = EXPENSE_CATEGORIES.find((c) => c.name === catName)
    return match ? match.color : palette.frost400
  }

  return (
    <Card className="overflow-hidden p-0">
      {/* Controls Header */}
      <div className="flex flex-col gap-3 border-b border-edge bg-void-950/40 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search bar */}
        <div className="relative min-w-0 flex-1 lg:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-frost-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions, notes, tags..."
            className="field h-10 pl-9! text-xs!"
          />
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filters */}
          <div className="flex">
            {[
              { id: 'all', label: 'All' },
              { id: 'expense', label: 'Outflows' },
              { id: 'income', label: 'Inflows' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`-ml-px h-9 border px-3 font-display text-xs font-bold uppercase tracking-[0.14em] transition-colors first:ml-0 ${
                  typeFilter === tab.id
                    ? 'relative z-10 border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
                    : 'border-edge text-frost-400 hover:border-edge-strong hover:text-frost-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="field h-9 py-0! font-mono text-xs! sm:w-44!"
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
              aria-label="Sort transactions"
              className="field h-9 py-0! font-mono text-xs! sm:w-40!"
            >
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>

          <Button onClick={onAddTransaction} size="sm" className="w-full sm:ml-auto sm:w-auto">
            <Plus size={15} /> Record transaction
          </Button>
        </div>
      </div>

      {/* Transaction Log */}
      {filtered.length > 0 ? (
        <div className="divide-y divide-edge/60">
          {filtered.map((item, index) => {
            const isIncome = item.type === 'income'
            const catColor = getCategoryColor(item.category, isIncome)

            return (
              <motion.div
                key={item.id || item._id || index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
                className="group flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-system-500/5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
              >
                {/* Left: Icon & Details */}
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center border"
                    style={{
                      borderColor: `${catColor}99`,
                      backgroundColor: `${catColor}1a`,
                      color: catColor,
                    }}
                  >
                    {isIncome ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-bold uppercase tracking-[0.08em] text-frost-50 transition-colors group-hover:text-system-200">
                      {item.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="h-2 w-2 shrink-0" style={{ backgroundColor: catColor }} />
                        <span className="label-caps truncate text-[0.68rem]" style={{ color: catColor }}>
                          {item.category}
                        </span>
                      </span>
                      {item.paymentMethod && (
                        <span className="flex items-center gap-1 border border-edge bg-void-950 px-1.5 py-0.5 font-mono text-[0.62rem] text-frost-400">
                          <CreditCard size={10} />
                          {item.paymentMethod}
                        </span>
                      )}
                    </div>

                    {item.notes && <p className="mt-1 line-clamp-1 text-xs text-frost-400">{item.notes}</p>}

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] text-frost-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatTxDate(item.date)}
                      </span>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex min-w-0 items-center gap-1">
                          <Tag size={11} className="shrink-0" />
                          <span className="truncate">{item.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-edge/50 pt-2.5 pl-12.5 sm:border-t-0 sm:pt-0 sm:pl-0">
                  <div className="text-left sm:text-right">
                    <span
                      className={`font-mono text-base font-bold sm:text-lg ${
                        isIncome ? 'text-clear-300' : 'text-penalty-300'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(item.amount, currency)}
                    </span>
                    <p className="label-caps text-[0.62rem] text-frost-600">{isIncome ? 'Inflow yield' : 'Outflow'}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Edit transaction"
                      onClick={() => onEditTransaction?.(item)}
                      className="border border-transparent p-2 text-frost-400 transition-colors hover:border-edge hover:bg-void-850 hover:text-frost-50"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete transaction"
                      onClick={() => onDeleteTransaction?.(item)}
                      className="border border-transparent p-2 text-frost-500 transition-colors hover:border-penalty-400/50 hover:bg-penalty-500/10 hover:text-penalty-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="grid place-items-center px-6 py-14 text-center">
          <PackageOpen size={32} className="mb-3 text-system-400/60" />
          <h3 className="font-display text-base font-bold uppercase tracking-[0.14em] text-frost-100">
            No transactions match filters
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-frost-500">
            No entries found matching the active search or category criteria. Reset filters or log a new transaction.
          </p>
          <Button onClick={onAddTransaction} className="mx-auto mt-5" size="sm">
            <Plus size={15} /> Record new transaction
          </Button>
        </div>
      )}
    </Card>
  )
}

export default ExpenseList
