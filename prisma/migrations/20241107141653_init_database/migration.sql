-- CreateTable
CREATE TABLE `member` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `location_address` VARCHAR(500) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `nickname` VARCHAR(30) NOT NULL,
    `gender` INTEGER NOT NULL,
    `birth` VARCHAR(10) NOT NULL,
    `points` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` INTEGER NOT NULL DEFAULT 1,
    `inactive_at` TIMESTAMP(6) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_kind` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `kind` VARCHAR(10) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_food_kind` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `member_id` BIGINT NOT NULL,
    `food_kind_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` INTEGER NOT NULL DEFAULT 1,

    INDEX `food_kind_id`(`food_kind_id`),
    INDEX `member_id`(`member_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_food_kind` ADD CONSTRAINT `member_food_kind_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_food_kind` ADD CONSTRAINT `member_food_kind_food_kind_id_fkey` FOREIGN KEY (`food_kind_id`) REFERENCES `food_kind`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
