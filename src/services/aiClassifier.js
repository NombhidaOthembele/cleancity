// ── AI Waste Classification Service ──
// Uses Anthropic claude-sonnet-4-20250514 vision to classify waste images

const SYSTEM_PROMPT = `You are an expert waste management AI for CleanCity, a South African smart waste app.
Analyse the uploaded image and classify the waste. Respond ONLY with valid JSON — no preamble or markdown.

Return this exact structure:
{
  "wasteType": "string (e.g. 'Illegal dumping', 'Overflowing bin', 'Recyclable waste', 'Hazardous waste', 'General waste')",
  "materials": ["list", "of", "materials", "detected"],
  "estimatedVolume": "string (e.g. 'Small (< 1 bag)', 'Medium (1–3 bags)', 'Large (3–10 bags)', 'Very large (> 10 bags)')",
  "priority": "low | medium | high | critical",
  "priorityReason": "string — one sentence explaining priority",
  "recyclable": true | false,
  "recyclingTip": "string — brief tip if recyclable, else disposal advice",
  "suggestedAction": "string — what the resident or collector should do"
}`;

/**
 * Classify a waste image using Claude's vision.
 * @param {File} imageFile — browser File object
 * @returns {Promise<Object>} — parsed classification result
 */
export async function classifyWasteImage(imageFile) {
  // Convert File → base64
  const base64 = await fileToBase64(imageFile);
  const mediaType = imageFile.type || 'image/jpeg';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: 'Please classify this waste image and return the JSON result.',
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'AI classification failed');
  }

  const data = await response.json();
  const text = data.content.map((b) => (b.type === 'text' ? b.text : '')).join('');

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
