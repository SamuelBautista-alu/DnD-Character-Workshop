import Joi from "joi";
import bcrypt from "bcryptjs";
import { responses } from "../utils/responses.js";

// Persistencia condicional de usuarios: preferir modelo Sequelize pero permitir fallback en memoria
let DBUserModel = null;
try {
  DBUserModel = (await import("../models/User.js")).default;
} catch (err) {
  DBUserModel = null;
}

import inMemoryUserService from "../services/inMemoryUserService.js";

function getUserStore() {
  if (process.env.USE_IN_MEMORY === "true" || !DBUserModel)
    return inMemoryUserService;
  return {
    findById: async (id) => DBUserModel.findByPk(id),
    findByEmail: async (email) => DBUserModel.findOne({ where: { email } }),
    updateUser: async (id, updates) => {
      const [affectedRows] = await DBUserModel.update(updates, {
        where: { id },
      });
      if (affectedRows === 0) return null;
      return DBUserModel.findByPk(id);
    },
    deleteUser: async (id) => {
      const affectedRows = await DBUserModel.destroy({ where: { id } });
      return affectedRows > 0;
    },
  };
}

const updateProfileSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
});

export async function getProfile(req, res, next) {
  try {
    const store = getUserStore();
    const user = await store.findById(req.user.id);

    if (!user) {
      return res.status(404).json(responses.error("User not found", 404));
    }

    return res.json(
      responses.success(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        "Profile retrieved successfully",
      ),
    );
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) return res.status(400).json(responses.error(error.message, 400));

    const { username, email } = value;
    const store = getUserStore();

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await store.findByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res
          .status(409)
          .json(responses.error("Email already in use", 409));
      }
    }

    const updatedUser = await store.updateUser(req.user.id, {
      username,
      email,
    });

    if (!updatedUser) {
      return res.status(404).json(responses.error("User not found", 404));
    }

    return res.json(
      responses.success(
        {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          updatedAt: updatedUser.updatedAt,
        },
        "Profile updated successfully",
      ),
    );
  } catch (err) {
    next(err);
  }
}

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

export async function changePassword(req, res, next) {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).json(responses.error(error.message, 400));

    const { currentPassword, newPassword } = value;
    const store = getUserStore();

    const user = await store.findById(req.user.id);
    if (!user) {
      return res.status(404).json(responses.error("User not found", 404));
    }

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return res
        .status(401)
        .json(responses.error("Current password is incorrect", 401));
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    const updatedUser = await store.updateUser(req.user.id, {
      passwordHash: newPasswordHash,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json(responses.error("Failed to update password", 500));
    }

    return res.json(responses.success(null, "Password changed successfully"));
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const store = getUserStore();

    const user = await store.findById(req.user.id);
    if (!user) {
      return res.status(404).json(responses.error("User not found", 404));
    }

    const deleted = await store.deleteUser(req.user.id);
    if (!deleted) {
      return res
        .status(500)
        .json(responses.error("Failed to delete account", 500));
    }

    return res.json(responses.success(null, "Account deleted successfully"));
  } catch (err) {
    next(err);
  }
}
