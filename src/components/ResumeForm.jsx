import React from 'react'
import PersonalInfoForm from './forms/PersonalInfoForm'
import WorkExperienceForm from './forms/WorkExperienceForm'
import ProjectsForm from './forms/ProjectsForm'
import EducationForm from './forms/EducationForm'
import SkillsForm from './forms/SkillsForm'
import CertificationsForm from './forms/CertificationsForm'
import SoftSkillsForm from './forms/SoftSkillsForm'
import LanguagesForm from './forms/LanguagesForm'
import './ResumeForm.css'

function ResumeForm({ resumeData, updateResumeData }) {
  return (
    <div className="resume-form">
      <div className="form-container">
        <PersonalInfoForm 
          data={resumeData.personalInfo}
          updateData={(data) => updateResumeData('personalInfo', data)}
        />
        
        <WorkExperienceForm 
          data={resumeData.workExperience}
          updateData={(data) => updateResumeData('workExperience', data)}
        />
        
        <ProjectsForm 
          data={resumeData.projects}
          updateData={(data) => updateResumeData('projects', data)}
        />
        
        <EducationForm 
          data={resumeData.education}
          updateData={(data) => updateResumeData('education', data)}
        />
        
        <SkillsForm 
          data={resumeData.skills}
          updateData={(data) => updateResumeData('skills', data)}
        />
        
        <CertificationsForm 
          data={resumeData.certifications}
          updateData={(data) => updateResumeData('certifications', data)}
        />
        
        <SoftSkillsForm 
          data={resumeData.softSkills}
          updateData={(data) => updateResumeData('softSkills', data)}
        />
        
        <LanguagesForm 
          data={resumeData.languages}
          updateData={(data) => updateResumeData('languages', data)}
        />
      </div>
    </div>
  )
}

export default ResumeForm

