import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/v1/gamemode/:characterId
 * Get game mode state for a character
 */
router.get("/:characterId", authMiddleware, (req, res) => {
  res.json({ message: "Get game mode state endpoint - to be implemented" });
});

/**
 * PUT /api/v1/gamemode/:characterId/hp
 * Update HP (damage/healing)
 */
router.put("/:characterId/hp", authMiddleware, (req, res) => {
  res.json({ message: "Update HP endpoint - to be implemented" });
});

/**
 * PUT /api/v1/gamemode/:characterId/spellslots
 * Update spell slots
 */
router.put("/:characterId/spellslots", authMiddleware, (req, res) => {
  res.json({ message: "Update spell slots endpoint - to be implemented" });
});

/**
 * POST /api/v1/gamemode/:characterId/initiative
 * Roll initiative
 */
router.post("/:characterId/initiative", authMiddleware, (req, res) => {
  res.json({ message: "Roll initiative endpoint - to be implemented" });
});

/**
 * PUT /api/v1/gamemode/:characterId/deathsaves
 * Update death saves
 */
router.put("/:characterId/deathsaves", authMiddleware, (req, res) => {
  res.json({ message: "Update death saves endpoint - to be implemented" });
});

/**
 * PUT /api/v1/gamemode/:characterId/ac
 * Update AC with temporary modifiers
 */
router.put("/:characterId/ac", authMiddleware, (req, res) => {
  res.json({ message: "Update AC endpoint - to be implemented" });
});

export default router;
