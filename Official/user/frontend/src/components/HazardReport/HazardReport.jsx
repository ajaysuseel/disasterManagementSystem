// src/components/Report.js
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { Pie } from 'react-chartjs-2';
import './HazardReport.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const HazardReport = () => {
  const [hazardData, setHazardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterType, setFilterType] = useState(''); // To hold the selected filter type
  const [filterValue, setFilterValue] = useState(''); // To hold the input value for filtering

  // Fetch hazard data from the API
  useEffect(() => {
    const fetchHazardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hreport');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setHazardData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHazardData();
  }, []);

  // Extract unique hazard types correctly
  const hazardTypes = [...new Set(hazardData.map(item => item.hazard_type))]; // Updated to hazard_type
  const locations = [...new Set(hazardData.map(item => `${item.hazard_loc_x}, ${item.hazard_loc_y}`))]; // Unique locations
  const wards = [...new Set(hazardData.map(item => item.hazard_ward))]; // Unique wards

  // Apply filters to the hazard data
  const filteredData = hazardData.filter((hazard) => {
    if (!filterType || !filterValue) return true; // No filter applied
    const { hazard_type, incident_date, hazard_loc_x, hazard_loc_y, hazard_ward } = hazard;

    switch (filterType) {
      case 'type':
        return hazard_type.toLowerCase() === filterValue.toLowerCase();
      case 'date':
        return new Date(incident_date).toLocaleDateString() === new Date(filterValue).toLocaleDateString();
      case 'location':
        return `${hazard_loc_x}, ${hazard_loc_y}` === filterValue; // Compare formatted location
      case 'ward':
        return hazard_ward === filterValue; // Compare hazard_ward directly
      default:
        return true;
    }
  });

  // Prepare data for the pie chart
  const hazardTypesCount = filteredData.reduce((acc, hazard) => {
    const type = hazard.hazard_type;
    acc[type] = (acc[type] || 0) + 1; // Count occurrences of each hazard type
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(hazardTypesCount),
    datasets: [
      {
        label: 'Hazards by Type',
        data: Object.values(hazardTypesCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Display loading, error, or data
  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}. Please try reloading the page.</p>;
  }

  return (
    <div className="report-main">
      <Navbar />
      <div className="report">
        <div className="sidebar-filter">
          <h3>Filters</h3>
          <div>
            <label>
              Filter by:
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Select filter</option>
                <option value="type">Hazard Type</option>
                <option value="date">Date</option>
                <option value="location">Location</option>
                <option value="ward">Ward</option> {/* Added Ward Filter */}
              </select>
            </label>
          </div>
          <div>
            <label>
              Value:
              {filterType === 'date' ? (
                <input 
                  type="date" 
                  value={filterValue} 
                  onChange={(e) => setFilterValue(e.target.value)} 
                />
              ) : (
                <select value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
                  <option value="">Select value</option>
                  {filterType === 'type' && hazardTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  {filterType === 'location' && locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                  {filterType === 'ward' && wards.map((ward) => (
                    <option key={ward} value={ward}>{ward}</option> // Displaying as "Ward 1", "Ward 2", etc.
                  ))}
                </select>
              )}
            </label>
          </div>
        </div>
        
        <div className="report-container">
          <h1>Hazard Report</h1>

          {/* Display the pie chart */}
          <div className="chart-container">
            <h2>Hazard Types Distribution</h2>
            <Pie data={pieData} />
          </div>

          {/* Display the table */}
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Number of people affected</th>
                <th>Ward</th> {/* Added Ward Column */}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7">No data available</td> {/* Adjusted colspan */}
                </tr>
              ) : (
                filteredData.map((hazard) => (
                  <tr key={hazard.hazard_id}>
                    <td>{hazard.hazard_id}</td>
                    <td>{hazard.hazard_type}</td>
                    <td>
                      {hazard.hazard_loc_x}, {hazard.hazard_loc_y}
                    </td>
                    <td>{new Date(hazard.incident_date).toLocaleDateString()}</td>
                    <td>{hazard.losses.toLocaleString()}</td>
                    <td>{hazard.hazard_ward}</td> {/* Displaying Ward as "Ward 1", "Ward 2", etc. */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HazardReport;
