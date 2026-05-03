import express from 'express'
import Message from '../models/Message.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET last 50 messages for a room
router.get('/:room', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      room: req.params.room,
    })
      .sort({ createdAt: -1 })
      .limit(50)

    // Reverse so oldest message shows first
    res.status(200).json(messages.reverse())
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST save a message to database
router.post('/', protect, async (req, res) => {
  try {
    const { room, content } = req.body

    if (!room || !content) {
      return res.status(400).json({ message: 'Room and content are required' })
    }

    const message = await Message.create({
      room,
      content,
      sender: req.user.email,
      senderId: req.user.id,
      role: req.user.role,
    })

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE all messages in a room — admin only
router.delete('/:room', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can clear chat' })
    }

    await Message.deleteMany({ room: req.params.room })
    res.status(200).json({ message: 'Chat cleared successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router