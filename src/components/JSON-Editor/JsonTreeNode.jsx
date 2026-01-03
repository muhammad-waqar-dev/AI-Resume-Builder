import React, { useState } from 'react';

const JsonTreeNode = ({ label, value, isLast = true }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const renderValue = () => {
    if (value === null) return <span className="json-value-null">null</span>;
    if (typeof value === 'string') return <span className="json-value-string">"{value}"</span>;
    if (typeof value === 'number') return <span className="json-value-number">{value}</span>;
    if (typeof value === 'boolean') return <span className="json-value-boolean">{value.toString()}</span>;
    return null;
  };

  if (!isObject) {
    return (
      <div className="json-tree-node">
        {label && <span className="json-key">"{label}": </span>}
        {renderValue()}
        {!isLast && <span className="json-comma">,</span>}
      </div>
    );
  }

  const items = isArray ? value : Object.entries(value);
  const isEmpty = items.length === 0;
  const bracketOpen = isArray ? '[' : '{';
  const bracketClose = isArray ? ']' : '}';

  return (
    <div className={`json-tree-node ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="json-node-header" onClick={toggleExpand}>
        <span className={`json-toggle-icon ${isEmpty ? 'empty' : ''}`}>
          {!isEmpty && (isExpanded ? '▼' : '▶')}
        </span>
        {label && <span className="json-key">"{label}": </span>}
        <span className="json-bracket">{bracketOpen}</span>
        {!isExpanded && (
          <span className="json-collapsed-placeholder">
            {isArray ? ` ... ${value.length} items ... ` : ' ... '}
          </span>
        )}
        {!isExpanded && <span className="json-bracket">{bracketClose}</span>}
        {!isExpanded && !isLast && <span className="json-comma">,</span>}
      </div>

      {isExpanded && !isEmpty && (
        <div className="json-node-children">
          {isArray
            ? value.map((item, index) => (
                <JsonTreeNode
                  key={index}
                  value={item}
                  isLast={index === value.length - 1}
                />
              ))
            : Object.entries(value).map(([key, val], index, arr) => (
                <JsonTreeNode
                  key={key}
                  label={key}
                  value={val}
                  isLast={index === arr.length - 1}
                />
              ))}
        </div>
      )}

      {isExpanded && (
        <div className="json-node-footer">
          <span className="json-bracket">{bracketClose}</span>
          {!isLast && <span className="json-comma">,</span>}
        </div>
      )}
    </div>
  );
};

export default JsonTreeNode;

