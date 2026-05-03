import express from 'express';
import Announcement from '../models/Announcement.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// GET all announcements — anyone logged in can see
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query;

    // If category filter is passed — filter by it
    const filter = category ? { category } : {};

    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .populate('postedBy', 'name role') // show who posted
    
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single announcement by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('postedBy', 'name role');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create announcement — only admin or teacher
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Only admin or teacher can post
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized to post announcements' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'general',
      postedBy: req.user.id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE announcement — only admin
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete announcements' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;