import mongoose from 'mongoose'

const questHistorySchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String },
    status: { type: String, enum: ['COMPLETED', 'FAILED'], required: true },
    xp: { type: Number, default: 0 },
    reason: { type: String },
    note: { type: String },
  },
  { _id: false }
)

const questSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questKey: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    objective: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Fitness', 'Career', 'Knowledge', 'Health', 'Mind', 'General'],
      default: 'Fitness',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Normal', 'Hard'],
      default: 'Normal',
    },
    xp: {
      type: Number,
      default: 35,
    },
    statReward: {
      type: String,
      default: '+1 STR',
    },
    type: {
      type: String,
      enum: ['Mandatory', 'Optional'],
      default: 'Mandatory',
    },
    verification: {
      type: String,
      default: 'None',
    },
    estimatedTime: {
      type: String,
      default: '30 Minutes',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'pending_verification', 'skipped'],
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: null,
    },
    unit: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
    failureNote: {
      type: String,
    },
    history: [questHistorySchema],
  },
  {
    timestamps: true,
  }
)

export const Quest = mongoose.model('Quest', questSchema)
export default Quest
