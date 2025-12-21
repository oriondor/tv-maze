const BASE_URL = "https://api.tvmaze.com";

export async function fetchShowsPage(page: number): Promise<Show[]> {
  return await $fetch(`${BASE_URL}/shows?page=${page}`);
}
