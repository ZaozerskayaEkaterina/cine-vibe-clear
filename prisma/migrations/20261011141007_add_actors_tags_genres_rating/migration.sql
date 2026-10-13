-- AlterTable
ALTER TABLE "Film" ADD COLUMN     "rating" DECIMAL(3,1) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Genre" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(60) NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmGenre" (
    "filmId" UUID NOT NULL,
    "genreId" UUID NOT NULL,

    CONSTRAINT "FilmGenre_pkey" PRIMARY KEY ("filmId","genreId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(60) NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmTag" (
    "filmId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "FilmTag_pkey" PRIMARY KEY ("filmId","tagId")
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(160) NOT NULL,

    CONSTRAINT "Actor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmActor" (
    "filmId" UUID NOT NULL,
    "actorId" UUID NOT NULL,

    CONSTRAINT "FilmActor_pkey" PRIMARY KEY ("filmId","actorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE INDEX "FilmGenre_genreId_idx" ON "FilmGenre"("genreId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "FilmTag_tagId_idx" ON "FilmTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_slug_key" ON "Actor"("slug");

-- CreateIndex
CREATE INDEX "FilmActor_actorId_idx" ON "FilmActor"("actorId");

-- AddForeignKey
ALTER TABLE "FilmGenre" ADD CONSTRAINT "FilmGenre_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmGenre" ADD CONSTRAINT "FilmGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmTag" ADD CONSTRAINT "FilmTag_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmTag" ADD CONSTRAINT "FilmTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmActor" ADD CONSTRAINT "FilmActor_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmActor" ADD CONSTRAINT "FilmActor_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Actor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
