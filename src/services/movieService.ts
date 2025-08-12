import axios from "axios";
import { Movie } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(
  query: string,
  page = 1
): Promise<MoviesResponse> {
  const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
    params: {
      query,
      language: "en-US",
      include_adult: false,
      page,
    },
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });
  return response.data;
}
