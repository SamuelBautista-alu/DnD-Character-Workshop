import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  listCharacters,
  createCharacter,
  getCharacter,
  updateCharacter,
  deleteCharacter,
} from "../controllers/characterController.js";

const router = express.Router();

// Listar todos los personajes del usuario
router.get("/", authMiddleware, listCharacters);

// Crear un nuevo personaje
router.post("/", authMiddleware, createCharacter);

// Obtener un personaje específico
router.get("/:id", authMiddleware, getCharacter);

// Actualizar un personaje
router.put("/:id", authMiddleware, updateCharacter);

// Eliminar un personaje
router.delete("/:id", authMiddleware, deleteCharacter);

export default router;
