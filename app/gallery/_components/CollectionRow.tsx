"use client";

import Image from "next/image";
import { useRef } from "react";
import type { FilmDTO } from "./PlacesGallery";

type Props = {
  title: string;
  films: FilmDTO[];
  pendingId: string | null;
  onOpen: (film: FilmDTO, button: HTMLButtonElement) => void;
  onToggleFavorite: (film: FilmDTO) => void;
};

export default function CollectionRow({
  title,
  films,
  pendingId,
  onOpen,
  onToggleFavorite,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  }

  return (
    <section className="collection">
      <header className="collection__header">
        <h3 className="collection__title">{title}</h3>
        <div className="collection__arrows">
          <button type="button" aria-label="Назад" onClick={() => scrollBy(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Вперёд" onClick={() => scrollBy(1)}>
            ›
          </button>
        </div>
      </header>

      <div className="collection__track" ref={trackRef}>
        {films.map((film) => (
          <article key={film.id} className="film-card film-card--row">
            <button
              type="button"
              className="film-card__open"
              onClick={(e) => onOpen(film, e.currentTarget)}
            >
              <span className="film-card__poster">
                <Image
                  src={film.image}
                  alt={film.imageAlt}
                  fill
                  sizes="200px"
                  className="film-card__img"
                />
                <span className="film-card__rating">★ {film.rating.toFixed(1)}</span>
              </span>
              <span className="film-card__title">{film.title}</span>
              <span className="film-card__meta">{film.year}</span>
            </button>
            <button
              type="button"
              className={`film-card__fav ${film.isFavorite ? "is-active" : ""}`}
              aria-pressed={film.isFavorite}
              disabled={pendingId === film.id}
              onClick={() => onToggleFavorite(film)}
            >
              {film.isFavorite ? "♥" : "♡"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}