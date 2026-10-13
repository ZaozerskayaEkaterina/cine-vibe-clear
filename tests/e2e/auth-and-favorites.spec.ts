import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

const prisma = new PrismaClient();
let testEmail = "";

test.afterAll(async () => {
  if (testEmail) {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  }
  await prisma.$disconnect();
});

test("пользователь регистрируется и добавляет фильм в избранное", async ({
  page,
}) => {
  testEmail = `e2e-${Date.now()}@example.test`;

  page.on("request", (r) => {
    const u = r.url();
    if (u.includes("/api/")) {
      console.log("→", r.method(), u.replace("http://localhost:3001", ""));
    }
  });
  page.on("response", async (r) => {
    const u = r.url();
    if (u.includes("/api/")) {
      let body = "";
      try {
        body = (await r.text()).slice(0, 200);
      } catch {}
      console.log("←", r.status(), u.replace("http://localhost:3001", ""), body);
    }
  });

  await page.goto("/auth/register");
  await page.getByLabel("Имя").fill("E2E студент");
  await page.getByLabel("Email").fill(testEmail);
  await page.getByLabel("Пароль", { exact: true }).fill("CinePass_2026!");
  await page.getByLabel("Повторите пароль").fill("CinePass_2026!");
  await page.getByRole("button", { name: "Зарегистрироваться" }).click();

  await expect(page).toHaveURL(/\/gallery/, { timeout: 15_000 });

  await page.goto("/catalog");
  const firstFilmLink = page
    .locator('a[aria-label^="Открыть страницу"]')
    .first();
  await firstFilmLink.click();

  await expect(page).toHaveURL(/\/catalog\/[^/?]+/);
  console.log("URL фильма:", page.url());

  const addFavButton = page.getByRole("button", {
    name: /Добавить в избранное/,
  });
  await expect(addFavButton).toBeVisible({ timeout: 10_000 });

  // Клик — и ждём именно POST /api/favorites
  await Promise.all([
    page.waitForResponse(
      (r) =>
        r.url().includes("/api/favorites/") &&
        r.request().method() === "POST",
      { timeout: 15_000 },
    ),
    addFavButton.click(),
  ]);

  // Кнопка сменилась
  await expect(
    page.getByRole("button", { name: /Убрать из избранного/ }),
  ).toBeVisible({ timeout: 10_000 });

  // Небольшая пауза, чтобы сервер точно закоммитил
  await page.waitForTimeout(800);

  // Проверяем в БД (до reload)
  const inDb = await prisma.favoriteFilm.findMany({
    where: {
      user: { email: testEmail },
    },
  });
  console.log("Записей в FavoriteFilm для e2e-пользователя:", inDb.length);

  // Перезагрузка
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Убрать из избранного/ }),
  ).toBeVisible({ timeout: 10_000 });

  await page.goto("/cabinet");
  await expect(page.locator("article").first()).toBeVisible({
    timeout: 10_000,
  });

  await page.getByRole("button", { name: /Выйти из аккаунта/ }).click();
});