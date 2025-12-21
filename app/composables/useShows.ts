let sse: EventSource | null = null;
let initialized = false;

export function useShows() {
  const state = useState<ShowById>("shows", () => ({}));

  async function fetchInitial() {
    if (initialized) return;

    initialized = true;

    const res = await $fetch<ShowById>("/api/shows");

    state.value = res;
  }

  function connectSSE() {
    if (!process.client) return;
    console.log("I opened");

    if (sse) return;

    sse = new EventSource("/api/shows/stream");

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data) as ShowById;
      console.log("received payload", data);

      state.value = mergeById(state.value, data);
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
    shows: computed(() => state.value),
  };
}
