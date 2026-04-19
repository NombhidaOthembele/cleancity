import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { format } from 'date-fns';
import { CheckCircle, Clock, AlertTriangle, Truck, ChevronRight, Filter } from 'lucide-react';
import { StatusBadge, PriorityDot, SectionHeader, Avatar } from '../components/UI';
import { MAP_CENTER, SAMPLE_REPORTS } from '../utils/data';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ALL_REPORTS = [
  { id:'WM-4821', lat:-29.791, lng:31.038, type:'Illegal dumping',   status:'In review',   priority:'high',   date:'2026-04-15', zone:'Durban North',   assignee:'Sipho M.' },
  { id:'WM-4802', lat:-29.800, lng:31.030, type:'Overflowing bin',   status:'Resolved',    priority:'medium', date:'2026-04-10', zone:'Umhlanga Ridge', assignee:'Thandi K.' },
  { id:'WM-4778', lat:-29.788, lng:31.044, type:'Missed collection', status:'Resolved',    priority:'low',    date:'2026-04-05', zone:'Durban North',   assignee:'Sipho M.' },
  { id:'WM-4833', lat:-29.795, lng:31.025, type:'Hazardous waste',   status:'Submitted',   priority:'critical',date:'2026-04-16',zone:'Morningside',    assignee:null },
  { id:'WM-4841', lat:-29.782, lng:31.041, type:'Damaged bin',       status:'Assigned',    priority:'low',    date:'2026-04-17', zone:'La Lucia',       assignee:'Thandi K.' },
  { id:'WM-4845', lat:-29.803, lng:31.055, type:'Illegal dumping',   status:'In progress', priority:'high',   date:'2026-04-17', zone:'Umhlanga',       assignee:'Sipho M.' },
];

const COLLECTORS = [
  { name:'Sipho Mthembu',   initials:'SM', zone:'Durban North',   active:3, resolved:28 },
  { name:'Thandi Khumalo',  initials:'TK', zone:'Umhlanga Ridge', active:1, resolved:19 },
  { name:'Bongani Zulu',    initials:'BZ', zone:'Morningside',    active:0, resolved:14 },
];

const STATUS_FLOW = ['Submitted','Assigned','In review','In progress','Resolved'];

export default function CollectorDashboard() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReport, setSelected]   = useState(null);
  const [reports, setReports]           = useState(ALL_REPORTS);

  const filtered = filterStatus === 'all'
    ? reports
    : reports.filter(r => r.status.toLowerCase().replace(' ','-') === filterStatus);

  const stats = {
    total:      reports.length,
    open:       reports.filter(r => !['Resolved','Closed'].includes(r.status)).length,
    critical:   reports.filter(r => r.priority === 'critical').length,
    resolved:   reports.filter(r => r.status === 'Resolved').length,
  };

  function advanceStatus(id) {
    setReports(prev => prev.map(r => {
      if (r.id !== id) return r;
      const idx = STATUS_FLOW.indexOf(r.status);
      const next = STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)];
      return { ...r, status: next };
    }));
    if (selectedReport?.id === id) {
      setSelected(prev => {
        const idx = STATUS_FLOW.indexOf(prev.status);
        return { ...prev, status: STATUS_FLOW[Math.min(idx + 1, STATUS_FLOW.length - 1)] };
      });
    }
  }

  const PRIORITY_COLOR = { low:'var(--green-mid)', medium:'var(--amber)', high:'#E24B4A', critical:'#A32D2D' };

  return (
    <>
      <header className="page-header">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:20 }}>Collector dashboard</h1>
            <p className="text-muted" style={{ marginTop:4 }}>eThekwini Waste Management · {format(new Date(),'d MMMM yyyy')}</p>
          </div>
          <Avatar initials="CC" bg="var(--teal-light)" color="var(--teal)" />
        </div>
      </header>

      <main className="page fade-up">
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:'1.25rem' }}>
          {[
            { num: stats.total,    label:'Total',    color:'var(--text)'      },
            { num: stats.open,     label:'Open',     color:'var(--amber)'     },
            { num: stats.critical, label:'Critical', color:'#E24B4A'          },
            { num: stats.resolved, label:'Resolved', color:'var(--green)'     },
          ].map(s => (
            <div key={s.label} style={{ background:'var(--surface2)', borderRadius:'var(--radius-sm)', padding:'0.625rem', textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:s.color }}>{s.num}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Map overview */}
        <div style={{ height:180, borderRadius:'var(--radius-lg)', overflow:'hidden', marginBottom:'1.25rem', border:'0.5px solid var(--border)' }}>
          <MapContainer center={MAP_CENTER} zoom={13} style={{ height:'100%', width:'100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {reports.filter(r => r.status !== 'Resolved').map(r => (
              <Marker key={r.id} position={[r.lat, r.lng]}>
                <Popup>
                  <strong>{r.type}</strong><br />
                  Priority: {r.priority}<br />
                  {r.assignee ? `Assigned: ${r.assignee}` : 'Unassigned'}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Filter tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:'1rem', overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
          {['all','submitted','assigned','in-review','in-progress','resolved'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                flexShrink:0, padding:'5px 12px', borderRadius:20,
                fontSize:12, fontWeight:500, cursor:'pointer',
                background: filterStatus === s ? 'var(--green)' : 'transparent',
                color:       filterStatus === s ? '#fff' : 'var(--text-muted)',
                border:      filterStatus === s ? 'none' : '0.5px solid var(--border)',
                transition:'all 0.15s',
              }}
            >
              {s === 'all' ? 'All' : s.replace('-',' ').replace(/^\w/, c => c.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Reports list */}
        <SectionHeader title={`Reports (${filtered.length})`} />

        {filtered.map(r => (
          <div
            key={r.id}
            className="card"
            style={{ marginBottom:'0.5rem', cursor:'pointer', display:'flex', gap:10, alignItems:'flex-start' }}
            onClick={() => setSelected(r)}
          >
            <PriorityDot priority={r.priority} size={10} style={{ marginTop:5 }} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{r.type}</span>
                <StatusBadge status={r.status} />
              </div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                {r.id} · {r.zone} · {r.date}
              </div>
              {r.assignee
                ? <div style={{ fontSize:12, color:'var(--teal)', marginTop:3 }}>👷 {r.assignee}</div>
                : <div style={{ fontSize:12, color:'var(--amber)', marginTop:3 }}>⚠ Unassigned</div>
              }
            </div>
            <ChevronRight size={14} color="var(--text-muted)" style={{ flexShrink:0, marginTop:2 }} />
          </div>
        ))}

        {/* Report detail modal (inline) */}
        {selectedReport && (
          <div
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200, display:'flex', alignItems:'flex-end' }}
            onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <div style={{
              background:'var(--surface)', borderRadius:'var(--radius-lg) var(--radius-lg) 0 0',
              padding:'1.5rem 1.25rem', width:'100%', maxHeight:'80vh', overflowY:'auto',
              animation:'fadeUp 0.2s ease',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                <div>
                  <h2 style={{ fontFamily:'var(--font-display)', fontSize:18 }}>{selectedReport.type}</h2>
                  <p className="text-muted" style={{ fontSize:12, marginTop:2 }}>{selectedReport.id} · {selectedReport.zone}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'var(--text-muted)' }}>✕</button>
              </div>

              <div style={{ marginBottom:'1rem' }}>
                {[
                  ['Status',   <StatusBadge status={selectedReport.status} />],
                  ['Priority', <span style={{ fontSize:12, fontWeight:500, color: PRIORITY_COLOR[selectedReport.priority] }}>{selectedReport.priority.toUpperCase()}</span>],
                  ['Zone',     selectedReport.zone],
                  ['Date',     selectedReport.date],
                  ['Assigned', selectedReport.assignee || 'Unassigned'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'0.5px solid var(--border)' }}>
                    <span style={{ fontSize:13, color:'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontSize:13, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Status flow */}
              <div style={{ display:'flex', gap:4, marginBottom:'1.25rem', overflowX:'auto' }}>
                {STATUS_FLOW.map((s, i) => {
                  const currentIdx = STATUS_FLOW.indexOf(selectedReport.status);
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  return (
                    <div key={s} style={{ flex:1, textAlign:'center', minWidth:60 }}>
                      <div style={{
                        height:4, borderRadius:2, marginBottom:5,
                        background: done || active ? 'var(--green)' : 'var(--border)',
                      }} />
                      <div style={{ fontSize:10, color: active ? 'var(--green)' : done ? 'var(--text-muted)' : 'var(--border)', fontWeight: active ? 500 : 400 }}>{s}</div>
                    </div>
                  );
                })}
              </div>

              {selectedReport.status !== 'Resolved' && (
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => advanceStatus(selectedReport.id)}
                >
                  Advance to: {STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(selectedReport.status) + 1, STATUS_FLOW.length - 1)]}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Collectors */}
        <SectionHeader title="Collector team" style={{ marginTop:'1.5rem' }} />
        {COLLECTORS.map(c => (
          <div key={c.name} className="card" style={{ marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:12 }}>
            <Avatar initials={c.initials} size={38} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500 }}>{c.name}</div>
              <div className="text-muted" style={{ fontSize:12 }}>{c.zone}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:12, color:'var(--amber)', fontWeight:500 }}>{c.active} active</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{c.resolved} resolved</div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
