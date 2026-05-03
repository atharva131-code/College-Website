import express from 'express'
import Event from '../models/Event.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET all events
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .populate('postedBy', 'name role')

    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST create event — admin only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can add events' })
    }

    const { title, description, date, venue, category, imageUrl } = req.body

    if (!title || !description || !date || !venue) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      category: category || 'other',
      imageUrl: imageUrl || '',
      postedBy: req.user.id,
    })

    res.status(201).json(event)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE event — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete events' })
    }

    await Event.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Event deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router