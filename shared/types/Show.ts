export interface Show {
  id: number;
  name: string;
  genres: string[];
  rating: Rating;
  image: Image;
  summary: string;
}

export interface Rating {
  average: number | null;
}

export interface Image {
  medium: string;
  original: string;
}

export type ShowById = Record<number, Show>;

export interface ShowsCache {
  byId: ShowById;
  pagesFetched: number;
}

export type GenreCounts = Record<string, number>;

export interface CachedResponse {
  shows: ShowById;
  genres: GenreCounts;
}

export interface BroadcastResponse {
  shows: Show[] | null;
  genres: GenreCounts;
}
