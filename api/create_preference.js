export default async function handler(req, res) {
  // Creates a Mercado Pago preference (Checkout Pro) using server-side access token
  // Expected: POST with { items: [{ title, unit_price, quantity }], payer? }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      res.status(500).json({ error: 'MERCADOPAGO_ACCESS_TOKEN not configured on server' });
      return;
    }

    const body = req.body || {};
    const items = body.items || [];

    const preference = {
      items,
      back_urls: body.back_urls || {},
      auto_return: body.auto_return || 'approved'
    };

    // Optionally include payer info
    if (body.payer) preference.payer = body.payer;

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    const data = await mpRes.json();
    if (!mpRes.ok) {
      res.status(mpRes.status).json({ error: data });
      return;
    }

    // Return init_point and id
    res.status(200).json({ init_point: data.init_point, sandbox_init_point: data.sandbox_init_point, id: data.id });
  } catch (err) {
    console.error('create_preference error:', err);
    res.status(500).json({ error: String(err) });
  }
}
