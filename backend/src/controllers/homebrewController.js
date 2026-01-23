import Homebrew from "../models/Homebrew.js";

// Get all homebrew content for a user (can filter by contentType)
export const getHomebrewByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contentType } = req.query;

    const where = { userId };
    if (contentType) {
      where.contentType = contentType;
    }

    const homebrew = await Homebrew.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json(homebrew);
  } catch (error) {
    next(error);
  }
};

// Get single homebrew item
export const getHomebrewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const homebrew = await Homebrew.findOne({
      where: { id, userId },
    });

    if (!homebrew) {
      return res.status(404).json({ error: "Homebrew content not found" });
    }

    res.json(homebrew);
  } catch (error) {
    next(error);
  }
};

// Create homebrew content
export const createHomebrew = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contentType, name, description, ...otherFields } = req.body;

    // Validation
    if (!contentType || !name || !description) {
      return res.status(400).json({
        error: "contentType, name, and description are required",
      });
    }

    const validContentTypes = ["class", "race", "spell", "item", "background"];
    if (!validContentTypes.includes(contentType)) {
      return res.status(400).json({
        error: `Invalid contentType. Must be one of: ${validContentTypes.join(", ")}`,
      });
    }

    const homebrew = await Homebrew.create({
      contentType,
      name,
      description,
      userId,
      ...otherFields,
    });

    res.status(201).json(homebrew);
  } catch (error) {
    next(error);
  }
};

// Update homebrew content
export const updateHomebrew = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const homebrew = await Homebrew.findOne({
      where: { id, userId },
    });

    if (!homebrew) {
      return res.status(404).json({ error: "Homebrew content not found" });
    }

    // Don't allow changing contentType or userId
    if (updateData.contentType || updateData.userId) {
      return res.status(400).json({
        error: "Cannot modify contentType or userId",
      });
    }

    await homebrew.update(updateData);

    res.json(homebrew);
  } catch (error) {
    next(error);
  }
};

// Delete homebrew content
export const deleteHomebrew = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const homebrew = await Homebrew.findOne({
      where: { id, userId },
    });

    if (!homebrew) {
      return res.status(404).json({ error: "Homebrew content not found" });
    }

    await homebrew.destroy();

    res.json({ message: "Homebrew content deleted successfully" });
  } catch (error) {
    next(error);
  }
};
