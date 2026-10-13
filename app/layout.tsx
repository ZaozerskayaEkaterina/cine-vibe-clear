import type { Metadata, Viewport } from "next";
import AuthProvider from "./providers/AuthProvider";
import BurgerMenu from "./ui/BurgerMenu/BurgerMenu";
import { castileo, cruinn, darkDeco } from "./fonts/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cine-Vibe — кинотеатр под настроение",
  description: "Фильмы по вайбу, подборки, каталог и билеты на вечер",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${castileo.variable} ${darkDeco.variable} ${cruinn.variable}`}
    >
      <body>
        <AuthProvider>
          <BurgerMenu />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}