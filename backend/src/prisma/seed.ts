import prisma from '../prisma';

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
  console.log('Seed complete');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
