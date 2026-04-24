import { prisma } from '../config/db.js';
import 'dotenv/config';

async function promote() {
  const email = process.argv[2];
  if (!email) {
    console.error('Please provide an email: node promote-admin.js user@example.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
    console.log(`Success! ${user.name} (${user.email}) is now an ADMIN.`);
  } catch (error) {
    console.error('Error promoting user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

promote();
