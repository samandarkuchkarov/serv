-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "subtitle_uz" TEXT NOT NULL,
    "subtitle_ru" TEXT NOT NULL,
    "btn_uz" TEXT NOT NULL,
    "btn_ru" TEXT NOT NULL,
    "btn_link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);
