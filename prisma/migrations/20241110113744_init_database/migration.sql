/*
  Warnings:

  - You are about to drop the `member_misson` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `member_misson` DROP FOREIGN KEY `member_misson_member_id_fkey`;

-- DropForeignKey
ALTER TABLE `member_misson` DROP FOREIGN KEY `member_misson_mission_id_fkey`;

-- DropTable
DROP TABLE `member_misson`;

-- CreateTable
CREATE TABLE `member_mission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `mission_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` INTEGER NOT NULL DEFAULT 1,

    INDEX `member_id`(`member_id`),
    INDEX `mission_id`(`mission_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_mission` ADD CONSTRAINT `member_mission_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_mission` ADD CONSTRAINT `member_mission_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
