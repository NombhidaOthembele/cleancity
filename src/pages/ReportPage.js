import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import { Camera, Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { classifyWasteImage } from '../services/aiClassifier';
import { ISSUE_TYPES, MAP_CENTER, SAMPLE_REPORTS } from '../utils/data';

// Fix Leaflet default icon path issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function PinPlacer({ onPin }) {
  useMapEvents({ click(e) { onPin(e.latlng); } });
  return null;
}

const PRIORITY_COLORS = { low:'var(--green)', medium:'var(--amber)', high:'#E24B4A', critical:'#A32D2D' };

export default function ReportPage() {
  const [pin,        setPin]        = useState(null);
  const [issueType,  setIssueType]  = useState('');
  const [description,setDesc]       = useState('');
  const [image,      setImage]      = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [aiResult,   setAiResult]   = useState(null);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiError,    setAiError]    = useState('');
  const [submitted,  setSubmitted]  = useState(false);
  const fileRef = useRef();

  async function handleImageSelect(file) {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAiResult(null);
    setAiError('');
    setAiLoading(true);

    try {
      const result = await classifyWasteImage(file);
      setAiResult(result);
      if (result.wasteType) setIssueType(result.wasteType);
      toast.success('AI classification complete!');
    } catch (err) {
      setAiError('Could not classify image. Please select issue type manually.');
    } finally {
      setAiLoading(false);
    }
  }

  function handleSubmit() {
    if (!pin)       return toast.error('Please pin a location on the map');
    if (!issueType) return toast.error('Please select an issue type');
    const ref = 'WM-' + Math.floor(4800 + Math.random() * 200);
    setSubmitted(ref);
    toast.success(`Report ${ref} submitted!`);
  }

  if (submitted) return (
    <div className="page fade-up" style={{ paddingTop:'3rem', textAlign:'center' }}>
      <CheckCircle size={56} color="var(--green)" style={{ margin:'0 auto 1rem' }} />
      <h2 style={{ fontFamily:'var(--font-display)', marginBottom:8 }}>Report submitted!</h2>
      <p className="text-muted" style={{ marginBottom:'0.5rem' }}>Reference: <strong>{submitted}</strong></p>
      <p className="text-muted" style={{ marginBottom:'2rem' }}>You'll receive updates via notifications.</p>
      <button className="btn btn-primary btn-full" onClick={() => setSubmitted(false)}>Submit another report</button>
    </div>
  );

  return (
    <>
      <header className="page-header">
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20 }}>Report an issue</h1>
        <p className="text-muted" style={{ marginTop:4 }}>Tap the map to pin the exact location</p>
      </header>

      <main className="page fade-up">
        {/* Map */}
        <div style={{ height:200, borderRadius:'var(--radius-lg)', overflow:'hidden', marginBottom:'1rem', border:'0.5px solid var(--border)' }}>
          <MapContainer center={MAP_CENTER} zoom={14} style={{ height:'100%', width:'100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <PinPlacer onPin={setPin} />
            {pin && <Marker position={pin}><Popup>Your report location</Popup></Marker>}
            {SAMPLE_REPORTS.map(r => (
              <Marker key={r.id} position={[r.lat, r.lng]} icon={redIcon}>
                <Popup><strong>{r.type}</strong><br />{r.status}<br /><small>{r.date}</small></Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        {pin && <p className="text-muted mt-1 mb-2" style={{ fontSize:12 }}>📍 {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</p>}

        {/* Image upload */}
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: preview ? '0.5px solid var(--border)' : '1.5px dashed var(--border)',
            borderRadius:'var(--radius-lg)', padding:'1.25rem',
            textAlign:'center', cursor:'pointer', marginBottom:'1rem',
            background: preview ? 'transparent' : 'var(--surface2)',
            transition:'all 0.18s',
            position:'relative', overflow:'hidden',
          }}
        >
          <input
            ref={fileRef} type="file" accept="image/*" capture="environment"
            style={{ display:'none' }}
            onChange={e => handleImageSelect(e.target.files[0])}
          />
          {preview
            ? <img src={preview} alt="preview" style={{ maxHeight:140, borderRadius:'var(--radius-sm)', objectFit:'cover' }} />
            : <>
                <Camera size={28} color="var(--text-muted)" style={{ margin:'0 auto 8px' }} />
                <div style={{ fontSize:13, fontWeight:500 }}>Take photo or upload image</div>
                <div className="text-muted" style={{ fontSize:11, marginTop:4 }}>AI will classify the waste type automatically</div>
              </>
          }
        </div>

        {/* AI result */}
        {aiLoading && (
          <div style={{ background:'var(--teal-light)', borderRadius:'var(--radius-md)', padding:'0.875rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:10 }}>
            <div className="spinner" style={{ width:18, height:18 }} />
            <span style={{ fontSize:13, color:'var(--teal)' }}>Analysing image with AI...</span>
          </div>
        )}

        {aiResult && !aiLoading && (
          <div style={{ background:'var(--teal-light)', borderRadius:'var(--radius-md)', padding:'0.875rem', marginBottom:'1rem' }}>
            <div style={{ fontSize:12, fontWeight:500, color:'var(--teal)', marginBottom:8 }}>AI classification result</div>
            {[
              ['Type',     aiResult.wasteType],
              ['Materials',aiResult.materials?.join(', ')],
              ['Volume',   aiResult.estimatedVolume],
              ['Priority', aiResult.priority?.toUpperCase()],
              ['Tip',      aiResult.recyclingTip || aiResult.suggestedAction],
            ].map(([k, v]) => v && (
              <div key={k} style={{ display:'flex', gap:8, marginBottom:4 }}>
                <span style={{ fontSize:12, color:'var(--teal)', opacity:0.7, width:64, flexShrink:0 }}>{k}</span>
                <span style={{ fontSize:12, color:'var(--teal)', fontWeight: k==='Priority' ? 500 : 400,
                  color: k==='Priority' ? PRIORITY_COLORS[aiResult.priority] : 'var(--teal)' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {aiError && (
          <div style={{ background:'var(--red-light)', borderRadius:'var(--radius-md)', padding:'0.875rem', marginBottom:'1rem', display:'flex', gap:8 }}>
            <AlertCircle size={16} color="var(--red)" style={{ flexShrink:0, marginTop:1 }} />
            <span style={{ fontSize:13, color:'var(--red)' }}>{aiError}</span>
          </div>
        )}

        {/* Form */}
        <div className="form-group">
          <label className="form-label">Issue type</label>
          <select className="form-select" value={issueType} onChange={e => setIssueType(e.target.value)}>
            <option value="">Select issue type...</option>
            {ISSUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea className="form-textarea" placeholder="Add any extra details..." value={description} onChange={e => setDesc(e.target.value)} />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSubmit}>Submit report</button>
      </main>
    </>
  );
}
