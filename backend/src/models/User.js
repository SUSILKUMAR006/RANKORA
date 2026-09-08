import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'PLAYER',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'solar',
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    rank: {
      type: String,
      enum: ['E', 'D', 'C', 'B', 'A', 'S'],
      default: 'E',
    },
    stats: {
      str: { type: Number, default: 0 },
      vit: { type: Number, default: 0 },
      int: { type: Number, default: 0 },
      agi: { type: Number, default: 0 },
      disc: { type: Number, default: 0 },
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
    },
    lastStreakDate: {
      type: String,
      default: null,
    },
    primaryPath: {
      type: String,
      default: 'balanced',
    },
    age: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    weight: {
      type: String,
      default: '',
    },
    startingPhoto: {
      type: String,
      default: '',
    },
    startingNote: {
      type: String,
      default: '',
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash)
}

userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const User = mongoose.model('User', userSchema)
export default User
