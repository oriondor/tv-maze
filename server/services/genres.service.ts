import {
  getGenreCountsCache,
  setGenreCountsCache,
} from "../cache/genres.cache";

const MIN_SHOWS_PER_GENRE = 10;

function countGenres(shows: Show[]): GenreCountsCache {
  const counts: Record<string, number> = {};

  for (const show of shows) {
    for (const genre of show.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }

  return counts;
}

function mergeCountsInPlace(
  target: GenreCountsCache,
  newCounts: GenreCountsCache
): GenreCountsCache {
  for (const key in newCounts) {
    target[key] = (target[key] ?? 0) + newCounts[key];
  }

  return target;
}

export async function resetGenreCounts() {
  await setGenreCountsCache({});
}

export async function setGenreCounts(shows: Show[]) {
  const target = await getGenreCountsCache();
  const counts = mergeCountsInPlace(target, countGenres(shows));
  await setGenreCountsCache(counts);
  return counts;
}

export function genresSatisfied(counts: GenreCountsCache) {
  return Object.values(counts).every((count) => count >= MIN_SHOWS_PER_GENRE);
}
