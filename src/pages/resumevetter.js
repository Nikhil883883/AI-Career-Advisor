import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './resumevetter.css';

function ResumeVetter() {
  const [resumeText, setResumeText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef();

  // Clear messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError(null);
      if (success) setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size too large (max 5MB)");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    setPdfFile(file);
    setResumeText('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setAnalysis(null);
    
    try {
      if (!resumeText && !pdfFile) {
        throw new Error("Please upload a resume or paste text");
      }

      const formData = new FormData();
      if (pdfFile) formData.append('resume_pdf', pdfFile);
      if (resumeText) formData.append('resume_text', resumeText);
      if (jobDesc) formData.append('job_description', jobDesc);
      
      // Always include all analysis types since we removed the options
      formData.append('analysis_type', JSON.stringify(["ats", "skills", "structure"]));

      const response = await axios.post('http://localhost:8000/vet-resume/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout
      });

      if (response.data.status === "success") {
        setAnalysis(response.data.data);
        setSuccess("Analysis completed successfully!");
      } else {
        throw new Error(response.data.detail || "Analysis failed");
      }
    } catch (err) {
      console.error("Vetting error:", err);
      setError(err.response?.data?.detail || err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderScoreCard = (title, score) => {
    return (
      <div className="score-card">
        <h3>{title}</h3>
        <div className="score-display">
          <span className="score">{score}</span>
          <span className="score-label">/100</span>
          <div className="score-bar">
            <div style={{ width: `${score}%` }}></div>
          </div>
          <p className="score-note">
            {score >= 80 ? "Excellent!" : 
             score >= 60 ? "Good, but can improve" : 
             "Needs significant work"}
          </p>
        </div>
      </div>
    );
  };

  const renderSkillComparison = () => {
    if (!analysis?.missing_skills?.length) return null;
    
    return (
      <div className="skill-comparison">
        <h3>🔍 Missing Skills</h3>
        <ul className="missing-skills-list">
          {analysis.missing_skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
        <p className="suggestion">
          Consider adding these skills to your resume or gaining experience with them.
        </p>
      </div>
    );
  };

  const renderImprovements = () => {
    if (!analysis?.suggested_improvements?.length) return null;
    
    return (
      <div className="improvements">
        <h3>📝 Suggested Improvements</h3>
        <ul>
          {analysis.suggested_improvements.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderAnalysisContent = () => {
    if (!analysis?.detailed_feedback) return null;
    
    return (
      <div className="analysis-content">
        <h3>📋 Detailed Feedback</h3>
        {analysis.detailed_feedback.split('\n').map((line, i) => (
          line.startsWith('##') ? (
            <h4 key={i}>{line.replace('##', '').trim()}</h4>
          ) : line.startsWith('-') ? (
            <li key={i}>{line.replace('-', '').trim()}</li>
          ) : (
            <p key={i}>{line}</p>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="resume-vetter">
      <h2>📄 AI Resume Vetter</h2>
      
      {/* Status Messages */}
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-section">
          <h3>1. Upload Your Resume</h3>
          <div className="upload-options">
            <div className="pdf-upload">
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className={pdfFile ? "active" : ""}
              >
                {pdfFile ? "Change PDF" : "Upload PDF"}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePdfUpload}
                accept=".pdf"
                hidden
              />
              {pdfFile && (
                <div className="file-info">
                  <span>{pdfFile.name}</span>
                  <span>{Math.round(pdfFile.size / 1024)} KB</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setPdfFile(null);
                      fileInputRef.current.value = '';
                    }}
                    className="clear-btn"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <p className="divider">OR</p>
            <textarea
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                if (pdfFile) setPdfFile(null);
              }}
              placeholder="Paste resume text here..."
              rows={10}
              disabled={!!pdfFile}
            />
          </div>
        </div>
        
        <div className="input-section">
          <h3>2. Target Job Description (Optional)</h3>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste job description for targeted analysis..."
            rows={5}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || (!resumeText && !pdfFile)}
          className={loading ? 'loading' : ''}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Analyzing...
            </>
          ) : (
            "Get Comprehensive Analysis"
          )}
        </button>
      </form>

      {analysis && (
        <div className="analysis-results">
          {/* Overall Score */}
          {renderScoreCard("📊 Overall Score", analysis.overall_score || 0)}

          {/* Detailed Scores */}
          <div className="detailed-scores">
            {analysis.ats_score && renderScoreCard("ATS Score", analysis.ats_score)}
            {analysis.skill_score && renderScoreCard("Skill Match", analysis.skill_score)}
            {analysis.structure_score && renderScoreCard("Structure", analysis.structure_score)}
          </div>

          {/* Skill Gap */}
          {renderSkillComparison()}

          {/* Improvements */}
          {renderImprovements()}

          {/* Detailed Analysis */}
          {renderAnalysisContent()}

          {/* Cover Letter - Now always shown if job description exists */}
          {jobDesc && analysis.cover_letter && (
            <div className="cover-letter">
              <h3>✉️ Suggested Cover Letter</h3>
              <div className="letter-content">
                {analysis.cover_letter}
              </div>
              <div className="actions">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(analysis.cover_letter);
                    setSuccess("Cover letter copied to clipboard!");
                  }}
                  className="copy-button"
                >
                  Copy to Clipboard
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([analysis.cover_letter], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'cover_letter.txt';
                    a.click();
                    setSuccess("Cover letter downloaded!");
                  }}
                  className="download-button"
                >
                  Download as TXT
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeVetter;