/*
  Warnings:

  - You are about to drop the column `name_ru` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `name_uz` on the `Partner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "name_ru",
DROP COLUMN "name_uz";
