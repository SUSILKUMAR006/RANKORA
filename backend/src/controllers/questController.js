import Boss from '../models/Boss.js'
import DailyLog from '../models/DailyLog.js'
import Notification from '../models/Notification.js'
import Quest from '../models/Quest.js'
import User from '../models/User.js'

function requiredXpForLevel(level) {
  if (level <= 1) return 100
  if (level <= 5) return level * 100 + 50
  if (level <= 10) return level * 120
  if (level <= 15) return level * 140
  if (level <= 20) return level * 160
  return level * 180
}

function calculateRank(level) {
  if (level >= 20) return 'S'
  if (level >= 15) return 'A'
  if (level >= 10) return 'B'
  if (level >= 5) return 'C'
  if (level >= 3) return 'D'
  return 'E'
}

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10)
}

function addDaysKey(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return todayKey(date)
}

async function recordDailyLog(userId, dateKey, quests, xpEarned = 0) {
  const total = quests.length
  const completed = quests.filter((q) => q.status === 'completed').length
  const failed = quests.filter((q) => q.status === 'failed').length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return DailyLog.findOneAndUpdate(
    { userId, dateKey },
    {
      $set: { total, completed, failed, percentage },
      $inc: { xpEarned },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

// Ensures the user's persistent daily-quest roster reflects "today". If the
// stored quests belong to a previous day, archive that day's results into
// DailyLog and reset the roster to pending for today.
async function ensureQuestsForToday(userId) {
  const quests = await Quest.find({ userId }).sort({ createdAt: 1 })
  if (quests.length === 0) return quests

  const now = new Date()
  const currentKey = todayKey(now)
  const staleQuests = quests.filter((q) => q.dayKey && q.dayKey !== currentKey)

  if (staleQuests.length === 0) {
    // Backfill dayKey for legacy documents created before this field existed.
    const missingDayKey = quests.filter((q) => !q.dayKey)
    if (missingDayKey.length > 0) {
      await Promise.all(
        missingDayKey.map((q) => Quest.updateOne({ _id: q._id }, { $set: { dayKey: currentKey } }))
      )
    }
    return quests
  }

  const previousDayKey = staleQuests[0].dayKey
  await recordDailyLog(userId, previousDayKey, staleQuests)

  await Promise.all(
    staleQuests.map((q) =>
      Quest.updateOne(
        { _id: q._id },
        {
          $set: {
            status: 'pending',
            progress: 0,
            history: [],
            verificationProof: null,
            completedAt: null,
            failedAt: null,
            failureReason: null,
            failureNote: null,
            dayKey: currentKey,
          },
        }
      )
    )
  )

  return Quest.find({ userId }).sort({ createdAt: 1 })
}

function applyStreakUpdate(user, now = new Date()) {
  const currentKey = todayKey(now)
  if (user.lastStreakDate === currentKey) return false

  const yesterdayKey = addDaysKey(currentKey, -1)
  user.currentStreak = user.lastStreakDate === yesterdayKey ? (user.currentStreak || 0) + 1 : 1
  user.bestStreak = Math.max(user.bestStreak || 0, user.currentStreak)
  user.lastStreakDate = currentKey
  return true
}

export async function getQuests(req, res, next) {
  try {
    const quests = await ensureQuestsForToday(req.user._id)
    res.json({ success: true, quests })
  } catch (error) {
    next(error)
  }
}

export async function getQuestById(req, res, next) {
  try {
    const quest = await Quest.findOne({
      $or: [{ _id: req.params.id }, { questKey: req.params.id }],
      userId: req.user._id,
    })
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found.' })
    }
    res.json({ success: true, quest })
  } catch (error) {
    next(error)
  }
}

export async function createQuest(req, res, next) {
  try {
    const quest = await Quest.create({
      ...req.body,
      userId: req.user._id,
      dayKey: todayKey(),
    })
    res.status(201).json({ success: true, quest })
  } catch (error) {
    next(error)
  }
}

export async function completeQuest(req, res, next) {
  try {
    await ensureQuestsForToday(req.user._id)

    const quest = await Quest.findOne({
      $or: [{ _id: req.params.id }, { questKey: req.params.id }],
      userId: req.user._id,
    })
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found.' })
    }
    if (quest.status === 'completed') {
      const user = await User.findById(req.user._id).select('-passwordHash')
      return res.json({ success: true, quest, user, alreadyCompleted: true })
    }

    const now = new Date()
    quest.status = 'completed'
    quest.completedAt = now
    quest.verificationProof = req.body?.proof || quest.verificationProof || null
    quest.history.unshift({
      date: 'Today',
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      status: 'COMPLETED',
      xp: quest.xp,
    })
    await quest.save()

    // 1. Award XP, Stats, Streak, and Check Level Up in MongoDB
    const user = await User.findById(req.user._id)
    let leveledUp = false
    let previousLevel = user.level
    let newLevel = user.level

    if (user) {
      user.xp = (user.xp || 0) + (quest.xp || 0)

      // Apply Stat Reward
      const rawReward = quest.statReward || ''
      if (rawReward.includes('STR')) user.stats.str = (user.stats.str || 0) + 2
      else if (rawReward.includes('VIT')) user.stats.vit = (user.stats.vit || 0) + 1
      else if (rawReward.includes('DISC')) user.stats.disc = (user.stats.disc || 0) + 1
      else if (rawReward.includes('INT')) user.stats.int = (user.stats.int || 0) + 1
      else if (rawReward.includes('AGI')) user.stats.agi = (user.stats.agi || 0) + 1

      // Level Progression
      let reqXp = requiredXpForLevel(user.level)
      while (user.xp >= reqXp) {
        user.xp -= reqXp
        user.level += 1
        leveledUp = true
        reqXp = requiredXpForLevel(user.level)
      }
      user.rank = calculateRank(user.level)
      newLevel = user.level

      // Streak only advances once per day, and only once every quest for
      // today is completed.
      const allQuests = await Quest.find({ userId: req.user._id, dayKey: quest.dayKey })
      const allCompletedToday = allQuests.length > 0 && allQuests.every((q) => q.status === 'completed')
      if (allCompletedToday) {
        applyStreakUpdate(user, now)
      }

      await user.save()

      await recordDailyLog(req.user._id, quest.dayKey || todayKey(now), allQuests, quest.xp || 0)
    }

    // 2. Deal Damage to Active Boss in MongoDB
    const activeBoss = await Boss.findOne({ userId: req.user._id, status: 'ACTIVE' })
    if (activeBoss) {
      const damage = quest.title.toLowerCase().includes('gym') ? 100 : 50
      activeBoss.currentHp = Math.max(0, activeBoss.currentHp - damage)
      if (activeBoss.currentHp === 0) {
        activeBoss.status = 'DEFEATED'
        activeBoss.defeatedAt = now
      }
      activeBoss.damageLog.unshift({
        questId: quest._id.toString(),
        questTitle: quest.title,
        damage,
        category: quest.category || 'General',
        timestamp: now.toISOString(),
      })
      await activeBoss.save()
    }

    // 3. Notification in MongoDB
    await Notification.create({
      userId: req.user._id,
      type: 'quest_complete',
      eventKey: `quest-complete-${quest._id}-${now.getTime()}`,
      title: 'OBJECTIVE VERIFIED',
      message: `"${quest.title}" completed. +${quest.xp} XP and ${quest.statReward || '+1 DISC'} added.`,
      tone: 'emerald',
      iconName: 'CheckCircle2',
      link: `/quests/${quest._id}`,
    })

    const userObj = user.toObject()
    delete userObj.passwordHash

    res.json({
      success: true,
      quest,
      user: userObj,
      gainedXp: quest.xp,
      leveledUp,
      previousLevel,
      newLevel,
    })
  } catch (error) {
    next(error)
  }
}

export async function failQuest(req, res, next) {
  try {
    await ensureQuestsForToday(req.user._id)

    const { reason, note } = req.body
    const quest = await Quest.findOne({
      $or: [{ _id: req.params.id }, { questKey: req.params.id }],
      userId: req.user._id,
    })
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found.' })
    }

    const now = new Date()
    quest.status = 'failed'
    quest.failedAt = now
    quest.failureReason = reason || 'Obstacle Encountered'
    quest.failureNote = note || ''
    quest.history.unshift({
      date: 'Today',
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      status: 'FAILED',
      reason,
      note,
      xp: 0,
    })
    await quest.save()

    const allQuests = await Quest.find({ userId: req.user._id, dayKey: quest.dayKey })
    await recordDailyLog(req.user._id, quest.dayKey || todayKey(now), allQuests)

    res.json({ success: true, quest })
  } catch (error) {
    next(error)
  }
}

export async function deleteQuest(req, res, next) {
  try {
    await Quest.findOneAndDelete({
      $or: [{ _id: req.params.id }, { questKey: req.params.id }],
      userId: req.user._id,
    })
    res.json({ success: true, message: 'Quest deleted successfully.' })
  } catch (error) {
    next(error)
  }
}

export async function getDailyLogHistory(req, res, next) {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365)
    const now = new Date()
    const sinceKey = addDaysKey(todayKey(now), -(days - 1))

    const logs = await DailyLog.find({
      userId: req.user._id,
      dateKey: { $gte: sinceKey },
    }).sort({ dateKey: 1 })

    res.json({ success: true, logs })
  } catch (error) {
    next(error)
  }
}
