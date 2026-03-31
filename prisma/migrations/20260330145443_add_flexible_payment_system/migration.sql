-- CreateTable
CREATE TABLE "companion_rate_configs" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "companionSharePct" DOUBLE PRECISION NOT NULL,
    "platformSharePct" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "setBy" TEXT NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "notificationNote" TEXT,
    "previousRate" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companion_rate_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city_rate_configs" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "companionSharePct" DOUBLE PRECISION NOT NULL DEFAULT 80.0,
    "platformSharePct" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "reason" TEXT,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_rate_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_rate_configs" (
    "id" TEXT NOT NULL,
    "companionSharePct" DOUBLE PRECISION NOT NULL DEFAULT 80.0,
    "platformSharePct" DOUBLE PRECISION NOT NULL DEFAULT 20.0,
    "reason" TEXT NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "announcedAt" TIMESTAMP(3),
    "announcedBy" TEXT NOT NULL,
    "noticeGivenDays" INTEGER NOT NULL DEFAULT 60,
    "previousRate" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_rate_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonus_events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetCity" TEXT,
    "targetGender" TEXT,
    "targetTrustLevel" TEXT,
    "targetCompanionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "executedBy" TEXT,
    "totalCompanions" INTEGER,
    "totalAmount" INTEGER,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bonus_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonus_credits" (
    "id" TEXT NOT NULL,
    "bonusEventId" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREDITED',
    "creditedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "withdrawalId" TEXT,

    CONSTRAINT "bonus_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_warnings" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionTaken" TEXT,
    "previousTrustLevel" TEXT,
    "newTrustLevel" TEXT,
    "previousRate" DOUBLE PRECISION,
    "newRate" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolutionNote" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_warnings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companion_rate_configs_providerProfileId_key" ON "companion_rate_configs"("providerProfileId");

-- CreateIndex
CREATE INDEX "companion_rate_configs_providerProfileId_idx" ON "companion_rate_configs"("providerProfileId");

-- CreateIndex
CREATE INDEX "companion_rate_configs_isActive_idx" ON "companion_rate_configs"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "city_rate_configs_cityId_key" ON "city_rate_configs"("cityId");

-- CreateIndex
CREATE INDEX "city_rate_configs_cityId_idx" ON "city_rate_configs"("cityId");

-- CreateIndex
CREATE INDEX "platform_rate_configs_isActive_idx" ON "platform_rate_configs"("isActive");

-- CreateIndex
CREATE INDEX "platform_rate_configs_effectiveFrom_idx" ON "platform_rate_configs"("effectiveFrom");

-- CreateIndex
CREATE INDEX "bonus_events_status_idx" ON "bonus_events"("status");

-- CreateIndex
CREATE INDEX "bonus_events_scheduledFor_idx" ON "bonus_events"("scheduledFor");

-- CreateIndex
CREATE INDEX "bonus_credits_providerProfileId_idx" ON "bonus_credits"("providerProfileId");

-- CreateIndex
CREATE INDEX "bonus_credits_bonusEventId_idx" ON "bonus_credits"("bonusEventId");

-- CreateIndex
CREATE INDEX "bonus_credits_status_idx" ON "bonus_credits"("status");

-- CreateIndex
CREATE INDEX "performance_warnings_providerProfileId_idx" ON "performance_warnings"("providerProfileId");

-- CreateIndex
CREATE INDEX "performance_warnings_level_idx" ON "performance_warnings"("level");

-- CreateIndex
CREATE INDEX "performance_warnings_issuedAt_idx" ON "performance_warnings"("issuedAt");

-- AddForeignKey
ALTER TABLE "companion_rate_configs" ADD CONSTRAINT "companion_rate_configs_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_credits" ADD CONSTRAINT "bonus_credits_bonusEventId_fkey" FOREIGN KEY ("bonusEventId") REFERENCES "bonus_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_credits" ADD CONSTRAINT "bonus_credits_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_warnings" ADD CONSTRAINT "performance_warnings_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
