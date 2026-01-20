import bcrypt from "bcryptjs";

// Almacenamiento de usuarios en memoria
const users = new Map();
let nextId = 1;

// Buscar usuario por email
export async function findByEmail(email) {
  for (const user of users.values()) {
    if (user.email === email) return { ...user };
  }
  return null;
}

// Buscar usuario por ID
export async function findById(id) {
  const u = users.get(Number(id));
  return u ? { ...u } : null;
}

// Crear nuevo usuario
export async function createUser({ username, email, password }) {
  const existing = await findByEmail(email);
  if (existing) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nextId++, username, email, passwordHash };
  users.set(user.id, user);
  return { ...user };
}

// Crear usuario de prueba por defecto
(async () => {
  if (!(await findByEmail("test@example.com"))) {
    await createUser({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    // eslint-disable-next-line no-console
    console.log(
      "[inMemoryUserService] usuario de prueba creado: test@example.com / password123",
    );
  }
})();

export default { findByEmail, findById, createUser };
