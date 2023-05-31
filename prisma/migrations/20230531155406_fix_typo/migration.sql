/*
  Warnings:

  - You are about to drop the column `img` on the `Success` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Success" DROP COLUMN "img",
ADD COLUMN     "image" TEXT;
