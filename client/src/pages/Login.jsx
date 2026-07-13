import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');
    setDevOtp('');

    try {
      const response = await api.post('/auth/send-otp', { email });
      setMessage(response.data.message);
      if (response.data.devOtp) {
        setDevOtp(response.data.devOtp);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token, userId, profileData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // Redirect based on whether they have a profile name set
      if (profileData && profileData.name) {
        navigate('/dashboard');
      } else {
        navigate('/create-profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: '80vh', padding: '40px 24px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '40px 30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔑</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
            {step === 1 ? 'Welcome Back' : 'Verify Your Identity'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {step === 1 
              ? 'Enter your email to receive a passwordless OTP authentication code.' 
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#f87171', fontSize: '0.9rem', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: '#34d399', fontSize: '0.9rem', marginBottom: '24px' }}>
            ℹ️ {message}
          </div>
        )}

        {devOtp && (
          <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.15)', border: '1px dashed var(--primary)', borderRadius: '8px', color: '#a5b4fc', fontSize: '0.95rem', marginBottom: '24px', textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Development Mode OTP:</span>
            <span style={{ fontSize: '1.8rem', letterSpacing: '4px', fontWeight: '800', color: 'var(--secondary)' }}>{devOtp}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className="glass-form-group">
              <label className="glass-label">Email Address</label>
              <input
                type="email"
                className="glass-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Sending Code...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="glass-form-group">
              <label className="glass-label">Verification Code</label>
              <input
                type="text"
                className="glass-input"
                placeholder="6-digit OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                disabled={loading}
                style={{ textAlign: 'center', fontSize: '1.4rem', letterSpacing: '8px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
