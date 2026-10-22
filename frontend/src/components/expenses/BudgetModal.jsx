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
      title="Set Budget & Currency"
      eyebrow="Treasury protocol parameters"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Monthly Budget Target */}
        <label className="block">
          <span className="label-caps mb-1.5 flex items-center gap-1.5 text-frost-400">
            <Target size={12} className="text-system-300" /> Monthly spending ceiling
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-system-300">
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
              className="field pl-10! font-mono"
            />
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-frost-500">
            <ShieldAlert size={13} className="mt-px shrink-0 text-gold-400" />
            System will trigger telemetry alerts when outflows approach or exceed this threshold.
          </p>
        </label>

        {/* Currency Selector */}
        <div>
          <span className="label-caps mb-1.5 block text-frost-400">Preferred currency symbol</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CURRENCIES.map((c) => {
              const isSelected = currency === c.symbol
              return (
                <button
                  type="button"
                  key={c.code}
                  onClick={() => setCurrency(c.symbol)}
                  aria-pressed={isSelected}
                  className={`flex items-center justify-between border p-2.5 font-mono text-xs transition-[border-color,background-color,box-shadow,color] ${
                    isSelected
                      ? 'border-system-400 bg-system-500/15 text-frost-50 shadow-[0_0_12px_-2px_rgba(30,144,255,0.6)]'
                      : 'border-edge bg-void-950/60 text-frost-400 hover:border-edge-strong hover:text-frost-100'
                  }`}
                >
                  <span className={`text-base font-bold ${isSelected ? 'text-frost-50 sys-glow' : 'text-frost-200'}`}>
                    {c.symbol}
                  </span>
                  <span className={`label-caps text-[0.65rem] ${isSelected ? 'text-system-300' : 'text-frost-500'}`}>
                    {c.code}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap justify-end gap-2 border-t border-edge pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            <Check size={15} /> Update protocol
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default BudgetModal
