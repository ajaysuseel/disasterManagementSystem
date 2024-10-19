// src/components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useUser } from '../../UserContext'; // Import useUser hook

const Navbar = () => {
  const navigate = useNavigate();
  const { setUsername } = useUser(); // Get setUsername from context to clear username on logout

  const handleLogout = () => {
    localStorage.removeItem('username'); // Clear username from local storage
    localStorage.removeItem('token'); // Clear any token (if you're using tokens)
    setUsername(''); // Clear the username from context
    navigate('/'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <a href="#" onClick={() => navigate('/update')} className="navbar-item">Disaster Update</a>
        <a href="#" onClick={() => navigate('/report')} className="navbar-item">Disaster Report</a>
        <a href="#" onClick={() => navigate('/help')} className="navbar-item">Help</a>
        <a href="#" onClick={handleLogout} className="navbar-item logout-button">Logout</a>
      </div>
    </nav>
  );
};

export default Navbar;
