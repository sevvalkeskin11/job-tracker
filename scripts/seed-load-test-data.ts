import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const EMAIL = process.env.LOAD_TEST_EMAIL ?? "load-test@example.com";
const ROW_COUNT = 10_000;

const COMPANIES = ["Acme Corp", "Globex", "Initech", "Umbrella Co", "Hooli", "Stark Industries"];
const POSITIONS = ["Backend Engineer", "Frontend Developer", "Full Stack Engineer", "DevOps Engineer"];
const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

async function main() {
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) {
    throw new Error(`User ${EMAIL} not found. Run the load test once first to create it.`);
  }

  console.log(`Seeding ${ROW_COUNT} rows for user ${user.id}...`);

  const batchSize = 500;
  for (let i = 0; i < ROW_COUNT; i += batchSize) {
    const batch = Array.from({ length: Math.min(batchSize, ROW_COUNT - i) }, (_, j) => ({
      userId: user.id,
      company: COMPANIES[(i + j) % COMPANIES.length],
      position: POSITIONS[(i + j) % POSITIONS.length],
      status: STATUSES[(i + j) % STATUSES.length],
      appliedDate: new Date(2026, 0, 1 + ((i + j) % 180)),
      notes: `Seed row ${i + j}`,
    }));
    await prisma.application.createMany({ data: batch });
    console.log(`Inserted ${i + batch.length}/${ROW_COUNT}`);
  }

  console.log("Done seeding.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());