import { fetchShowsPage } from "./tvmaze.service";
import { getShowsCache, setShowsCache } from "../cache/shows.cache";
import { broadcastShowsUpdate } from "../streams/shows.stream";
import {
  genresSatisfied,
  resetGenreCounts,
  setGenreCounts,
} from "./genres.service";

const MAX_PAGES = 10;

export async function getCachedShows() {
  return await getShowsCache();
}

export async function fetchAndMergePage(page: number) {
  const pageData = await fetchShowsPage(page);

  const cache = await getShowsCache();

  mergeById(cache.byId, pageData);

  await setShowsCache(cache);

  broadcastShowsUpdate(cache.byId);

  return pageData;
}

/**
 * Basically fetching logic that first looks at older cache and revalidates per exact amount
 * of pages from the past
 * or in case if there is no cache (cold start) - tries to satisfy for min shows per genre
 */
export async function ensureFullCoverage() {
  let page = 0;
  const cache = await getShowsCache();
  const pagesFromPreviousCache = cache?.pagesFetched;

  await resetGenreCounts();

  if (pagesFromPreviousCache) {
    while (page <= pagesFromPreviousCache) {
      await fetchAndMergePage(page);
      page++;
    }
    // Need to fetch the whole new cache again to revalidate genre counts
    const freshCache = await getShowsCache();
    await setGenreCounts(Object.values(freshCache.byId));
    return;
  }

  while (page < MAX_PAGES) {
    const pageData = await fetchAndMergePage(page);

    const counts = await setGenreCounts(pageData);

    if (genresSatisfied(counts)) {
      break;
    }

    page++;
    cache.pagesFetched = page;
  }

  await setShowsCache(cache);
}
