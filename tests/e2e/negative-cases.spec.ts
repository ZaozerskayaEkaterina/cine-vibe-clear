import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

const prisma = new PrismaClient();
const API = "http://localhost:3001";

test.afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { startsWith: "e2e-neg-" } },
  });
  await prisma.$disconnect();
});

test("регистрация с коротким паролем возвращает 400", async ({ request }) => {
  const response = await request.post(`${API}/api/auth/register`, {
    data: {
      name: "Тест",
      email: "e2e-neg-short@example.test",
      password: "short",
      confirmPassword: "short",
    },
  });

  expect(response.status()).toBe(400);

  const body = (await response.json()) as { errors?: string[] };
  expect(body.errors).toContain(
    "Пароль должен содержать не менее 8 символов",
  );
});

test("регистрация с занятым email возвращает 409", async ({ request }) => {
  const email = `e2e-neg-dup-${Date.now()}@example.test`;
  const password = "CinePass_2026!";

  const first = await request.post(`${API}/api/auth/register`, {
    data: {
      name: "Первый",
      email,
      password,
      confirmPassword: password,
    },
  });
  expect(first.status()).toBe(201);

  const second = await request.post(`${API}/api/auth/register`, {
    data: {
      name: "Второй",
      email,
      password,
      confirmPassword: password,
    },
  });
  expect(second.status()).toBe(409);
});

test("гостевой POST на избранное возвращает 401", async ({ request }) => {
  const filmsResponse = await request.get(`${API}/api/films`);
  expect(filmsResponse.status()).toBe(200);

  const { films } = (await filmsResponse.json()) as {
    films: { id: string }[];
  };
  const filmId = films[0].id;

  const response = await request.post(`${API}/api/favorites/${filmId}`, {
    data: {},
  });

  expect(response.status()).toBe(401);
});