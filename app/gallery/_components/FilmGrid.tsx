"use client";

import Image from "next/image";
import Link from "next/link";
import type { FilmDTO } from "./PlacesGallery";

type Props = {
  films: FilmDTO[];
  loading: boolean;
  pendingId: string | null;
  onOpen?: (film: FilmDTO, button: HTMLButtonElement) => void;
  onToggleFavorite: (film: FilmDTO) => void;
  /** "modal" (по умолчанию) — открывает модалку. "page" — ведёт на /catalog/[slug]. */
  mode?: "modal" | "page";
};

export default function FilmGrid({
  films,
  loading,
  pendingId,
  onOpen,
  onToggleFavorite,
  mode = "modal",
}: Props) {
  if (loading) return <p role="status">Загрузка фильмов…</p>;
  if (films.length === 0) return <p>Ничего не найдено.</p>;

  return (
    <div className="film-grid">
      {films.map((film, index) => (
        <article key={film.id} className="film-card">
          {mode === "page" ? (
            <Link
              href={`/catalog/${film.slug}?from=catalog`}
              className="film-card__open"
              aria-label={`Открыть страницу ${film.title}`}
            >
              <span className="film-card__poster">
                <Image
                  src={film.image}
                  alt={film.imageAlt}
                  fill
                  sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 45vw, 22vw"
                  className="film-card__img"
                  priority={index === 0}
                />
                <span className="film-card__rating">
                  ★ {film.rating.toFixed(1)}
                </span>
              </span>
              <span className="film-card__title">{film.title}</span>
              <span className="film-card__meta">
                {film.year} · {film.country}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              className="film-card__open"
              onClick={(e) => onOpen?.(film, e.currentTarget)}
            >
              <span className="film-card__poster">
                <Image
                  src={film.image}
                  alt={film.imageAlt}
                  fill
                  sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 45vw, 22vw"
                  className="film-card__img"
                  priority={index === 0}
                />
                <span className="film-card__rating">
                  ★ {film.rating.toFixed(1)}
                </span>
              </span>
              <span className="film-card__title">{film.title}</span>
              <span className="film-card__meta">
                {film.year} · {film.country}
              </span>
            </button>
          )}

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
  );
}