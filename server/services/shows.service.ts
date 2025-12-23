import { fetchShowsPage } from "./tvmaze.service";
import { getShowsCache, setShowsCache } from "../cache/shows.cache";
import { broadcastShowsUpdate } from "../streams/shows.stream";
import {
  genresSatisfied,
  getGenreCounts,
  resetGenreCounts,
  setGenreCounts,
} from "./genres.service";

const MAX_PAGES = 10;

let coveragePromise: Promise<void> | null = null;

export async function getCachedShows() {
  return await getShowsCache();
}

export async function fetchAndMergePage(page: number) {
  const pageData = await fetchShowsPage(page);

  const showsCache = await getShowsCache();

  showsCache.byId = mergeById(showsCache.byId, pageData);

  await setShowsCache(showsCache);
  const genresCache = await getGenreCounts();

  broadcastShowsUpdate(pageData, genresCache);

  return pageData;
}

/**
 * Ensures full genre coverage runs only once globally.
 * Multiple clients connecting will wait for the same promise instead of triggering concurrent runs.
 */
export async function ensureFullCoverage() {
  // If already running, return the existing promise
  if (coveragePromise) {
    return coveragePromise;
  }

  // Start new coverage run and assign immediately (atomic check-and-set)
  coveragePromise = runCoverage();

  try {
    await coveragePromise;
  } finally {
    // Clear the promise when done so future calls can run again
    coveragePromise = null;
  }
}

/**
 * Basically fetching logic that first looks at older cache and revalidates per exact amount
 * of pages from the past
 * or in case if there is no cache (cold start) - tries to satisfy for min shows per genre
 */
async function runCoverage() {
  let page = 0;
  const showsCache = await getShowsCache();
  const pagesFromPreviousCache = showsCache?.pagesFetched;

  if (pagesFromPreviousCache) {
    while (page <= pagesFromPreviousCache) {
      await fetchAndMergePage(page);
      page++;
    }
    // After reevaluating the cache - reset all genre counts and set new ones from fresh cache
    await resetGenreCounts();
    const freshCache = await getShowsCache();
    const newGenreCounts = await setGenreCounts(Object.values(freshCache.byId));
    broadcastShowsUpdate(null, newGenreCounts);
    return;
  }

  await resetGenreCounts();

  while (page < MAX_PAGES) {
    const pageData = await fetchAndMergePage(page);

    // According to data from latest payload - get new genre counts
    const counts = await setGenreCounts(pageData);

    // If fresh genre counts satosfy all conditions - stop the loop
    if (genresSatisfied(counts)) {
      break;
    }

    page++;
  }

  const freshCache = await getShowsCache();
  freshCache.pagesFetched = page;
  await setShowsCache(freshCache);
}

/**
 * This function takes shows that were fetched with the recent search
 * then merges them into cache and refreshes the genres counts based on full cache
 * and then broadcast the update to the client
 */
export async function addFromSearch(shows: Show[]) {
  const showsCache = await getShowsCache();
  showsCache.byId = mergeById(showsCache.byId, shows);
  await setShowsCache(showsCache);
  await resetGenreCounts();
  const newGenreCounts = await setGenreCounts(Object.values(showsCache.byId));
  broadcastShowsUpdate(shows, newGenreCounts);
}
