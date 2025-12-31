import React, { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import './ResumePreview.css'

function ResumePreview({ resumeData }) {
  const resumeRef = useRef()

  const handleDownloadPDF = async () => {
    const element = resumeRef.current
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${resumeData.personalInfo.name || 'resume'}-resume.pdf`)
  }

  return (
    <div className="resume-preview-container">
      <div className="preview-actions">
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          Download as PDF
        </button>
      </div>
      
      <div className="resume-preview" ref={resumeRef}>
        <div className="resume-page">
          {/* Header Section */}
          <div className="resume-header">
            <div className="header-content">
              <div className="header-left">
                <div className="profile-image">
                  {resumeData.personalInfo.profileImage ? (
                    <img src={resumeData.personalInfo.profileImage} alt="Profile" />
                  ) : (
                    <div className="profile-placeholder">
                      <span>{resumeData.personalInfo.name ? resumeData.personalInfo.name.charAt(0).toUpperCase() : '?'}</span>
                    </div>
                  )}
                </div>
                <div className="header-info">
                  <h1 className="resume-name">{resumeData.personalInfo.name || 'Your Name'}</h1>
                  <h2 className="resume-title">{resumeData.personalInfo.title || 'Your Title'}</h2>
                  {resumeData.personalInfo.summary && (
                    <p className="resume-summary">{resumeData.personalInfo.summary}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="contact-info">
              {resumeData.personalInfo.phone && (
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.email && (
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="contact-item">
                  <span className="contact-label">Location:</span>
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
              {resumeData.personalInfo.github && (
                <div className="contact-item">
                  <span className="contact-label">GitHub:</span>
                  <span>{resumeData.personalInfo.github}</span>
                </div>
              )}
              {resumeData.personalInfo.linkedin && (
                <div className="contact-item">
                  <span className="contact-label">LinkedIn:</span>
                  <span>{resumeData.personalInfo.linkedin}</span>
                </div>
              )}
              {resumeData.personalInfo.portfolio && (
                <div className="contact-item">
                  <span className="contact-label">Portfolio:</span>
                  <span>{resumeData.personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience Section */}
          {resumeData.workExperience && resumeData.workExperience.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Work Experience</h3>
              {resumeData.workExperience.map((exp, index) => (
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
                      <strong>Key Achievements:</strong>
                      <ul>
                        {exp.achievements.map((achievement, idx) => (
                          achievement && <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects Section */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Projects</h3>
              {resumeData.projects.map((project, index) => (
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
              ))}
            </div>
          )}

          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Education</h3>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  {edu.startDate && edu.endDate && (
                    <span className="education-dates">{edu.startDate} - {edu.endDate}</span>
                  )}
                  <div className="education-details">
                    {edu.institution && <strong>{edu.institution}</strong>}
                    {edu.degree && <span> • {edu.degree}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Skills</h3>
              <div className="skills-list">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Certifications</h3>
              <ul className="certifications-list">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft Skills Section */}
          {resumeData.softSkills && resumeData.softSkills.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Soft Skills</h3>
              <div className="skills-list">
                {resumeData.softSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Languages Section */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div className="resume-section">
              <h3 className="section-title">Languages</h3>
              <div className="skills-list">
                {resumeData.languages.map((language, index) => (
                  <span key={index} className="skill-tag">{language}</span>
                ))}
              </div>
            </div>
          )}

          <div className="resume-footer">
            <span>End of Page 1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview

