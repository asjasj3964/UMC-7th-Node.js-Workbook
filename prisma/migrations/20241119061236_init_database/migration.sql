/*
  Warnings:

  - You are about to alter the column `birth` on the `member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Date`.
  - You are about to alter the column `points` on the `mission` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `member` MODIFY `birth` DATE NOT NULL,
    MODIFY `points` BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `mission` MODIFY `deadline` DATETIME(3) NOT NULL,
    MODIFY `points` INTEGER NOT NULL;
