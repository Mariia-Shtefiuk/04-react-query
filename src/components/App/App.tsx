import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchMovies } from "../../services/movieService";
import { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(
    movies[0] || null
  );

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSearch = async (query: string) => {
    console.log("Query:", query);
    setMovies([]);
    setError(false);
    setLoading(true);

    try {
      const results = await fetchMovies(query);
      console.log("Result:", results);
      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(results);
    } catch (error) {
      console.log("Error fetchMovies:", error);
      setError(true);
      toast.error("Failed to fetch movies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
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
