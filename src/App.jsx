import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppV05 from './versions/v0.5/App'
import AppV04 from './versions/v0.4/App'
import AppV03 from './versions/v0.3/App'
import AppV02 from './versions/v0.2/App'
import AppV01 from './versions/v0.1/App'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/v0.5" replace />} />
        <Route path="/v0.5" element={<AppV05 />} />
        <Route path="/v0.4" element={<AppV04 />} />
        <Route path="/v0.3" element={<AppV03 />} />
        <Route path="/v0.2" element={<AppV02 />} />
        <Route path="/v0.1" element={<AppV01 />} />
        <Route path="*" element={<Navigate to="/v0.5" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
