/*
  Warnings:

  - The `status` column on the `earnings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `accountName` on the `withdrawals` table. All the data in the column will be lost.
  - You are about to drop the column `bankAccount` on the `withdrawals` table. All the data in the column will be lost.
  - You are about to drop the column `ifscCode` on the `withdrawals` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `withdrawals` table. All the data in the column will be lost.
  - Added the required column `bankAccountId` to the `withdrawals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EarningStatus" AS ENUM ('PENDING', 'RELEASED', 'PROCESSING', 'PAID', 'HELD', 'CANCELLED', 'COMPENSATED');

-- CreateEnum
CREATE TYPE "CancellationWindow" AS ENUM ('BEFORE_PAYMENT', 'HOURS_48_PLUS', 'HOURS_24_TO_48', 'HOURS_UNDER_24', 'SAME_DAY', 'POST_SESSION');

-- CreateEnum
CREATE TYPE "CancelledBy" AS ENUM ('RECEIVER', 'COMPANION', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED_VALID', 'RESOLVED_REFUND', 'RESOLVED_PARTIAL', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DisputeRaisedBy" AS ENUM ('RECEIVER', 'COMPANION', 'ADMIN');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PARTIALLY_REFUNDED';

-- AlterEnum
ALTER TYPE "WithdrawalStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "earnings" ADD COLUMN     "earningType" TEXT NOT NULL DEFAULT 'SESSION',
ADD COLUMN     "heldAt" TIMESTAMP(3),
ADD COLUMN     "heldBy" TEXT,
ADD COLUMN     "heldReason" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "processingAt" TIMESTAMP(3),
ADD COLUMN     "transactionRef" TEXT,
ADD COLUMN     "withdrawalId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "EarningStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "partialRazorpayRefundId" TEXT,
ADD COLUMN     "partialRefundAmount" INTEGER,
ADD COLUMN     "partialRefundReason" TEXT,
ADD COLUMN     "partialRefundedAt" TIMESTAMP(3),
ADD COLUMN     "razorpayRefundId" TEXT;

-- AlterTable
ALTER TABLE "withdrawals" DROP COLUMN "accountName",
DROP COLUMN "bankAccount",
DROP COLUMN "ifscCode",
DROP COLUMN "processedAt",
ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "bankAccountId" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "earningIds" TEXT[],
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "processedBy" TEXT,
ADD COLUMN     "processingAt" TIMESTAMP(3),
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountNumberLast4" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'SAVINGS',
    "upiId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cancellation_records" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "paymentId" TEXT,
    "cancelledBy" "CancelledBy" NOT NULL,
    "cancelReason" TEXT,
    "cancelReasonCategory" TEXT,
    "sessionScheduledAt" TIMESTAMP(3) NOT NULL,
    "cancelledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hoursBeforeSession" DOUBLE PRECISION NOT NULL,
    "window" "CancellationWindow" NOT NULL,
    "originalAmount" INTEGER NOT NULL,
    "refundAmount" INTEGER NOT NULL,
    "companionComp" INTEGER NOT NULL,
    "platformRetained" INTEGER NOT NULL,
    "refundStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "razorpayRefundId" TEXT,
    "refundProcessedAt" TIMESTAMP(3),
    "compStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "compPaidAt" TIMESTAMP(3),
    "adminOverride" BOOLEAN NOT NULL DEFAULT false,
    "adminNote" TEXT,
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cancellation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "paymentId" TEXT,
    "raisedById" TEXT NOT NULL,
    "raisedAgainstId" TEXT,
    "raisedBy" "DisputeRaisedBy" NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "evidenceUrls" TEXT[],
    "amountHeld" INTEGER,
    "heldAt" TIMESTAMP(3),
    "resolution" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "refundAmount" INTEGER,
    "companionPenalty" INTEGER,
    "platformAbsorbed" INTEGER,
    "adminNotes" TEXT,
    "escalatedAt" TIMESTAMP(3),
    "escalatedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_revenue" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "paymentId" TEXT,
    "sourceType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_audit_log" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "previousValue" JSONB,
    "newValue" JSONB,
    "actorId" TEXT,
    "actorType" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companion_consents" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "policyVersion" TEXT NOT NULL DEFAULT '1.0',
    "agreedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "companion_consents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_providerProfileId_key" ON "bank_accounts"("providerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_records_sessionId_key" ON "cancellation_records"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "cancellation_records_paymentId_key" ON "cancellation_records"("paymentId");

-- CreateIndex
CREATE INDEX "cancellation_records_sessionId_idx" ON "cancellation_records"("sessionId");

-- CreateIndex
CREATE INDEX "cancellation_records_cancelledBy_idx" ON "cancellation_records"("cancelledBy");

-- CreateIndex
CREATE INDEX "cancellation_records_window_idx" ON "cancellation_records"("window");

-- CreateIndex
CREATE UNIQUE INDEX "disputes_sessionId_key" ON "disputes"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "disputes_paymentId_key" ON "disputes"("paymentId");

-- CreateIndex
CREATE INDEX "disputes_status_idx" ON "disputes"("status");

-- CreateIndex
CREATE INDEX "disputes_severity_idx" ON "disputes"("severity");

-- CreateIndex
CREATE INDEX "disputes_raisedById_idx" ON "disputes"("raisedById");

-- CreateIndex
CREATE INDEX "disputes_createdAt_idx" ON "disputes"("createdAt");

-- CreateIndex
CREATE INDEX "platform_revenue_sourceType_idx" ON "platform_revenue"("sourceType");

-- CreateIndex
CREATE INDEX "platform_revenue_createdAt_idx" ON "platform_revenue"("createdAt");

-- CreateIndex
CREATE INDEX "financial_audit_log_entityType_entityId_idx" ON "financial_audit_log"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "financial_audit_log_createdAt_idx" ON "financial_audit_log"("createdAt");

-- CreateIndex
CREATE INDEX "companion_consents_providerProfileId_idx" ON "companion_consents"("providerProfileId");

-- CreateIndex
CREATE INDEX "earnings_status_idx" ON "earnings"("status");

-- CreateIndex
CREATE INDEX "earnings_releasedAt_idx" ON "earnings"("releasedAt");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "withdrawals_requestedAt_idx" ON "withdrawals"("requestedAt");

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cancellation_records" ADD CONSTRAINT "cancellation_records_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
