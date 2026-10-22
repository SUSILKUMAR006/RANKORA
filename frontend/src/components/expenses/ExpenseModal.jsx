import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CreditCard,
  DollarSign,
  Plus,
  Tag,
  Zap,
} from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
} from '../../utils/expenseUtils.js'

export function ExpenseModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  currency = '$',
}) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Nutrition',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Card / Digital',
    notes: '',
    tags: '',
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount ? String(initialData.amount) : '',
        type: initialData.type || 'expense',
        category: initialData.category || (initialData.type === 'income' ? 'Salary / Main Yield' : 'Food & Nutrition'),
        date: initialData.date || new Date().toISOString().slice(0, 10),
        paymentMethod: initialData.paymentMethod || 'Card / Digital',
        notes: initialData.notes || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
      })
    } else {
      setForm({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food & Nutrition',
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'Card / Digital',
        notes: '',
        tags: '',
      })
    }
  }, [initialData, open])

  const handleTypeChange = (nextType) => {
    setForm((prev) => ({
      ...prev,
      type: nextType,
      category: nextType === 'income' ? 'Salary / Main Yield' : 'Food & Nutrition',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) return

    const parsedTags = form.tags
      ? form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : []

    onSubmit({
      ...form,
      title: form.title.trim(),
      amount: Number(form.amount),
      tags: parsedTags,
    })
  }

  const isIncome = form.type === 'income'
  const activeCategories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
      eyebrow="Treasury · Inventory log"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selector (Expense vs Income) */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            aria-pressed={!isIncome}
            className={`flex min-w-0 items-center justify-center gap-2 border px-2 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,box-shadow,color] ${
              !isIncome
                ? 'border-penalty-400 bg-penalty-500/15 text-penalty-100 shadow-[0_0_14px_-2px_rgba(240,42,62,0.55)]'
                : 'border-edge bg-void-950/60 text-frost-400 hover:border-edge-strong hover:text-frost-100'
            }`}
          >
            <ArrowDownRight size={14} className="shrink-0 text-penalty-400" />
            <span className="truncate">Resource outflow</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            aria-pressed={isIncome}
            className={`flex min-w-0 items-center justify-center gap-2 border px-2 py-2.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-[border-color,background-color,box-shadow,color] ${
              isIncome
                ? 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_14px_-2px_rgba(30,144,255,0.6)]'
                : 'border-edge bg-void-950/60 text-frost-400 hover:border-edge-strong hover:text-frost-100'
            }`}
          >
            <ArrowUpRight size={14} className="shrink-0 text-system-400" />
            <span className="truncate">Treasury inflow</span>
          </button>
        </div>

        {/* Title & Amount */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-caps mb-1.5 block text-frost-400">
              {isIncome ? 'Source / Bounty Title' : 'Merchant / Title'} <span className="text-penalty-400">*</span>
            </span>
            <input
              type="text"
              required
              placeholder={isIncome ? 'e.g. Freelance Milestone / Contract' : 'e.g. Whey Protein, Gym Pass'}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="field"
            />
          </label>

          <label className="block">
            <span className="label-caps mb-1.5 block text-frost-400">
              Amount ({currency}) <span className="text-penalty-400">*</span>
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-system-300">
                {currency}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="field pl-9! font-mono"
              />
            </div>
          </label>
        </div>

        {/* Category Selector Tiles */}
        <div>
          <span className="label-caps mb-1.5 block text-frost-400">Classification category</span>
          <div className="grid max-h-44 grid-cols-1 gap-1.5 overflow-y-auto pr-1 min-[400px]:grid-cols-2 sm:grid-cols-3">
            {activeCategories.map((cat) => {
              const isSelected = form.category === cat.name
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setForm({ ...form, category: cat.name })}
                  aria-pressed={isSelected}
                  className={`flex min-w-0 items-center gap-2 border px-2.5 py-2 text-left transition-[border-color,background-color,box-shadow,color] ${
                    isSelected
                      ? 'text-frost-50'
                      : 'border-edge bg-void-950/60 text-frost-400 hover:border-edge-strong hover:text-frost-100'
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: cat.color,
                          backgroundColor: `${cat.color}1f`,
                          boxShadow: `0 0 14px -3px ${cat.color}, inset 0 0 10px -4px ${cat.color}`,
                        }
                      : undefined
                  }
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0"
                    style={{
                      backgroundColor: cat.color,
                      boxShadow: isSelected ? `0 0 8px ${cat.color}` : undefined,
                    }}
                  />
                  <span className="label-caps truncate text-[0.68rem] tracking-[0.12em]">{cat.name}</span>
                  {isSelected && <Check size={12} className="ml-auto shrink-0" style={{ color: cat.color }} />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Date & Payment Method */}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-caps mb-1.5 block text-frost-400">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="field font-mono"
            />
          </label>

          <label className="block">
            <span className="label-caps mb-1.5 block text-frost-400">Payment protocol</span>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="field font-mono"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Notes / Description */}
        <label className="block">
          <span className="label-caps mb-1.5 block text-frost-400">Notes / Remarks</span>
          <textarea
            rows={2}
            placeholder="Details, purpose, breakdown or receipt notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="field resize-y"
          />
        </label>

        {/* Tags */}
        <label className="block">
          <span className="label-caps mb-1.5 block text-frost-400">Custom tags (comma separated)</span>
          <div className="relative">
            <Tag size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-frost-500" />
            <input
              type="text"
              placeholder="e.g. Fuel, Focus, Software, Monthly"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="field pl-9! font-mono"
            />
          </div>
        </label>

        {/* Modal Actions */}
        <div className="flex flex-wrap justify-end gap-2 border-t border-edge pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            <Check size={15} /> {initialData ? 'Update record' : 'Save transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ExpenseModal
