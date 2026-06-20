const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');
const { runCode } = require('../services/judge0');

router.post('/', authMiddleware, async (req, res) => {
    try {
    const { challengeId, sourceCode, language} = req.body;

    challenge = await pool.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
    if(challenge.rows.length === 0){
        return res.status(404).json({error: 'Challenge not found'});
    }
    const testCases = challenge.rows[0].test_cases;
    
    const results = await Promise.all(
    testCases.map(async (testCase) => {
        const response = await runCode(sourceCode, language, testCase.input);
        const output = Buffer.from(response.stdout, 'base64').toString('utf-8').trim();
        const expected = Buffer.from(testCase.output, 'base64').toString('utf-8').trim();
        const passed = output === expected;
        return { 
            input: testCase.hidden? "[hidden]" : testCase.input,
            expected : testCase.hidden? "[hidden]" : testCase.output,
            output: output,
            passed: passed,
            runtime_ms: result.time ? Math.round(result.time * 1000) : null,
        };              
    })
    );

    const numPassed = results.filter(r => r.passed).length;

    response = await pool.query(
        `INSERT INTO submissions (user_id, challenge_id, code, passed, runtime_ms)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [req.userId, challengeId, sourceCode, numPassed, results.reduce((acc, r) => acc + (r.runtime_ms || 0), 0)]
    );
    
    res.json({
      passed: allPassed,
      results,
      total: results.length,
      passed_count: results.filter(r => r.passed).length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Execution failed' });
  }
});

module.exports = router;