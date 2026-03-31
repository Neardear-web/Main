-- CreateTable
CREATE TABLE "provider_status_changes" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "fromStatus" "AccountStatus" NOT NULL,
    "toStatus" "AccountStatus" NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "reason" TEXT,
    "scheduledReturnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_status_changes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "provider_status_changes_providerProfileId_idx" ON "provider_status_changes"("providerProfileId");

-- AddForeignKey
ALTER TABLE "provider_status_changes" ADD CONSTRAINT "provider_status_changes_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
