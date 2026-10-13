import { describe, expect, test } from "vitest";
import {
  normalizeEmail,
  validateRegistration,
} from "../../app/lib/validation";

describe("normalizeEmail", () => {
  test("удаляет пробелы и приводит email к нижнему регистру", () => {
    expect(normalizeEmail(" Student@Example.TEST ")).toBe(
      "student@example.test",
    );
  });

  test("возвращает пустую строку для null и undefined", () => {
    expect(normalizeEmail(null)).toBe("");
    expect(normalizeEmail(undefined)).toBe("");
  });
});

describe("validateRegistration", () => {
  test("принимает корректный набор полей", () => {
    const result = validateRegistration({
      name: "Студент",
      email: "student@example.test",
      password: "CinePass_2026!",
      confirmPassword: "CinePass_2026!",
    });

    expect(result.errors).toEqual([]);
    expect(result.data?.email).toBe("student@example.test");
    expect(result.data?.name).toBe("Студент");
  });

  test("отклоняет слишком короткий пароль", () => {
    const result = validateRegistration({
      name: "Студент",
      email: "student@example.test",
      password: "short",
      confirmPassword: "short",
    });

    expect(result.data).toBeNull();
    expect(result.errors).toContain(
      "Пароль должен содержать не менее 8 символов",
    );
  });

  test("отклоняет несовпадающее подтверждение пароля", () => {
    const result = validateRegistration({
      name: "Студент",
      email: "student@example.test",
      password: "CinePass_2026!",
      confirmPassword: "Different_2026!",
    });

    expect(result.errors).toContain("Пароли не совпадают");
  });

  test("отклоняет некорректный email", () => {
    const result = validateRegistration({
      name: "Студент",
      email: "not-an-email",
      password: "CinePass_2026!",
      confirmPassword: "CinePass_2026!",
    });

    expect(result.errors).toContain("Некорректный email");
  });

  test("отклоняет слишком короткое имя", () => {
    const result = validateRegistration({
      name: "A",
      email: "student@example.test",
      password: "CinePass_2026!",
      confirmPassword: "CinePass_2026!",
    });

    expect(result.errors).toContain(
      "Имя должно содержать от 2 до 80 символов",
    );
  });
});