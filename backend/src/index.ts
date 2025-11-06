import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import ordersRoutes from './routes/orders';
import membershipsRoutes from './routes/memberships';
import productsRoutes from './routes/products';
import prisma from './prisma';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/memberships', membershipsRoutes);
app.use('/api/products', productsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`Backend listening on http://localhost:${port}`);
  try { await prisma.$connect(); console.log('Prisma connected'); } catch (e) { console.error('Prisma connect failed', e); }
});
