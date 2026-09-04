import Expense from '../models/Expense.js'

export async function getExpenses(req, res, next) {
  try {
    const { type, category, search, startDate, endDate, sort = 'date_desc' } = req.query
    const query = { userId: req.user._id }

    if (type && type !== 'all') {
      query.type = type
    }

    if (category && category !== 'All') {
      query.category = category
    }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = startDate
      if (endDate) query.date.$lte = endDate
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { notes: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ]
    }

    let sortOption = { date: -1, createdAt: -1 }
    if (sort === 'date_asc') sortOption = { date: 1, createdAt: 1 }
    else if (sort === 'amount_desc') sortOption = { amount: -1, date: -1 }
    else if (sort === 'amount_asc') sortOption = { amount: 1, date: -1 }

    const expenses = await Expense.find(query).sort(sortOption)
    res.json({ success: true, count: expenses.length, expenses })
  } catch (error) {
    next(error)
  }
}

export async function createExpense(req, res, next) {
  try {
    const { title, amount, type = 'expense', category = 'Other', date, paymentMethod, notes, tags } = req.body

    if (!title || !amount) {
      return res.status(400).json({ success: false, message: 'Title and amount are required.' })
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: date || new Date().toISOString().slice(0, 10),
      paymentMethod: paymentMethod || 'Card / Digital',
      notes: notes || '',
      tags: Array.isArray(tags) ? tags : [],
    })

    res.status(201).json({ success: true, expense })
  } catch (error) {
    next(error)
  }
}

export async function updateExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    )

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' })
    }

    res.json({ success: true, expense })
  } catch (error) {
    next(error)
  }
}

export async function deleteExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense record not found.' })
    }
    res.json({ success: true, message: 'Transaction removed successfully.' })
  } catch (error) {
    next(error)
  }
}

export async function getExpenseStats(req, res, next) {
  try {
    const userId = req.user._id
    const currentMonthPrefix = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

    const allRecords = await Expense.find({ userId }).sort({ date: -1 })
    const monthRecords = allRecords.filter((r) => r.date && r.date.startsWith(currentMonthPrefix))

    const totalExpenseAllTime = allRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)
    const totalIncomeAllTime = allRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)

    const monthlyExpense = monthRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)
    const monthlyIncome = monthRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)

    // Category breakdown for current month
    const categoryTotals = {}
    monthRecords
      .filter((r) => r.type === 'expense')
      .forEach((r) => {
        categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount
      })

    const categoryBreakdown = Object.entries(categoryTotals).map(([name, amount]) => ({
      name,
      amount,
      percentage: monthlyExpense > 0 ? Math.round((amount / monthlyExpense) * 100) : 0,
    }))

    res.json({
      success: true,
      stats: {
        currentMonth: currentMonthPrefix,
        monthlyExpense,
        monthlyIncome,
        monthlyNet: monthlyIncome - monthlyExpense,
        totalExpenseAllTime,
        totalIncomeAllTime,
        netBalanceAllTime: totalIncomeAllTime - totalExpenseAllTime,
        transactionCount: allRecords.length,
        categoryBreakdown,
      },
    })
  } catch (error) {
    next(error)
  }
}
