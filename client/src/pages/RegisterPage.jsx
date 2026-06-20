import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerApi(username, email, password);
      login(res.data.token, res.data.user);
      navigate('/lobby');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#0F0F13',
    border: '1px solid #2E2E45',
    borderRadius: 8,
    color: '#F0F0FF',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: '#8888AA',
    display: 'block',
    marginBottom: 6,
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
            Create your account and start dueling.
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
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              style={inputStyle}
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#8888AA' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7C6AF7', textDecoration: 'none', fontWeight: 500 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}