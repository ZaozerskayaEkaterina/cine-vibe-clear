"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import FilmGrid from "../gallery/_components/FilmGrid";
import type { FilmDTO } from "../gallery/_components/PlacesGallery";
import styles from "./catalog.module.css";

type FilterOptions = {
  genres: { slug: string; name: string }[];
};

export default function CatalogPage() {
  const { status, refresh } = useAuth();

  const [films, setFilms] = useState<FilmDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [options, setOptions] = useState<FilterOptions | null>(null);

  const [q, setQ] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [sort, setSort] = useState("rating-desc");

  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/filters")
      .then((r) => r.json())
      .then((data: FilterOptions) => setOptions(data))
      .catch(() => setError("Не удалось загрузить фильтры"));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    genres.forEach((g) => params.append("genre", g));
    params.set("sort", sort);

    fetch(`/api/catalog?${params}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Ошибка загрузки");
        return r.json();
      })
      .then((data: { films: FilmDTO[] }) => setFilms(data.films))
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError("Не удалось загрузить каталог");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [q, genres, sort, status]);

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

      setFilms((current) =>
        current.map((f) =>
          f.id === film.id ? { ...f, isFavorite: !f.isFavorite } : f,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setPendingId(null);
    }
  }

  function toggleGenre(slug: string) {
    setGenres((prev) =>
      prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug],
    );
  }

  return (
    <main className="catalog-page">
      <header className="page-hero">
        <p className="page-hero__kicker">Все сеансы</p>
        <h1 className="page-hero__title">Каталог фильмов</h1>
        <p className="page-hero__lead">
          Ищите по названию, режиссёру или актёру. Фильтруйте по жанрам и сортируйте
          по рейтингу или году.
        </p>
      </header>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию, режиссёру или актёру…"
          aria-label="Поиск фильмов"
        />

        <select
          className={styles.sort}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Сортировка"
        >
          <option value="rating-desc">Рейтинг ↓</option>
          <option value="rating-asc">Рейтинг ↑</option>
          <option value="year-desc">Год ↓</option>
          <option value="year-asc">Год ↑</option>
          <option value="title-asc">Название A→Я</option>
        </select>
      </div>

      {options && options.genres.length > 0 ? (
        <div className={styles.genreBar} role="group" aria-label="Жанры">
          {options.genres.map((g) => (
            <button
              key={g.slug}
              type="button"
              className={`filter-chip ${genres.includes(g.slug) ? "is-active" : ""}`}
              onClick={() => toggleGenre(g.slug)}
            >
              {g.name}
            </button>
          ))}
          {genres.length > 0 ? (
            <button
              type="button"
              className={styles.clear}
              onClick={() => setGenres([])}
            >
              Сбросить
            </button>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}

      <FilmGrid
        films={films}
        loading={loading}
        pendingId={pendingId}
        onToggleFavorite={toggleFavorite}
        mode="page"
      />
    </main>
  );
}