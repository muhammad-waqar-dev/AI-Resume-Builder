export const handleResumeParsed = ({parsedData, setResumeData, setActiveTab, setIsModalOpen}) => {
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
    setIsModalOpen(false)
  }