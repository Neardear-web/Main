-- CreateEnum
CREATE TYPE "SensitivityLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "service_categories" ADD COLUMN     "sensitivityLevel" "SensitivityLevel" NOT NULL DEFAULT 'LOW';
