/*
  Warnings:

  - You are about to drop the column `customAnswers` on the `RSVP` table. All the data in the column will be lost.
  - You are about to drop the column `tiktok` on the `RSVP` table. All the data in the column will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "RSVP" DROP COLUMN "customAnswers",
DROP COLUMN "tiktok";

-- DropTable
DROP TABLE "Chat";
