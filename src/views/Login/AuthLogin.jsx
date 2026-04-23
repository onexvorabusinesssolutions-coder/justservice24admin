import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'config/api';
import './AuthLogin.css';
import Swal from 'sweetalert2';

const AuthLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Enter valid email address'); return; }
    if (password.length < 6) { setError('Enter your password'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/admin-login', { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${user.name || 'Admin'}!`,
        timer: 1800,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.includes('@')) { return; }
    setForgotLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      await Swal.fire({
        icon: 'success',
        title: 'Reset Link Sent!',
        text: 'If this email exists, a password reset link has been sent.',
        timer: 3000,
        showConfirmButton: false,
      });
      setForgotMode(false);
      setForgotEmail('');
    } catch {
      Swal.fire({ icon: 'info', title: 'Reset link sent if email exists.', timer: 2000, showConfirmButton: false });
    } finally {
      setForgotLoading(false);
    }
  };

  if (forgotMode) {
    return (
      <form onSubmit={handleForgotPassword} className="adm-form">
        <p style={{ color: '#475569', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
          Enter your admin email to receive a password reset link.
        </p>
        <div className="adm-input-row">
          <span className="adm-row-icon">✉️</span>
          <input
            type="email"
            placeholder="Enter your admin email"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="adm-submit-btn" disabled={forgotLoading}>
          {forgotLoading ? <><span className="adm-spinner" /> Sending...</> : 'Send Reset Link'}
        </button>
        <button
          type="button"
          className="adm-submit-btn"
          style={{ background: 'transparent', color: '#6b7280', border: '1px solid #e2e8f0', marginTop: 8 }}
          onClick={() => setForgotMode(false)}
        >
          ← Back to Login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="adm-form">
      <div className="adm-input-row">
        <span className="adm-row-icon">✉️</span>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="adm-input-row">
        <span className="adm-row-icon">🔒</span>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="button" className="adm-eye-btn" onClick={() => setShowPassword(p => !p)}>
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <div style={{ textAlign: 'right', marginBottom: 8 }}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: 12, cursor: 'pointer', padding: 0 }}
          onClick={() => setForgotMode(true)}
        >
          Forgot Password?
        </button>
      </div>

      {error && <p className="adm-error-msg">{error}</p>}

      <button type="submit" className="adm-submit-btn" disabled={loading}>
        {loading ? <><span className="adm-spinner" /> Processing...</> : 'Login'}
      </button>
    </form>
  );
};

export default AuthLogin;
