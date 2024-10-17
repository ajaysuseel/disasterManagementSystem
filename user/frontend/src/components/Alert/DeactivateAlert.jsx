import React, { useState, useEffect } from 'react';
import './DeactivateAlert.css';

const DeactivateAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch active alerts from the server
    const fetchAlerts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/alerts/active');
        const data = await response.json();

        // Check if data is an array before setting the alerts state
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setAlerts([]); // Optionally, set to an empty array if the data is not an array
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  const handleDeactivate = async (alertId) => {
    if (window.confirm('Are you sure you want to deactivate this alert?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/alerts/${alertId}/deactivate`, {
          method: 'PUT',
        });

        if (response.ok) {
          alert('Alert deactivated successfully!');
          setAlerts(alerts.filter(alert => alert.alert_id !== alertId));
        } else {
          alert('Error deactivating alert');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="dealert-container">
      <h2 className="dealert-heading">Deactivate Alert</h2>
      {alerts.length === 0 ? (
        <p>No active alerts to deactivate.</p>
      ) : (
        <table className="dealert-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Ward</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.alert_id}>
                <td>{alert.alert_type}</td>
                <td>{alert.alert_ward}</td>
                <td>{new Date(alert.created_at).toLocaleString()}</td>
                <td>
                  <button 
                    className="dealert-deactivate-button"
                    onClick={() => handleDeactivate(alert.alert_id)}
                  >
                    &#10060; {/* Cross mark (Unicode) */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeactivateAlert;
