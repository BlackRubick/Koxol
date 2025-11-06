import express from 'express';
import prisma from '../prisma';
import { authMiddleware, adminOnly, AuthRequest } from '../middleware/auth';
import { slugifyPlan, generateActivationCode, addMonths } from '../utils';

const router = express.Router();

// Create order (public)
router.post('/', async (req: any, res) => {
  try {
    const { buyer, items, total } = req.body;
    console.log('create order payload:', JSON.stringify(req.body));
    if (!buyer || !buyer.name || !buyer.email) {
      console.warn('create order validation failed, missing buyer.name or buyer.email');
      return res.status(400).json({ error: 'buyer.name and buyer.email are required', received: { buyer } });
    }

    const order = await prisma.order.create({ data: { buyerName: buyer.name, buyerEmail: buyer.email, buyerData: buyer, items: items || [], total: Number(total) || 0 } });
    return res.status(201).json({ order });
  } catch (err) {
    console.error('create order err', err);
    return res.status(500).json({ error: String(err) });
  }
});

// List orders (mine or all if admin)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const mine = req.query.mine === 'true';
    if (mine) {
      const orders = await prisma.order.findMany({ where: { buyerEmail: req.user.email } });
      return res.json({ orders });
    }
    // admin only
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

// Confirm order (admin) -> generate membership codes
router.patch('/:id/confirm', authMiddleware, adminOnly, async (req: AuthRequest, res) => {
  try {
    const id = req.params.id;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'confirmed') return res.status(400).json({ error: 'Already confirmed' });

    const items: any[] = order.items as any[] || [];
    const generatedCodes: string[] = [];
    const now = new Date();

    for (const item of items) {
      if (!item || !item.isMembership) continue;
      const billing = item.billing || 'monthly';
      const months = billing === 'yearly' ? 12 : 1;
      const planKey = slugifyPlan(item.name || item.id || 'plan');
      const code = generateActivationCode(planKey, billing === 'yearly' ? 'yearly' : 'monthly');
      generatedCodes.push(code);
      const startedAt = now;
      const expiresAt = addMonths(now, months);
  // determine benefits and discount from plan definition
  const planBenefits = require('../utils').getPlanBenefits(planKey);
  const discount = planBenefits?.discountPercent || 0;

      // try to find user by email
      let user = await prisma.user.findUnique({ where: { email: order.buyerEmail } }).catch(() => null);

      await prisma.membership.create({ data: {
        orderId: order.id,
        userId: user?.id,
        planKey,
        activationCode: code,
        billing: billing,
        discountPercent: discount,
        startedAt,
        expiresAt,
        grantedAt: now,
        userEmail: order.buyerEmail
      }});
    }

    const updated = await prisma.order.update({ where: { id }, data: { status: 'confirmed', confirmedAt: new Date() } });
    return res.json({ order: updated, generatedCodes });
  } catch (err) {
    console.error('confirm order err', err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
