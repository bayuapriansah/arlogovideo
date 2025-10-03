import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobileOrTablet } from '../../utils/deviceDetection';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [showDeviceWarning, setShowDeviceWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleStartAR = () => {
    if (!isMobileOrTablet()) {
      setShowDeviceWarning(true);
    } else {
      navigate('/ar');
    }
  };

  if (isLoading) {
    return (
      <div className="landing-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">AR Logo Video</span>
          </h1>
          <p className="hero-subtitle">
            Experience Augmented Reality Like Never Before
          </p>
          <p className="hero-description">
            Scan printed images with your mobile device to unlock interactive video content
          </p>
          <button className="btn btn-hero" onClick={handleStartAR}>
            <span className="btn-icon">📱</span>
            Start AR Experience
          </button>
        </div>
      </section>

      {/* Info Banner */}
      <section className="info-section">
        <div className="container">
          <div className="info-banner">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <h3>How It Works</h3>
              <p>Simply point your mobile camera at any AR-enabled printed image to see it come to life with video content!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Image Recognition</h3>
              <p>Advanced AR technology to detect and track printed images instantly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎥</div>
              <h3>Video Playback</h3>
              <p>Watch high-quality videos overlay on detected images in real-time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Optimized</h3>
              <p>Designed for the best experience on mobile and tablet devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖨️</div>
              <h3>Printable Images</h3>
              <p>Works with any standard printer - just print and scan!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="instructions-section">
        <div className="container">
          <h2 className="section-title">Getting Started</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Get the Image</h3>
              <p>Print out an AR-enabled image on regular paper</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Open on Mobile</h3>
              <p>Access this website on your smartphone or tablet</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Start AR</h3>
              <p>Tap "Start AR Experience" and allow camera access</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Scan & Watch</h3>
              <p>Point your camera at the image and enjoy the video!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2025 AR Logo Video. All rights reserved.</p>
          <a href="/admin/login" className="admin-link">Admin Login</a>
        </div>
      </footer>

      {/* Device Warning Modal */}
      {showDeviceWarning && (
        <div className="modal-overlay" onClick={() => setShowDeviceWarning(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📱 Mobile Device Required</h2>
            </div>
            <div className="modal-body">
              <p>AR experience is optimized for mobile and tablet devices.</p>
              <p>Please open this website on your smartphone or tablet to enjoy the full AR experience.</p>
              <div className="device-support-info">
                <p><strong>Supported Devices:</strong></p>
                <ul>
                  <li>✓ iOS (iPhone, iPad)</li>
                  <li>✓ Android Phones & Tablets</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowDeviceWarning(false)}>
                Got It
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/ar')}>
                Try Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;

