import React, { useState } from 'react';
import './DisasterUpdate.css';

const DisasterUpdate = () => {
  // Define initial form data values with empty strings
  const initialFormData = {
    disaster_type: 'flood', // Default value for the dropdown
    disaster_ward: '1',     // Default value for the ward dropdown
    disaster_loc: '',       // Set to an empty string
    incident_date: '',
    losses: '',
    area_coverage: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Update form data when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to reset the form
  const handleReset = () => {
    setFormData(initialFormData); // Reset form data to initial state
  };

  const handleSubmit = async () => {
    try {
      const [longitude, latitude] = formData.disaster_loc.split(',').map(coord => parseFloat(coord.trim()));
  
      // Validate latitude and longitude
      if (isNaN(latitude) || isNaN(longitude)) {
        alert('Please enter valid latitude and longitude values.');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/disaster-update', {
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
        handleReset(); // Optional: Reset the form after successful submission
      } else {
        alert('Error submitting update');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div className='updatePage'>
      <div className="container2">
        <h1>Disaster Update</h1>
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="disaster_type">Disaster Type</label>
          <select 
            name="disaster_type" 
            id="disaster" 
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
            id="ward" 
            value={formData.disaster_ward} 
            onChange={handleChange}
          >
            {/* You can replace these options with actual ward data */}
            <option value="1">Ward 1</option>
            <option value="2">Ward 2</option>
            <option value="3">Ward 3</option>
            <option value="4">Ward 4</option>
            <option value="5">Ward 5</option>
          </select>

          <label htmlFor="disaster_loc">Disaster Location</label>
          <input 
            type="text" 
            placeholder="longitude,latitude" 
            name="disaster_loc" 
            value={formData.disaster_loc} // Keep it as an empty string
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
  );
};

export default DisasterUpdate;
