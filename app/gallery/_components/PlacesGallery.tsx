"use client";

import { useCallback, useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import FilmGrid from "./FilmGrid";
import CollectionRow from "./CollectionRow";
import PhotoMap from "./PhotoMap";
import PhotoModal from "./PhotoModal";
import { useAuth } from "../../providers/AuthProvider";

export type FilmDTO = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  year: number;
  director: string;
  mood: string;
  country: string;
  image: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
  rating: number;
  genres: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  actors: { slug: string; name: string }[];
  isFavorite: boolean;
};

type CollectionDTO = {
  slug: string;
  title: string;
  films: FilmDTO[];
};

type Tab = "all" | "actors" | "vibe" | "original";

type FilterOptions = {
  genres: { slug: string; name: string }[];
  tags: { slug: string; name: string }[];
  yearFrom: number;
  yearTo: number;
};

export default function PlacesGallery() {
  const { status, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>("all");
  const [films, setFilms] = useState<FilmDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [options, setOptions] = useState<FilterOptions | null>(null);

  const [yearFrom, setYearFrom] = useState<number | "">("");
  const [yearTo, setYearTo] = useState<number | "">("");
  const [genres, setGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState("rating-desc");

  const [byActor, setByActor] = useState<CollectionDTO[]>([]);
  const [byVibe, setByVibe] = useState<CollectionDTO[]>([]);
  const [original, setOriginal] = useState<CollectionDTO[]>([]);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<FilmDTO | null>(null);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    fetch("/api/filters")
      .then((r) => r.json())
      .then((data: FilterOptions) => {
        setOptions(data);
        setYearFrom(data.yearFrom);
        setYearTo(data.yearTo);
      })
      .catch(() => setError("Не удалось загрузить фильтры"));
  }, []);

  useEffect(() => {
    if (tab !== "all" && tab !== "original") return;

    const params = new URLSearchParams();
    if (yearFrom !== "") params.set("yearFrom", String(yearFrom));
    if (yearTo !== "") params.set("yearTo", String(yearTo));
    genres.forEach((g) => params.append("genre", g));
    tags.forEach((t) => params.append("tag", t));
    params.set("sort", sort);

    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch(`/api/films?${params}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Ошибка загрузки");
        return r.json();
      })
      .then((data: { films: FilmDTO[] }) => setFilms(data.films))
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError("Не удалось загрузить фильмы");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [tab, yearFrom, yearTo, genres, tags, sort, status]);

  useEffect(() => {
    if (tab === "all") return;
    fetch("/api/collections")
      .then((r) => r.json())
      .then((data) => {
        setByActor(data.byActor ?? []);
        setByVibe(data.byVibe ?? []);
        setOriginal(data.original ?? []);
      })
      .catch(() => setError("Не удалось загрузить подборки"));
  }, [tab]);

  const openFromCard = useCallback((film: FilmDTO, button: HTMLButtonElement) => {
    setTrigger(button);
    setSelected(film);
  }, []);

  const openFromMap = useCallback((film: FilmDTO) => {
    setTrigger(null);
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
        throw new Error("Сеанс завершён. Выполните вход снова.");
      }
      if (!response.ok) throw new Error("Не удалось изменить избранное");
      const patch = (list: FilmDTO[]) =>
        list.map((f) => (f.id === film.id ? { ...f, isFavorite: !f.isFavorite } : f));
      setFilms(patch);
      setByActor((c) => c.map((x) => ({ ...x, films: patch(x.films) })));
      setByVibe((c) => c.map((x) => ({ ...x, films: patch(x.films) })));
      setOriginal((c) => c.map((x) => ({ ...x, films: patch(x.films) })));
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
    <div className="gallery-layout">
      {options ? (
        <FilterSidebar
          options={options}
          yearFrom={yearFrom}
          yearTo={yearTo}
          setYearFrom={setYearFrom}
          setYearTo={setYearTo}
          genres={genres}
          setGenres={setGenres}
          tags={tags}
          setTags={setTags}
          sort={sort}
          setSort={setSort}
        />
      ) : (
        <aside className="gallery-sidebar">Загрузка фильтров…</aside>
      )}

      <div className="gallery-main">
        <nav className="gallery-tabs" aria-label="Подборки">
          {(
            [
              ["all", "Все фильмы"],
              ["actors", "По актёрам"],
              ["vibe", "По вайбу"],
              ["original", "Оригинальные"],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`gallery-tab ${tab === key ? "is-active" : ""}`}
              aria-current={tab === key ? "page" : undefined}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>

        {error ? (
          <p role="alert" className="form-error">
            {error}
          </p>
        ) : null}

        {tab === "all" ? (
          <FilmGrid
            films={films}
            loading={loading}
            pendingId={pendingId}
            onOpen={openFromCard}
            onToggleFavorite={toggleFavorite}
          />
        ) : null}

        {tab === "actors" ? (
          <div className="collection-list">
            {byActor.map((c) => (
              <CollectionRow
                key={c.slug}
                title={c.title}
                films={c.films}
                pendingId={pendingId}
                onOpen={openFromCard}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : null}

        {tab === "vibe" ? (
          <div className="collection-list">
            {byVibe.map((c) => (
              <CollectionRow
                key={c.slug}
                title={c.title}
                films={c.films}
                pendingId={pendingId}
                onOpen={openFromCard}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : null}

        {tab === "original" ? (
          <div className="collection-list">
            {original.map((c) => (
              <CollectionRow
                key={c.slug}
                title={c.title}
                films={c.films}
                pendingId={pendingId}
                onOpen={openFromCard}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : null}

        {tab === "all" ? (
          <PhotoMap films={films} onSelect={openFromMap} />
        ) : null}
      </div>

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
    </div>
  );
}