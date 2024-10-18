import React, { useState } from 'react';
import './AddAlert.css'; // Import the CSS file

const AddAlert = () => {
  const [alertData, setAlertData] = useState({
    alert_type: '',
    ward: '',
    description: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlertData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!alertData.alert_type || !alertData.ward || !alertData.description) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...alertData,
          is_active: true, // Set active to true in the request
        }),
      });

      if (response.ok) {
        setSuccessMessage('Alert added successfully!');
        setAlertData({
          alert_type: '',
          ward: '',
          description: '',
        }); // Clear the form fields
        setErrorMessage(''); // Clear error message

        // Show success message for 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage('Error adding alert. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="alert-container"> {/* Centering container */}
      <div className="alert-form-box"> {/* Box for the form */}
        <h2 className="alert-heading">Add Alert</h2>
        <form>
          <label className="alert-label">Alert Type</label>
          <input 
            type="text" 
            name="alert_type" 
            className="alert-input" 
            value={alertData.alert_type} 
            onChange={handleChange} 
            required 
          />

          <label className="alert-label">Ward</label>
          <select 
            name="ward" 
            id="ward" 
            value={alertData.ward} 
            onChange={handleChange} 
            className="alert-select" 
            required
          >
            {/* Ward options */}
            <option value="">Select Ward</option>
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

          <label className="alert-label">Description</label>
          <textarea 
            name="description" 
            className="alert-textarea" 
            value={alertData.description} 
            onChange={handleChange}
            required
          />

          <button type="button" className="alert-button" onClick={handleSubmit}>Submit</button>
        </form>
        {errorMessage && <p className="alert-message" style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p className="alert-message" style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default AddAlert;
