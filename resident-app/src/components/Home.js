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
    console.log('Loaded alerts from localStorage:', savedAlerts); // Debug log
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  const [loading, setLoading] = useState(true); // Start with loading state as true
  const [errorMessage, setErrorMessage] = useState('');

  // Effect to handle user authentication and alert fetching interval
  useEffect(() => {
    if (!email) {
      navigate('/home'); // Redirect if email is not available
    } else {
      // Fetch alerts when component mounts or email changes
      fetchWardAndAlerts();

      // Set interval for fetching new alerts every 30 seconds
      const intervalId = setInterval(() => {
        if (email) {
          fetchWardAndAlerts(); // Fetch alerts every 30 seconds
        }
      }, 30000); // Fetch alerts every 30 seconds

      return () => clearInterval(intervalId); // Clear interval on unmount
    }
  }, [email, navigate]);

  // Function to fetch the ward and alerts for the user
  const fetchWardAndAlerts = async () => {
    setLoading(true); // Start loading when fetch begins
    setErrorMessage(''); // Clear previous error message

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
      setLoading(false); // Stop loading on error
    }
  };

  // Function to fetch alerts based on the ward
  const fetchAlerts = async (ward) => {
    if (!ward) return;

    setLoading(true); // Start loading when fetching alerts

    try {
      const alertResponse = await fetch(`http://localhost:5000/api/ralerts?ward=${ward}`);
      const data = await alertResponse.json();

      if (!alertResponse.ok) {
        throw new Error(data.message || 'Failed to fetch alerts.');
      }

      console.log('Fetched alerts:', data); // Debug log to check fetched alerts

      // Filter out any duplicate alerts by checking alert_id
      const uniqueAlerts = [
        ...new Map(data.map(alert => [alert.alert_id, alert])).values()
      ];

      setAlerts(uniqueAlerts); // Set fetched alerts to state
      localStorage.setItem('alerts', JSON.stringify(uniqueAlerts)); // Persist alerts to localStorage
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };

  const toggleMenu = () => setIsMenuVisible((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('alerts'); // Clear alerts from localStorage on logout
    setEmail(''); // Reset the email in context
    navigate('/'); // Navigate to the homepage
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
                
                <button className="resident-logout-button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="resident-main-content">
        <h1>Welcome, {name || 'Resident'}!</h1>

        {loading ? (
          <p>Loading alerts...</p> // Display loading message when loading is true
        ) : errorMessage ? (
          <p className="error-message">{errorMessage}</p> // Display error message if any
        ) : (
          <div className="alerts-container">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.alert_id} className="alert-box">
                  <p>{alert.alert_message}</p>
                </div>
              ))
            ) : (
              <p>No active alerts in your ward.</p> // Display message if no active alerts
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentHomePage;
