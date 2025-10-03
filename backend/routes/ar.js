const express = require('express');
const { pool } = require('../config/db');
const { generateCombinedMarkers } = require('../utils/markerCompiler');
const router = express.Router();

// Get compiled MindAR markers for all active targets
router.get('/mind-targets', async (req, res) => {
  try {
    // Get all active targets
    const [targets] = await pool.query(
      'SELECT * FROM ar_targets WHERE is_active = true ORDER BY created_at ASC'
    );

    if (targets.length === 0) {
      return res.status(404).json({ error: 'No AR targets found' });
    }

    // Generate combined .mind file
    const mindFilePath = await generateCombinedMarkers(targets);
    
    if (!mindFilePath) {
      return res.status(500).json({ 
        error: 'Marker compilation failed. Please ensure MindAR compiler is installed.' 
      });
    }

    // Serve the .mind file
    const fullPath = mindFilePath.replace('/uploads/', '');
    res.sendFile(fullPath, { root: './uploads' });

  } catch (error) {
    console.error('Error generating mind targets:', error);
    res.status(500).json({ error: 'Failed to generate AR markers' });
  }
});

// Get target info for AR session
router.get('/targets-info', async (req, res) => {
  try {
    const [targets] = await pool.query(
      'SELECT id, name, video_path FROM ar_targets WHERE is_active = true ORDER BY created_at ASC'
    );
    
    res.json(targets);
  } catch (error) {
    console.error('Error fetching targets info:', error);
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
});

module.exports = router;

