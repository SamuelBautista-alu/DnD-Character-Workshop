import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  listNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/v1/notes - Listar todas las notas del usuario
router.get("/", listNotes);

// POST /api/v1/notes - Crear una nueva nota
router.post("/", createNote);

// GET /api/v1/notes/:id - Obtener una nota específica
router.get("/:id", getNoteById);

// PUT /api/v1/notes/:id - Actualizar una nota
router.put("/:id", updateNote);

// DELETE /api/v1/notes/:id - Eliminar una nota
router.delete("/:id", deleteNote);

export default router;
