import {
  getGenreCountsCache,
  setGenreCountsCache,
} from "../cache/genres.cache";

const MIN_SHOWS_PER_GENRE = 10;

function countGenres(shows: Show[]): GenreCounts {
  const counts: Record<string, number> = {};

  for (const show of shows) {
    for (const genre of show.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1;
    }
  }

  return counts;
}

function mergeCountsInPlace(
  target: GenreCounts,
  newCounts: GenreCounts
): GenreCounts {
  for (const key in newCounts) {
    target[key] = (target[key] ?? 0) + newCounts[key];
  }

  return target;
}

export async function resetGenreCounts() {
  await setGenreCountsCache({});
}

export async function getGenreCounts() {
  return await getGenreCountsCache();
}

export async function setGenreCounts(shows: Show[]) {
  const target = await getGenreCounts();
  const counts = mergeCountsInPlace(target, countGenres(shows));
  await setGenreCountsCache(counts);

  return counts;
}

export function genresSatisfied(counts: GenreCounts) {
  return Object.values(counts).every((count) => count >= MIN_SHOWS_PER_GENRE);
}
