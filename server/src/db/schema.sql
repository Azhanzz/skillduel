CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  rank VARCHAR(20) DEFAULT 'Bronze',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  topic VARCHAR(50) NOT NULL,
  difficulty VARCHAR(10) NOT NULL,
  test_cases JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  challenge_id INTEGER REFERENCES challenges(id),
  code TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  runtime_ms INTEGER,
  ai_feedback TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE xp_ledger (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);