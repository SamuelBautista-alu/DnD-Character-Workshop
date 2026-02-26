import express from "express";
import {
  getHomebrewByUser,
  getHomebrewById,
  createHomebrew,
  updateHomebrew,
  deleteHomebrew,
} from "../controllers/homebrewController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All homebrew routes require authentication
router.use(authMiddleware);

// Debug route
router.post("/debug", (req, res) => {
  res.json({ message: "Debug route working" });
});

// Convenience routes for specific content types - GET (must come BEFORE /:id)
router.get("/classes", (req, res, next) => {
  req.query.contentType = "class";
  getHomebrewByUser(req, res, next);
});

router.get("/races", (req, res, next) => {
  req.query.contentType = "race";
  getHomebrewByUser(req, res, next);
});

router.get("/spells", (req, res, next) => {
  req.query.contentType = "spell";
  getHomebrewByUser(req, res, next);
});

router.get("/items", (req, res, next) => {
  req.query.contentType = "item";
  getHomebrewByUser(req, res, next);
});

router.get("/backgrounds", (req, res, next) => {
  req.query.contentType = "background";
  getHomebrewByUser(req, res, next);
});

// Convenience routes for specific content types - POST
router.post("/classes", (req, res, next) => {
  req.body.contentType = "class";
  createHomebrew(req, res, next);
});

router.post("/races", (req, res, next) => {
  req.body.contentType = "race";
  createHomebrew(req, res, next);
});

router.post("/spells", (req, res, next) => {
  req.body.contentType = "spell";
  createHomebrew(req, res, next);
});

router.post("/items", (req, res, next) => {
  req.body.contentType = "item";
  createHomebrew(req, res, next);
});

router.post("/backgrounds", (req, res, next) => {
  req.body.contentType = "background";
  createHomebrew(req, res, next);
});

// Convenience routes for specific content types - UPDATE/DELETE
router.put("/classes/:id", updateHomebrew);
router.delete("/classes/:id", deleteHomebrew);

router.put("/races/:id", updateHomebrew);
router.delete("/races/:id", deleteHomebrew);

router.put("/spells/:id", updateHomebrew);
router.delete("/spells/:id", deleteHomebrew);

router.put("/items/:id", updateHomebrew);
router.delete("/items/:id", deleteHomebrew);

router.put("/backgrounds/:id", updateHomebrew);
router.delete("/backgrounds/:id", deleteHomebrew);

// Get all homebrew content for user (generic endpoint)
router.get("/", getHomebrewByUser);

// Get specific homebrew item (must come AFTER specific routes)
router.get("/:id", getHomebrewById);

// Create homebrew content
router.post("/", createHomebrew);

// Update homebrew content
router.put("/:id", updateHomebrew);

// Delete homebrew content
router.delete("/:id", deleteHomebrew);

export default router;
