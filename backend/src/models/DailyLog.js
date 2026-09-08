import mongoose from 'mongoose'

const dailyLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    dateKey: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    streakDay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

dailyLogSchema.index({ userId: 1, dateKey: 1 }, { unique: true })

export const DailyLog = mongoose.model('DailyLog', dailyLogSchema)
export default DailyLog
