import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const genres = [
  { slug: "drama", name: "Драма" },
  { slug: "thriller", name: "Триллер" },
  { slug: "comedy", name: "Комедия" },
  { slug: "fantasy", name: "Фантастика" },
  { slug: "crime", name: "Криминал" },
  { slug: "detective", name: "Детектив" },
  { slug: "biography", name: "Биография" },
  { slug: "history", name: "Историческое" },
  { slug: "adventure", name: "Приключения" },
  { slug: "horror", name: "Хоррор" },
];

const tags = [
  { slug: "cozy", name: "Уютное" },
  { slug: "tense", name: "Напряжённое" },
  { slug: "inspiring", name: "Вдохновляющее" },
  { slug: "dark", name: "Мрачное" },
  { slug: "warm", name: "Тёплое" },
  { slug: "smart", name: "Умное" },
  { slug: "fun", name: "Весёлое" },
  { slug: "epic", name: "Эпичное" },
  { slug: "romantic", name: "Романтичное" },
];

const actors = [
  { slug: "michael-fassbender", name: "Майкл Фассбендер" },
  { slug: "leonardo-dicaprio", name: "Леонардо ДиКаприо" },
  { slug: "mark-ruffalo", name: "Марк Руффало" },
  { slug: "ryan-gosling", name: "Райан Гослинг" },
  { slug: "russell-crowe", name: "Рассел Кроу" },
  { slug: "jean-reno", name: "Жан Рено" },
  { slug: "ryoko-hirosue", name: "Рёко Хиросуэ" },
  { slug: "song-kang-ho", name: "Сон Кан Хо" },
  { slug: "choi-min-sik", name: "Чхве Мин Сик" },
  { slug: "kim-sang-kyung", name: "Ким Сан Гён" },
  { slug: "yura-borisov", name: "Юра Борисов" },
  { slug: "charlize-theron", name: "Шарлиз Терон" },
  { slug: "noomi-rapace", name: "Нуми Рапас" },
  { slug: "idris-elba", name: "Идрис Эльба" },
  { slug: "michael-fassbender", name: "Майкл Фассбендер" },
];

const films = [
  {
    slug: "hunger-2008",
    title: "Голод",
    summary: "Драма о забастовке заключённых в тюрьме Белфаста и голодовке Бобби Сэндса.",
    year: 2008,
    director: "Стив Маккуин",
    mood: "Напряжение и борьба",
    country: "Великобритания",
    image: "/images/films/hunger.jpg",
    imageAlt: "постер голод",
    latitude: "52.707400",
    longitude: "-0.127800",
    rating: "7.6",
    genres: ["drama", "biography", "history"],
    tags: ["tense", "dark", "smart"],
    actors: ["michael-fassbender"],
  },
  {
    slug: "platform-2019",
    title: "Платформа",
    summary: "Антиутопия о тюрьме, где заключённые зависят от платформы с едой.",
    year: 2019,
    director: "Гальдер Гастелу-Уррутия",
    mood: "Мрачная антиутопия",
    country: "Испания",
    image: "/images/films/platform.jpg",
    imageAlt: "постер платформа",
    latitude: "40.416800",
    longitude: "-3.703800",
    rating: "7.0",
    genres: ["thriller", "fantasy", "drama"],
    tags: ["dark", "tense", "smart"],
    actors: [],
  },
  {
    slug: "method-2025",
    title: "Метод исключения",
    summary: "Детективный триллер о расследовании серии преступлений в Сеуле.",
    year: 2025,
    director: "Пак Чхан Ук",
    mood: "Загадка и расследование",
    country: "Южная Корея",
    image: "/images/films/method.jpg",
    imageAlt: "постер метод исключения",
    latitude: "35.566500",
    longitude: "126.978000",
    rating: "8.2",
    genres: ["thriller", "detective", "crime"],
    tags: ["tense", "smart", "dark"],
    actors: ["song-kang-ho", "choi-min-sik"],
  },
  {
    slug: "holidays-2022",
    title: "Каникулы",
    summary: "Учительницы везут подростков на театральный фестиваль в Сочи.",
    year: 2022,
    director: "Анна Меликян",
    mood: "Взросление и приключения",
    country: "Россия",
    image: "/images/films/holidays.png",
    imageAlt: "постер каникулы",
    latitude: "55.755800",
    longitude: "37.617300",
    rating: "6.8",
    genres: ["comedy", "drama", "adventure"],
    tags: ["warm", "fun", "inspiring"],
    actors: [],
  },
  {
    slug: "hyacinth-2021",
    title: "Гиацинт",
    summary: "Психологическая драма о семейных тайнах и поиске себя в послевоенной Польше.",
    year: 2021,
    director: "Пётр Домалевский",
    mood: "Размышления и драма",
    country: "Польша",
    image: "/images/films/hyacinth.jpg",
    imageAlt: "постер гиацинт",
    latitude: "52.229700",
    longitude: "21.012200",
    rating: "7.1",
    genres: ["drama"],
    tags: ["smart", "dark", "tense"],
    actors: [],
  },
  {
    slug: "shutter-island-2009",
    title: "Остров проклятых",
    summary: "Психологический триллер о маршале, расследующем исчезновение пациентки закрытой лечебницы.",
    year: 2009,
    director: "Мартин Скорсезе",
    mood: "Загадка и напряжение",
    country: "США",
    image: "/images/films/shutter-island.jpg",
    imageAlt: "постер остров проклятых",
    latitude: "47.606200",
    longitude: "-122.332100",
    rating: "8.2",
    genres: ["thriller", "detective", "drama"],
    tags: ["tense", "dark", "smart"],
    actors: ["leonardo-dicaprio", "mark-ruffalo"],
  },
  {
    slug: "wasabi-2001",
    title: "Васаби",
    summary: "Комедийный боевик о французском полицейском, который узнаёт о существовании дочери в Японии.",
    year: 2001,
    director: "Жерар Кравчик",
    mood: "Лёгкость и юмор",
    country: "Франция",
    image: "/images/films/wasabi.jpg",
    imageAlt: "постер васаби",
    latitude: "48.856600",
    longitude: "2.352200",
    rating: "6.7",
    genres: ["comedy", "crime", "adventure"],
    tags: ["fun", "warm"],
    actors: ["jean-reno", "ryoko-hirosue"],
  },
  {
    slug: "nice-guys-2016",
    title: "Славные парни",
    summary: "Криминальная комедия о незадачливом сыщике и его напарнике-головорезе.",
    year: 2016,
    director: "Шейн Блэк",
    mood: "Лёгкость и юмор",
    country: "США",
    image: "/images/films/nice-guys.jpg",
    imageAlt: "постер славные парни",
    latitude: "47.606200",
    longitude: "-122.332100",
    rating: "7.4",
    genres: ["comedy", "crime", "detective"],
    tags: ["fun", "smart"],
    actors: ["ryan-gosling", "russell-crowe"],
  },
  {
    slug: "behind-reality-2026",
    title: "Закулисье реальности",
    summary: "Фантастическая драма о границе между сном и явью.",
    year: 2026,
    director: "Кейн Парсонс",
    mood: "Загадка и размышление",
    country: "США",
    image: "/images/films/behind-reality.jpg",
    imageAlt: "постер закулисье реальности",
    latitude: "50.606200",
    longitude: "-122.332100",
    rating: "7.9",
    genres: ["fantasy", "thriller", "drama"],
    tags: ["smart", "dark", "tense"],
    actors: [],
  },
  {
    slug: "lone-wolves-2024",
    title: "Одинокие волки",
    summary: "Криминальная комедия о двух наёмниках, которых объединяют в пару.",
    year: 2024,
    director: "Джон Уоттс",
    mood: "Лёгкость и напряжение",
    country: "Великобритания",
    image: "/images/films/lone-wolves.jpg",
    imageAlt: "постер одинокие волки",
    latitude: "51.507400",
    longitude: "-0.127800",
    rating: "6.5",
    genres: ["comedy", "crime", "thriller"],
    tags: ["fun", "tense", "smart"],
    actors: [],
  },
  {
    slug: "memories-of-murder-2003",
    title: "Воспоминания об убийстве",
    summary: "Детектив о расследовании серии убийств в провинции Кёнгидо.",
    year: 2003,
    director: "Пон Джун Хо",
    mood: "Загадка и напряжение",
    country: "Южная Корея",
    image: "/images/films/memories-of-murder.jpg",
    imageAlt: "постер воспоминания об убийстве",
    latitude: "37.566500",
    longitude: "126.978000",
    rating: "8.1",
    genres: ["detective", "crime", "thriller", "drama"],
    tags: ["tense", "dark", "smart"],
    actors: ["song-kang-ho", "kim-sang-kyung"],
  },
  // ===== Новые фильмы с Майклом Фассбендером =====
  {
    slug: "12-years-a-slave-2013",
    title: "12 лет рабства",
    summary: "Историческая драма о свободном афроамериканце, похищенном и проданном в рабство.",
    year: 2013,
    director: "Стив Маккуин",
    mood: "Боль и надежда",
    country: "США",
    image: "/images/films/12-years.jpg",
    imageAlt: "постер 12 лет рабства",
    latitude: "38.627000",
    longitude: "-90.199400",
    rating: "8.1",
    genres: ["drama", "biography", "history"],
    tags: ["dark", "tense", "inspiring", "smart"],
    actors: ["michael-fassbender"],
  },
  {
    slug: "shame-2011",
    title: "Стыд",
    summary: "Психологическая драма о зависимости и одиночестве в современном Нью-Йорке.",
    year: 2011,
    director: "Стив Маккуин",
    mood: "Отчуждение и откровение",
    country: "Великобритания",
    image: "/images/films/shame.jpg",
    imageAlt: "постер стыд",
    latitude: "40.712800",
    longitude: "-74.006000",
    rating: "7.2",
    genres: ["drama"],
    tags: ["dark", "smart", "tense"],
    actors: ["michael-fassbender", "charlize-theron"],
  },
  {
    slug: "prometheus-2012",
    title: "Прометей",
    summary: "Фантастический эпос о поиске истоков человечества на далёкой планете.",
    year: 2012,
    director: "Ридли Скотт",
    mood: "Космос и страх",
    country: "США",
    image: "/images/films/prometheus.jpg",
    imageAlt: "постер прометей",
    latitude: "34.052200",
    longitude: "-118.243700",
    rating: "7.0",
    genres: ["fantasy", "adventure", "horror"],
    tags: ["epic", "dark", "tense", "smart"],
    actors: ["michael-fassbender", "noomi-rapace", "idris-elba"],
  },
  // ===== По одному в каждый жанр для наполнения =====
  {
    slug: "grand-budapest-2014",
    title: "Отель «Гранд Будапешт»",
    summary: "Ироничная комедия о приключениях консьержа и его помощника в вымышленной стране.",
    year: 2014,
    director: "Уэс Андерсон",
    mood: "Лёгкость и абсурд",
    country: "США",
    image: "/images/films/budapest.jpg",
    imageAlt: "постер отель гранд будапешт",
    latitude: "48.208200",
    longitude: "16.373800",
    rating: "8.1",
    genres: ["comedy", "adventure", "crime"],
    tags: ["fun", "warm", "smart"],
    actors: [],
  },
  {
    slug: "knives-out-2019",
    title: "Достать ножи",
    summary: "Детектив о расследовании смерти патриарха богатой семьи.",
    year: 2019,
    director: "Райан Джонсон",
    mood: "Остроумный детектив",
    country: "США",
    image: "/images/films/knives-out.jpg",
    imageAlt: "постер достать ножи",
    latitude: "42.360100",
    longitude: "-71.058900",
    rating: "7.9",
    genres: ["detective", "comedy", "crime"],
    tags: ["smart", "fun", "tense"],
    actors: [],
  },
  {
    slug: "arrival-2016",
    title: "Прибытие",
    summary: "Фантастическая драма о лингвистке, пытающейся понять язык пришельцев.",
    year: 2016,
    director: "Дени Вильнёв",
    mood: "Размышление и надежда",
    country: "США",
    image: "/images/films/arrival.jpg",
    imageAlt: "постер прибытие",
    latitude: "38.907200",
    longitude: "-77.036900",
    rating: "7.9",
    genres: ["fantasy", "drama", "thriller"],
    tags: ["smart", "tense", "inspiring"],
    actors: [],
  },
  {
    slug: "get-out-2017",
    title: "Прочь",
    summary: "Хоррор о чернокожем парне, который едет знакомиться с семьёй девушки.",
    year: 2017,
    director: "Джордан Пил",
    mood: "Ужас и сатира",
    country: "США",
    image: "/images/films/get-out.jpg",
    imageAlt: "постер прочь",
    latitude: "44.977800",
    longitude: "-93.265000",
    rating: "7.7",
    genres: ["horror", "thriller", "detective"],
    tags: ["dark", "tense", "smart"],
    actors: [],
  },
  {
    slug: "lalaland-2016",
    title: "Ла-Ла Ленд",
    summary: "Музыкальная драма о любви джазового пианиста и начинающей актрисы.",
    year: 2016,
    director: "Дэмьен Шазелл",
    mood: "Мечта и грусть",
    country: "США",
    image: "/images/films/lalaland.jpg",
    imageAlt: "постер ла-ла ленд",
    latitude: "34.052200",
    longitude: "-118.243700",
    rating: "8.0",
    genres: ["drama", "comedy"],
    tags: ["romantic", "warm", "inspiring"],
    actors: ["ryan-gosling"],
  },
];

async function main() {
  const passwordHash = await hash("CinePass_2026!", 12);

  const user = await prisma.user.upsert({
    where: { email: "student@example.test" },
    update: { name: "Демонстрационный студент", passwordHash },
    create: {
      name: "Демонстрационный студент",
      email: "student@example.test",
      passwordHash,
    },
  });

  const genreMap = new Map<string, string>();
  for (const g of genres) {
    const row = await prisma.genre.upsert({
      where: { slug: g.slug },
      update: { name: g.name },
      create: g,
    });
    genreMap.set(g.slug, row.id);
  }

  const tagMap = new Map<string, string>();
  for (const t of tags) {
    const row = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: t,
    });
    tagMap.set(t.slug, row.id);
  }

  const actorMap = new Map<string, string>();
  for (const a of actors) {
    const row = await prisma.actor.upsert({
      where: { slug: a.slug },
      update: { name: a.name },
      create: a,
    });
    actorMap.set(a.slug, row.id);
  }

  for (const film of films) {
    const { genres: gs, tags: ts, actors: as, ...rest } = film;

    const saved = await prisma.film.upsert({
      where: { slug: film.slug },
      update: rest,
      create: rest,
    });

    await prisma.filmGenre.deleteMany({ where: { filmId: saved.id } });
    await prisma.filmTag.deleteMany({ where: { filmId: saved.id } });
    await prisma.filmActor.deleteMany({ where: { filmId: saved.id } });

    for (const slug of gs) {
      const id = genreMap.get(slug);
      if (id) await prisma.filmGenre.create({ data: { filmId: saved.id, genreId: id } });
    }
    for (const slug of ts) {
      const id = tagMap.get(slug);
      if (id) await prisma.filmTag.create({ data: { filmId: saved.id, tagId: id } });
    }
    for (const slug of as) {
      const id = actorMap.get(slug);
      if (id) await prisma.filmActor.create({ data: { filmId: saved.id, actorId: id } });
    }
  }

  const first = await prisma.film.findUniqueOrThrow({
    where: { slug: "hunger-2008" },
  });
  await prisma.favoriteFilm.upsert({
    where: { userId_filmId: { userId: user.id, filmId: first.id } },
    update: {},
    create: { userId: user.id, filmId: first.id },
  });

  console.log(
    `Seed complete: 1 user, ${films.length} films, ${actors.length} actors, ${genres.length} genres, ${tags.length} tags`,
  );
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });