/*
  Warnings:

  - Added the required column `type` to the `Success` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Success" ADD COLUMN     "type" TEXT NOT NULL;
