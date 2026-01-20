import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Ruta de registro
router.post("/register", register);

// Ruta de inicio de sesión
router.post("/login", login);

// TODO: endpoints de logout, refresh, verify

export default router;
