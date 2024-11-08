import React, { useState } from 'react';
import './DisasterUpdate.css';
import Navbar from '../Navbar/Navbar';

const DisasterUpdate = () => {
  const initialFormData = {
    disaster_type: 'flood',
    disaster_ward: 'ward1',
    disaster_loc: '',
    incident_date: '',
    losses: '',
    area_coverage: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      const [longitude, latitude] = formData.disaster_loc.split(',').map(coord => parseFloat(coord.trim()));

      // Validate latitude and longitude
      if (isNaN(latitude) || isNaN(longitude)) {
        alert('Please enter valid latitude and longitude values.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          disaster_loc: `(${longitude}, ${latitude})`,  // Format for POINT type
        }),
      });

      if (response.ok) {
        alert('Disaster update submitted successfully!');
        handleReset();
      } else {
        alert('Error submitting update');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="update-main">
      <Navbar />
      <div className='updatePage'>
        <div className="container2">
          <h1>Disaster Update</h1>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="disaster_type">Disaster Type</label>
            <select 
              name="disaster_type" 
              value={formData.disaster_type} 
              onChange={handleChange}
            >
              <option value="flood">Flood</option>
              <option value="landslide">Landslide</option>
              <option value="cyclone">Cyclone</option>
              <option value="wildfire">Wildfire</option>
              <option value="tsunami">Tsunami</option>
            </select>

            <label htmlFor="disaster_ward">Disaster Ward</label>
            <select 
              name="disaster_ward" 
              value={formData.disaster_ward} 
              onChange={handleChange}
            >
              <option value="ward1">Ward 1</option>
              <option value="ward2">Ward 2</option>
              <option value="ward3">Ward 3</option>
              <option value="ward4">Ward 4</option>
              <option value="ward5">Ward 5</option>
              <option value="ward6">Ward 6</option>
            </select>

            <label htmlFor="disaster_loc">Disaster Location</label>
            <input 
              type="text" 
              placeholder="longitude,latitude" 
              name="disaster_loc" 
              value={formData.disaster_loc} 
              onChange={handleChange} 
            />

            <label htmlFor="incident_date">Date of Incident</label>
            <input 
              type="date" 
              name="incident_date" 
              value={formData.incident_date} 
              onChange={handleChange} 
            />

            <label htmlFor="losses">Losses</label>
            <input 
              type="number" 
              placeholder="0.00" 
              name="losses" 
              step="0.01" 
              value={formData.losses} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="area_coverage">Area of Coverage</label>
            <input 
              type="number" 
              placeholder="0.00" 
              name="area_coverage" 
              step="0.01" 
              value={formData.area_coverage} 
              onChange={handleChange} 
              required 
            />

            <button type="button" onClick={handleReset}>Reset</button>
            <button type="button" onClick={handleSubmit}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisasterUpdate;
