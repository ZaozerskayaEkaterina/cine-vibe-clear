import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import { createSession } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { normalizeEmail } from "../../../lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(body.email);
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { errors: ["Заполните email и пароль"] },
        { status: 400 },
      );
    }

    const account = await prisma.user.findUnique({ where: { email } });

    if (!account || !(await compare(password, account.passwordHash))) {
      return NextResponse.json(
        { errors: ["Неверный email или пароль"] },
        { status: 401 },
      );
    }

    await createSession({ userId: account.id, name: account.name });

    const user = {
      id: account.id,
      name: account.name,
      email: account.email,
    };
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { errors: ["Внутренняя ошибка сервера"] },
      { status: 500 },
    );
  }
}