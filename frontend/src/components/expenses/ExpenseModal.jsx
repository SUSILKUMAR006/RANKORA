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
      title={initialData ? 'EDIT TRANSACTION' : 'RECORD TRANSACTION'}
      eyebrow="FINANCIAL TELEMETRY & TREASURY"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector (Expense vs Income) */}
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-1.5">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 font-mono text-xs transition ${
              !isIncome
                ? 'border border-rose-400/30 bg-rose-400/15 text-rose-200 shadow-[0_0_12px_rgba(251,113,133,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight size={14} className="text-rose-400" />
            <span>RESOURCE OUTFLOW</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 rounded-lg py-2 font-mono text-xs transition ${
              isIncome
                ? 'border border-cyan-400/30 bg-cyan-400/15 text-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.15)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight size={14} className="text-cyan-400" />
            <span>TREASURY INFLOW</span>
          </button>
        </div>

        {/* Title & Amount */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label-caps text-slate-400">
              {isIncome ? 'Source / Bounty Title' : 'Merchant / Title'} *
            </span>
            <input
              type="text"
              required
              placeholder={isIncome ? 'e.g. Freelance Milestone / Contract' : 'e.g. Whey Protein, Gym Pass'}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-display text-sm text-white outline-none transition focus:border-cyan-300/50"
            />
          </label>

          <label className="block">
            <span className="label-caps text-slate-400">Amount ({currency}) *</span>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500">
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
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-8 pr-3 font-mono text-sm text-white outline-none transition focus:border-cyan-300/50"
              />
            </div>
          </label>
        </div>

        {/* Category Selector Chips */}
        <div>
          <span className="label-caps text-slate-400">Classification Category</span>
          <div className="mt-1.5 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {activeCategories.map((cat) => {
              const isSelected = form.category === cat.name
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setForm({ ...form, category: cat.name })}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[0.68rem] transition ${
                    isSelected
                      ? 'border bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white'
                  }`}
                  style={{
                    borderColor: isSelected ? cat.color : undefined,
                    color: isSelected ? cat.color : undefined,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Date & Payment Method */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="label-caps text-slate-400">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
            />
          </label>

          <label className="block">
            <span className="label-caps text-slate-400">Payment Protocol</span>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-rankora-900 px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50"
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
          <span className="label-caps text-slate-400">Notes / Remarks</span>
          <textarea
            rows={2}
            placeholder="Details, purpose, breakdown or receipt notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] p-2.5 font-sans text-xs text-white outline-none focus:border-cyan-300/50 placeholder:text-slate-500"
          />
        </label>

        {/* Tags */}
        <label className="block">
          <span className="label-caps text-slate-400">Custom Tags (Comma Separated)</span>
          <input
            type="text"
            placeholder="e.g. Fuel, Focus, Software, Monthly"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-1 h-9 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 font-mono text-xs text-white outline-none focus:border-cyan-300/50 placeholder:text-slate-600"
          />
        </label>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary">
            <Check size={15} /> {initialData ? 'UPDATE RECORD' : 'SAVE TRANSACTION'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ExpenseModal
