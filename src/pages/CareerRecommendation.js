import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CareerRecommendation.css';

const CareerRecommendation = () => {
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '',
    qualification: '',
    skills: '',
    interests: '',
    workStyle: '',
    experience: '',
    subjects: '',
    hobbies: '',
    learningStyle: '',
    priority: '',
    personalityType: '',
    preferredIndustries: '',
    longTermGoal: '',
    workingHours: '',
    travelWillingness: ''
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Add PDF if exists
      if (pdfFile) {
        formDataToSend.append('resume_pdf', pdfFile);
      }
      
      // Add all form fields
      for (const key in formData) {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const res = await axios.post(
        'http://localhost:8000/career/',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResponse(res.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.detail || 
              err.response?.data?.error || 
              "Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendations = () => {
    if (!response?.recommendations) return null;
    
    return (
      <div className="recommendations">
        <h3>Your Career Recommendations</h3>
        <div className="source-info">
          <small>Analysis based on: {response.source}</small>
        </div>
        <div className="recommendation-content">
          {response.recommendations.split('\n').map((line, i) => (
            line.startsWith('###') ? (
              <h4 key={i}>{line.replace('###', '').trim()}</h4>
            ) : line.startsWith('-') ? (
              <li key={i}>{line.replace('-', '').trim()}</li>
            ) : (
              <p key={i}>{line}</p>
            )
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="career-container">
      <h2>Career Recommendation</h2>
      <p className="subtitle">Get personalized career suggestions based on your profile or resume</p>
      
      {error && <div className="error-message">⚠️ {error}</div>}

      <form onSubmit={handleSubmit}>
        {/* PDF Upload Section */}
        <div className="upload-section">
          <h3>1. Upload Your Resume (Optional)</h3>
          <div className="upload-area">
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
          <p className="note">Or fill out the form below</p>
        </div>

        {/* Form Fields Section */}
        <div className="form-section">
          <h3>2. Tell Us About Yourself</h3>
          
          <div className="form-columns">
            <div className="column">
              <label>Name (Optional):
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </label>

              <label>Age Group: *
                <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} >
                  <option value="">Select</option>
                  <option value="Under 18">Under 18</option>
                  <option value="18-22">18-22</option>
                  <option value="23-30">23-30</option>
                  <option value="31+">31+</option>
                </select>
              </label>

              <label>Highest Qualification: *
                <input type="text" name="qualification" value={formData.qualification} 
                       onChange={handleChange}  />
              </label>

              <label>Top Skills: *
                <input type="text" name="skills" value={formData.skills} 
                       onChange={handleChange}  
                       placeholder="e.g. Python, Communication, Project Management"/>
              </label>
            </div>

            <div className="column">
              <label>Interests: *
                <input type="text" name="interests" value={formData.interests} 
                       onChange={handleChange}  
                       placeholder="e.g. Technology, Healthcare, Design"/>
              </label>

              <label>Preferred Work Style: *
                <select name="workStyle" value={formData.workStyle} onChange={handleChange} >
                  <option value="">Select</option>
                  <option value="Teamwork">Teamwork</option>
                  <option value="Independent">Independent</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Structured">Structured</option>
                </select>
              </label>

              <label>Experience Level: *
                <select name="experience" value={formData.experience} onChange={handleChange} >
                  <option value="">Select</option>
                  <option value="None">No experience</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="4-7 years">4-7 years</option>
                  <option value="8+ years">8+ years</option>
                </select>
              </label>
            </div>
          </div>

          <div className="additional-fields">
            <h4>Additional Information (Optional)</h4>
            <div className="fields-grid">
              <label>
                Favorite Subjects:
                <input type="text" name="subjects" value={formData.subjects} onChange={handleChange} />
              </label>

              <label>
                Hobbies:
                <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} />
              </label>

              <label>
                Learning Style:
                <select name="learningStyle" value={formData.learningStyle} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Visual">Visual</option>
                  <option value="Reading">Reading/Writing</option>
                  <option value="Hands-on">Hands-on</option>
                  <option value="Auditory">Auditory</option>
                </select>
              </label>

              <label>
                Priority:
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Salary">High Salary</option>
                  <option value="Work-Life Balance">Work-Life Balance</option>
                  <option value="Growth">Career Growth</option>
                  <option value="Stability">Job Stability</option>
                </select>
              </label>

              <label>
                Personality Type:
                <input type="text" name="personalityType" value={formData.personalityType} 
                       onChange={handleChange} placeholder="e.g. INTJ, ENFP"/>
              </label>

              <label>
                Preferred Industries:
                <input type="text" name="preferredIndustries" value={formData.preferredIndustries} 
                       onChange={handleChange} placeholder="e.g. Tech, Healthcare, Finance"/>
              </label>

              <label>
                Long-Term Goal:
                <input type="text" name="longTermGoal" value={formData.longTermGoal} 
                       onChange={handleChange} placeholder="e.g. Become a manager, Start a business"/>
              </label>

              <label>
                Working Hours Preference:
                <select name="workingHours" value={formData.workingHours} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="9-5">Standard 9-5</option>
                  <option value="Flexible">Flexible hours</option>
                  <option value="Evenings">Evenings</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </label>

              <label>
                Willingness to Travel:
                <select name="travelWillingness" value={formData.travelWillingness} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="None">No travel</option>
                  <option value="Some">Some travel</option>
                  <option value="Extensive">Extensive travel</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? (
            <>
              <span className="spinner"></span> Analyzing...
            </>
          ) : (
            "Get Career Recommendations"
          )}
        </button>
      </form>

      {loading && !response && (
        <div className="loading-message">
          Analyzing your profile and resume...
        </div>
      )}

      {response && renderRecommendations()}
    </div>
  );
};

export default CareerRecommendation;