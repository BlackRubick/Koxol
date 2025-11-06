import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import products from '../src/data/products.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use a dedicated proxy port so it doesn't collide with the main backend PORT
const PORT = process.env.PROXY_PORT || process.env.PORT || 4001;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_MODEL = process.env.GOOGLE_MODEL || 'gemini-2.5-flash';

// Initialize Google GenAI client when possible. Prefer ADC (service account) if provided.
let googleAi = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // ADC: client will pick up credentials from GOOGLE_APPLICATION_CREDENTIALS
    googleAi = new GoogleGenAI();
    console.log('Google GenAI client initialized via ADC (GOOGLE_APPLICATION_CREDENTIALS)');
  } else if (GOOGLE_API_KEY) {
    // API key based client
    googleAi = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
    console.log('Google GenAI client initialized with GOOGLE_API_KEY');
  }
} catch (e) {
  console.warn('Failed to initialize @google/genai client:', e?.message || e);
  googleAi = null;
}

app.post('/api/chatgpt-proxy', async (req, res) => {
  try {
    const { prompt, model } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    function buildCatalogSummary(productsList) {
      return productsList.map(p => `- ${p.name}: ${p.desc} (precio: ${p.price} MXN)`).join('\n');
    }

    const catalog = buildCatalogSummary(products || []);
    const systemInstruction = `Eres el asistente de la tienda K'oxol. RESPONDE SOLO SOBRE LA TIENDA, SUS PRODUCTOS Y POLÍTICAS. Si te preguntan algo fuera de la tienda responde: "Lo siento, solo puedo ayudar con información sobre la tienda K'oxol y sus productos."\n\nCatálogo:\n${catalog}\n\nResponde de forma breve y clara:`;
    const combined = `${systemInstruction}\n\nUsuario: ${String(prompt)}`;

    // If we have an initialized client, use it (supports service-account ADC or API key constructor)
    const usedModel = model || GOOGLE_MODEL; // e.g. 'gemini-2.5-flash' or 'text-bison-001'
    if (googleAi) {
      try {
        // Use client generateContent; accepts model names like 'gemini-2.5-flash'
        const response = await googleAi.models.generateContent({ model: usedModel, contents: String(combined) });
        // Response.text is the common short helper per SDK example
        const text = response?.text || JSON.stringify(response);
        return res.json({ text, raw: response });
      } catch (e) {
        console.error('Google GenAI client error:', e?.message || e);
        // fallthrough to REST fallback if API key present
        if (!GOOGLE_API_KEY) return res.status(502).json({ error: 'Google GenAI client error', detail: String(e) });
      }
    }

    // REST fallback using API key (ensure model path uses 'models/{model}' form)
    if (GOOGLE_API_KEY) {
      const modelPath = usedModel.startsWith('models/') ? usedModel : `models/${usedModel}`;
      const url = `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${GOOGLE_API_KEY}`;

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
      const text = json?.candidates?.[0]?.content || json?.output?.[0]?.content || JSON.stringify(json);
      return res.json({ text, raw: json });
    }

    return res.status(500).json({
      error: 'Google credentials not configured',
      detail: "Set GOOGLE_API_KEY in backend/.env (recommended for quick tests) or set GOOGLE_APPLICATION_CREDENTIALS pointing to a service-account JSON and restart the proxy."
    });
  } catch (err) {
    console.error('Google proxy error', err);
    return res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Chat proxy (Google-first) listening on http://localhost:${PORT}/api/chatgpt-proxy`);
});
