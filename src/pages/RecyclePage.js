import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { RECYCLE_ITEMS } from '../utils/data';

const CATEGORIES = [
  { key:'all',      label:'All items',  icon:'♻️' },
  { key:'plastic',  label:'Plastic',    icon:'🧴' },
  { key:'paper',    label:'Paper',      icon:'📄' },
  { key:'glass',    label:'Glass',      icon:'🫙' },
  { key:'metal',    label:'Metal',      icon:'🥫' },
  { key:'hazardous',label:'Hazardous',  icon:'⚠️' },
];

const RECYCLABLE_STYLES = {
  yes:  { bg:'var(--green-light)',  color:'var(--green)',  label:'Recyclable'    },
  prep: { bg:'var(--amber-light)',  color:'var(--amber)',  label:'Prep needed'   },
  no:   { bg:'var(--red-light)',    color:'var(--red)',    label:'Not recyclable'},
};

export default function RecyclePage() {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => RECYCLE_ITEMS.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchQ   = !query || item.name.toLowerCase().includes(query.toLowerCase())
                            || item.note.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  }), [query, category]);

  return (
    <>
      <header className="page-header">
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20 }}>Recycling guide</h1>
        <p className="text-muted" style={{ marginTop:4 }}>What can go in the recycling bin?</p>
      </header>

      <main className="page fade-up">
        {/* Search */}
        <div style={{ position:'relative', marginBottom:'1rem' }}>
          <Search size={16} color="var(--text-muted)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} />
          <input
            className="form-input"
            style={{ paddingLeft:36 }}
            placeholder="Search items e.g. 'pizza box', 'batteries'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:'1.25rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                background: category === cat.key ? 'var(--green-light)' : 'var(--surface)',
                border: category === cat.key ? '1.5px solid var(--green)' : '0.5px solid var(--border)',
                borderRadius:'var(--radius-md)', padding:'0.75rem 0.5rem',
                cursor:'pointer', textAlign:'center', transition:'all 0.15s',
              }}
            >
              <div style={{ fontSize:20, marginBottom:4 }}>{cat.icon}</div>
              <div style={{ fontSize:12, fontWeight:500, color: category === cat.key ? 'var(--green)' : 'var(--text)' }}>{cat.label}</div>
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-muted mb-2" style={{ fontSize:12 }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>

        {/* Guide list */}
        {filtered.length === 0
          ? <div style={{ textAlign:'center', padding:'2rem 0', color:'var(--text-muted)' }}>No items found for "{query}"</div>
          : filtered.map(item => {
              const style = RECYCLABLE_STYLES[item.recyclable];
              return (
                <div key={item.id} className="card" style={{ marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:style.color, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{item.name}</div>
                    <div className="text-muted" style={{ fontSize:12, marginTop:2 }}>{item.note}</div>
                  </div>
                  <span style={{ background:style.bg, color:style.color, fontSize:11, padding:'3px 8px', borderRadius:10, fontWeight:500, flexShrink:0 }}>
                    {style.label}
                  </span>
                </div>
              );
            })
        }
      </main>
    </>
  );
}
