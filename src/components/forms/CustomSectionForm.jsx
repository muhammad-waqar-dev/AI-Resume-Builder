import React from 'react'
import './CustomSectionForm.css'

function CustomSectionForm({ data = [], updateData, sectionLabel }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      subtitle: '',
      description: '',
      details: [],
      startDate: '',
      endDate: '',
      location: ''
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

  const handleDetailAdd = (itemId) => {
    updateData(data.map(item => 
      item.id === itemId 
        ? { ...item, details: [...(item.details || []), ''] }
        : item
    ))
  }

  const handleDetailUpdate = (itemId, detailIndex, value) => {
    updateData(data.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            details: item.details.map((detail, idx) => 
              idx === detailIndex ? value : detail
            )
          }
        : item
    ))
  }

  const handleDetailDelete = (itemId, detailIndex) => {
    updateData(data.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            details: item.details.filter((_, idx) => idx !== detailIndex)
          }
        : item
    ))
  }

  return (
    <div className="form-section custom-section-form">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>{sectionLabel || 'Custom Section'}</h2>
        <button className="btn btn-primary" onClick={handleAdd}>Add Entry</button>
      </div>

      <div className="item-list">
        {data.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-card-header">
              <div className="item-card-title">Entry #{data.indexOf(item) + 1}</div>
              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                placeholder="e.g., Award Name, Publication Title, etc."
              />
            </div>

            <div className="form-group">
              <label>Subtitle (Optional)</label>
              <input
                type="text"
                value={item.subtitle || ''}
                onChange={(e) => handleUpdate(item.id, 'subtitle', e.target.value)}
                placeholder="e.g., Organization, Publisher, etc."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Date (Optional)</label>
                <input
                  type="text"
                  value={item.startDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                  placeholder="e.g., Jan 2020"
                />
              </div>

              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="text"
                  value={item.endDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                  placeholder="e.g., Dec 2020 or Present"
                />
              </div>

              <div className="form-group">
                <label>Location (Optional)</label>
                <input
                  type="text"
                  value={item.location || ''}
                  onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                  placeholder="e.g., City, Country"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={item.description || ''}
                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                placeholder="Brief description or summary"
                rows="3"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Details/Bullet Points (Optional)</label>
                <button 
                  className="btn btn-sm" 
                  onClick={() => handleDetailAdd(item.id)}
                  type="button"
                >
                  + Add Detail
                </button>
              </div>
              {item.details && item.details.length > 0 && (
                <div className="details-list">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="detail-item">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => handleDetailUpdate(item.id, idx, e.target.value)}
                        placeholder="Enter detail or bullet point"
                      />
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDetailDelete(item.id, idx)}
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomSectionForm


