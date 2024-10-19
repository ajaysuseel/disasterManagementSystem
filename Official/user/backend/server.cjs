// server.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); 

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(bodyParser.json()); 

const pool = new Pool({
  user: 'postgres',                 
  host: 'localhost',                
  database: 'disaster_management',  
  password: 'avakina',              
  port: 5432,                       
});

// Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = 'INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING user_id, username';
    const insertResult = await pool.query(insertQuery, [username, hashedPassword]);

    const newUser = insertResult.rows[0];

    res.status(201).json({ message: 'User registered successfully', username: newUser.username });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login a user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM Officials WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const existingUser = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Instead of a token, return only the username
    res.json({ username: existingUser.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/report
 * Fetches disaster reports with optional filtering.
 * Query Parameters:
 * - disaster_type: Filter by disaster type
 * - incident_date: Filter by incident date (YYYY-MM-DD)
 * - disaster_ward: Filter by ward
 * - disaster_loc_x: Filter by location X coordinate
 * - disaster_loc_y: Filter by location Y coordinate
 */
app.get('/api/report', async (req, res) => {
  const { disaster_type, incident_date, disaster_ward, disaster_loc_x, disaster_loc_y } = req.query;

  try {
    // Base query
    let query = 'SELECT disaster_id, disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage FROM DisasterEvents';
    const conditions = [];
    const values = [];

    // Apply filters based on query parameters
    if (disaster_type) {
      values.push(disaster_type);
      conditions.push(`disaster_type ILIKE $${values.length}`);
    }

    if (incident_date) {
      values.push(incident_date);
      conditions.push(`incident_date = $${values.length}`);
    }

    if (disaster_ward) {
      values.push(disaster_ward);
      conditions.push(`disaster_ward ILIKE $${values.length}`);
    }

    if (disaster_loc_x && disaster_loc_y) {
      const x = parseFloat(disaster_loc_x);
      const y = parseFloat(disaster_loc_y);
      values.push(x, y);
      conditions.push(`disaster_loc = POINT($${values.length - 1}, $${values.length})`);
    }

    // Combine conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Optional: Add sorting or pagination here if needed
    query += ' ORDER BY incident_date DESC';

    const result = await pool.query(query, values);

    // Transform disaster_loc into disaster_loc_x and disaster_loc_y
    const data = result.rows.map(row => {
      let x, y;

      if (typeof row.disaster_loc === 'object' && !Array.isArray(row.disaster_loc)) {
        // Assuming { x: ..., y: ... }
        x = row.disaster_loc.x;
        y = row.disaster_loc.y;
      } else if (Array.isArray(row.disaster_loc)) {
        // Assuming [x, y]
        [x, y] = row.disaster_loc;
      } else if (typeof row.disaster_loc === 'string') {
        // Assuming "(x,y)"
        const locString = row.disaster_loc.replace(/[()]/g, '');
        [x, y] = locString.split(',').map(coord => parseFloat(coord.trim()));
      } else {
        // Default or error handling
        x = null;
        y = null;
        console.warn('Unexpected disaster_loc format:', row.disaster_loc);
      }

      return {
        disaster_id: row.disaster_id,
        disaster_type: row.disaster_type,
        disaster_ward: row.disaster_ward,
        disaster_loc_x: x,
        disaster_loc_y: y,
        incident_date: row.incident_date,
        losses: row.losses,
        area_coverage: row.area_coverage
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching disaster reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) Endpoint to Insert Disaster Events
app.post('/api/update', async (req, res) => {
  const { disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage } = req.body;

  // Split the disaster_loc to get x and y coordinates
  const [longitude, latitude] = disaster_loc.split(',').map(coord => parseFloat(coord.trim()));

  try {
    const insertQuery = `
      INSERT INTO DisasterEvents (disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage)
      VALUES ($1, $2, POINT($3, $4), $5, $6, $7)
      RETURNING disaster_id, disaster_type, disaster_ward, disaster_loc, incident_date, losses, area_coverage
    `;
    const values = [disaster_type, disaster_ward, longitude, latitude, incident_date, losses, area_coverage];

    console.log('Insert Values:', values); // Log the values being inserted

    const result = await pool.query(insertQuery, values);

    // Process the result
    const newDisaster = result.rows[0];
    res.status(201).json(newDisaster);
  } catch (error) {
    console.error('Error inserting disaster event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/hupdate', async (req, res) => {
  const { hazard_type, hazard_ward, hazard_loc_x, hazard_loc_y, incident_date, losses } = req.body;

  // Log the incoming request body to ensure data is present
  console.log('Request Body:', req.body);

  try {
    const insertQuery = `
      INSERT INTO HazardEvents (hazard_type, hazard_ward, hazard_loc, incident_date, losses)
      VALUES ($1, $2, POINT($3, $4), $5, $6) 
      RETURNING hazard_id, hazard_type, hazard_ward, hazard_loc, incident_date, losses
    `;

    // Log the query and values
    const values = [
      hazard_type,
      hazard_ward,
      parseFloat(hazard_loc_x),  // Ensure these are valid floats
      parseFloat(hazard_loc_y),
      incident_date,             // Ensure date is properly formatted
      losses
    ];
    console.log('SQL Query:', insertQuery);
    console.log('Query Values:', values);

    const result = await pool.query(insertQuery, values);
    const newHazard = result.rows[0];

    // Handling the hazard_loc as a point
    let x, y;
    if (typeof newHazard.hazard_loc === 'object' && !Array.isArray(newHazard.hazard_loc)) {
      x = newHazard.hazard_loc.x;
      y = newHazard.hazard_loc.y;
    } else if (Array.isArray(newHazard.hazard_loc)) {
      [x, y] = newHazard.hazard_loc;
    } else if (typeof newHazard.hazard_loc === 'string') {
      const locString = newHazard.hazard_loc.replace(/[()]/g, '');
      [x, y] = locString.split(',').map(coord => parseFloat(coord.trim()));
    } else {
      x = null;
      y = null;
      console.warn('Unexpected hazard_loc format:', newHazard.hazard_loc);
    }

    res.status(201).json({
      hazard_id: newHazard.hazard_id,
      hazard_type: newHazard.hazard_type,
      hazard_ward: newHazard.hazard_ward,
      hazard_loc_x: x,
      hazard_loc_y: y,
      incident_date: newHazard.incident_date,
      losses: newHazard.losses,
    });
  } catch (error) {
    console.error('Error inserting data:', error); // Log detailed error
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
});


app.get('/api/hreport', async (req, res) => {
  const { hazard_type, incident_date, hazard_ward, hazard_loc_x, hazard_loc_y } = req.query;

  try {
    // Base query
    let query = 'SELECT hazard_id, hazard_type, hazard_ward, hazard_loc, incident_date, losses FROM HazardEvents';
    const conditions = [];
    const values = [];

    // Apply filters based on query parameters
    if (hazard_type) {
      values.push(hazard_type);
      conditions.push(`hazard_type ILIKE $${values.length}`);
    }

    if (incident_date) {
      values.push(incident_date);
      conditions.push(`incident_date = $${values.length}`);
    }

    if (hazard_ward) {
      values.push(hazard_ward);
      conditions.push(`hazard_ward ILIKE $${values.length}`);
    }

    if (hazard_loc_x && hazard_loc_y) {
      const x = parseFloat(hazard_loc_x);
      const y = parseFloat(hazard_loc_y);
      values.push(x, y);
      conditions.push(`hazard_loc = POINT($${values.length - 1}, $${values.length})`);
    }

    // Combine conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Optional: Add sorting or pagination here if needed
    query += ' ORDER BY incident_date DESC';

    const result = await pool.query(query, values);

    // Transform disaster_loc into disaster_loc_x and disaster_loc_y
    const data = result.rows.map(row => {
      let x, y;

      if (typeof row.hazard_loc === 'object' && !Array.isArray(row.hazard_loc)) {
        // Assuming { x: ..., y: ... }
        x = row.hazard_loc.x;
        y = row.hazard_loc.y;
      } else if (Array.isArray(row.hazard_loc)) {
        // Assuming [x, y]
        [x, y] = row.disaster_loc;
      } else if (typeof row.hazard_loc === 'string') {
        // Assuming "(x,y)"
        const locString = row.hazard_loc.replace(/[()]/g, '');
        [x, y] = locString.split(',').map(coord => parseFloat(coord.trim()));
      } else {
        // Default or error handling
        x = null;
        y = null;
        console.warn('Unexpected hazard_loc format:', row.hazard_loc);
      }

      return {
        hazard_id: row.hazard_id,
        hazard_type: row.hazard_type,
        hazard_ward: row.hazard_ward,
        hazard_loc_x: x,
        hazard_loc_y: y,
        incident_date: row.incident_date,
        losses: row.losses,
      };
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching disaster reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//Alerts

// Add alert
app.post('/api/alerts', async (req, res) => {
  const { alert_type, ward, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Alerts (alert_type, alert_ward, alert_message, is_active, created_at) VALUES ($1, $2, $3, TRUE, NOW()) RETURNING *',
      [alert_type, ward, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.put('/api/alerts/:id/deactivate', async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure that the column name matches your schema (active or is_active)
    const result = await pool.query(
      'UPDATE Alerts SET is_active = FALSE, deactivated_at = NOW() WHERE alert_id = $1',
      [id]
    );

    // Check if any row was affected
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json({ message: 'Alert deactivated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch active alerts
app.get('/api/alerts/active', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Alerts WHERE is_active = TRUE');
    // Ensure that we return an array even if it's empty
    res.status(200).json(Array.isArray(result.rows) ? result.rows : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Signup endpoint
app.post('/api/rsignup', async (req, res) => {
  const { email, password, name, username, age, phone_number, ward } = req.body;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password validation (modify as needed)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Additional field validation
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name is required' });
  }
  
  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  if (!age || age < 1) {
    return res.status(400).json({ message: 'Valid age is required' });
  }

  const phoneRegex = /^\d{10}$/; // Adjust regex as necessary for your phone format
  if (!phoneRegex.test(phone_number)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM Residents WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new resident
    const newResident = await pool.query(
      'INSERT INTO Residents (email, password, name, username, age, phone_number, ward, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [email, hashedPassword, name, username, age, phone_number, ward]
    );

    res.status(201).json({
      message: 'User registered successfully',
      resident: newResident.rows[0], // Return the newly created resident object
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login a resident
app.post('/api/rlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to find the resident by email
    const result = await pool.query('SELECT * FROM Residents WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const existingUser = result.rows[0];

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Respond with email and name from the Residents table
    res.json({ email: existingUser.email, name: existingUser.name });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add this endpoint to your existing Express routes
app.get('/api/ward', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  try {
    const result = await pool.query('SELECT ward FROM Residents WHERE email = $1', [email]); // Adjust the query as needed
    if (result.rows.length > 0) {
      res.json({ ward: result.rows[0].ward });
    } else {
      res.status(404).json({ message: 'Ward not found for the provided email.' });
    }
  } catch (error) {
    console.error('Error fetching ward:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  



// Example endpoint to get alerts by ward
app.get('/api/ralerts', async (req, res) => {
  const { ward } = req.query; // Get ward from query parameters

  try {
    const result = await pool.query('SELECT * FROM Alerts WHERE alert_ward = $1 AND is_active = true ORDER BY created_at DESC', [ward]);
    res.json(result.rows); // Send the fetched alerts back as a JSON response
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
