-- CreateEnum
CREATE TYPE "CityStatus" AS ENUM ('ACTIVE', 'COMING_SOON', 'INACTIVE');

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "status" "CityStatus" NOT NULL DEFAULT 'COMING_SOON',
    "isPhase1" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_waitlist" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "city_waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_notifications" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_slug_key" ON "cities"("slug");

-- CreateIndex
CREATE INDEX "cities_status_idx" ON "cities"("status");

-- CreateIndex
CREATE INDEX "cities_isPhase1_idx" ON "cities"("isPhase1");

-- CreateIndex
CREATE INDEX "city_waitlist_cityId_idx" ON "city_waitlist"("cityId");

-- CreateIndex
CREATE INDEX "city_waitlist_type_idx" ON "city_waitlist"("type");

-- CreateIndex
CREATE INDEX "request_notifications_requestId_idx" ON "request_notifications"("requestId");

-- CreateIndex
CREATE INDEX "request_notifications_providerProfileId_idx" ON "request_notifications"("providerProfileId");

-- CreateIndex
CREATE INDEX "request_notifications_status_idx" ON "request_notifications"("status");

-- CreateIndex
CREATE INDEX "request_notifications_expiresAt_idx" ON "request_notifications"("expiresAt");

-- AddForeignKey
ALTER TABLE "request_notifications" ADD CONSTRAINT "request_notifications_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
