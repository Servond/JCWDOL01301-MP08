-- DropIndex
DROP INDEX `User_claimedCodeID_key` ON `user`;

-- AlterTable
ALTER TABLE `voucher` MODIFY `endAt` DATETIME(3) NOT NULL DEFAULT (NOW() + '90 days');
