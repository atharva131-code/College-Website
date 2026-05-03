import express from 'express'
import News from '../models/News.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// GET all news
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}

    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name role')

    res.status(200).json(news)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// GET single news
router.get('/:id', protect, async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('postedBy', 'name role')

    if (!news) {
      return res.status(404).json({ message: 'News not found' })
    }

    res.status(200).json(news)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// POST create news — admin only
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to post news' })
    }

    const { title, content, category, imageUrl } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const news = await News.create({
      title,
      content,
      category: category || 'general',
      imageUrl: imageUrl || '',
      postedBy: req.user.id,
    })

    res.status(201).json(news)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE news — admin only
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete news' })
    }

    await News.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'News deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router