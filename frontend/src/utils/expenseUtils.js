import { addNotification } from './notificationUtils.js'

export const EXPENSES_STORAGE_KEY = 'rankora_expenses'
export const BUDGET_STORAGE_KEY = 'rankora_budget'
export const CURRENCY_STORAGE_KEY = 'rankora_currency'

export const EXPENSE_CATEGORIES = [
  { name: 'Food & Nutrition', color: '#38bdf8', icon: 'Utensils', desc: 'Fuel, meals & supplements' },
  { name: 'Health & Fitness', color: '#4ade80', icon: 'Dumbbell', desc: 'Gym, gear & recovery' },
  { name: 'Housing & Rent', color: '#818cf8', icon: 'Home', desc: 'Citadel base & living' },
  { name: 'Education & Growth', color: '#a78bfa', icon: 'BookOpen', desc: 'Books, courses & intellect' },
  { name: 'Tech & Gear', color: '#f472b6', icon: 'Cpu', desc: 'Software, hardware & tools' },
  { name: 'Transport & Travel', color: '#fbbf24', icon: 'Car', desc: 'Transit & mobility' },
  { name: 'Leisure & Social', color: '#fb7185', icon: 'Smile', desc: 'Recreation & entertainment' },
  { name: 'Investments & Vault', color: '#34d399', icon: 'Vault', desc: 'Savings & compounding' },
  { name: 'Utilities & Bills', color: '#94a3b8', icon: 'Zap', desc: 'Power, network & node fees' },
  { name: 'Other Protocol', color: '#e2e8f0', icon: 'Package', desc: 'Miscellaneous operations' },
]

export const INCOME_CATEGORIES = [
  { name: 'Salary / Main Yield', color: '#2dd4bf', icon: 'Briefcase', desc: 'Core compensation' },
  { name: 'Freelance / Bounty', color: '#67e8f9', icon: 'Swords', desc: 'Contract objectives' },
  { name: 'Investments / Dividends', color: '#34d399', icon: 'TrendingUp', desc: 'Capital returns' },
  { name: 'Gifts & Rewards', color: '#f472b6', icon: 'Sparkles', desc: 'Bonus inflows' },
  { name: 'Other Inflow', color: '#cbd5e1', icon: 'PlusCircle', desc: 'Uncategorized yield' },
]

export const PAYMENT_METHODS = [
  'Card / Digital',
  'UPI / Instant Pay',
  'Cash',
  'Bank Transfer',
  'Crypto / Web3',
  'Other',
]

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CR', symbol: 'CR ', label: 'Credits (CR)' },
]

export const DEFAULT_BUDGET = 2000

export const DEFAULT_EXPENSES = [
  {
    id: 'exp-1',
    title: 'High-Protein Nutrition & Groceries',
    amount: 85.5,
    type: 'expense',
    category: 'Food & Nutrition',
    date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10),
    paymentMethod: 'Card / Digital',
    notes: 'Lean chicken, oats, whey isolate, and electrolyte pack',
    tags: ['Fuel', 'Recovery'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    title: 'Gym Citadel Monthly Access',
    amount: 60.0,
    type: 'expense',
    category: 'Health & Fitness',
    date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
    paymentMethod: 'Card / Digital',
    notes: '24/7 barbell club & sauna pass',
    tags: ['Fitness', 'Discipline'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    title: 'Contract Bounty Settlement',
    amount: 1450.0,
    type: 'income',
    category: 'Freelance / Bounty',
    date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10),
    paymentMethod: 'Bank Transfer',
    notes: 'Completed full-stack client optimization milestone',
    tags: ['Yield', 'Milestone'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-4',
    title: 'Focus Music & Cloud Telemetry Sub',
    amount: 19.99,
    type: 'expense',
    category: 'Tech & Gear',
    date: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10),
    paymentMethod: 'Card / Digital',
    notes: 'Brain.fm & Cloud compute servers',
    tags: ['Tools'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-5',
    title: 'Deep Work Books & Kindle Audio',
    amount: 28.4,
    type: 'expense',
    category: 'Education & Growth',
    date: new Date(Date.now() - 8 * 86400000).toISOString().slice(0, 10),
    paymentMethod: 'Card / Digital',
    notes: 'Atomic Habits + Principles of Focus',
    tags: ['Mindset'],
    createdAt: new Date().toISOString(),
  },
]

export function getStoredExpenses() {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
    // Initialize default seed data if brand new
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(DEFAULT_EXPENSES))
    return DEFAULT_EXPENSES
  } catch {
    return DEFAULT_EXPENSES
  }
}

export function saveExpenses(expenses) {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses))
    window.dispatchEvent(new Event('rankora-expenses-updated'))
  } catch {
    // ignore
  }
}

export function getStoredBudget() {
  try {
    const raw = localStorage.getItem(BUDGET_STORAGE_KEY)
    if (raw) {
      const num = Number(raw)
      if (!isNaN(num) && num > 0) return num
    }
    return DEFAULT_BUDGET
  } catch {
    return DEFAULT_BUDGET
  }
}

export function saveStoredBudget(amount) {
  try {
    const valid = Math.max(1, Number(amount) || DEFAULT_BUDGET)
    localStorage.setItem(BUDGET_STORAGE_KEY, String(valid))
    window.dispatchEvent(new Event('rankora-expenses-updated'))
    return valid
  } catch {
    return DEFAULT_BUDGET
  }
}

export function getStoredCurrency() {
  try {
    return localStorage.getItem(CURRENCY_STORAGE_KEY) || '$'
  } catch {
    return '$'
  }
}

export function saveStoredCurrency(symbol) {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, symbol)
    window.dispatchEvent(new Event('rankora-expenses-updated'))
    return symbol
  } catch {
    return '$'
  }
}

export function formatCurrency(amount, symbol = '$') {
  const num = Number(amount) || 0
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${symbol}${formatted}`
}

export function addExpense(entry) {
  const current = getStoredExpenses()
  const isIncome = entry.type === 'income'
  const newEntry = {
    id: entry.id || entry._id || `exp-${Date.now()}`,
    _id: entry._id || undefined,
    title: entry.title?.trim() || (isIncome ? 'Yield Inflow' : 'Resource Expense'),
    amount: Math.abs(Number(entry.amount) || 0),
    type: entry.type || 'expense',
    category: entry.category || (isIncome ? 'Other Inflow' : 'Other Protocol'),
    date: entry.date || new Date().toISOString().slice(0, 10),
    paymentMethod: entry.paymentMethod || 'Card / Digital',
    notes: entry.notes || '',
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    createdAt: new Date().toISOString(),
  }

  const updated = [newEntry, ...current]
  saveExpenses(updated)

  // Dispatch System Notification
  addNotification({
    type: 'system',
    eventKey: `expense-${newEntry.id}`,
    title: isIncome ? 'TREASURY YIELD INFLOW' : 'RESOURCE OUTFLOW RECORDED',
    message: `${isIncome ? '+' : '-'}${formatCurrency(newEntry.amount, getStoredCurrency())} in [${newEntry.category}] recorded to ledger.`,
    tone: isIncome ? 'cyan' : 'orange',
    iconName: isIncome ? 'TrendingUp' : 'Coins',
    link: '/expenses',
  })

  return newEntry
}

export function updateStoredExpense(id, updates) {
  const current = getStoredExpenses()
  const updated = current.map((item) =>
    item.id === id || item._id === id ? { ...item, ...updates } : item
  )
  saveExpenses(updated)
  return updated.find((item) => item.id === id || item._id === id)
}

export function deleteStoredExpense(id) {
  const current = getStoredExpenses()
  const updated = current.filter((item) => item.id !== id && item._id !== id)
  saveExpenses(updated)
  return updated
}

export function calculateExpenseStats(expenses = [], budget = DEFAULT_BUDGET) {
  const currentMonthPrefix = new Date().toISOString().slice(0, 7)
  const currentYearPrefix = new Date().toISOString().slice(0, 4)

  const monthRecords = expenses.filter((r) => r.date && r.date.startsWith(currentMonthPrefix))

  const monthlyExpense = monthRecords
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0)

  const monthlyIncome = monthRecords
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0)

  const totalExpenseAllTime = expenses
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0)

  const totalIncomeAllTime = expenses
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + Number(r.amount || 0), 0)

  const monthlyNet = monthlyIncome - monthlyExpense
  const netBalanceAllTime = totalIncomeAllTime - totalExpenseAllTime

  // Budget calculations
  const budgetRatio = budget > 0 ? (monthlyExpense / budget) * 100 : 0
  const budgetRemaining = Math.max(0, budget - monthlyExpense)
  const isOverBudget = monthlyExpense > budget

  // Savings rate
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round((monthlyNet / monthlyIncome) * 100)) : 0

  // Category breakdown for current month (or all time if month empty)
  const targetRecords = monthRecords.length > 0 ? monthRecords : expenses
  const expenseRecords = targetRecords.filter((r) => r.type === 'expense')
  const totalTargetExpense = expenseRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0)

  const categoryMap = {}
  expenseRecords.forEach((item) => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + Number(item.amount || 0)
  })

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, amount]) => {
      const catObj = EXPENSE_CATEGORIES.find((c) => c.name === name)
      return {
        name,
        amount,
        percentage: totalTargetExpense > 0 ? Math.round((amount / totalTargetExpense) * 100) : 0,
        color: catObj ? catObj.color : '#94a3b8',
      }
    })
    .sort((a, b) => b.amount - a.amount)

  // Top spending category
  const topCategory = categoryBreakdown[0] || { name: 'None', amount: 0, percentage: 0 }

  return {
    monthlyExpense,
    monthlyIncome,
    monthlyNet,
    totalExpenseAllTime,
    totalIncomeAllTime,
    netBalanceAllTime,
    budget,
    budgetRatio: Math.min(100, Math.round(budgetRatio)),
    budgetRemaining,
    isOverBudget,
    savingsRate,
    topCategory,
    categoryBreakdown,
    totalTransactions: expenses.length,
  }
}

export function getSpendingVelocityData(expenses = [], days = 14) {
  const result = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const shortLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric' }).format(d)

    const dayExpenses = expenses
      .filter((e) => e.date === dateStr && e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)

    const dayIncome = expenses
      .filter((e) => e.date === dateStr && e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount || 0), 0)

    result.push({
      date: dateStr,
      label: shortLabel,
      expense: dayExpenses,
      income: dayIncome,
    })
  }

  return result
}
