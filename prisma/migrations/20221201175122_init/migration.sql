-- CreateTable
CREATE TABLE `carts` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `carts_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` VARCHAR(191) NOT NULL,
    `cartCode` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `status` ENUM('STARTED', 'PROCESSING', 'PENDING', 'APPROVED', 'REFUSED', 'REFUNDED', 'CHARGEBACK', 'ERROR') NOT NULL DEFAULT 'STARTED',
    `paymentType` ENUM('BILLET', 'CREDIT_CARD') NOT NULL,
    `installments` INTEGER NOT NULL,
    `total` DOUBLE NOT NULL,
    `transactionId` VARCHAR(191) NULL,
    `processorResponse` VARCHAR(191) NULL,
    `customerEmail` VARCHAR(191) NOT NULL,
    `customerName` VARCHAR(191) NOT NULL,
    `customerMobile` VARCHAR(191) NOT NULL,
    `customerDocument` VARCHAR(191) NOT NULL,
    `billingAddress` VARCHAR(191) NOT NULL,
    `billingNumber` VARCHAR(191) NOT NULL,
    `billingNeighborhood` VARCHAR(191) NOT NULL,
    `billingCity` VARCHAR(191) NOT NULL,
    `billingState` VARCHAR(191) NOT NULL,
    `billingZipCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Transaction_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
