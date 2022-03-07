/*
  Warnings:

  - Added the required column `position` to the `officials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `officials` ADD COLUMN `position` VARCHAR(255) NOT NULL;
