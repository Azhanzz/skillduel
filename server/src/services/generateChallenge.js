const client = require('./aiService');

async function generateChallenge(topic, difficulty) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate a coding challenge with these exact specs:
- Topic: ${topic}
- Difficulty: ${difficulty}

Respond ONLY with a valid JSON object, no markdown, no explanation.
Use this exact structure:
{
  "title": "short challenge title",
  "description": "clear problem description, 2-4 sentences",
  "examples": [
    { "input": "example input", "output": "expected output", "explanation": "why" }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "test_cases": [
    { "input": "test input 1", "output": "expected output 1", "hidden": false },
    { "input": "test input 2", "output": "expected output 2", "hidden": false },
    { "input": "edge case input", "output": "edge case output", "hidden": true },
    { "input": "edge case input 2", "output": "edge case output 2", "hidden": true }
  ]
}`
      }
    ]
  });

  const raw = message.content[0].text;
  const parsed = JSON.parse(raw);
  return parsed;
}

module.exports = generateChallenge;