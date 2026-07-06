import React, { useState } from 'react';
import API from './api';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [formData, setFormData] = useState({
    jobTitle: 'Full Stack Developer',
    experienceLevel: 'fresher',
    resumeSnippet: '',
    numQuestions: '5'
  });
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSessionData(null);

    try {
      const response = await API.post('/interview/generate', formData);
      setSessionData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with IBM Granite agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>AI Interview Trainer Panel</h2>
        <button onClick={onLogout} className="logout-btn">Sign Out</button>
      </header>
      
      <div style={{ marginBottom: '1.5rem', textAlign: 'left', color: '#555' }}>
        <p>Welcome back! Configure your assessment profile criteria below.</p>
      </div>

      <div className="grid-layout">
        {/* Left Side: Setup Inputs */}
        <div className="form-card">
          <h3>Configure Interview</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Target Job Title</label>
              <input 
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="select-input"
                placeholder="e.g. Data Scientist, iOS Developer, QA Engineer"
                required
              />
            </div>

            <div className="form-group">
              <label>Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="select-input">
                <option value="fresher">Fresher / Graduate</option>
                <option value="junior">Junior (1-2 yrs)</option>
                <option value="mid">Mid Level (3-5 yrs)</option>
                <option value="senior">Senior (5+ yrs)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <select name="numQuestions" value={formData.numQuestions} onChange={handleChange} className="select-input">
                <option value="3">3 Questions (Fast)</option>
                <option value="5">5 Questions (Standard)</option>
                <option value="7">7 Questions (Deep Dive)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Resume Snippet / Key Skills (Optional)</label>
              <textarea 
                name="resumeSnippet" 
                rows="4" 
                placeholder="Paste core tech stacks or resume pointers to contextualize your questions..." 
                value={formData.resumeSnippet} 
                onChange={handleChange}
                className="textarea-input"
              />
            </div>

            <button type="submit" disabled={loading} className="generate-btn">
              {loading ? 'Consulting IBM Granite...' : 'Generate Interview'}
            </button>
          </form>
        </div>

        {/* Right Side: Results Presentation */}
        <div className="results-panel">
          {error && <div className="error-banner">{error}</div>}

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <h4>Retrieving Dataset & Running Generation</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>IBM Granite is mapping reference constraints and framing questions...</p>
            </div>
          )}

          {!loading && !sessionData && (
            <div className="empty-state">
              <Sparkles size={48} color="#0f62fe" style={{ marginBottom: '1rem' }} />
              <h3>No Active Session</h3>
              <p>Select your criteria on the left to start an interactive assessment tailored via RAG.</p>
            </div>
          )}

          {!loading && sessionData && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: '#0f62fe' }}>
                Generated Questions for {sessionData.jobTitle} ({sessionData.experienceLevel})
              </h3>
              
              {sessionData.qaPairs.map((pair, idx) => (
                <div className="qa-card" key={idx}>
                  <div className="qa-header" onClick={() => toggleExpand(idx)}>
                    <span>Q{idx + 1}: {pair.question}</span>
                    {expandedIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  
                  {expandedIndex === idx && (
                    <div className="qa-body">
                      <div className="section-title">Model Answer Benchmark</div>
                      <p className="section-text">{pair.modelAnswer}</p>
                      
                      <div className="section-title" style={{ color: '#0043ce' }}>Coach's Improvement Tip</div>
                      <p className="section-text" style={{ fontStyle: 'italic', color: '#333' }}>{pair.improvementTips}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;