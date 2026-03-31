-- CreateEnum
CREATE TYPE "AppLanguage" AS ENUM ('EN', 'GU');

-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "preferredLanguage" "AppLanguage" NOT NULL DEFAULT 'EN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "preferredLanguage" "AppLanguage" NOT NULL DEFAULT 'EN';
