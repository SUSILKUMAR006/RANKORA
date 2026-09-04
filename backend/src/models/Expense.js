import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
      index: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Other',
      index: true,
    },
    date: {
      type: String,
      required: true,
      default: () => new Date().toISOString().slice(0, 10),
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'Card / Digital',
    },
    notes: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const Expense = mongoose.model('Expense', expenseSchema)
export default Expense
