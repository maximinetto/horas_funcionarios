-- CreateTable
CREATE TABLE `officials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordNumber` INTEGER NOT NULL,
    `firstName` VARCHAR(255) NOT NULL,
    `lastName` VARCHAR(255) NOT NULL,
    `contract` ENUM('PERMANENT', 'TEMPORARY') NOT NULL,
    `type` ENUM('TEACHER', 'NOT_TEACHER') NOT NULL,
    `dateOfEntry` DATE NOT NULL,
    `chargeNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_balance_tas` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `working` DECIMAL(65, 30) NOT NULL,
    `nonWorking` DECIMAL(65, 30) NOT NULL,
    `simple` DECIMAL(65, 30) NOT NULL,
    `officialId` INTEGER NOT NULL,

    UNIQUE INDEX `hourly_balance_tas_officialId_key`(`officialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_balance_teacher` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `balance` DECIMAL(65, 30) NOT NULL,
    `officialId` INTEGER NOT NULL,

    UNIQUE INDEX `hourly_balance_teacher_officialId_key`(`officialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalculationTAS` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` ENUM('JANUARY', 'FEBUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER') NOT NULL,
    `surplusBusiness` DECIMAL(65, 30) NOT NULL,
    `surplusNonWorking` DECIMAL(65, 30) NOT NULL,
    `surplusSimple` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `workingOvertime` DECIMAL(65, 30) NOT NULL,
    `workingNightOvertime` DECIMAL(65, 30) NOT NULL,
    `nonWorkingOvertime` DECIMAL(65, 30) NOT NULL,
    `nonWorkingNightOvertime` DECIMAL(65, 30) NOT NULL,
    `compensatedNightOvertime` DECIMAL(65, 30) NOT NULL,
    `observations` TEXT NULL,
    `officialId` INTEGER NOT NULL,

    UNIQUE INDEX `CalculationTAS_officialId_key`(`officialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CalculationTeacher` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` ENUM('JANUARY', 'FEBUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER') NOT NULL,
    `surplus` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `observations` TEXT NULL,
    `officialId` INTEGER NOT NULL,

    UNIQUE INDEX `CalculationTeacher_officialId_key`(`officialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hourly_balance_tas` ADD CONSTRAINT `hourly_balance_tas_officialId_fkey` FOREIGN KEY (`officialId`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hourly_balance_teacher` ADD CONSTRAINT `hourly_balance_teacher_officialId_fkey` FOREIGN KEY (`officialId`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalculationTAS` ADD CONSTRAINT `CalculationTAS_officialId_fkey` FOREIGN KEY (`officialId`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CalculationTeacher` ADD CONSTRAINT `CalculationTeacher_officialId_fkey` FOREIGN KEY (`officialId`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
