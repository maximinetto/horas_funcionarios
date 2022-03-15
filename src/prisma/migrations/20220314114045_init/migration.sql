-- CreateTable
CREATE TABLE `officials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `record_number` INTEGER NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `position` VARCHAR(255) NOT NULL,
    `contract` ENUM('PERMANENT', 'TEMPORARY') NOT NULL,
    `type` ENUM('TEACHER', 'NOT_TEACHER') NOT NULL,
    `date_of_entry` DATE NOT NULL,
    `charge_number` INTEGER NOT NULL,

    UNIQUE INDEX `officials_record_number_key`(`record_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_balance_tas` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `year_balance` INTEGER NOT NULL,
    `working` INTEGER NOT NULL,
    `non_working` INTEGER NOT NULL,
    `simple` INTEGER NOT NULL,
    `official_id` INTEGER NOT NULL,

    UNIQUE INDEX `hourly_balance_tas_official_id_key`(`official_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_balance_teacher` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `year_balance` INTEGER NOT NULL,
    `balance` INTEGER NOT NULL,
    `official_id` INTEGER NOT NULL,

    UNIQUE INDEX `hourly_balance_teacher_official_id_key`(`official_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculation` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` ENUM('JANUARY', 'FEBUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTUBER', 'NOVEMBER', 'DECEMBER') NOT NULL,
    `official_id` INTEGER NOT NULL,
    `observations` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculation_tas` (
    `id` VARCHAR(191) NOT NULL,
    `surplus_business` INTEGER NOT NULL,
    `surplus_non_working` INTEGER NOT NULL,
    `surplus_simple` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL,
    `working_overtime` INTEGER NOT NULL,
    `working_night_overtime` INTEGER NOT NULL,
    `non_working_overtime` INTEGER NOT NULL,
    `non_working_night_overtime` INTEGER NOT NULL,
    `compensated_night_overtime` INTEGER NOT NULL,
    `calculation_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `calculation_tas_calculation_id_key`(`calculation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculation_teacher` (
    `id` VARCHAR(191) NOT NULL,
    `surplus` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL,
    `calculation_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `calculation_teacher_calculation_id_key`(`calculation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hourly_balance_tas` ADD CONSTRAINT `hourly_balance_tas_official_id_fkey` FOREIGN KEY (`official_id`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hourly_balance_teacher` ADD CONSTRAINT `hourly_balance_teacher_official_id_fkey` FOREIGN KEY (`official_id`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculation` ADD CONSTRAINT `calculation_official_id_fkey` FOREIGN KEY (`official_id`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculation_tas` ADD CONSTRAINT `calculation_tas_calculation_id_fkey` FOREIGN KEY (`calculation_id`) REFERENCES `calculation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculation_teacher` ADD CONSTRAINT `calculation_teacher_calculation_id_fkey` FOREIGN KEY (`calculation_id`) REFERENCES `calculation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
