import Sequelize from "sequelize";
import { config } from "../config.js";

let sequelize;
if (process.env.USE_IN_MEMORY === "true") {
  sequelize = {
    authenticate: async () => {
      console.log("[db] In-memory mode: skipping DB authenticate");
      return Promise.resolve();
    },
    sync: async () => {
      console.log("[db] In-memory mode: skipping DB sync");
      return Promise.resolve();
    },
    define: () => ({
      id: null,
    }),
    getQueryInterface: () => ({
      showAllTables: async () => [],
    }),
  };
} else {
  // Default to SQLite persistence unless explicitly disabled (USE_SQLITE=false)
  const useSqlite = process.env.USE_SQLITE !== "false";

  if (useSqlite) {
    // Use separate databases for development and testing
    const dbName = config.NODE_ENV === "test" ? "./test.sqlite" : "./dev.sqlite";
    const storagePath = process.env.SQLITE_STORAGE || dbName;
    
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: storagePath,
      logging: config.NODE_ENV === "development" ? console.log : false,
    });
  } else {
    sequelize = new Sequelize(
      config.DB_NAME,
      config.DB_USER,
      config.DB_PASSWORD,
      {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: "postgres",
        logging: config.NODE_ENV === "development" ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }
}

export default sequelize;
