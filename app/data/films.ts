// Тип одного стримингового сервиса.
export type StreamingService = {
  name: string;
  slug: string;
  url: string;
  color: string;
};

// Тип предметной сущности "Фильм".
export type Film = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  year: number;
  director: string;
  mood: string;
  country: string;
  image: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
  streaming: StreamingService[];
};

export const films: Film[] = [
  // ===================== Базовые 11 =====================
  {
    id: "hunger-2008",
    slug: "hunger-2008",
    title: "Голод",
    summary:
      "Драма о забастовке заключённых в тюрьме Белфаста и голодовке Бобби Сэндса.",
    year: 2008,
    director: "Стив Маккуин",
    mood: "Напряжение и борьба",
    country: "Великобритания",
    image: "/images/films/hunger.jpg",
    imageAlt: "постер голод",
    latitude: 52.7074,
    longitude: -0.1278,
    streaming: [
      {
        name: "Premier",
        slug: "premier",
        url: "https://premier.one/show/golod",
        color: "#FFD400",
      },
    ],
  },
  {
    id: "platform-2019",
    slug: "platform-2019",
    title: "Платформа",
    summary:
      "Антиутопия о тюрьме, где заключённые зависят от платформы с едой, которая спускается сверху вниз.",
    year: 2019,
    director: "Гальдер Гастелу-Уррутия",
    mood: "Мрачная антиутопия",
    country: "Испания",
    image: "/images/films/platform.jpg",
    imageAlt: "постер платформа",
    latitude: 40.4168,
    longitude: -3.7038,
    streaming: [
      {
        name: "Netflix",
        slug: "netflix",
        url: "https://www.netflix.com/",
        color: "#E50914",
      },
    ],
  },
  {
    id: "method-2025",
    slug: "method-2025",
    title: "Метод исключения",
    summary:
      "Детективный триллер о расследовании серии загадочных преступлений в Сеуле.",
    year: 2025,
    director: "Пак Чхан Ук",
    mood: "Загадка и расследование",
    country: "Южная Корея",
    image: "/images/films/method.jpg",
    imageAlt: "постер метод исключения",
    latitude: 35.5665,
    longitude: 126.978,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/484791/", color: "#FF5500" },
      { name: "START", slug: "start", url: "https://start.ru/watch/metod-isklyucheniya", color: "#DC2626" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/metod-isklyucheniya-year-2025", color: "#C2410C" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/metod-isklyucheniya", color: "#F5003D" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/eojjeolsugaeopda", color: "#4C1D95" },
    ],
  },
  {
    id: "holidays-2022",
    slug: "holidays-2022",
    title: "Каникулы",
    summary: "Учительницы везут подростков на театральный фестиваль в Сочи.",
    year: 2022,
    director: "Анна Меликян",
    mood: "Взросление и приключения",
    country: "Россия",
    image: "/images/films/holidays.png",
    imageAlt: "постер каникулы",
    latitude: 55.7558,
    longitude: 37.6173,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/2000124/", color: "#FF5500" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/kanikuly-year-2022", color: "#C2410C" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/kanikuly-644403276", color: "#4C1D95" },
    ],
  },
  {
    id: "hyacinth-2021",
    slug: "hyacinth-2021",
    title: "Гиацинт",
    summary:
      "Психологическая драма о семейных тайнах и поиске себя в послевоенной Польше.",
    year: 2021,
    director: "Пётр Домалевский",
    mood: "Размышления и драма",
    country: "Польша",
    image: "/images/films/hyacinth.jpg",
    imageAlt: "постер гиацинт",
    latitude: 52.2297,
    longitude: 21.0122,
    streaming: [
      { name: "Netflix", slug: "netflix", url: "https://www.netflix.com/", color: "#E50914" },
    ],
  },
  {
    id: "shutter-island-2009",
    slug: "shutter-island-2009",
    title: "Остров проклятых",
    summary:
      "Психологический триллер о маршале, расследующем исчезновение пациентки закрытой лечебницы.",
    year: 2009,
    director: "Мартин Скорсезе",
    mood: "Загадка и напряжение",
    country: "США",
    image: "/images/films/shutter-island.jpg",
    imageAlt: "постер остров проклятых",
    latitude: 47.6062,
    longitude: -122.3321,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/397667/", color: "#FF5500" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/ostrov-proklyatykh-year-2009", color: "#C2410C" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/89599", color: "#F5003D" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/shutter-island", color: "#4C1D95" },
      { name: "START", slug: "start", url: "https://start.ru/watch/ostrov-proklyatyh", color: "#DC2626" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/ostrov-proklyatyh", color: "#7B61FF" },
    ],
  },
  {
    id: "wasabi-2001",
    slug: "wasabi-2001",
    title: "Васаби",
    summary:
      "Комедийный боевик о французском полицейском, который узнаёт о существовании дочери в Японии.",
    year: 2001,
    director: "Жерар Кравчик",
    mood: "Лёгкость и юмор",
    country: "Франция",
    image: "/images/films/wasabi.jpg",
    imageAlt: "постер васаби",
    latitude: 48.8566,
    longitude: 2.3522,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/14288/", color: "#FF5500" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/132447", color: "#F5003D" },
    ],
  },
  {
    id: "nice-guys-2016",
    slug: "nice-guys-2016",
    title: "Славные парни",
    summary:
      "Криминальная комедия о незадачливом сыщике и его напарнике-головорезе.",
    year: 2016,
    director: "Шейн Блэк",
    mood: "Лёгкость и юмор",
    country: "США",
    image: "/images/films/nice-guys.jpg",
    imageAlt: "постер славные парни",
    latitude: 47.6062,
    longitude: -122.3321,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/841152/", color: "#FF5500" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/the-nice-guys", color: "#4C1D95" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/slavnye-parni-year-2016", color: "#C2410C" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/slavnye-parni-2016-1", color: "#7B61FF" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/138661", color: "#F5003D" },
    ],
  },
  {
    id: "behind-reality-2026",
    slug: "behind-reality-2026",
    title: "Закулисье реальности",
    summary: "Фантастическая драма о границе между сном и явью.",
    year: 2026,
    director: "Кейн Парсонс",
    mood: "Загадка и размышление",
    country: "США",
    image: "/images/films/behind-reality.jpg",
    imageAlt: "постер закулисье реальности",
    latitude: 50.6062,
    longitude: -122.3321,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/5452841/", color: "#FF5500" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/the-backrooms-649630747", color: "#4C1D95" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/zakulise-realnosti", color: "#7B61FF" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/zakulise-realnosti", color: "#F5003D" },
      { name: "START", slug: "start", url: "https://start.ru/watch/zakulise-realnosti", color: "#DC2626" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/zakulise-realnosti-year-2026", color: "#C2410C" },
    ],
  },
  {
    id: "lone-wolves-2024",
    slug: "lone-wolves-2024",
    title: "Одинокие волки",
    summary: "Криминальная комедия о двух наёмниках, которых объединяют в пару.",
    year: 2024,
    director: "Джон Уоттс",
    mood: "Лёгкость и напряжение",
    country: "Великобритания",
    image: "/images/films/lone-wolves.jpg",
    imageAlt: "постер одинокие волки",
    latitude: 51.5074,
    longitude: -0.1278,
    streaming: [
      { name: "Apple TV", slug: "appletv", url: "https://tv.apple.com/", color: "#374151" },
    ],
  },
  {
    id: "memories-of-murder-2003",
    slug: "memories-of-murder-2003",
    title: "Воспоминания об убийстве",
    summary: "Детектив о расследовании серии убийств в провинции Кёнгидо.",
    year: 2003,
    director: "Пон Джун Хо",
    mood: "Загадка и напряжение",
    country: "Южная Корея",
    image: "/images/films/memories-of-murder.jpg",
    imageAlt: "постер воспоминания об убийстве",
    latitude: 37.5665,
    longitude: 126.978,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/65770/", color: "#FF5500" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/salinui-chueok", color: "#4C1D95" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/vospominaniya-ob-ubiystve-year-2003", color: "#C2410C" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/131527", color: "#F5003D" },
      { name: "START", slug: "start", url: "https://start.ru/watch/vospominaniya-ob-ubiystve", color: "#DC2626" },
    ],
  },

  // ===================== Новые 8 =====================
  {
    id: "12-years-a-slave-2013",
    slug: "12-years-a-slave-2013",
    title: "12 лет рабства",
    summary:
      "Историческая драма о свободном афроамериканце, похищенном и проданном в рабство.",
    year: 2013,
    director: "Стив Маккуин",
    mood: "Боль и надежда",
    country: "США",
    image: "/images/films/12-years.jpg",
    imageAlt: "постер 12 лет рабства",
    latitude: 38.627,
    longitude: -90.1994,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/606646/", color: "#FF5500" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.tv/watch/106217", color: "#F5003D" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/12-let-rabstva-year-2013", color: "#C2410C" },
      { name: "START", slug: "start", url: "https://start.ru/watch/12-let-rabstva", color: "#DC2626" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/12-let-rabstva", color: "#7B61FF" },
      { name: "Premier", slug: "premier", url: "https://premier.one/show/12-let-rabstva", color: "#FFD400" },
      { name: "Viju", slug: "viju", url: "https://viju.ru/movies/12-let-rabstva/", color: "#00A3E0" },
    ],
  },
  {
    id: "shame-2011",
    slug: "shame-2011",
    title: "Стыд",
    summary:
      "Психологическая драма о зависимости и одиночестве в современном Нью-Йорке.",
    year: 2011,
    director: "Стив Маккуин",
    mood: "Отчуждение и откровение",
    country: "Великобритания",
    image: "/images/films/shame.jpg",
    imageAlt: "постер стыд",
    latitude: 40.7128,
    longitude: -74.006,
    streaming: [
      { name: "Иви", slug: "ivi", url: "https://www.ivi.tv/watch/107420", color: "#F5003D" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/shame", color: "#4C1D95" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/styd-year-2011", color: "#C2410C" },
    ],
  },
  {
    id: "prometheus-2012",
    slug: "prometheus-2012",
    title: "Прометей",
    summary:
      "Фантастический эпос о поиске истоков человечества на далёкой планете.",
    year: 2012,
    director: "Ридли Скотт",
    mood: "Космос и страх",
    country: "США",
    image: "/images/films/prometheus.jpg",
    imageAlt: "постер прометей",
    latitude: 34.0522,
    longitude: -118.2437,
    streaming: [
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/prometheus", color: "#4C1D95" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/prometey-hd-year-2012", color: "#C2410C" },
    ],
  },
  {
    id: "grand-budapest-2014",
    slug: "grand-budapest-2014",
    title: "Отель «Гранд Будапешт»",
    summary:
      "Ироничная комедия о приключениях консьержа и его помощника в вымышленной стране.",
    year: 2014,
    director: "Уэс Андерсон",
    mood: "Лёгкость и абсурд",
    country: "США",
    image: "/images/films/budapest.jpg",
    imageAlt: "постер отель гранд будапешт",
    latitude: 48.2082,
    longitude: 16.3738,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/683999/", color: "#FF5500" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.tv/watch/114374", color: "#F5003D" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/otel-grand-budapesht-year-2014", color: "#C2410C" },
    ],
  },
  {
    id: "knives-out-2019",
    slug: "knives-out-2019",
    title: "Достать ножи",
    summary: "Детектив о расследовании смерти патриарха богатой семьи.",
    year: 2019,
    director: "Райан Джонсон",
    mood: "Остроумный детектив",
    country: "США",
    image: "/images/films/knives-out.jpg",
    imageAlt: "постер достать ножи",
    latitude: 42.3601,
    longitude: -71.0589,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/1188529/", color: "#FF5500" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/knives-out", color: "#4C1D95" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/dostat-nozhi-year-2019-93328166", color: "#C2410C" },
      { name: "START", slug: "start", url: "https://start.ru/watch/dostat-nozhi", color: "#DC2626" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/dostat-nozhi", color: "#7B61FF" },
    ],
  },
  {
    id: "arrival-2016",
    slug: "arrival-2016",
    title: "Прибытие",
    summary:
      "Фантастическая драма о лингвистке, пытающейся понять язык пришельцев.",
    year: 2016,
    director: "Дени Вильнёв",
    mood: "Размышление и надежда",
    country: "США",
    image: "/images/films/arrival.jpg",
    imageAlt: "постер прибытие",
    latitude: 38.9072,
    longitude: -77.0369,
    streaming: [
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/arrival", color: "#4C1D95" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/pribytie", color: "#7B61FF" },
      { name: "START", slug: "start", url: "https://start.ru/watch/pribytie", color: "#DC2626" },
    ],
  },
  {
    id: "get-out-2017",
    slug: "get-out-2017",
    title: "Прочь",
    summary:
      "Хоррор о чернокожем парне, который едет знакомиться с семьёй девушки.",
    year: 2017,
    director: "Джордан Пил",
    mood: "Ужас и сатира",
    country: "США",
    image: "/images/films/get-out.jpg",
    imageAlt: "постер прочь",
    latitude: 44.9778,
    longitude: -93.265,
    streaming: [
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/get-out", color: "#4C1D95" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/proch", color: "#7B61FF" },
    ],
  },
  {
    id: "lalaland-2016",
    slug: "lalaland-2016",
    title: "Ла-Ла Ленд",
    summary:
      "Музыкальная драма о любви джазового пианиста и начинающей актрисы.",
    year: 2016,
    director: "Дэмьен Шазелл",
    mood: "Мечта и грусть",
    country: "США",
    image: "/images/films/lalaland.jpg",
    imageAlt: "постер ла-ла ленд",
    latitude: 34.0522,
    longitude: -118.2437,
    streaming: [
      { name: "Кинопоиск", slug: "kinopoisk", url: "https://www.kinopoisk.ru/film/841081/", color: "#FF5500" },
      { name: "Иви", slug: "ivi", url: "https://www.ivi.ru/watch/136478", color: "#F5003D" },
      { name: "Okko", slug: "okko", url: "https://okko.tv/movie/la-la-land", color: "#4C1D95" },
      { name: "Wink", slug: "wink", url: "https://wink.ru/movies/la-la-lend-year-2016-54783645", color: "#C2410C" },
      { name: "КИОН", slug: "kion", url: "https://kion.ru/film/la-la-lend", color: "#7B61FF" },
    ],
  },
];

export function getFilm(id: string): Film | undefined {
  return films.find((film) => film.id === id);
}