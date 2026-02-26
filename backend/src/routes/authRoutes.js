import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Ruta de registro
router.post("/register", register);

// Ruta de inicio de sesión
router.post("/login", login);

// Ruta para solicitar recuperación de contraseña
router.post("/forgot-password", forgotPassword);

// Ruta para resetear contraseña
router.post("/reset-password", resetPassword);

// TODO: endpoints de logout, refresh, verify

export default router;
