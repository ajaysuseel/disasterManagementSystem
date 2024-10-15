// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

// Create an instance of Express
const app = express();
const port = 5000; // Changed from 3000 to 5000

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON bodies

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',                 // Replace with your PostgreSQL username
  host: 'localhost',                // Replace with your PostgreSQL host if different
  database: 'disaster_management',  // Ensure this matches your database name
  password: 'avakina',              // Replace with your PostgreSQL password
  port: 5432,                       // Default PostgreSQL port
});

// Endpoint for user login without bcrypt
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body; // Use username here

  try {
    const result = await pool.query('SELECT * FROM Users WHERE username = $1', [username]); // Use username here

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' }); // Update error message
    }

    const existingUser = result.rows[0];

    // Check if the provided password matches the stored password
    if (password !== existingUser.password) { // Direct comparison without hashing
      return res.status(401).json({ message: 'Invalid username or password' }); // Update error message
    }

    res.json({ message: 'Login successful', userId: existingUser.user_id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API route to handle the form submission
app.post('/api/disaster-update', async (req, res) => {
  // Destructure the necessary fields from the request body
  const { disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage } = req.body;

  try {
    // Insert form data into the PostgreSQL database
    const query = `
      INSERT INTO DisasterEvents (disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING disaster_id
    `;
    const values = [disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage];

    // Execute the query
    const result = await pool.query(query, values);

    // Retrieve the generated disaster_id
    const newDisasterId = result.rows[0].disaster_id;

    // Send a success response with the new disaster_id
    res.status(201).json({
      message: 'Disaster update submitted successfully',
      disaster_id: newDisasterId,
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

// API route to fetch disaster updates
app.get('/api/report', async (req, res) => {
  try {
    const query = 'SELECT disaster_id, disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage FROM DisasterEvents ORDER BY incident_date DESC';
    const result = await pool.query(query);

    // Check if results are returned
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No disaster reports found.' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
