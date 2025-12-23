export interface Show {
  id: number;
  url?: string;
  name: string;
  type?: string;
  language?: string;
  genres: string[];
  status?: string;
  runtime?: number;
  averageRuntime?: number;
  premiered?: string;
  ended?: string;
  officialSite?: string;
  schedule?: Schedule;
  rating: Rating;
  weight?: number;
  network?: Network;
  webChannel?: WebChannel | null;
  image: Image;
  summary: string;
  updated?: number;
  externals?: Externals;
}

export interface Rating {
  average: number | null;
}

export interface Image {
  medium: string;
  original: string;
}

export interface Schedule {
  time: string;
  days: string[];
}

export interface Network {
  id: number;
  name: string;
  country?: Country;
  officialSite?: string;
}

export interface WebChannel {
  id: number;
  name: string;
  country?: Country;
  officialSite?: string;
}

export interface Country {
  name: string;
  code: string;
  timezone: string;
}

export interface Externals {
  tvrage?: number | null;
  thetvdb?: number | null;
  imdb?: string | null;
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
