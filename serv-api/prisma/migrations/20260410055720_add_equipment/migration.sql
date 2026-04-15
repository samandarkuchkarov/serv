-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "more_btn_uz" TEXT NOT NULL,
    "more_btn_ru" TEXT NOT NULL,
    "info_uz" TEXT NOT NULL,
    "info_ru" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "description_uz" TEXT,
    "description_ru" TEXT,
    "seo_uz" TEXT,
    "seo_ru" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainChar" (
    "id" TEXT NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "equipment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MainChar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MainChar" ADD CONSTRAINT "MainChar_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
