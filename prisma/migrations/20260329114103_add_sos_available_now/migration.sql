-- AlterTable
ALTER TABLE "provider_profiles" ADD COLUMN     "availableNow" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availableNowSince" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "sos_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "phone" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Ahmedabad',
    "status" TEXT NOT NULL DEFAULT 'SEARCHING',
    "assignedCompanionId" TEXT,
    "companionNotifiedAt" TIMESTAMP(3),
    "adminAlertedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sos_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sos_requests_status_idx" ON "sos_requests"("status");

-- CreateIndex
CREATE INDEX "sos_requests_city_idx" ON "sos_requests"("city");

-- CreateIndex
CREATE INDEX "sos_requests_phone_idx" ON "sos_requests"("phone");
