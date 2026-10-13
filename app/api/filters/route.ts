import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [genres, tags, years] = await Promise.all([
      prisma.genre.findMany({ orderBy: { name: "asc" } }),
      prisma.tag.findMany({ orderBy: { name: "asc" } }),
      prisma.film.aggregate({
        _min: { year: true },
        _max: { year: true },
      }),
    ]);

    return NextResponse.json({
      genres: genres.map((g) => ({ slug: g.slug, name: g.name })),
      tags: tags.map((t) => ({ slug: t.slug, name: t.name })),
      yearFrom: years._min.year ?? 1900,
      yearTo: years._max.year ?? new Date().getFullYear(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}