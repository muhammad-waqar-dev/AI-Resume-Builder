import React, { useState } from 'react'
import ResumeForm from '../../components/ResumeForm'
import ResumePreview from '../../components/ResumePreview'
import SectionManager from '../../components/SectionManager'
import '../../App.css'
import { availableSections, initialResumeData, initialSectionOrder } from '../../Config-Data/Resume-1'
import { handleResumeParsed } from '../../Helpers/DataParser'
import AIResumeModal from '../../components/AIResumeModal'
import MainHeader from './Main-Header'
import JsonEditor from '../../components/JsonEditor'

import {allResumeTemplates } from '../../Config-Data'
import TemplateSelector from './TemplateSelector'

// Version 0.2 - Earlier version
function App() {
  const [resumeData, setResumeData] = useState(initialResumeData)
  const [sectionOrder, setSectionOrder] = useState(initialSectionOrder)
  const [sections, setSections] = useState(availableSections)
  const [selectedResume, setSelectedResume] = useState(null)
  const [activeTab, setActiveTab] = useState('form')
  const [enabledSections, setEnabledSections] = useState(
    initialSectionOrder.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )
  const [customSections, setCustomSections] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('both') // 'both', 'json', 'form'

  const handleSelectTemplate = (templateKey) => {
    const template = allResumeTemplates[templateKey];
    setResumeData(template.data);
    setSectionOrder(template.order);
    setSections(template.sections);
    setEnabledSections(
      template.order.reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    setSelectedResume(templateKey);
    setActiveTab('form');
  }

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
    const section = sections.find(s => s.key === sectionKey)
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
    <div className="app version-0-2">
      <MainHeader />

      <div className="tab-header tab-header-split">
        <div className="tab-left">
          <button
            className="btn-ai-resume"
            onClick={() => setIsModalOpen(true)}
          >
            Custom AI Resume
          </button>
        </div>
        <div className="tab-buttons">
          {selectedResume ? <>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedResume(null)}
              style={{ marginRight: '1rem' }}
            >
              Change Template
            </button>
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
          </> :  <h2>Select a resume template</h2>}
        </div>
      </div>

      <div className="app-content">
        {selectedResume ? <>
          {activeTab === 'form' ? (
          <>
            <div className="view-controls">
              <button 
                className={viewMode === 'json' ? 'active' : ''} 
                onClick={() => setViewMode('json')}
              >
                <span>{viewMode === 'json' ? '●' : '○'}</span> JSON Only
              </button>
              <button 
                className={viewMode === 'both' ? 'active' : ''} 
                onClick={() => setViewMode('both')}
              >
                <span>{viewMode === 'both' ? '●' : '○'}</span> Side by Side
              </button>
              <button 
                className={viewMode === 'form' ? 'active' : ''} 
                onClick={() => setViewMode('form')}
              >
                <span>{viewMode === 'form' ? '●' : '○'}</span> Form Only
              </button>
            </div>
            
            <div className="edit-container">
              <div className={`edit-pane ${viewMode === 'form' ? 'hidden' : ''} ${viewMode === 'json' ? 'full-width' : ''}`} style={{ resize: viewMode === 'both' ? 'horizontal' : 'none', overflow: 'auto' }}>
                <JsonEditor 
                  data={resumeData} 
                  onChange={(newData) => setResumeData(newData)} 
                />
              </div>
              
              <div className={`edit-pane ${viewMode === 'json' ? 'hidden' : ''} ${viewMode === 'form' ? 'full-width' : ''}`}>
                <div className="form-side">
                  <SectionManager
                    availableSections={sections}
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
                </div>
              </div>
            </div>
          </>
        ) : (
          <ResumePreview
            resumeData={resumeData}
            sectionOrder={sectionOrder}
            enabledSections={enabledSections}
            customSections={customSections}
            templateId={selectedResume}
          />
        )}
        </> : <TemplateSelector onSelect={handleSelectTemplate} />
      }
      </div>

      <AIResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResumeParsed={(parsedData) => {
          if (!selectedResume) {
            // Default to Resume 1 if no template selected
            const template = allResumeTemplates['Resume1'];
            setSectionOrder(template.order);
            setSections(template.sections);
            setEnabledSections(template.order.reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            setSelectedResume('Resume1');
          }
          handleResumeParsed({ parsedData, setResumeData, setActiveTab, setIsModalOpen });
        }}
      />
    </div>
  )
}

export default App

