-- CreateTable
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "contact_phone" TEXT NOT NULL,
    "contact_name_ru" TEXT,
    "contact_name_uz" TEXT,
    "subtitle_ru" TEXT,
    "subtitle_uz" TEXT,
    "garant_ru" TEXT,
    "garant_uz" TEXT,
    "res_ru" TEXT,
    "res_uz" TEXT,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacancyCondition" (
    "id" TEXT NOT NULL,
    "condition_name_ru" TEXT NOT NULL,
    "condition_name_uz" TEXT,
    "vacancy_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VacancyCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VacancyRequirement" (
    "id" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "name_uz" TEXT,
    "vacancy_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VacancyRequirement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VacancyCondition" ADD CONSTRAINT "VacancyCondition_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VacancyRequirement" ADD CONSTRAINT "VacancyRequirement_vacancy_id_fkey" FOREIGN KEY ("vacancy_id") REFERENCES "Vacancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
