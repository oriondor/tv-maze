import type { Show } from "../types/Show";

export function sortByRating(shows: Show[]): Show[] {
  return shows.toSorted((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}
