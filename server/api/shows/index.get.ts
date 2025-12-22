import { getGenreCounts } from "~~/server/services/genres.service";
import { getCachedShows } from "../../services/shows.service";
import { CachedResponse } from "~~/shared/types/Show";

export default defineEventHandler(async () => {
  const shows = await getCachedShows();
  const genres = await getGenreCounts();

  return { shows: shows?.byId ?? [], genres } as CachedResponse;
});
