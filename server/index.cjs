// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Create an instance of Express
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DisasterRepository',
  password: 'avakina',
  port: 5432, // Default PostgreSQL port
});

// API route to handle the form submission
app.post('/api/disaster-update', async (req, res) => {
  const { disaster_id, disaster_type, disaster_loc, incident_date, losses, area_coverage } = req.body;

  try {
    // Insert form data into the PostgreSQL database
    const query = `
      INSERT INTO disasters (disaster_id, disaster_type, disaster_loc, incident_date, losses, area_coverage)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [disaster_id, disaster_type, disaster_loc, incident_date, losses, area_coverage]);

    res.status(200).send('Disaster update submitted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
