-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('joy', 'beauty', 'other', 'education', 'style', 'food');

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "name_uz" TEXT,
    "name_ru" TEXT,
    "contact_location_ru" TEXT,
    "contact_location_uz" TEXT,
    "contact_phone" TEXT,
    "contact_site" TEXT,
    "facebook" TEXT,
    "grafik" TEXT,
    "images" TEXT[],
    "info_ru" TEXT,
    "info_uz" TEXT,
    "cordinates" TEXT,
    "logo" TEXT,
    "partner_card" TEXT,
    "promo_count" INTEGER,
    "promo_info_ru" TEXT,
    "promo_info_uz" TEXT,
    "telegram" TEXT,
    "type" "PartnerType" NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerCondition" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT,
    "name_ru" TEXT NOT NULL,
    "partner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerCondition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartnerCondition" ADD CONSTRAINT "PartnerCondition_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
