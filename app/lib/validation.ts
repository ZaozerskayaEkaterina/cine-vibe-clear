export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function normalizeEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function validateRegistration(value: unknown): {
  data: RegistrationInput | null;
  errors: string[];
} {
  const source =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  const data: RegistrationInput = {
    name: String(source.name ?? "").trim(),
    email: normalizeEmail(source.email),
    password: String(source.password ?? ""),
    confirmPassword: String(source.confirmPassword ?? ""),
  };

  const errors: string[] = [];

  if (data.name.length < 2 || data.name.length > 80) {
    errors.push("Имя должно содержать от 2 до 80 символов");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Некорректный email");
  }

  if (data.password.length < 8) {
    errors.push("Пароль должен содержать не менее 8 символов");
  }

  if (data.password !== data.confirmPassword) {
    errors.push("Пароли не совпадают");
  }

  return {
    data: errors.length === 0 ? data : null,
    errors,
  };
}