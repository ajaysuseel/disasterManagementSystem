// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext'; // Import the useUser hook
import Alerts from './Alerts';
import './homepage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { username, setUsername } = useUser(); // Get username and setUsername from context
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    // Removed token check and navigation logic
    if (!username) {
      navigate('/'); // Navigate to login if username is not available
    }
  }, [navigate, username]);

  const toggleMenu = () => {
    setIsMenuVisible(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(''); // Clear username from context on logout
    navigate('/'); // Navigate to the home page or login page after logout
  };

  return (
    <div className="homepage">
      <div className="sidebar-container">
        <div className="profile-header">
          <h2>{username || 'Guest'}</h2> {/* Display username from context */}
          <button className="toggle-button" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuVisible ? '✖' : '☰'}
          </button>
        </div>

        <Alerts />

        {isMenuVisible && (
          <div className="hamburger-overlay">
            <div className="hamburger-menu">
              <button className="close-button" onClick={toggleMenu} aria-label="Close Menu">
                ✖
              </button>
              <div className="menu-buttons">
                <button type="button" onClick={() => navigate('/update')}>Disaster Update</button>
                <button type="button" onClick={() => navigate('/report')}>Disaster Report</button>
                <button type="button" onClick={() => navigate('/help')}>Help</button>
                <button type="button" onClick={() => navigate('/alert')}>Alerts</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="main-content">
        <h1>Welcome to the Disaster Management System</h1>
      </div>
    </div>
  );
};

export default HomePage;
