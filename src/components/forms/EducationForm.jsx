import React from 'react'

function EducationForm({ data, updateData }) {
  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: ''
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

  return (
    <div className="form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Education</h2>
        <button className="btn btn-primary" onClick={handleAdd}>Add Education</button>
      </div>

      <div className="item-list">
        {data.map((item) => (
          <div key={item.id} className="item-card">
            <div className="item-card-header">
              <div className="item-card-title">Education #{data.indexOf(item) + 1}</div>
              <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>

            <div className="form-group">
              <label>Institution</label>
              <input
                type="text"
                value={item.institution || ''}
                onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)}
                placeholder="University of Karachi, Karachi"
              />
            </div>

            <div className="form-group">
              <label>Degree</label>
              <input
                type="text"
                value={item.degree || ''}
                onChange={(e) => handleUpdate(item.id, 'degree', e.target.value)}
                placeholder="Bachelor of Technology"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={item.startDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'startDate', e.target.value)}
                  placeholder="Aug 2016"
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  value={item.endDate || ''}
                  onChange={(e) => handleUpdate(item.id, 'endDate', e.target.value)}
                  placeholder="Jul 2020"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EducationForm

