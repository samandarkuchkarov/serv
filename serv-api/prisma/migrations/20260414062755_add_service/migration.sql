-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "descr_uz" TEXT NOT NULL,
    "descr_ru" TEXT NOT NULL,
    "btn_name_uz" TEXT NOT NULL,
    "btn_name_ru" TEXT NOT NULL,
    "btn_link" TEXT NOT NULL,
    "freebtn_uz" TEXT NOT NULL,
    "freebtn_ru" TEXT NOT NULL,
    "more_link" TEXT NOT NULL,
    "morename_uz" TEXT NOT NULL,
    "morename_ru" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
