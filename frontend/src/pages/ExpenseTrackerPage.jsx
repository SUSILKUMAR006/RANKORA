import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Coins,
  Download,
  Plus,
  Settings2,
  Trash2,
  Wallet,
} from 'lucide-react'
import Button from '../components/common/Button.jsx'
import Modal from '../components/common/Modal.jsx'
import BudgetModal from '../components/expenses/BudgetModal.jsx'
import ExpenseCharts from '../components/expenses/ExpenseCharts.jsx'
import ExpenseList from '../components/expenses/ExpenseList.jsx'
import ExpenseSummaryCards from '../components/expenses/ExpenseSummaryCards.jsx'
import ExpenseFormModal from '../components/expenses/ExpenseModal.jsx'
import { expenseService } from '../services/expenseService.js'
import {
  calculateExpenseStats,
  getSpendingVelocityData,
  getStoredBudget,
  getStoredCurrency,
  getStoredExpenses,
  saveStoredBudget,
  saveStoredCurrency,
} from '../utils/expenseUtils.js'

export function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState(() => getStoredExpenses())
  const [budget, setBudget] = useState(() => getStoredBudget())
  const [currency, setCurrency] = useState(() => getStoredCurrency())

  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [budgetModalOpen, setBudgetModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchExpenses = async () => {
    const list = await expenseService.getExpenses()
    if (list) setExpenses(list)
    setBudget(getStoredBudget())
    setCurrency(getStoredCurrency())
  }

  useEffect(() => {
    fetchExpenses()
    window.addEventListener('storage', fetchExpenses)
    window.addEventListener('rankora-expenses-updated', fetchExpenses)
    return () => {
      window.removeEventListener('storage', fetchExpenses)
      window.removeEventListener('rankora-expenses-updated', fetchExpenses)
    }
  }, [])

  // Calculate statistics & analytics
  const stats = calculateExpenseStats(expenses, budget)
  const velocityData = getSpendingVelocityData(expenses, 14)

  const handleOpenAdd = () => {
    setEditingExpense(null)
    setExpenseModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditingExpense(item)
    setExpenseModalOpen(true)
  }

  const handleSubmitExpense = async (formData) => {
    if (editingExpense) {
      await expenseService.updateExpense(
        editingExpense._id || editingExpense.id,
        formData
      )
    } else {
      await expenseService.createExpense(formData)
    }
    await fetchExpenses()
    setExpenseModalOpen(false)
    setEditingExpense(null)
  }

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await expenseService.deleteExpense(deleteTarget._id || deleteTarget.id)
      await fetchExpenses()
      setDeleteTarget(null)
    }
  }

  const handleSaveBudgetConfig = ({ budget: newBudget, currency: newCurrency }) => {
    saveStoredBudget(newBudget)
    saveStoredCurrency(newCurrency)
    setBudget(newBudget)
    setCurrency(newCurrency)
  }

  // Export CSV Ledger
  const handleExportCSV = () => {
    if (expenses.length === 0) return
    const headers = ['ID', 'Date', 'Type', 'Category', 'Title', 'Amount', 'Payment Method', 'Notes', 'Tags']
    const rows = expenses.map((e) => [
      e._id || e.id,
      e.date,
      e.type,
      `"${e.category}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      e.amount,
      `"${e.paymentMethod || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
      `"${(e.tags || []).join(';')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `rankora_expenses_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
              <Coins size={14} />
            </span>
            <p className="label-caps text-cyan-300/80">TREASURY CODEX / FINANCIAL TELEMETRY</p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            EXPENSE & TREASURY TRACKER
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Monitor cashflow velocity, budget limits, category allocations, and income inflows with precision discipline.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCSV}
            disabled={expenses.length === 0}
            title="Export CSV ledger"
          >
            <Download size={14} /> CSV
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBudgetModalOpen(true)}
            title="Configure Budget & Currency"
          >
            <Settings2 size={14} /> BUDGET
          </Button>

          <Button onClick={handleOpenAdd}>
            <Plus size={16} /> RECORD TRANSACTION
          </Button>
        </div>
      </motion.header>

      {/* 4 Holographic Summary Metric Cards */}
      <ExpenseSummaryCards
        stats={stats}
        currency={currency}
        onOpenBudgetModal={() => setBudgetModalOpen(true)}
      />

      {/* Visual Analytics Grid: Category Donut & 14-Day Velocity */}
      <ExpenseCharts
        categoryBreakdown={stats.categoryBreakdown}
        velocityData={velocityData}
        currency={currency}
      />

      {/* Transaction Feed & Search Filters */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <h2 className="font-display text-lg font-semibold text-white">
              TRANSACTION LEDGER
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {expenses.length} Records Logged
          </span>
        </div>

        <ExpenseList
          expenses={expenses}
          currency={currency}
          onAddTransaction={handleOpenAdd}
          onEditTransaction={handleOpenEdit}
          onDeleteTransaction={(item) => setDeleteTarget(item)}
        />
      </section>

      {/* Inscribe / Edit Transaction Modal */}
      <ExpenseFormModal
        open={expenseModalOpen}
        onClose={() => {
          setExpenseModalOpen(false)
          setEditingExpense(null)
        }}
        onSubmit={handleSubmitExpense}
        initialData={editingExpense}
        currency={currency}
      />

      {/* Budget & Currency Settings Modal */}
      <BudgetModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        currentBudget={budget}
        currentCurrency={currency}
        onSave={handleSaveBudgetConfig}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="DELETE TRANSACTION?"
        eyebrow="CONFIRM LEDGER PURGE"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              CANCEL
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <Trash2 size={15} /> PURGE
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Are you sure you want to delete the transaction record "{deleteTarget?.title}"?
          This will update all category telemetry and budget stats immediately.
        </p>
      </Modal>

      {/* Telemetry Status Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-700"
      >
        Rankora Treasury Protocol · Live Inflow & Outflow Telemetry Active
      </motion.p>
    </div>
  )
}

export default ExpenseTrackerPage
