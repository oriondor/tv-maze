import { GenreCounts } from "#shared/types/Show";

const STORAGE_KEY = "genres:counts";

export async function getGenreCountsCache(): Promise<GenreCounts> {
  const storage = useStorage("cache");
  let cache = await storage.getItem<GenreCounts>(STORAGE_KEY);

  if (!cache) {
    cache = {};
  }
  return cache;
}

export async function setGenreCountsCache(cache: GenreCounts) {
  const storage = useStorage("cache");
  await storage.setItem(STORAGE_KEY, cache);
}
