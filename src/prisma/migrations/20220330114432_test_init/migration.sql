/*
  Warnings:

  - The values [OCTUBER] on the enum `calculation_month` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `calculation` MODIFY `month` ENUM('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER') NOT NULL;
