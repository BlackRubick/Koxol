import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({ data: { name: parsed.name, email: parsed.email, passwordHash: hash } });
      // Attach any existing memberships that were created for this email (before the user registered)
      await prisma.membership.updateMany({ where: { userEmail: parsed.email, userId: null }, data: { userId: user.id } }).catch(() => null);

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      // fetch memberships now attached
  const membershipsRaw = await prisma.membership.findMany({ where: { userId: user.id } }).catch(() => []);
  const now = new Date();
  // attach computed benefits per plan
  const { getPlanBenefits } = require('../utils');
  const memberships = membershipsRaw.map(m => ({ ...m, active: now >= new Date(m.startedAt) && now <= new Date(m.expiresAt), benefits: getPlanBenefits(m.planKey) }));
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, memberships } });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || String(err) });
  }
});

router.post('/login', async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    // Fetch memberships for this user: either already linked by userId, or created earlier using the buyer email
  const membershipsRaw = await prisma.membership.findMany({ where: { OR: [{ userId: user.id }, { userEmail: user.email }] } }).catch(() => []);
  // Optionally attach orphan memberships to this user for consistency
  await prisma.membership.updateMany({ where: { userEmail: user.email, userId: null }, data: { userId: user.id } }).catch(() => null);
  const now = new Date();
  const { getPlanBenefits } = require('../utils');
  const memberships = membershipsRaw.map(m => ({ ...m, active: now >= new Date(m.startedAt) && now <= new Date(m.expiresAt), benefits: getPlanBenefits(m.planKey) }));
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, memberships } });
  } catch (err: any) {
    return res.status(400).json({ error: err?.message || String(err) });
  }
});

router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });
  const membershipsRaw = await prisma.membership.findMany({ where: { OR: [{ userId: user.id }, { userEmail: user.email }] } }).catch(() => []);
  // attach orphan memberships to the user record for future queries
  await prisma.membership.updateMany({ where: { userEmail: user.email, userId: null }, data: { userId: user.id } }).catch(() => null);
  const now = new Date();
  const { getPlanBenefits } = require('../utils');
  const memberships = membershipsRaw.map(m => ({ ...m, active: now >= new Date(m.startedAt) && now <= new Date(m.expiresAt), benefits: getPlanBenefits(m.planKey) }));
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, memberships } });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
