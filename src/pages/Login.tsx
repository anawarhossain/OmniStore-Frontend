import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from =
    (location.state as { from?: string } | null)?.from ?? '/';

  const loginAs = async (emailValue: string, passwordValue: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await login(emailValue, passwordValue);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Login failed. Try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await loginAs(email, password);
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <div className="card auth-card demo-accounts">
        <h3>Demo accounts</h3>
        <p className="muted">
          One-click login to explore the app:
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={submitting}
          onClick={() => loginAs('admin@example.com', 'admin123')}
        >
          Login as Admin
          <small>admin@example.com / admin123</small>
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={submitting}
          onClick={() => loginAs('custmer@gmail.com', 'Customer123')}
        >
          Login as Customer
          <small>custmer@gmail.com / Customer123</small>
        </button>
      </div>
    </div>
  );
}