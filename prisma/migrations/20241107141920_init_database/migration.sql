/*
  Warnings:

  - You are about to alter the column `location_address` on the `member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `member` MODIFY `location_address` VARCHAR(191) NOT NULL;
