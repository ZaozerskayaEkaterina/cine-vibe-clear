import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/current-user";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const url = new URL(request.url);

    const yearFrom = url.searchParams.get("yearFrom");
    const yearTo = url.searchParams.get("yearTo");
    const genreSlugs = url.searchParams.getAll("genre");
    const tagSlugs = url.searchParams.getAll("tag");
    const sort = url.searchParams.get("sort") ?? "rating-desc";

    const where: Record<string, unknown> = {};
    if (yearFrom || yearTo) {
      where.year = {
        ...(yearFrom ? { gte: Number(yearFrom) } : {}),
        ...(yearTo ? { lte: Number(yearTo) } : {}),
      };
    }
    if (genreSlugs.length > 0) {
      where.genres = { some: { genre: { slug: { in: genreSlugs } } } };
    }
    if (tagSlugs.length > 0) {
      where.tags = { some: { tag: { slug: { in: tagSlugs } } } };
    }

    const orderBy = (() => {
      switch (sort) {
        case "year-desc":   return { year: "desc" as const };
        case "year-asc":    return { year: "asc" as const };
        case "rating-asc":  return { rating: "asc" as const };
        default:            return { rating: "desc" as const };
      }
    })();

    const [films, favorites] = await Promise.all([
      prisma.film.findMany({
        where,
        orderBy,
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

    const result = films.map((film) => ({
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
    }));

    return NextResponse.json({ films: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}