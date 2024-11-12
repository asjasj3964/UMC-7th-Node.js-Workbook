/*
  Warnings:

  - You are about to alter the column `body` on the `alarm_new_mission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `body` on the `alarm_review_request` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `content` on the `inquiry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `introduction` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `address` on the `region` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `content` on the `reply` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `introduction` on the `restaurant` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.
  - You are about to alter the column `content` on the `review` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `alarm_new_mission` MODIFY `body` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `alarm_review_request` MODIFY `body` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `inquiry` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `mission` MODIFY `introduction` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `region` MODIFY `address` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `reply` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `restaurant` MODIFY `introduction` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `review` MODIFY `content` VARCHAR(191) NOT NULL;
