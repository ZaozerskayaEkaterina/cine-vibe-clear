import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/current-user";
import { prisma } from "../../../lib/prisma";

type RouteParams = { params: Promise<{ filmId: string }> };

export async function GET(_request: Request, context: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ favorite: null });
  }

  const { filmId } = await context.params;

  const favorite = await prisma.favoriteFilm.findUnique({
    where: { userId_filmId: { userId: user.id, filmId } },
  });

  return NextResponse.json({ favorite });
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

  const favorite = await prisma.favoriteFilm.upsert({
    where: { userId_filmId: { userId: user.id, filmId } },
    update: {},
    create: { userId: user.id, filmId },
  });

  return NextResponse.json({ favorite }, { status: 201 });
}

export async function DELETE(_request: Request, context: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filmId } = await context.params;
  const result = await prisma.favoriteFilm.deleteMany({
    where: { userId: user.id, filmId },
  });

  return NextResponse.json({ deleted: result.count });
}