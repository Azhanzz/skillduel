import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { getChallenge } from '../api/challenges';
import api from '../api/client';

export default function ChallengePage() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getChallenge(id).then(res => setChallenge(res.data));
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await api.post('/submissions', {
        challenge_id: challenge.id,
        code,
        language,
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) return <p style={{ padding: 24 }}>Loading challenge...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 24, height: '100vh' }}>
      <div>
        <h2>{challenge.title}</h2>
        <p>{challenge.description}</p>
        <h3>Examples</h3>
        {challenge.examples?.map((ex, i) => (
          <div key={i} style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, marginBottom: 8 }}>
            <p><strong>Input:</strong> {ex.input}</p>
            <p><strong>Output:</strong> {ex.output}</p>
            <p><strong>Why:</strong> {ex.explanation}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <CodeEditor language={language} onChange={setCode} />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Running...' : 'Submit'}
        </button>

        {results && (
          <div>
            <p><strong>{results.passed ? '✓ All tests passed!' : `${results.passed_count}/${results.total} tests passed`}</strong></p>
            {results.results.map((r, i) => (
              <div key={i} style={{ padding: 8, marginBottom: 4, background: r.passed ? '#e1f5ee' : '#fcebeb', borderRadius: 6 }}>
                <p>Test {i + 1}: {r.passed ? 'Passed' : 'Failed'}</p>
                {!r.passed && !r.hidden && (
                  <>
                    <p>Expected: {r.expected}</p>
                    <p>Got: {r.actual}</p>
                  </>
                )}
                {r.error && <p style={{ color: 'red' }}>{r.error}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}