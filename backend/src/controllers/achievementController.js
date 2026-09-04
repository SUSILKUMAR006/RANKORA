import Achievement from '../models/Achievement.js'

export async function getAchievements(req, res, next) {
  try {
    const achievements = await Achievement.find({ userId: req.user._id })
    res.json({ success: true, achievements })
  } catch (error) {
    next(error)
  }
}

export async function claimAchievement(req, res, next) {
  try {
    const { achievementId } = req.params
    let achievement = await Achievement.findOne({ userId: req.user._id, achievementId })

    if (!achievement) {
      achievement = await Achievement.create({
        userId: req.user._id,
        achievementId,
        isUnlocked: true,
        unlockedAt: new Date(),
      })
    } else {
      achievement.isUnlocked = true
      achievement.unlockedAt = new Date()
      await achievement.save()
    }

    res.json({ success: true, achievement })
  } catch (error) {
    next(error)
  }
}
