import Joi from "joi";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/tokenUtils.js";
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
    findByEmail: async (email) => DBUserModel.findOne({ where: { email } }),
    createUser: async ({ username, email, password }) => {
      const passwordHash = await bcrypt.hash(password, 10);
      return DBUserModel.create({ username, email, passwordHash });
    },
  };
}

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json(responses.error(error.message, 400));

    const { username, email, password } = value;

    // Verificar si el email ya existe
    const store = getUserStore();
    const existing = await store.findByEmail(email);
    if (existing)
      return res.status(409).json(responses.error("Email already in use", 409));

    const user = await store.createUser({ username, email, password });

    const token = generateToken(user.id, user.email ?? user.email);

    return res.status(201).json(
      responses.success(
        {
          token,
          user: { id: user.id, username: user.username, email: user.email },
        },
        "User registered",
      ),
    );
  } catch (err) {
    next(err);
  }
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json(responses.error(error.message, 400));

    const { email, password } = value;
    const store = getUserStore();
    const user = await store.findByEmail(email);
    if (!user)
      return res.status(401).json(responses.error("Invalid credentials", 401));

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json(responses.error("Invalid credentials", 401));

    const token = generateToken(user.id, user.email ?? user.email);

    return res.json(
      responses.success(
        {
          token,
          user: { id: user.id, username: user.username, email: user.email },
        },
        "Logged in",
      ),
    );
  } catch (err) {
    next(err);
  }
}

export default { register, login };
