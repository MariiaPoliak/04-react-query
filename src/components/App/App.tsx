import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import fetchMovies from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";
import s from "./App.module.css";

const Paginate = (ReactPaginate as any).default || ReactPaginate;

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== "",
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0 && query !== "") {
      toast("No movies found for your request.", { icon: "🔍" });
    }
  }, [data, query]);

  const handleSearch = (newQuery: string): void => {
    if (newQuery.trim() === "") {
      toast.error("Please enter a search term");
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  return (
    <div className={s.container}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}
      {isLoading && !isPlaceholderData && <Loader />}

      <MovieGrid movies={movies} onSelect={setSelectedMovie} />

      {totalPages > 1 && (
        <Paginate
          pageCount={Math.min(totalPages, 500)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) =>
            setPage(selected + 1)
          }
          forcePage={page - 1}
          containerClassName={s.pagination}
          activeClassName={s.active}
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
