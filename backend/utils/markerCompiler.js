const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Compile image to MindAR marker (.mind file)
 * @param {string} imagePath - Full path to the image file
 * @param {string} outputPath - Full path for output .mind file
 * @returns {Promise<boolean>}
 */
async function compileMarker(imagePath, outputPath) {
  return new Promise((resolve, reject) => {
    // Check if mind-ar compiler is installed
    exec('mind-ar --version', (error) => {
      if (error) {
        console.warn('MindAR compiler not installed. Skipping marker compilation.');
        console.warn('Install with: npm install -g @hiukim/mind-ar-js-compiler');
        resolve(false);
        return;
      }

      // Compile the marker
      const command = `mind-ar compile -i "${imagePath}" -o "${outputPath}"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Marker compilation failed:', error);
          console.error('stderr:', stderr);
          resolve(false);
          return;
        }

        console.log('Marker compiled successfully:', outputPath);
        console.log(stdout);
        resolve(true);
      });
    });
  });
}

/**
 * Generate a combined .mind file for all active targets
 * @param {Array} targets - Array of target objects with image paths
 * @returns {Promise<string|null>} - Path to combined .mind file or null
 */
async function generateCombinedMarkers(targets) {
  if (targets.length === 0) {
    return null;
  }

  const uploadsDir = path.join(__dirname, '../../uploads');
  const outputPath = path.join(uploadsDir, 'targets.mind');
  
  // For multiple images, we need to compile them separately then combine
  // For now, let's compile the first one as a test
  const firstTarget = targets[0];
  const imagePath = path.join(__dirname, '../..', firstTarget.image_path);
  
  const success = await compileMarker(imagePath, outputPath);
  
  return success ? '/uploads/targets.mind' : null;
}

module.exports = {
  compileMarker,
  generateCombinedMarkers
};

