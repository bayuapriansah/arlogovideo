import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import './AdminDashboard.css';

function AdminDashboard() {
  const [targets, setTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    video: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/targets`);
      setTargets(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching targets:', error);
      setError('Failed to load targets');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Preview image
      if (name === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);

    const token = localStorage.getItem('adminToken');
    const formDataToSend = new FormData();
    
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    if (formData.video) {
      formDataToSend.append('video', formData.video);
    }

    try {
      if (editingTarget) {
        // Update existing target
        await axios.put(
          `${config.API_URL}/targets/${editingTarget.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        );
        setSuccess('Target updated successfully!');
      } else {
        // Create new target
        if (!formData.image || !formData.video) {
          setError('Both image and video are required');
          return;
        }

        await axios.post(
          `${config.API_URL}/targets`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        );
        setSuccess('Target created successfully!');
      }

      // Reset form and refresh
      setFormData({ name: '', description: '', image: null, video: null });
      setImagePreview(null);
      setShowUploadModal(false);
      setEditingTarget(null);
      setUploadProgress(0);
      fetchTargets();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save target');
      setUploadProgress(0);
    }
  };

  const handleEdit = (target) => {
    setEditingTarget(target);
    setFormData({
      name: target.name,
      description: target.description || '',
      image: null,
      video: null
    });
    setImagePreview(`${config.BASE_URL}${target.image_path}`);
    setShowUploadModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this target?')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`${config.API_URL}/targets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Target deleted successfully!');
      fetchTargets();
    } catch (error) {
      setError('Failed to delete target');
    }
  };

  const openUploadModal = () => {
    setEditingTarget(null);
    setFormData({ name: '', description: '', image: null, video: null });
    setImagePreview(null);
    setShowUploadModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setEditingTarget(null);
    setFormData({ name: '', description: '', image: null, video: null });
    setImagePreview(null);
    setError('');
    setUploadProgress(0);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📊 Admin Dashboard</h1>
          <div className="header-actions">
            <span className="username">👤 {localStorage.getItem('adminUsername')}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Success/Error Messages */}
          {success && <div className="alert alert-success">{success}</div>}
          {error && !showUploadModal && <div className="alert alert-error">{error}</div>}

          {/* Actions Bar */}
          <div className="actions-bar">
            <h2>AR Targets ({targets.length})</h2>
            <button className="btn btn-primary" onClick={openUploadModal}>
              ➕ Add New Target
            </button>
          </div>

          {/* Targets List */}
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading targets...</p>
            </div>
          ) : targets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No AR Targets Yet</h3>
              <p>Create your first AR target to get started!</p>
              <button className="btn btn-primary" onClick={openUploadModal}>
                Create First Target
              </button>
            </div>
          ) : (
            <div className="targets-grid">
              {targets.map(target => (
                <div key={target.id} className="target-card">
                  <div className="target-image">
                    <img 
                      src={`${config.BASE_URL}${target.image_path}`} 
                      alt={target.name}
                    />
                  </div>
                  <div className="target-info">
                    <h3>{target.name}</h3>
                    {target.description && <p>{target.description}</p>}
                    <div className="target-meta">
                      <span className="badge">🎯 AR Target</span>
                      <span className="badge">🎥 Video</span>
                    </div>
                  </div>
                  <div className="target-actions">
                    <button 
                      className="btn btn-secondary btn-small" 
                      onClick={() => handleEdit(target)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-small" 
                      onClick={() => handleDelete(target.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="target-preview-actions">
                    <a 
                      href={`${config.BASE_URL}${target.image_path}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="preview-link"
                    >
                      🖼️ View Image
                    </a>
                    <a 
                      href={`${config.BASE_URL}${target.video_path}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="preview-link"
                    >
                      🎬 View Video
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload/Edit Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTarget ? '✏️ Edit Target' : '➕ Add New Target'}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="name">Target Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Company Logo"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Optional description..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="image">
                    AR Image {!editingTarget && '*'}
                    <span className="file-hint">(.jpg, .png)</span>
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    required={!editingTarget}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="video">
                    Video {!editingTarget && '*'}
                    <span className="file-hint">(.mp4, .webm)</span>
                  </label>
                  <input
                    type="file"
                    id="video"
                    name="video"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileChange}
                    required={!editingTarget}
                  />
                  {formData.video && (
                    <p className="file-selected">✓ {formData.video.name}</p>
                  )}
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p>{uploadProgress}% uploaded</p>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTarget ? 'Update Target' : 'Create Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

