import ProgressPhoto from '../models/ProgressPhoto.js'

export async function getProgressPhotos(req, res, next) {
  try {
    const photos = await ProgressPhoto.find({ userId: req.user._id }).sort({ date: -1 })
    res.json({ success: true, photos })
  } catch (error) {
    next(error)
  }
}

export async function uploadProgressPhoto(req, res, next) {
  try {
    const photo = await ProgressPhoto.create({
      ...req.body,
      userId: req.user._id,
    })
    res.status(201).json({ success: true, photo })
  } catch (error) {
    next(error)
  }
}

export async function deleteProgressPhoto(req, res, next) {
  try {
    await ProgressPhoto.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.json({ success: true, message: 'Photo removed.' })
  } catch (error) {
    next(error)
  }
}
