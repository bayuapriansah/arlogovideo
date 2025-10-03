import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import './ARView.css';

function ARView() {
  const [targets, setTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [arStarted, setArStarted] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [detectedTarget, setDetectedTarget] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState([
    { id: 1, text: 'Connecting to server...', status: 'pending' },
    { id: 2, text: 'Loading AR targets...', status: 'pending' },
    { id: 3, text: 'Checking browser compatibility...', status: 'pending' },
    { id: 4, text: 'Ready!', status: 'pending' }
  ]);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const overlayVideoRef = useRef(null);

  useEffect(() => {
    console.log('ARView mounted, fetching targets...');
    let isMounted = true;
    
    const loadTargets = async () => {
      await fetchTargets();
    };
    
    if (isMounted) {
      loadTargets();
    }
    
    return () => {
      isMounted = false;
      stopAR();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('State changed:', { isLoading, targetsCount: targets.length, error });
  }, [isLoading, targets.length, error]);

  const updateLoadingStep = (stepId, status, errorMsg = null) => {
    setLoadingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, error: errorMsg } : step
    ));
  };

  const fetchTargets = async () => {
    try {
      // Step 1: Connecting to server
      updateLoadingStep(1, 'loading');
      console.log('Fetching targets from:', `${config.API_URL}/targets`);
      
      const response = await axios.get(`${config.API_URL}/targets`);
      updateLoadingStep(1, 'success');
      
      // Step 2: Loading AR targets
      updateLoadingStep(2, 'loading');
      console.log('Targets loaded:', response.data);
      setTargets(response.data);
      
      if (response.data.length === 0) {
        updateLoadingStep(2, 'warning');
        setError('No AR targets found. Please contact admin to add AR content.');
        setIsLoading(false);
        return;
      } else {
        updateLoadingStep(2, 'success');
      }
      
      // Step 3: Checking browser compatibility
      updateLoadingStep(3, 'loading');
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for visual feedback
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updateLoadingStep(3, 'error');
        setError('Camera is not supported on this browser. Please use Chrome or Safari.');
        setIsLoading(false);
        return;
      }
      updateLoadingStep(3, 'success');
      
      // Step 4: Ready
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for visual feedback
      updateLoadingStep(4, 'success');
      
      // Give user a moment to see all checks passed, then transition
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('Loading complete, transitioning to AR view...');
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching targets:', error);
      
      if (error.response) {
        updateLoadingStep(1, 'error');
        setError(`Server error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        updateLoadingStep(1, 'error');
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        updateLoadingStep(2, 'error');
        setError('Failed to load AR targets: ' + error.message);
      }
      
      setIsLoading(false);
    }
  };

  const startAR = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera is not supported on this browser. Please use a modern browser like Chrome or Safari.');
        setIsLoading(false);
        return;
      }

      // Get camera stream directly
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraPermission(true);
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(() => {
            if (canvasRef.current) {
              const canvas = canvasRef.current;
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
            }
            setArStarted(true);
            setIsLoading(false);
            setShowInstructions(false);
            startImageDetection();
          }).catch(err => {
            console.error('Error playing video:', err);
            setError('Failed to start video. Please try again.');
            setIsLoading(false);
          });
        };
      }

    } catch (error) {
      console.error('Error starting AR:', error);
      let errorMessage = 'Failed to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not support the required settings.';
      } else {
        errorMessage += error.message || 'Please ensure camera permissions are granted.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const startImageDetection = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    const detectFrame = () => {
      if (!arStarted || !video || video.paused || video.ended) {
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simple image detection simulation
      // In production, you would use a proper AR library like AR.js or Mind AR
      // For this example, we'll simulate detection when user taps
      
      animationRef.current = requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  const handleTargetDetection = (target) => {
    setDetectedTarget(target);
    if (overlayVideoRef.current) {
      overlayVideoRef.current.src = `${config.BASE_URL}${target.video_path}`;
      overlayVideoRef.current.play();
    }
  };

  const stopAR = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setArStarted(false);
    setDetectedTarget(null);
  };

  console.log('Rendering ARView, isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="ar-view">
        <div className="ar-loading">
          <h2>🚀 Initializing AR Experience</h2>
          <div className="loading-steps">
            {loadingSteps.map(step => (
              <div key={step.id} className={`loading-step ${step.status}`}>
                <div className="step-icon">
                  {step.status === 'pending' && '⏳'}
                  {step.status === 'loading' && <div className="spinner-small"></div>}
                  {step.status === 'success' && '✅'}
                  {step.status === 'error' && '❌'}
                  {step.status === 'warning' && '⚠️'}
                </div>
                <div className="step-text">
                  <span>{step.text}</span>
                  {step.error && <small className="step-error">{step.error}</small>}
                </div>
              </div>
            ))}
          </div>
          {error && loadingSteps.some(step => step.status === 'error') && (
            <div className="loading-error">
              <p>{error}</p>
              <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  console.log('Loading complete, showing AR view with', targets.length, 'targets');

  return (
    <div className="ar-view">
      {/* AR Camera View */}
      {!arStarted ? (
        <div className="ar-welcome">
          <div className="ar-welcome-content">
            <h1>🎯 AR Scanner Ready</h1>
            <p>Point your camera at an AR-enabled image to see it come to life!</p>
            
            {targets.length > 0 && (
              <div className="available-targets">
                <h3>Available AR Targets:</h3>
                <div className="targets-list">
                  {targets.map(target => (
                    <div key={target.id} className="target-item">
                      <img 
                        src={`${config.BASE_URL}${target.image_path}`} 
                        alt={target.name}
                        className="target-preview"
                      />
                      <p>{target.name}</p>
                    </div>
                  ))}
                </div>
                <p className="print-instruction">💡 Print these images to scan them with AR</p>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="ar-actions">
              <button className="btn btn-primary btn-large" onClick={startAR}>
                Start AR Camera
              </button>
              <a href="/" className="btn btn-secondary">Back to Home</a>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Camera Feed */}
          <video ref={videoRef} className="ar-camera" playsInline autoPlay muted></video>
          <canvas ref={canvasRef} className="ar-canvas" style={{ display: 'none' }}></canvas>

          {/* AR Overlay */}
          <div className="ar-overlay">
            {showInstructions && (
              <div className="ar-instructions">
                <p>Point camera at printed AR image</p>
              </div>
            )}

            {/* Target Selection Buttons */}
            <div className="ar-targets-selector">
              <p className="selector-title">Tap when you see the image:</p>
              <div className="targets-buttons">
                {targets.map(target => (
                  <button
                    key={target.id}
                    className={`target-btn ${detectedTarget?.id === target.id ? 'active' : ''}`}
                    onClick={() => handleTargetDetection(target)}
                  >
                    <img 
                      src={`${config.BASE_URL}${target.image_path}`} 
                      alt={target.name}
                    />
                    <span>{target.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Overlay */}
            {detectedTarget && (
              <div className="video-overlay">
                <video
                  ref={overlayVideoRef}
                  className="overlay-video"
                  controls
                  playsInline
                  loop
                >
                  Your browser does not support video playback.
                </video>
                <button 
                  className="close-video-btn"
                  onClick={() => setDetectedTarget(null)}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Controls */}
            <div className="ar-controls">
              <button className="control-btn" onClick={stopAR}>
                Stop AR
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ARView;

