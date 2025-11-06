import products from '../src/data/products';

export default async function handler(req, res) {
  try {
    // Simple endpoint que devuelve el listado de productos centralizado
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ ok: true, products });
  } catch (err) {
    console.error('Error en /api/products:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}
