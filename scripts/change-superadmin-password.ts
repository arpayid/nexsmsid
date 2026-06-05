import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERADMIN_EMAIL || 'superadmin@nexsmsid.dev';
  const newPassword = process.env.NEW_PASSWORD;

  if (!newPassword) {
    console.error('NEW_PASSWORD environment variable is required');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashedPassword }
  });

  console.log(`Password updated successfully for ${email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
