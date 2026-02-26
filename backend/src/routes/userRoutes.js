import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

/**
 * GET /api/v1/users/profile
 * Get current user profile
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * PUT /api/v1/users/profile
 * Update user profile
 */
router.put("/profile", authMiddleware, updateProfile);

/**
 * PUT /api/v1/users/password
 * Change password
 */
router.put("/password", authMiddleware, changePassword);

/**
 * DELETE /api/v1/users/account
 * Delete user account
 */
router.delete("/account", authMiddleware, deleteAccount);

/**
 * GET /api/v1/users/preferences
 * Get user preferences
 */
router.get("/preferences", authMiddleware, (req, res) => {
  res.json({ message: "Get user preferences endpoint - to be implemented" });
});

export default router;
