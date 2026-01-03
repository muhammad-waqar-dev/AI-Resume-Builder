export const handleResumeParsed = ({
  parsedData, 
  setResumeData, 
  setActiveTab, 
  setIsModalOpen, 
  setEnabledSections,
  setSectionOrder,
  setSections,
  setHasData
}) => {
  // Merge parsed data with existing structure
  setResumeData(prev => {
    const merged = { ...prev }
    
    if (parsedData.personalInfo) {
      merged.personalInfo = {
        ...prev.personalInfo,
        ...parsedData.personalInfo
      }
    }
    
    const arrayFields = ['workExperience', 'projects', 'education', 'skills', 'certifications', 'softSkills', 'languages']
    
    arrayFields.forEach(field => {
      if (parsedData[field] && Array.isArray(parsedData[field])) {
        merged[field] = parsedData[field]
      }
    })
    
    return merged
  })

  // Initialize sections and order for the form to display correctly
  const standardSections = [
    { key: 'personalInfo', label: 'Personal Information', required: true },
    { key: 'workExperience', label: 'Work Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'certifications', label: 'Certifications' },
    { key: 'languages', label: 'Languages' },
    { key: 'softSkills', label: 'Soft Skills' }
  ]

  const standardOrder = ['workExperience', 'education', 'skills', 'projects', 'certifications', 'languages', 'softSkills']

  setSections(standardSections)
  setSectionOrder(standardOrder)
  
  // Enable sections that have data or were specifically identified (even if empty)
  const newEnabled = { personalInfo: true }
  standardOrder.forEach(key => {
    // If the section exists in parsedData (even if array is empty), we consider it "found"
    if (parsedData[key] !== undefined) {
      newEnabled[key] = true
    } else {
      newEnabled[key] = false
    }
  })
  setEnabledSections(newEnabled)

  // Indicate that we have data, which will show the editor in App.jsx
  if (setHasData) setHasData(true)
  
  setActiveTab('form')
  setIsModalOpen(false)
}
