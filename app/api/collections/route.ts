import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/current-user";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const films = await prisma.film.findMany({
      include: {
        genres: { include: { genre: true } },
        tags: { include: { tag: true } },
        actors: { include: { actor: true } },
      },
    });

    const favorites = user
      ? await prisma.favoriteFilm.findMany({
          where: { userId: user.id },
          select: { filmId: true },
        })
      : [];
    const favoriteIds = new Set(favorites.map((f) => f.filmId));

    const mapFilm = (film: typeof films[number]) => ({
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
    });

    // Подборка по актёрам
    const actorsMap = new Map<string, { name: string; films: ReturnType<typeof mapFilm>[] }>();
    for (const film of films) {
      for (const fa of film.actors) {
        const key = fa.actor.slug;
        if (!actorsMap.has(key)) {
          actorsMap.set(key, { name: fa.actor.name, films: [] });
        }
        actorsMap.get(key)!.films.push(mapFilm(film));
      }
    }
    const byActor = Array.from(actorsMap.entries())
      .filter(([, v]) => v.films.length > 0)
      .map(([slug, v]) => ({
        slug: `actor-${slug}`,
        title: v.name,
        films: v.films,
      }));

    // Подборка по вайбу (меткам)
    const tagsMap = new Map<string, { name: string; films: ReturnType<typeof mapFilm>[] }>();
    for (const film of films) {
      for (const ft of film.tags) {
        const key = ft.tag.slug;
        if (!tagsMap.has(key)) {
          tagsMap.set(key, { name: ft.tag.name, films: [] });
        }
        tagsMap.get(key)!.films.push(mapFilm(film));
      }
    }
    const byVibe = Array.from(tagsMap.entries())
      .filter(([, v]) => v.films.length > 0)
      .map(([slug, v]) => ({
        slug: `vibe-${slug}`,
        title: v.name,
        films: v.films,
      }));

    // Оригинальные подборки
    const original = [
      {
        slug: "top-rated",
        title: "Высокий рейтинг",
        films: [...films]
          .sort((a, b) => Number(b.rating) - Number(a.rating))
          .slice(0, 6)
          .map(mapFilm),
      },
      {
        slug: "fresh",
        title: "Новинки",
        films: [...films]
          .sort((a, b) => b.year - a.year)
          .slice(0, 6)
          .map(mapFilm),
      },
      {
        slug: "classics",
        title: "Классика",
        films: [...films]
          .filter((f) => f.year < 2010)
          .sort((a, b) => a.year - b.year)
          .map(mapFilm),
      },
    ].filter((c) => c.films.length > 0);

    return NextResponse.json({ byActor, byVibe, original });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}