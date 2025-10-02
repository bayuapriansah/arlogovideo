/**
 * Utility functions for device detection
 */

export const isMobileOrTablet = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile/tablet using userAgent
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  
  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Check screen size
  const isSmallScreen = window.innerWidth <= 1024;
  
  return isMobileUA || (hasTouch && isSmallScreen);
};

export const isARSupported = () => {
  // Check for WebXR support (modern AR)
  if ('xr' in navigator) {
    return true;
  }
  
  // Check for camera access (needed for AR)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return true;
  }
  
  return false;
};

export const getDeviceType = () => {
  if (isMobileOrTablet()) {
    return /iPad|Tablet/i.test(navigator.userAgent) ? 'tablet' : 'mobile';
  }
  return 'desktop';
};

export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    // Stop the stream immediately as we just wanted to check permission
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
};

