// ── CleanCity Backend Server ──
// Node.js + Express — proxies Anthropic API calls (keeps API key server-side)

const express    = require('express');
const cors       = require('cors');
const Anthropic  = require('@anthropic-ai/sdk');
require('dotenv').config();

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json({ limit: '20mb' })); // allow base64 images

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── AI waste image classification ──
app.post('/api/classify', async (req, res) => {
  const { imageBase64, mediaType = 'image/jpeg' } = req.body;

  if (!imageBase64) return res.status(400).json({ error: 'imageBase64 is required' });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are an expert waste management AI for CleanCity, a South African smart waste app.
Analyse the uploaded image and classify the waste. Respond ONLY with valid JSON — no preamble or markdown.

Return this exact structure:
{
  "wasteType": "string",
  "materials": ["list of materials detected"],
  "estimatedVolume": "Small (<1 bag) | Medium (1-3 bags) | Large (3-10 bags) | Very large (>10 bags)",
  "priority": "low | medium | high | critical",
  "priorityReason": "one sentence",
  "recyclable": true or false,
  "recyclingTip": "brief tip",
  "suggestedAction": "what resident or collector should do"
}`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            { type: 'text', text: 'Classify this waste image.' },
          ],
        },
      ],
    });

    const text  = response.content.map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    console.error('Classification error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Reports CRUD (in-memory, replace with DB in production) ──
let reports = [
  { id:'WM-4821', lat:-29.791, lng:31.038, type:'Illegal dumping',   status:'In review', date:'2026-04-15', description:'' },
  { id:'WM-4802', lat:-29.800, lng:31.030, type:'Overflowing bin',   status:'Resolved',  date:'2026-04-10', description:'' },
  { id:'WM-4778', lat:-29.788, lng:31.044, type:'Missed collection', status:'Resolved',  date:'2026-04-05', description:'' },
];

app.get('/api/reports', (req, res) => res.json(reports));

app.post('/api/reports', (req, res) => {
  const { lat, lng, type, description, imageBase64 } = req.body;
  const id = 'WM-' + Math.floor(4800 + Math.random() * 500);
  const report = {
    id, lat, lng, type, description,
    status: 'Submitted',
    date: new Date().toISOString().split('T')[0],
    hasImage: !!imageBase64,
  };
  reports.push(report);
  res.status(201).json(report);
});

app.patch('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  const idx = reports.findIndex(r => r.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  reports[idx] = { ...reports[idx], ...req.body };
  res.json(reports[idx]);
});

// ── Schedule (static for now, extend with DB) ──
app.get('/api/schedule', (req, res) => {
  res.json([
    { id:1, date:'2026-04-17', title:'Recycling collection',        types:['Paper','Plastic','Glass'], route:'Durban North',     time:'07:00' },
    { id:2, date:'2026-04-19', title:'General waste',               types:['Black bin'],               route:'All Durban North', time:'06:00' },
    { id:3, date:'2026-04-24', title:'Garden refuse & bulky items', types:['Garden waste','Bulky items'],route:'Durban North',   time:'08:00' },
    { id:4, date:'2026-05-01', title:'Recycling collection',        types:['Paper','Plastic','Glass'], route:'Durban North',     time:'07:00' },
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CleanCity API running on port ${PORT}`));
