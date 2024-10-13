import React, { useState } from 'react';
import './DisasterUpdate.css';

const DisasterUpdate = () => {
  // Define initial form data values
  const initialFormData = {
    disaster_id: '',
    disaster_type: 'flood',
    disaster_loc: '',
    incident_date: '',
    losses: 0,
    area_coverage: 0,
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

  // Function to submit the form
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/disaster-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Disaster update submitted successfully!');
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
          <label htmlFor="disaster_id">Disaster ID</label>
          <input 
            type="text" 
            placeholder="Enter ID" 
            name="disaster_id" 
            value={formData.disaster_id} 
            onChange={handleChange} 
          />

          <label htmlFor="disaster_type">Disaster Type</label>
          <select 
            name="disaster_type" 
            id="disaster" 
            value={formData.disaster_type} 
            onChange={handleChange}
          >
            <option value="flood">Flood</option>
            <option value="landslide">Landslide</option>
            <option value="tsunami">Tsunami</option>
          </select>

          <label htmlFor="disaster_loc">Disaster Location</label>
          <input 
            type="text" 
            placeholder="Place of incident" 
            name="disaster_loc" 
            value={formData.disaster_loc} 
            onChange={handleChange} 
          />

          <label htmlFor="incident_date">Date of Incident</label>
          <input 
            type="date" 
            placeholder="Select Date" 
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
