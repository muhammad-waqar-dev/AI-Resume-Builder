import React, { useRef } from 'react'

function PersonalInfoForm({ data, updateData }) {
  const fileInputRef = useRef(null)

  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        handleChange('profileImage', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    handleChange('profileImage', '')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="form-section">
      <h2>Personal Information</h2>
      
      <div className="form-group">
        <label>Profile Image</label>
        <div className="image-upload-container">
          {data.profileImage ? (
            <div className="image-preview-wrapper">
              <div className="image-preview">
                <img src={data.profileImage} alt="Profile preview" />
              </div>
              <div className="image-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="image-upload-placeholder">
              <div className="upload-icon">📷</div>
              <p>No profile image uploaded</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Image
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
        <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
          Recommended: Square image, max 5MB (JPG, PNG, etc.)
        </small>
      </div>
      
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="form-group">
        <label>Professional Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Software Developer"
        />
      </div>

      <div className="form-group">
        <label>Professional Summary</label>
        <textarea
          value={data.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Write a brief summary about yourself..."
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+91-9999999999"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john.doe@gmail.com"
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="Karachi, Sindh, Pakistan"
        />
      </div>

      <div className="form-group">
        <label>GitHub URL</label>
        <input
          type="url"
          value={data.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          placeholder="https://github.com/john-doe"
        />
      </div>

      <div className="form-group">
        <label>LinkedIn URL</label>
        <input
          type="url"
          value={data.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/john-doe"
        />
      </div>

      <div className="form-group">
        <label>Portfolio URL</label>
        <input
          type="url"
          value={data.portfolio || ''}
          onChange={(e) => handleChange('portfolio', e.target.value)}
          placeholder="https://johndoe.com"
        />
      </div>
    </div>
  )
}

export default PersonalInfoForm

