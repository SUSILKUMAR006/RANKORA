import User from '../models/User.js'

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash')
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = req.body
    delete updates.passwordHash
    delete updates.email

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-passwordHash')

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export async function getStats(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('stats level rank xp')
    res.json({ success: true, stats: user?.stats, level: user?.level, rank: user?.rank, xp: user?.xp })
  } catch (error) {
    next(error)
  }
}

export async function updateStats(req, res, next) {
  try {
    const { stats } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { stats } },
      { new: true }
    ).select('stats')
    res.json({ success: true, stats: user?.stats })
  } catch (error) {
    next(error)
  }
}
