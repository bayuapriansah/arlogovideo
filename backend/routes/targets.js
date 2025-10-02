const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png/;
    const allowedVideoTypes = /mp4|webm|mov/;
    const extname = path.extname(file.originalname).toLowerCase();
    
    if (file.fieldname === 'image') {
      if (allowedImageTypes.test(extname.slice(1))) {
        cb(null, true);
      } else {
        cb(new Error('Only .png, .jpg and .jpeg images are allowed'));
      }
    } else if (file.fieldname === 'video') {
      if (allowedVideoTypes.test(extname.slice(1))) {
        cb(null, true);
      } else {
        cb(new Error('Only .mp4, .webm and .mov videos are allowed'));
      }
    } else {
      cb(new Error('Invalid field name'));
    }
  }
});

// Get all AR targets (public)
router.get('/', async (req, res) => {
  try {
    const [targets] = await pool.query(
      'SELECT * FROM ar_targets WHERE is_active = true ORDER BY created_at DESC'
    );
    res.json(targets);
  } catch (error) {
    console.error('Error fetching targets:', error);
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
});

// Get single target (public)
router.get('/:id', async (req, res) => {
  try {
    const [targets] = await pool.query(
      'SELECT * FROM ar_targets WHERE id = ? AND is_active = true',
      [req.params.id]
    );
    
    if (targets.length === 0) {
      return res.status(404).json({ error: 'Target not found' });
    }
    
    res.json(targets[0]);
  } catch (error) {
    console.error('Error fetching target:', error);
    res.status(500).json({ error: 'Failed to fetch target' });
  }
});

// Create new AR target (admin only)
router.post('/', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.files || !req.files.image || !req.files.video) {
      return res.status(400).json({ error: 'Both image and video are required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const imagePath = `/uploads/${req.files.image[0].filename}`;
    const videoPath = `/uploads/${req.files.video[0].filename}`;

    const [result] = await pool.query(
      'INSERT INTO ar_targets (name, image_path, video_path, description) VALUES (?, ?, ?, ?)',
      [name, imagePath, videoPath, description || '']
    );

    res.status(201).json({
      id: result.insertId,
      name,
      image_path: imagePath,
      video_path: videoPath,
      description
    });
  } catch (error) {
    console.error('Error creating target:', error);
    res.status(500).json({ error: 'Failed to create target' });
  }
});

// Update AR target (admin only)
router.put('/:id', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description, is_active } = req.body;
    const targetId = req.params.id;

    // Get existing target
    const [existing] = await pool.query('SELECT * FROM ar_targets WHERE id = ?', [targetId]);
    
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Target not found' });
    }

    const target = existing[0];
    let imagePath = target.image_path;
    let videoPath = target.video_path;

    // Update image if provided
    if (req.files && req.files.image) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '../..', target.image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      imagePath = `/uploads/${req.files.image[0].filename}`;
    }

    // Update video if provided
    if (req.files && req.files.video) {
      // Delete old video
      const oldVideoPath = path.join(__dirname, '../..', target.video_path);
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }
      videoPath = `/uploads/${req.files.video[0].filename}`;
    }

    await pool.query(
      'UPDATE ar_targets SET name = ?, image_path = ?, video_path = ?, description = ?, is_active = ? WHERE id = ?',
      [name || target.name, imagePath, videoPath, description || target.description, is_active !== undefined ? is_active : target.is_active, targetId]
    );

    res.json({ message: 'Target updated successfully' });
  } catch (error) {
    console.error('Error updating target:', error);
    res.status(500).json({ error: 'Failed to update target' });
  }
});

// Delete AR target (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [targets] = await pool.query('SELECT * FROM ar_targets WHERE id = ?', [req.params.id]);
    
    if (targets.length === 0) {
      return res.status(404).json({ error: 'Target not found' });
    }

    const target = targets[0];

    // Delete files
    const imagePath = path.join(__dirname, '../..', target.image_path);
    const videoPath = path.join(__dirname, '../..', target.video_path);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Delete from database
    await pool.query('DELETE FROM ar_targets WHERE id = ?', [req.params.id]);

    res.json({ message: 'Target deleted successfully' });
  } catch (error) {
    console.error('Error deleting target:', error);
    res.status(500).json({ error: 'Failed to delete target' });
  }
});

module.exports = router;

