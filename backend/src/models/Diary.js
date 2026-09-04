import mongoose from 'mongoose'

const diarySchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
    },
    energy: {
      type: String,
      default: 'Focused',
    },
    tags: {
      type: [String],
      default: ['Discipline'],
    },
    obstacle: {
      type: String,
      default: '',
    },
    keyWin: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export const Diary = mongoose.model('Diary', diarySchema)
export default Diary
