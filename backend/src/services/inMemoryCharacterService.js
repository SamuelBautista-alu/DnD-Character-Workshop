const characters = new Map();
let nextId = 1;

export async function findByUserId(userId) {
  const result = [];
  for (const char of characters.values()) {
    if (char.userId === Number(userId)) result.push({ ...char });
  }
  return result;
}

export async function findById(id) {
  const c = characters.get(Number(id));
  return c ? { ...c } : null;
}

export async function createCharacter(userId, data) {
  const character = {
    id: nextId++,
    userId: Number(userId),
    ...data,
  };
  characters.set(character.id, character);
  return { ...character };
}

export async function updateCharacter(id, data) {
  const char = characters.get(Number(id));
  if (!char) return null;
  const updated = { ...char, ...data };
  characters.set(Number(id), updated);
  return { ...updated };
}

export async function deleteCharacter(id) {
  return characters.delete(Number(id));
}

export default {
  findByUserId,
  findById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
};
