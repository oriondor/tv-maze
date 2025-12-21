import { getCachedShows } from "../../services/shows.service";

export default defineEventHandler(async () => {
  const cache = await getCachedShows();

  return cache?.byId ?? [];
});
