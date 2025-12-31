import React, { useState } from 'react'

function SoftSkillsForm({ data, updateData }) {
  const [newSkill, setNewSkill] = useState('')

  const handleAdd = () => {
    if (newSkill.trim()) {
      updateData([...data, newSkill.trim()])
      setNewSkill('')
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
      <h2>Soft Skills</h2>
      
      <div className="form-group">
        <label>Add Soft Skill</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Collaboration, Problem-solving"
            className="tag-input"
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>

      <div className="tag-input-container">
        {data.map((skill, index) => (
          <div key={index} className="tag">
            <span>{skill}</span>
            <span className="tag-remove" onClick={() => handleRemove(index)}>×</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SoftSkillsForm

