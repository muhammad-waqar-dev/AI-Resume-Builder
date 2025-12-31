# React Resume Builder

A modern, feature-rich React application for building professional resumes with CRUD functionality and PDF export capabilities.

## Features

- ✏️ **Full CRUD Operations**: Create, Read, Update, and Delete all resume sections
- 📄 **Professional Resume Sections**:
  - Personal Information
  - Work Experience
  - Projects
  - Education
  - Skills
  - Certifications
  - Soft Skills
  - Languages
- 👁️ **Live Preview**: Real-time preview of your resume
- 📥 **PDF Export**: Download your resume as a high-quality PDF
- 🎨 **Modern UI**: Clean and intuitive user interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. **Edit Resume**: Click on "Edit Resume" tab to fill in your information
2. **Add Sections**: Use the "Add" buttons to add multiple entries for Work Experience, Projects, Education, etc.
3. **Preview**: Switch to "Preview" tab to see how your resume looks
4. **Download PDF**: Click "Download as PDF" button to export your resume

## Project Structure

```
src/
├── components/
│   ├── forms/          # Form components for each section
│   ├── ResumeForm.jsx  # Main form container
│   └── ResumePreview.jsx # Resume preview component
├── App.jsx             # Main application component
├── App.css            # Application styles
└── main.jsx           # Application entry point
```

## Technologies Used

- React 18
- Vite
- jsPDF
- html2canvas

## License

MIT

