import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './VersionSelector.css'

const VERSIONS = ['0.5', '0.4', '0.3', '0.2', '0.1']

function VersionSelector() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  
  // Extract version from pathname (e.g., /v0.5 -> 0.5)
  const pathVersion = location.pathname.match(/\/v(\d+\.\d+)/)?.[1]
  const currentVersion = pathVersion || '0.5'

  const handleVersionChange = (selectedVersion) => {
    navigate(`/v${selectedVersion}`)
    setIsOpen(false)
  }

  return (
    <div className="version-selector-container">
      <div 
        className="version-icon" 
        onClick={() => setIsOpen(!isOpen)}
        title="Select Version"
      >
        <div className="version-icon-content">
          <span className="version-number">{currentVersion}</span>
        </div>
      </div>
      {isOpen && (
        <>
          <div className="version-dropdown-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="version-dropdown-menu">
            {VERSIONS.map(v => (
              <div
                key={v}
                className={`version-option ${v === currentVersion ? 'active' : ''}`}
                onClick={() => handleVersionChange(v)}
              >
                v{v}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default VersionSelector

