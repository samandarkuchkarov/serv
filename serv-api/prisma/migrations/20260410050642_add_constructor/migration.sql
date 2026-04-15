-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('business', 'both', 'individual');

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructorItem" (
    "id" TEXT NOT NULL,
    "access_only_by_url" BOOLEAN NOT NULL DEFAULT false,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_ru" TEXT,
    "description_uz" TEXT,
    "short_text_ru" TEXT,
    "short_text_uz" TEXT,
    "seo_ru" TEXT,
    "seo_uz" TEXT,
    "image" TEXT,
    "image_uz" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "page" "PageType",
    "cities" TEXT[],
    "section_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConstructorItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConstructorItem" ADD CONSTRAINT "ConstructorItem_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;
