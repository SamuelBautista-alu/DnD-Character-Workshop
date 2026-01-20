export type SpellListItem = {
  index: string;
  name: string;
  level: number;
};

const DND5E_API = "https://www.dnd5eapi.co";

export async function fetchSpellsFromAPI(params: {
  className?: string; // e.g., "wizard"
  level?: number; // 0-9
  subclass?: string; // e.g., "evocation" (as index)
  search?: string;
}): Promise<SpellListItem[]> {
  const qs = new URLSearchParams();
  if (params.level !== undefined) qs.set("level", String(params.level));
  if (params.className) qs.set("classes", params.className.toLowerCase());
  if (params.subclass) qs.set("subclasses", params.subclass.toLowerCase());

  // Base list
  const listRes = await fetch(`${DND5E_API}/api/spells?${qs.toString()}`);
  if (!listRes.ok) return [];
  const listData = (await listRes.json()) as {
    results: { index: string; name: string }[];
  };
  let items: SpellListItem[] =
    listData.results?.map((r) => ({
      index: r.index,
      name: r.name,
      level: 0,
    })) || [];

  // Fetch levels in parallel (API list doesn't include level consistently)
  // Limit concurrency to avoid hammering API
  const concurrency = 8;
  const chunks: (typeof items)[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }

  const detailed: SpellListItem[] = [];
  for (const chunk of chunks) {
    const results = await Promise.all(
      chunk.map(async (it) => {
        try {
          const r = await fetch(`${DND5E_API}/api/spells/${it.index}`);
          if (!r.ok) return it;
          const d = await r.json();
          return { ...it, level: Number(d.level) || 0 } as SpellListItem;
        } catch {
          return it;
        }
      }),
    );
    detailed.push(...results);
  }

  let filtered = detailed;
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = detailed.filter((s) => s.name.toLowerCase().includes(q));
  }

  return filtered;
}
