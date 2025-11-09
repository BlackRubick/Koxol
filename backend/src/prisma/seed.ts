import prisma from '../prisma';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding products from project file...');
  // Load products from main project
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const imported = require('../../../src/data/products');
  const products = imported && imported.default ? imported.default : imported;
  for (const p of products) {
    try {
      await prisma.product.upsert({ where: { id: p.id }, update: { name: p.name, price: p.price, desc: p.desc, image: p.image, images: p.images || null, video: p.video || null }, create: { id: p.id, name: p.name, price: p.price, desc: p.desc || null, image: p.image || null, images: p.images || null, video: p.video || null } });
    } catch (err) {
      console.error('Product seed error', p.id, err);
    }
  }
  // Create or update an admin user. Credentials can be provided via
  // environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin';

    if (!process.env.ADMIN_EMAIL) {
      console.warn('No ADMIN_EMAIL set — using default admin@example.com (only for local/dev use)');
    }
    if (!process.env.ADMIN_PASSWORD) {
      console.warn('No ADMIN_PASSWORD set — using default password "admin123" (only for local/dev use)');
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: adminName, passwordHash, role: 'admin' },
      create: { name: adminName, email: adminEmail, passwordHash, role: 'admin' },
    });
    console.log(`Admin user ensured: ${admin.email} (role=${admin.role})`);
  } catch (err) {
    console.error('Admin seed error', err);
  }

  console.log('Seed complete');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
