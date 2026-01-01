/**
 * Utility to parse extracted text from PDF/image and convert to structured resume data
 */

export function parseResumeText(text) {
  // Normalize text - replace multiple spaces/tabs with single space, then split by lines
  const normalizedText = text.replace(/[\r\n]+/g, '\n').replace(/[ \t]+/g, ' ')
  const lines = normalizedText.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const parsedData = {
    personalInfo: {
      name: '',
      title: '',
      summary: '',
      phone: '',
      email: '',
      location: '',
      github: '',
      linkedin: '',
      portfolio: '',
      profileImage: ''
    },
    workExperience: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    softSkills: [],
    languages: []
  }

  // Extract email
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
  const emails = text.match(emailRegex)
  if (emails && emails.length > 0) {
    parsedData.personalInfo.email = emails[0]
  }

  // Extract phone
  const phoneRegex = /(\+?[\d\s\-()]{10,})/g
  const phones = text.match(phoneRegex)
  if (phones && phones.length > 0) {
    parsedData.personalInfo.phone = phones[0].trim()
  }

  // Extract URLs (LinkedIn, GitHub, Portfolio)
  const urlRegex = /(https?:\/\/[^\s]+)/gi
  const urls = text.match(urlRegex)
  if (urls) {
    urls.forEach(url => {
      if (url.includes('linkedin.com')) {
        parsedData.personalInfo.linkedin = url
      } else if (url.includes('github.com')) {
        parsedData.personalInfo.github = url
      } else if (url.includes('portfolio') || url.includes('website')) {
        parsedData.personalInfo.portfolio = url
      }
    })
  }

  // Extract name (usually first line or before email)
  if (lines.length > 0) {
    // Try first few lines to find name (skip empty lines)
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i]
      // If line doesn't look like an email, phone, or URL, and is reasonably short (likely a name)
      if (!emailRegex.test(line) && !phoneRegex.test(line) && !urlRegex.test(line) && 
          line.length < 60 && line.length > 2 && 
          !line.toLowerCase().includes('resume') && !line.toLowerCase().includes('cv')) {
        parsedData.personalInfo.name = line
        break
      }
    }
  }

  // Extract location
  const locationPatterns = [
    /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/, // City, State, Country
    /([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+)/, // City, State
    /([A-Z][a-zA-Z\s]+)/ // Just city/state
  ]
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern)
    if (match && !parsedData.personalInfo.location) {
      const potentialLocation = match[1]
      // Skip if it looks like a name or company
      if (potentialLocation.split(' ').length <= 5 && !potentialLocation.includes('University')) {
        parsedData.personalInfo.location = potentialLocation
        break
      }
    }
  }

  // Parse sections by common headers
  let currentSection = null
  const sectionData = {
    workExperience: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    softSkills: [],
    languages: []
  }
  
  const sectionKeywords = {
    workExperience: ['experience', 'work history', 'employment', 'professional experience', 'career'],
    projects: ['projects', 'project', 'portfolio'],
    education: ['education', 'academic', 'qualification', 'university'],
    skills: ['skills', 'technical skills', 'technical'],
    certifications: ['certification', 'certificate', 'certifications'],
    softSkills: ['soft skills', 'interpersonal', 'personal skills'],
    languages: ['languages', 'language', 'linguistic']
  }

  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase()
    
    // Check if this line is a section header
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      // Check if line matches a section header (case-insensitive, exact or partial match)
      const isHeader = keywords.some(keyword => {
        const regex = new RegExp(`^\\s*${keyword}\\s*:?\\s*$`, 'i')
        return regex.test(line) || (lowerLine === keyword || lowerLine.startsWith(keyword + ':'))
      })
      
      if (isHeader && line.length < 50) {
        // Save previous section data before switching
        if (currentSection && sectionData[currentSection] && sectionData[currentSection].length > 0) {
          parsedData[currentSection] = [...sectionData[currentSection]]
        }
        currentSection = section
        return
      }
    }

    // Process based on current section
    if (currentSection === 'workExperience') {
      // Try to extract work experience entries
      // Pattern: Role at Company, Date - Date, Location
      const roleMatch = line.match(/^(.+?)\s+(?:at|@|\-|,)\s+(.+)/i)
      if (roleMatch) {
        sectionData.workExperience.push({
          id: Date.now() + index,
          role: roleMatch[1].trim(),
          company: roleMatch[2].trim(),
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          achievements: []
        })
      } else if (sectionData.workExperience.length > 0 && line.length > 20) {
        // If we have an entry and this looks like a description
        const lastEntry = sectionData.workExperience[sectionData.workExperience.length - 1]
        if (!lastEntry.description) {
          lastEntry.description = line
        } else {
          if (!lastEntry.achievements) lastEntry.achievements = []
          lastEntry.achievements.push(line)
        }
      }
    } else if (currentSection === 'projects') {
      // Extract project names
      if (line.length < 100 && !line.match(/\d{4}/) && line.length > 3) {
        sectionData.projects.push({
          id: Date.now() + index,
          name: line,
          year: '',
          description: '',
          details: []
        })
      } else if (sectionData.projects.length > 0 && line.length > 10) {
        const lastProject = sectionData.projects[sectionData.projects.length - 1]
        if (!lastProject.description) {
          lastProject.description = line
        } else {
          if (!lastProject.details) lastProject.details = []
          lastProject.details.push(line.replace(/^[•\-\*]\s*/, ''))
        }
      }
    } else if (currentSection === 'education') {
      // Extract education entries
      const eduMatch = line.match(/(.+?)\s*,\s*(.+)/)
      if (eduMatch || line.includes('University') || line.includes('College') || line.includes('Bachelor') || line.includes('Master') || line.includes('Degree')) {
        sectionData.education.push({
          id: Date.now() + index,
          institution: eduMatch ? eduMatch[1].trim() : line,
          degree: eduMatch ? eduMatch[2].trim() : '',
          startDate: '',
          endDate: ''
        })
      }
    } else if (currentSection === 'skills') {
      // Extract skills (comma separated or line separated)
      const skillsInLine = line.split(/[,;•\-\*]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50)
      sectionData.skills.push(...skillsInLine)
    } else if (currentSection === 'certifications') {
      if (line.length > 5 && line.length < 200) {
        sectionData.certifications.push(line.replace(/^[•\-\*]\s*/, ''))
      }
    } else if (currentSection === 'languages') {
      const languagesInLine = line.split(/[,;•\-\*]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 30)
      sectionData.languages.push(...languagesInLine)
    }

    // Try to extract title/job title
    if (!parsedData.personalInfo.title && index < 5) {
      const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'specialist', 'consultant']
      if (titleKeywords.some(keyword => lowerLine.includes(keyword))) {
        parsedData.personalInfo.title = line
      }
    }
  })

  // Save the last section data
  if (currentSection && sectionData[currentSection] && sectionData[currentSection].length > 0) {
    parsedData[currentSection] = sectionData[currentSection]
  }
  
  // Remove duplicates from array fields
  if (parsedData.skills.length > 0) {
    parsedData.skills = [...new Set(parsedData.skills)]
  }
  if (parsedData.languages.length > 0) {
    parsedData.languages = [...new Set(parsedData.languages)]
  }

  // If no structured data found, try to extract summary (usually first few sentences)
  if (!parsedData.personalInfo.summary && lines.length > 2) {
    const summaryLines = lines.slice(0, 3).filter(line => 
      line.length > 20 && 
      !emailRegex.test(line) && 
      !phoneRegex.test(line) &&
      !urlRegex.test(line)
    )
    parsedData.personalInfo.summary = summaryLines.join(' ')
  }

  return parsedData
}

