type ClassHP = {
  hitDie: number;
  level: number;
};

// Promedio por nivel (PHB): piso(dadoDeGolpe/2) + 1
function averagePerLevel(hitDie: number) {
  return Math.floor(hitDie / 2) + 1;
}

/**
 * Calcula HP máximo para una sola clase (o múltiple) usando ganancias promedio.
 * Primer nivel: dado de golpe completo + modificador de CON del personaje.
 * Niveles posteriores: promedio por clase + modificador de CON.
 */
export function calculateMaxHPForClasses(
  classes: ClassHP[],
  conModifier: number,
): number {
  if (!classes.length) return Math.max(1 + conModifier, 1);

  const [first, ...rest] = classes;
  const firstLevelHP = first.hitDie + conModifier;

  const additional = rest.reduce((total, cls) => {
    const levels = Math.max(cls.level, 0);
    const per = averagePerLevel(cls.hitDie) + conModifier;
    return total + levels * per;
  }, 0);

  // También contabilizar los niveles restantes de la primera clase más allá del nivel 1
  const firstClassExtraLevels = Math.max(first.level - 1, 0);
  const firstClassExtra =
    firstClassExtraLevels * (averagePerLevel(first.hitDie) + conModifier);

  return Math.max(firstLevelHP + firstClassExtra + additional, 1);
}
