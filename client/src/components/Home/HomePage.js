import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
const HomePage = () => {
  const navigate=useNavigate();
  const handleClick1= () => {
      navigate('/update');
  }
  const handleClick2= () => {
    navigate('./');
}
const handleClick3= () => {
  navigate('./');
}
const handleClick4= () => {
  navigate('./');
}
  return (

    <div className="homepage">
    <div className='container1'>
      <div className="sidebar">
          <h1>Alerts</h1>
          <p>eferrrrtrtyryty67u678u</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
          <p>trytiuyilioupp'p1</p>
      </div>
      <div className='main-content'>
      <div className="button-bar">
        <button type="button" onClick={handleClick1}>DisasterUpdate</button>
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
