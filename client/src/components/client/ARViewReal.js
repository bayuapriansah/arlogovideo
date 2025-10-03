import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import './ARView.css';

function ARViewReal() {
  const [targets, setTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [arReady, setArReady] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/targets`);
      setTargets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading targets:', error);
      setError('Failed to load AR targets');
      setIsLoading(false);
    }
  };

  const startAR = () => {
    if (targets.length === 0) {
      setError('No AR targets available');
      return;
    }

    // Create A-Frame scene dynamically
    const sceneHTML = `
      <a-scene
        mindar-image="imageTargetSrc: ${config.BASE_URL}/api/mind-targets; autoStart: true; uiScanning: no; uiLoading: no;"
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
        embedded
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;"
      >
        <a-assets>
          ${targets.map((target, index) => `
            <video
              id="video-${target.id}"
              src="${config.BASE_URL}${target.video_path}"
              preload="auto"
              loop="true"
              crossorigin="anonymous"
              playsinline
              webkit-playsinline
            ></video>
          `).join('')}
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: false" cursor="fuse: false; rayOrigin: mouse;" raycaster="far: 10000; objects: .clickable"></a-camera>

        ${targets.map((target, index) => `
          <a-entity mindar-image-target="targetIndex: ${index}">
            <a-video
              src="#video-${target.id}"
              position="0 0 0.1"
              rotation="0 0 0"
              width="1"
              height="0.552"
              opacity="0.99"
              play-on-detected
            ></a-video>
            <a-text
              value="${target.name}"
              position="0 -0.6 0"
              align="center"
              color="#FFF"
              width="2"
            ></a-text>
          </a-entity>
        `).join('')}
      </a-scene>
    `;

    if (containerRef.current) {
      containerRef.current.innerHTML = sceneHTML;
      
      // Register custom component for auto-play on detection
      if (window.AFRAME) {
        window.AFRAME.registerComponent('play-on-detected', {
          init: function() {
            const video = this.el.getAttribute('material').src;
            
            this.el.sceneEl.addEventListener('targetFound', (event) => {
              console.log('Target found!', event.detail.targetIndex);
              if (video && video.play) {
                video.play().catch(e => console.log('Video play error:', e));
              }
            });

            this.el.sceneEl.addEventListener('targetLost', (event) => {
              console.log('Target lost!', event.detail.targetIndex);
              if (video && video.pause) {
                video.pause();
              }
            });
          }
        });
      }
      
      setArReady(true);
    }
  };

  if (isLoading) {
    return (
      <div className="ar-view">
        <div className="ar-loading">
          <div className="spinner"></div>
          <p>Loading AR Experience...</p>
        </div>
      </div>
    );
  }

  if (!arReady) {
    return (
      <div className="ar-view">
        <div className="ar-welcome">
          <div className="ar-welcome-content">
            <h1>🎯 Real AR Experience</h1>
            <p>Point your camera at printed markers to see 3D videos!</p>

            {targets.length > 0 && (
              <div className="available-targets">
                <h3>Print These Images:</h3>
                <div className="targets-list">
                  {targets.map(target => (
                    <div key={target.id} className="target-item">
                      <img
                        src={`${config.BASE_URL}${target.image_path}`}
                        alt={target.name}
                        className="target-preview"
                      />
                      <p>{target.name}</p>
                      <a
                        href={`${config.BASE_URL}${target.image_path}`}
                        download
                        className="btn btn-secondary btn-small"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
                <p className="print-instruction">
                  💡 Print these images and point your camera at them!
                </p>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <div className="ar-actions">
              <button className="btn btn-primary btn-large" onClick={startAR}>
                Start Real AR
              </button>
              <a href="/" className="btn btn-secondary">
                Back to Home
              </a>
            </div>

            <div className="ar-info">
              <h3>How it works:</h3>
              <ul>
                <li>✅ Automatically detects printed images</li>
                <li>✅ Videos appear in 3D space on the marker</li>
                <li>✅ Tracks as you move the paper</li>
                <li>✅ Real Augmented Reality!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-view">
      <div ref={containerRef} style={{ width: '100%', height: '100vh' }}></div>
      
      <div className="ar-controls-overlay">
        <button
          className="control-btn"
          onClick={() => {
            setArReady(false);
            if (containerRef.current) {
              containerRef.current.innerHTML = '';
            }
          }}
        >
          Stop AR
        </button>
      </div>

      <div className="ar-instructions-overlay">
        <p>Point camera at printed image to see AR video</p>
      </div>
    </div>
  );
}

export default ARViewReal;

