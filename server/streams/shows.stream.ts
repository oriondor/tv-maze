import type { H3Event } from "h3";

const clients = new Set<H3Event>();

export function registerShowsClient(event: H3Event) {
  clients.add(event);

  event.node.res.on("close", () => {
    clients.delete(event);
  });
}

export function broadcastShowsUpdate(shows: ShowById) {
  const payload = `data: ${JSON.stringify(Object.values(shows))}\n\n`;

  for (const event of clients) {
    event.node.res.write(payload);
  }
}
