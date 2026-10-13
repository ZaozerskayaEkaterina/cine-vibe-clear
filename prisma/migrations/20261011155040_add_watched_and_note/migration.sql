-- AlterTable
ALTER TABLE "FavoriteFilm" ADD COLUMN     "note" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "watched" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Film" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "FavoriteFilm_userId_watched_idx" ON "FavoriteFilm"("userId", "watched");
