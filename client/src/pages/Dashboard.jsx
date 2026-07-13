import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../utils/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/profile/me');
        setUser(response.data);
        
        // If profile isn't configured, redirect to setup
        if (!response.data.profileData || !response.data.profileData.name) {
          navigate('/create-profile');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Please try signing in again.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (!canvas) return;
    
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
      
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${user?.profileData?.name || 'user'}-qr-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderLeftColor: 'var(--primary)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
          <style>{`
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex-center" style={{ minHeight: '80vh' }}>
        <div className="glass-card" style={{ padding: '40px', maxWidth: '500px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ marginBottom: '16px' }}>Error Loading Profile</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  let baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    baseUrl = 'https://qrgen-frontend-llqo.onrender.com';
  }
  const publicProfileLink = `${baseUrl}/p/${user?._id}`;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Welcome back, <span className="text-gradient">{user?.profileData?.name}</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your dynamic visiting card, monitor analytics, and customize your theme.</p>
        </div>
        <Link to="/create-profile" className="btn btn-primary">
          ✏️ Edit Profile
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        
        {/* QR Code Card */}
        <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '24px', alignSelf: 'flex-start' }}>Your Dynamic QR Code</h2>
          
          <div className="qr-preview-wrapper" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '30px', marginBottom: '24px', width: '100%', maxWidth: '280px' }}>
            <QRCodeCanvas
              id="qr-code-canvas"
              value={publicProfileLink}
              size={220}
              fgColor={user?.qrTheme?.fgColor || '#ffffff'}
              bgColor={user?.qrTheme?.bgColor || '#000000'}
              level="H"
              includeMargin={true}
              imageSettings={user?.qrTheme?.logoUrl ? {
                src: user.qrTheme.logoUrl,
                height: 40,
                width: 40,
                excavate: true,
              } : undefined}
            />
          </div>

          <button className="btn btn-accent" onClick={downloadQR} style={{ width: '100%', maxWidth: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            📥 Download QR as PNG
          </button>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px', textAlign: 'center' }}>
            Scan leads to: <a href={publicProfileLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{publicProfileLink}</a>
          </p>
        </div>

        {/* Analytics & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Scan Count Card */}
          <div className="glass-card" style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '10rem', opacity: 0.03, pointerEvents: 'none' }}>📊</div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📈 TOTAL ENGAGEMENT
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span className="text-gradient" style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1 }}>
                {user?.scanCount}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>
                Total Card Scans
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '16px' }}>
              Your card scans are registered and updated in real-time each time someone scans your QR code or loads your digital profile link.
            </p>
          </div>

          {/* Profile Card Preview */}
          <div className="glass-card" style={{ padding: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>📇 PROFILE PREVIEW</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Name</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.profileData?.name}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Job Title</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.profileData?.jobTitle || 'Not Set'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Bio</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{user?.profileData?.bio || 'No bio written yet.'}</span>
              </div>
              {user?.profileData?.address && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Address</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{user.profileData.address}</span>
                </div>
              )}
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Contacts & Socials</span>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {user?.profileData?.phone && <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.85rem' }}>📞 Phone</span>}
                  {user?.profileData?.website && <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.85rem' }}>🌐 Web</span>}
                  {user?.profileData?.linkedin && <span style={{ padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '6px', fontSize: '0.85rem', color: '#818cf8' }}>💼 LinkedIn</span>}
                  {user?.profileData?.github && <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '0.85rem' }}>💻 GitHub</span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
