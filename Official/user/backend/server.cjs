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
  const { email, password } = req.body;

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password validation (modify as needed)
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
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
      'INSERT INTO Residents (email, password, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
      resident: newResident.rows[0],
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
    const result = await pool.query('SELECT * FROM Residents WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const existingUser = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Instead of a token, return only the email
    res.json({ email: existingUser.email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
