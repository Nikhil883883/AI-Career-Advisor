import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Home from './pages/Home';
import CareerRecommendation from './pages/CareerRecommendation';
import JobMarketTrends from './pages/JobMarketTrends';
import ResumeVetter from './pages/resumevetter';
import InteractiveChat from './pages/InteractiveChat';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/recommendation/" element={<CareerRecommendation />} />
          <Route path="/jobs/" element={<JobMarketTrends />} />
          <Route path="/chat/" element={<InteractiveChat />} />
          <Route path="//vet-resume/" element={<ResumeVetter />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
