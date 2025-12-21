export interface Show {
  id: number;
  name: string;
  genres: string[];
  rating: number | null;
  image: Image;
  summary: string;
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

export type GenreCountsCache = Record<string, number>;
