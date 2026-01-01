import React, { useState } from 'react'
import ResumeForm from '../../components/ResumeForm'
import ResumePreview from '../../components/ResumePreview'
import SectionManager from '../../components/SectionManager'
import VersionSelector from '../../components/VersionSelector'
import '../../App.css'
import { availableSections, initialResumeData, initialSectionOrder } from '../../Config-Data/Resume-1'

// Version 0.1 - Earliest version
function App() {
  const [resumeData, setResumeData] = useState(initialResumeData)
  const [activeTab, setActiveTab] = useState('form')
  const [sectionOrder, setSectionOrder] = useState(initialSectionOrder)
  const [enabledSections, setEnabledSections] = useState(
    initialSectionOrder.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )
  const [customSections, setCustomSections] = useState({})

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const updateSectionOrder = (newOrder) => {
    setSectionOrder(newOrder)
  }

  const toggleSection = (sectionKey) => {
    setEnabledSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const addSection = (sectionKey) => {
    if (!sectionOrder.includes(sectionKey)) {
      setSectionOrder(prev => [...prev, sectionKey])
    }
    setEnabledSections(prev => ({
      ...prev,
      [sectionKey]: true
    }))
  }

  const removeSection = (sectionKey) => {
    const section = availableSections.find(s => s.key === sectionKey)
    const isCustomSection = customSections[sectionKey]
    
    if ((section && !section.required) || isCustomSection) {
      setSectionOrder(prev => prev.filter(key => key !== sectionKey))
      setEnabledSections(prev => {
        const newEnabled = { ...prev }
        delete newEnabled[sectionKey]
        return newEnabled
      })
      
      if (isCustomSection) {
        setCustomSections(prev => {
          const newCustom = { ...prev }
          delete newCustom[sectionKey]
          return newCustom
        })
        setResumeData(prev => {
          const newData = { ...prev }
          delete newData[sectionKey]
          return newData
        })
      }
    }
  }

  const createCustomSection = (sectionName) => {
    const sectionKey = `custom_${Date.now()}`
    const newCustomSection = {
      label: sectionName,
      isCustom: true
    }
    
    setCustomSections(prev => ({
      ...prev,
      [sectionKey]: newCustomSection
    }))
    
    setSectionOrder(prev => [...prev, sectionKey])
    
    setEnabledSections(prev => ({
      ...prev,
      [sectionKey]: true
    }))
    
    setResumeData(prev => ({
      ...prev,
      [sectionKey]: []
    }))
    
    return sectionKey
  }

  return (
    <div className="app version-0-1">
      <div className="app-header">
        <div className="header-left">
          <VersionSelector />
          <h1>AI Resume Builder</h1>
        </div>
        <div className="header-right">
          <a 
            href="https://www.linkedin.com/in/muhammad-waqar-dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="linkedin-heart"
            title="Visit my LinkedIn profile"
          >
            ❤️
          </a>
        </div>
      </div>
      
      <div className="tab-header">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'form' ? 'active' : ''} 
            onClick={() => setActiveTab('form')}
          >
            Edit Resume
          </button>
          <button 
            className={activeTab === 'preview' ? 'active' : ''} 
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>
      </div>
      
      <div className="app-content">
        {activeTab === 'form' ? (
          <>
            <SectionManager
              availableSections={availableSections}
              sectionOrder={sectionOrder}
              enabledSections={enabledSections}
              customSections={customSections}
              onUpdateOrder={updateSectionOrder}
              onToggleSection={toggleSection}
              onAddSection={addSection}
              onRemoveSection={removeSection}
              onCreateCustomSection={createCustomSection}
            />
            <ResumeForm 
              resumeData={resumeData} 
              updateResumeData={updateResumeData}
              sectionOrder={sectionOrder}
              enabledSections={enabledSections}
              customSections={customSections}
            />
          </>
        ) : (
          <ResumePreview 
            resumeData={resumeData}
            sectionOrder={sectionOrder}
            enabledSections={enabledSections}
            customSections={customSections}
          />
        )}
      </div>
    </div>
  )
}

export default App

