import { useAuth } from '../hooks/useAuth';

export default function LobbyPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SkillDuel</h1>
        <div>
          <span style={{ marginRight: 16 }}>{user?.username} — {user?.xp} XP</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
      <p>Lobby coming on Day 7!</p>
    </div>
  );
}