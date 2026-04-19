import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import { SCHEDULE, TYPE_COLORS } from '../utils/data';

export default function SchedulePage() {
  const today     = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const weekDays  = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [selected, setSelected] = useState(today);

  const scheduledDates = SCHEDULE.map(s => s.date);

  const visible = SCHEDULE.filter(s => {
    const d = parseISO(s.date);
    return d >= today;
  });

  return (
    <>
      <header className="page-header">
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20 }}>Collection schedule</h1>
        <p className="text-muted" style={{ marginTop:4 }}>Durban North — {format(today, 'MMMM yyyy')}</p>
      </header>

      <main className="page fade-up">
        {/* Week strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:'1.25rem' }}>
          {weekDays.map(day => {
            const isToday    = isSameDay(day, today);
            const hasEvent   = scheduledDates.includes(format(day, 'yyyy-MM-dd'));
            const isSelected = isSameDay(day, selected);

            return (
              <div
                key={day}
                onClick={() => setSelected(day)}
                style={{
                  textAlign:'center', padding:'8px 4px', borderRadius:'var(--radius-sm)',
                  cursor:'pointer',
                  background: isToday ? 'var(--green)' : isSelected ? 'var(--green-light)' : 'transparent',
                  border: isSelected && !isToday ? '1px solid var(--green)' : 'none',
                  transition:'all 0.15s',
                }}
              >
                <div style={{ fontSize:10, color: isToday ? '#fff' : 'var(--text-muted)', marginBottom:4 }}>
                  {format(day, 'EEE')}
                </div>
                <div style={{ fontSize:14, fontWeight:500, color: isToday ? '#fff' : 'var(--text)' }}>
                  {format(day, 'd')}
                </div>
                {hasEvent && (
                  <div style={{ width:4, height:4, borderRadius:'50%', background: isToday ? '#fff' : 'var(--green-mid)', margin:'3px auto 0' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Schedule list */}
        <h2 style={{ fontSize:14, fontFamily:'var(--font-display)', marginBottom:'0.75rem' }}>Upcoming collections</h2>

        {visible.map(item => (
          <div key={item.id} style={{ background:'var(--surface)', border:'0.5px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'1rem', marginBottom:'0.75rem', display:'flex', gap:12 }}>
            {/* Date box */}
            <div style={{ minWidth:44, textAlign:'center', background:'var(--surface2)', borderRadius:'var(--radius-sm)', padding:'8px 6px' }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {format(parseISO(item.date), 'MMM')}
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, lineHeight:1.1 }}>
                {format(parseISO(item.date), 'd')}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:500, marginBottom:4 }}>{item.title}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                <Clock size={12} color="var(--text-muted)" />
                <span className="text-muted" style={{ fontSize:12 }}>From {item.time}</span>
                <MapPin size={12} color="var(--text-muted)" style={{ marginLeft:4 }} />
                <span className="text-muted" style={{ fontSize:12 }}>{item.route}</span>
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {item.types.map(t => {
                  const c = TYPE_COLORS[t] || { bg:'var(--surface2)', color:'var(--text-muted)' };
                  return (
                    <span key={t} style={{ background:c.bg, color:c.color, fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:500 }}>
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
