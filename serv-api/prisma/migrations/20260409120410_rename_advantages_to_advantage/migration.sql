/*
  Warnings:

  - You are about to drop the `Advantages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Advantages";

-- CreateTable
CREATE TABLE "Advantage" (
    "id" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "subtitle_uz" TEXT NOT NULL,
    "subtitle_ru" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advantage_pkey" PRIMARY KEY ("id")
);
