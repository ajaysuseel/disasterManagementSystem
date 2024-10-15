import React, { useState, useEffect } from 'react';
import './report.css'; // Optional: You can style the component using a CSS file

const Report = () => {
  const [disasterData, setDisasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch disaster data from the API
  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/report'); // Adjust API URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data); // Log the data to inspect its structure
        setDisasterData(data); // Store the disaster data in the state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterData();
  }, []);

  // Display loading, error, or data
  if (loading) {
    return <p>Loading data...</p>; // Consider using a spinner or loading animation here
  }

  if (error) {
    return <p>Error: {error}. Please try reloading the page.</p>;
  }

  return (
    <div className="report-container">
      <h1>Disaster Report</h1>
      <table className="report-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Location</th>
            <th>Date</th>
            <th>Losses (₹)</th>
            <th>Area Coverage (sq km)</th>
          </tr>
        </thead>
        <tbody>
          {disasterData.length === 0 ? (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          ) : (
            disasterData.map((disaster) => (
              <tr key={disaster.disaster_id}>
                <td>{disaster.disaster_id}</td>
                <td>{disaster.disaster_type}</td>
                <td>{disaster.disaster_loc.x},{disaster.disaster_loc.y}</td>
                <td>{new Date(disaster.incident_date).toLocaleDateString()}</td>
                <td>{disaster.losses.toLocaleString()}</td>
                <td>{disaster.area_coverage.toLocaleString()}</td> {/* Format area coverage */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
