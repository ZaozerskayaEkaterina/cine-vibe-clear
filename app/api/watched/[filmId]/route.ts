import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/current-user";
import { prisma } from "../../../lib/prisma";

type RouteParams = { params: Promise<{ filmId: string }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ watched: null });
  }

  const { filmId } = await context.params;

  const row = await prisma.watchedFilm.findUnique({
    where: { userId_filmId: { userId: user.id, filmId } },
  });

  if (!row) {
    return NextResponse.json({ watched: null });
  }

  return NextResponse.json({
    watched: {
      filmId: row.filmId,
      note: row.note,
      createdAt: row.createdAt,
    },
  });
}

export async function POST(_request: Request, context: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filmId } = await context.params;

  const film = await prisma.film.findUnique({
    where: { id: filmId },
    select: { id: true },
  });
  if (!film) {
    return NextResponse.json({ error: "Film not found" }, { status: 404 });
  }

  const row = await prisma.watchedFilm.upsert({
    where: { userId_filmId: { userId: user.id, filmId } },
    update: {},
    create: { userId: user.id, filmId },
  });

  return NextResponse.json(
    {
      watched: {
        filmId: row.filmId,
        note: row.note,
        createdAt: row.createdAt,
      },
    },
    { status: 201 },
  );
}

export async function PATCH(request: Request, context: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filmId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { note?: unknown };

  if (!("note" in body)) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const raw = typeof body.note === "string" ? body.note.trim() : "";
  const note = raw.length > 0 ? raw.slice(0, 2000) : null;

  const existing = await prisma.watchedFilm.findUnique({
    where: { userId_filmId: { userId: user.id, filmId } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not watched" }, { status: 404 });
  }

  const row = await prisma.watchedFilm.update({
    where: { userId_filmId: { userId: user.id, filmId } },
    data: { note },
  });

  return NextResponse.json({
    watched: {
      filmId: row.filmId,
      note: row.note,
      createdAt: row.createdAt,
    },
  });
}

export async function DELETE(_request: Request, context: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filmId } = await context.params;
  const result = await prisma.watchedFilm.deleteMany({
    where: { userId: user.id, filmId },
  });

  return NextResponse.json({ deleted: result.count });
}