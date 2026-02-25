import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npm run seed-admin <email> <password>');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Retry logic for Neon cold start
  let retries = 5;
  while (retries > 0) {
    try {
      await prisma.$connect();
      break;
    } catch (e) {
      console.log(`Connecting to database... (${retries} attempts left)`);
      retries -= 1;
      if (retries === 0) throw e;
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s before retry
    }
  }

  try {
    const admin = await prisma.admin.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
      },
      create: {
        email,
        passwordHash: hashedPassword,
      },
    });
    console.log(`Admin created/updated: ${admin.email}`);
  } catch (e) {
    console.error('Error creating admin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
