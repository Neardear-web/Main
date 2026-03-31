-- CreateTable
CREATE TABLE "virtual_meetings" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "requestId" TEXT,
    "meetingType" TEXT NOT NULL,
    "hostUserId" TEXT NOT NULL,
    "guestUserId" TEXT NOT NULL,
    "meetLink" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "durationMinutes" INTEGER DEFAULT 30,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "virtual_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "virtual_meetings_sessionId_idx" ON "virtual_meetings"("sessionId");

-- CreateIndex
CREATE INDEX "virtual_meetings_requestId_idx" ON "virtual_meetings"("requestId");

-- CreateIndex
CREATE INDEX "virtual_meetings_hostUserId_idx" ON "virtual_meetings"("hostUserId");

-- CreateIndex
CREATE INDEX "virtual_meetings_status_idx" ON "virtual_meetings"("status");
