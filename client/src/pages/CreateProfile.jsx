import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../utils/api';

const CreateProfile = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    jobTitle: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    address: '',
  });

  const [themeData, setThemeData] = useState({
    fgColor: '#ffffff',
    bgColor: '#000000',
    logoUrl: '',
  });

  const [userId, setUserId] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile/me');
        const user = response.data;
        setUserId(user._id);

        if (user.profileData) {
          setFormData({
            name: user.profileData.name || '',
            bio: user.profileData.bio || '',
            jobTitle: user.profileData.jobTitle || '',
            phone: user.profileData.phone || '',
            website: user.profileData.website || '',
            linkedin: user.profileData.linkedin || '',
            github: user.profileData.github || '',
            address: user.profileData.address || '',
          });
        }

        if (user.qrTheme) {
          setThemeData({
            fgColor: user.qrTheme.fgColor || '#ffffff',
            bgColor: user.qrTheme.bgColor || '#000000',
            logoUrl: user.qrTheme.logoUrl || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        }
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThemeChange = (e) => {
    setThemeData({
      ...themeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/profile/save', {
        profileData: formData,
        qrTheme: themeData,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderLeftColor: 'var(--primary)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading settings...</p>
        </div>
      </div>
    );
  }

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const livePreviewUrl = userId 
    ? `${baseUrl}/p/${userId}` 
    : `${baseUrl}/p/preview`;

  return (
    <div className="container flex-center animate-fade-in" style={{ padding: '40px 24px', minHeight: '85vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '650px', padding: '40px 30px' }}>
        
        {/* Step Indicator */}
        <div className="step-container">
          <div className={`step-bubble ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>1</div>
          <div className={`step-bubble ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
          <div className={`step-bubble ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
            {step === 1 && 'Basic Information'}
            {step === 2 && 'Socials & Connections'}
            {step === 3 && 'QR Code Customization'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {step === 1 && 'Let people know who you are and what you do.'}
            {step === 2 && 'Add web & social channels so people can connect with you.'}
            {step === 3 && 'Design your unique QR visiting card theme colors.'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#f87171', fontSize: '0.9rem', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', color: '#34d399', fontSize: '0.9rem', marginBottom: '24px' }}>
            ✨ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-form-group">
                <label className="glass-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="glass-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="glass-form-group">
                <label className="glass-label">Job Title / Role</label>
                <input
                  type="text"
                  name="jobTitle"
                  className="glass-input"
                  placeholder="e.g. Senior Software Architect"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="glass-form-group">
                <label className="glass-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="glass-input"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="glass-form-group">
                <label className="glass-label">Physical Address</label>
                <input
                  type="text"
                  name="address"
                  className="glass-input"
                  placeholder="e.g. 123 Main St, New York, NY"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="glass-form-group">
                <label className="glass-label">Short Bio</label>
                <textarea
                  name="bio"
                  className="glass-input"
                  placeholder="Tell scanner a bit about your work, skills or values..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-form-group">
                <label className="glass-label">Personal / Company Website</label>
                <input
                  type="url"
                  name="website"
                  className="glass-input"
                  placeholder="https://johndoe.dev"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="glass-form-group">
                <label className="glass-label">LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="linkedin"
                  className="glass-input"
                  placeholder="https://linkedin.com/in/johndoe"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="glass-form-group">
                <label className="glass-label">GitHub Profile URL</label>
                <input
                  type="url"
                  name="github"
                  className="glass-input"
                  placeholder="https://github.com/johndoe"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Theme Preset Buttons */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <label className="glass-label" style={{ marginBottom: '10px', display: 'block', fontSize: '0.75rem' }}>Select Preset Theme</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { name: 'Indigo Glow', fg: '#6366f1', bg: '#09090e' },
                      { name: 'Mint Emerald', fg: '#10b981', bg: '#040705' },
                      { name: 'Sunset Rose', fg: '#f43f5e', bg: '#090405' },
                      { name: 'Gold Cyber', fg: '#fbbf24', bg: '#070603' },
                      { name: 'Pure White', fg: '#ffffff', bg: '#000000' },
                      { name: 'Dark Stealth', fg: '#e2e8f0', bg: '#0f172a' }
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={(e) => { e.preventDefault(); setThemeData({ ...themeData, fgColor: preset.fg, bgColor: preset.bg }); }}
                        style={{
                          background: preset.bg,
                          border: `1.5px solid ${themeData.fgColor === preset.fg && themeData.bgColor === preset.bg ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '8px',
                          padding: '6px',
                          color: preset.fg,
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          boxShadow: themeData.fgColor === preset.fg && themeData.bgColor === preset.bg ? `0 0 10px ${preset.fg}22` : 'none'
                        }}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="glass-form-group">
                  <label className="glass-label">QR Dots (Foreground) Color</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="fgColor"
                      value={themeData.fgColor}
                      onChange={handleThemeChange}
                      style={{ width: '50px', height: '45px', border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      name="fgColor"
                      className="glass-input"
                      value={themeData.fgColor}
                      onChange={handleThemeChange}
                      style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">QR Card Background Color</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="color"
                      name="bgColor"
                      value={themeData.bgColor}
                      onChange={handleThemeChange}
                      style={{ width: '50px', height: '45px', border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      name="bgColor"
                      className="glass-input"
                      value={themeData.bgColor}
                      onChange={handleThemeChange}
                      style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <div className="glass-form-group">
                  <label className="glass-label">Center Branding Logo URL (Optional)</label>
                  <input
                    type="url"
                    name="logoUrl"
                    className="glass-input"
                    placeholder="https://example.com/logo.png"
                    value={themeData.logoUrl}
                    onChange={handleThemeChange}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Provide an image link to embed a logo inside the QR code center.</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span className="glass-label" style={{ marginBottom: '12px' }}>Live QR Preview</span>
                <div className="qr-preview-wrapper" style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <QRCodeCanvas
                    value={livePreviewUrl}
                    size={170}
                    fgColor={themeData.fgColor}
                    bgColor={themeData.bgColor}
                    level="H"
                    includeMargin={true}
                    imageSettings={themeData.logoUrl ? {
                      src: themeData.logoUrl,
                      height: 32,
                      width: 32,
                      excavate: true,
                    } : undefined}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>Adjust values to see changes in real-time</span>
              </div>

            </div>
          )}

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', gap: '16px' }}>
            {step > 1 ? (
              <button key="back-btn" type="button" className="btn btn-secondary" onClick={handleBack} disabled={loading}>
                👈 Previous Step
              </button>
            ) : (
              <button key="cancel-btn" type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')} disabled={loading}>
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button key="next-btn" type="button" className="btn btn-primary" onClick={handleNext}>
                Next Step 👉
              </button>
            ) : (
              <button key="submit-btn" type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Saving Details...' : '💾 Save & Finish'}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateProfile;
