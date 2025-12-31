import React, { useState } from 'react'

function CertificationsForm({ data, updateData }) {
  const [newCert, setNewCert] = useState('')

  const handleAdd = () => {
    if (newCert.trim()) {
      updateData([...data, newCert.trim()])
      setNewCert('')
    }
  }

  const handleRemove = (index) => {
    updateData(data.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="form-section">
      <h2>Certifications</h2>
      
      <div className="form-group">
        <label>Add Certification</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Certified Web Professional-Web Developer"
            className="tag-input"
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>

      <div className="tag-input-container">
        {data.map((cert, index) => (
          <div key={index} className="tag">
            <span>{cert}</span>
            <span className="tag-remove" onClick={() => handleRemove(index)}>×</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CertificationsForm

