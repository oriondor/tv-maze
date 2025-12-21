import type { Show } from "../types/Show";

export function getPerGenre(shows: Show[], genre: string): Show[] {
  return shows.filter((show) => show.genres.includes(genre));
}
