// src/components/Alerts.js

import React, { useEffect, useState } from 'react';
import './homepage.css'; // Ensure the CSS is imported

const Alerts = () => {
  const [alertWindowIndex, setAlertWindowIndex] = useState(0); // Index for the current set of alerts
  const alertsPerPage = 5; // Number of alerts to display at once

  // Sample alerts (30 total)
  const alerts = [
    { title: 'Heavy Rain Warning', description: 'Heavy rainfall expected in Idukki district. Residents are advised to stay alert and avoid unnecessary travel.' },
    { title: 'Landslide Alert', description: 'A landslide has been reported in Wayanad. Authorities are monitoring the situation and advise caution in the area.' },
    { title: 'Flood Alert', description: 'Flooding is expected in the Alappuzha district due to continuous rain. Evacuation plans are in place for vulnerable areas.' },
    { title: 'Cyclone Warning', description: 'A cyclone is forming off the coast of Kerala. Residents are advised to secure their properties and prepare for possible evacuations.' },
    { title: 'Heatwave Advisory', description: 'Temperatures are expected to rise above normal levels in several districts. Stay hydrated and avoid outdoor activities during peak hours.' },
    { title: 'Earthquake Alert', description: 'Seismic activity detected. Residents are advised to be prepared for possible tremors.' },
    { title: 'Drought Warning', description: 'Drought conditions expected in the Malappuram district. Water conservation measures advised.' },
    { title: 'Wildfire Alert', description: 'Increased fire risk in forested areas of Kozhikode. Open fires are prohibited.' },
    { title: 'Tsunami Warning', description: 'Tsunami waves expected along the coast. Evacuate to higher ground immediately.' },
    { title: 'Tropical Storm Alert', description: 'Tropical storm forming in the Arabian Sea. Monitor local news for updates.' },
    { title: 'Pollution Alert', description: 'High pollution levels detected in Kochi. Limit outdoor activities and wear masks.' },
    { title: 'Fishermen Advisory', description: 'High waves expected off the coast. Fishermen are advised to stay ashore.' },
    { title: 'Road Safety Advisory', description: 'Poor visibility due to fog in the morning hours. Drive cautiously.' },
    { title: 'Heat Stroke Alert', description: 'Stay indoors during peak hours and stay hydrated to avoid heat-related illnesses.' },
    { title: 'Coastal Erosion Warning', description: 'Increased erosion risk along the coast due to high tides.' },
    { title: 'Landslide Risk Advisory', description: 'Heavy rains have increased landslide risk in hilly areas. Exercise caution.' },
    { title: 'Invasive Species Alert', description: 'Invasive plant species detected in local flora. Reporting encouraged.' },
    { title: 'Vector-Borne Disease Advisory', description: 'Increase in mosquito-borne diseases. Take preventive measures.' },
    { title: 'Water Quality Warning', description: 'Contaminated water reported in certain areas. Boil water before use.' },
    { title: 'Power Outage Advisory', description: 'Scheduled power outages in various regions for maintenance.' },
    { title: 'Emergency Preparedness Reminder', description: 'Ensure your emergency kit is stocked and ready for unforeseen disasters.' },
    { title: 'Community Safety Workshop', description: 'Attend our community workshop on disaster preparedness this weekend.' },
    { title: 'Evacuation Drill Announcement', description: 'An evacuation drill will be conducted next week. Participation is mandatory.' },
    { title: 'Emergency Contact Update', description: 'Please update your emergency contact information with local authorities.' },
    { title: 'Flood Management Seminar', description: 'Join our seminar on flood management strategies this month.' },
    { title: 'Road Closure Notice', description: 'Road closures in effect due to ongoing construction work in the area.' },
    { title: 'Local Wildlife Safety Advisory', description: 'Increased sightings of wildlife in urban areas. Exercise caution.' },
    { title: 'Fire Safety Awareness', description: 'Participate in our fire safety awareness campaign next month.' },
    { title: 'Public Health Advisory', description: 'Stay informed about public health advisories from local authorities.' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertWindowIndex(prevIndex => (prevIndex + 1) % Math.ceil(alerts.length / alertsPerPage));
    }, 2000); // Change alert every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [alerts.length]);

  // Get the current alerts to display
  const currentAlerts = alerts.slice(alertWindowIndex * alertsPerPage, (alertWindowIndex + 1) * alertsPerPage);

  return (
    <div className="sidebar-alert">
      <h1>Alerts</h1>
      {currentAlerts.map((alert, index) => (
        <div key={index} className="alert-item">
          <strong>{alert.title}</strong>
          <p>{alert.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Alerts;
