import React, { useState } from 'react';
import { Bell, Truck, FileText, Calendar, Lightbulb } from 'lucide-react';
import { NOTIFICATIONS } from '../utils/data';

const NOTIF_ICON = {
  collection: Truck,
  report:     FileText,
  event:      Calendar,
  tip:        Lightbulb,
};

const NOTIF_COLORS = {
  collection: 'var(--green-mid)',
  report:     'var(--teal-mid)',
  event:      'var(--amber)',
  tip:        'var(--gray)',
};

const SETTINGS = [
  { key:'collection', label:'Collection day reminders',  default: true  },
  { key:'reports',    label:'Report status updates',     default: true  },
  { key:'special',    label:'Special collection alerts', default: true  },
  { key:'tips',       label:'Community waste tips',      default: false },
  { key:'hazardous',  label:'Hazardous waste events',    default: true  },
];

export default function NotificationsPage() {
  const [alerts, setAlerts]  = useState(NOTIFICATIONS);
  const [prefs, setPrefs]    = useState(
    Object.fromEntries(SETTINGS.map(s => [s.key, s.default]))
  );

  function markRead(id) {
    setAlerts(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function toggle(key) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const unread = alerts.filter(n => !n.read).length;

  return (
    <>
      <header className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:20 }}>Alerts</h1>
          {unread > 0 && (
            <span style={{ background:'var(--red-light)', color:'var(--red)', fontSize:11, padding:'2px 8px', borderRadius:12, fontWeight:500 }}>
              {unread} new
            </span>
          )}
        </div>
        <p className="text-muted" style={{ marginTop:4 }}>Notifications & preferences</p>
      </header>

      <main className="page fade-up">
        {/* Recent alerts */}
        <h2 style={{ fontSize:14, fontFamily:'var(--font-display)', marginBottom:'0.75rem' }}>Recent</h2>

        {alerts.map(n => {
          const Icon  = NOTIF_ICON[n.type] || Bell;
          const color = NOTIF_COLORS[n.type] || 'var(--gray)';
          return (
            <div
              key={n.id}
              className="card"
              onClick={() => markRead(n.id)}
              style={{
                marginBottom:'0.5rem', display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer',
                borderLeft: !n.read ? `3px solid ${color}` : '0.5px solid var(--border)',
                background: !n.read ? 'var(--surface)' : 'var(--surface2)',
              }}
            >
              <Icon size={16} color={color} style={{ flexShrink:0, marginTop:2 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight: n.read ? 400 : 500 }}>{n.title}</div>
                <div className="text-muted" style={{ fontSize:11, marginTop:3 }}>{n.time}</div>
              </div>
              {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:color, flexShrink:0, marginTop:4 }} />}
            </div>
          );
        })}

        {/* Preferences */}
        <h2 style={{ fontSize:14, fontFamily:'var(--font-display)', margin:'1.5rem 0 0.75rem' }}>Notification settings</h2>

        <div className="card" style={{ padding:'0 1.25rem' }}>
          {SETTINGS.map((s, i) => (
            <div
              key={s.key}
              style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'0.875rem 0',
                borderBottom: i < SETTINGS.length - 1 ? '0.5px solid var(--border)' : 'none',
              }}
            >
              <span style={{ fontSize:13 }}>{s.label}</span>
              <div className={`toggle ${prefs[s.key] ? 'on' : ''}`} onClick={() => toggle(s.key)} />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
