import type { H3Event } from "h3";
import type { BroadcastResponse, GenreCounts } from "~~/shared/types/Show";

const clients = new Set<H3Event>();

export function registerShowsClient(event: H3Event) {
  clients.add(event);

  event.node.res.on("close", () => {
    clients.delete(event);
  });
}

export function broadcastShowsUpdate(
  shows: Show[] | null,
  genres: GenreCounts
) {
  const response: BroadcastResponse = {
    shows,
    genres,
  };
  const payload = `data: ${JSON.stringify(response)}\n\n`;

  for (const event of clients) {
    event.node.res.write(payload);
  }
}
