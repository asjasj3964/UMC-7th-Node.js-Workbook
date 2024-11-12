/*
  Warnings:

  - A unique constraint covering the columns `[member_id,mission_id]` on the table `member_mission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `member_mission_member_id_mission_id_key` ON `member_mission`(`member_id`, `mission_id`);
