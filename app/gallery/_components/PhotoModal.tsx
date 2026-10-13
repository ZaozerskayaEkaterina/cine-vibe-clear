"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../providers/AuthProvider";
import type { FilmDTO } from "./PlacesGallery";
import styles from "./PhotoModal.module.css";
import { films as staticFilms } from "../../data/films";

type PhotoModalProps = {
  film: FilmDTO;
  isFavorite: boolean;
  pending: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function PhotoModal({
  film,
  isFavorite,
  pending,
  onToggleFavorite,
  onClose,
  returnFocusTo,
}: PhotoModalProps) {
  const { user, status } = useAuth();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const streaming =
    staticFilms.find((f) => f.slug === film.slug)?.streaming ?? [];

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusTo]);

  function keepFocusInside(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    );
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="film-modal-title"
        onKeyDown={keepFocusInside}
      >
        {/* Перфорация — верхний ряд */}
        <span className={styles.perfTop} aria-hidden="true" />

        <button
          ref={closeButtonRef}
          className={styles.close}
          type="button"
          aria-label="Закрыть окно"
          onClick={onClose}
        >
          ×
        </button>

        <div className={styles.ticket}>
          <div className={styles.posterCol}>
            <Image
              src={film.image}
              alt={film.imageAlt}
              width={600}
              height={900}
              className={styles.image}
              sizes="(max-width: 40rem) 100vw, 320px"
            />
            <span className={styles.ratingBadge}>★ {film.rating.toFixed(1)}</span>
          </div>

          <div className={styles.infoCol}>
            <p className={styles.kicker}>
              {film.year} · {film.country}
            </p>

            <h2 id="film-modal-title" className={styles.title}>
              {film.title}
            </h2>

            <p className={styles.director}>
              Режиссёр: <span>{film.director}</span>
            </p>

            <p className={styles.summary}>{film.summary}</p>

            <p className={styles.mood}>
              <span>Настроение:</span> {film.mood}
            </p>

            {film.actors.length > 0 ? (
              <p className={styles.actors}>
                <span>В ролях:</span>{" "}
                {film.actors.map((a) => a.name).join(", ")}
              </p>
            ) : null}

            {film.genres.length > 0 ? (
              <ul className={styles.genreList} aria-label="Жанры">
                {film.genres.map((g) => (
                  <li key={g.slug} className={styles.genreChip}>
                    {g.name}
                  </li>
                ))}
              </ul>
            ) : null}

            {streaming.length > 0 ? (
              <section
                className={styles.streaming}
                aria-labelledby="streaming-title"
              >
                <h3 id="streaming-title" className={styles.streamingTitle}>
                  Где смотреть
                </h3>
                <ul className={styles.streamingList}>
                  {streaming.map((service) => (
                    <li key={service.slug}>
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.streamingLink}
                        style={{
                          borderColor: service.color,
                          color: service.color,
                        }}
                      >
                        {service.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className={styles.actions}>
              {status === "authenticated" && user ? (
                <button
                  className={styles.favoriteButton}
                  type="button"
                  onClick={onToggleFavorite}
                  disabled={pending}
                >
                  {pending
                    ? "Сохраняем…"
                    : isFavorite
                      ? "♥ Убрать из избранного"
                      : "♡ В избранное"}
                </button>
              ) : (
                <Link className={styles.loginLink} href="/auth/login">
                  Войдите, чтобы добавить в избранное →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Перфорация — нижний ряд */}
        <span className={styles.perfBottom} aria-hidden="true" />
      </div>
    </div>,
    document.body,
  );
}