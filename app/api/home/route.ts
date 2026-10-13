import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/current-user";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

function mapFilm(
  film: {
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
    latitude: unknown;
    longitude: unknown;
    rating: unknown;
    genres: { genre: { slug: string; name: string } }[];
    tags: { tag: { slug: string; name: string } }[];
    actors: { actor: { slug: string; name: string } }[];
  },
  favoriteIds: Set<string>,
) {
  return {
    id: film.id,
    slug: film.slug,
    title: film.title,
    summary: film.summary,
    year: film.year,
    director: film.director,
    mood: film.mood,
    country: film.country,
    image: film.image,
    imageAlt: film.imageAlt,
    latitude: Number(film.latitude),
    longitude: Number(film.longitude),
    rating: Number(film.rating),
    genres: film.genres.map((g) => ({ slug: g.genre.slug, name: g.genre.name })),
    tags: film.tags.map((t) => ({ slug: t.tag.slug, name: t.tag.name })),
    actors: film.actors.map((a) => ({ slug: a.actor.slug, name: a.actor.name })),
    isFavorite: favoriteIds.has(film.id),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    const [films, favorites] = await Promise.all([
      prisma.film.findMany({
        include: {
          genres: { include: { genre: true } },
          tags: { include: { tag: true } },
          actors: { include: { actor: true } },
        },
      }),
      user
        ? prisma.favoriteFilm.findMany({
            where: { userId: user.id },
            select: { filmId: true },
          })
        : Promise.resolve([]),
    ]);

    const favoriteIds = new Set(favorites.map((f) => f.filmId));

    if (films.length === 0) {
      return NextResponse.json({
        filmOfDay: null,
        collections: [],
      });
    }

    // Фильм дня — стабильный по дате: меняется раз в сутки
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % films.length;
    const filmOfDay = mapFilm(films[dayIndex], favoriteIds);

    // Подборки для главной
    const collections = [
      {
        slug: "new-releases",
        title: "Новинки",
        films: [...films]
          .sort((a, b) => b.year - a.year)
          .slice(0, 10)
          .map((f) => mapFilm(f, favoriteIds)),
      },
      {
        slug: "top-rated",
        title: "Высокий рейтинг",
        films: [...films]
          .sort((a, b) => Number(b.rating) - Number(a.rating))
          .slice(0, 10)
          .map((f) => mapFilm(f, favoriteIds)),
      },
      {
        slug: "mood-of-day",
        title: "Под настроение вечера",
        films: [...films]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
          .map((f) => mapFilm(f, favoriteIds)),
      },
      {
        slug: "classics",
        title: "Классика до 2010",
        films: [...films]
          .filter((f) => f.year < 2010)
          .sort((a, b) => a.year - b.year)
          .map((f) => mapFilm(f, favoriteIds)),
      },
    ].filter((c) => c.films.length > 0);

    return NextResponse.json({ filmOfDay, collections });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}