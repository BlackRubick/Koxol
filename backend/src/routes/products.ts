import express from 'express';

const router = express.Router();

// Import products from the main project's src/data/products.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
let products: any = [];
try {
  // path relative from backend/src/routes -> ../../../src/data/products.js
  // @ts-ignore
  const imported = require('../../../src/data/products');
  products = imported && imported.default ? imported.default : imported;
} catch (err) {
  console.error('Could not load project products:', err);
}

router.get('/', (req, res) => {
  return res.json({ ok: true, products });
});

export default router;
