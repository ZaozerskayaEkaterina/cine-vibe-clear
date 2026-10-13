"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import styles from "./cabinet.module.css";

type FilmSummary = {
  id: string;
  slug: string;
  title: string;
  year: number;
  country: string;
  image: string;
  imageAlt: string;
  rating: number;
  director: string;
};

type FavoriteRow = {
  filmId: string;
  createdAt: string;
  film: FilmSummary;
};

type WatchedRow = {
  filmId: string;
  note: string | null;
  createdAt: string;
  film: FilmSummary;
};

type Tab = "favorites" | "watched";

export default function CabinetPage() {
  const { user, status, logout } = useAuth();

  const [tab, setTab] = useState<Tab>("favorites");
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [watched, setWatched] = useState<WatchedRow[]>([]);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);

    Promise.all([
      fetch("/api/auth/me/favorites", { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : { favorites: [] }))
        .catch(() => ({ favorites: [] })),
      fetch("/api/watched", { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : { watched: [] }))
        .catch(() => ({ watched: [] })),
    ])
      .then(([favData, watchData]) => {
        const favs: FavoriteRow[] = favData.favorites ?? [];
        const wats: WatchedRow[] = watchData.watched ?? [];
        setFavorites(favs);
        setWatched(wats);
        setWatchedIds(new Set(wats.map((w) => w.filmId)));
      })
      .catch(() => setError("Не удалось загрузить данные"))
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [status]);

  async function removeFavorite(filmId: string) {
    setPendingId(filmId);
    try {
      const res = await fetch(`/api/favorites/${filmId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Не удалось удалить");
      setFavorites((current) => current.filter((i) => i.filmId !== filmId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setPendingId(null);
    }
  }

  async function unwatch(filmId: string) {
    setPendingId(filmId);
    try {
      const res = await fetch(`/api/watched/${filmId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Не удалось снять отметку");
      setWatched((current) => current.filter((i) => i.filmId !== filmId));
      setWatchedIds((current) => {
        const next = new Set(current);
        next.delete(filmId);
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setPendingId(null);
    }
  }

  async function saveNote(filmId: string, note: string) {
    setPendingId(filmId);
    try {
      const res = await fetch(`/api/watched/${filmId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error("Не удалось сохранить");
      const data = (await res.json()) as { watched: { note: string | null } };
      setWatched((current) =>
        current.map((item) =>
          item.filmId === filmId ? { ...item, note: data.watched.note } : item,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setPendingId(null);
    }
  }

  if (status === "loading") {
    return (
      <main className="cabinet-page">
        <p className="start">Проверяем сессию…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="cabinet-page">
        <header className="page-hero">
          <p className="page-hero__kicker">Личный кабинет</p>
          <h1 className="page-hero__title">Войдите</h1>
          <p className="page-hero__lead">
            Чтобы сохранять фильмы и заметки, войдите в учебную запись.
          </p>
        </header>
        <div className={styles.actionsTop}>
          <Link className="main-link" href="/auth/login">
            Войти →
          </Link>
          <Link className="main-link ghost" href="/auth/register">
            Регистрация
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cabinet-page">
      <header className="page-hero">
        <p className="page-hero__kicker">Личный кабинет</p>
        <h1 className="page-hero__title">{user.name}</h1>
        <p className="page-hero__lead">{user.email}</p>
      </header>

      <nav className={styles.tabs} aria-label="Разделы кабинета">
        <button
          type="button"
          className={`${styles.tab} ${tab === "favorites" ? styles.tabActive : ""}`}
          aria-current={tab === "favorites" ? "page" : undefined}
          onClick={() => setTab("favorites")}
        >
          Избранное · {favorites.length}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "watched" ? styles.tabActive : ""}`}
          aria-current={tab === "watched" ? "page" : undefined}
          onClick={() => setTab("watched")}
        >
          Просмотрено · {watched.length}
        </button>
      </nav>

      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}

      {loading ? <p className={styles.loading}>Загрузка…</p> : null}

      {!loading && tab === "favorites" && favorites.length === 0 ? (
        <p className={styles.empty}>
          Пока в избранном пусто. Открывайте фильмы и добавляйте их.
        </p>
      ) : null}

      {!loading && tab === "watched" && watched.length === 0 ? (
        <p className={styles.empty}>Ничего не отмечено как просмотренное.</p>
      ) : null}

      {!loading && tab === "favorites" && favorites.length > 0 ? (
        <div className={styles.grid}>
          {favorites.map((item) => {
            const isWatched = watchedIds.has(item.filmId);
            return (
              <article key={item.filmId} className={styles.card}>
                <Link
                  href={`/catalog/${item.film.slug}?from=cabinet`}
                  className={styles.posterLink}
                >
                  <span className={styles.poster}>
                    <Image
                      src={item.film.image}
                      alt={item.film.imageAlt}
                      fill
                      sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 45vw, 22vw"
                      className={styles.posterImg}
                    />
                    <span className={styles.rating}>
                      ★ {item.film.rating.toFixed(1)}
                    </span>
                    {isWatched ? (
                      <span className={styles.watchedBadge}>Просмотрено</span>
                    ) : null}
                  </span>
                  <span className={styles.title}>{item.film.title}</span>
                  <span className={styles.meta}>
                    {item.film.year} · {item.film.country}
                  </span>
                </Link>

                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeFavorite(item.filmId)}
                  disabled={pendingId === item.filmId}
                >
                  Убрать из избранного
                </button>
              </article>
            );
          })}
        </div>
      ) : null}

      {!loading && tab === "watched" && watched.length > 0 ? (
        <div className={styles.grid}>
          {watched.map((item) => (
            <article key={item.filmId} className={styles.card}>
              <Link
                href={`/catalog/${item.film.slug}?from=cabinet`}
                className={styles.posterLink}
                aria-label={`Открыть страницу ${item.film.title}`}
              >
                <span className={styles.poster}>
                  <Image
                    src={item.film.image}
                    alt={item.film.imageAlt}
                    fill
                    sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 45vw, 22vw"
                    className={styles.posterImg}
                  />
                  <span className={styles.rating}>
                    ★ {item.film.rating.toFixed(1)}
                  </span>
                  <span className={styles.watchedBadge}>Просмотрено</span>
                </span>
                <span className={styles.title}>{item.film.title}</span>
                <span className={styles.meta}>
                  {item.film.year} · {item.film.country}
                </span>
              </Link>

              <WatchedNote
                initial={item.note ?? ""}
                disabled={pendingId === item.filmId}
                onSave={(value) => saveNote(item.filmId, value)}
              />

              <button
                type="button"
                className={styles.remove}
                onClick={() => unwatch(item.filmId)}
                disabled={pendingId === item.filmId}
              >
                Снять отметку
              </button>
            </article>
          ))}
        </div>
      ) : null}

      <div className={styles.actionsBottom}>
        <button
          type="button"
          className="logout-btn"
          onClick={() => {
            void logout();
          }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </main>
  );
}

function WatchedNote({
  initial,
  disabled,
  onSave,
}: {
  initial: string;
  disabled: boolean;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  return (
    <div className={styles.noteBlock}>
      <textarea
        className={styles.note}
        placeholder="Заметка…"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        rows={3}
        maxLength={2000}
      />
      <button
        type="button"
        className={styles.noteSave}
        disabled={disabled || value === initial}
        onClick={() => onSave(value)}
      >
        Сохранить
      </button>
    </div>
  );
}