import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { films as staticFilms } from "../../data/films";
import styles from "./film.module.css";
import FavoritePanel from "./FavoritePanel";

type FilmPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

export default async function FilmPage({
  params,
  searchParams,
}: FilmPageProps) {
  const { id } = await params;
  const { from } = await searchParams;

  const film = await prisma.film.findUnique({
    where: { slug: id },
    include: {
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
      actors: { include: { actor: true } },
    },
  });

  if (!film) {
    notFound();
  }

  const streaming =
    staticFilms.find((f) => f.slug === film.slug)?.streaming ?? [];

  // Куда вернуть — только 3 варианта, по умолчанию каталог
  const backHref =
    from === "cabinet"
      ? "/cabinet"
      : from === "gallery"
        ? "/gallery"
        : "/catalog";

  // Подпись всегда одна
  const backLabel = "← Назад";

  return (
    <main className="film-page">
      <nav className="film-crumbs" aria-label="Навигация">
        <Link href="/start">Главная</Link>
        <span aria-hidden="true">·</span>
        <Link href="/catalog">Каталог</Link>
        <span aria-hidden="true">·</span>
        <span>{film.title}</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.posterCol}>
          <Image
            src={film.image}
            alt={film.imageAlt}
            fill
            sizes="(max-width: 40rem) 100vw, 400px"
            className={styles.poster}
            priority
          />
          <span className={styles.rating}>
            ★ {Number(film.rating).toFixed(1)}
          </span>
        </div>

        <div className={styles.infoCol}>
          <p className={styles.kicker}>
            {film.year} · {film.country} · {film.director}
          </p>

          <h1 className={styles.title}>{film.title}</h1>

          <p className={styles.summary}>{film.summary}</p>

          <dl className={styles.facts}>
            <div>
              <dt>Год</dt>
              <dd>{film.year}</dd>
            </div>
            <div>
              <dt>Страна</dt>
              <dd>{film.country}</dd>
            </div>
            <div>
              <dt>Режиссёр</dt>
              <dd>{film.director}</dd>
            </div>
            <div>
              <dt>Рейтинг</dt>
              <dd>★ {Number(film.rating).toFixed(1)}</dd>
            </div>
            <div>
              <dt>Настроение</dt>
              <dd>{film.mood}</dd>
            </div>
          </dl>

          {film.genres.length > 0 ? (
            <section className={styles.block} aria-labelledby="genres-title">
              <h2 id="genres-title" className={styles.blockTitle}>
                Жанры
              </h2>
              <ul className={styles.chips}>
                {film.genres.map((g) => (
                  <li key={g.genre.slug} className={styles.chip}>
                    {g.genre.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {film.tags.length > 0 ? (
            <section className={styles.block} aria-labelledby="tags-title">
              <h2 id="tags-title" className={styles.blockTitle}>
                Метки
              </h2>
              <ul className={styles.chips}>
                {film.tags.map((t) => (
                  <li key={t.tag.slug} className={styles.chip}>
                    {t.tag.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {film.actors.length > 0 ? (
            <section className={styles.block} aria-labelledby="actors-title">
              <h2 id="actors-title" className={styles.blockTitle}>
                В ролях
              </h2>
              <ul className={styles.actors}>
                {film.actors.map((a) => (
                  <li key={a.actor.slug}>
                    <Link
                      href={`/catalog?actor=${a.actor.slug}`}
                      className={styles.actorLink}
                    >
                      {a.actor.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {streaming.length > 0 ? (
            <section className={styles.block} aria-labelledby="streaming-title">
              <h2 id="streaming-title" className={styles.blockTitle}>
                Где смотреть
              </h2>
              <ul className={styles.streamingList}>
                {streaming.map((s) => (
                  <li key={s.slug}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.streamingLink}
                      style={{ borderColor: s.color, color: s.color }}
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className={styles.actions}>
            <Link className="main-link" href={backHref}>
              {backLabel}
            </Link>
            <FavoritePanel filmId={film.id} />
          </div>
        </div>
      </section>
    </main>
  );
}