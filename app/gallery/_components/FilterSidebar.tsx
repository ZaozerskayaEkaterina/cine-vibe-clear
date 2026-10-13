"use client";

type Props = {
  options: {
    genres: { slug: string; name: string }[];
    tags: { slug: string; name: string }[];
    yearFrom: number;
    yearTo: number;
  };
  yearFrom: number | "";
  yearTo: number | "";
  setYearFrom: (v: number | "") => void;
  setYearTo: (v: number | "") => void;
  genres: string[];
  setGenres: (v: string[]) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  sort: string;
  setSort: (v: string) => void;
};

export default function FilterSidebar({
  options,
  yearFrom,
  yearTo,
  setYearFrom,
  setYearTo,
  genres,
  setGenres,
  tags,
  setTags,
  sort,
  setSort,
}: Props) {
  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  return (
    <aside className="gallery-sidebar" aria-label="Фильтры">
      <section className="filter-block">
        <h3 className="filter-title">Сортировка</h3>
        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="rating-desc">Рейтинг ↓</option>
          <option value="rating-asc">Рейтинг ↑</option>
          <option value="year-desc">Год ↓</option>
          <option value="year-asc">Год ↑</option>
        </select>
      </section>

      <section className="filter-block">
        <h3 className="filter-title">Год</h3>
        <div className="filter-year">
          <input
            type="number"
            min={options.yearFrom}
            max={options.yearTo}
            value={yearFrom}
            onChange={(e) =>
              setYearFrom(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="от"
          />
          <span>—</span>
          <input
            type="number"
            min={options.yearFrom}
            max={options.yearTo}
            value={yearTo}
            onChange={(e) =>
              setYearTo(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="до"
          />
        </div>
      </section>

      <section className="filter-block">
        <h3 className="filter-title">Жанры</h3>
        <div className="filter-chips">
          {options.genres.map((g) => (
            <button
              key={g.slug}
              type="button"
              className={`filter-chip ${genres.includes(g.slug) ? "is-active" : ""}`}
              onClick={() => toggle(genres, g.slug, setGenres)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-block">
        <h3 className="filter-title">Метки</h3>
        <div className="filter-chips">
          {options.tags.map((t) => (
            <button
              key={t.slug}
              type="button"
              className={`filter-chip ${tags.includes(t.slug) ? "is-active" : ""}`}
              onClick={() => toggle(tags, t.slug, setTags)}
            >
              {t.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}