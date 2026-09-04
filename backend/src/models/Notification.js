import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: 'system',
    },
    eventKey: {
      type: String,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ['emerald', 'rose', 'amber', 'cyan', 'violet'],
      default: 'cyan',
    },
    iconName: {
      type: String,
      default: 'Bell',
    },
    link: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const Notification = mongoose.model('Notification', notificationSchema)
export default Notification
