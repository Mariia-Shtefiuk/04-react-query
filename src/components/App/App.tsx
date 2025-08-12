import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { fetchMovies } from "../../services/movieService";
import { Movie } from "../../types/movie";
import { MoviesResponse } from "../../services/movieService";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery<MoviesResponse>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
  });

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error("Please enter a search query.");
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && data?.results && data.results.length > 0 && (
          <MovieGrid movies={data.results} onSelect={handleSelectMovie} />
        )}
        {data && data.total_pages > 1 && (
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
      </main>
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
