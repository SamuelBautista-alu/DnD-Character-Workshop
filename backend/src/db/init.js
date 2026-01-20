import sequelize from "./database.js";

// Initialize models (will be populated as we create models)
export async function initializeDatabase() {
  try {
    // Authenticate connection
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Sync models with database
    // Use alter: true to keep schema in sync with models during development
    await sequelize.sync({ alter: true });
    console.log("✅ Database models synchronized");

    return sequelize;
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  }
}

export default sequelize;
