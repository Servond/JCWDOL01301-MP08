/*
  Warnings:

  - Added the required column `banner` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `banner` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `voucher` MODIFY `endAt` DATETIME(3) NOT NULL DEFAULT (NOW() + '90 days');
