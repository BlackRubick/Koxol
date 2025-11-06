// Serverless proxy: Google-first (Generative Language API)
// Usage: POST { prompt: string, model?: string } -> { text, raw }
// Configure either GOOGLE_API_KEY in environment (quick) or set GOOGLE_APPLICATION_CREDENTIALS to a service-account JSON
import products from '../src/data/products.js';

function buildCatalogSummary(productsList) {
  return productsList.map(p => `- ${p.name}: ${p.desc} (precio: ${p.price} MXN)`).join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, model } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const modelName = model || process.env.GOOGLE_MODEL || 'gemini-1.5-flash';
  const modelPath = modelName.startsWith('models/') ? modelName : `models/${modelName}`;

  if (GOOGLE_API_KEY) {
    const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${GOOGLE_API_KEY}`;
    try {
      const catalog = buildCatalogSummary(products || []);
      const systemInstruction = `Eres el asistente de la tienda K'oxol. RESPONDE SOLO SOBRE LA TIENDA, SUS PRODUCTOS Y POLÍTICAS. Si te preguntan algo fuera de la tienda responde: "Lo siento, solo puedo ayudar con información sobre la tienda K'oxol y sus productos."\n\nCatálogo:\n${catalog}\n\nResponde de forma breve y clara:`;
      const combined = `${systemInstruction}\n\nUsuario: ${String(prompt)}`;

      const body = {
        input: combined,
        temperature: 0.6,
        maxOutputTokens: 512,
      };
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text();
        return res.status(502).json({ error: 'Google Generative API error', detail: txt });
      }
      const json = await resp.json();
      const text = json?.candidates?.[0]?.output || json?.output?.[0]?.content || JSON.stringify(json);
      return res.json({ text, raw: json });
    } catch (err) {
      console.error('google-proxy error:', err);
      return res.status(500).json({ error: String(err) });
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return res.status(501).json({ error: 'ADC/service-account detected but serverless ADC flow not implemented here. Use GOOGLE_API_KEY for quick testing or ask me to implement ADC support.' });
  }

  return res.status(500).json({ error: 'Google API key not configured on the server. Set GOOGLE_API_KEY in Vercel/hosting env or backend/.env for local dev.' });
}
