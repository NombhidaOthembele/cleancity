import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Truck } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [role, setRole]     = useState(null);
  const [name, setName]     = useState('');
  const [error, setError]   = useState('');
  const navigate             = useNavigate();

  function handleContinue() {
    if (!role) return setError('Please select your role');
    if (!name.trim()) return setError('Please enter your name');
    onLogin({ name: name.trim(), role });
    navigate(role === 'collector' ? '/collector' : '/');
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', background:'var(--surface2)' }}>
      <div style={{ width:'100%', maxWidth:360 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, color:'var(--green)' }}>
            Clean<span style={{ color:'var(--teal-mid)' }}>City</span>
          </div>
          <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:6 }}>Smart Waste Management · Durban</p>
        </div>

        {/* Role selector */}
        <p style={{ fontSize:13, fontWeight:500, color:'var(--text-muted)', marginBottom:'0.75rem' }}>I am a...</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:'1.25rem' }}>
          {[
            { key:'citizen',   label:'Resident',  sub:'Report & track waste',      Icon: User  },
            { key:'collector', label:'Collector',  sub:'Manage & resolve reports',  Icon: Truck },
          ].map(({ key, label, sub, Icon }) => (
            <div
              key={key}
              onClick={() => { setRole(key); setError(''); }}
              style={{
                background: role === key ? 'var(--green-light)' : 'var(--surface)',
                border: role === key ? '2px solid var(--green)' : '0.5px solid var(--border)',
                borderRadius:'var(--radius-lg)', padding:'1.25rem 1rem',
                cursor:'pointer', textAlign:'center', transition:'all 0.15s',
              }}
            >
              <Icon size={26} color={role === key ? 'var(--green)' : 'var(--text-muted)'} style={{ margin:'0 auto 8px' }} />
              <div style={{ fontSize:14, fontWeight:500, color: role === key ? 'var(--green)' : 'var(--text)' }}>{label}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:3 }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Name input */}
        <div className="form-group">
          <label className="form-label">Your name</label>
          <input
            className="form-input"
            placeholder="e.g. James Dlamini"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleContinue()}
          />
        </div>

        {error && <p style={{ fontSize:13, color:'var(--red)', marginBottom:'0.75rem' }}>{error}</p>}

        <button className="btn btn-primary btn-full" style={{ padding:'13px' }} onClick={handleContinue}>
          Continue
        </button>

        <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center', marginTop:'1.25rem' }}>
          CleanCity is a free public service by eThekwini Municipality
        </p>
      </div>
    </div>
  );
}
