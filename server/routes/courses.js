import express from 'express'
import Course from '../models/Course.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET all courses — filter by department
router.get('/', protect, async (req, res) => {
  try {
    const { department } = req.query
    const filter = department ? { department } : {}

    const courses = await Course.find(filter).sort({ name: 1 })
    res.status(200).json(courses)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// GET single course
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.status(200).json(course)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST create course — admin only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can add courses' })
    }

    const {
      name,
      code,
      department,
      duration,
      totalSeats,
      description,
      fees,
    } = req.body

    if (!name || !code || !department || !duration || !totalSeats) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingCourse = await Course.findOne({ code })
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' })
    }

    const course = await Course.create({
      name,
      code,
      department,
      duration,
      totalSeats,
      description: description || '',
      fees: {
        tuition: fees?.tuition || 0,
        hostel: fees?.hostel || 0,
        exam: fees?.exam || 0,
      },
    })

    res.status(201).json(course)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE course — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete courses' })
    }

    await Course.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Course deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router