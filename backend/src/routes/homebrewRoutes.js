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

// Get all homebrew content for user (or by contentType)
router.get("/", getHomebrewByUser);

// Get specific homebrew item
router.get("/:id", getHomebrewById);

// Create homebrew content
router.post("/", createHomebrew);

// Update homebrew content
router.put("/:id", updateHomebrew);

// Delete homebrew content
router.delete("/:id", deleteHomebrew);

// Convenience routes for specific content types - GET
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

export default router;
