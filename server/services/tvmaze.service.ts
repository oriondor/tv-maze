const BASE_URL = "https://api.tvmaze.com";

interface SearchResult {
  score: number;
  show: Show;
}

export async function fetchShowsPage(page: number): Promise<Show[]> {
  return await $fetch(`${BASE_URL}/shows?page=${page}`);
}

export async function fetchShowsSearch(query: string): Promise<SearchResult[]> {
  return await $fetch(`${BASE_URL}/search/shows?q=${query}`);
}
