-- AR Logo Video Database Schema
-- This file can be used for manual database setup

-- Create database
CREATE DATABASE IF NOT EXISTS ar_logo_video;
USE ar_logo_video;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ar_targets table (image-video pairs)
CREATE TABLE IF NOT EXISTS ar_targets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  video_path VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Note: The default admin user will be created automatically
-- when you first run the server
-- Default credentials: admin / admin123
-- Please change the password after first login!

