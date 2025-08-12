import css from "./MovieModal.module.css";
import { Movie } from "../../types/movie";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root")!;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const imgUrl =
    movie.backdrop_path || movie.poster_path
      ? `https://image.tmdb.org/t/p/original${
          movie.backdrop_path || movie.poster_path
        }`
      : "https://via.placeholder.com/800x450?text=No+Image";

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img src={imgUrl} alt={movie.title} className={css.image} />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
