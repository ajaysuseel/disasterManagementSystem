import React from 'react';
import './SliderButton.css'; // Import the CSS for the slider button

const SliderButton = ({ isActive, onToggle }) => {
  return (
    <div className="slider-button" onClick={onToggle}>
      <div className={`slider ${isActive ? 'active' : ''}`}></div>
    </div>
  );
};

export default SliderButton;
