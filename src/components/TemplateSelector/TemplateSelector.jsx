import React, { useState } from 'react';
import './TemplateSelector.css';
import { allResumeTemplates } from '../../Config-Data';

function TemplateSelector({ onSelect }) {
  const templateKeys = Object.keys(allResumeTemplates);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTemplate = () => {
    setCurrentIndex((prev) => (prev + 1) % templateKeys.length);
  };

  const prevTemplate = () => {
    setCurrentIndex((prev) => (prev - 1 + templateKeys.length) % templateKeys.length);
  };

  const currentTemplateKey = templateKeys[currentIndex];
  const template = allResumeTemplates[currentTemplateKey];

  return (
    <div className="template-selector-container">
      <div className="carousel-wrapper">
        <button className="carousel-control prev" onClick={prevTemplate} aria-label="Previous template">
          ❮
        </button>
        
        <div className="carousel-content">
          <div className="template-image-container">
            <img 
              src={template.image} 
              alt={template.name} 
              className="template-display-image"
            />
          </div>
          
          <div className="template-info">
            <h3>{template.name}</h3>
            <p>{template.description}</p>
            <button 
              className="btn btn-primary select-template-btn"
              onClick={() => onSelect(currentTemplateKey)}
            >
              Select This Template
            </button>
          </div>
        </div>

        <button className="carousel-control next" onClick={nextTemplate} aria-label="Next template">
          ❯
        </button>
      </div>
      
      <div className="carousel-indicators">
        {templateKeys.map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;

