import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || '',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting database seed...\n');

  try {
    console.log('🌱 Seeding users...');

    const hashedPassword = await bcrypt.hash('Password123!', 12);

    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
          email: 'admin@example.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: UserRole.ADMIN,
          isActive: true,
        },
      }),
      prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
          email: 'user@example.com',
          password: hashedPassword,
          firstName: 'Regular',
          lastName: 'User',
          role: UserRole.USER,
          isActive: true,
        },
      }),
    ]);

    console.log(`✅ Created ${users.length} users`);
    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
