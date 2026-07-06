import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL = process.env.LOAD_TEST_EMAIL ?? "load-test@example.com";

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) {
    console.log("No load-test user found, nothing to clean up.");
    return;
  }

  const { count } = await prisma.application.deleteMany({ where: { userId: user.id } });
  console.log(`Deleted ${count} applications for ${EMAIL}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());