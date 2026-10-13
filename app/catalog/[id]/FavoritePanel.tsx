"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import styles from "./FavoritePanel.module.css";

type Props = {
  filmId: string;
};

type WatchedState = {
  note: string | null;
} | null;

export default function FavoritePanel({ filmId }: Props) {
  const { user, status } = useAuth();

  const [isFavorite, setIsFavorite] = useState(false);
  const [watched, setWatched] = useState<WatchedState>(null);
  const [note, setNote] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [favPending, setFavPending] = useState(false);
  const [watchPending, setWatchPending] = useState(false);
  const [notePending, setNotePending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") {
      setLoaded(true);
      return;
    }
    const controller = new AbortController();

    Promise.all([
      fetch(`/api/favorites/${filmId}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : { favorite: null }))
        .catch(() => ({ favorite: null })),
      fetch(`/api/watched/${filmId}`, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : { watched: null }))
        .catch(() => ({ watched: null })),
    ])
      .then(([favData, watchData]) => {
        setIsFavorite(Boolean(favData.favorite));
        setWatched(watchData.watched ?? null);
        setNote(watchData.watched?.note ?? "");
      })
      .finally(() => setLoaded(true));

    return () => controller.abort();
  }, [filmId, status]);

  if (!loaded) return null;

  if (status !== "authenticated" || !user) {
    return (
      <Link className="main-link" href="/auth/login">
        Войдите, чтобы добавлять фильмы →
      </Link>
    );
  }

  async function addFavorite() {
    setFavPending(true);
    setError("");
    try {
      const res = await fetch(`/api/favorites/${filmId}`, {
        method: "POST",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Не удалось добавить");
      setIsFavorite(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setFavPending(false);
    }
  }

  async function removeFavorite() {
    setFavPending(true);
    setError("");
    try {
      const res = await fetch(`/api/favorites/${filmId}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (!res.ok) throw new Error("Не удалось убрать");
      setIsFavorite(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setFavPending(false);
    }
  }

  async function toggleWatched(next: boolean) {
    setWatchPending(true);
    setError("");
    try {
      if (next) {
        const res = await fetch(`/api/watched/${filmId}`, {
          method: "POST",
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error("Не удалось отметить");
        const data = (await res.json()) as { watched: WatchedState };
        setWatched(data.watched);
        setNote(data.watched?.note ?? "");
      } else {
        const res = await fetch(`/api/watched/${filmId}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error("Не удалось снять отметку");
        setWatched(null);
        setNote("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setWatchPending(false);
    }
  }

  async function saveNote() {
    if (!watched) return;
    setNotePending(true);
    setError("");
    try {
      const res = await fetch(`/api/watched/${filmId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ note }),
      });
      if (!res.ok) throw new Error("Не удалось сохранить заметку");
      const data = (await res.json()) as { watched: WatchedState };
      setWatched(data.watched);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setNotePending(false);
    }
  }

  return (
    <>
      {isFavorite ? (
        <button
          type="button"
          className={styles.favButtonActive}
          onClick={removeFavorite}
          disabled={favPending}
        >
          ♥ Убрать из избранного
        </button>
      ) : (
        <button
          type="button"
          className={styles.favButton}
          onClick={addFavorite}
          disabled={favPending}
        >
          ♡ Добавить в избранное
        </button>
      )}

      <label className={styles.watchedToggle}>
        <input
          type="checkbox"
          checked={Boolean(watched)}
          disabled={watchPending}
          onChange={(e) => toggleWatched(e.target.checked)}
        />
        <span>Просмотрено</span>
      </label>

      {watched ? (
        <div className={styles.noteBlock}>
          <label htmlFor="film-note" className={styles.noteLabel}>
            Ваша заметка
          </label>
          <textarea
            id="film-note"
            className={styles.note}
            value={note}
            disabled={notePending}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="С кем смотреть, что запомнить…"
          />
          <button
            type="button"
            className={styles.noteSave}
            onClick={saveNote}
            disabled={notePending || note === (watched.note ?? "")}
          >
            Сохранить заметку
          </button>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="form-error">
          {error}
        </p>
      ) : null}
    </>
  );
}