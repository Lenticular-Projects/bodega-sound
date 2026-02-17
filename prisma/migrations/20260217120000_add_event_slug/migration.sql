-- AlterTable: Add slug column with a temporary default
ALTER TABLE "Event" ADD COLUMN "slug" TEXT;

-- Backfill existing rows: generate slug from id
UPDATE "Event" SET "slug" = LOWER(REPLACE("id", '_', '-')) WHERE "slug" IS NULL;

-- Make the column required
ALTER TABLE "Event" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");
