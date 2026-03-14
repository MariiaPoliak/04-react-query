import axios from "axios";
import type { Movie } from "../types/movie";

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: "application/json",
  },
});

interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<MovieResponse> => {
  const { data } = await api.get<MovieResponse>("/search/movie", {
    params: {
      query,
      page,
      include_adult: false,
      language: "en-US",
    },
  });
  return data;
};

export default fetchMovies;
