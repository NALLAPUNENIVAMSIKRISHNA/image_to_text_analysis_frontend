import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

function Analysis() {
  const location = useLocation();
  const { extractedText, userInputText, analysis } = location.state || {};

  return (
    <div className="App">
      <h1>Analysis</h1>
      <div>
        <h2>Extracted Text:</h2>
        <p>{extractedText}</p>
      </div>
      <div>
        <h2>User Input Text:</h2>
        <p>{userInputText}</p>
      </div>
      <div>
        <h2>Analysis:</h2>
        <p>{analysis}</p>
      </div>
    </div>
  );
}

export default Analysis;
