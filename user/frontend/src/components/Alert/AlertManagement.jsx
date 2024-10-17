import React, { useState } from 'react';
import AddAlert from './AddAlert';
import DeactivateAlert from './DeactivateAlert';
import SliderButton from './SliderButton'; // Import the SliderButton
import './AlertManagement.css'; // Import the CSS for styling

const AlertManagement = () => {
  const [isAddAlertActive, setIsAddAlertActive] = useState(false); // True means "Add Alert"

  const handleToggle = () => {
    setIsAddAlertActive((prev) => !prev); // Toggle the state
  };

  return (
    <div className="alert-management-wrapper">
      <div className="alert-management-toggle-container">
        {/* Highlight the active label based on the state */}
        <span className={`label ${!isAddAlertActive ? 'active' : ''}`}>Deactivate Alert</span>
        <SliderButton isActive={isAddAlertActive} onToggle={handleToggle} />
        <span className={`label ${isAddAlertActive ? 'active' : ''}`}>Add Alert</span>
      </div>

      <div className="alert-management-content">
        {/* Conditional Rendering of components */}
        {isAddAlertActive ? <AddAlert /> : <DeactivateAlert />}
      </div>
    </div>
  );
};

export default AlertManagement;
