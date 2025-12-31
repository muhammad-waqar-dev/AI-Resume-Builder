import React from 'react'

function WorkExperienceForm({ data, updateData }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: []
    }
    updateData([...data, newItem])
  }

  const handleUpdate = (id, field, value) => {
    updateData(data.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleDelete = (id) => {
    updateData(data.filter(item => item.id !== id))
  }

  const handleAchievementChange = (id, index, value) => {
    updateData(data.map(item => {
      if (item.id === id) {
        const newAchievements = [...item.achievements]
        newAchievements[index] = value
        return { ...item, achievements: newAchievements }
      }
      return item
    }))
  }

  const handleAddAchievement = (id) => {
    updateData(data.map(item => 
      item.id === id 
        ? { ...item, achievements: [...item.achievements, ''] }
        : item
    ))
  }

  const handleRemoveAchievement = (id, index) => {
    updateData(data.map(item => {
      if (item.id === id) {
        const newAchievements = item.achievements.filter((_, i) => i !== index)
        return { ...item, achievements: newAchievements }
      }
      return item
    }))
  }

  return (
    <div className="form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Work Experience</h2>
        <button className="btn btn-primary" onClick={handleAdd}>Add Experience</button>
      </div>

      <div className="item-list">
        {data.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-card-header">
              <div className="item-card-title">Experience #{data.indexOf(item) + 1}</div>
              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>

            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                value={item.company || ''}
                onChange={(e) => handleUpdate(item.id, 'company', e.target.value)}
                placeholder="Weekday"
              />
            </div>

            <div className="form-group">
              <label>Role/Position</label>
              <input
                type="text"
                value={item.role || ''}
                onChange={(e) => handleUpdate(item.id, 'role', e.target.value)}
                placeholder="SDE 1"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                  placeholder="Bengaluru"
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={item.startDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                  placeholder="Aug 2020"
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  value={item.endDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                  placeholder="Present"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                placeholder="Job description..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Key Achievements</label>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleAddAchievement(item.id)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  Add Achievement
                </button>
              </div>
              {item.achievements && item.achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <textarea
                    value={achievement}
                    onChange={(e) => handleAchievementChange(item.id, index, e.target.value)}
                    placeholder="Enter achievement..."
                    rows="2"
                  />
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleRemoveAchievement(item.id, index)}
                    style={{ padding: '0.4rem 0.8rem' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkExperienceForm

