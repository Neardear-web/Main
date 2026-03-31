/*
  Warnings:

  - The `gender` column on the `provider_profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "GenderPreference" AS ENUM ('FEMALE', 'MALE', 'NO_PREFERENCE');

-- AlterTable
ALTER TABLE "elder_profiles" ADD COLUMN     "genderPreference" "GenderPreference" NOT NULL DEFAULT 'NO_PREFERENCE';

-- AlterTable
ALTER TABLE "provider_profiles" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "genderPreference" "GenderPreference" NOT NULL DEFAULT 'NO_PREFERENCE';
