import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="page-hero">
        <p className="page-hero__kicker">О проекте</p>
        <h1 className="page-hero__title">Cine-Vibe</h1>
        <p className="page-hero__lead">
          Кинотеатр под настроение: вместо скучных жанровых фильтров — эмоции, вайб
          и оригинальные подборки.
        </p>
      </header>

      <section className={styles.section} aria-labelledby="idea-title">
        <h2 id="idea-title" className={styles.title}>
          Идея
        </h2>
        <p className={styles.text}>
          Cine-Vibe помогает найти фильм под текущее настроение, а не под
          формальный жанр. Вместо бесконечного скролла по каталогам — подборки
          по вайбу, актёрам и режиссёрам, крупные карточки, рейтинги и всё,
          что нужно для уютного вечера.
        </p>
        <p className={styles.text}>
          Каждый фильм — билет в свой мир: со своей страной, годом, настроением
          и цветом. Мы собираем их так, как собирали афиши в старых кинотеатрах.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="how-title">
        <h2 id="how-title" className={styles.title}>
          Что уже работает
        </h2>
        <ul className={styles.list}>
          <li>
            <strong>Галерея с подборками</strong> — фильмы по актёрам, вайбу и
            оригинальные подборки с горизонтальной прокруткой.
          </li>
          <li>
            <strong>Каталог</strong> — поиск по названию, режиссёру и актёру,
            фильтрация по жанрам, сортировка по рейтингу и году.
          </li>
          <li>
            <strong>Страница фильма</strong> — постер, описание, рейтинг,
            жанры, метки, актёры и ссылки на стриминговые сервисы.
          </li>
          <li>
            <strong>Фильм дня</strong> — на главной каждый день новая карточка,
            меняется автоматически.
          </li>
          <li>
            <strong>Личный кабинет</strong> — регистрация, вход и сохранение
            избранного в базе данных.
          </li>
          <li>
            <strong>Карта</strong> — страны производства фильмов на
            интерактивной карте.
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="tech-title">
        <h2 id="tech-title" className={styles.title}>
          Технологии
        </h2>
        <ul className={styles.chips}>
          <li className={styles.chip}>Next.js 16</li>
          <li className={styles.chip}>React 19</li>
          <li className={styles.chip}>TypeScript</li>
          <li className={styles.chip}>App Router</li>
          <li className={styles.chip}>PostgreSQL</li>
          <li className={styles.chip}>Prisma ORM</li>
          <li className={styles.chip}>bcrypt + jose</li>
          <li className={styles.chip}>Яндекс Карты</li>
          <li className={styles.chip}>CSS Modules</li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="author-title">
        <h2 id="author-title" className={styles.title}>
          Автор
        </h2>
        <div className={styles.author}>
          <div className={styles.authorAvatar} aria-hidden="true">
            ЕЗ
          </div>
          <div className={styles.authorInfo}>
            <p className={styles.authorName}>Заозерская Екатерина Сергеевна</p>
            <p className={styles.authorMeta}>
              Студентка группы 4326 · Институт информационных технологий и
              программирования
            </p>
            <p className={styles.authorMeta}>
              Направление: 09.03.02 Информационные системы и технологии
            </p>
          </div>
        </div>
        <p className={styles.text}>
          Проект выполнен в рамках курса «Web-программирование», кафедра № 42,
          Санкт-Петербургский государственный университет аэрокосмического
          приборостроения, 2026 год.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="contact-title">
        <h2 id="contact-title" className={styles.title}>
          Контакты
        </h2>
        <ul className={styles.contacts}>
          <li>
            <span className={styles.contactLabel}>Email</span>
            <a href="mailto:z.katusha5@gmail.com">z.katusha5@gmail.com</a>
          </li>
          <li>
            <span className={styles.contactLabel}>Телефон</span>
            <a href="tel:+79203075641">+7 920 307-56-41</a>
          </li>
        </ul>
      </section>
    </main>
  );
}