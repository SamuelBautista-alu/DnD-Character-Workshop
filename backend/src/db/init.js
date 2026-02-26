import sequelize from "./database.js";
import User from "../models/User.js";
import Character from "../models/Character.js";
import Note from "../models/Note.js";
import Homebrew from "../models/Homebrew.js";

async function cleanupStaleBackupTables() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const backupTables = tables.filter(
    (table) => typeof table === "string" && table.endsWith("_backup"),
  );

  for (const table of backupTables) {
    console.log(`🧹 Dropping stale backup table: ${table}`);
    await queryInterface.dropTable(table);
  }
}

async function cleanupOrphanedData() {
  // Remove rows that reference missing parents to avoid SQLITE_CONSTRAINT failures
  const queries = [
    `DELETE FROM Notes WHERE userId NOT IN (SELECT id FROM Users);`,
    `DELETE FROM Homebrew WHERE userId NOT IN (SELECT id FROM Users);`,
    `DELETE FROM Characters WHERE userId NOT IN (SELECT id FROM Users);`,
  ];

  for (const query of queries) {
    try {
      await sequelize.query(query);
    } catch (error) {
      // Table may not exist yet during first startup; ignore
    }
  }
}

// Initialize models (will be populated as we create models)
export async function initializeDatabase() {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Remove stale backup tables left behind by failed sync/alter operations
    await cleanupStaleBackupTables();

    // Clean orphaned child rows before syncing schema to avoid FK copy failures
    await cleanupOrphanedData();

    if (sequelize.getDialect() === "sqlite") {
      // Temporarily disable foreign key checks during SQLite sync operations
      await sequelize.query("PRAGMA foreign_keys = OFF;");
    }

    // Sync models with database
    // Use alter: true to keep schema in sync with models during development
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synchronized");

    if (sequelize.getDialect() === "sqlite") {
      // Re-enable foreign key enforcement after schema sync
      await sequelize.query("PRAGMA foreign_keys = ON;");
    }

    return sequelize;
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
}

export default sequelize;
