const STORAGE_KEY = "shows:store";

export async function getShowsCache(): Promise<ShowsCache> {
  const storage = useStorage("cache");
  let cache = await storage.getItem<ShowsCache>(STORAGE_KEY);
  if (!cache || !cache.byId) {
    cache = {
      byId: {},
      pagesFetched: 0,
    };
  }
  return cache;
}

export async function setShowsCache(cache: ShowsCache) {
  const storage = useStorage("cache");
  await storage.setItem(STORAGE_KEY, cache);
}
