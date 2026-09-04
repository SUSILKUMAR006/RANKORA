import Quest from '../models/Quest.js'
import User from '../models/User.js'

export async function getAnalyticsSummary(req, res, next) {
  try {
    const period = req.query.period || '7d'
    const quests = await Quest.find({ userId: req.user._id })
    const user = await User.findById(req.user._id)

    const completed = quests.filter((q) => q.status === 'completed').length
    const failed = quests.filter((q) => q.status === 'failed').length
    const total = completed + failed
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0

    res.json({
      success: true,
      period,
      metrics: {
        totalQuests: total,
        completedQuests: completed,
        failedQuests: failed,
        successRate: `${successRate}%`,
        totalXp: user?.xp || 0,
        currentStreak: user?.currentStreak || 0,
        bestStreak: user?.bestStreak || 0,
      },
    })
  } catch (error) {
    next(error)
  }
}
