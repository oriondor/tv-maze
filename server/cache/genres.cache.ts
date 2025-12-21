import { GenreCountsCache } from "#shared/types/Show";

const STORAGE_KEY = "genres:counts";

export async function getGenreCountsCache(): Promise<GenreCountsCache> {
  const storage = useStorage("cache");
  let cache = await storage.getItem<GenreCountsCache>(STORAGE_KEY);
  if (!cache) {
    cache = {};
  }
  return cache;
}

export async function setGenreCountsCache(cache: GenreCountsCache) {
  const storage = useStorage("cache");
  await storage.setItem(STORAGE_KEY, cache);
}
