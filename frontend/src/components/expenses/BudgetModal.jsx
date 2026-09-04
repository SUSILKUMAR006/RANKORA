import { useEffect, useState } from 'react'
import { Check, DollarSign, ShieldAlert, Target } from 'lucide-react'
import Button from '../common/Button.jsx'
import Modal from '../common/Modal.jsx'
import { CURRENCIES } from '../../utils/expenseUtils.js'

export function BudgetModal({
  open,
  onClose,
  currentBudget,
  currentCurrency,
  onSave,
}) {
  const [budget, setBudget] = useState(String(currentBudget))
  const [currency, setCurrency] = useState(currentCurrency)

  useEffect(() => {
    setBudget(String(currentBudget))
    setCurrency(currentCurrency)
  }, [currentBudget, currentCurrency, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = Number(budget)
    if (isNaN(num) || num <= 0) return

    onSave({
      budget: num,
      currency,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="SET BUDGET & CURRENCY"
      eyebrow="TREASURY PROTOCOL PARAMETERS"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Monthly Budget Target */}
        <label className="block">
          <span className="label-caps text-slate-400">Monthly Spending Ceiling</span>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-300">
              {currency}
            </span>
            <input
              type="number"
              min="1"
              step="1"
              required
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="2000"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-9 pr-3 font-mono text-sm text-white outline-none transition focus:border-cyan-300/50"
            />
          </div>
          <p className="mt-1 text-[0.7rem] text-slate-500">
            System will trigger telemetry alerts when outflows approach or exceed this threshold.
          </p>
        </label>

        {/* Currency Selector */}
        <div>
          <span className="label-caps text-slate-400">Preferred Currency Symbol</span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CURRENCIES.map((c) => {
              const isSelected = currency === c.symbol
              return (
                <button
                  type="button"
                  key={c.code}
                  onClick={() => setCurrency(c.symbol)}
                  className={`flex items-center justify-between rounded-xl border p-2.5 font-mono text-xs transition ${
                    isSelected
                      ? 'border-cyan-300/50 bg-cyan-300/15 text-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.15)]'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-white">{c.symbol}</span>
                  <span className="text-[0.68rem] text-slate-500">{c.code}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            CANCEL
          </Button>
          <Button type="submit" variant="primary">
            <Check size={15} /> UPDATE PROTOCOL
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default BudgetModal
