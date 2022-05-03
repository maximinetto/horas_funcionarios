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
CREATE TABLE `hourly_balance` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `actual_balance_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `hourly_balance_year_actual_balance_id_key`(`year`, `actual_balance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_balance_tas` (
    `id` VARCHAR(191) NOT NULL,
    `working` BIGINT NOT NULL,
    `non_working` BIGINT NOT NULL,
    `simple` BIGINT NOT NULL,
    `hourly_balance_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `hourly_balance_tas_hourly_balance_id_key`(`hourly_balance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hourly_balance_teacher` (
    `id` VARCHAR(191) NOT NULL,
    `balance` BIGINT NOT NULL,
    `hourly_balance_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `hourly_balance_teacher_hourly_balance_id_key`(`hourly_balance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actual_balance` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `total` BIGINT NOT NULL,
    `official_id` INTEGER NOT NULL,

    UNIQUE INDEX `actual_balance_year_official_id_key`(`year`, `official_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculation` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `month` ENUM('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER') NOT NULL,
    `observations` TEXT NULL,
    `actual_balance_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `calculation_year_month_actual_balance_id_key`(`year`, `month`, `actual_balance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculation_tas` (
    `id` VARCHAR(191) NOT NULL,
    `surplus_business` BIGINT NOT NULL,
    `surplus_non_working` BIGINT NOT NULL,
    `surplus_simple` BIGINT NOT NULL,
    `discount` BIGINT NOT NULL,
    `working_overtime` BIGINT NOT NULL,
    `working_night_overtime` BIGINT NOT NULL,
    `non_working_overtime` BIGINT NOT NULL,
    `non_working_night_overtime` BIGINT NOT NULL,
    `compensated_night_overtime` BIGINT NOT NULL,
    `calculation_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `calculation_tas_calculation_id_key`(`calculation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculation_teacher` (
    `id` VARCHAR(191) NOT NULL,
    `surplus` BIGINT NOT NULL,
    `discount` BIGINT NOT NULL,
    `calculation_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `calculation_teacher_calculation_id_key`(`calculation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hourly_balance` ADD CONSTRAINT `hourly_balance_actual_balance_id_fkey` FOREIGN KEY (`actual_balance_id`) REFERENCES `actual_balance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hourly_balance_tas` ADD CONSTRAINT `hourly_balance_tas_hourly_balance_id_fkey` FOREIGN KEY (`hourly_balance_id`) REFERENCES `hourly_balance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hourly_balance_teacher` ADD CONSTRAINT `hourly_balance_teacher_hourly_balance_id_fkey` FOREIGN KEY (`hourly_balance_id`) REFERENCES `hourly_balance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `actual_balance` ADD CONSTRAINT `actual_balance_official_id_fkey` FOREIGN KEY (`official_id`) REFERENCES `officials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculation` ADD CONSTRAINT `calculation_actual_balance_id_fkey` FOREIGN KEY (`actual_balance_id`) REFERENCES `actual_balance`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculation_tas` ADD CONSTRAINT `calculation_tas_calculation_id_fkey` FOREIGN KEY (`calculation_id`) REFERENCES `calculation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculation_teacher` ADD CONSTRAINT `calculation_teacher_calculation_id_fkey` FOREIGN KEY (`calculation_id`) REFERENCES `calculation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
