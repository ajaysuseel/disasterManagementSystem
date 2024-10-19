// src/components/ResidentHomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import the useUser hook
import './Home.css'; // New CSS file for resident-specific styles

const ResidentHomePage = () => {
  const navigate = useNavigate();
  const { email, name, setEmail } = useUser(); // Get email and name from context
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [alerts, setAlerts] = useState([]); // State to hold active alerts
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  useEffect(() => {
    if (!email) {
      navigate('/home'); // Navigate to login if email is not available
    } else {
      fetchWard(); // Fetch ward using email when available
      const intervalId = setInterval(fetchAlerts, 10000); // Fetch alerts every 30 seconds
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [navigate, email]);

  // Function to fetch the user's ward based on email
  const fetchWard = async () => {
    setLoading(true);
    setErrorMessage(''); // Reset error message
    try {
      const response = await fetch(`http://localhost:5000/api/ward?email=${email}`); // Fetch user data using email
      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.message || 'Failed to fetch user data.');
      }

      const ward = userData.ward; // Assuming userData has a ward property
      fetchAlerts(ward); // Fetch alerts for the fetched ward
    } catch (error) {
      console.error('Error fetching ward:', error);
      setErrorMessage(error.message); // Set error message for display
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch active alerts for the specified ward
  const fetchAlerts = async () => {
    if (!email) return; // Return early if email is not available

    setLoading(true);
    setErrorMessage(''); // Reset error message
    try {
      const response = await fetch(`http://localhost:5000/api/ward?email=${email}`); // Fetch user data to get ward
      const userData = await response.json();
      const ward = userData.ward; // Assuming userData has a ward property

      const alertResponse = await fetch(`http://localhost:5000/api/ralerts?ward=${ward}`); // Fetch alerts for the specified ward
      const data = await alertResponse.json();

      if (!alertResponse.ok) {
        throw new Error(data.message || 'Failed to fetch alerts.');
      }

      setAlerts(data); // Set the fetched alerts
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setErrorMessage(error.message); // Set error message for display
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuVisible(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setEmail(''); // Clear email from context on logout
    navigate('/'); // Navigate to the login page after logout
  };

  return (
    <div className="resident-homepage">
      <div className="resident-sidebar-container">
        <div className="resident-profile-header">
          <h2>{name || 'Resident'}</h2> {/* Display name from context */}
          <button className="resident-toggle-button" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuVisible ? '✖' : '☰'}
          </button>
        </div>

        {isMenuVisible && (
          <div className="resident-hamburger-overlay">
            <div className="resident-hamburger-menu">
              <button className="resident-close-button" onClick={toggleMenu} aria-label="Close Menu">
                ✖
              </button>
              <div className="resident-menu-buttons">
                <button type="button" onClick={() => navigate('/emergency-help')}>Emergency Help</button>
                <button className="resident-logout-button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="resident-main-content">
        <h1>Welcome, {name || 'Resident'}!</h1> {/* Use name instead of email */}

        {loading ? (
          <p>Loading alerts...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p> // Display error message
        ) : (
          <div className="alerts-container">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert.alert_id} className="alert-box"> {/* Ensure alert.id is unique */}
                  <p>{alert.alert_message}</p> {/* Display the description of each alert */}
                </div>
              ))
            ) : (
              <p>No active alerts in your ward.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentHomePage;
