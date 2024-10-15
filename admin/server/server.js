const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = 6000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'disaster_management',
  password: 'avakina',
  port: 5432,
});

// Endpoint for user registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const userCheck = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the Users table
    const query = `
      INSERT INTO Users (username, password)
      VALUES ($1, $2) RETURNING user_id
    `;
    const values = [username, hashedPassword];

    const result = await pool.query(query, values);
    const newUserId = result.rows[0].user_id;

    res.status(201).json({
      message: 'User created successfully',
      user_id: newUserId,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
