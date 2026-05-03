import express from 'express'
import Result from '../models/Result.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET results by roll number
router.get('/:rollNumber', protect, async (req, res) => {
  try {
    const results = await Result.find({
      rollNumber: req.params.rollNumber
    }).sort({ semester: 1 })

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No results found for this roll number' })
    }

    res.status(200).json(results)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST add result — admin only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can add results' })
    }

    const {
      studentName,
      rollNumber,
      department,
      semester,
      subjects,
    } = req.body

    // Calculate totals automatically
    const obtainedMarks = subjects.reduce((sum, s) => sum + s.marks, 0)
    const totalMarks = subjects.reduce((sum, s) => sum + s.totalMarks, 0)
    const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2)

    // Auto assign grades
    const subjectsWithGrades = subjects.map((s) => {
      const percent = (s.marks / s.totalMarks) * 100
      let grade = 'F'
      if (percent >= 90) grade = 'A+'
      else if (percent >= 80) grade = 'A'
      else if (percent >= 70) grade = 'B+'
      else if (percent >= 60) grade = 'B'
      else if (percent >= 50) grade = 'C'
      else if (percent >= 40) grade = 'D'
      return { ...s, grade }
    })

    // Check if any subject failed
    const hasFailed = subjectsWithGrades.some((s) => s.grade === 'F')

    const result = await Result.create({
      studentName,
      rollNumber,
      department,
      semester,
      subjects: subjectsWithGrades,
      obtainedMarks,
      totalMarks,
      percentage,
      result: hasFailed ? 'Fail' : 'Pass',
    })

    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router