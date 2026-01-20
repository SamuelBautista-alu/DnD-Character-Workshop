import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { initializeDatabase } from "./db/init.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import characterRoutes from "./routes/characterRoutes.js";
import gameModeRoutes from "./routes/gameModeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

const app = express();

// Middleware de CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (apps móviles, curl) o si están en la lista de permitidas
      if (!origin || config.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verificación de salud del servidor
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Rutas de la API
app.use(`${config.API_PREFIX}/auth`, authRoutes);
app.use(`${config.API_PREFIX}/characters`, characterRoutes);
app.use(`${config.API_PREFIX}/gamemode`, gameModeRoutes);
app.use(`${config.API_PREFIX}/users`, userRoutes);
app.use(`${config.API_PREFIX}/notes`, noteRoutes);

// Endpoint de documentación de la API
app.get(`${config.API_PREFIX}`, (req, res) => {
  res.json({
    name: "D&D Character Workshop API",
    version: "1.0.0",
    endpoints: {
      auth: `${config.API_PREFIX}/auth`,
      characters: `${config.API_PREFIX}/characters`,
      gamemode: `${config.API_PREFIX}/gamemode`,
      users: `${config.API_PREFIX}/users`,
    },
  });
});

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Manejador de errores global
app.use(errorHandler);

// Iniciar servidor
async function startServer() {
  try {
    // Inicializar base de datos
    await initializeDatabase();

    app.listen(config.PORT, () => {
      console.log(`\n🚀 Server running on port ${config.PORT}`);
      console.log(
        `📝 API Documentation: http://localhost:${config.PORT}${config.API_PREFIX}`,
      );
      console.log(`🏥 Health check: http://localhost:${config.PORT}/health\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

export default app;
