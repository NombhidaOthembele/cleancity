import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AlertTriangle, ChevronRight, Recycle, Truck } from 'lucide-react';
import { CURRENT_USER, SCHEDULE, TYPE_COLORS } from '../utils/data';

export default function HomePage() {
  const navigate = useNavigate();
  const today    = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  const upcoming = SCHEDULE
    .filter(s => s.date >= todayStr)
    .slice(0, 3);

  function daysUntil(dateStr) {
    const diff = Math.round((new Date(dateStr) - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days`;
  }

  const todayCollection = upcoming.find(s => s.date === todayStr);

  return (
    <>
      <header className="page-header">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, lineHeight:1.2 }}>
              Good morning,<br />{CURRENT_USER.name.split(' ')[0]} 👋
            </h1>
            <p className="text-muted" style={{ marginTop:4 }}>
              {CURRENT_USER.zone} · {format(today, 'EEEE, d MMMM')}
            </p>
          </div>
          <div style={{
            width:40, height:40, borderRadius:'50%',
            background:'var(--green-light)', display:'flex',
            alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:500, color:'var(--green)',
          }}>
            {CURRENT_USER.initials}
          </div>
        </div>
      </header>

      <main className="page fade-up">
        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:'1.25rem' }}>
          {[
            { num:'12', label:'Reports filed' },
            { num:'3',  label:'Resolved' },
            { num:'74%',label:'Recycle rate' },
          ].map(s => (
            <div key={s.label} style={{ background:'var(--surface2)', borderRadius:'var(--radius-sm)', padding:'0.75rem', textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'var(--green)' }}>{s.num}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today alert */}
        {todayCollection && (
          <div style={{
            background:'var(--teal-light)', borderRadius:'var(--radius-md)',
            padding:'0.875rem', display:'flex', gap:10, marginBottom:'1.25rem',
            borderLeft:'3px solid var(--teal-mid)',
          }}>
            <Recycle size={18} color="var(--teal)" style={{ flexShrink:0, marginTop:2 }} />
            <div>
              <div style={{ fontSize:13, color:'var(--teal)', fontWeight:500 }}>{todayCollection.title}</div>
              <div style={{ fontSize:12, color:'var(--teal)', opacity:0.8, marginTop:2 }}>
                Place bins out by {todayCollection.time} — {todayCollection.route}
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:'1.5rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/report')} style={{ padding:'14px', flexDirection:'column', gap:6, height:'auto' }}>
            <AlertTriangle size={20} />
            <span>Report issue</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/recycle')} style={{ padding:'14px', flexDirection:'column', gap:6, height:'auto' }}>
            <Recycle size={20} />
            <span>Recycle guide</span>
          </button>
        </div>

        {/* Upcoming schedule */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem' }}>
          <h2 style={{ fontSize:14, fontFamily:'var(--font-display)' }}>Upcoming collections</h2>
          <button onClick={() => navigate('/schedule')} style={{ background:'none', border:'none', color:'var(--green)', fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:2 }}>
            View all <ChevronRight size={14} />
          </button>
        </div>

        {upcoming.map(item => {
          const label = daysUntil(item.date);
          const badgeStyle = label === 'Today'
            ? { background:'var(--green-light)', color:'var(--green)' }
            : label === 'Tomorrow'
            ? { background:'var(--amber-light)', color:'var(--amber)' }
            : { background:'var(--surface2)', color:'var(--text-muted)' };

          return (
            <div key={item.id} className="card" style={{ marginBottom:'0.625rem', display:'flex', alignItems:'center', gap:12 }}>
              <Truck size={18} color="var(--green-mid)" style={{ flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500 }}>{format(new Date(item.date), 'EEE d MMM')}</div>
                <div className="text-muted">{item.title}</div>
              </div>
              <span style={{ ...badgeStyle, fontSize:11, padding:'3px 10px', borderRadius:12, fontWeight:500, flexShrink:0 }}>{label}</span>
            </div>
          );
        })}
      </main>
    </>
  );
}
