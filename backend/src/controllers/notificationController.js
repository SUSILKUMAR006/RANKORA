import Notification from '../models/Notification.js'

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, notifications })
  } catch (error) {
    next(error)
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    )
    res.json({ success: true, notification })
  } catch (error) {
    next(error)
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id }, { $set: { isRead: true } })
    res.json({ success: true, message: 'All notifications marked as read.' })
  } catch (error) {
    next(error)
  }
}

export async function deleteNotification(req, res, next) {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.json({ success: true, message: 'Notification deleted.' })
  } catch (error) {
    next(error)
  }
}

export async function clearAll(req, res, next) {
  try {
    await Notification.deleteMany({ userId: req.user._id })
    res.json({ success: true, message: 'All notifications cleared.' })
  } catch (error) {
    next(error)
  }
}
