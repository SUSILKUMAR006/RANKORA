import api from './api.js'
import {
  addExpense,
  deleteStoredExpense,
  getStoredExpenses,
  saveExpenses,
  updateStoredExpense,
} from '../utils/expenseUtils.js'

export const expenseService = {
  /**
   * Fetch all expenses / transactions from MongoDB with local storage fallback
   * @param {Object} [params]
   */
  async getExpenses(params = {}) {
    try {
      const res = await api.get('/expenses', { params })
      if (res?.expenses && Array.isArray(res.expenses)) {
        saveExpenses(res.expenses)
        return res.expenses
      }
      return getStoredExpenses()
    } catch {
      return getStoredExpenses()
    }
  },

  /**
   * Create new expense / income record
   * @param {Object} data
   */
  async createExpense(data) {
    try {
      const res = await api.post('/expenses', data)
      if (res?.expense) {
        return addExpense(res.expense)
      }
      return addExpense(data)
    } catch {
      return addExpense(data)
    }
  },

  /**
   * Update existing transaction record
   * @param {string} id
   * @param {Object} updates
   */
  async updateExpense(id, updates) {
    try {
      const res = await api.put(`/expenses/${id}`, updates)
      if (res?.expense) {
        return updateStoredExpense(id, res.expense)
      }
      return updateStoredExpense(id, updates)
    } catch {
      return updateStoredExpense(id, updates)
    }
  },

  /**
   * Delete transaction record
   * @param {string} id
   */
  async deleteExpense(id) {
    try {
      await api.delete(`/expenses/${id}`)
      deleteStoredExpense(id)
      return { success: true }
    } catch {
      deleteStoredExpense(id)
      return { success: true }
    }
  },

  /**
   * Fetch stats from backend if available
   */
  async getStats() {
    try {
      const res = await api.get('/expenses/stats')
      return res?.stats || null
    } catch {
      return null
    }
  },
}

export default expenseService
