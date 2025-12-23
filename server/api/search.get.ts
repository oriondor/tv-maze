import { fetchShowsSearch } from "../services/tvmaze.service";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const searchQuery = getQuery(event);

  const foundShows = await fetchShowsSearch(searchQuery.query as string);

  const showsList: Show[] = foundShows.map(({ show }) => show);

  return showsList;
});
