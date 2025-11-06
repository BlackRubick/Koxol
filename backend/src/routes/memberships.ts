import express from 'express';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Redeem a code and assign it to the logged user
router.post('/redeem', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });
    const membership = await prisma.membership.findUnique({ where: { activationCode: code } });
    if (!membership) return res.status(404).json({ error: 'Invalid code' });
    if (membership.userId) return res.status(400).json({ error: 'Code already used' });
    const updated = await prisma.membership.update({ where: { id: membership.id }, data: { userId: req.user.id } });
    return res.json({ membership: updated });
  } catch (err) {
    console.error('redeem err', err);
    return res.status(500).json({ error: String(err) });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    if (userId && req.user.role !== 'admin' && userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const where = userId ? { userId } : { userId: req.user.id };
    const memberships = await prisma.membership.findMany({ where });
    return res.json({ memberships });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
