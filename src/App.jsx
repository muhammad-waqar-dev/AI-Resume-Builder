import React, { useState } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import AIResumeModal from './components/AIResumeModal'
import './App.css'

const initialResumeData = {
  personalInfo: {
    name: 'John Doe',
    title: 'Software Developer',
    summary: 'Resourceful Developer with 4+ years of experience in designing and developing user interfaces, testing and training employees. Skilled at utilizing a wide variety of tools and programs to provide effective applications.',
    phone: '+91-9999999999',
    email: 'john.doe@gmail.com',
    location: 'Karachi, Sindh, Pakistan',
    github: 'https://github.com/xx-xx-xx',
    linkedin: 'https://www.linkedin.com/in/xx-xx-xx/',
    portfolio: '',
    profileImage: 'https://media.licdn.com/dms/image/v2/D4D03AQFqHwZ79Vp4-g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1735599452348?e=1746105600&v=beta&t=Lx534jVZiZwUo1NQOZCq2E-eJFwV84Fc_0VJcx3aE-s'
  },
  workExperience: [
    {
      id: 1,
      company: 'Weekday',
      role: 'SDE 1',
      location: 'Karachi, Sindh, Pakistan',
      startDate: 'Aug 2020',
      endDate: 'Present',
      description: "Developed, tested, and maintained software solutions for ARC LLC's flagship product. Collaborated with cross-functional teams to deliver high-quality solutions and solve technical challenges.",
      achievements: [
        'Led the implementation of a new feature that increased user engagement by 25%.',
        'Optimized the product\'s backend performance, reducing load times by 40%.',
        'Collaborated with product managers and UX/UI designers to ensure the features met customer requirements and improved user experience.',
        'Contributed to the migration of the codebase to a microservices architecture, improving scalability and reducing system downtime.',
        'Participated in code reviews and mentored junior developers on best practices and coding standards.'
      ]
    }
  ],
  projects: [
    {
      id: 1,
      name: 'Robotics',
      year: '2019',
      description: 'Created a mecanum wheel robot with a multidirectional arm capable of complex movements and automation.',
      details: [
        'Successfully designed and built a robot with mecanum wheels for omnidirectional movement.',
        'Developed a control system to coordinate the robot\'s arm and wheel movement for precise tasks.',
        'Improved arm accuracy and speed by implementing custom software for motion planning.',
        'Won 2nd place in a regional robotics competition for innovation and functionality.'
      ]
    }
  ],
  education: [
    {
      id: 1,
      institution: 'University of Karachi, Karachi',
      degree: 'Bachelor of Science in Computer Science',
      startDate: 'Aug 2016',
      endDate: 'Jul 2020'
    }
  ],
  skills: ['JavaScript', 'Python', 'Web Services', 'C++', 'HTML5', 'CSS', 'SQL', 'User Interface'],
  certifications: [
    'Certified Web Professional-Web Developer',
    'Java Development Certified Professional'
  ],
  softSkills: ['Collaboration', 'Problem-solving', 'Communication', 'Time management', 'Result-oriented'],
  languages: ['English', 'Urdu']
}

function App() {
  const [resumeData, setResumeData] = useState(initialResumeData)
  const [activeTab, setActiveTab] = useState('form')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const handleResumeParsed = (parsedData) => {
    console.log('Received parsed data:', parsedData)
    
    // Merge parsed data with existing structure, preserving IDs and structure
    setResumeData(prev => {
      const merged = { ...prev }
      
      // Merge personal info - update fields if they exist in parsed data (even if empty string)
      if (parsedData.personalInfo) {
        merged.personalInfo = {
          ...prev.personalInfo,
          // Update fields that are present in parsed data (check if key exists, not just truthy value)
          name: parsedData.personalInfo.name !== undefined ? parsedData.personalInfo.name : prev.personalInfo.name,
          email: parsedData.personalInfo.email !== undefined && parsedData.personalInfo.email ? parsedData.personalInfo.email : prev.personalInfo.email,
          phone: parsedData.personalInfo.phone !== undefined && parsedData.personalInfo.phone ? parsedData.personalInfo.phone : prev.personalInfo.phone,
          title: parsedData.personalInfo.title !== undefined && parsedData.personalInfo.title ? parsedData.personalInfo.title : prev.personalInfo.title,
          location: parsedData.personalInfo.location !== undefined && parsedData.personalInfo.location ? parsedData.personalInfo.location : prev.personalInfo.location,
          summary: parsedData.personalInfo.summary !== undefined && parsedData.personalInfo.summary ? parsedData.personalInfo.summary : prev.personalInfo.summary,
          github: parsedData.personalInfo.github !== undefined && parsedData.personalInfo.github ? parsedData.personalInfo.github : prev.personalInfo.github,
          linkedin: parsedData.personalInfo.linkedin !== undefined && parsedData.personalInfo.linkedin ? parsedData.personalInfo.linkedin : prev.personalInfo.linkedin,
          portfolio: parsedData.personalInfo.portfolio !== undefined && parsedData.personalInfo.portfolio ? parsedData.personalInfo.portfolio : prev.personalInfo.portfolio
        }
      }
      
      // Replace arrays if parsed data has values
      if (parsedData.workExperience && Array.isArray(parsedData.workExperience) && parsedData.workExperience.length > 0) {
        merged.workExperience = parsedData.workExperience
      }
      if (parsedData.projects && Array.isArray(parsedData.projects) && parsedData.projects.length > 0) {
        merged.projects = parsedData.projects
      }
      if (parsedData.education && Array.isArray(parsedData.education) && parsedData.education.length > 0) {
        merged.education = parsedData.education
      }
      if (parsedData.skills && Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
        merged.skills = parsedData.skills
      }
      if (parsedData.certifications && Array.isArray(parsedData.certifications) && parsedData.certifications.length > 0) {
        merged.certifications = parsedData.certifications
      }
      if (parsedData.softSkills && Array.isArray(parsedData.softSkills) && parsedData.softSkills.length > 0) {
        merged.softSkills = parsedData.softSkills
      }
      if (parsedData.languages && Array.isArray(parsedData.languages) && parsedData.languages.length > 0) {
        merged.languages = parsedData.languages
      }
      
      console.log('Merged resume data:', merged)
      return merged
    })
    
    // Switch to form tab so user can see and edit the parsed data
    setActiveTab('form')
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1>Resume Builder</h1>
        <div className="header-actions">
          <button 
            className="btn-ai-resume"
            onClick={() => setIsModalOpen(true)}
          >
            Custom AI Resume
          </button>
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
      </div>
      
      <div className="app-content">
        {activeTab === 'form' ? (
          <ResumeForm 
            resumeData={resumeData} 
            updateResumeData={updateResumeData} 
          />
        ) : (
          <ResumePreview resumeData={resumeData} />
        )}
      </div>

      <AIResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResumeParsed={handleResumeParsed}
      />
    </div>
  )
}

export default App

