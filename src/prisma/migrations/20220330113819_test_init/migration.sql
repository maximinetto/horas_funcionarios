/*
  Warnings:

  - The values [FEBUARY] on the enum `calculation_month` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `calculation` MODIFY `month` ENUM('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER') NOT NULL;
