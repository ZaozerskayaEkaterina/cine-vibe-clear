import { NextResponse } from "next/server";
import { getCurrentUser } from "../../lib/current-user";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.watchedFilm.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      film: {
        include: {
          genres: { include: { genre: true } },
          tags: { include: { tag: true } },
          actors: { include: { actor: true } },
        },
      },
    },
  });

  const watched = rows.map((row) => ({
    filmId: row.filmId,
    note: row.note,
    createdAt: row.createdAt,
    film: {
      id: row.film.id,
      slug: row.film.slug,
      title: row.film.title,
      summary: row.film.summary,
      year: row.film.year,
      director: row.film.director,
      mood: row.film.mood,
      country: row.film.country,
      image: row.film.image,
      imageAlt: row.film.imageAlt,
      rating: Number(row.film.rating),
      genres: row.film.genres.map((g) => ({
        slug: g.genre.slug,
        name: g.genre.name,
      })),
      tags: row.film.tags.map((t) => ({
        slug: t.tag.slug,
        name: t.tag.name,
      })),
      actors: row.film.actors.map((a) => ({
        slug: a.actor.slug,
        name: a.actor.name,
      })),
    },
  }));

  return NextResponse.json({ watched });
}