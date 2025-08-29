import React, { useState, useEffect } from 'react';
import '../styles/forms.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [themeIcon, setThemeIcon] = useState('🌙');

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
    setForm(f => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.firstName || !form.lastName || !form.password) {
      alert("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    // submitting...

    axios.post("https://chat-gpt-h08n.onrender.com/api/auth/register", {
      email: form.email,
      fullName: {
        firstName: form.firstName,
        lastName: form.lastName
      },
      password: form.password,
    }, {
      withCredentials: true
    })
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        if (err.response) {
          console.error("Server error:", err.response.data);
          alert(`Registration failed: ${err.response.data.message || "Please check your input."}`);
        } else {
          console.error("Error:", err);
          alert("Registration failed: No server response.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create account</h1>
          <div className="theme-toggle" aria-hidden="true">{themeIcon}</div>
        </div>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <div className="row">
            <label className="field">
              <span className="label-text">First name</span>
              <input
                className="input"
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                placeholder="First"
              />
            </label>

            <label className="field">
              <span className="label-text">Last name</span>
              <input
                className="input"
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last"
              />
            </label>
          </div>

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
              placeholder="Choose a strong password"
            />
          </label>

          <div className="actions">
            <button className="btn primary" type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create account"}
            </button>
            <a className="muted link" href="/login">Already have an account?</a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Register;
