// Database seeding script
// Run with: npm run seed

import sequelize from "./database.js";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Import User model lazily to avoid circular import before DB init
    const { default: User } = await import("../models/User.js");

    // Create a test user if none exists
    const existing = await User.findOne({
      where: { email: "test@example.com" },
    });
    if (!existing) {
      const bcrypt = await import("bcryptjs");
      const passwordHash = await bcrypt.hash("password123", 10);
      await User.create({
        username: "testuser",
        email: "test@example.com",
        passwordHash,
      });
      console.log("🌱 Created test user: test@example.com / password123");
    } else {
      console.log("🌱 Test user already exists");
    }

    console.log("✅ Database seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
