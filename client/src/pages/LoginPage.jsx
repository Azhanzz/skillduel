import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(username, password);
      login(res.data.token, res.data.user);
      navigate('/lobby');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#0F0F13',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        width: 420,
        backgroundColor: '#1A1A24',
        borderRadius: 12,
        border: '1px solid #2E2E45',
        padding: '40px 36px',
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#F0F0FF',
            letterSpacing: '-0.5px',
          }}>
            Skill<span style={{ color: '#7C6AF7' }}>Duel</span>
          </span>
          <p style={{ color: '#8888AA', fontSize: 14, marginTop: 6 }}>
            Sharpen your skills. Beat the clock.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#2D1B1B',
            border: '1px solid #E84545',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 20,
            color: '#E84545',
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#8888AA', display: 'block', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0F0F13',
                border: '1px solid #2E2E45',
                borderRadius: 8,
                color: '#F0F0FF',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#8888AA', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0F0F13',
                border: '1px solid #2E2E45',
                borderRadius: 8,
                color: '#F0F0FF',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#4A3FA0' : '#7C6AF7',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#8888AA' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#7C6AF7', textDecoration: 'none', fontWeight: 500 }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}