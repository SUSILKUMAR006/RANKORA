import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    defaultDifficulty: {
      type: String,
      enum: ['Easy', 'Normal', 'Hard'],
      default: 'Normal',
    },
    defaultQuestType: {
      type: String,
      enum: ['Mandatory', 'Optional'],
      default: 'Mandatory',
    },
    defaultVerification: {
      type: String,
      default: 'None',
    },
    systemNotifications: {
      type: Boolean,
      default: true,
    },
    achievementNotifications: {
      type: Boolean,
      default: true,
    },
    bossNotifications: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: 'dark-cyberpunk',
    },
    glowEffects: {
      type: Boolean,
      default: true,
    },
    photosPrivate: {
      type: Boolean,
      default: true,
    },
    diaryPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Settings = mongoose.model('Settings', settingsSchema)
export default Settings
