import mongoose from 'mongoose'

const damageLogSchema = new mongoose.Schema(
  {
    questId: { type: String, required: true },
    questTitle: { type: String, required: true },
    damage: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
)

const bossSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weekKey: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: 'The Procrastinator',
    },
    title: {
      type: String,
      default: 'Lord of Tomorrow',
    },
    description: {
      type: String,
      default: 'A towering phantom that feeds on delayed intent and unfinished objectives.',
    },
    maxHp: {
      type: Number,
      default: 500,
    },
    currentHp: {
      type: Number,
      default: 500,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DEFEATED'],
      default: 'ACTIVE',
    },
    xpReward: {
      type: Number,
      default: 1000,
    },
    rewardClaimed: {
      type: Boolean,
      default: false,
    },
    damageLog: [damageLogSchema],
    processedQuestIds: [String],
    defeatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const Boss = mongoose.model('Boss', bossSchema)
export default Boss
