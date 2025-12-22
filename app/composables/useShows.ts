import type { BroadcastResponse, CachedResponse } from "~~/shared/types/Show";

let sse: EventSource | null = null;
let initialized = false;

export function useShows() {
  const shows = useState<ShowById>("shows", () => ({}));
  const genres = useState<GenreCounts>("genres", () => ({}));

  async function fetchInitial() {
    if (initialized) return;

    initialized = true;

    const response = await $fetch<CachedResponse>("/api/shows");

    shows.value = response.shows;
    genres.value = response.genres;
  }

  function connectSSE() {
    if (!process.client) return;

    if (sse) return;

    sse = new EventSource("/api/shows/stream");

    sse.onmessage = (event) => {
      const response: string = event.data;
      const data: BroadcastResponse = JSON.parse(response);

      if (data.shows) shows.value = mergeById(shows.value, data.shows);

      genres.value = data.genres;
    };

    sse.onerror = () => {
      // do not hard-fail, browser will auto-retry
      console.warn("[SSE] connection lost, retrying...");
    };
  }

  function disconnectSSE() {
    sse?.close();
    sse = null;
  }

  if (process.client) {
    fetchInitial().then(connectSSE);
  } else {
    fetchInitial();
  }

  onBeforeUnmount(disconnectSSE);

  return {
    shows: computed(() => shows.value),
    genres: computed(() => genres.value),
  };
}
