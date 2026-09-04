import mongoose from 'mongoose'

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: {
      type: String,
      required: true,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
    unlockedAt: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true })

export const Achievement = mongoose.model('Achievement', achievementSchema)
export default Achievement
