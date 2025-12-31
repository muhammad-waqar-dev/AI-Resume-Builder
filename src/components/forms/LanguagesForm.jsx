import React, { useState } from 'react'

function LanguagesForm({ data, updateData }) {
  const [newLanguage, setNewLanguage] = useState('')

  const handleAdd = () => {
    if (newLanguage.trim()) {
      updateData([...data, newLanguage.trim()])
      setNewLanguage('')
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
      <h2>Languages</h2>
      
      <div className="form-group">
        <label>Add Language</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., English, Urdu"
            className="tag-input"
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>

      <div className="tag-input-container">
        {data.map((language, index) => (
          <div key={index} className="tag">
            <span>{language}</span>
            <span className="tag-remove" onClick={() => handleRemove(index)}>×</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LanguagesForm

