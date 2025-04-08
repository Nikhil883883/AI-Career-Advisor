import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/ai-background.png';

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div 
      className="layout-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      {/* Semi-transparent overlay for better readability */}
      <div className="content-overlay"></div>
      
      <header className="layout-header">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <img 
              src={logo} 
              alt="CareerAI Logo" 
              className="layout-logo" 
            />
          </Link>
          
          <nav className="layout-nav">
            <ul>
              <li>
                <Link 
                  to="/recommendation/" 
                  className={`nav-link ${isActive('/recommendation/')}`}
                >
                  Career Recommendations
                </Link>
              </li>
              <li>
                <Link 
                  to="/jobs/" 
                  className={`nav-link ${isActive('/jobs/')}`}
                >
                  Job Trends
                </Link>
              </li>
              <li>
                <Link 
                  to="/chat/" 
                  className={`nav-link ${isActive('/chat/')}`}
                >
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link 
                  to="/vet-resume/" 
                  className={`nav-link ${isActive('/vet-resume/')}`}
                >
                  Resume Analysis
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="layout-footer">
        <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;