import express from 'express'
import Course from '../models/Course.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET fee structure for all courses
router.get('/', protect, async (req, res) => {
  try {
    const { department } = req.query
    const filter = department ? { department } : {}

    const courses = await Course.find(filter)
      .select('name code department duration fees')
      .sort({ department: 1 })

    res.status(200).json(courses)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router