import mongoose from 'mongoose'

const progressPhotoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toISOString().slice(0, 10),
    },
    dayNumber: {
      type: Number,
      default: 1,
    },
    note: {
      type: String,
      default: '',
    },
    weight: {
      type: String,
      default: '',
    },
    photoUrl: {
      type: String,
      required: true,
    },
    isOriginal: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const ProgressPhoto = mongoose.model('ProgressPhoto', progressPhotoSchema)
export default ProgressPhoto
