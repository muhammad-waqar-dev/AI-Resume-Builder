import React, { useState, useRef } from 'react'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import './AIResumeModal.css'

function AIResumeModal({ isOpen, onClose, onResumeParsed }) {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    // Validate file type
    const isImage = selectedFile.type.startsWith('image/')
    const isPDF = selectedFile.type === 'application/pdf'

    if (!isImage && !isPDF) {
      setError('Please upload a PDF or image file (JPG, PNG, etc.)')
      return
    }

    setFile(selectedFile)
    setError('')

    // Create preview for images
    if (isImage) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else if (isPDF) {
      // Create preview for PDF by rendering first page
      try {
        const pdfjsLib = await import('pdfjs-dist')
        if (typeof window !== 'undefined') {
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
        }

        const arrayBuffer = await selectedFile.arrayBuffer()
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)
        
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        setPreview(canvas.toDataURL('image/png'))
      } catch (err) {
        console.error('Error creating PDF preview:', err)
        // If preview fails, just show file name
        setPreview(null)
      }
    } else {
      setPreview(null)
    }
  }

  const extractTextFromPDF = async (file) => {
    try {
      // Dynamically import pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set worker source using Vite's ?url import - this is the proper way for Vite
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
      }

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise

      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }

      return fullText
    } catch (err) {
      throw new Error(`Failed to extract text from PDF: ${err.message}`)
    }
  }

  const extractTextFromImage = async (file) => {
    try {
      // Dynamically import Tesseract
      const { createWorker } = await import('tesseract.js')
      
      const worker = await createWorker('eng')
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      return text
    } catch (err) {
      throw new Error(`Failed to extract text from image: ${err.message}`)
    }
  }

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      let extractedText = ''

      // Determine file type and extract text
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file)
      } else if (file.type.startsWith('image/')) {
        extractedText = await extractTextFromImage(file)
      } else {
        throw new Error('Unsupported file type')
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from the file. Please ensure the file is clear and readable.')
      }

      // Parse the extracted text into structured resume data
      const { parseResumeText } = await import('../utils/resumeParser')
      const parsedResume = parseResumeText(extractedText)

      // Debug: Log extracted text and parsed data
      console.log('Extracted Text:', extractedText.substring(0, 500))
      console.log('Parsed Resume Data:', parsedResume)

      // Call the callback with parsed data
      onResumeParsed(parsedResume)
      
      // Close modal and reset
      handleClose()
      
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file')
      console.error('Processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="ai-resume-modal-overlay" onClick={handleClose}>
      <div className="ai-resume-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ai-resume-modal-header">
          <h2>Custom AI Resume</h2>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>

        <div className="ai-resume-modal-body">
          <p className="modal-description">
            Upload your resume as a PDF or image. We'll extract the information and populate the form for you to edit.
          </p>

          <div className="file-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={handleFileSelect}
              className="file-input"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="file-upload-label">
              <div className="upload-icon">📄</div>
              <div>
                {file ? (
                  <span className="file-name">{file.name}</span>
                ) : (
                  <>
                    <span className="upload-text">Click to upload or drag and drop</span>
                    <span className="upload-hint">PDF, JPG, PNG (Max 10MB)</span>
                  </>
                )}
              </div>
            </label>
          </div>

          {preview && (
            <div className="file-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Processing your resume... This may take a moment.</p>
            </div>
          )}
        </div>

        <div className="ai-resume-modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleProcess}
            disabled={!file || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Extract & Parse Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIResumeModal

