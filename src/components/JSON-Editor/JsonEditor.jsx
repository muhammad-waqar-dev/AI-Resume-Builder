import React, { useState, useEffect } from 'react';
import './JsonEditor.css';

function JsonEditor({ data, onChange }) {
  const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only update if the parsed data is different to avoid cursor jump
    try {
      const currentData = JSON.parse(jsonText);
      if (JSON.stringify(currentData) !== JSON.stringify(data)) {
        setJsonText(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setJsonText(JSON.stringify(data, null, 2));
    }
  }, [data]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setJsonText(newText);
    try {
      const parsed = JSON.parse(newText);
      setError(null);
      onChange(parsed);
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError('Cannot format: Invalid JSON');
    }
  };

  return (
    <div className="json-editor-container">
      <div className="json-editor-header">
        <h3>JSON Editor</h3>
        <button className="btn btn-sm btn-secondary" onClick={formatJson}>
          Format JSON
        </button>
      </div>
      <div className="json-editor-content">
        <textarea
          className={`json-textarea ${error ? 'has-error' : ''}`}
          value={jsonText}
          onChange={handleTextChange}
          spellCheck="false"
        />
        {error && <div className="json-error-msg">{error}</div>}
      </div>
    </div>
  );
}

export default JsonEditor;

