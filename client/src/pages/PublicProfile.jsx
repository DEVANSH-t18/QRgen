import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error(err);
        setError('The profile you are looking for does not exist or has been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const formatUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    return `https://${url}`;
  };

  const downloadVCard = () => {
    if (!user || !user.profileData) return;
    const { name, jobTitle, phone, website, linkedin, github, bio, address } = user.profileData;
    const email = user.email;

    let vcard = [];
    vcard.push('BEGIN:VCARD');
    vcard.push('VERSION:3.0');
    vcard.push(`FN:${name}`);
    if (jobTitle) vcard.push(`TITLE:${jobTitle}`);
    if (phone) vcard.push(`TEL;TYPE=CELL:${phone}`);
    if (email) vcard.push(`EMAIL;TYPE=PREF,INTERNET:${email}`);
    if (website) vcard.push(`URL:${formatUrl(website)}`);
    if (linkedin) vcard.push(`URL;type=linkedin:${formatUrl(linkedin)}`);
    if (github) vcard.push(`URL;type=github:${formatUrl(github)}`);
    if (address) vcard.push(`ADR;TYPE=WORK:;;${address.replace(/[\n,;]/g, ' ')};;;;`);
    if (bio) vcard.push(`NOTE:${bio.replace(/\n/g, '\\n')}`);
    vcard.push('END:VCARD');

    const blob = new Blob([vcard.join('\n')], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', background: '#030305' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderLeftColor: 'var(--primary)', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading visiting card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', padding: '24px', background: '#030305' }}>
        <div className="glass-card" style={{ padding: '40px 24px', maxWidth: '400px', textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
          <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>Card Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>{error}</p>
          <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>Create Your Own Card</Link>
        </div>
      </div>
    );
  }

  const { name, jobTitle, phone, website, linkedin, github, bio, address } = user.profileData;
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

  const fgColor = user.qrTheme?.fgColor || '#ffffff';
  const bgColor = user.qrTheme?.bgColor || '#000000';

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 15%, rgba(99, 102, 241, 0.12) 0%, #040407 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px' }}>
      
      <div className="cinematic-bg" />

      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        <div className="glass-card animate-fade-in" style={{ padding: '32px 24px', textAlign: 'center', position: 'relative', borderTop: `2px solid ${fgColor}` }}>
          
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: '2px', background: `linear-gradient(90deg, transparent, ${fgColor}, transparent)`, boxShadow: `0 0 20px ${fgColor}` }}></div>
          
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: `linear-gradient(135deg, ${fgColor}22 0%, ${bgColor}aa 100%)`, border: `2px solid ${fgColor}`, boxShadow: `0 8px 24px rgba(0,0,0,0.4)`, display: 'flex', alignItems: 'center', margin: '0 auto 20px', color: fgColor, fontSize: '2rem', fontWeight: '800', justifyContent: 'center' }}>
            {initials}
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px', letterSpacing: '-0.02em' }}>{name}</h2>
          
          {jobTitle && (
            <p style={{ color: fgColor, fontWeight: '600', fontSize: '1.05rem', marginBottom: '16px', letterSpacing: '0.02em', opacity: 0.9 }}>
              {jobTitle}
            </p>
          )}

          {bio && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '24px', textAlign: 'left' }}>
              {bio}
            </p>
          )}

          <button 
            onClick={downloadVCard} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', background: `linear-gradient(135deg, ${fgColor} 0%, #6366f1 100%)`, boxShadow: `0 6px 20px ${fgColor}22`, color: fgColor === '#ffffff' || fgColor === '#fff' ? '#000000' : '#ffffff' }}
          >
            👤 Save to Contacts (vCard)
          </button>
        </div>

        <div className="glass-card animate-fade-in" style={{ padding: '24px', animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contact Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📧</div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>EMAIL ADDRESS</span>
                <a href={`mailto:${user.email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', wordBreak: 'break-all' }}>{user.email}</a>
              </div>
            </div>

            {phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📞</div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PHONE NUMBER</span>
                  <a href={`tel:${phone}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>{phone}</a>
                </div>
              </div>
            )}

            {website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌐</div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PERSONAL WEBSITE</span>
                  <a href={formatUrl(website)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', wordBreak: 'break-all' }}>
                    {website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              </div>
            )}

            {address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📍</div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PHYSICAL ADDRESS</span>
                  <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: '500', display: 'block', wordBreak: 'break-word' }}>{address}</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {(linkedin || github) && (
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            {linkedin && (
              <a 
                href={formatUrl(linkedin)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="glass-card interactive animate-fade-in" 
                style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', color: '#818cf8', animationDelay: '0.2s' }}
              >
                <span style={{ fontSize: '1.2rem' }}>💼</span>
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>LinkedIn</span>
              </a>
            )}

            {github && (
              <a 
                href={formatUrl(github)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="glass-card interactive animate-fade-in" 
                style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textDecoration: 'none', color: '#f8fafc', animationDelay: '0.2s' }}
              >
                <span style={{ fontSize: '1.2rem' }}>💻</span>
                <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>GitHub</span>
              </a>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: 0.7 }}>
            Created with <span style={{ color: 'var(--primary)' }}>⚡</span> <strong>QRGen</strong>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;
