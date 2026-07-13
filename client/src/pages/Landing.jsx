import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="container animate-fade-in" style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '60px' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
          ⚡ Next-Gen Networking
        </div>
        <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '24px', fontWeight: '800' }}>
          The Dynamic Digital <br />
          <span className="text-gradient">Visiting Card</span> for Professionals.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '40px', lineHeight: '1.7' }}>
          Instantly bridge the gap between physical and digital networking. Share contact cards, social links, and bio details through a highly customizable QR Code.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
            Get Started Free
          </Link>
          <a href="#features" className="btn btn-secondary" style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
            Explore Features
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" style={{ width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>🎨</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '700' }}>Dynamic Custom QR</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Change your card colors, branding logo, and themes anytime. The printed QR stays exactly the same, but the design updates live.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📲</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '700' }}>1-Click Save Contact</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Allow people to download your virtual contact card (.vcf) directly into their native phone contacts instantly. No typing required.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📈</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '700' }}>Real-time Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Keep track of engagement. Monitor your profile views and scan statistics directly from your protected dashboard.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📱</div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', fontWeight: '700' }}>Mobile-First Design</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Strictly mobile-optimized digital profiles guarantee that scanners on smartphones get a responsive, gorgeous, fast experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
