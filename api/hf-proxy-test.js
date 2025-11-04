export default async function handler(req, res) {
  console.log('hf-proxy-test invoked', { method: req.method, url: req.url });

  if (req.method === 'GET') {
    res.status(200).json({ ok: true, msg: 'hf-proxy-test GET ok' });
    return;
  }

  if (req.method === 'POST') {
    // try to parse body similarly to hf-proxy
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
        console.warn('hf-proxy-test: could not read raw body', e);
      }
    }

    res.status(200).json({ ok: true, method: 'POST', body });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
