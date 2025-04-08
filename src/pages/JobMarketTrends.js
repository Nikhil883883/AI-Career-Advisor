import React, { useState } from 'react';
import axios from 'axios';
import './JobMarketTrends.css';

function JobMarketTrends() {
  const [query, setQuery] = useState('software engineer');
  const [location, setLocation] = useState('india');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/jobs/', {
        params: { query, location }
      });
      setInsights(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-market">
      <h2>AI Job Market Insights</h2>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Job title"
          required
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />
        <button disabled={loading}>
          {loading ? 'Generating Insights...' : 'Get Analysis'}
        </button>
      </form>

      {insights && (
        <div className="insights">
          <h3>Market Analysis for {insights.query} in {insights.location}</h3>
          <div className="insight-content">
            {insights.analysis.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="disclaimer">{insights.note}</p>
        </div>
      )}
    </div>
  );
}

export default JobMarketTrends;