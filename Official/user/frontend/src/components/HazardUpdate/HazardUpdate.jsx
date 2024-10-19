import React, { useState } from 'react';
import './HazardUpdate.css';
import Navbar from '../Navbar/Navbar'

const HazardUpdate = () => {
  // Define initial form data values with empty strings
  const initialFormData = {
    hazard_type: '', // Default value for the dropdown
    hazard_ward: '',     // Default value for the ward dropdown
    hazard_loc: '',       // Set to an empty string
    incident_date: '',
    losses:'',
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
      const [longitude, latitude] = formData.hazard_loc.split(',').map(coord => parseFloat(coord.trim()));
  
      // Validate latitude and longitude
      if (isNaN(latitude) || isNaN(longitude)) {
        alert('Please enter valid latitude and longitude values.');
        return;
      }
  
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
        handleReset(); // Optional: Reset the form after successful submission
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
            id="hazard" 
            value={formData.hazard_type} 
            onChange={handleChange}
          >
            <option value="firecatching">Fire Catching</option>
            <option value="roadaccident">Road Accident</option>
            <option value="gasleakage">Gas Leakage</option>
            <option value="shortcircuit">Short Circuit</option>
            <option value="chemicalspills">Chemical Spills</option>
          </select>

          <label htmlFor="hazard_ward">Hazard Ward</label>
          <select 
            name="hazard_ward" 
            id="ward" 
            value={formData.hazard_ward} 
            onChange={handleChange}
          >
            {/* You can replace these options with actual ward data */}
            <option value="ward1">Ward 1</option>
            <option value="ward2">Ward 2</option>
            <option value="ward3">Ward 3</option>
            <option value="ward4">Ward 4</option>
            <option value="ward5">Ward 5</option>
            <option value="ward6">Ward 6</option>
            <option value="ward7">Ward 7</option>
            <option value="ward8">Ward 8</option>
            <option value="ward9">Ward 9</option>
            <option value="ward10">Ward 10</option>
            <option value="ward11">Ward 11</option>
            <option value="ward12">Ward 12</option>
            <option value="ward13">Ward 13</option>
            <option value="ward14">Ward 14</option>
            <option value="ward15">Ward 15</option>
            <option value="ward16">Ward 16</option>
            <option value="ward17">Ward 17</option>
            <option value="ward18">Ward 18</option>
            <option value="ward19">Ward 19</option>
            <option value="ward20">Ward 20</option>
            <option value="ward21">Ward 21</option>
          </select>

          <label htmlFor="hazard_loc">Hazard Location</label>
          <input 
            type="text" 
            placeholder="longitude,latitude" 
            name="hazard_loc" 
            value={formData.hazard_loc} // Keep it as an empty string
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
            placeholder="0.00" 
            name="losses" 
            step="0.01" 
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
