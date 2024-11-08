import React, { useState } from 'react';
import './HazardUpdate.css';
import Navbar from '../Navbar/Navbar';

const HazardUpdate = () => {
  // Define initial form data values with empty strings
  const initialFormData = {
    hazard_type: '',
    hazard_ward: '',
    hazard_loc: '',
    incident_date: '',
    losses: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  // Update form data when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to reset the form
  const handleReset = () => {
    setFormData(initialFormData);
  };

  // Handle form submission
  const handleSubmit = async () => {
    const [longitude, latitude] = formData.hazard_loc.split(',').map(coord => parseFloat(coord.trim()));

    // Validate latitude and longitude
    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Please enter valid latitude and longitude values.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/hupdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          hazard_loc: `(${longitude}, ${latitude})`,  // Format for POINT type
        }),
      });

      if (response.ok) {
        alert('Hazard update submitted successfully!');
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
      <Navbar/>
      <div className='updatePage'>
        <div className="container2">
          <h1>Hazard Update</h1>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="hazard_type">Hazard Type</label>
            <select 
              name="hazard_type" 
              value={formData.hazard_type} 
              onChange={handleChange}
            >
              <option value="">Select Hazard Type</option>
              <option value="firecatching">Fire Catching</option>
              <option value="roadaccident">Road Accident</option>
              <option value="gasleakage">Gas Leakage</option>
              <option value="shortcircuit">Short Circuit</option>
              <option value="chemicalspills">Chemical Spills</option>
            </select>

            <label htmlFor="hazard_ward">Hazard Ward</label>
            <select 
              name="hazard_ward" 
              value={formData.hazard_ward} 
              onChange={handleChange}
            >
              <option value="">Select Hazard Ward</option>
              <option value="ward1">Ward 1</option>
              <option value="ward2">Ward 2</option>
              <option value="ward3">Ward 3</option>
            <option value="ward4">Ward 4</option>
            <option value="ward5">Ward 5</option>
            <option value="ward6">Ward 6</option>
            
              
            </select>

            <label htmlFor="hazard_loc">Hazard Location</label>
            <input 
              type="text" 
              placeholder="longitude,latitude" 
              name="hazard_loc" 
              value={formData.hazard_loc}
              onChange={handleChange} 
            />

            <label htmlFor="incident_date">Date of Incident</label>
            <input 
              type="date" 
              name="incident_date" 
              value={formData.incident_date} 
              onChange={handleChange} 
            />

            <label htmlFor="losses">Number of People Affected</label>
            <input 
              type="number" 
              placeholder="0" 
              name="losses" 
              value={formData.losses} 
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

export default HazardUpdate;
