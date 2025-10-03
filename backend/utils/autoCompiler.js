const path = require('path');
const fs = require('fs').promises;
const { createCanvas, loadImage } = require('canvas');

/**
 * Automatically compile uploaded image to MindAR marker
 * This uses a simplified approach - for production, use the official MindAR compiler
 */

class MarkerCompiler {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.markersDir = path.join(this.uploadsDir, 'markers');
  }

  async ensureMarkersDir() {
    try {
      await fs.mkdir(this.markersDir, { recursive: true });
    } catch (error) {
      console.error('Error creating markers directory:', error);
    }
  }

  /**
   * Generate a .mind file for an image
   * @param {string} imagePath - Path to the uploaded image
   * @param {number} targetId - Database ID of the target
   * @returns {Promise<string>} - Path to generated .mind file
   */
  async compileImage(imagePath, targetId) {
    await this.ensureMarkersDir();

    const mindFilePath = path.join(this.markersDir, `target_${targetId}.mind`);
    
    try {
      // Read the image
      const fullImagePath = path.join(__dirname, '../..', imagePath);
      const imageBuffer = await fs.readFile(fullImagePath);
      
      // For now, create a placeholder .mind file
      // In production, this would use the MindAR compiler library
      const markerData = {
        targetId: targetId,
        imagePath: imagePath,
        timestamp: Date.now(),
        // This is a placeholder - real implementation would generate feature points
        features: []
      };

      await fs.writeFile(mindFilePath, JSON.stringify(markerData));
      
      console.log(`Marker compiled for target ${targetId}`);
      return `/uploads/markers/target_${targetId}.mind`;
      
    } catch (error) {
      console.error('Error compiling marker:', error);
      throw error;
    }
  }

  /**
   * Generate combined .mind file for all targets
   * @param {Array} targets - Array of target objects
   * @returns {Promise<string>} - Path to combined .mind file
   */
  async compileAllTargets(targets) {
    await this.ensureMarkersDir();

    const combinedPath = path.join(this.markersDir, 'targets.mind');
    
    try {
      const allMarkers = await Promise.all(
        targets.map(async (target, index) => {
          return {
            index: index,
            targetId: target.id,
            imagePath: target.image_path,
            name: target.name
          };
        })
      );

      const combinedData = {
        version: 1,
        targets: allMarkers,
        timestamp: Date.now()
      };

      await fs.writeFile(combinedPath, JSON.stringify(combinedData));
      
      console.log(`Combined marker file created with ${targets.length} targets`);
      return '/uploads/markers/targets.mind';
      
    } catch (error) {
      console.error('Error creating combined marker file:', error);
      throw error;
    }
  }

  /**
   * Delete marker file for a target
   * @param {number} targetId - Database ID of the target
   */
  async deleteMarker(targetId) {
    try {
      const mindFilePath = path.join(this.markersDir, `target_${targetId}.mind`);
      await fs.unlink(mindFilePath);
      console.log(`Marker deleted for target ${targetId}`);
    } catch (error) {
      // File might not exist, that's okay
      console.log(`No marker file found for target ${targetId}`);
    }
  }
}

module.exports = new MarkerCompiler();

