import { Prisma } from "@prisma/client";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { createSession } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { validateRegistration } from "../../../lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateRegistration(body);

    if (!validation.data) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;
    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    });

    await createSession({ userId: user.id, name: user.name });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { errors: ["Этот email уже зарегистрирован"] },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { errors: ["Внутренняя ошибка сервера"] },
      { status: 500 },
    );
  }
}