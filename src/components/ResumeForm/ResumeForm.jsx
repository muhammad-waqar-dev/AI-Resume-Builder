import React from 'react'
import PersonalInfoForm from '../forms/PersonalInfoForm'
import WorkExperienceForm from '../forms/WorkExperienceForm'
import ProjectsForm from '../forms/ProjectsForm'
import EducationForm from '../forms/EducationForm'
import SkillsForm from '../forms/SkillsForm'
import CertificationsForm from '../forms/CertificationsForm'
import SoftSkillsForm from '../forms/SoftSkillsForm'
import LanguagesForm from '../forms/LanguagesForm'
import CustomSectionForm from '../forms/CustomSectionForm'
import './ResumeForm.css'

// Section component mapping
const sectionComponents = {
  personalInfo: PersonalInfoForm,
  workExperience: WorkExperienceForm,
  projects: ProjectsForm,
  education: EducationForm,
  skills: SkillsForm,
  certifications: CertificationsForm,
  softSkills: SoftSkillsForm,
  languages: LanguagesForm
}

function ResumeForm({ resumeData, updateResumeData, sectionOrder = [], enabledSections = {}, customSections = {} }) {
  // Always render PersonalInfo first (required section)
  const renderSection = (sectionKey) => {
    // Check if it's a custom section
    const customSection = customSections[sectionKey]
    if (customSection) {
      return (
        <CustomSectionForm
          key={sectionKey}
          data={resumeData[sectionKey] || []}
          updateData={(data) => updateResumeData(sectionKey, data)}
          sectionLabel={customSection.label}
        />
      )
    }
    
    // Render standard section
    const Component = sectionComponents[sectionKey]
    if (!Component) return null

    // Provide default data based on section type to prevent crashes
    const defaultData = sectionKey === 'personalInfo' ? {} : []
    const sectionData = resumeData[sectionKey] || defaultData

    return (
      <Component
        key={sectionKey}
        data={sectionData}
        updateData={(data) => updateResumeData(sectionKey, data)}
      />
    )
  }

  return (
    <div className="resume-form">
      <div className="form-container">
        {/* Personal Info is always first and required */}
        {renderSection('personalInfo')}
        
        {/* Render other sections based on order and enabled state */}
        {sectionOrder.map(sectionKey => {
          if (enabledSections[sectionKey] && sectionKey !== 'personalInfo') {
            return renderSection(sectionKey)
          }
          return null
        })}
      </div>
    </div>
  )
}

export default ResumeForm

