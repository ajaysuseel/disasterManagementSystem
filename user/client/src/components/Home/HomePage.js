import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick1 = () => {
    navigate('/update');
  };

  const handleClick2 = () => {
    navigate('/mapping');
  };

  const handleClick3 = () => {
    navigate('/report');
  };

  const handleClick4 = () => {
    navigate('/help');
  };

  // Sample alerts based on Kerala's common disasters
  const alerts = [
    { title: 'Heavy Rain Warning', description: 'Heavy rainfall expected in Idukki district. Residents are advised to stay alert and avoid unnecessary travel.' },
    { title: 'Landslide Alert', description: 'A landslide has been reported in Wayanad. Authorities are monitoring the situation and advise caution in the area.' },
    { title: 'Flood Alert', description: 'Flooding is expected in the Alappuzha district due to continuous rain. Evacuation plans are in place for vulnerable areas.' },
    { title: 'Cyclone Warning', description: 'A cyclone is forming off the coast of Kerala. Residents are advised to secure their properties and prepare for possible evacuations.' },
    { title: 'Heatwave Advisory', description: 'Temperatures are expected to rise above normal levels in several districts. Stay hydrated and avoid outdoor activities during peak hours.' }
  ];

  return (
    <div className="homepage">
      <div className='container1'>
        <div className="sidebar">
          <h1>Alerts</h1>
          {alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
            </div>
          ))}
        </div>
        <div className='main-content'>
          <div className="button-bar">
            <button type="button" onClick={handleClick1}>Disaster Update</button>
            <button type="button" onClick={handleClick2}>Disaster Mapping</button>
            <button type="button" onClick={handleClick3}>Disaster Report</button>
            <button type="button" onClick={handleClick4}>Help</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
