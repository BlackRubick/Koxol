export default async function handler(req, res) {
  // Diagnostic GET: allows checking that the serverless function is reachable and
  // whether HF_TOKEN is present in the environment (we do NOT return the token).
  if (req.method === 'GET') {
    res.status(200).json({ ok: true, hasToken: !!process.env.HF_TOKEN, env: process.env.VERCEL_ENV || 'local' });
    return;
  }

  // Log request method and url for easier debugging in Vercel logs
  console.log('hf-proxy invoked:', { method: req.method, url: req.url, headers: req.headers });

  // Este endpoint actúa como proxy a Hugging Face Router para ocultar la clave en producción.
  // Requisitos: configurar HF_TOKEN y HF_MODEL en las variables de entorno del servidor (ej. Vercel).

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', method: req.method });
    return;
  }

  try {
    const HF_TOKEN = process.env.HF_TOKEN;
    const HF_MODEL = process.env.HF_MODEL || 'google/flan-t5-small';

    if (!HF_TOKEN) {
      res.status(500).json({ error: 'HF_TOKEN not configured on server' });
      return;
    }

    // Some runtimes provide parsed req.body; as a fallback, read the raw body stream.
    let body = req.body;
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
      try {
        const raw = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => { data += chunk.toString(); });
          req.on('end', () => resolve(data));
          req.on('error', err => reject(err));
        });
        if (raw) {
          try { body = JSON.parse(raw); } catch (e) { body = { raw }; }
        }
      } catch (e) {
        console.warn('hf-proxy: could not read raw body', e);
      }
    }

    // Soportamos dos formatos desde el frontend: { prompt } o { messages }
    let payload;
    if (body?.messages) {
      // Si el cliente envía un array de mensajes (OpenAI-style), transformamos a la forma que espera el router
      // El router compatible con OpenAI chat puede aceptar { messages } directamente; reenviamos tal cual.
      payload = { model: HF_MODEL, messages: body.messages };
    } else if (body?.prompt) {
      payload = { inputs: body.prompt };
    } else if (body?.inputs) {
      payload = { inputs: body.inputs };
    } else {
      res.status(400).json({ error: 'Missing prompt or messages in request body' });
      return;
    }

    // Llamada al nuevo Hugging Face Router
    // Nota: la API clásica api-inference.huggingface.co está deprecada y devuelve 410.
    // Usamos el nuevo endpoint router.huggingface.co/hf-inference/{model}
    const routerUrl = `https://router.huggingface.co/hf-inference/${HF_MODEL}`;
    // Log router call (do NOT log HF_TOKEN)
    console.log('hf-proxy: calling HF router', { routerUrl, model: HF_MODEL, payloadPreview: typeof payload === 'string' ? payload.slice(0,200) : JSON.stringify(payload).slice(0,200) });
    const hfRes = await fetch(routerUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const text = await hfRes.text();
    const contentType = hfRes.headers.get('content-type') || '';
    // Log HF response status and a short preview of the body to help debugging (no secrets)
    console.log('hf-proxy: hfRes', { status: hfRes.status, contentType, bodyPreview: text ? text.slice(0,400) : '' });

    // Reenvía el código de estado y el cuerpo devuelto por HF
    if (hfRes.ok) {
      // Intentamos parsear JSON si aplica
      if (contentType.includes('application/json')) {
        const json = JSON.parse(text);
        res.status(200).json(json);
      } else {
        // Respuesta no JSON, la reenvíamos como texto
        res.setHeader('Content-Type', contentType || 'text/plain');
        res.status(200).send(text);
      }
    } else {
      // Error desde HF (reenvía el status y el cuerpo). Para 410 devolvemos una nota más clara.
      if (hfRes.status === 410) {
        res.status(410).json({ error: 'https://api-inference.huggingface.co is no longer supported. Please use https://router.huggingface.co/hf-inference instead.' });
      } else {
        // Reenvía body sin intentar parsear si no es JSON
        try {
          const maybeJson = JSON.parse(text);
          res.status(hfRes.status).json(maybeJson);
        } catch (e) {
          res.status(hfRes.status).send(text);
        }
      }
    }
  } catch (err) {
    console.error('hf-proxy error:', err);
    res.status(500).json({ error: String(err) });
  }
}
