import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'student',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Message', messageSchema)