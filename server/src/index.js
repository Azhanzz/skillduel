const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ status: 'ok', time: result.rows[0].now });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const challengeRoutes = require('./routes/challenges');
app.use('/api/challenges', challengeRoutes);

const submitRoutes = require('./routes/submissions');
app.use('/api/submissions', submitRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});