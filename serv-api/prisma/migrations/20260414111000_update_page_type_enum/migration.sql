-- AlterEnum
-- Replace old PageType enum with new values
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'internet';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'fiz';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'teh';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'yur';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'data';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'iptv';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'equipments';
ALTER TYPE "PageType" ADD VALUE IF NOT EXISTS 'other';
