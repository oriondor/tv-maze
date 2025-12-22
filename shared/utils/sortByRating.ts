import type { Show } from "../types/Show";

export function sortByRating(shows: Show[]): Show[] {
  return shows.toSorted(
    (a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0)
  );
}
