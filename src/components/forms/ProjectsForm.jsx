import React from 'react'

function ProjectsForm({ data, updateData }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      year: '',
      description: '',
      details: []
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

  const handleDetailChange = (id, index, value) => {
    updateData(data.map(item => {
      if (item.id === id) {
        const newDetails = [...item.details]
        newDetails[index] = value
        return { ...item, details: newDetails }
      }
      return item
    }))
  }

  const handleAddDetail = (id) => {
    updateData(data.map(item => 
      item.id === id 
        ? { ...item, details: [...item.details, ''] }
        : item
    ))
  }

  const handleRemoveDetail = (id, index) => {
    updateData(data.map(item => {
      if (item.id === id) {
        const newDetails = item.details.filter((_, i) => i !== index)
        return { ...item, details: newDetails }
      }
      return item
    }))
  }

  return (
    <div className="form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={handleAdd}>Add Project</button>
      </div>

      <div className="item-list">
        {data.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-card-header">
              <div className="item-card-title">Project #{data.indexOf(item) + 1}</div>
              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={item.name || ''}
                  onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                  placeholder="Robotics"
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={item.year || ''}
                  onChange={(e) => handleUpdate(item.id, 'year', e.target.value)}
                  placeholder="2019"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                placeholder="Project description..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Project Details</label>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => handleAddDetail(item.id)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  Add Detail
                </button>
              </div>
              {item.details && item.details.map((detail, index) => (
                <div key={index} className="detail-item">
                  <textarea
                    value={detail}
                    onChange={(e) => handleDetailChange(item.id, index, e.target.value)}
                    placeholder="Enter project detail..."
                    rows="2"
                  />
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleRemoveDetail(item.id, index)}
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

export default ProjectsForm

