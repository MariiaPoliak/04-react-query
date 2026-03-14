import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import s from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.code === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!modalRoot) return null;

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : "https://via.placeholder.com/780x440?text=No+Image+Available";

  return createPortal(
    <div
      className={s.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={s.content}>
        <button className={s.closeBtn} onClick={onClose} aria-label="close">
          &times;
        </button>

        <div className={s.modalLayout}>
          <img src={imageUrl} alt={movie.title} className={s.backdropImg} />

          <div className={s.info}>
            <h2 className={s.title}>{movie.title}</h2>
            <div className={s.meta}>
              <span className={s.rating}>
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className={s.date}>{movie.release_date}</span>
            </div>
            <p className={s.overview}>{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};

export default MovieModal;
