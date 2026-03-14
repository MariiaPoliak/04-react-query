import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import toast from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import s from "./App.module.css";

const MAX_TMDB_PAGES = 500;

const Paginate = (ReactPaginate as any).default || ReactPaginate;

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isPlaceholderData, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });

  // Повідомлення про відсутність результатів
  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = (newQuery: string): void => {
    setQuery(newQuery);
    setPage(1);
  };

  const handlePageClick = (event: { selected: number }): void => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  const displayPages =
    totalPages > MAX_TMDB_PAGES ? MAX_TMDB_PAGES : totalPages;

  return (
    <div className={s.container}>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {isLoading && !isPlaceholderData && query !== "" && <Loader />}

      {!isError && movies.length > 0 && (
        <div className={isPlaceholderData ? s.searching : ""}>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
        </div>
      )}

      {!isError && displayPages > 1 && (
        <Paginate
          pageCount={displayPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          forcePage={page - 1}
          containerClassName={s.pagination}
          activeClassName={s.active}
          pageClassName={s.pageItem}
          nextClassName={s.pageItem}
          previousClassName={s.pageItem}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
