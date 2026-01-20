export type DeathSaves = {
  success: number;
  failure: number;
};

export function isDead(state: DeathSaves): boolean {
  return state.failure >= 3;
}

export function isStable(state: DeathSaves): boolean {
  return state.success >= 3;
}
