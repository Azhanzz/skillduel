const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('./auth');
const generateChallenge = require('../services/generateChallenge');

const VALID_TOPICS = [
  'arrays', 'strings', 'recursion', 'linked lists',
  'trees', 'dynamic programming', 'sorting', 'sql'
];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

// POST /api/challenges/generate
router.post('/generate', authMiddleware, async (req, res) => {
  const { topic, difficulty } = req.body;

  if (!VALID_TOPICS.includes(topic) || !VALID_DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid topic or difficulty' });
  }

  try {
    const challenge = await generateChallenge(topic, difficulty);

    const result = await pool.query(
      `INSERT INTO challenges (title, description, topic, difficulty, test_cases)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        challenge.title,
        challenge.description,
        topic,
        difficulty,
        JSON.stringify(challenge.test_cases)
      ]
    );

    res.status(201).json({
      ...result.rows[0],
      examples: challenge.examples,
      constraints: challenge.constraints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

// GET /api/challenges
router.get('/', authMiddleware, async (req, res) => {
  const { topic, difficulty } = req.query;

  let query = 'SELECT id, title, topic, difficulty, created_at FROM challenges';
  const params = [];

  if (topic && difficulty) {
    query += ' WHERE topic = $1 AND difficulty = $2';
    params.push(topic, difficulty);
  } else if (topic) {
    query += ' WHERE topic = $1';
    params.push(topic);
  } else if (difficulty) {
    query += ' WHERE difficulty = $1';
    params.push(difficulty);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// GET /api/challenges/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM challenges WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = result.rows[0];
    const visibleTestCases = challenge.test_cases.filter(tc => !tc.hidden);

    res.json({
      ...challenge,
      test_cases: visibleTestCases,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

module.exports = router;