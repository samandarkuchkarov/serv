// serv-api/seed.ts
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is missing');

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@serve.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error('❌ ADMIN_PASSWORD is missing in .env file');
  }

  console.log(`Seeding admin: ${email}`);
  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashed,
    },
    create: {
      email,
      password: hashed,
    },
  });

  console.log('✅ Admin user seeded successfully!');
  console.log('📧 Email :', admin.email);
  console.log('🔑 Password :', password);
  console.log('🆔 ID     :', admin.id);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
