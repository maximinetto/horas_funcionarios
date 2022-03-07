/*
  Warnings:

  - A unique constraint covering the columns `[recordNumber]` on the table `officials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `officials_recordNumber_key` ON `officials`(`recordNumber`);
