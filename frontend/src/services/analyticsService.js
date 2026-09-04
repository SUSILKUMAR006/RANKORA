import api from './api.js'
import { getAnalyticsData } from '../utils/analyticsUtils.js'
import { generateSystemAnalysis } from '../utils/systemAnalysisUtils.js'

export const analyticsService = {
  /**
   * Fetch aggregated analytics metrics for given period
   * @param {'7d'|'30d'|'90d'|'all'} period
   */
  async getAnalyticsSummary(period = '30d') {
    try {
      // Future API: return await api.get('/analytics/summary', { params: { period } })
      return getAnalyticsData(period)
    } catch (error) {
      throw error
    }
  },

  /**
   * Fetch XP trajectory over period
   * @param {'7d'|'30d'|'90d'|'all'} period
   */
  async getXpHistory(period = '30d') {
    try {
      // Future API: return await api.get('/analytics/xp-history', { params: { period } })
      const data = getAnalyticsData(period)
      return data.charts.xpHistory
    } catch (error) {
      throw error
    }
  },

  /**
   * Fetch category distribution
   * @param {'7d'|'30d'|'90d'|'all'} period
   */
  async getCategoryBreakdown(period = '30d') {
    try {
      // Future API: return await api.get('/analytics/categories', { params: { period } })
      const data = getAnalyticsData(period)
      return data.charts.categories
    } catch (error) {
      throw error
    }
  },

  /**
   * Fetch activity heatmap matrix
   */
  async getActivityHeatmap() {
    try {
      // Future API: return await api.get('/analytics/heatmap')
      const data = getAnalyticsData('30d')
      return data.charts.heatmap
    } catch (error) {
      throw error
    }
  },

  /**
   * Fetch rule-based telemetry diagnostic
   */
  async getSystemAnalysis() {
    try {
      // Future API: return await api.get('/analytics/system-analysis')
      return generateSystemAnalysis()
    } catch (error) {
      throw error
    }
  },
}

export default analyticsService
