import PlacesGallery from "./_components/PlacesGallery";

export default function GalleryPage() {
  return (
    <main className="gallery-page">
      <header className="page-hero">
        <p className="page-hero__kicker">Афиша сеансов</p>
        <h1 className="page-hero__title">Cine-Vibe</h1>
        <p className="page-hero__lead">
          Выбирайте фильм по настроению, году, жанру или любимому актёру.
        </p>
      </header>
      <PlacesGallery />
    </main>
  );
}