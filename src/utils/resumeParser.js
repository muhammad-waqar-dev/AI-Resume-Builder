/**
 * Utility to parse extracted text from PDF/image and convert to structured resume data
 */

export function parseResumeText(text) {
  // Normalize text - replace multiple spaces/tabs with single space
  const normalizedText = text.replace(/[ \t]+/g, ' ')
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

  // Improved date range regex to handle spaces within years (common in PDF extraction)
  const yearRegex = /[0-9]{1,2}\s?[0-9]{0,2}\s?[0-9]{0,2}/;
  const monthRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{1,2})/i;
  const datePart = new RegExp(`(?:${monthRegex.source}[\\s/.-]?)?${yearRegex.source}`, 'i');
  const dateRangeRegex = new RegExp(`${datePart.source}\\s*(?:-|–|—|to|until)\\s*(?:Present|Now|Current|${datePart.source})`, 'i');

  // Section header keywords with broader matching
  const sectionKeywords = {
    workExperience: [/experience/i, /work history/i, /employment/i, /professional experience/i, /career/i, /work/i, /professional background/i, /employment history/i],
    projects: [/projects/i, /project/i, /portfolio/i, /personal projects/i, /selected projects/i, /academic projects/i, /notable projects/i],
    education: [/education/i, /academic/i, /qualification/i, /university/i, /degrees/i, /academic background/i, /educational background/i, /studies/i],
    skills: [/skills/i, /technical skills/i, /technical/i, /competencies/i, /expertise/i, /technologies/i, /tools/i, /professional skills/i, /key skills/i, /core skills/i, /tech stack/i],
    certifications: [/certification/i, /certificate/i, /certifications/i, /awards/i, /honors/i, /achievements/i, /licenses/i, /courses/i],
    softSkills: [/soft skills/i, /interpersonal/i, /personal skills/i, /attributes/i, /core competencies/i, /personal attributes/i],
    languages: [/languages/i, /language/i, /linguistic/i, /linguistic skills/i]
  }

  const isSectionHeader = (line) => {
    const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
    // Headers are usually short
    if (cleanLine.length > 45) return null;
    
    // Check for exact or very close matches
    for (const [section, regexes] of Object.entries(sectionKeywords)) {
      for (const regex of regexes) {
        // Match if the line contains the keyword specifically as a title
        // e.g. "SKILLS", "TECHNICAL SKILLS", "Professional Skills:"
        const headerRegex = new RegExp(`^\\s*(?:professional|technical|key|core|notable|academic|educational|linguistic)?\\s*${regex.source}\\s*:?\\s*$`, 'i');
        if (headerRegex.test(cleanLine) || cleanLine.toLowerCase() === regex.source.toLowerCase()) {
          return section;
        }
      }
    }
    return null;
  }

  // Extract common entities
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g
  const urlRegex = /(https?:\/\/[^\s]+)/gi

  const emails = text.match(emailRegex) || []
  const phones = text.match(phoneRegex) || []
  const urls = text.match(urlRegex) || []

  parsedData.personalInfo.email = emails[0] || ''
  parsedData.personalInfo.phone = phones[0] || ''

  urls.forEach(url => {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('linkedin.com')) parsedData.personalInfo.linkedin = url
    else if (lowerUrl.includes('github.com')) parsedData.personalInfo.github = url
    else if (lowerUrl.includes('portfolio') || lowerUrl.includes('website') || lowerUrl.includes('behance')) {
      parsedData.personalInfo.portfolio = url
    }
  })

  // Pre-process: Identify which lines belong to which section
  let currentSection = null;
  const sectionContent = {
    workExperience: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    softSkills: [],
    languages: []
  };

  const summaryLines = [];

  lines.forEach((line, index) => {
    const section = isSectionHeader(line);
    if (section) {
      currentSection = section;
      return;
    }

    // Auto-detect start of work experience if no header is found
    if (!currentSection && line.match(dateRangeRegex) && line.length < 100 && index > 1) {
      currentSection = 'workExperience';
    }

    if (currentSection) {
      sectionContent[currentSection].push(line);
    } else {
      // Still in header/summary area
      if (!parsedData.personalInfo.name && line.length < 40 && line.length > 3 && !line.match(/\d/) && !line.match(emailRegex)) {
        parsedData.personalInfo.name = line;
      } else if (parsedData.personalInfo.name && !parsedData.personalInfo.title && line.length < 60 && ['developer', 'engineer', 'designer', 'manager', 'analyst', 'specialist'].some(kw => line.toLowerCase().includes(kw))) {
        parsedData.personalInfo.title = line;
      } else if (line !== parsedData.personalInfo.name && line !== parsedData.personalInfo.title && 
          !line.match(emailRegex) && !line.match(phoneRegex) && !line.match(urlRegex) &&
          !line.toLowerCase().includes('portfolio') && !line.toLowerCase().includes('linkedin') &&
          !line.toLowerCase().includes('github')) {
        summaryLines.push(line);
      }
    }
  });

  parsedData.personalInfo.summary = summaryLines.join(' ').trim();

  // Parse Work Experience
  if (sectionContent.workExperience.length > 0) {
    let currentEntry = null;
    sectionContent.workExperience.forEach(line => {
      const dateMatch = line.match(dateRangeRegex);
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      
      if (dateMatch && line.length < 120 && !isBullet) {
        if (currentEntry) parsedData.workExperience.push(currentEntry);
        
        const dateStr = dateMatch[0];
        const textWithoutDate = line.replace(dateStr, '').trim().replace(/^[|,\-\s]+|[|,\-\s]+$/g, '');
        
        let role = '', company = '';
        const splitters = [/\|/, / - /, / – /, / — /, / at /, / @ /, /, /];
        for (const splitter of splitters) {
          const parts = textWithoutDate.split(splitter);
          if (parts.length >= 2) {
            role = parts[0].trim();
            company = parts[1].trim();
            break;
          }
        }

        currentEntry = {
          id: Date.now() + Math.random(),
          role: role || textWithoutDate,
          company: company || 'Company',
          location: '',
          startDate: dateStr.split(/[-–—]|to/i)[0]?.trim() || '',
          endDate: dateStr.split(/[-–—]|to/i)[1]?.trim() || '',
          description: '',
          achievements: []
        };
      } else if (currentEntry) {
        if (isBullet) {
          currentEntry.achievements.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (!currentEntry.description) {
          currentEntry.description = line;
        } else {
          currentEntry.achievements.push(line);
        }
      }
    });
    if (currentEntry) parsedData.workExperience.push(currentEntry);
  }

  // Parse Education
  if (sectionContent.education.length > 0) {
    let currentEdu = null;
    sectionContent.education.forEach(line => {
      const degreeKeywords = [/Bachelor/i, /Master/i, /PhD/i, /B\.S/i, /M\.S/i, /Degree/i, /Diploma/i, /BSc/i, /MSc/i];
      const institutionKeywords = [/University/i, /College/i, /Institute/i, /School/i, /Academy/i];
      const isDegree = degreeKeywords.some(kw => kw.test(line));
      const isInstitution = institutionKeywords.some(kw => kw.test(line));
      const yearMatch = line.match(/\d{2,4}/g);

      if (isDegree || isInstitution) {
        if (currentEdu && (currentEdu.institution || currentEdu.degree) && (isInstitution && currentEdu.institution || isDegree && currentEdu.degree)) {
          parsedData.education.push(currentEdu);
          currentEdu = null;
        }
        if (!currentEdu) {
          currentEdu = { id: Date.now() + Math.random(), institution: '', degree: '', startDate: '', endDate: '' };
        }
        if (isInstitution && !currentEdu.institution) currentEdu.institution = line;
        else if (isDegree && !currentEdu.degree) currentEdu.degree = line;
      } else if (yearMatch && currentEdu) {
        if (yearMatch.length >= 2) {
          currentEdu.startDate = yearMatch[0];
          currentEdu.endDate = yearMatch[yearMatch.length - 1];
        } else if (!currentEdu.endDate) {
          currentEdu.endDate = yearMatch[0];
        }
      }
    });
    if (currentEdu) parsedData.education.push(currentEdu);
  }

  // Parse Projects
  if (sectionContent.projects.length > 0) {
    let currentProject = null;
    sectionContent.projects.forEach(line => {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (line.length < 80 && !isBullet && !line.match(dateRangeRegex)) {
        if (currentProject) parsedData.projects.push(currentProject);
        currentProject = {
          id: Date.now() + Math.random(),
          name: line,
          year: '',
          description: '',
          details: []
        };
      } else if (currentProject) {
        if (isBullet) currentProject.details.push(line.replace(/^[•\-*]\s*/, ''));
        else if (!currentProject.description) currentProject.description = line;
        else currentProject.details.push(line);
      }
    });
    if (currentProject) parsedData.projects.push(currentProject);
  }

  // Parse Skills, Certifications, Soft Skills, Languages (comma/bullet separated)
  const simpleSections = ['skills', 'certifications', 'softSkills', 'languages'];
  simpleSections.forEach(section => {
    if (sectionContent[section].length > 0) {
      sectionContent[section].forEach(line => {
        // Handle "Category: Skill1, Skill2" format
        const parts = line.split(':');
        const content = parts.length > 1 ? (parts[0].length < 30 ? parts.slice(1).join(':') : line) : line;
        const items = content.split(/[,;•|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 100);
        parsedData[section].push(...items);
      });
      parsedData[section] = [...new Set(parsedData[section])];
    }
  });

  return parsedData;
}
