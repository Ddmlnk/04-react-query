import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

axios.defaults.baseURL = "https://api.themoviedb.org/";

export async function fetchMovies(
  query: string,
  page: number,
): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>("3/search/movie", {
    params: { query: query, page: page },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
    },
  });
  return response.data;
}
