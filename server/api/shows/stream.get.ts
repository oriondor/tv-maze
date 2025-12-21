import { registerShowsClient } from "../../streams/shows.stream";
import { ensureFullCoverage } from "../../services/shows.service";

export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");

  event.node.res.write("retry: 5000\n\n");

  registerShowsClient(event);

  ensureFullCoverage().catch((error) => {
    console.error("Error in ensureFullCoverage:", error);
  });
});
