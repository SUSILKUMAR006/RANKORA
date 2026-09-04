import Diary from '../models/Diary.js'

export async function getDiaryEntries(req, res, next) {
  try {
    const entries = await Diary.find({ userId: req.user._id }).sort({ date: -1, createdAt: -1 })
    res.json({ success: true, entries })
  } catch (error) {
    next(error)
  }
}

export async function createDiaryEntry(req, res, next) {
  try {
    const entry = await Diary.create({
      ...req.body,
      userId: req.user._id,
    })
    res.status(201).json({ success: true, entry })
  } catch (error) {
    next(error)
  }
}

export async function updateDiaryEntry(req, res, next) {
  try {
    const entry = await Diary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    )
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Diary entry not found.' })
    }
    res.json({ success: true, entry })
  } catch (error) {
    next(error)
  }
}

export async function deleteDiaryEntry(req, res, next) {
  try {
    await Diary.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.json({ success: true, message: 'Diary entry deleted.' })
  } catch (error) {
    next(error)
  }
}
