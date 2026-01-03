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

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    setFile(selectedFile)
    setError('')

    try {
      const pdfjsLib = await import('pdfjs-dist')
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
      }

      const arrayBuffer = await selectedFile.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)
      
      const viewport = page.getViewport({ scale: 2.5 })
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
      setPreview(null)
    }
  }

  const extractTextFromPDF = async (file) => {
    try {
      const pdfjsLib = await import('pdfjs-dist')
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
      }

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise

      let fullText = ''
      let textLayerFound = false

      // Try standard text layer extraction first
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        
        if (textContent.items.length > 0) {
          textLayerFound = true
          const items = textContent.items.sort((a, b) => {
            if (Math.abs(a.transform[5] - b.transform[5]) < 5) {
              return a.transform[4] - b.transform[4]
            }
            return b.transform[5] - a.transform[5]
          })

          let lastY = -1
          let pageText = ''
          for (const item of items) {
            if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n'
            }
            pageText += item.str + ' '
            lastY = item.transform[5]
          }
          fullText += pageText + '\n\n'
        }
      }

      // Fallback to OCR if no text layer found or text is very sparse
      if (!textLayerFound || fullText.trim().length < 50) {
        console.log('No text layer found or sparse text. Starting OCR fallback...')
        const { createWorker } = await import('tesseract.js')
        const worker = await createWorker('eng')
        
        fullText = '' // Reset and use OCR text
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 2.0 }) // High scale for better OCR
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise

          const { data: { text } } = await worker.recognize(canvas)
          fullText += text + '\n\n'
        }
        await worker.terminate()
      }

      return fullText
    } catch (err) {
      throw new Error(`Failed to extract text from PDF: ${err.message}`)
    }
  }

  const handleProcess = async () => {
    if (!file) {
      setError('Please select a PDF file first')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const extractedText = await extractTextFromPDF(file)

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted. The PDF might be an image with unreadable text.')
      }

      const { parseResumeText } = await import('../utils/resumeParser')
      const parsedResume = parseResumeText(extractedText)

      onResumeParsed(parsedResume)
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
            Upload your resume PDF. If your PDF is a scan, we'll use OCR to extract the information.
          </p>

          <div className="file-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="file-input"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className={`file-upload-label ${file ? 'has-file' : ''}`}>
              <div className="upload-icon">📄</div>
              <div>
                {file ? (
                  <span className="file-name">{file.name}</span>
                ) : (
                  <>
                    <span className="upload-text">Click to upload or drag and drop</span>
                    <span className="upload-hint">PDF files only (Max 10MB)</span>
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

          {error && <div className="error-message">{error}</div>}

          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Processing your resume... This may take a moment (OCR Fallback enabled).</p>
            </div>
          )}
        </div>

        <div className="ai-resume-modal-footer">
          <button className="btn btn-secondary" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleProcess} disabled={!file || isProcessing}>
            {isProcessing ? 'Extracting...' : 'Extract & Parse Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIResumeModal
