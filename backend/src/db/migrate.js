// Database migration script
// Run with: npm run migrate

import sequelize from "./database.js";
import Character from "../models/Character.js";
import User from "../models/User.js";

/**
 * Migration Script: Updates Character table schema to support new data structure
 *
 * Changes:
 * - Removes obsolete 'class' column
 * - Adds support for multiclass via 'classes' JSON column
 * - Adds background, skills, savingThrows, spells, spellSlots JSON columns
 * - Adds feats, classFeatures, hitDice JSON columns
 * - Adds new fields: proficiency, spellSaveDC, spellAttackBonus, death save fields, imageUrl
 */

async function migrate() {
  try {
    console.log("\n🔄 Running database migrations...\n");

    // Check if connection is available
    const isInMemory = process.env.USE_IN_MEMORY === "true";
    if (!isInMemory) {
      await sequelize.authenticate();
      console.log("✅ Database connection successful\n");
    } else {
      console.log("ℹ️  Running in-memory mode - skipping physical migration\n");
    }

    // Sync models with current schema using alter mode
    console.log("📋 Syncing models with database schema...");
    await sequelize.sync({ alter: true });
    console.log("✅ Models synchronized\n");

    // Log migration details
    console.log("📊 Migration Details:");
    console.log("─────────────────────────────────────────────────────────");

    console.log("\n✨ New Complex Fields (JSON Type):");
    console.log("   • classes - Multiclass support structure");
    console.log("   • background - Background selection with traits");
    console.log("   • skills - Skill proficiencies with expertise tracking");
    console.log("   • savingThrows - Saving throw proficiencies");
    console.log("   • spells - Spells organized by level");
    console.log("   • spellSlots - Available spell slots per level");
    console.log("   • feats - Feat selections with descriptions");
    console.log("   • classFeatures - Class-specific features");
    console.log("   • hitDice - Hit dice pool by type\n");

    console.log("✨ New Simple Fields:");
    console.log("   • proficiency - Proficiency bonus (default: 2)");
    console.log("   • spellSaveDC - Spell save DC");
    console.log("   • spellAttackBonus - Spell attack bonus");
    console.log("   • deathSaveSuccesses - Death save success count");
    console.log("   • deathSaveFailures - Death save failure count");
    console.log("   • imageUrl - Character portrait URL\n");

    console.log("⚠️  Deprecated Fields:");
    console.log(
      "   • class (string) - Replaced by 'classes' (JSON) multiclass support\n"
    );

    console.log("─────────────────────────────────────────────────────────");
    console.log("✅ Migration completed successfully!\n");

    // Show table info if not in-memory
    if (!isInMemory) {
      try {
        const tableInfo = await sequelize.getQueryInterface().showAllTables();
        console.log("📋 Available tables:", tableInfo.join(", "), "\n");
      } catch (err) {
        console.log("ℹ️  Could not retrieve table information\n");
      }
    }

    console.log("📚 Next Steps:");
    console.log("   1. Update frontend character builder to use new fields");
    console.log("   2. Save/load characters with multiclass, spells, feats");
    console.log("   3. Test API endpoints with new data structure\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("\nFull error details:");
    console.error(error);
    process.exit(1);
  }
}

migrate();
