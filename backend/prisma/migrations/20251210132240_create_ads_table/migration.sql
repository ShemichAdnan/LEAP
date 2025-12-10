-- CreateTable
CREATE TABLE `ads` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `areas` JSON NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `pricePerHour` INTEGER NULL,
    `location` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `availableTimes` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ads` ADD CONSTRAINT `ads_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
