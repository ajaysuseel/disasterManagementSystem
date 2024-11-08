import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './Home.css';

const ResidentHomePage = () => {
  const navigate = useNavigate();
  const { email, name, setEmail } = useUser();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [alerts, setAlerts] = useState(() => {
    // Initialize alerts from localStorage on first load
    const savedAlerts = localStorage.getItem('alerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Effect to handle user authentication and alert fetching interval
  useEffect(() => {
    if (!email) {
      navigate('/home'); // Redirect if email is not available
    } else {
      fetchWardAndAlerts(); // Fetch ward and initial alerts
      const intervalId = setInterval(fetchAlerts, 30000); // Fetch alerts every 30 seconds
      return () => clearInterval(intervalId); // Clear interval on unmount
    }
  }, [email, navigate]);

  // Function to fetch the ward and alerts for the user
  const fetchWardAndAlerts = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`http://localhost:5000/api/ward?email=${email}`);
      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.message || 'Failed to fetch user data.');
      }

      const ward = userData.ward;
      fetchAlerts(ward); // Fetch alerts based on the ward
    } catch (error) {
      console.error('Error fetching ward:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch alerts based on the ward
  const fetchAlerts = async (ward) => {
    if (!ward) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const alertResponse = await fetch(`http://localhost:5000/api/ralerts?ward=${ward}`);
      const data = await alertResponse.json();

      if (!alertResponse.ok) {
        throw new Error(data.message || 'Failed to fetch alerts.');
      }

      setAlerts(data);
      localStorage.setItem('alerts', JSON.stringify(data)); // Store alerts in localStorage
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuVisible((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('alerts'); // Clear alerts from localStorage on logout
    setEmail('');
    navigate('/');
  };

  return (
    <div className="resident-homepage">
      <div className="resident-sidebar-container">
        <div className="resident-profile-header">
          <h2>{name || 'Resident'}</h2>
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
        <h1>Welcome, {name || 'Resident'}!</h1>

        {loading ? (
          <p>Loading alerts...</p>
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : (
          <div className="alerts-container">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.alert_id} className="alert-box">
                  <p>{alert.alert_message}</p>
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
