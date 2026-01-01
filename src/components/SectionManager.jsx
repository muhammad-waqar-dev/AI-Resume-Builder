import React, { useState } from 'react'
import './SectionManager.css'

function SectionManager({
  availableSections,
  sectionOrder,
  enabledSections,
  customSections = {},
  onUpdateOrder,
  onToggleSection,
  onAddSection,
  onRemoveSection,
  onCreateCustomSection
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCustomSectionForm, setShowCustomSectionForm] = useState(false)
  const [customSectionName, setCustomSectionName] = useState('')

  const moveSection = (index, direction) => {
    const newOrder = [...sectionOrder]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newOrder.length) {
      [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]]
      onUpdateOrder(newOrder)
    }
  }

  const getAvailableSectionsToAdd = () => {
    return availableSections.filter(section => 
      !section.required && !sectionOrder.includes(section.key)
    )
  }

  return (
    <div className="section-manager">
      <div 
        className="section-manager-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>Manage Sections</h3>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {isExpanded && (
        <div className="section-manager-content">
          <div className="current-sections">
            <h4>Section Order</h4>
            <div className="sections-list">
              {/* Personal Info is always first and required */}
              <div className="section-item required">
                <span className="section-label">
                  <span className="drag-handle">⋮⋮</span>
                  Personal Info
                </span>
                <span className="section-status required">Required</span>
              </div>
              
              {/* Other sections */}
              {sectionOrder.map((sectionKey, index) => {
                const section = availableSections.find(s => s.key === sectionKey)
                const customSection = customSections[sectionKey]
                
                // Skip if section is not found (shouldn't happen, but safety check)
                if (!section && !customSection) return null
                
                const sectionLabel = customSection ? customSection.label : section.label
                const isRequired = customSection ? false : section.required
                
                return (
                  <div key={sectionKey} className={`section-item ${customSection ? 'custom-section' : ''}`}>
                    <span className="section-label">
                      <span className="drag-handle">⋮⋮</span>
                      {sectionLabel}
                      {customSection && <span className="custom-badge">Custom</span>}
                    </span>
                    <div className="section-controls">
                      <button
                        className="btn-move"
                        onClick={() => moveSection(index, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="btn-move"
                        onClick={() => moveSection(index, 'down')}
                        disabled={index === sectionOrder.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className={`btn-toggle ${enabledSections[sectionKey] ? 'enabled' : 'disabled'}`}
                        onClick={() => onToggleSection(sectionKey)}
                        title={enabledSections[sectionKey] ? 'Hide section' : 'Show section'}
                      >
                        {enabledSections[sectionKey] ? '👁️' : '🚫'}
                      </button>
                      {!isRequired && (
                        <button
                          className="btn-remove"
                          onClick={() => onRemoveSection(sectionKey)}
                          title="Remove section"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {(getAvailableSectionsToAdd().length > 0 || onCreateCustomSection) && (
            <div className="available-sections">
              <h4>Add Section</h4>
              <div className="add-sections-list">
                {getAvailableSectionsToAdd().map(section => (
                  <button
                    key={section.key}
                    className="btn-add-section"
                    onClick={() => onAddSection(section.key)}
                  >
                    + {section.label}
                  </button>
                ))}
              </div>
              
              {onCreateCustomSection && (
                <div className="custom-section-creator">
                  <h4>Create Custom Section</h4>
                  {!showCustomSectionForm ? (
                    <button
                      className="btn-create-custom"
                      onClick={() => setShowCustomSectionForm(true)}
                    >
                      + Create New Custom Section
                    </button>
                  ) : (
                    <div className="custom-section-form">
                      <input
                        type="text"
                        placeholder="Enter section name (e.g., Awards, Publications, Hobbies)"
                        value={customSectionName}
                        onChange={(e) => setCustomSectionName(e.target.value)}
                        className="custom-section-input"
                        autoFocus
                      />
                      <div className="custom-section-form-actions">
                        <button
                          className="btn-create-custom"
                          onClick={() => {
                            if (customSectionName.trim()) {
                              onCreateCustomSection(customSectionName.trim())
                              setCustomSectionName('')
                              setShowCustomSectionForm(false)
                            }
                          }}
                        >
                          Create
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setCustomSectionName('')
                            setShowCustomSectionForm(false)
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SectionManager

