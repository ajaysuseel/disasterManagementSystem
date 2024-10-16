// src/components/Report.js
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar' 
import { Pie } from 'react-chartjs-2';
import './report.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Report = () => {
  const [disasterData, setDisasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filterType, setFilterType] = useState(''); // To hold the selected filter type
  const [filterValue, setFilterValue] = useState(''); // To hold the input value for filtering

  // Fetch disaster data from the API
  useEffect(() => {
    const fetchDisasterData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/report');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setDisasterData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterData();
  }, []);

  // Example filter values (these could also be fetched from the API)
  const disasterTypes = [...new Set(disasterData.map(item => item.disaster_type))]; // Unique disaster types
  const locations = [...new Set(disasterData.map(item => `${item.disaster_loc_x}, ${item.disaster_loc_y}`))]; // Unique locations
  const wards = [...new Set(disasterData.map(item => item.disaster_ward))]; // Unique wards

  // Apply filters to the disaster data
  const filteredData = disasterData.filter((disaster) => {
    if (!filterType || !filterValue) return true; // No filter applied
    const { disaster_type, incident_date, disaster_loc_x, disaster_loc_y, disaster_ward } = disaster;

    switch (filterType) {
      case 'type':
        return disaster_type.toLowerCase() === filterValue.toLowerCase();
      case 'date':
        return new Date(incident_date).toLocaleDateString() === new Date(filterValue).toLocaleDateString();
      case 'location':
        return `${disaster_loc_x}, ${disaster_loc_y}` === filterValue; // Compare formatted location
      case 'ward':
        return disaster_ward === filterValue; // Compare disaster_ward directly
      default:
        return true;
    }
  });

  // Prepare data for the pie chart
  const disasterTypesCount = filteredData.reduce((acc, disaster) => {
    const type = disaster.disaster_type;
    acc[type] = (acc[type] || 0) + 1; // Count occurrences of each disaster type
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(disasterTypesCount),
    datasets: [
      {
        label: 'Disasters by Type',
        data: Object.values(disasterTypesCount),
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
    <Navbar/>
    <div className="report">\
      <div className="sidebar-filter">
        <h3>Filters</h3>
        <div>
          <label>
            Filter by:
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Select filter</option>
              <option value="type">Disaster Type</option>
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
                {filterType === 'type' && disasterTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                {filterType === 'location' && locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
                {filterType === 'ward' && wards.map((ward) => (
                  <option key={ward} value={ward}>{ward}</option> // Display as "Ward 1", "Ward 2", etc.
                ))}
              </select>
            )}
          </label>
        </div>
      </div>
      
      <div className="report-container">
        <h1>Disaster Report</h1>

        {/* Display the pie chart */}
        <div className="chart-container">
          <h2>Disaster Types Distribution</h2>
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
              <th>Losses</th>
              <th>Area Coverage (sq km)</th>
              <th>Ward</th> {/* Added Ward Column */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7">No data available</td> {/* Adjusted colspan */}
              </tr>
            ) : (
              filteredData.map((disaster) => (
                <tr key={disaster.disaster_id}>
                  <td>{disaster.disaster_id}</td>
                  <td>{disaster.disaster_type}</td>
                  <td>
                    {disaster.disaster_loc_x}, {disaster.disaster_loc_y}
                  </td>
                  <td>{new Date(disaster.incident_date).toLocaleDateString()}</td>
                  <td>{disaster.losses.toLocaleString()}</td>
                  <td>{disaster.area_coverage.toLocaleString()}</td>
                  <td>{disaster.disaster_ward}</td> {/* Displaying Ward as "Ward 1", "Ward 2", etc. */}
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

export default Report;
