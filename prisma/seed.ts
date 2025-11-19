/**
 * Database Seed Script
 * Run with: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create a test user with credits
  const testEmail = "test@plushifyme.com";
  const testPassword = "TestPassword123";

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email: testEmail },
  });

  if (!user) {
    const hashedPassword = await hash(testPassword, 10);

    user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Test User",
        emailVerified: new Date(),
        credits: 50, // Give test user 50 credits
      },
    });

    console.log("✅ Created test user:", {
      email: testEmail,
      password: testPassword,
      credits: 50,
    });
  } else {
    // Update existing user with credits
    user = await prisma.user.update({
      where: { email: testEmail },
      data: {
        credits: 50,
        emailVerified: new Date(),
      },
    });

    console.log("✅ Updated test user with 50 credits");
  }

  // Create sample transaction
  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: "purchase",
      credits: 50,
      amount: 9.95,
      description: "Initial credit purchase (seed data)",
      status: "completed",
    },
  });

  console.log("✅ Created sample transaction");
  console.log("\n🎉 Seed completed successfully!");
  console.log("\nTest credentials:");
  console.log(`  Email: ${testEmail}`);
  console.log(`  Password: ${testPassword}`);
  console.log(`  Credits: 50`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
