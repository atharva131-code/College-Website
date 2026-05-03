import express from 'express'
import Syllabus from '../models/Syllabus.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET all syllabus — filter by course or department
router.get('/', protect, async (req, res) => {
  try {
    const { course, department } = req.query
    const filter = {}
    if (course) filter.course = course
    if (department) filter.department = department

    const syllabus = await Syllabus.find(filter).sort({ semester: 1 })
    res.status(200).json(syllabus)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST add syllabus — admin only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can add syllabus' })
    }

    const { course, department, semester, subjects } = req.body

    const syllabus = await Syllabus.create({
      course,
      department,
      semester,
      subjects,
    })

    res.status(201).json(syllabus)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE syllabus — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete syllabus' })
    }

    await Syllabus.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Syllabus deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router