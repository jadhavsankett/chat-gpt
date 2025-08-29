import React, { useState, useEffect } from 'react';
import '../styles/forms.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [themeIcon, setThemeIcon] = useState('🌙');
  const navigate = useNavigate();

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (e) => {
      const isDark = e && typeof e.matches === 'boolean' ? e.matches : mq.matches;
      setThemeIcon(isDark ? '☀️' : '🌙');
    };
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    axios.post(
      "https://chat-gpt-h08n.onrender.com/api/auth/login",
      {
        email: form.email,
        password: form.password
      },
      { withCredentials: true }
    )
    .then((res) => {
      navigate('/');
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setSubmitting(false);
    });
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign in</h1>
          <div className="theme-toggle" aria-hidden="true">{themeIcon}</div>
        </div>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span className="label-text">Email</span>
            <input
              className="input"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="label-text">Password</span>
            <input
              className="input"
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>

          <div className="actions">
            <button className="btn primary" type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
            <a className="muted link" href="/register">Create account</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
