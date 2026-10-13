-- CreateTable
CREATE TABLE "WatchedFilm" (
    "userId" UUID NOT NULL,
    "filmId" UUID NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedFilm_pkey" PRIMARY KEY ("userId","filmId")
);

-- CreateIndex
CREATE INDEX "WatchedFilm_filmId_idx" ON "WatchedFilm"("filmId");

-- CreateIndex
CREATE INDEX "WatchedFilm_userId_idx" ON "WatchedFilm"("userId");

-- AddForeignKey
ALTER TABLE "WatchedFilm" ADD CONSTRAINT "WatchedFilm_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedFilm" ADD CONSTRAINT "WatchedFilm_filmId_fkey"
    FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Переносим существующие отметки "просмотрено" и заметки
INSERT INTO "WatchedFilm" ("userId", "filmId", "note", "createdAt", "updatedAt")
SELECT
  "userId",
  "filmId",
  "note",
  COALESCE("createdAt", NOW()),
  NOW()
FROM "FavoriteFilm"
WHERE "watched" = true OR "note" IS NOT NULL
ON CONFLICT ("userId", "filmId") DO NOTHING;

-- Убираем дублирующие столбцы из FavoriteFilm
ALTER TABLE "FavoriteFilm" DROP COLUMN "updatedAt";
ALTER TABLE "FavoriteFilm" DROP COLUMN "watched";
ALTER TABLE "FavoriteFilm" DROP COLUMN "note";