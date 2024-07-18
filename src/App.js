import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Ocr from './Ocr';
import Analysis from './Analysis';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ocr />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  );
}

export default App;
