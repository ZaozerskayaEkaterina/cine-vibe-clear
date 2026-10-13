"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import CollectionRow from "../gallery/_components/CollectionRow";
import PhotoModal from "../gallery/_components/PhotoModal";
import type { FilmDTO } from "../gallery/_components/PlacesGallery";

type CollectionDTO = {
  slug: string;
  title: string;
  films: FilmDTO[];
};

export default function StartPage() {
  const { status, refresh } = useAuth();

  const [filmOfDay, setFilmOfDay] = useState<FilmDTO | null>(null);
  const [collections, setCollections] = useState<CollectionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState<FilmDTO | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/home", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Ошибка загрузки");
        return r.json();
      })
      .then((data: { filmOfDay: FilmDTO | null; collections: CollectionDTO[] }) => {
        setFilmOfDay(data.filmOfDay);
        setCollections(data.collections);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError("Не удалось загрузить афишу");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [status]);

  const openFromCard = useCallback((film: FilmDTO, button: HTMLButtonElement) => {
    setTrigger(button);
    setSelected(film);
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  async function toggleFavorite(film: FilmDTO) {
    if (status !== "authenticated") return;
    setPendingId(film.id);
    try {
      const response = await fetch(`/api/favorites/${film.id}`, {
        method: film.isFavorite ? "DELETE" : "POST",
        credentials: "same-origin",
      });
      if (response.status === 401) {
        await refresh();
        throw new Error("Сеанс завершён.");
      }
      if (!response.ok) throw new Error("Не удалось изменить избранное");

      const patch = (list: FilmDTO[]) =>
        list.map((f) => (f.id === film.id ? { ...f, isFavorite: !f.isFavorite } : f));

      setFilmOfDay((cur) =>
        cur && cur.id === film.id ? { ...cur, isFavorite: !cur.isFavorite } : cur,
      );
      setCollections((cs) => cs.map((c) => ({ ...c, films: patch(c.films) })));
      setSelected((cur) =>
        cur && cur.id === film.id ? { ...cur, isFavorite: !cur.isFavorite } : cur,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <main className="home">
      <header className="page-hero">
        <p className="page-hero__kicker">Кинотеатр Cine-Vibe</p>
        <h1 className="page-hero__title">Сегодня в прокате</h1>
        <p className="page-hero__lead">
          Один фильм дня, свежие подборки и немного магии старого кинотеатра.
        </p>
      </header>

      {error ? (
        <p role="alert" className="form-error">{error}</p>
      ) : null}

      {loading ? (
        <p role="status" className="home-loading">Загрузка афиши…</p>
      ) : null}

      {!loading && filmOfDay ? (
        <section className="film-of-day" aria-labelledby="fod-title">
          <p className="film-of-day__kicker">Фильм дня</p>

          <div className="film-of-day__ticket">
            <button
              type="button"
              className="film-of-day__posterBtn"
              onClick={(e) => openFromCard(filmOfDay, e.currentTarget)}
              aria-label={`Открыть ${filmOfDay.title}`}
            >
              <span className="film-of-day__poster">
                <Image
                  src={filmOfDay.image}
                  alt={filmOfDay.imageAlt}
                  fill
                  sizes="(max-width: 40rem) 100vw, 320px"
                  className="film-of-day__img"
                  priority
                />
                <span className="film-of-day__rating">
                  ★ {filmOfDay.rating.toFixed(1)}
                </span>
              </span>
            </button>

            <div className="film-of-day__info">
              <p className="film-of-day__meta">
                {filmOfDay.year} · {filmOfDay.country} · {filmOfDay.director}
              </p>
              <h2 id="fod-title" className="film-of-day__name">
                {filmOfDay.title}
              </h2>
              <p className="film-of-day__summary">{filmOfDay.summary}</p>
              <p className="film-of-day__mood">
                <span>Настроение:</span> {filmOfDay.mood}
              </p>

              <div className="film-of-day__actions">
                <button
                  type="button"
                  className="film-of-day__open"
                  onClick={(e) => openFromCard(filmOfDay, e.currentTarget)}
                >
                  Открыть билет →
                </button>
                {status === "authenticated" ? (
                  <button
                    type="button"
                    className="film-of-day__fav"
                    onClick={() => toggleFavorite(filmOfDay)}
                    disabled={pendingId === filmOfDay.id}
                    aria-pressed={filmOfDay.isFavorite}
                  >
                    {filmOfDay.isFavorite ? "♥ В избранном" : "♡ В избранное"}
                  </button>
                ) : (
                  <Link className="film-of-day__login" href="/auth/login">
                    Войдите, чтобы добавить в избранное
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!loading && collections.length > 0 ? (
        <section className="home-collections" aria-label="Подборки">
          {collections.map((c) => (
            <CollectionRow
              key={c.slug}
              title={c.title}
              films={c.films}
              pendingId={pendingId}
              onOpen={openFromCard}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </section>
      ) : null}

      <section className="home-cta" aria-labelledby="cta-title">
        <h2 id="cta-title" className="home-cta__title">
          Ищете что-то конкретное?
        </h2>
        <p className="home-cta__text">
          Откройте галерею — там фильтры по жанрам, меткам, годам и сортировка
          по рейтингу.
        </p>
        <Link className="main-link" href="/gallery">
          Открыть галерею →
        </Link>
      </section>

      {selected ? (
        <PhotoModal
          film={selected}
          isFavorite={selected.isFavorite}
          pending={pendingId === selected.id}
          onToggleFavorite={() => toggleFavorite(selected)}
          onClose={closeModal}
          returnFocusTo={trigger}
        />
      ) : null}
    </main>
  );
}