-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "advanceCancellations" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "currentStatus" TEXT,
ADD COLUMN     "noShowCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "occupationCurrent" TEXT,
ADD COLUMN     "occupationPast" TEXT,
ADD COLUMN     "reliabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
ADD COLUMN     "selfArrangedCovers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shortNoticeCancels" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "studyField" TEXT;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "isUrgent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "urgentFeeApplied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "urgentFeePercent" INTEGER;

-- CreateTable
CREATE TABLE "session_covers" (
    "id" TEXT NOT NULL,
    "originalSessionId" TEXT NOT NULL,
    "coverCompanionId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "arrangedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "familyNotifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_covers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "session_covers_originalSessionId_idx" ON "session_covers"("originalSessionId");

-- CreateIndex
CREATE INDEX "session_covers_coverCompanionId_idx" ON "session_covers"("coverCompanionId");

-- CreateIndex
CREATE INDEX "session_covers_status_idx" ON "session_covers"("status");
