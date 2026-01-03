import React, { useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './ResumePreview.css'

function ResumePreview({ resumeData, sectionOrder = [], enabledSections = {}, customSections = {}, templateId = null }) {
  const resumeRef = useRef()
  const [isDownloading, setIsDownloading] = useState(false)
  const [showStyles, setShowStyles] = useState(false)
  
  const DEFAULT_STYLES = {
    fontSize: 10.5,
    fontFamily: "'Inter', sans-serif",
    marginTop: 20,
    marginRight: 20,
    marginBottom: 20,
    marginLeft: 20,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  }

  const [styles, setStyles] = useState(DEFAULT_STYLES)

  const handleStyleChange = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }))
  }

  const resetStyles = () => {
    setStyles(DEFAULT_STYLES)
  }

  // Helper to check if a section should be rendered based on enabled state
  const shouldRenderSection = (sectionKey) => {
    return enabledSections[sectionKey] === true
  }

  // Render Work Experience section
  const renderWorkExperience = () => {
    const hasData = resumeData.workExperience && resumeData.workExperience.length > 0
    
    return (
      <div className="resume-section" data-section="workExperience">
        <h3 className="section-title">Work Experience</h3>
        {hasData ? resumeData.workExperience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <div className="experience-title">
                <strong>{exp.role}</strong>
                {exp.company && <span> • {exp.company}</span>}
              </div>
              <div className="experience-meta">
                {exp.startDate && <span>{exp.startDate}</span>}
                {exp.endDate && <span> - {exp.endDate}</span>}
                {exp.location && <span> • {exp.location}</span>}
              </div>
            </div>
            {exp.description && (
              <p className="experience-description">{exp.description}</p>
            )}
            {exp.achievements && exp.achievements.length > 0 && (
              <div className="achievements-list">
                <ul>
                  {exp.achievements.map((achievement, idx) => (
                    achievement && <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )) : <p className="empty-section-hint">No experience entries yet.</p>}
      </div>
    )
  }

  // Render Projects section
  const renderProjects = () => {
    const hasData = resumeData.projects && resumeData.projects.length > 0
    
    return (
      <div className="resume-section" data-section="projects">
        <h3 className="section-title">Projects</h3>
        {hasData ? resumeData.projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="project-header">
              <strong>{project.name}</strong>
              {project.year && <span> • {project.year}</span>}
            </div>
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
            {project.details && project.details.length > 0 && (
              <ul className="project-details">
                {project.details.map((detail, idx) => (
                  detail && <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )) : <p className="empty-section-hint">No projects added.</p>}
      </div>
    )
  }

  // Render Education section
  const renderEducation = () => {
    const hasData = resumeData.education && resumeData.education.length > 0
    
    return (
      <div className="resume-section" data-section="education">
        <h3 className="section-title">Education</h3>
        {hasData ? resumeData.education.map((edu, index) => (
          <div key={index} className="education-item">
            {edu.startDate && edu.endDate && (
              <span className="education-dates">{edu.startDate} - {edu.endDate}</span>
            )}
            <div className="education-details">
              {edu.institution && <strong>{edu.institution}</strong>}
              {edu.degree && <span> • {edu.degree}</span>}
            </div>
          </div>
        )) : <p className="empty-section-hint">No education details added.</p>}
      </div>
    )
  }

  // Render Skills section
  const renderSkills = () => {
    const hasData = resumeData.skills && resumeData.skills.length > 0
    
    return (
      <div className="resume-section" data-section="skills">
        <h3 className="section-title">Skills</h3>
        {hasData ? (
          <div className="skills-list">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        ) : <p className="empty-section-hint">No skills listed.</p>}
      </div>
    )
  }

  // Render Certifications section
  const renderCertifications = () => {
    const hasData = resumeData.certifications && resumeData.certifications.length > 0
    
    return (
      <div className="resume-section" data-section="certifications">
        <h3 className="section-title">Certifications</h3>
        {hasData ? (
          <ul className="certifications-list">
            {resumeData.certifications.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        ) : <p className="empty-section-hint">No certifications added.</p>}
      </div>
    )
  }

  // Render Soft Skills section
  const renderSoftSkills = () => {
    const hasData = resumeData.softSkills && resumeData.softSkills.length > 0
    
    return (
      <div className="resume-section" data-section="softSkills">
        <h3 className="section-title">Soft Skills</h3>
        {hasData ? (
          <div className="skills-list">
            {resumeData.softSkills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        ) : <p className="empty-section-hint">No soft skills listed.</p>}
      </div>
    )
  }

  // Render Languages section
  const renderLanguages = () => {
    const hasData = resumeData.languages && resumeData.languages.length > 0
    
    return (
      <div className="resume-section" data-section="languages">
        <h3 className="section-title">Languages</h3>
        {hasData ? (
          <div className="skills-list">
            {resumeData.languages.map((language, index) => (
              <span key={index} className="skill-tag">{language}</span>
            ))}
          </div>
        ) : <p className="empty-section-hint">No languages listed.</p>}
      </div>
    )
  }

  // Render Custom Section
  const renderCustomSection = (sectionKey) => {
    const customSection = customSections[sectionKey]
    if (!customSection) return null
    const hasData = resumeData[sectionKey] && resumeData[sectionKey].length > 0

    return (
      <div className="resume-section" data-section={sectionKey}>
        <h3 className="section-title">{customSection.label}</h3>
        {hasData ? resumeData[sectionKey].map((item, index) => (
          <div key={item.id || index} className="experience-item">
            <div className="experience-header">
              <div className="experience-title">
                {item.title && <strong>{item.title}</strong>}
                {item.subtitle && <span> • {item.subtitle}</span>}
              </div>
              {(item.startDate || item.endDate || item.location) && (
                <div className="experience-meta">
                  {item.startDate && <span>{item.startDate}</span>}
                  {item.endDate && <span> - {item.endDate}</span>}
                  {item.location && <span> • {item.location}</span>}
                </div>
              )}
            </div>
            {item.description && (
              <p className="experience-description">{item.description}</p>
            )}
            {item.details && item.details.length > 0 && (
              <ul className="project-details">
                {item.details.map((detail, idx) => (
                  detail && <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )) : <p className="empty-section-hint">No items in this custom section.</p>}
      </div>
    )
  }

  // Section renderer mapping
  const sectionRenderers = {
    workExperience: renderWorkExperience,
    projects: renderProjects,
    education: renderEducation,
    skills: renderSkills,
    certifications: renderCertifications,
    softSkills: renderSoftSkills,
    languages: renderLanguages
  }

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true)
      const element = resumeRef.current
      
      // Use a fixed width for capture to ensure consistency regardless of screen size
      const captureWidth = 794 // 210mm at 96 DPI
      
      const canvas = await html2canvas(element, {
        scale: 3, // High scale for crisp PDF
        useCORS: true,
        logging: false,
        width: captureWidth,
        windowWidth: captureWidth,
      })
      
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = 210
      const pdfHeight = 297
      
      const marginX = styles.marginLeft // Use user's left margin
      const contentWidthMm = pdfWidth - (styles.marginLeft + styles.marginRight)
      
      // Safe Zones (Padding/Margins) in mm from user styles
      const footerPadding = styles.marginBottom        
      const headerPaddingSubsequent = styles.marginTop 
      const firstPageTopMargin = styles.marginTop    
      
      // Conversion factor from mm to Canvas Pixels
      const pxPerMm = canvas.width / contentWidthMm;

      // Calculate heights for slicing in pixels
      const firstPageMaxHeightPx = (pdfHeight - firstPageTopMargin - footerPadding) * pxPerMm;
      const subsequentPageMaxHeightPx = (pdfHeight - headerPaddingSubsequent - footerPadding) * pxPerMm;

      let yOffsetPx = 0;
      let pageNumber = 1;

      while (yOffsetPx < canvas.height) {
        if (pageNumber > 1) pdf.addPage();

        // Determine how much of the canvas to take for this page
        const sliceHeightPx = pageNumber === 1 ? firstPageMaxHeightPx : subsequentPageMaxHeightPx;
        const actualSliceHeightPx = Math.min(sliceHeightPx, canvas.height - yOffsetPx);

        // Create a temporary canvas for the slice to prevent bleed
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = actualSliceHeightPx;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw the specific portion of the main canvas onto the slice
        tempCtx.drawImage(
          canvas,
          0, yOffsetPx, canvas.width, actualSliceHeightPx, // Source coordinates
          0, 0, canvas.width, actualSliceHeightPx          // Destination coordinates
        );

        // Convert slice to image and add to PDF
        const pageImgData = tempCanvas.toDataURL('image/png');
        const contentHeightMm = actualSliceHeightPx / pxPerMm;
        const topMarginMm = pageNumber === 1 ? firstPageTopMargin : headerPaddingSubsequent;

        pdf.addImage(
          pageImgData, 
          'PNG', 
          marginX, 
          topMarginMm, 
          contentWidthMm, 
          contentHeightMm,
          undefined, 
          'FAST'
        );

        yOffsetPx += actualSliceHeightPx;
        pageNumber++;
      }

      pdf.save(`${(resumeData.personalInfo && resumeData.personalInfo.name) || 'resume'}-resume.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const personalInfo = resumeData.personalInfo || {}

  return (
    <div className="resume-preview-container">
      <div className="preview-actions">
        <div className="action-buttons">
          <button 
            className={`btn btn-secondary ${showStyles ? 'active' : ''}`}
            onClick={() => setShowStyles(!showStyles)}
          >
            {showStyles ? 'Hide Styles' : 'Customize Styles'}
          </button>
          <button 
            className={`btn btn-primary ${isDownloading ? 'loading' : ''}`} 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <span className="spinner"></span>
                Generating PDF...
              </>
            ) : (
              'Download as PDF'
            )}
          </button>
        </div>

        {showStyles && (
          <div className="style-customizer-panel">
            <div className="style-customizer-header">
              <h4>Style Customization</h4>
              <button className="btn btn-xs btn-outline" onClick={resetStyles}>Reset to Defaults</button>
            </div>
            
            <div className="style-group">
              <h4>Typography</h4>
              <div className="style-row">
                <div className="style-field">
                  <label>Font Size ({styles.fontSize}pt)</label>
                  <input 
                    type="range" min="8" max="16" step="0.5" 
                    value={styles.fontSize} 
                    onChange={(e) => handleStyleChange('fontSize', parseFloat(e.target.value))} 
                  />
                </div>
                <div className="style-field">
                  <label>Font Family</label>
                  <select 
                    value={styles.fontFamily} 
                    onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                    style={{ fontFamily: styles.fontFamily }}
                  >
                    <option value="'Inter', sans-serif">Inter (Modern Sans)</option>
                    <option value="'Poppins', sans-serif">Poppins (Clean)</option>
                    <option value="'Roboto', sans-serif">Roboto (Professional)</option>
                    <option value="'Open Sans', sans-serif">Open Sans</option>
                    <option value="'Lato', sans-serif">Lato</option>
                    <option value="Georgia, serif">Georgia (Classic Serif)</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Courier New', monospace">Courier New (Monospace)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="style-group">
              <h4>Page Margins (mm)</h4>
              <div className="style-grid">
                <div className="style-field">
                  <label>Top</label>
                  <input type="number" value={styles.marginTop} onChange={(e) => handleStyleChange('marginTop', parseInt(e.target.value) || 0)} />
                </div>
                <div className="style-field">
                  <label>Bottom</label>
                  <input type="number" value={styles.marginBottom} onChange={(e) => handleStyleChange('marginBottom', parseInt(e.target.value) || 0)} />
                </div>
                <div className="style-field">
                  <label>Left</label>
                  <input type="number" value={styles.marginLeft} onChange={(e) => handleStyleChange('marginLeft', parseInt(e.target.value) || 0)} />
                </div>
                <div className="style-field">
                  <label>Right</label>
                  <input type="number" value={styles.marginRight} onChange={(e) => handleStyleChange('marginRight', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </div>

            <div className="style-group">
              <h4>Content Padding (mm)</h4>
              <div className="style-grid">
                <div className="style-field">
                  <label>Top</label>
                  <input type="number" value={styles.paddingTop} onChange={(e) => handleStyleChange('paddingTop', parseInt(e.target.value) || 0)} />
                </div>
                <div className="style-field">
                  <label>Bottom</label>
                  <input type="number" value={styles.paddingBottom} onChange={(e) => handleStyleChange('paddingBottom', parseInt(e.target.value) || 0)} />
                </div>
                <div className="style-field">
                  <label>Left</label>
                  <input type="number" value={styles.paddingLeft} onChange={(e) => handleStyleChange('paddingLeft', parseInt(e.target.value) || 0)} />
                </div>
                <div className="style-field">
                  <label>Right</label>
                  <input type="number" value={styles.paddingRight} onChange={(e) => handleStyleChange('paddingRight', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="resume-preview">
        <div 
          className={`resume-page ${templateId ? `template-${templateId}` : 'template-standard'}`}
          ref={resumeRef}
          style={{
            fontSize: `${styles.fontSize}pt`,
            fontFamily: styles.fontFamily,
            paddingTop: `${styles.marginTop + styles.paddingTop}mm`,
            paddingRight: `${styles.marginRight + styles.paddingRight}mm`,
            paddingBottom: `${styles.marginBottom + styles.paddingBottom}mm`,
            paddingLeft: `${styles.marginLeft + styles.paddingLeft}mm`,
          }}
        >
          <div className="resume-content-wrapper">
            {/* Header Section */}
            <header className="resume-header">
              <div className="header-main">
                {personalInfo.profileImage && (
                  <div className="profile-image">
                    <img src={personalInfo.profileImage} alt="Profile" />
                  </div>
                )}
                <div className="header-info">
                  <h1 className="resume-name">{personalInfo.name || 'Your Name'}</h1>
                  <h2 className="resume-title">{personalInfo.title || 'Your Title'}</h2>
                  {personalInfo.summary && (
                    <p className="resume-summary">{personalInfo.summary}</p>
                  )}
                </div>
              </div>
              
              <div className="contact-info">
                {personalInfo.phone && (
                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="contact-item">
                    <span className="contact-label">Email:</span>
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="contact-item">
                    <span className="contact-label">Location:</span>
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="contact-item">
                    <span className="contact-label">GitHub:</span>
                    <span>{personalInfo.github}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="contact-item">
                    <span className="contact-label">LinkedIn:</span>
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.portfolio && (
                  <div className="contact-item">
                    <span className="contact-label">Portfolio:</span>
                    <span>{personalInfo.portfolio}</span>
                  </div>
                )}
              </div>
            </header>

            <div className="resume-sections">
              {/* Dynamically render sections based on order and enabled state */}
              {sectionOrder.map(sectionKey => {
                if (!shouldRenderSection(sectionKey)) return null
                
                // Check if it's a custom section
                if (customSections[sectionKey]) {
                  return <React.Fragment key={sectionKey}>{renderCustomSection(sectionKey)}</React.Fragment>
                }
                
                // Render standard section
                if (sectionRenderers[sectionKey]) {
                  return <React.Fragment key={sectionKey}>{sectionRenderers[sectionKey]()}</React.Fragment>
                }
                
                return null
              })}
            </div>
          </div>

          <div className="resume-footer">
            <span>Generated by AI Resume Builder</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
