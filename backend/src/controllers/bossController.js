import Boss from '../models/Boss.js'
import User from '../models/User.js'

export async function getCurrentBoss(req, res, next) {
  try {
    const currentWeekKey = `week-${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`
    let boss = await Boss.findOne({ userId: req.user._id, weekKey: currentWeekKey })

    if (!boss) {
      boss = await Boss.create({
        userId: req.user._id,
        weekKey: currentWeekKey,
        name: 'The Procrastinator',
        title: 'Lord of Tomorrow',
        maxHp: 500,
        currentHp: 500,
        status: 'ACTIVE',
      })
    }

    res.json({ success: true, boss })
  } catch (error) {
    next(error)
  }
}

export async function attackBoss(req, res, next) {
  try {
    const { questId, questTitle, damage = 100 } = req.body
    const currentWeekKey = `week-${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`
    const boss = await Boss.findOne({ userId: req.user._id, weekKey: currentWeekKey })

    if (!boss) {
      return res.status(404).json({ success: false, message: 'No active boss battle found.' })
    }

    if (boss.status === 'DEFEATED') {
      return res.json({ success: true, boss, alreadyDefeated: true })
    }

    const nextHp = Math.max(0, boss.currentHp - damage)
    boss.currentHp = nextHp
    boss.damageLog.unshift({
      questId,
      questTitle: questTitle || 'Daily Quest',
      damage,
      timestamp: new Date(),
    })

    let justDefeated = false
    if (nextHp === 0 && boss.status !== 'DEFEATED') {
      boss.status = 'DEFEATED'
      boss.defeatedAt = new Date()
      justDefeated = true

      // Award +1000 XP to User
      const user = await User.findById(req.user._id)
      if (user) {
        user.xp += 1000
        await user.save()
      }
    }

    await boss.save()
    res.json({ success: true, boss, damageDealt: damage, justDefeated })
  } catch (error) {
    next(error)
  }
}

export async function getBossHistory(req, res, next) {
  try {
    const history = await Boss.find({ userId: req.user._id, status: 'DEFEATED' }).sort({ defeatedAt: -1 })
    res.json({ success: true, history })
  } catch (error) {
    next(error)
  }
}
