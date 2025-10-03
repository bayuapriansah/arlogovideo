const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const { pool, initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');
const targetsRoutes = require('./routes/targets');
const arRoutes = require('./routes/ar');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/targets', targetsRoutes);
app.use('/api/ar', arRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and create default admin
async function setupServer() {
  try {
    // Initialize database tables
    await initializeDatabase();

    // Create default admin if not exists
    const defaultUsername = process.env.ADMIN_DEFAULT_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';

    const [existingAdmins] = await pool.query('SELECT * FROM admins WHERE username = ?', [defaultUsername]);

    if (existingAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await pool.query('INSERT INTO admins (username, password) VALUES (?, ?)', [defaultUsername, hashedPassword]);
      console.log(`✓ Default admin created: ${defaultUsername}`);
      console.log(`  Password: ${defaultPassword}`);
      console.log('  ⚠️  Please change the default password after first login!');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`   API: http://localhost:${PORT}/api`);
      console.log(`   Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to setup server:', error);
    process.exit(1);
  }
}

setupServer();

module.exports = app;

